import { describe, it, expect, beforeEach } from "vitest";
import { buildCheckoutUrl, captureEntryUtms, getEntryUtms, isOrigemFraca } from "@/lib/utm";

/**
 * UTM DAS LPs — origem fraca não pode sobrescrever anúncio.
 *
 * POR QUE ESTE TESTE EXISTE (15/09/26): o checkout Yampi guarda a UTM em
 * last-touch campo a campo (cookie `__ana_utm`, testado ao vivo). A LP mandava o
 * fallback `lp-mordida` pra quem chegava sem UTM e o link da bio mandava
 * `ig / social / link_in_bio`, e os dois apagavam o anúncio: 10 pedidos com o
 * `utm_term` do conjunto do Meta como fóssil, corrigidos à mão no dash.
 * Os casos abaixo são os caminhos reais daqueles pedidos.
 */

const CHECKOUT = "https://seguro.comidadedragao.com.br/r/AK5VFR5RLO";
const FALLBACK = { utm_source: "lp-mordida", utm_medium: "lp", utm_campaign: "lp-mordida-mordida" };

const ANUNCIO =
  "?utm_source=facebook&utm_medium=paid_social&utm_campaign=TO-sushijullie-LP-Original-SP-RJ" +
  "&utm_content=TO-sushijullie-LP-Original-SP-RJ&utm_term=120249220500880622";
const BIO = "?utm_source=ig&utm_medium=social&utm_content=link_in_bio";

function visita(query: string) {
  window.history.replaceState({}, "", `/mordida${query}`);
}

function params(href: string) {
  return new URL(href).searchParams;
}

const temAlgumaUtm = (sp: URLSearchParams) =>
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].some((k) => sp.has(k));

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  document.cookie = "cdd_origem=; max-age=0; path=/";
  visita("");
});

describe("isOrigemFraca", () => {
  it("sem UTM, link interno lp-* e bio do Instagram são fracas", () => {
    expect(isOrigemFraca({})).toBe(true);
    expect(isOrigemFraca(FALLBACK)).toBe(true);
    expect(isOrigemFraca({ utm_source: "ig", utm_medium: "social", utm_content: "link_in_bio" })).toBe(true);
    expect(isOrigemFraca({ utm_source: "instagram", utm_medium: "bio", utm_campaign: "organico" })).toBe(true);
    expect(isOrigemFraca({ utm_source: "tiktok", utm_medium: "bio" })).toBe(true);
  });

  it("anúncio, WhatsApp, e-mail e anúncio de Instagram são fortes", () => {
    expect(isOrigemFraca({ utm_source: "facebook", utm_medium: "paid_social" })).toBe(false);
    expect(isOrigemFraca({ utm_source: "ig", utm_medium: "paid_social" })).toBe(false);
    expect(isOrigemFraca({ utm_source: "rptn", utm_medium: "whatsapp", utm_campaign: "recompra-kit" })).toBe(false);
    expect(isOrigemFraca({ utm_source: "email", utm_medium: "campanha" })).toBe(false);
    expect(isOrigemFraca({ utm_source: "google", utm_medium: "cpc" })).toBe(false);
  });
});

