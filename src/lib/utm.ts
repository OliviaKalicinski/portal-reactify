/**
 * src/lib/utm.ts
 *
 * Captura a UTM de ENTRADA e repassa pro checkout Yampi — mas SÓ quando ela é
 * uma origem de verdade (anúncio, WhatsApp, e-mail, creator).
 *
 * Contexto: as LPs mandam o cliente DIRETO pro checkout `seguro`, fora da loja
 * Shopify. A atribuição do tráfego de LP depende 100% do que montamos aqui — o
 * YampiSnippet da Shopify NÃO roda nesse caminho.
 *
 * 🔴 POR QUE A REGRA MUDOU (15/09/26): o checkout guarda a UTM no cookie
 * `__ana_utm` em LAST-TOUCH CAMPO A CAMPO — cada link novo sobrescreve só as
 * chaves que carrega (testado ao vivo). Quem entrava por anúncio e voltava pela
 * LP sem UTM, ou pelo link da bio, perdia o crédito: a LP mandava o fallback
 * `lp-mordida / lp / lp-mordida-mordida` e o checkout trocava 4 campos, deixando
 * só o `utm_term` do anúncio como fóssil. 10 pedidos corrigidos à mão no dash.
 * Decisão da Olivia: "a bio não pode sobrescrever os anúncios".
 *
 * Regras:
 *  - Origem FORTE (anúncio, rptn, e-mail, creator) -> repassa FIELMENTE, com a marca
 *    da LP no utm_content (`lp-<slug>__<criativo>`, ver ensureLpPrefix).
 *  - Origem FRACA (sem UTM, bio/orgânico do Instagram, links internos `lp-*`) ->
 *    o botão vai ao checkout SEM nenhum utm_*. Assim a origem que o checkout já
 *    guardou continua intacta. Ver isOrigemFraca.
 *  - Exceção: clique do Google (gclid/gbraid/wbraid) sem UTM -> usa o fallback da
 *    página. As LPs /g/* recebem só Google Ads, que marca por gclid, não por UTM.
 *  - Posição do botão (hero/oferta...) vai em `cta_pos`.
 *  - FIRST-TOUCH entre origens fortes: grava o bloco INTEIRO e não sobrescreve por
 *    7 dias — a mesma janela da loja, decidida em 06/08/26. Origem fraca não é gravada
 *    e não bloqueia um anúncio que chegue depois.
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
// 7 dias: a mesma janela first-touch da loja (cookie `utmsTrack`, decisão de 06/08/26).
// Era 30 dias até 15/09/26.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Identificadores de clique das plataformas de anúncio (`fbclid`, `gclid`…).
 *
 * Tratados de propósito DIFERENTE das UTMs: **não entram no first-touch**.
 * Vale sempre o clique MAIS RECENTE — é ele que o Meta e o Google usam pra
 * ligar esta venda a este anúncio. Guardar em first-touch creditaria a compra
 * ao anúncio antigo, que é exatamente o defeito que isto veio consertar.
 *
 * POR QUE ISSO EXISTE (medido em 31/08/26): o `Purchase` chegava ao Meta com
 * `fbc` em só 57% — a LP repassava as UTMs pro checkout e deixava o `fbclid`
 * pra trás no salto `caverna` → `seguro`. Sem ele, o Meta não sabe de qual
 * anúncio veio a venda e preenche por modelagem; num ad set novo, sai zero.
 *
 * Vivem em sessionStorage (dura a sessão), não em localStorage.
 */
const CLICK_IDS = ["fbclid", "gclid", "ttclid", "gbraid", "wbraid"] as const;
type ClickIds = Partial<Record<(typeof CLICK_IDS)[number], string>>;

// Só o clique do Google identifica tráfego pago sozinho. O `fbclid` NÃO: o
// Instagram também o anexa em link orgânico (bio, stories).
const GOOGLE_CLICK_IDS = ["gclid", "gbraid", "wbraid"] as const;

const CLICK_STORAGE_KEY = "cdd_click_ids";

function readUrlClickIds(search: string = window.location.search): ClickIds {
  const params = new URLSearchParams(search);
  const out: ClickIds = {};
  CLICK_IDS.forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
}

function readStoredClickIds(): ClickIds {
  try {
    const raw = sessionStorage.getItem(CLICK_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ClickIds) : {};
  } catch {
    return {};
  }
}

