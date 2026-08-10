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
 *  - Se o anúncio trouxe utm_ na URL  -> repassa FIELMENTE (source/campaign/term do Meta).
 *  - Se não trouxe                    -> usa o fallback da LP (utm_source=lp-X etc.).
 *  - Posição do botão (hero/oferta...) vai em `cta_pos`.
 *  - utm_content SEMPRE sai marcado com a LP: `lp-<slug>__<criativo>` (ver ensureLpPrefix).
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
 * Lê a UTM de entrada já guardada (first-touch), respeitando o MAX_AGE.
 * Exposto pro popup de captura de lead gravar a campanha junto do contato —
 * sem reimplementar a chave de storage nem a regra de expiração.
 */
export function getEntryUtms(): Utms | null {
  return readStored();
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
 * Garante que o `utm_content` carregue a marca da LP — sem atropelar o criativo.
 *
 * Padrão do SOP de UTM (Bruno, 05/08/26): `utm_content = lp-<slug>__<criativo>`.
 * O prefixo é fixo; o que vem depois de `__` é livre.
 *
 * POR QUE ISSO MORA AQUI, e não na mão de quem sobe a campanha:
 * medido em 05/08/26 sobre 612 pedidos de 2 meses — **6 tinham LP identificável (1%)**.
 * Um padrão que depende de alguém digitar certo em toda campanha rende a cobertura que
 * a gente já tem. O slug sai do `fallback.utm_source` da própria LP, então não há como
 * digitar errado.
 *
 * Regra:
 *  - `utm_content` já começa com `lp-` -> não toca (respeita quem fez certo)
 *  - veio outro valor                  -> prefixa, preservando o criativo depois do `__`
 *  - não veio nada                     -> `lp-<slug>__<cta_pos|direto>`
 */
function ensureLpPrefix(utms: Utms, lpSlug?: string, ctaPos?: string): Utms {
  if (!lpSlug || !lpSlug.startsWith("lp-")) return utms; // sem slug de LP, não inventa
  const atual = utms.utm_content?.trim();
  if (atual && atual.startsWith("lp-")) return utms; // já marcado
  const cauda = atual || ctaPos || "direto";
  return { ...utms, utm_content: `${lpSlug}__${cauda}` };
}

/**
 * Monta a URL final do checkout, repassando a UTM de entrada.
 *
 * @param baseUrl   URL do produto na Yampi, já com ?promocode=...
 * @param fallback  UTMs usadas SÓ quando não há UTM de entrada (ex: lp-original).
 *                  O `utm_source` daqui é também a fonte do slug da LP.
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
  const base = Object.keys(entry).length > 0 ? entry : fallback;

  // A marca da LP é estrutural: sai do fallback da própria página, não da mão de quem
  // montou o anúncio. O criativo do anúncio sobrevive depois do `__`.
  const utms = ensureLpPrefix(base, fallback.utm_source, ctaPos);

  UTM_KEYS.forEach((k) => {
    const v = utms[k];
    if (v) url.searchParams.set(k, v);
  });

  if (ctaPos) url.searchParams.set("cta_pos", ctaPos);

  return url.href;
}
