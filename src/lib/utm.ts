/**
 * src/lib/utm.ts
 *
 * Captura a UTM de ENTRADA (first-touch) e repassa fielmente pro checkout Yampi.
 *
 * Contexto: as LPs (/original, /suplemento, /matilde, /ciencia) mandam o cliente
 * DIRETO pro pay.yampi.com.br, fora da loja Shopify. Logo, a atribuição do
 * tráfego de LP depende 100% do que montamos aqui — o YampiSnippet da Shopify
 * NÃO roda nesse caminho.
 *
 * Regras:
 *  - Se o anúncio trouxe utm_ na URL  -> repassa FIELMENTE (source/campaign/content/term do Meta).
 *  - Se não trouxe                    -> usa o fallback da LP (utm_source=lp-X etc.).
 *  - Posição do botão (hero/oferta...) vai em `cta_pos`, NUNCA em utm_content,
 *    pra não atropelar o criativo do anúncio.
 *  - FIRST-TOUCH: grava o bloco INTEIRO de uma vez e não sobrescreve por 30 dias
 *    (mesmo modelo do cookie da Shopify — evita "Frankenstein" de atribuição).
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

type UtmKey = (typeof UTM_KEYS)[number];
export type Utms = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "cdd_entry_utms";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

function readUrlUtms(search: string = window.location.search): Utms {
  const params = new URLSearchParams(search);
  const out: Utms = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
}

function readStored(): Utms | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { utms: Utms; ts: number };
    if (!parsed || !parsed.ts) return null;
    if (Date.now() - parsed.ts > MAX_AGE_MS) return null;
    return parsed.utms || null;
  } catch {
    return null;
  }
}

/**
 * Chame UMA vez quando a LP montar (useEffect com [] no fim).
 * Grava a UTM de entrada em first-touch atômico.
 */
export function captureEntryUtms(): void {
  try {
    const incoming = readUrlUtms();
    if (Object.keys(incoming).length === 0) return; // nada na URL
    if (readStored()) return; // já há entrada salva -> não sobrescreve (first-touch)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ utms: incoming, ts: Date.now() })
    );
  } catch {
    /* localStorage indisponível (aba privada etc.) — segue sem quebrar */
  }
}

/**
 * Monta a URL final do checkout, repassando a UTM de entrada.
 *
 * @param baseUrl   URL do produto na Yampi, já com ?promocode=...
 * @param fallback  UTMs usadas SÓ quando não há UTM de entrada (ex: lp-original).
 * @param ctaPos    Posição do botão clicado (hero/oferta/final...). Vai em cta_pos.
 */
export function buildCheckoutUrl(
  baseUrl: string,
  fallback: Utms,
  ctaPos?: string
): string {
  const url = new URL(baseUrl);

  // Prioridade: o que foi salvo na entrada; se vazio, tenta a URL atual; senão, fallback.
  const entry = readStored() ?? readUrlUtms();
  const utms = Object.keys(entry).length > 0 ? entry : fallback;

  UTM_KEYS.forEach((k) => {
    const v = utms[k];
    if (v) url.searchParams.set(k, v);
  });

  if (ctaPos) url.searchParams.set("cta_pos", ctaPos);

  return url.href;
}