/** Last-touch: sobrescreve sempre que chega um clique novo. */
function captureClickIds(): void {
  try {
    const incoming = readUrlClickIds();
    if (Object.keys(incoming).length === 0) return;
    sessionStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify(incoming));
  } catch {
    /* sessionStorage indisponível (aba privada etc.) — segue sem quebrar */
  }
}

function readUrlUtms(search: string = window.location.search): Utms {
  const params = new URLSearchParams(search);
  const out: Utms = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
}

const FONTES_ORGANICAS_INSTAGRAM = ["ig", "instagram", "l.instagram.com", "linktree", "linktr.ee"];
const MEIOS_ORGANICOS = ["bio", "social", "organico", "organic", "stories", "story", "referral", "link_in_bio"];
const MEIO_PAGO = /paid|cpc|ppc|ads/i;
const FONTES_COMERCIO = ["igshopping", "fbshopping", "facebook_shop", "instagram_shop"];

/**
 * Origem FRACA = não pode sobrescrever o que o checkout já guardou.
 *
 *  - sem `utm_source`                                   (link colado, DM, digitado, banner da home)
 *  - `utm_source` começando com `lp-`                   (link interno nosso)
 *  - meio orgânico: bio, social, stories, organico…     (ex.: `ig / social / link_in_bio`,
 *                                                        que o Instagram anexa sozinho à bio)
 *  - `utm_content=link_in_bio` ou `utm_campaign=organico`
 *  - fonte do Instagram sem meio pago                   (anúncio de Instagram vem `paid_social`)
 *
 * Tudo que tem meio pago (`paid_social`, `cpc`…) é FORTE, mesmo com fonte `ig`.
 * WhatsApp (`rptn`), e-mail e cupom de creator são FORTES.
 */
export function isOrigemFraca(utms: Utms | null | undefined): boolean {
  if (!utms) return true;
  const source = utms.utm_source?.trim().toLowerCase() ?? "";
  const medium = utms.utm_medium?.trim().toLowerCase() ?? "";
  const content = utms.utm_content?.trim().toLowerCase() ?? "";
  const campaign = utms.utm_campaign?.trim().toLowerCase() ?? "";

  if (!source) return true;
  if (source.startsWith("lp-")) return true;
  // Loja/catálogo do Instagram e do Facebook (`IGShopping / Social`) é clique de compra no
  // produto, não bio: FORTE. Sem esta linha o meio `Social` a jogava pra fraca e a etiqueta
  // sumia do pedido (2 pedidos em 16/08–15/09).
  if (FONTES_COMERCIO.includes(source)) return false;
  if (MEIO_PAGO.test(medium)) return false;
  if (MEIOS_ORGANICOS.includes(medium)) return true;
  if (content === "link_in_bio" || campaign === "organico") return true;
  if (FONTES_ORGANICAS_INSTAGRAM.includes(source)) return true;
  return false;
}

/**
 * Cookie `cdd_origem` — a origem FORTE compartilhada entre o caverna (LPs) e a loja.
 *
 * POR QUE EXISTE (15/09/26): quem entrava por anúncio numa LP e depois montava o
 * carrinho na LOJA chegava ao checkout sem UTM — o cookie da loja (`utmsTrack`) é
 * host-only do `www` e não sabia do anúncio. Medido: 8 de 43 pedidos feitos até 2h
 * depois de um carrinho com UTM perderam a origem (caso Rodrigo, 14/09). O mesmo cookie,
 * no domínio `.comidadedragao.com.br`, é lido e escrito pelo YampiSnippet do tema.
 * Formato: query string (`utm_source=…&utm_medium=…`), igual ao `utmsTrack`.
 */
const SHARED_COOKIE = "cdd_origem";

function sharedCookieDomain(): string {
  const host = window.location.hostname;
  return host.endsWith("comidadedragao.com.br") ? "; domain=.comidadedragao.com.br" : "";
}

