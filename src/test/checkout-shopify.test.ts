import { describe, it, expect, beforeEach } from "vitest";
import { paraCheckoutShopify, VARIANTE_POR_TOKEN } from "@/lib/checkoutShopify";
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
    const u = new URL(paraCheckoutShopify("https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK"));
    expect(u.origin).toBe("https://www.comidadedragao.com.br");
    expect(u.pathname).toBe("/cart/57996588319023:1");
  });

  it("quantidade e vários produtos", () => {
    const u = new URL(paraCheckoutShopify("https://seguro.comidadedragao.com.br/r/TQT4HOZK7X:2,AK5VFR5RLO:1"));
    expect(u.pathname).toBe("/cart/50957773308207:2,58247792853295:1");
  });

  it("cupom: promocode vira discount", () => {
    const u = new URL(paraCheckoutShopify("https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?promocode=ALERGIA10"));
    expect(u.searchParams.get("discount")).toBe("ALERGIA10");
    expect(u.searchParams.has("promocode")).toBe(false);
  });

  it("origem e posição do botão viram atributos; clique do anúncio segue na URL", () => {
    const u = new URL(
      paraCheckoutShopify(
        "https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?utm_source=facebook&utm_medium=paid_social&cta_pos=hero&fbclid=abc"
      )
    );
    expect(u.searchParams.get("attributes[utm_source]")).toBe("facebook");
    expect(u.searchParams.get("attributes[utm_medium]")).toBe("paid_social");
    expect(u.searchParams.get("attributes[cta_pos]")).toBe("hero");
    expect(u.searchParams.has("utm_source")).toBe(false);
    expect(u.searchParams.get("fbclid")).toBe("abc");
  });

  it("token fora da tabela: o link da Yampi fica como está", () => {
    const link = "https://seguro.comidadedragao.com.br/r/81ZXK4TWPV";
    expect(paraCheckoutShopify(link)).toBe(link);
  });

  it("link que não é da Yampi: fica como está", () => {
    const link = "https://www.comidadedragao.com.br/collections/produtos";
    expect(paraCheckoutShopify(link)).toBe(link);
  });

  it("os 15 tokens usados nas páginas estão na tabela", () => {
    expect(Object.keys(VARIANTE_POR_TOKEN)).toHaveLength(15);
  });
});

describe("buildCheckoutUrl leva ao carrinho da Shopify", () => {
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
