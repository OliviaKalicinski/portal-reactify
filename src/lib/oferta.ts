/**
 * src/lib/oferta.ts
 *
 * O que as páginas PROMETEM sobre frete e checkout, num lugar só.
 * Migração Yampi -> Shopify (virada 01/12/2026), item S6 do plano único do time.
 *
 * FRETE_GRATIS: decisão da Olivia (25/11/26): o frete grátis acaba depois da Black.
 *   - até a virada: true (as páginas prometem como hoje, a Yampi dá o frete grátis);
 *   - na virada: false, no mesmo deploy que troca a chave DESTINO para "shopify";
 *   - na VOLTA: continua false (a Yampi também passa a cobrar frete). Só DESTINO volta.
 *
 * VIA_YAMPI / PELA_YAMPI: o nome da Yampi no texto ("compra segura via Yampi") segue a
 *   chave do checkout: some quando os botões passam a ir à Shopify.
 */
import { DESTINO } from "./checkoutShopify";

export const FRETE_GRATIS: boolean = true;

/** Escolhe o texto com frete grátis ou o texto sem frete grátis. */
export function fg<T>(comFreteGratis: T, semFreteGratis: T): T {
  return FRETE_GRATIS ? comFreteGratis : semFreteGratis;
}

export const VIA_YAMPI = DESTINO === "yampi" ? " via Yampi" : "";
export const PELA_YAMPI = DESTINO === "yampi" ? " pela Yampi" : "";