function readSharedCookie(): Utms | null {
  try {
    const par = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${SHARED_COOKIE}=`));
    if (!par) return null;
    const sp = new URLSearchParams(par.slice(SHARED_COOKIE.length + 1));
    const out: Utms = {};
    UTM_KEYS.forEach((k) => {
      const v = sp.get(k);
      if (v) out[k] = v;
    });
    if (Object.keys(out).length === 0 || isOrigemFraca(out)) return null;
    return out;
  } catch {
    return null;
  }
}

function writeSharedCookie(utms: Utms): void {
  try {
    const sp = new URLSearchParams();
    UTM_KEYS.forEach((k) => {
      const v = utms[k];
      if (v) sp.set(k, v);
    });
    const maxAge = Math.floor(MAX_AGE_MS / 1000);
    document.cookie = `${SHARED_COOKIE}=${sp.toString()}; max-age=${maxAge}; path=/${sharedCookieDomain()}; SameSite=Lax`;
  } catch {
    /* cookie indisponível — segue sem quebrar */
  }
}

function readLocalStored(): Utms | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { utms: Utms; ts: number };
    if (!parsed || !parsed.ts) return null;
    if (Date.now() - parsed.ts > MAX_AGE_MS) return null;
    // Entrada gravada antes de 15/09/26 pode ser fraca (bio, lp-*): não vale mais.
    if (isOrigemFraca(parsed.utms)) return null;
    return parsed.utms || null;
  } catch {
    return null;
  }
}

/** Origem forte guardada: a da própria LP (localStorage) ou a que veio da loja (cookie compartilhado). */
function readStored(): Utms | null {
  return readLocalStored() ?? readSharedCookie();
}

/**
 * UTM de entrada pro popup de captura de lead gravar junto do contato.
 *
 * Diferente do checkout, aqui a origem fraca SERVE: um lead que veio da bio é
 * informação, não sobrescreve crédito de ninguém. Ordem: origem forte guardada;
 * senão, a UTM da visita atual (mesmo fraca); senão, null.
 */
export function getEntryUtms(): Utms | null {
  const guardada = readStored();
  if (guardada) return guardada;
  try {
    const atual = readUrlUtms();
    return Object.keys(atual).length > 0 ? atual : null;
  } catch {
    return null;
  }
}

/**
 * Chame UMA vez quando a LP montar (useEffect com [] no fim).
 * Grava a UTM de entrada FORTE em first-touch atômico.
 */
export function captureEntryUtms(): void {
  // Fora do try/return abaixo de propósito: o anúncio pode mandar `fbclid`
  // sem nenhuma UTM, e nesse caso o `return` adiante engoliria a captura.
  captureClickIds();

  try {
    const incoming = readUrlUtms();
    if (Object.keys(incoming).length === 0) return; // nada na URL
    if (isOrigemFraca(incoming)) return; // bio/orgânico não entra nem bloqueia anúncio futuro
    const guardada = readStored();
    if (guardada) {
      // já há origem forte (daqui ou da loja) -> não sobrescreve (first-touch),
      // mas garante que ela esteja no cookie que a loja lê
      if (!readSharedCookie()) writeSharedCookie(guardada);
      return;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ utms: incoming, ts: Date.now() })
    );
    writeSharedCookie(incoming);
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
 * Monta a URL final do checkout.
 *
 * @param baseUrl   URL do produto na Yampi, já com ?promocode=...
 * @param fallback  UTMs da página. Só viajam quando a visita é clique do Google sem UTM.
 *                  O `utm_source` daqui é também a fonte do slug da LP.
 * @param ctaPos    Posição do botão clicado (hero/oferta/final...). Vai em cta_pos.
 */
export function buildCheckoutUrl(
  baseUrl: string,
  fallback: Utms,
  ctaPos?: string
): string {
  const url = new URL(baseUrl);

  const clickIds = { ...readStoredClickIds(), ...readUrlClickIds() };

  // Prioridade: origem forte guardada; senão, a da URL atual se for forte.
  const daUrl = readUrlUtms();
  const entradaForte = readStored() ?? (isOrigemFraca(daUrl) ? null : daUrl);
  const cliqueGoogle = GOOGLE_CLICK_IDS.some((k) => Boolean(clickIds[k]));

  // Origem fraca e sem clique do Google: NENHUM utm_* sai daqui. É o que impede a LP
  // (e a bio) de sobrescrever, campo a campo, o anúncio que o checkout já guardou.
  const base = entradaForte ?? (cliqueGoogle ? fallback : null);

  if (base) {
    // A marca da LP é estrutural: sai do fallback da própria página, não da mão de quem
    // montou o anúncio. O criativo do anúncio sobrevive depois do `__`.
    const utms = ensureLpPrefix(base, fallback.utm_source, ctaPos);
    UTM_KEYS.forEach((k) => {
      const v = utms[k];
      if (v) url.searchParams.set(k, v);
    });
  }

  // Click IDs seguem junto pro checkout — sem eles o Meta/Google não ligam a
  // compra ao anúncio. O da URL atual ganha do guardado: last-touch.
  CLICK_IDS.forEach((k) => {
    const v = clickIds[k];
    if (v) url.searchParams.set(k, v);
  });

  if (ctaPos) url.searchParams.set("cta_pos", ctaPos);

  return url.href;
}
