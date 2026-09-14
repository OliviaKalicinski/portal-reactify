/* ──────────────────────────────────────────────────────────────
   FLAG MESTRE — PROMOÇÃO "DIA DO CLIENTE"
   Desconto automático no produto (Yampi): -10% em produto avulso,
   -20% em kit. Liga/desliga em TODAS as LPs de uma vez — não precisa
   mexer página por página.

   Janela: 15/09/2026 a 17/09/2026 (horário de Brasília), automática.
   ENABLED = false desliga na hora, mesmo dentro da janela — é o
   kill-switch manual pra Olivia.

   ⚠️ O desconto em si (o valor cobrado no checkout) mora na Yampi —
   isso aqui só decide se a LP MOSTRA o selo/preço com desconto ou o
   preço normal. Ligar/desligar aqui não liga/desliga o desconto real
   na Yampi; os dois têm que estar de acordo.
────────────────────────────────────────────────────────────── */

const ENABLED = true;

const START = "2026-09-15T00:00:00-03:00";
const END = "2026-09-17T23:59:59-03:00";

/* 🔎 COMO TESTAR sem esperar 15/09 nem editar código:
   abra a LP com ?promo_preview=diadocliente na URL, ex.:
   http://localhost:5183/original?promo_preview=diadocliente
   (funciona em qualquer LP, local ou já publicada). Só muda o que a
   página MOSTRA pra quem abriu esse link — não liga desconto real
   na Yampi nem afeta outros visitantes. ENABLED=false ainda vence:
   se o kill-switch estiver desligado, nem o preview força. */
export function isDayOfClienteActive(): boolean {
  if (!ENABLED) return false;
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("promo_preview") === "diadocliente") return true;
  }
  const now = Date.now();
  return now >= new Date(START).getTime() && now <= new Date(END).getTime();
}
