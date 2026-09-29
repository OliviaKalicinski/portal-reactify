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

/* ── QUIZ "QUE DRAGÃO MORA NA SUA CASA?" (28/09/2026) ─────────────────────
   O quiz é máquina de LEAD. Três sinais, na ordem do funil, pra dar (1) público
   de retarget de quem começou e não terminou e (2) campanha otimizada pra Lead.
   · QuizIniciado / QuizConcluido são customizados (trackCustom): não existem
     no padrão da Meta e não podem se confundir com compra.
   · Lead é o padrão — é o único que a campanha usa como otimização. */
export function trackQuizIniciado(quiz: string) {
  comFbq((fbq) => fbq("trackCustom", "QuizIniciado", { quiz }));
}
export function trackQuizConcluido(quiz: string, resultado: string) {
  comFbq((fbq) => fbq("trackCustom", "QuizConcluido", { quiz, resultado }));
}
export function trackLead(quiz: string, resultado: string) {
  comFbq((fbq) => fbq("track", "Lead", { content_name: quiz, content_category: resultado }));
}

/** Levou o retrato embora: `como` = "compartilhar" (share nativo concluído) ou
 *  "baixar". É o sinal de que o quiz está se espalhando (29/09). */
export function trackQuizCompartilhou(quiz: string, resultado: string, como: "compartilhar" | "baixar") {
  comFbq((fbq) => fbq("trackCustom", "QuizCompartilhou", { quiz, resultado, como }));
}
