/**
 * src/lib/checkoutShopify.ts
 *
 * Migração do checkout da Yampi para o checkout nativo da Shopify (virada em 01/12/2026).
 * Plano: PROJETOS/Frete & Checkout/2026-11-25 - migração Yampi para checkout Shopify (etapa E5).
 *
 * As páginas continuam escrevendo o link da Yampi (`seguro.comidadedragao.com.br/r/TOKEN?promocode=X`).
 * `buildCheckoutUrl` (src/lib/utm.ts) passa esse link por `paraCheckoutShopify`, que o troca pelo
 * link de carrinho da Shopify, que também vai direto ao checkout:
 *
 *   https://www.comidadedragao.com.br/cart/VARIANTE:QTD?discount=CUPOM&attributes[utm_source]=...
 *
 * A origem vai como ATRIBUTO do carrinho (`attributes[...]`), que a Shopify grava no pedido.
 *
 * VOLTA: `DESTINO = "yampi"` devolve todas as páginas ao link antigo, sem mexer em página nenhuma.
 */

export type DestinoCheckout = "shopify" | "yampi";

export const DESTINO: DestinoCheckout = "shopify";

const LOJA = "https://www.comidadedragao.com.br";
const HOST_YAMPI = "seguro.comidadedragao.com.br";

/**
 * Token do carrinho da Yampi -> variante da Shopify.
 * Token e SKU: `_MIGRAR-PAGINAS/links-checkout-yampi-tokens.md` (tabela da Olivia).
 * SKU e variante: lidos na loja (`/products.json`) em 25/11/2026.
 * O 81ZXK4TWPV (Suplemento Concentrado, sku 301) não está aqui: o produto não aparece na loja
 * e nenhuma página usa o token. Token fora da tabela: o link da Yampi fica como está.
 */
export const VARIANTE_POR_TOKEN: Record<string, { sku: string; variante: number }> = {
  TQT4HOZK7X: { sku: "101", variante: 50957773308207 }, // Original 90 g
  DZCHG52YG4: { sku: "1101", variante: 50957945504047 }, // Kit Original 3x
  BII063ST2H: { sku: "302", variante: 51711467979055 }, // Suplemento Integral
  "4DO9WVBVH0": { sku: "303", variante: 51953627169071 }, // Suplemento para Gatos
  "9ZCGSMOOBC": { sku: "401", variante: 52044957352239 }, // Grub
  KQXZ5J7LWK: { sku: "1302", variante: 57996588319023 }, // Kit para Cães
  N9DLSJ6M4J: { sku: "1301", variante: 54285930561839 }, // Kit para Gatos
  AK5VFR5RLO: { sku: "203", variante: 58247792853295 }, // Mordida
  "8YXY3HISC4": { sku: "1303", variante: 58258671960367 }, // Kit Original + Mordida
  AMX9A1HEPD: { sku: "1304", variante: 58258671993135 }, // Kit 3 Mordidas
  ZWOQZDQBW1: { sku: "1305", variante: 58258673041711 }, // Kit Mordida + Suplemento
  GPGITR0VZ1: { sku: "1306", variante: 58258673631535 }, // Kit Completo para Cães
  PDYJH8ZOQU: { sku: "1306-BN", variante: 58737662361903 }, // Kit Completo, Black (oculto)
  NZZ48AIGFF: { sku: "501", variante: 58616148394287 }, // Rango, pacote
  MJ9H9ZNKPG: { sku: "1501", variante: 58620883599663 }, // Kit Rango compre 6 ganhe 1
};

/** Parâmetros que viram atributo do carrinho (e daí do pedido). */
const VIRA_ATRIBUTO = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "cta_pos",
];

/**
 * Troca um link de carrinho da Yampi pelo link de carrinho da Shopify.
 * Devolve o link original quando não é da Yampi, quando o destino é "yampi" ou quando
 * algum token não está na tabela (melhor abrir a Yampi do que um carrinho incompleto).
 */
export function paraCheckoutShopify(link: string): string {
  if (DESTINO !== "shopify") return link;

  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return link;
  }
  if (url.hostname !== HOST_YAMPI) return link;

  const caminho = url.pathname.match(/^\/r\/(.+)$/);
  if (!caminho) return link;

  // /r/TOKEN  ou  /r/TOKEN:2  ou  /r/TOKEN1:1,TOKEN2:2
  const itens: string[] = [];
  for (const parte of decodeURIComponent(caminho[1]).split(",")) {
    const [token, qtdTexto] = parte.trim().split(":");
    const linha = VARIANTE_POR_TOKEN[token];
    if (!linha) return link;
    const qtd = Math.max(1, parseInt(qtdTexto || "1", 10) || 1);
    itens.push(`${linha.variante}:${qtd}`);
  }

  const destino = new URL(`${LOJA}/cart/${itens.join(",")}`);

  url.searchParams.forEach((valor, chave) => {
    if (!valor) return;
    if (chave === "promocode") destino.searchParams.set("discount", valor);
    else if (VIRA_ATRIBUTO.includes(chave)) destino.searchParams.set(`attributes[${chave}]`, valor);
    else destino.searchParams.set(chave, valor); // fbclid, gclid, ttclid...: seguem na URL
  });

  return destino.href;
}
