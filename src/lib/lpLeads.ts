import { createClient } from "@supabase/supabase-js";
import { normalizePhoneDigits } from "./phone";
import { getEntryUtms } from "./utm";

/**
 * CAPTURA DAS LPs — popup de lead (nome + WhatsApp).
 *
 * Grava direto no Supabase do DASHBOARD (dash-lets-fly), tabela `lp_leads`.
 * Decisão da Olivia em 28/07/26: antes cada captura caía num banco diferente
 * (o popup da /mordida ia pro projeto "Landing Page", o quiz vai pro
 * `dragon_leads` do portal, e o dashboard é um terceiro). Resultado: a lista
 * dos 84 da Mordida chegou como CSV manual e nada fluía pro CRM sozinho.
 * Agora tudo cai num lugar só, e a coluna `origem` diz qual LP capturou.
 *
 * RLS: anon só faz INSERT, nunca SELECT. A chave é publishable.
 *
 * Não-bloqueante: erro só loga, a pessoa vê sucesso mesmo assim — UX antes da
 * captura, mesmo padrão do resto das LPs.
 */
const DASH_URL = "https://rbjvwdsfpalyypimfrkf.supabase.co";
const DASH_PUBLISHABLE_KEY = "sb_publishable_M9kG9XFt-z4SRrciu2G8iQ_F1_FeNro";

const dashClient = createClient(DASH_URL, DASH_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function submitLpLead(payload: {
  name: string;
  phone: string;
  /** slug da LP, ex.: "alergia" -> origem vira "popup_alergia" */
  slug: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await dashClient.from("lp_leads").insert({
      nome: payload.name.trim(),
      // normalizePhoneDigits, não replace: a máscara antiga cortava no 11º
      // dígito e comia o final de quem digitava o +55 (9 leads perdidos na
      // lista da Mordida V2, 27/07). Ver lib/phone.ts.
      telefone: normalizePhoneDigits(payload.phone),
      origem: `popup_${payload.slug}`,
      utm: getEntryUtms(),
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.warn("[lp-lead] insert failed:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[lp-lead] unexpected error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
