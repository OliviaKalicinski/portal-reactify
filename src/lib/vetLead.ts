import { createClient } from "@supabase/supabase-js";
import { normalizePhoneDigits } from "./phone";
import { getEntryUtms } from "./utm";

/**
 * CADASTRO DE VETERINÁRIO PARCEIRO — /veterinarios.
 *
 * Até 22/10/2026 o botão da página mandava o vet para o cadastro de CREATOR da
 * Inflowz, onde ele era avaliado pela régua de creator (conteúdo, alcance) e
 * reprovado (reunião com Carol e Eugenio, 24/09). Decisão da Olivia em 22/10:
 * o vet ganha porta própria — o cadastro cai no dash e vira um registro de
 * veterinário (`influencer_registry`, tipo_parceiro = 'veterinario').
 *
 * Grava em `lp_leads` (a mesma casa de captura das LPs e do webinar), com
 * origem `lp_veterinarios`. Do lado do dash, um gatilho transforma o lead em
 * cadastro de vet (migration do multi-form-insight). Os campos que a tabela de
 * leads não tem (CRMV, UF, cidade, atendimento, Instagram) vão em `extra`.
 *
 * RLS: anon só faz INSERT, nunca SELECT. A chave é publishable.
 * Não-bloqueante: erro só loga e a pessoa vê a confirmação mesmo assim — mesmo
 * padrão das outras LPs.
 */
const DASH_URL = "https://rbjvwdsfpalyypimfrkf.supabase.co";
const DASH_PUBLISHABLE_KEY = "sb_publishable_M9kG9XFt-z4SRrciu2G8iQ_F1_FeNro";

const dashClient = createClient(DASH_URL, DASH_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type AtendimentoVet = "clinica" | "domiciliar" | "hospital" | "exoticos" | "outro";

export async function submitVetLead(payload: {
  name: string;
  phone: string;
  email: string;
  crmv: string;
  uf: string;
  cidade: string;
  atendimento: AtendimentoVet[];
  instagram?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await dashClient.from("lp_leads").insert({
      nome: payload.name.trim(),
      telefone: normalizePhoneDigits(payload.phone),
      email: payload.email.trim().toLowerCase() || null,
      origem: "lp_veterinarios",
      // sem UTM na URL o registro ficaria órfão: o fallback marca a página como
      // origem, no padrão `lp-<slug>` das outras LPs (ver UTM — o manual da casa).
      utm: getEntryUtms() ?? {
        utm_source: "lp-veterinarios",
        utm_medium: "direto",
        utm_campaign: "vet-parceiro",
      },
      extra: {
        crmv: payload.crmv.trim().toUpperCase(),
        uf: payload.uf.trim().toUpperCase(),
        cidade: payload.cidade.trim(),
        atendimento: payload.atendimento,
        instagram: payload.instagram?.trim().replace(/^@/, "") || null,
      },
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.warn("[vet-lead] insert failed:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[vet-lead] unexpected error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
