import { useMemo, useState, useCallback, useEffect } from "react";

/**
 * ARCHIVE LIST — lista leve estilo "arquivo" reutilizável
 *
 * Usado por: Biblioteca (artigos científicos) e Imprensa (links de mídia)
 *
 * UX:
 *  - Cada item aparece como uma linha compacta (categoria + título + seta)
 *  - Busca por texto filtra título/resumo/meta
 *  - Chips de categoria filtram visualmente (cor pequena, não dominante)
 *  - Click em qualquer linha abre modal com resumo completo + botão pro link/pdf
 *
 * Design: conteúdo primeiro, marca no detalhe.
 */

export interface ArchiveItem {
  id: string | number;
  category: string;
  title: string;
  summary: string;
  meta?: string;          // ex: "G1 · Matéria" ou "2023 · Review"
  href: string;
  external?: boolean;     // true = abre em nova aba (default true)
}

interface Props {
  items: ArchiveItem[];
  categoryColors: Record<string, string>;
  searchPlaceholder?: string;
  openLabel?: string;
  emptyMessage?: string;
  stats?: Array<{ num: string; label: string }>;
}

const ArchiveList = ({
  items,
  categoryColors,
  searchPlaceholder = "Buscar por palavra-chave...",
  openLabel = "Abrir →",
  emptyMessage = "Nada encontrado. Tenta outra busca.",
  stats,
}: Props) => {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todas");
  const [activeId, setActiveId] = useState<string | number | null>(null);

  const categorias = useMemo(() => {
    const seen = new Set<string>();
    items.forEach((i) => seen.add(i.category));
    return Array.from(seen);
  }, [items]);

  const filtered = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return items.filter((it) => {
      const matchCat = categoriaAtiva === "Todas" || it.category === categoriaAtiva;
      if (!matchCat) return false;
      if (!termo) return true;
      return (
        it.title.toLowerCase().includes(termo) ||
        it.summary.toLowerCase().includes(termo) ||
        (it.meta?.toLowerCase().includes(termo) ?? false) ||
        it.category.toLowerCase().includes(termo)
      );
    });
  }, [items, busca, categoriaAtiva]);

  const activeItem = useMemo(
    () => items.find((i) => i.id === activeId) ?? null,
    [items, activeId]
  );

  const closeModal = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (activeItem) {
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
  }, [activeItem, closeModal]);

  return (
    <>
      <style>{ARCHIVE_STYLES}</style>

      {stats && stats.length > 0 && (
        <div className="archive-stats">
          {stats.map((s, i) => (
            <div className="archive-stat" key={i}>
              <span className="archive-stat-num">{s.num}</span>
              <span className="archive-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="archive-controls">
        <input
          type="text"
          className="archive-search"
          placeholder={searchPlaceholder}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="archive-chips">
          <button
            type="button"
            className={`archive-chip${categoriaAtiva === "Todas" ? " active" : ""}`}
            onClick={() => setCategoriaAtiva("Todas")}
          >
            Todas <span className="archive-chip-count">{items.length}</span>
          </button>
          {categorias.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            const active = categoriaAtiva === cat;
            const color = categoryColors[cat];
            return (
              <button
                type="button"
                key={cat}
                className={`archive-chip${active ? " active" : ""}`}
                onClick={() => setCategoriaAtiva(cat)}
                style={active && color ? { borderColor: color, color } : undefined}
              >
                <span
                  className="archive-chip-dot"
                  style={{ background: color ?? "#888" }}
                />
                {cat} <span className="archive-chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="archive-count">
        {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
      </div>

      <div className="archive-list">
        {filtered.map((it) => {
          const color = categoryColors[it.category] ?? "#888";
          return (
            <button
              type="button"
              key={it.id}
              className="archive-row"
              onClick={() => setActiveId(it.id)}
            >
              <span className="archive-row-dot" style={{ background: color }} />
              <div className="archive-row-main">
                <div className="archive-row-meta">
                  <span className="archive-row-cat" style={{ color }}>
                    {it.category}
                  </span>
                  {it.meta && <span className="archive-row-submeta">· {it.meta}</span>}
                </div>
                <div className="archive-row-title">{it.title}</div>
              </div>
              <span className="archive-row-arrow">→</span>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="archive-empty">{emptyMessage}</div>
        )}
      </div>

      {activeItem && (
        <div
          className="archive-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="archive-modal">
            <button
              type="button"
              className="archive-modal-close"
              onClick={closeModal}
              aria-label="Fechar"
            >
              ✕
            </button>
            <div className="archive-modal-header">
              <span
                className="archive-row-dot"
                style={{ background: categoryColors[activeItem.category] ?? "#888" }}
              />
              <span
                className="archive-modal-cat"
                style={{ color: categoryColors[activeItem.category] ?? "#888" }}
              >
                {activeItem.category}
              </span>
              {activeItem.meta && (
                <span className="archive-modal-submeta">· {activeItem.meta}</span>
              )}
            </div>
            <h3 className="archive-modal-title">{activeItem.title}</h3>
            <p className="archive-modal-summary">{activeItem.summary}</p>
            <div className="archive-modal-actions">
              <a
                href={activeItem.href}
                target={activeItem.external !== false ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="archive-modal-open"
              >
                {openLabel}
              </a>
              <button
                type="button"
                className="archive-modal-back"
                onClick={closeModal}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArchiveList;

/* ======= CSS embutido =======
   Quando consolidar depois, move pra Portal.css e remove este bloco. */
const ARCHIVE_STYLES = `
/* STATS STRIP */
.portal-page .archive-stats {
  max-width: 1040px;
  margin: 0 auto 16px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
}
.portal-page .archive-stat {
  background: var(--dragon-gray);
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.portal-page .archive-stat-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px;
  color: var(--skin-accent);
  line-height: 1;
  letter-spacing: 0.01em;
}
.portal-page .archive-stat-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
}

/* CONTROLS (search + chips) */
.portal-page .archive-controls {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 20px;
}
.portal-page .archive-search {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 0;
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, background 0.15s;
}
.portal-page .archive-search::placeholder {
  color: rgba(255,255,255,0.35);
  font-family: 'Space Grotesk', sans-serif;
}
.portal-page .archive-search:focus {
  border-color: var(--skin-accent);
  background: rgba(255,255,255,0.06);
}
.portal-page .archive-chips {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.portal-page .archive-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.14);
  color: rgba(255,255,255,0.7);
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.portal-page .archive-chip:hover {
  border-color: rgba(255,255,255,0.35);
  color: rgba(255,255,255,0.95);
}
.portal-page .archive-chip.active {
  background: rgba(255,255,255,0.06);
  color: #fff;
  border-color: rgba(255,255,255,0.5);
}
.portal-page .archive-chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.portal-page .archive-chip-count {
  opacity: 0.55;
  margin-left: 2px;
  font-weight: 400;
}

/* COUNT RESULT */
.portal-page .archive-count {
  max-width: 1040px;
  margin: 20px auto 10px;
  padding: 0 20px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
}

/* LIST — rows */
.portal-page .archive-list {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 20px 48px;
  display: flex;
  flex-direction: column;
}
.portal-page .archive-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 16px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
  transition: background 0.15s, padding-left 0.15s;
  width: 100%;
}
.portal-page .archive-row:hover {
  background: rgba(255,255,255,0.03);
  padding-left: 22px;
}
.portal-page .archive-row-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.04);
}
.portal-page .archive-row-main {
  flex: 1;
  min-width: 0;
}
.portal-page .archive-row-meta {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 4px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.portal-page .archive-row-cat {
  font-weight: 700;
}
.portal-page .archive-row-submeta {
  color: rgba(255,255,255,0.4);
}
.portal-page .archive-row-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  line-height: 1.4;
  color: #fff;
  font-weight: 500;
}
.portal-page .archive-row:hover .archive-row-title {
  color: var(--skin-accent);
}
.portal-page .archive-row-arrow {
  color: rgba(255,255,255,0.35);
  font-size: 18px;
  flex-shrink: 0;
  transition: color 0.15s, transform 0.15s;
}
.portal-page .archive-row:hover .archive-row-arrow {
  color: var(--skin-accent);
  transform: translateX(4px);
}

/* EMPTY */
.portal-page .archive-empty {
  padding: 60px 20px;
  text-align: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  color: rgba(255,255,255,0.4);
}

/* MODAL — leitura */
.portal-page .archive-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.88);
  backdrop-filter: blur(6px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.portal-page .archive-modal {
  position: relative;
  max-width: 640px;
  width: 100%;
  max-height: 86vh;
  background: linear-gradient(140deg, #0e0e0e 0%, #161616 100%);
  border: 1px solid rgba(255,255,255,0.12);
  padding: 36px 40px 32px;
  overflow-y: auto;
  animation: archive-modal-in 0.25s ease;
}
@keyframes archive-modal-in {
  from { opacity: 0; transform: scale(0.97) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.portal-page .archive-modal-close {
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
.portal-page .archive-modal-close:hover { color: #fff; }

.portal-page .archive-modal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.portal-page .archive-modal-cat {
  font-weight: 700;
}
.portal-page .archive-modal-submeta {
  color: rgba(255,255,255,0.4);
}
.portal-page .archive-modal-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(24px, 3.2vw, 34px);
  line-height: 1.05;
  letter-spacing: 0.01em;
  color: #fff;
  margin: 0 0 18px;
  font-weight: 400;
}
.portal-page .archive-modal-summary {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15px;
  line-height: 1.65;
  color: rgba(255,255,255,0.82);
  margin: 0 0 24px;
}
.portal-page .archive-modal-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.portal-page .archive-modal-open {
  background: var(--skin-accent);
  color: var(--dragon-black);
  font-family: 'Bebas Neue', sans-serif;
  font-size: 15px;
  letter-spacing: 0.12em;
  padding: 12px 22px;
  text-decoration: none;
  border: 2px solid var(--skin-accent);
  transition: transform 0.15s, box-shadow 0.2s;
}
.portal-page .archive-modal-open:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(255,122,0,0.3);
}
.portal-page .archive-modal-back {
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
.portal-page .archive-modal-back:hover {
  color: #fff;
  border-color: rgba(255,255,255,0.4);
}

/* ARCHIVE HERO — idêntico ao hero da Parceiros (padrão da marca) */
.portal-page .archive-hero {
  position: relative;
  background: var(--dragon-black);
  overflow: hidden;
  border-bottom: 4px solid var(--skin-accent);
  padding: 72px 24px 64px;
  min-height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.portal-page .archive-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 60% at 50% 110%, rgba(123,255,0,0.16) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 80% 20%, rgba(0,217,111,0.08) 0%, transparent 60%),
    var(--dragon-black);
  z-index: 1;
}
.portal-page .archive-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px,
    transparent 1px, transparent 3px
  );
  pointer-events: none;
  z-index: 2;
}
.portal-page .archive-hero .dragon-silhouette {
  position: absolute;
  right: 4%;
  bottom: -10%;
  font-size: min(40vw, 420px);
  line-height: 1;
  opacity: 0.06;
  filter: grayscale(1);
  user-select: none;
  pointer-events: none;
  z-index: 1;
}
.portal-page .archive-hero-content {
  position: relative;
  z-index: 3;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  width: 100%;
  padding: 0 8px;
}
.portal-page .archive-backlink {
  display: inline-block;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: lowercase;
  color: rgba(250,250,250,0.5);
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.18s;
}
.portal-page .archive-backlink:hover { color: var(--skin-accent); }

.portal-page .archive-hero .hero-logo {
  margin-top: 4px;
  margin-bottom: 24px;
}

.portal-page .archive-hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(44px, 6.5vw, 82px);
  line-height: 0.92;
  color: var(--dragon-white);
  letter-spacing: 0.5px;
  margin-bottom: 22px;
}
.portal-page .archive-hero-title span {
  color: var(--skin-accent);
  display: block;
}

.portal-page .archive-hero-sub {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  color: rgba(250,250,250,0.72);
  line-height: 1.6;
  max-width: 540px;
  margin: 0 auto 24px;
}

@media (max-width: 640px) {
  .portal-page .archive-modal { padding: 28px 24px 24px; }
  .portal-page .archive-stats { grid-template-columns: 1fr 1fr; }
}
`;
