import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./Obrigado.css";

/* ──────────────────────────────────────────────────────────────
   PÁGINA DE OBRIGADO — Yampi pós-checkout
   URL pública: https://caverna.comidadedragao.com.br/obrigado

   Como funciona:
   1. Yampi redireciona o cliente pra cá após pagamento confirmado
   2. O thankyou.min.js da Yampi (carregado via Helmet) substitui
      strings %%nome%% no DOM em runtime com dados reais do pedido
   3. O useEffect aqui formata `payment` (billet → "Boleto") e
      mostra/esconde o bloco de boleto se necessário

   ⚠️ Configurar redirecionamento em:
      Yampi admin → Checkout → Redirecionamento (por método de pagamento)
   ⚠️ Pix simples NÃO redireciona — limitação da plataforma.
────────────────────────────────────────────────────────────── */

const MARQUEE_TEXT = "NOJENTO É O DESPERDÍCIO";

export default function Obrigado() {
  const [isBoleto, setIsBoleto] = useState(false);

  // Aguarda o thankyou.min.js da Yampi substituir as variáveis
  // e então formata o método de pagamento + mostra bloco do boleto.
  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const el = document.getElementById("obg-payment-value");
      if (!el) return;

      const raw = (el.textContent ?? "").trim().toLowerCase();

      // Se ainda está com placeholder %%, espera mais um tick
      if (raw.includes("%%")) {
        if (attempts > 25) clearInterval(interval); // 5s timeout
        return;
      }

      // Substituição já aconteceu — formata o valor e ativa boleto
      switch (raw) {
        case "billet":
          el.textContent = "Boleto";
          setIsBoleto(true);
          break;
        case "credit_card":
          el.textContent = "Cartão";
          break;
        case "pix":
          el.textContent = "Pix";
          break;
        case "deposit":
          el.textContent = "Depósito";
          break;
        default:
          // valor inesperado — mantém o que veio
          break;
      }
      clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="obg-page">
      <Helmet>
        <title>Pedido confirmado · Comida de Dragão</title>
        <meta name="description" content="Seu pedido foi aceito pelo Dragão." />
        <meta name="robots" content="noindex,nofollow" />
        {/* Script da Yampi — substitui %%var%% no DOM em runtime */}
        <script src="https://cdn.yampi.me/thankyou/thankyou.min.js" async />
      </Helmet>

      <div className="obg-wrap">
        {/* ════ TOP BAR ═══════════════════════════════════════════ */}
        <div className="obg-topbar">
          <div className="obg-badge">// 01 · PEDIDO CONFIRMADO</div>
          <a href="https://comidadedragao.com.br">← voltar à loja</a>
        </div>

        {/* ════ HERO ══════════════════════════════════════════════ */}
        <section className="obg-hero">
          <div className="obg-dragon" aria-hidden="true">🐉</div>
          <div className="obg-eyebrow">// O DRAGÃO TE VIU</div>
          <h1 className="obg-title">
            PEDIDO ACEITO,<br />
            <em>%%customer_first_name%%</em>.
          </h1>
          <p className="obg-sub">
            Tá tudo registrado. Em até 2 dias úteis seu pedido entra em produção
            e parte pro despacho. Quando despachar, mandamos o código de rastreio
            no seu WhatsApp.
          </p>
        </section>

        {/* ════ INFO DO PEDIDO ════════════════════════════════════ */}
        <div className="obg-order-info">
          <div className="obg-cell">
            <div className="obg-label">// nº do pedido</div>
            <div className="obg-value">#%%sale_number%%</div>
          </div>
          <div className="obg-cell">
            <div className="obg-label">// valor total</div>
            <div className="obg-value">R$ %%sale_amount%%</div>
          </div>
          <div className="obg-cell">
            <div className="obg-label">// pagamento</div>
            <div className="obg-value" id="obg-payment-value">%%payment%%</div>
          </div>
          <div className="obg-cell">
            <div className="obg-label">// parcelas</div>
            <div className="obg-value">%%installments%%x</div>
          </div>
        </div>

        {/* ════ BLOCO BOLETO (condicional) ═══════════════════════
            Renderizado sempre no DOM (oculto via display:none) pra que
            o thankyou.min.js consiga substituir as variáveis. O state
            isBoleto controla a visibilidade depois da substituição. */}
        <section
          className="obg-billet"
          style={{ display: isBoleto ? "block" : "none" }}
        >
          <div className="obg-head">// pague seu boleto</div>
          <div>
            <a
              href="%%billet_url%%"
              target="_blank"
              rel="noopener noreferrer"
              className="obg-btn-billet"
            >
              Abrir boleto →
            </a>
          </div>
          <div className="obg-barcode-label">código de barras</div>
          <div className="obg-barcode">%%barcode%%</div>
        </section>

        {/* ════ PRÓXIMOS PASSOS ═══════════════════════════════════ */}
        <section className="obg-section">
          <div className="obg-head">// próximos passos</div>
          <h2 className="obg-h2">O QUE ACONTECE AGORA</h2>
          <ol className="obg-steps">
            <li>
              <strong>Confirmação por e-mail</strong> — chega em alguns minutos.
              Confere a caixa de entrada (e o spam, por garantia).
            </li>
            <li>
              <strong>Produção em até 2 dias úteis</strong> — o Dragão libera, a
              equipe embala, sai pra entrega.
            </li>
            <li>
              <strong>Código de rastreio no WhatsApp</strong> — assim que despachar,
              você recebe automaticamente.
            </li>
            <li>
              <strong>Pedido na sua porta</strong> — 3 a 7 dias úteis, dependendo
              da região.
            </li>
          </ol>
        </section>

        {/* ════ MARQUEE ═══════════════════════════════════════════ */}
        <div className="obg-marquee" aria-hidden="true">
          <div className="obg-marquee-track">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i}>{MARQUEE_TEXT}</span>
            ))}
          </div>
        </div>

        {/* ════ CTAs ══════════════════════════════════════════════ */}
        <section className="obg-section">
          <div className="obg-head">// agora é com você</div>
          <h2 className="obg-h2">BORA FECHAR O CICLO</h2>

          <div className="obg-cta-grid">
            <a
              className="obg-cta-card"
              href="https://instagram.com/comidadedragao"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="obg-cta-icon">📸</div>
              <div className="obg-cta-title">Manda foto do pet</div>
              <div className="obg-cta-desc">
                Quando chegar, posta marcando @comidadedragao. A gente reposta —
                quem entra no feed virou cria do Dragão.
              </div>
              <div className="obg-cta-arrow">@comidadedragao →</div>
            </a>

            <a
              className="obg-cta-card"
              href="https://wa.me/552139500576"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="obg-cta-icon">💬</div>
              <div className="obg-cta-title">Dúvida? Me chama</div>
              <div className="obg-cta-desc">
                Dosagem, troca, prazo, tudo. Eu respondo direto no WhatsApp — o
                Dragão sabe, eu te conto.
              </div>
              <div className="obg-cta-arrow">Abrir WhatsApp →</div>
            </a>
          </div>
        </section>

        {/* ════ CUPOM RECOMPRA ═══════════════════════════════════ */}
        <section className="obg-coupon">
          <div className="obg-coupon-eyebrow">// bônus do dragão</div>
          <h2 className="obg-coupon-title">
            10% OFF NA<br />SUA PRÓXIMA.
          </h2>
          <div className="obg-coupon-code">VOLTOU10</div>
          <div className="obg-coupon-small">
            válido por 30 dias · 1 uso por cliente
          </div>
        </section>

        {/* ════ FOOTER ════════════════════════════════════════════ */}
        <footer className="obg-footer">
          Comida de Dragão · Let's Fly Sustentável<br />
          Biofábrica registrada no MAPA — RJ 001924-0
        </footer>
      </div>
    </div>
  );
}