describe("buildCheckoutUrl", () => {
  it("anúncio: repassa origem, campanha e conjunto, com a LP no utm_content", () => {
    visita(ANUNCIO);
    captureEntryUtms();
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "hero"));
    expect(sp.get("utm_source")).toBe("facebook");
    expect(sp.get("utm_medium")).toBe("paid_social");
    expect(sp.get("utm_term")).toBe("120249220500880622");
    expect(sp.get("utm_content")).toBe("lp-mordida__TO-sushijullie-LP-Original-SP-RJ");
    expect(sp.get("cta_pos")).toBe("hero");
  });

  it("sem UTM: o botão vai ao checkout SEM utm_* (não apaga o anúncio guardado lá)", () => {
    visita("");
    captureEntryUtms();
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "sticky"));
    expect(temAlgumaUtm(sp)).toBe(false);
    expect(sp.get("cta_pos")).toBe("sticky");
  });

  it("bio do Instagram: não repassa ig/social/link_in_bio", () => {
    visita(BIO);
    captureEntryUtms();
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "hero"));
    expect(temAlgumaUtm(sp)).toBe(false);
  });

  it("anúncio e depois bio no mesmo navegador: continua o anúncio", () => {
    visita(ANUNCIO);
    captureEntryUtms();
    visita(BIO);
    captureEntryUtms();
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "hero"));
    expect(sp.get("utm_source")).toBe("facebook");
    expect(sp.get("utm_term")).toBe("120249220500880622");
  });

  it("anúncio e depois volta sem UTM (o pedido do print): continua o anúncio", () => {
    visita(ANUNCIO);
    captureEntryUtms();
    visita("");
    captureEntryUtms();
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "sticky"));
    expect(sp.get("utm_source")).toBe("facebook");
    expect(sp.get("utm_campaign")).toBe("TO-sushijullie-LP-Original-SP-RJ");
  });

  it("bio primeiro e anúncio depois: a bio não bloqueia, vale o anúncio", () => {
    visita(BIO);
    captureEntryUtms();
    visita(ANUNCIO);
    captureEntryUtms();
    visita("");
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "hero"));
    expect(sp.get("utm_source")).toBe("facebook");
  });

  it("entrada fraca gravada antes da mudança (lp-mordida) é ignorada", () => {
    localStorage.setItem(
      "cdd_entry_utms",
      JSON.stringify({ utms: FALLBACK, ts: Date.now() })
    );
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "hero"));
    expect(temAlgumaUtm(sp)).toBe(false);
  });

  it("origem forte com mais de 7 dias expira", () => {
    const oitoDias = 8 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      "cdd_entry_utms",
      JSON.stringify({ utms: { utm_source: "facebook", utm_medium: "paid_social" }, ts: Date.now() - oitoDias })
    );
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "hero"));
    expect(temAlgumaUtm(sp)).toBe(false);
  });

  it("clique do Google sem UTM (LPs /g/*): usa o fallback da página e leva o gclid", () => {
    visita("?gclid=abc123");
    captureEntryUtms();
    const sp = params(buildCheckoutUrl(CHECKOUT, { utm_source: "lp-idoso-google", utm_medium: "lp", utm_campaign: "lp-idoso-kit-caes-google" }, "hero"));
    expect(sp.get("utm_source")).toBe("lp-idoso-google");
    expect(sp.get("gclid")).toBe("abc123");
  });

  it("fbclid sem UTM não conta como anúncio (o Instagram anexa em link orgânico), mas viaja", () => {
    visita("?fbclid=xyz");
    captureEntryUtms();
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "hero"));
    expect(temAlgumaUtm(sp)).toBe(false);
    expect(sp.get("fbclid")).toBe("xyz");
  });

  it("WhatsApp do Reportana é forte e viaja", () => {
    visita("?utm_source=rptn&utm_medium=whatsapp&utm_campaign=recompra-kit&utm_content=t1");
    captureEntryUtms();
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "oferta"));
    expect(sp.get("utm_source")).toBe("rptn");
    expect(sp.get("utm_content")).toBe("lp-mordida__t1");
  });
});

describe("getEntryUtms (popup de lead)", () => {
  it("lead da bio guarda a UTM da visita, mesmo fraca", () => {
    visita(BIO);
    captureEntryUtms();
    expect(getEntryUtms()).toEqual({ utm_source: "ig", utm_medium: "social", utm_content: "link_in_bio" });
  });

  it("com anúncio guardado, o lead leva o anúncio", () => {
    visita(ANUNCIO);
    captureEntryUtms();
    visita(BIO);
    expect(getEntryUtms()?.utm_source).toBe("facebook");
  });

  it("sem nada, null", () => {
    expect(getEntryUtms()).toBeNull();
  });
});

describe("cookie cdd_origem (compartilhado com a loja)", () => {
  const lerCookie = () =>
    document.cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("cdd_origem="));

  it("anúncio grava a origem no cookie que a loja lê (caso Rodrigo)", () => {
    visita(ANUNCIO);
    captureEntryUtms();
    const sp = new URLSearchParams(lerCookie()!.slice("cdd_origem=".length));
    expect(sp.get("utm_source")).toBe("facebook");
    expect(sp.get("utm_term")).toBe("120249220500880622");
  });

  it("bio e visita sem UTM não gravam o cookie", () => {
    visita(BIO);
    captureEntryUtms();
    visita("");
    captureEntryUtms();
    expect(lerCookie()).toBeUndefined();
  });

  it("origem forte que veio da loja (cookie) viaja no botão da LP", () => {
    document.cookie = "cdd_origem=utm_source=rptn&utm_medium=whatsapp&utm_campaign=recompra-kit; path=/";
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "hero"));
    expect(sp.get("utm_source")).toBe("rptn");
    expect(sp.get("utm_content")).toBe("lp-mordida__hero");
  });

  it("cookie com origem fraca é ignorado", () => {
    document.cookie = "cdd_origem=utm_source=ig&utm_medium=social&utm_content=link_in_bio; path=/";
    const sp = params(buildCheckoutUrl(CHECKOUT, FALLBACK, "hero"));
    expect(temAlgumaUtm(sp)).toBe(false);
  });
});
