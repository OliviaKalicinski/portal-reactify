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
  email: string;
  name: string;
  firstQuizId: string;
  firstQuizResultKey: string;
  firstQuizResultLabel: string;
  /** Snapshot completo dos resultados (DragonProfile.results) */
  allResults?: Record<string, unknown>;
  /** URL pública da foto (do bucket dragon-photos), opcional */
  photoUrl?: string | null;
}

export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) {
    return { ok: false, error: "supabase-client-missing" };
  }

  try {
    const { error } = await supabase.from("dragon_leads").insert({
      email: payload.email.trim().toLowerCase(),
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
