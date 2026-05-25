import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import "./Obrigado.css";

/* ──────────────────────────────────────────────────────────────
   PÁGINA DE OBRIGADO — /obrigado
   Comida de Dragão · destino do redirecionamento Yampi pós-compra

   Conceito: INICIAÇÃO. Pop-up flutuante simula o @dragao escaneando
   o cliente. Ao terminar, redireciona automaticamente pra tela com
   3 PORTAS lado a lado — escolha uma, todas levam pra /portal.
   Brincadeira do dragão.

   ⚠️ Configurar redirecionamento em:
      Yampi admin → Checkout → Redirecionamento
   ⚠️ Pix simples NÃO redireciona — limitação Yampi.
────────────────────────────────────────────────────────────── */

/* Destaque principal — PRIMEIRA coisa que aparece, antes de tudo.
   Confirma pagamento + pedido recebido com ênfase. */
const PAYMENT = {
  mark: "[✓]",
  title: "pagamento confirmado",
  sub: "pedido recebido — tá tudo certo por aqui",
};

/* Linhas de scan do @dragao — entram DEPOIS do destaque de pagamento. */
const BOOT_LINES = [
  "> escaneando perfil...",
  "> sem nojinho............... [✓]",
  "> coragem de comer larva.... [✓]",
  "> revolucionário............ [✓]",
  "> matilha avisada........... [✓]",
  "> tô feliz pra caramba...... [✓]",
];

/* Próximos passos do pedido — exibidos depois da barra de progresso.
   Comunica o que vem a seguir: separando → em breve enviado. */
const ORDER_STATUS = [
  {
    state: "doing",
    mark: "[⟳]",
    title: "separando teu pedido",
    sub: "a matilha já tá montando tua caixa na biofábrica",
  },
  {
    state: "next",
    mark: "[»]",
    title: "em breve a caminho",
    sub: "assim que enviar, o código de rastreio chega no teu e-mail",
  },
];

const BAR_WIDTH = 14;
const TYPE_SPEED = 20;
const PAUSE_BETWEEN_LINES = 210;
const PROGRESS_STEP_MS = 60;
const PROGRESS_STEP_PCT = 6;
/* tempo que o destaque de pagamento fica sozinho em cena antes do resto entrar */
const PAYMENT_HOLD_MS = 1100;

/* 3 portas — GIF aparece só no hover (segredo).
   Todas levam pra /portal. */
const DOORS = [
  {
    num: "01",
    color: "lime",
    gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3FmZGNiZmQxaHRibXIwd2Roamc0ajFubWd3YmF2eGZydGZjanRnNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12imoV28oMnSso/giphy.gif",
  },
  {
    num: "02",
    color: "pink",
    gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXV4aHpkMmd4OGh1cmp2ZGg4amI0NXRsNzJrbTZrcmRpNTNjampxcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QU3K7Pe6sWIz6Ul5cp/giphy.gif",
  },
  {
    num: "03",
    color: "yellow",
    gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzJnZnhwY3J1ZGt0MXV5Y3VhdWlnZzY0Yzl5NXpsb3FvdDZ0bzJvbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12YNzT14K3bf8Y/giphy.gif",
  },
];

