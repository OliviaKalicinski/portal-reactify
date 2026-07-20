import { supabase } from "./supabase";

/**
 * SUBMIT LEAD — envia o lead capturado no gate do quiz pra Supabase.
 *
 * Não-bloqueante: erros são logados mas não interrompem o fluxo.
 * O resultado do quiz aparece pra pessoa mesmo se a inserção falhar
 * (sem Supabase, sem rede, RLS errada, etc.) — UX vem antes da captura.
 *
 * Em caso de falha, o perfil ainda é salvo no localStorage (fluxo atual),
 * então a pessoa mantém o perfil dela. Olivia só perde o ping pra ela.
 */
export interface LeadPayload {
  /** Telefone só com dígitos: DDD + 9 (celular) + 8. Ex: 11912345678 */
  phone: string;
  name: string;
  firstQuizId: string;
  firstQuizResultKey: string;
  firstQuizResultLabel: string;
  /** Snapshot completo dos resultados (DragonProfile.results) */
  allResults?: Record<string, unknown>;
  /** URL pública da foto (do bucket dragon-photos), opcional */
  photoUrl?: string | null;
}

/**
 * SUBMIT PRÉ-LANÇAMENTO — captura de lista de espera (ex.: Drop da Mordida V2).
 *
 * Reusa a MESMA tabela `dragon_leads` (zero mudança de infra/RLS): anon já pode
 * INSERT ali. O que distingue esses leads é `source: "prelancamento_<slug>"` —
 * a Olivia filtra por source pra exportar a lista do drop.
 *
 * Mesma disciplina do submitLead: não-bloqueante, erro só loga, UX vem antes.
 */
export async function submitPrelaunch(payload: {
  name: string;
  phone: string;
  /** slug do drop, ex.: "mordida" -> source vira "prelancamento_mordida" */
  slug: string;
  label?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) {
    return { ok: false, error: "supabase-client-missing" };
  }

  const source = `prelancamento_${payload.slug}`;

  try {
    // Espelha a forma do insert que já funciona (mesmas colunas), trocando só
    // os campos de quiz por sentinelas — evita esbarrar em NOT NULL do schema.
    const { error } = await supabase.from("dragon_leads").insert({
      phone: payload.phone.replace(/\D/g, ""),
      name: payload.name.trim(),
      first_quiz_id: source,
      first_quiz_result_key: "lista-espera",
      first_quiz_result_label: payload.label ?? "Lista de espera",
      all_results: null,
      photo_url: null,
      source,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.warn("[prelaunch] insert failed:", error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[prelaunch] unexpected error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) {
    return { ok: false, error: "supabase-client-missing" };
  }

  try {
    const { error } = await supabase.from("dragon_leads").insert({
      phone: payload.phone.replace(/\D/g, ""), // só dígitos pro banco
      name: payload.name.trim(),
      first_quiz_id: payload.firstQuizId,
      first_quiz_result_key: payload.firstQuizResultKey,
      first_quiz_result_label: payload.firstQuizResultLabel,
      all_results: payload.allResults ?? null,
      photo_url: payload.photoUrl ?? null,
      source: "quiz_gate",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.warn("[leads] insert failed:", error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[leads] unexpected error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
