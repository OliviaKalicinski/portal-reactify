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
          className="reels-modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) close(); }}
        >
          <button
            className="reels-modal-nav reels-modal-prev"
            onClick={prev}
            aria-label="Reel anterior"
          >‹</button>

          <div className="reels-modal-player">
            <button
              className="reels-modal-close"
              onClick={close}
              aria-label="Fechar"
            >✕</button>

            <video
              key={active.id}
              ref={modalVideoRef}
              src={active.src}
              autoPlay
              loop
              muted={muted}
              playsInline
              className="reels-modal-video"
              onClick={() => setMuted(m => !m)}
            />

            <div className="reels-modal-info">
              <div className="reels-modal-title">{active.title}</div>
              {active.caption && (
                <div className="reels-modal-caption">{active.caption}</div>
              )}
              <div className="reels-modal-actions">
                <button
                  className="reels-mute-btn"
                  onClick={() => setMuted(m => !m)}
                  type="button"
                >
                  {muted ? "🔇 Sem som — toque pra ouvir" : "🔊 Som ligado"}
                </button>
                {active.link && (
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reels-ig-btn"
                  >
                    Ver no Instagram →
                  </a>
                )}
              </div>
              <div className="reels-modal-counter">
                {activeIdx! + 1} / {reels.length}
              </div>
            </div>
          </div>

          <button
            className="reels-modal-nav reels-modal-next"
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

/* MODAL PLAYER */
.portal-page .reels-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.94);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(6px);
}
.portal-page .reels-modal-player {
  position: relative;
  width: min(400px, 92vw);
  aspect-ratio: 9 / 16;
  max-height: 90vh;
  background: #000;
  overflow: hidden;
  border-radius: 14px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.8);
}
.portal-page .reels-modal-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  display: block;
}
.portal-page .reels-modal-info {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: 16px 20px 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 70%, transparent 100%);
  color: #fff;
  pointer-events: none;
}
.portal-page .reels-modal-info > * { pointer-events: auto; }
.portal-page .reels-modal-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 0.01em;
  line-height: 1.05;
  margin-bottom: 4px;
}
.portal-page .reels-modal-caption {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  line-height: 1.4;
  margin-bottom: 12px;
}
.portal-page .reels-modal-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.portal-page .reels-mute-btn,
.portal-page .reels-ig-btn {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(0,0,0,0.3);
  color: rgba(255,255,255,0.9);
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}
.portal-page .reels-mute-btn:hover,
.portal-page .reels-ig-btn:hover {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.6);
}
.portal-page .reels-modal-counter {
  position: absolute;
  top: 14px;
  left: 18px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.1em;
}
.portal-page .reels-modal-close {
  position: absolute;
  top: 10px;
  right: 12px;
  background: rgba(0,0,0,0.5);
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.15s;
}
.portal-page .reels-modal-close:hover { background: rgba(0,0,0,0.85); }
.portal-page .reels-modal-nav {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: 28px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  margin: 0 14px;
  font-family: sans-serif;
}
.portal-page .reels-modal-nav:hover { background: rgba(255,255,255,0.22); }

@media (max-width: 768px) {
  .portal-page .reel-card { width: clamp(150px, 45vw, 200px); }
  .portal-page .reels-modal-nav { display: none; }
  .portal-page .reels-modal-close {
    top: 8px; right: 10px;
    width: 30px; height: 30px; font-size: 14px;
  }
}
`;