export default function Obrigado() {
  const [phase, setPhase] = useState<"boot" | "ready">("boot");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSettled, setPaymentSettled] = useState(false);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [typedChars, setTypedChars] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);

  /* respeita prefers-reduced-motion: pula direto pra ready */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setPhase("ready");
  }, []);

  /* máquina do boot */
  useEffect(() => {
    if (phase !== "boot") return;

    /* 1. destaque do pagamento aparece PRIMEIRO */
    if (!showPayment) {
      const t = setTimeout(() => setShowPayment(true), 350);
      return () => clearTimeout(t);
    }

    /* 2. segura o destaque um instante, sozinho em cena, pra dar ênfase */
    if (!paymentSettled) {
      const t = setTimeout(() => setPaymentSettled(true), PAYMENT_HOLD_MS);
      return () => clearTimeout(t);
    }

    /* 3. só depois entram as linhas de scan (o "resto") */
    if (lineIndex < BOOT_LINES.length) {
      const target = BOOT_LINES[lineIndex];
      if (typedChars < target.length) {
        const t = setTimeout(() => {
          setTypedChars(typedChars + 1);
          setCurrentLine(target.slice(0, typedChars + 1));
        }, TYPE_SPEED);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setCompletedLines((prev) => [...prev, target]);
        setCurrentLine("");
        setTypedChars(0);
        setLineIndex(lineIndex + 1);
      }, PAUSE_BETWEEN_LINES);
      return () => clearTimeout(t);
    }

    if (progress < 100) {
      const t = setTimeout(() => {
        setProgress(Math.min(100, progress + PROGRESS_STEP_PCT));
      }, PROGRESS_STEP_MS);
      return () => clearTimeout(t);
    }

    if (!showFinal) {
      const t = setTimeout(() => setShowFinal(true), 420);
      return () => clearTimeout(t);
    }

    if (!showRedirect) {
      const t = setTimeout(() => setShowRedirect(true), 950);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setPhase("ready"), 1200);
    return () => clearTimeout(t);
  }, [
    phase,
    showPayment,
    paymentSettled,
    lineIndex,
    typedChars,
    progress,
    showFinal,
    showRedirect,
  ]);

  const skip = useCallback(() => setPhase("ready"), []);

  const filled = Math.floor((progress / 100) * BAR_WIDTH);
  const empty = BAR_WIDTH - filled;
  const progressBar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <div className="obg-page" data-phase={phase}>
      <Helmet>
        <title>Acesso liberado · Comida de Dragão</title>
        <meta
          name="description"
          content="Você está dentro da caverna do Dragão."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* ════ FASE BOOT — pop-up flutuante do @dragao ═══════════ */}
      {phase === "boot" && (
        <main className="obg-boot" aria-live="polite">
          <div className="obg-boot-window">
            <div className="obg-boot-titlebar">
              <span className="obg-boot-handle">
                @dragao
                <span className="obg-cursor-blink">_</span>
              </span>
              <span className="obg-boot-dots" aria-hidden="true">●●●</span>
            </div>

            <div className="obg-boot-inner">
              {showPayment && (
                <div className="obg-boot-payment" role="status">
                  <span className="obg-boot-payment-mark" aria-hidden="true">
                    {PAYMENT.mark}
                  </span>
                  <span className="obg-boot-payment-text">
                    <strong className="obg-boot-payment-title">
                      {PAYMENT.title}
                    </strong>
                    <span className="obg-boot-payment-sub">{PAYMENT.sub}</span>
                  </span>
                </div>
              )}

              {completedLines.map((line, i) => (
                <div key={i} className="obg-boot-line">{line}</div>
              ))}

              {lineIndex < BOOT_LINES.length && (
                <div className="obg-boot-line">
                  {currentLine}
                  <span className="obg-cursor">_</span>
                </div>
              )}

              {lineIndex >= BOOT_LINES.length && (
                <div className="obg-boot-line obg-boot-progress">
                  {`> ${progressBar} ${progress}%`}
                </div>
              )}

              {showFinal && (
                <div className="obg-boot-status" role="status">
                  <div className="obg-boot-status-head">
                    &gt; próximos passos
                  </div>
                  {ORDER_STATUS.map((step, i) => (
                    <div
                      key={i}
                      className={`obg-boot-status-step obg-step-${step.state}`}
                      style={{ animationDelay: `${i * 0.18}s` }}
                    >
                      <span className="obg-step-mark" aria-hidden="true">
                        {step.mark}
                      </span>
                      <span className="obg-step-text">
                        <strong className="obg-step-title">{step.title}</strong>
                        <span className="obg-step-sub">{step.sub}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {showRedirect && (
                <div className="obg-boot-line obg-boot-redirect">
                  &gt; abrindo portal
                  <span className="obg-cursor">_</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="obg-skip"
            onClick={skip}
            aria-label="Pular animação"
          >
            pular intro ››
          </button>
        </main>
      )}

      {/* ════ FASE READY — escolha uma porta ═════════════════════ */}
      {phase === "ready" && (
        <main className="obg-ready">
          <div className="obg-ready-header">
            <DragonLogo className="obg-ready-logo" />
            <div className="obg-ready-eyebrow">// você foi convidado</div>
            <h1 className="obg-ready-title">
              Entre na caverna<br />
              do <em>dragão.</em>
            </h1>
            <p className="obg-ready-sub">
              Tudo o que a gente tem de bom tá aqui dentro, do nosso jeito.
              Escolha a porta que mais te chama — passa o mouse e espia.
            </p>
          </div>

          {/* 3 portas com hover GIF */}
          <div className="obg-doors">
            {DOORS.map((door) => (
              <Link
                key={door.num}
                to="/portal"
                className={`obg-door obg-door-${door.color}`}
                aria-label={`Porta ${door.num} — entrar no portal`}
              >
                <div
                  className="obg-door-bg"
                  style={{ backgroundImage: `url('${door.gif}')` }}
                  aria-hidden="true"
                />
                <div className="obg-door-content">
                  <span className="obg-door-eyebrow">// porta {door.num}</span>
                  <span className="obg-door-num">{door.num}</span>
                  <span className="obg-door-arrow" aria-hidden="true">entrar →</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Faixa horizontal embaixo das portas — cupom como info discreta,
              não como protagonista. Largura combina com o grid das portas. */}
          <div className="obg-coupon-bar">
            <span className="obg-coupon-bar-label">// selo bônus</span>
            <span className="obg-coupon-bar-divider" aria-hidden="true">·</span>
            <span className="obg-coupon-bar-code">QUEROMAIS</span>
            <span className="obg-coupon-bar-divider" aria-hidden="true">·</span>
            <span className="obg-coupon-bar-meta">15% off</span>
            <span className="obg-coupon-bar-divider" aria-hidden="true">·</span>
            <span className="obg-coupon-bar-meta">válido 30 dias</span>
          </div>

          <footer className="obg-ready-footer">
            comida de dragão · let's fly sustentável<br />
            biofábrica MAPA — RJ 001924-0
          </footer>
        </main>
      )}
    </div>
  );
}
