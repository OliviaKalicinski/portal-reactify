import { createClient } from "@supabase/supabase-js";
import { normalizePhoneDigits } from "./phone";
import { getEntryUtms } from "./utm";

/**
 * INSCRIÇÃO DO WEBINAR — Comida de Dragão × Cogumelos Pet, 08/09/2026.
 *
 * Grava no MESMO lugar que o popup das LPs: Supabase do dashboard
 * (dash-lets-fly), tabela `lp_leads`. Decisão da Olivia em 28/07/26 — uma
 * casa só pra captura, e a coluna `origem` diz quem capturou. Aqui a origem
 * é `webinar_mv_cogumelos`, então a lista do evento sai de um filtro.
 *
 * O QUE ESTA PÁGINA PEDE A MAIS que o popup, e por quê:
 *  · `email`   — opcional. Os avisos até 08/09 saem por WhatsApp (decisão de
 *                25/08: o e-mail do domínio está com SPF em hard fail pro
 *                Reportana e 1 de 3 chaves DKIM respondendo — 1.120 envios em
 *                6 meses e R$ 0). O e-mail entra como ativo pra quando o DNS
 *                for consertado, nunca como canal do lembrete deste evento.
 *  · `perfil`  — vet ou tutor. É o filtro que a captura da feira PSA não teve:
 *                dos 113 contatos da Pet South America não se sabe quem é
 *                veterinário, e a inscrição no webinar é onde eles se separam
 *                (ver `convite-whatsapp-base-mv.md`, lista B).
 *  · `crmv`    — só aparece pra quem marcou vet, e é opcional. Serve pra
 *                qualificar a lista de prescritor, não pra barrar inscrição.
 *  · `temas`   — o que a pessoa quer ver respondido. 🔴 Não é pesquisa de
 *                satisfação: é a PAUTA. A ordem dos assuntos no dia 08/09 sai
 *                da contagem destes votos (decisão da Olivia, 25/08). Por isso
 *                a migration deixou de ser opcional — sem a coluna `extra` a
 *                votação não existe.
 *
 * Os três vão em `email` (coluna própria) e `extra` (jsonb) — ver a migration
 * em `PROJETOS/Webinar MV - Cogumelos Pet (08-09-26)/migration-lp-leads.sql`.
 *
 * RLS: anon só faz INSERT, nunca SELECT. A chave é publishable.
 * Não-bloqueante: erro só loga e a pessoa vê a confirmação mesmo assim —
 * mesmo padrão do resto das LPs, UX antes da captura.
 */
const DASH_URL = "https://rbjvwdsfpalyypimfrkf.supabase.co";
const DASH_PUBLISHABLE_KEY = "sb_publishable_M9kG9XFt-z4SRrciu2G8iQ_F1_FeNro";

/** Identificador do evento — se houver um segundo webinar, muda aqui e a
 *  leitura continua separando os dois dentro da mesma origem. */
export const WEBINAR_SLUG = "webinar-mv-cogumelos-08-09-26";

const dashClient = createClient(DASH_URL, DASH_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type PerfilInscrito = "vet" | "tutor";

/** Temas que a pessoa marca na inscrição. A pauta do webinar sai da contagem
 *  destes votos — "os tópicos são selecionados pelo público" (Olivia, 25/08).
 *  Mexer aqui = mexer em `TEMAS` na página; as duas listas têm que casar. */
export type TemaWebinar =
  | "alergia"
  | "imunidade"
  | "idoso"
  | "digestao"
  | "tratamento"
  | "pele-pelo";

export async function submitWebinarLead(payload: {
  name: string;
  phone: string;
  email?: string;
  perfil: PerfilInscrito;
  crmv?: string;
  temas: TemaWebinar[];
}): Promise<{ ok: boolean; error?: string }> {
  const base = {
    nome: payload.name.trim(),
    // normalizePhoneDigits, não replace: a máscara antiga cortava no 11º
    // dígito e comia o final de quem digitava o +55 (9 leads perdidos na
    // lista da Mordida V2, 27/07). Ver lib/phone.ts.
    telefone: normalizePhoneDigits(payload.phone),
    // sem UTM na URL (link colado, DM, boca a boca) o registro ficaria órfão:
    // o fallback marca a página como origem, no mesmo padrão `lp-<slug>` que
    // as outras LPs usam. Ver `UTM — o manual da casa`.
    utm: getEntryUtms() ?? {
      utm_source: "lp-webinar",
      utm_medium: "direto",
      utm_campaign: "webinar-mv-cogumelos",
    },
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
  };

  try {
    const { error } = await dashClient.from("lp_leads").insert({
      ...base,
      origem: "webinar_mv_cogumelos",
      email: payload.email?.trim() || null,
      extra: {
        evento: WEBINAR_SLUG,
        perfil: payload.perfil,
        crmv: payload.perfil === "vet" ? payload.crmv?.trim() || null : null,
        temas: payload.temas,
      },
    });

    if (!error) return { ok: true };

    // ── REDE DE SEGURANÇA ────────────────────────────────────────────────
    // Se a migration (email + extra) ainda não rodou, o PostgREST rejeita o
    // insert INTEIRO — e a pessoa veria "vaga garantida" sem estar na lista,
    // porque a captura é não-bloqueante de propósito. Um inscrito perdido em
    // silêncio é o pior desfecho possível numa página de evento com data.
    //
    // Então na falta de coluna a gente regrava só o que a tabela já aceita, e
    // o perfil vai no sufixo da `origem` (texto livre). Perde-se o e-mail e o
    // CRMV; não se perde o inscrito. Assim que o SQL rodar, o caminho de cima
    // volta a valer sozinho — nada aqui precisa ser desfeito.
    const faltaColuna = /column|schema cache/i.test(error.message);
    if (!faltaColuna) {
      // eslint-disable-next-line no-console
      console.warn("[webinar-lead] insert failed:", error.message);
      return { ok: false, error: error.message };
    }

    // 🔴 No formato antigo os TEMAS VOTADOS se perdem — e eles são o insumo da
    // pauta, não um extra. Enquanto a migration não rodar, a página inscreve
    // gente mas não coleta a votação.
    // eslint-disable-next-line no-console
    console.warn(
      "[webinar-lead] migration pendente (" + error.message + ") — gravando no formato antigo. " +
        "PERDENDO e-mail, CRMV e os temas votados. Rodar PROJETOS/Webinar MV/migration-lp-leads.sql."
    );

    const { error: erroFallback } = await dashClient.from("lp_leads").insert({
      ...base,
      origem: `webinar_mv_cogumelos_${payload.perfil}`,
    });

    if (erroFallback) {
      // eslint-disable-next-line no-console
      console.warn("[webinar-lead] fallback também falhou:", erroFallback.message);
      return { ok: false, error: erroFallback.message };
    }
    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[webinar-lead] unexpected error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
