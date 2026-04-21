import { useState, useCallback, useEffect } from "react";

/**
 * STRIPE LIST — faixas coloridas editorial estilo Slava Kornilov
 *
 * Cada item é uma faixa full-width com:
 *  - número circular (01, 02, 03...)
 *  - título curto GIGANTE em Bebas/Big Shoulders
 *  - categoria em tamanho menor embaixo
 *  - meta (veículo, tipo, dado-chave) à direita
 *  - seta →
 *
 * Faixas colam uma na outra e a faixa inferior corta ~20px do bottom
 * da superior — efeito editorial de "layering".
 *
 * Click em qualquer faixa abre modal com conteúdo completo.
 */

export interface StripeItem {
  id: string | number;
  category: string;
  title: string;
  shortTitle?: string;  // versão curta pra exibir na faixa (default: trunca title)
  summary: string;
  meta?: string;        // ex: "Exame · Matéria" ou "Nutrição · 2023"
  metaExtra?: string;   // 2a linha de meta na direita (ex: "88,9% digestibilidade")
  href: string;
}

interface Props {
  items: StripeItem[];
  stripeColors: Record<string, string>;
  openLabel?: string;
  emptyMessage?: string;
}

const StripeList = ({
  items,
  stripeColors,
  openLabel = "Abrir →",
  emptyMessage = "Nada pra mostrar.",
}: Props) => {
  const [activeId, setActiveId] = useState<string | number | null>(null);

  const active = items.find((i) => i.id === activeId);

  const closeModal = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      const h = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeModal();
      };
      document.addEventListener("keydown", h);
      return () => {
        document.removeEventListener("keydown", h);
        document.body.style.overflow = "";
      };
    }
  }, [active, closeModal]);

  if (items.length === 0) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="stripe-empty">{emptyMessage}</div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="stripe-list">
        {items.map((it, i) => {
          const color = stripeColors[it.category] || "#FFCC00";
          const shortTitle =
            it.shortTitle ||
            (it.title.length > 34 ? it.title.slice(0, 34).trim() + "…" : it.title);
          const summaryPreview =
            it.summary.length > 110
              ? it.summary.slice(0, 110).trim() + "…"
              : it.summary;
          return (
            <button
              key={it.id}
              type="button"
              className="stripe"
              style={{ backgroundColor: color, zIndex: i + 1 }}
              onClick={() => setActiveId(it.id)}
              aria-label={`Abrir: ${it.title}`}
            >
              <span className="stripe-number">{String(i + 1).padStart(2, "0")}</span>
              <div className="stripe-content">
                <div className="stripe-title">{shortTitle}</div>
                <div className="stripe-subtitle">{it.category}</div>
              </div>
              <div className="stripe-meta">
                {it.meta && <div className="stripe-meta-label">{it.meta}</div>}
                <div className="stripe-meta-text">
                  {it.metaExtra || summaryPreview}
                </div>
              </div>
              <span className="stripe-arrow">→</span>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          className="stripe-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="stripe-modal">
            <button
              type="button"
              className="stripe-modal-close"
              onClick={closeModal}
              aria-label="Fechar"
            >
              ✕
            </button>
            <div
              className="stripe-modal-category"
              style={{ color: stripeColors[active.category] || "#FFCC00" }}
            >
              {active.category}
            </div>
            {active.meta && <div className="stripe-modal-meta">{active.meta}</div>}
            <h3 className="stripe-modal-title">{active.title}</h3>
            <p className="stripe-modal-summary">{active.summary}</p>
            <div className="stripe-modal-actions">
              <a
                href={active.href}
                target="_blank"
                rel="noopener noreferrer"
                className="stripe-modal-open"
                style={{
                  background: stripeColors[active.category] || "#FFCC00",
                  borderColor: stripeColors[active.category] || "#FFCC00",
                }}
              >
                {openLabel}
              </a>
              <button
                type="button"
                className="stripe-modal-back"
                onClick={closeModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StripeList;

const STYLES = `
.stripe-list {
  position: relative;
  max-width: 1040px;
  margin: 24px auto 64px;
  padding: 0 20px;
}
.stripe {
  position: relative;
  display: grid;
  grid-template-columns: 68px 1fr 260px 48px;
  gap: 22px;
  align-items: center;
  padding: 26px 32px;
  min-height: 140px;
  background: transparent;
  border: none;
  color: #0A0A0A;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  width: 100%;
  transition: transform 0.22s ease;
}
.stripe:nth-child(n+2) { margin-top: -22px; }
.stripe:hover {
  transform: translateX(12px);
}

.stripe-number {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  border: 2.5px solid currentColor;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.stripe-content {
  min-width: 0;
}
.stripe-title {
  font-family: 'Big Shoulders Display', 'Bebas Neue', sans-serif;
  font-size: clamp(34px, 4.8vw, 60px);
  font-weight: 900;
  line-height: 0.92;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.stripe-subtitle {
  font-family: 'Big Shoulders Display', 'Bebas Neue', sans-serif;
  font-size: clamp(20px, 2.8vw, 36px);
  font-weight: 700;
  line-height: 0.92;
  opacity: 0.78;
  text-transform: uppercase;
  margin-top: 2px;
}

.stripe-meta {
  font-family: 'Space Grotesk', sans-serif;
  line-height: 1.4;
}
.stripe-meta-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-bottom: 6px;
  font-weight: 700;
  opacity: 0.78;
}
.stripe-meta-text {
  font-size: 12.5px;
  line-height: 1.45;
  opacity: 0.82;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stripe-arrow {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 34px;
  font-weight: 400;
  justify-self: end;
  line-height: 1;
  transition: transform 0.2s ease;
}
.stripe:hover .stripe-arrow {
  transform: translateX(6px);
}

.stripe-empty {
  max-width: 1040px;
  margin: 48px auto;
  padding: 60px 20px;
  text-align: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  color: rgba(255,255,255,0.4);
}

/* MODAL */
.stripe-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  backdrop-filter: blur(6px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.stripe-modal {
  position: relative;
  max-width: 640px;
  width: 100%;
  max-height: 86vh;
  background: linear-gradient(140deg, #0e0e0e 0%, #161616 100%);
  border: 1px solid rgba(255,255,255,0.12);
  padding: 36px 40px 32px;
  overflow-y: auto;
  animation: stripe-modal-in 0.25s ease;
}
@keyframes stripe-modal-in {
  from { opacity: 0; transform: scale(0.97) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.stripe-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 18px;
  cursor: pointer;
  padding: 6px 10px;
  transition: color 0.15s;
}
.stripe-modal-close:hover { color: #fff; }
.stripe-modal-category {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 6px;
}
.stripe-modal-meta {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.42);
  margin-bottom: 14px;
}
.stripe-modal-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(24px, 3.2vw, 34px);
  line-height: 1.05;
  letter-spacing: 0.01em;
  color: #fff;
  margin: 0 0 18px;
  font-weight: 400;
}
.stripe-modal-summary {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  line-height: 1.65;
  color: rgba(255,255,255,0.82);
  margin: 0 0 24px;
}
.stripe-modal-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.stripe-modal-open {
  color: #0A0A0A;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 15px;
  letter-spacing: 0.12em;
  padding: 12px 22px;
  text-decoration: none;
  border: 2px solid;
  transition: transform 0.15s, box-shadow 0.2s;
}
.stripe-modal-open:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(255,204,0,0.3);
}
.stripe-modal-back {
  background: transparent;
  color: rgba(255,255,255,0.5);
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 12px 18px;
  border: 1px solid rgba(255,255,255,0.15);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.stripe-modal-back:hover {
  color: #fff;
  border-color: rgba(255,255,255,0.4);
}

/* MOBILE */
@media (max-width: 768px) {
  .stripe {
    grid-template-columns: 52px 1fr 36px;
    gap: 14px;
    padding: 18px 20px;
    min-height: 110px;
  }
  .stripe-number {
    width: 46px;
    height: 46px;
    font-size: 22px;
  }
  .stripe-meta { display: none; }
  .stripe-title { font-size: clamp(28px, 9vw, 48px); }
  .stripe-subtitle { font-size: clamp(16px, 5vw, 26px); }
  .stripe-arrow { font-size: 26px; }
  .stripe:nth-child(n+2) { margin-top: -18px; }
}
`;
