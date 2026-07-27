/**
 * TELEFONE BR — normalização, máscara e validação. Fonte única.
 *
 * POR QUE ISTO EXISTE (27/07/26): a máscara antiga fazia
 * `raw.replace(/\D/g,"").slice(0, 11)` — corte cego no 11º dígito. Quem
 * digitava o código do país perdia o FINAL do próprio número, e a validação
 * (`length >= 10`) aceitava o toco. Resultado medido na lista de espera da
 * Mordida V2: 9 dos 84 inscritos ficaram inalcançáveis.
 *
 * A prova: a mesma pessoa se inscreveu duas vezes, uma certa (21982597136)
 * e uma quebrada (55219825971 — "55" na frente, o final comido).
 *
 * A correção é normalizar ANTES de cortar: tira o código do país e o zero de
 * DDD, e só então limita a 11. E a validação passou a exigir um número que
 * pode existir, não só uma contagem de dígitos.
 */

/**
 * Reduz o que a pessoa digitou ao número nacional: DDD + assinante.
 *
 * - `+55 11 98765-4321` → `11987654321` (tira o código do país)
 * - `011 98765-4321`    → `11987654321` (tira o zero de DDD)
 * - `55 99999-9999`     → `5599999999`  (DDD 55 de verdade, não mexe)
 *
 * O "55" só é tratado como código do país quando o total tem 12 ou 13
 * dígitos — que é o único jeito de ele sobrar. Um número de Santa Maria
 * (DDD 55) tem 10 ou 11 e passa intacto.
 */
export const normalizePhoneDigits = (raw: string): string => {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0") && (d.length === 11 || d.length === 12)) d = d.slice(1);
  if (d.startsWith("55") && (d.length === 12 || d.length === 13)) d = d.slice(2);
  return d.slice(0, 11);
};

/** Máscara progressiva: (11) → (11) 9 → (11) 98765-4321 */
export const formatPhoneBR = (raw: string): string => {
  const d = normalizePhoneDigits(raw);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

/**
 * True se o número pode existir no Brasil:
 *  - DDD entre 11 e 99 (não começa com 0);
 *  - 11 dígitos = celular → o dígito depois do DDD é 9, obrigatoriamente;
 *  - 10 dígitos = fixo → o dígito depois do DDD é 2, 3, 4 ou 5.
 *
 * As duas últimas regras são o que barra o toco, e cada uma pegou um caso
 * real da lista da Mordida V2:
 *  - `55119809920` tem 11 dígitos, mas o terceiro é `1` — celular nenhum
 *    começa assim; é `+55 11 9809920…` com o final comido.
 *  - `1199907333` tem 10 dígitos e o terceiro é `9` — fixo nenhum começa
 *    assim; é um celular a que faltou um dígito.
 *
 * Contar dígitos não basta: os dois passariam por `length >= 10`.
 */
export const isValidPhoneBR = (raw: string): boolean => {
  const d = normalizePhoneDigits(raw);
  if (d.length !== 10 && d.length !== 11) return false;
  if (Number(d.slice(0, 2)) < 11) return false;
  if (d.length === 11) return d[2] === "9";
  return ["2", "3", "4", "5"].includes(d[2]);
};
