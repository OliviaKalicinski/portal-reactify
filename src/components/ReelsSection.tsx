import { useState, useRef, useEffect, useCallback } from "react";

/**
 * REELS SECTION — estilo Reels/Shorts nativo no portal
 *
 * Como usar:
 * 1. Crie a pasta /public/assets/videos/reels/ no repo
 * 2. Coloque os MP4 verticais (9:16) lá dentro
 * 3. Edite o array REELS abaixo com o nome do arquivo, título, caption e link
 * 4. Importe no Portal.tsx e renderize: <ReelsSection />
 *
 * Specs recomendadas dos vídeos:
 * - Formato: MP4 (H.264)
 * - Aspect: 9:16 vertical
 * - Resolução: 720x1280 (HD) ou 1080x1920 (Full HD)
 * - Duração: 10–60s
 * - Peso: ≤ 10MB cada (pra não pesar o portal)
 */

export interface Reel {
  id: string;
  src: string;      // ex: /assets/videos/reels/reel-01.mp4
  poster?: string;  // primeira frame opcional (acelera carregamento)
  title: string;
  caption?: string;
  link?: string;    // link pro post original no Instagram/TikTok
}

// Reels que estão na pasta /public/assets/videos/
// Pra adicionar novos: jogue o MP4 vertical lá e adicione um objeto aqui.
const DEFAULT_REELS: Reel[] = [
  {
    id: "r1",
    src: "/assets/videos/REELS_INFLUENCERS_0210_3_V1.mp4",
    title: "Influenciador experimenta",
    caption: "Cara de quem nunca viu inseto até ver o pet devorando.",
    link: "https://www.instagram.com/comidadedragao",
  },
  {
    id: "r2",
    src: "/assets/videos/REELS_INFLUENCERS_0210_5_V1.mp4",
    title: "Do resíduo à proteína",
    caption: "Bastidor real — 45 dias da BSF até o pote.",
    link: "https://www.instagram.com/comidadedragao",
  },
];

interface Props {
  reels?: Reel[];
  title?: string;
  subtitle?: string;
  seeAllUrl?: string;
  seeAllLabel?: string;
}

const ReelsSection = ({
  reels = DEFAULT_REELS,
  title = "Reels do Dragão",
  subtitle,
  seeAllUrl = "https://www.instagram.com/comidadedragao",
  seeAllLabel = "Ver tudo no @comidadedragao →",
}: Props) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const open = useCallback((i: number) => {
    setActiveIdx(i);
    setMuted(true);
  }, []);

  const close = useCallback(() => {
    setActiveIdx(null);
    modalVideoRef.current?.pause();
  }, []);

  const prev = useCallback(() => {
    setActiveIdx(i => (i === null ? null : (i - 1 + reels.length) % reels.length));
  }, [reels.length]);

  const next = useCallback(() => {
    setActiveIdx(i => (i === null ? null : (i + 1) % reels.length));
  }, [reels.length]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === " ") {
        e.preventDefault();
        const v = modalVideoRef.current;
        if (v) v.paused ? v.play().catch(() => {}) : v.pause();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [activeIdx, close, prev, next]);

  // Body scroll lock + autoplay on open
  useEffect(() => {
    if (activeIdx !== null) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => {
        modalVideoRef.current?.play().catch(() => {});
      }, 80);
      return () => { clearTimeout(t); document.body.style.overflow = ""; };
    } else {
      document.body.style.overflow = "";
    }
  }, [activeIdx]);

  const active = activeIdx !== null ? reels[activeIdx] : null;

  return (
    <>
      <style>{REELS_STYLES}</style>
      <div className="section-label" style={{ marginTop: 40 }}>{title}</div>
      {subtitle && <div className="reels-subtitle">{subtitle}</div>}
      <div className="reels-strip-wrap">
        <div className="reels-strip">
          {reels.map((r, i) => (
            <ReelCard key={r.id} reel={r} onClick={() => open(i)} />
          ))}
        </div>
        {seeAllUrl && (
          <a
            href={seeAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reels-see-all"
          >
            {seeAllLabel}
          </a>
        )}
      </div>

      {active && (
        <div
          className="reels-riso-overlay"
          onClick={e => { if (e.target === e.currentTarget) close(); }}
        >
          <button
            className="reels-riso-nav reels-riso-prev"
            onClick={prev}
            aria-label="Reel anterior"
          >‹</button>

          <article className="reels-riso" role="dialog">
            <button
              className="reels-riso-close"
              onClick={close}
              aria-label="Fechar"
            >×</button>

            <div className="reels-riso-frame">
              <span className="reels-riso-counter">{activeIdx! + 1}/{reels.length}</span>
              <video
                key={active.id}
                ref={modalVideoRef}
                src={active.src}
                autoPlay
                loop
                muted={muted}
                playsInline
                className="reels-riso-video"
              />
              <button
                className="reels-mute-btn"
                onClick={() => setMuted(m => !m)}
                type="button"
                aria-label={muted ? "Ativar som" : "Mutar"}
              >{muted ? "🔇 SOM" : "🔊 SOM"}</button>
            </div>
          </article>

          <button
            className="reels-riso-nav reels-riso-next"
            onClick={next}
            aria-label="Próximo reel"
          >›</button>
        </div>
      )}
    </>
  );
};

