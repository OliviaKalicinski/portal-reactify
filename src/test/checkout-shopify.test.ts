import { describe, it, expect, beforeEach } from "vitest";
import { DESTINO, paraCheckoutShopify, VARIANTE_POR_TOKEN } from "@/lib/checkoutShopify";
import { buildCheckoutUrl, captureEntryUtms } from "@/lib/utm";

/**
 * Migração Yampi -> checkout Shopify (virada 01/12/2026, etapa E5 do plano).
 * O link da Yampi que as páginas escrevem vira o carrinho da Shopify, com cupom e origem.
 */

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  document.cookie = "cdd_origem=; max-age=0; path=/";
  window.history.replaceState({}, "", "/mordida");
});

describe("paraCheckoutShopify", () => {
  it("um produto: vira /cart/VARIANTE:1 na loja", () => {
    const u = new URL(paraCheckoutShopify("https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK", "shopify"));
    expect(u.origin).toBe("https://www.comidadedragao.com.br");
    expect(u.pathname).toBe("/cart/57996588319023:1");
  });

  it("quantidade e vários produtos", () => {
    const u = new URL(paraCheckoutShopify("https://seguro.comidadedragao.com.br/r/TQT4HOZK7X:2,AK5VFR5RLO:1", "shopify"));
    expect(u.pathname).toBe("/cart/50957773308207:2,58247792853295:1");
  });

  it("cupom: promocode vira discount", () => {
    const u = new URL(paraCheckoutShopify("https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?promocode=ALERGIA10", "shopify"));
    expect(u.searchParams.get("discount")).toBe("ALERGIA10");
    expect(u.searchParams.has("promocode")).toBe(false);
  });

  it("origem e posição do botão viram atributos; clique do anúncio segue na URL", () => {
    const u = new URL(
      paraCheckoutShopify(
        "https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?utm_source=facebook&utm_medium=paid_social&cta_pos=hero&fbclid=abc"
      , "shopify")
    );
    expect(u.searchParams.get("attributes[utm_source]")).toBe("facebook");
    expect(u.searchParams.get("attributes[utm_medium]")).toBe("paid_social");
    expect(u.searchParams.get("attributes[cta_pos]")).toBe("hero");
    expect(u.searchParams.has("utm_source")).toBe(false);
    expect(u.searchParams.get("fbclid")).toBe("abc");
  });

  it("token fora da tabela: o link da Yampi fica como está", () => {
    const link = "https://seguro.comidadedragao.com.br/r/81ZXK4TWPV";
    expect(paraCheckoutShopify(link, "shopify")).toBe(link);
  });

  it("link que não é da Yampi: fica como está", () => {
    const link = "https://www.comidadedragao.com.br/collections/produtos";
    expect(paraCheckoutShopify(link, "shopify")).toBe(link);
  });

  it("todo token de carrinho escrito nas páginas está na tabela (nenhum botão fica na Yampi)", () => {
    // Lê o código das páginas e procura os tokens de 10 caracteres depois de /r/ ou nas listas de kits.
    const arquivos = import.meta.glob("/src/pages/**/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
    const conhecidos = new Set(Object.keys(VARIANTE_POR_TOKEN));
    const faltando: string[] = [];
    for (const [arquivo, codigo] of Object.entries(arquivos)) {
      const diretos = [...codigo.matchAll(/seguro\.comidadedragao\.com\.br\/r\/([A-Z0-9]{10})/g)].map((m) => m[1]);
      const temBase = /const CHECKOUT = "https:\/\/seguro\.comidadedragao\.com\.br\/r\/"/.test(codigo);
      const daLista = temBase ? [...codigo.matchAll(/["'`]([A-Z0-9]{10})["'`]/g)].map((m) => m[1]).filter((t) => /[0-9]/.test(t) && /[A-Z]/.test(t)) : [];
      for (const t of [...diretos, ...daLista]) if (!conhecidos.has(t)) faltando.push(`${arquivo}: ${t}`);
    }
    expect(faltando).toEqual([]);
  });

  it("todo link da Yampi escrito numa página só é usado dentro de buildCheckoutUrl (ou para montar outro link)", () => {
    const arquivos = import.meta.glob("/src/**/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
    const soltos: string[] = [];
    for (const [arquivo, codigo] of Object.entries(arquivos)) {
      if (!codigo.includes("seguro.comidadedragao")) continue;
      const nomes = new Set<string>();
      for (const m of codigo.matchAll(/(?:const|let)\s+([A-Za-z_]\w*)\s*=\s*[`"']https:\/\/seguro/g)) nomes.add(m[1]);
      for (const m of codigo.matchAll(/([A-Za-z_]\w*)\s*:\s*[`"']https:\/\/seguro/g)) nomes.add(m[1]);
      // link da Yampi escrito direto num href ou num location, sem nome
      if (/(?:href=|location\.href\s*=|window\.open\()\s*[{(]?\s*[`"']https:\/\/seguro/.test(codigo)) soltos.push(`${arquivo}: link direto`);
      for (const nome of nomes) {
        for (const m of codigo.matchAll(new RegExp(`\\b${nome}\\b`, "g"))) {
          const antes = codigo.slice(Math.max(0, m.index! - 200), m.index!);
          const depois = codigo.slice(m.index!, m.index! + nome.length + 25);
          const definicao = new RegExp(`^${nome}\\s*(=|:)\\s*[\`"']https`).test(depois) || /(?:const|let)\s+$/.test(antes);
          const montaOutro = /=\s*[^;]*$/.test(antes.split("\n").pop() ?? "") && /(?:const|let)\s+\w+\s*=/.test(antes.split("\n").pop() ?? "");
          if (definicao || montaOutro || antes.includes("buildCheckoutUrl(")) continue;
          soltos.push(`${arquivo}: ${nome} (linha ${codigo.slice(0, m.index!).split("\n").length})`);
        }
      }
    }
    expect(soltos).toEqual([]);
  });

  it("o link que sai não aponta mais para a Yampi, nem guarda utm_* soltos", () => {
    for (const token of Object.keys(VARIANTE_POR_TOKEN)) {
      const u = new URL(paraCheckoutShopify(`https://seguro.comidadedragao.com.br/r/${token}?utm_source=x`, "shopify"));
      expect(u.hostname).toBe("www.comidadedragao.com.br");
      expect(u.searchParams.has("utm_source")).toBe(false);
    }
  });
});

describe("chave da virada", () => {
  it("até a virada a chave fica em yampi: o cliente continua indo à Yampi", () => {
    // No dia da virada este teste muda junto com a chave (DESTINO = "shopify").
    expect(DESTINO).toBe("yampi");
    const u = new URL(buildCheckoutUrl("https://seguro.comidadedragao.com.br/r/AK5VFR5RLO", { utm_source: "lp-mordida" }, "hero"));
    expect(u.hostname).toBe("seguro.comidadedragao.com.br");
  });
});

describe.skipIf(DESTINO !== "shopify")("buildCheckoutUrl leva ao carrinho da Shopify (só com a chave em shopify)", () => {
  it("anúncio na LP: carrinho da Shopify com a origem e a marca da LP nos atributos", () => {
    window.history.replaceState({}, "", "/mordida?utm_source=facebook&utm_medium=paid_social&utm_campaign=c1&utm_content=ad1");
    captureEntryUtms();
    const u = new URL(
      buildCheckoutUrl("https://seguro.comidadedragao.com.br/r/AK5VFR5RLO?promocode=X", { utm_source: "lp-mordida" }, "hero")
    );
    expect(u.hostname).toBe("www.comidadedragao.com.br");
    expect(u.pathname).toBe("/cart/58247792853295:1");
    expect(u.searchParams.get("discount")).toBe("X");
    expect(u.searchParams.get("attributes[utm_source]")).toBe("facebook");
    expect(u.searchParams.get("attributes[utm_content]")).toBe("lp-mordida__ad1");
    expect(u.searchParams.get("attributes[cta_pos]")).toBe("hero");
  });
});
