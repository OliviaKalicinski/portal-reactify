/**
 * src/lib/pixel.ts
 *
 * Eventos do pixel do Meta disparados PELA LP.
 *
 * POR QUE ISSO EXISTE (26/08/2026): o pixel `663655789493884` chega nas LPs
 * pelo GTM e dispara só `PageView`. Verificado ao vivo na /suplemento e na
 * /grub: o clique no CTA não chama `fbq` nenhuma vez. Consequência prática —
 *  · não dá pra montar público de retarget "viu o produto X" a não ser por
 *    regra de URL;
 *  · a campanha não tem sinal nenhum entre o PageView e o InitiateCheckout,
 *    que só acontece no OUTRO domínio (checkout Yampi).
 *
 * O que NÃO fazemos aqui: `InitiateCheckout`. O checkout da Yampi já dispara
 * esse evento no mesmo pixel (verificado em 25/08) — repetir aqui dobraria a
 * contagem. O clique no CTA sai como `AddToCart`, que é literalmente o que o
 * link faz: manda o produto pro carrinho.
 *
 * ⚠️ `fbq` é criado pelo snippet do GTM, que é assíncrono. Se o evento sair
 * antes disso ele se perde em silêncio — por isso o retry curto abaixo.
 */

type PixelParams = {
  content_name: string;
  /** SKU do produto na loja. Vira `content_ids` no Meta. */
  content_id: string;
  value: number;
  currency?: string;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const RETRY_MS = 400;
const MAX_TENTATIVAS = 12; // ~5s no total

function comFbq(fn: (fbq: NonNullable<Window["fbq"]>) => void, tentativa = 0) {
  if (typeof window === "undefined") return;
  const fbq = window.fbq;
  if (typeof fbq === "function") {
    try {
      fn(fbq);
    } catch {
      /* pixel nunca pode quebrar a página */
    }
    return;
  }
  if (tentativa >= MAX_TENTATIVAS) return;
  window.setTimeout(() => comFbq(fn, tentativa + 1), RETRY_MS);
}

const payload = (p: PixelParams) => ({
  content_name: p.content_name,
  content_ids: [p.content_id],
  content_type: "product",
  value: p.value,
  currency: p.currency ?? "BRL",
});

/** Chame uma vez quando a LP montar, junto do captureEntryUtms. */
export function trackViewContent(p: PixelParams) {
  comFbq((fbq) => fbq("track", "ViewContent", payload(p)));
}

/** Chame no clique do CTA — o link leva o produto pro carrinho da Yampi. */
export function trackAddToCart(p: PixelParams & { cta?: string }) {
  comFbq((fbq) =>
    fbq("track", "AddToCart", { ...payload(p), ...(p.cta ? { cta_pos: p.cta } : {}) })
  );
}

/* ── QUIZ E LISTAS: O MESMO AVISO EM TODAS AS FERRAMENTAS (29/09/2026) ─────
   Antes só a Meta sabia do funil do quiz; GA4 e TikTok (os dois pelo GTM
   GTM-NC7F2PNS) só viam a visita. Cada aviso agora sai em três lugares:
   · Meta: fbq (padrão Lead; o resto trackCustom)
   · GA4: gtag('event') na fila do dataLayer — o Google tag do GTM lê os
     comandos gtag dessa fila. O mesmo push com `event` deixa um gatilho
     pronto no GTM, se um dia alguém quiser tag própria.
   · TikTok: ttq.track (SubmitForm é o padrão de lead do TikTok)
   Nenhum deles pode quebrar a página: tudo em try/catch. */
type Dict = Record<string, unknown>;
declare global {
  interface Window {
    dataLayer?: unknown[];
    ttq?: { track: (ev: string, p?: Dict) => void };
  }
}
/* 🔴 send_to é obrigatório: o Google tag do GTM ignora gtag('event') sem
   destino (testado ao vivo em 29/09 — sem send_to o evento não saía). */
const GA4_ID = "G-YG2DYZSGBV";
function ga4(evento: string, params: Dict) {
  try {
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line prefer-rest-params
    (function gtag(..._a: unknown[]) { window.dataLayer!.push(arguments); })("event", evento, { ...params, send_to: GA4_ID });
    window.dataLayer.push({ event: evento, ...params });
  } catch { /* nunca quebra a página */ }
}
function tiktok(evento: string, params: Dict, tentativa = 0) {
  try {
    if (window.ttq?.track) { window.ttq.track(evento, params); return; }
  } catch { return; }
  if (tentativa < MAX_TENTATIVAS) window.setTimeout(() => tiktok(evento, params, tentativa + 1), RETRY_MS);
}

export function trackQuizIniciado(quiz: string) {
  comFbq((fbq) => fbq("trackCustom", "QuizIniciado", { quiz }));
  ga4("quiz_iniciado", { quiz });
  tiktok("ClickButton", { content_name: quiz, description: "quiz_iniciado" });
}
export function trackQuizConcluido(quiz: string, resultado: string) {
  comFbq((fbq) => fbq("trackCustom", "QuizConcluido", { quiz, resultado }));
  ga4("quiz_concluido", { quiz, resultado });
  tiktok("ViewContent", { content_name: quiz, content_category: resultado, description: "quiz_concluido" });
}
export function trackLead(quiz: string, resultado: string) {
  comFbq((fbq) => fbq("track", "Lead", { content_name: quiz, content_category: resultado }));
  ga4("generate_lead", { lead_source: quiz, resultado });
  tiktok("SubmitForm", { content_name: quiz, content_category: resultado });
}
/** Levou o retrato embora: `como` = "compartilhar" (share nativo concluído) ou
 *  "baixar". É o sinal de que o quiz está se espalhando (29/09). */
export function trackQuizCompartilhou(quiz: string, resultado: string, como: "compartilhar" | "baixar") {
  comFbq((fbq) => fbq("trackCustom", "QuizCompartilhou", { quiz, resultado, como }));
  ga4("share", { method: como, content_type: quiz, item_id: resultado });
  tiktok("ClickButton", { content_name: quiz, content_category: resultado, description: `quiz_${como}` });
}