/* Thumbnail individual com hover-preview */
const ReelCard = ({ reel, onClick }: { reel: Reel; onClick: () => void }) => {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleEnter = () => {
    setIsHovering(true);
    const v = vidRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };
  const handleLeave = () => {
    setIsHovering(false);
    const v = vidRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <button
      type="button"
      className="reel-card"
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      aria-label={`Abrir reel: ${reel.title}`}
    >
      <video
        ref={vidRef}
        src={reel.src}
        poster={reel.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="reel-card-video"
      />
      <div className={`reel-card-overlay${isHovering ? " hovering" : ""}`}>
        <div className="reel-card-play">▶</div>
        <div className="reel-card-title">{reel.title}</div>
      </div>
    </button>
  );
};

export default ReelsSection;

/* ===== CSS embutido no componente (preview standalone) =====
   Quando a gente consolidar tudo, movo essas regras pro Portal.css
   e removo este bloco. */
const REELS_STYLES = `
.portal-page .reels-subtitle {
  max-width: 1280px;
  margin: 0 auto 8px;
  padding: 0 20px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  line-height: 1.5;
}
.portal-page .reels-strip-wrap {
  max-width: 1280px;
  margin: 0 auto;
  padding: 8px 20px 4px;
  position: relative;
}
.portal-page .reels-strip {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;
}
.portal-page .reels-strip::-webkit-scrollbar { height: 6px; }
.portal-page .reels-strip::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
  border-radius: 3px;
}
.portal-page .reel-card {
  flex: 0 0 auto;
  width: clamp(180px, 18vw, 240px);
  aspect-ratio: 9 / 16;
  position: relative;
  background: var(--dragon-gray);
  border: 2px solid rgba(255,255,255,0.08);
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  scroll-snap-align: start;
  transition: transform 0.18s, border-color 0.18s;
  font-family: inherit;
  border-radius: 0;
  color: inherit;
}
.portal-page .reel-card:hover {
  transform: translateY(-3px);
  border-color: var(--skin-accent);
}
.portal-page .reel-card-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #000;
}
.portal-page .reel-card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 14px;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%);
  pointer-events: none;
  transition: opacity 0.2s;
}
.portal-page .reel-card-overlay.hovering {
  background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%);
}
.portal-page .reel-card-play {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 34px;
  color: rgba(255,255,255,0.92);
  text-shadow: 0 2px 14px rgba(0,0,0,0.7);
  transition: opacity 0.2s, transform 0.25s;
  pointer-events: none;
}
.portal-page .reel-card-overlay.hovering .reel-card-play {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.3);
}
.portal-page .reel-card-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 12px;
  color: var(--dragon-white);
  line-height: 1.35;
  position: relative;
  z-index: 2;
  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.portal-page .reels-see-all {
  display: inline-block;
  margin-top: 10px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--skin-accent);
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.portal-page .reels-see-all:hover { opacity: 1; }

/* ============================================================
   MODAL PLAYER — RISOGRAPH DO DRAGÃO (combo 9: lime + orange)
   ============================================================ */
.reels-riso-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10,10,10,0.85);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: reels-riso-fade 0.22s ease;
}
@keyframes reels-riso-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.reels-riso {
  position: relative;
  width: min(calc(78vh * 9 / 16), 92vw);
  max-height: 92vh;
  padding: 14px;
  background: #7BFF00;
  color: #0A0A0A;
  font-family: 'Space Grotesk', sans-serif;
  box-shadow:
    0 0 0 2.5px #0A0A0A,
    12px 14px 0 0 #0A0A0A;
  overflow: hidden;
  animation: reels-riso-pop 0.24s cubic-bezier(0.2, 0.9, 0.4, 1.4);
}
@keyframes reels-riso-pop {
  from { opacity: 0; transform: scale(0.94) translateY(14px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.reels-riso::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  mix-blend-mode: multiply;
  opacity: 1;
  pointer-events: none;
  z-index: 1;
}
.reels-riso > * { position: relative; z-index: 2; }

.reels-riso-strip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 9px;
  background: #0A0A0A;
  z-index: 3;
}
.reels-riso-strip::after {
  content: '';
  position: absolute;
  top: 5px;
  left: 0;
  right: 0;
  height: 4px;
  background: #FF7A00;
}

.reels-riso-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border: 2.5px solid #0A0A0A;
  background: #FAFAFA;
  color: #0A0A0A;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  z-index: 10;
  padding: 0;
  line-height: 1;
  transition: transform 0.15s;
}
.reels-riso-close:hover { transform: rotate(90deg); }

.reels-riso-pagenum {
  position: absolute;
  font-family: 'Archivo Black', 'Bebas Neue', sans-serif;
  font-size: 240px;
  line-height: 0.78;
  opacity: 0.09;
  bottom: -28px;
  right: -14px;
  pointer-events: none;
  z-index: 1;
  letter-spacing: -0.04em;
  color: #0A0A0A;
  font-weight: 900;
}

.reels-riso-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 4px 8px;
  display: inline-block;
  border: 1.5px solid #0A0A0A;
  background: rgba(0,0,0,0.08);
  margin-bottom: 12px;
  color: #0A0A0A;
}

.reels-riso-frame {
  aspect-ratio: 9 / 16;
  width: 100%;
  max-height: calc(92vh - 28px);
  border: 3px solid #0A0A0A;
  background: #000;
  position: relative;
  box-shadow: 5px 5px 0 rgba(0,0,0,0.35);
  overflow: hidden;
}
.reels-riso-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
}
.reels-riso-frame::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom, transparent 0 2px, rgba(255,255,255,0.04) 2px 3px
  );
  pointer-events: none;
  z-index: 3;
}
.reels-riso-counter {
  position: absolute;
  top: 10px;
  left: 12px;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  background: rgba(10,10,10,0.85);
  color: #FF7A00;
  padding: 3px 7px;
  z-index: 5;
  border: 1.5px solid #FF7A00;
}

.reels-mute-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 6;
  background: rgba(10,10,10,0.82);
  border: 1.5px solid #7BFF00;
  color: #7BFF00;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  padding: 5px 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.reels-mute-btn:hover { background: rgba(10,10,10,1); }

/* Navegação lateral */
.reels-riso-nav {
  background: #7BFF00;
  border: 2.5px solid #0A0A0A;
  color: #0A0A0A;
  font-size: 26px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 14px;
  font-family: sans-serif;
  flex-shrink: 0;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.6);
  transition: transform 0.12s, box-shadow 0.12s;
}
.reels-riso-nav:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgba(0,0,0,0.7);
}

@media (max-width: 768px) {
  .portal-page .reel-card { width: clamp(150px, 45vw, 200px); }
  .reels-riso-nav { display: none; }
  .reels-riso { box-shadow: 0 0 0 2px #0A0A0A, 8px 10px 0 #0A0A0A; padding: 24px 20px 22px; }
  .reels-riso-pagenum { font-size: 180px; }
}

`;
