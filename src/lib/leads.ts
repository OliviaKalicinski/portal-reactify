/* 28/09/2026 — os leads saíram do `dragon_leads` (Supabase do Lovable) para o
   `lp_leads` do dash-lets-fly, a tabela única de leads (decisão de 28/07). O que
   era coluna própria do dragon_leads vai em `extra`. Assinaturas mantidas: quem
   chama (Quizzes.tsx) não muda. */
import { dashClient as supabase } from "./lpLeads";
import { getEntryUtms } from "./utm";
import { normalizePhoneDigits } from "./phone";

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
    const { error } = await supabase.from("lp_leads").insert({
      nome: payload.name.trim(),
      telefone: normalizePhoneDigits(payload.phone),
      origem: source,
      utm: getEntryUtms(),
      extra: { label: payload.label ?? "Lista de espera" },
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
    const { error } = await supabase.from("lp_leads").insert({
      nome: payload.name.trim(),
      telefone: normalizePhoneDigits(payload.phone), // nacional, sem +55 (lib/phone)
      origem: `quiz_${payload.firstQuizId}`,
      utm: getEntryUtms(),
      extra: {
        resultado: payload.firstQuizResultKey,
        resultado_label: payload.firstQuizResultLabel,
        resultados: payload.allResults ?? null,
        foto_url: payload.photoUrl ?? null,
      },
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
