import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import ReelsSection from "@/components/ReelsSection";
import "./Portal.css";

const PORTAL_COVER = "/assets/images/" + encodeURIComponent("PORTAL COMIDA DE DRAGÃO.png");

const CARD_HOVER_IMAGES: Record<string, string> = {
  manifesto:  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2FuY2JjbDV0aXdjNWgwOHhvcWZqY3ozZWZoZ3FoaXVtNzZ2aDRuOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mrTjb8ZXFeJdC/giphy.gif",
  quiz:       "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJxNHpkYTNjYmI2cTlpOTV4ZTQxZG5ia3VpMnpvamNuZjBzdWEwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1kkxWqT5nvLXupUTwK/giphy.gif",
  audio:      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm13bXZicTVvNWZncXdubnp5NDU4NTd3Y2t4bTU5bWZhcnZqNm0wYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/521JGiED6zWanTJroD/giphy.gif",
  produtos:   "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmMzczJyY2V0YjRhdG16NXdlMzJxcXNneHpuYTR5aWY1M3hwOHk4NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DZ1NZce3T5Q3e/giphy.gif",
  biofabrica: "/assets/images/biofabrica-exterior.jpeg",
  biofabrica_hover: "/assets/images/hover-biofabrica.gif",
  manual:     "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmk2dzZwdTZlemFiZGVkanMzdnZhMXp4bjBsb2VrcHl5NmI4NXc4bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Z9tvqoD1SEQcomTVaK/giphy.gif",
  youtube:    "/assets/images/portal-comida-dragao.png",
  companion:  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGF4YzU2Y21wcnZwOWp5azlhbG44ejJ0bm5tb2Uyc3QwdXo5YW4xaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tyEj6eMv4YAgg/giphy.gif",
  instagram:  "/assets/images/matilha.png",
  whatsapp:   "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2RzczUzNDA0eHg1ZXg4czhoemg4aXIybXprMGd6eGJrYzdzMm9zMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/y0mkt9yBEsrPW/giphy.gif",
  lojas:      "/assets/images/biofabrica-interior.jpeg",
  email:      "/assets/images/hover-email.gif",
  consumer:   "/assets/images/Frente.png",
  influencer: "/assets/images/poster-punk-converte.png",
  seller:     "/assets/images/poster-punk-gato.png",
  amazon:     "/assets/images/larva-pets-amam.jpg",
  ml:         "/assets/images/estranho-cultural.jpg",
  petlove:    "/assets/images/instinto-nao-erra.jpg",
  oficial:    "/assets/images/logo-preto.png",
};

const HoverBg = ({ imgKey }: { imgKey: string }) => (
  <div
    className="card-img-hover"
    style={{ backgroundImage: `url('${CARD_HOVER_IMAGES[imgKey]}')` }}
  />
);

const MARQUEE_TOP = [
  "NOJENTO É O DESPERDÍCIO",
  "MAIS QUE UM ALIMENTO, UMA REVOLUÇÃO",
  "88,9% DE DIGESTIBILIDADE",
  "40% PROTEÍNA BRUTA",
  "O DRAGÃO VIU E TE AVISOU",
  "INSETO BSF PRA CACHORRO",
  "SUSTENTABILIDADE DE VERDADE",
];

const MARQUEE_BOTTOM = [
  "@COMIDADEDRAGAO",
  "SOMOS@LETSFLY.COM.BR",
  "CACHOEIRAS DE MACACU, RJ",
  "🐉 O DRAGÃO VÊ TUDO",
  "INCLUSIVE O CARRINHO QUE VOCÊ ABANDONOU ÀS 2H DA MANHÃ",
  "BSF — BLACK SOLDIER FLY",
  "NUTRIÇÃO QUE RESPEITA O PLANETA",
];


const PRODUCTS_LIST = [
  { icon: "🐛", name: "ORIGINAL BSF", who: "Todos os pets", delay: "0s" },
  { icon: "🌿", name: "MORDIDA LEGUMES", who: "Só cães", delay: "0.07s" },
  { icon: "🌀", name: "MORDIDA SPIRULINA", who: "Só cães", delay: "0.13s" },
  { icon: "💊", name: "SUPLEMENTO", who: "Cães + gatos", delay: "0.19s" },
  { icon: "🐉", name: "GRUB GEL", who: "Répteis + anfíbios", delay: "0.25s" },
];

const MarqueeBar = ({ items, bottom = false }: { items: string[]; bottom?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-bar${bottom ? " bottom" : ""}`}>
      <div className="marquee-track" style={bottom ? { animationDirection: "reverse" } : undefined}>
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
};

const Portal = () => {
  const [skin, setSkin] = useState(1);
  const [heroName, setHeroName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [perguntasOpen, setPerguntasOpen] = useState(false);
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [nameGreeting, setNameGreeting] = useState("");
  
  const [audioOpen, setAudioOpen] = useState(false);
  const [audioMinimized, setAudioMinimized] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Modal drag state
  const modalWindowRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{ dragging: boolean; sx: number; sy: number; ol: number; ot: number; left: number; top: number; manual: boolean }>({ dragging: false, sx: 0, sy: 0, ol: 0, ot: 0, left: 0, top: 0, manual: false });

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setDragState(prev => ({ ...prev, manual: false }));
  }, []);
  const openManifesto = useCallback(() => setManifestoOpen(true), []);
  const closeManifesto = useCallback(() => setManifestoOpen(false), []);
  const openCatalog = useCallback(() => setCatalogOpen(true), []);
  const closeCatalog = useCallback(() => setCatalogOpen(false), []);
  const openPerguntas = useCallback(() => setPerguntasOpen(true), []);
  const closePerguntas = useCallback(() => setPerguntasOpen(false), []);
  const closeNameModal = useCallback(() => setNameModalOpen(false), []);

  const triggerNameGreeting = useCallback(() => {
    const clean = heroName.trim();
    if (clean.length < 2) return;
    const messages = [
      "o Dragão te esperava. Segue o fio.",
      "esse nome tem força. Bem-vindo à matilha.",
      "você chegou no lugar certo. Agora explora.",
      "seu pet tem sorte. O Dragão aprovou.",
      "o Dragão me avisou. Já tava de olho em você.",
      "sabia que você ia aparecer. Tá tudo pronto aí embaixo.",
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    setNameGreeting(msg);
    setNameModalOpen(true);
  }, [heroName]);
  const openAudio = useCallback(() => {
    setAudioOpen(true);
    setAudioMinimized(false);
    setTimeout(() => {
      audioRef.current?.play().then(() => setAudioPlaying(true)).catch(() => {});
    }, 100);
  }, []);
  const closeAudio = useCallback(() => {
    audioRef.current?.pause();
    setAudioPlaying(false);
    setAudioOpen(false);
    setAudioMinimized(false);
  }, []);

  // Keyboard Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { closeModal(); closeManifesto(); closeCatalog(); closePerguntas(); closeNameModal(); } };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeModal]);

  // Body overflow lock when any modal is open
  useEffect(() => {
    if (modalOpen || manifestoOpen || perguntasOpen || nameModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen, manifestoOpen, perguntasOpen]);

  // Modal drag
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragState.dragging) return;
      setDragState(prev => ({ ...prev, left: prev.ol + e.clientX - prev.sx, top: prev.ot + e.clientY - prev.sy }));
    };
    const onUp = () => { setDragState(prev => ({ ...prev, dragging: false })); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [dragState.dragging]);

  const handleTitlebarMouseDown = (e: React.MouseEvent) => {
    const win = modalWindowRef.current;
    if (!win) return;
    const r = win.getBoundingClientRect();
    setDragState({ dragging: true, sx: e.clientX, sy: e.clientY, ol: r.left, ot: r.top, left: r.left, top: r.top, manual: true });
  };


  const nameUpper = heroName.trim().toUpperCase();

  const heroTaglineContent = (
    <>
      <span className="hero-tagline-main">ALIMENTO PARA PETS À BASE DE INSETO.</span>
      {nameUpper ? (
        <span className="hero-tagline-sub">
          <span className="hero-tagline-name">{nameUpper}</span>, SE VOCÊ CHEGOU AQUI, JÁ FAZ PARTE DA REVOLUÇÃO.
          <span className="hero-tagline-fio">segue o fio...</span>
        </span>
      ) : (
        <span className="hero-tagline-sub hero-tagline-sub-empty">
          digite seu nome e segue o fio...
        </span>
      )}
    </>
  );

  const footerText = nameUpper
    ? `🐉 O Dragão viu, ${nameUpper}. O Dragão aprovou. Agora é sua vez.`
    : "🐉 O Dragão viu. O Dragão aprovou. Agora é sua vez.";

  return (
    <div className={`portal-page skin-${skin}`}>
      <style>{`
        .card-img-hover {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 0.45s ease;
          z-index: 0;
          border-radius: inherit;
        }
        .card:hover .card-img-hover { opacity: 1; }
        .card-inner, .card-body, .card-reveal,
        .quiz-bg, .quiz-step { position: relative; z-index: 1; }
      `}</style>
      {/* TOP MARQUEE */}
      <MarqueeBar items={MARQUEE_TOP} />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="dragon-silhouette">🐉</div>
        <div className="hero-content">
          <div className="hero-eyebrow">Comida de Dragão — Hub da Marca</div>
          <DragonLogo className="hero-logo" />
          <p className="hero-tagline">{heroTaglineContent}</p>
          <div className="hero-name-wrap">
            <span className="hero-name-label">pra quem é?</span>
            <input
              type="text"
              className="hero-name-input"
              placeholder="SEU NOME AQUI"
              maxLength={16}
              autoComplete="off"
              spellCheck={false}
              value={heroName}
              onChange={e => setHeroName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") triggerNameGreeting(); }}
            />
          </div>
        </div>
      </section>

      {/* PERFIL SELECTOR — a brincadeira dos 3 modos */}
      <section className="perfil-selector">
        <div className="perfil-selector-label">// escolhe seu modo de navegar</div>
        <div className="perfil-selector-grid">
          {[
            { n: 1, name: "CURIOSO",    tag: "MODO FOGO" },
            { n: 2, name: "NOJENTINHO", tag: "MODO FLORESTA" },
            { n: 3, name: "ESTUDADO",   tag: "MODO NEON" },
          ].map(p => (
            <button
              key={p.n}
              type="button"
              className={`perfil-card perfil-card-s${p.n}${skin === p.n ? " active" : ""}`}
              onClick={() => setSkin(p.n)}
              aria-pressed={skin === p.n}
            >
              <span className="perfil-name">{p.name}</span>
              <span className="perfil-tag">{p.tag}</span>
              <span className="perfil-cta">{skin === p.n ? "✓" : "→"}</span>
            </button>
          ))}
        </div>
      </section>

      {/* CONTROLS BAR */}
      <nav className="controls-bar">
        <button className="btn btn-dragon" onClick={openModal}>🐉 O Dragão Fala</button>
        <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="btn btn-buy">Comprar Agora →</a>
      </nav>

      {/* CONTEÚDOS */}
      <div className="section-label">Conteúdos</div>
      <div className="content-grid">
        {/* ROW 1 */}
        <div className="row row-equal-h">
          <a href="https://www.youtube.com/@comidadedragao" target="_blank" rel="noopener noreferrer" className="card card-video ratio-16-9">
            <div className="card-video-hover">
              <iframe
                src="https://www.youtube-nocookie.com/embed/yb68p_v-63M?autoplay=1&mute=1&controls=0&loop=1&playlist=yb68p_v-63M&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3"
                allow="autoplay; encrypted-media"
                title="Canal do Dragão"
                tabIndex={-1}
              />
            </div>
            <div className="card-inner">
              <div className="yt-preview-wrap" aria-hidden="true">
                <iframe
                  className="yt-preview-iframe"
                  src="https://www.youtube-nocookie.com/embed/yb68p_v-63M?autoplay=1&mute=1&controls=0&loop=1&playlist=yb68p_v-63M&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3"
                  allow="autoplay; encrypted-media"
                  title=""
                  tabIndex={-1}
                />
              </div>
              <div className="video-bg-placeholder"><span className="video-thumb-text">▶</span></div>
              <div className="card-body">
                <span className="card-tag">YouTube</span>
                <div className="play-icon">▶</div>
                <div className="card-label">O Canal<br />do Dragão</div>
                <div className="card-sub">Vídeos, bastidores e tudo que o Dragão manda falar</div>
              </div>
            </div>
            <div className="card-hover-overlay" />
          </a>

          <Link to="/parceiros" className="card card-pdf card-pdf-dark ratio-1-1">
            <HoverBg imgKey="manual" />
            <div className="card-inner">
              <div className="card-body">
                <span className="card-tag">Parceiros</span>
                <div className="pdf-icon">📖</div>
                <div className="card-label">Manual do<br />Criador</div>
                <div className="card-sub">Entra na matilha — 30% de comissão</div>
              </div>
            </div>
            <div className="card-hover-overlay" />
          </Link>

          <div onClick={openManifesto} style={{ cursor: "pointer" }} className="card card-manifesto-cta ratio-3-4">
            <div className="card-inner">
              <div className="card-body">
                <span className="card-tag">Manifesto</span>
                <div className="manifesto-scroll">📜</div>
                <div className="card-label">Leia o<br />Manifesto</div>
                <div className="card-sub">O que o Dragão acredita — em 5 parágrafos</div>
              </div>
            </div>
            <div className="card-hover-overlay" />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="row">
          <Link to="/produtos" className="card card-produtos ratio-1-1">
            <HoverBg imgKey="produtos" />
            <div className="card-inner">
              <div className="card-body">
                <span className="produto-emoji">🐛</span>
                <div className="card-label">Nossos<br />Produtos</div>
                <div className="card-sub" style={{ marginTop: 8 }}>Veja a linha completa — 7 SKUs</div>
              </div>
              <div className="card-reveal reveal-produtos">
                <div className="rp-title">// linha completa</div>
                <div className="rp-list">
                  {PRODUCTS_LIST.map((p, i) => (
                    <div className="rp-item" key={i} style={{ transitionDelay: p.delay }}>
                      <span className="rp-icon">{p.icon}</span>
                      <div>
                        <div className="rp-name">{p.name}</div>
                        <div className="rp-who">{p.who}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-hover-overlay" style={{ background: "rgba(0,0,0,0.06)" }} />
          </Link>

          <div onClick={openAudio} style={{ cursor: "pointer" }} className="card card-audio ratio-1-1">
            <HoverBg imgKey="audio" />
            <div className="card-audio-top">
              <span className="card-tag">Audiocasts</span>
            </div>
            <div className="card-audio-bottom">
              <div className="waveform">
                {Array.from({ length: 14 }).map((_, i) => <div className="waveform-bar" key={i} />)}
              </div>
              <div className="card-label">O Dragão<br />Fala ao<br />Microfone</div>
              <div className="card-sub">Clique e ouça enquanto navega</div>
            </div>
          </div>

          <a href="/biblioteca" className="card card-manifesto ratio-5-4">
            <HoverBg imgKey="manifesto" />
            <div className="card-inner">
              <div className="card-body">
                <span className="scratch-mark">// biblioteca</span>
                <div className="card-label">Biblioteca<br />Científica.</div>
                <div className="card-sub">17 artigos sobre inseto na alimentação pet — a ciência por trás do Dragão</div>
              </div>
            </div>
            <div className="card-hover-overlay" style={{ background: "rgba(0,0,0,0.04)" }} />
          </a>
        </div>

        {/* ROW 3: Quiz + Companion + Perguntas + Lives */}
        <div className="row row-equal-h">
          <a href="/quizzes" className="card card-quiz ratio-1-1">
            <HoverBg imgKey="quiz" />
            <div className="quiz-bg" />
            <div className="quiz-cta-content">
              <div className="quiz-intro-label">// descubra seu perfil de tutor</div>
              <div className="quiz-inner-box">
                <div className="quiz-intro-title">O DRAGÃO<br />QUER TE<br />CONHECER</div>
                <span className="quiz-start-btn">MONTAR MEU PERFIL →</span>
              </div>
            </div>
          </a>

          <a href="/imprensa" className="card card-quiz-companion card-quiz-companion-video ratio-3-4">
            <HoverBg imgKey="companion" />
            <video
              className="card-bg-video"
              src="/assets/videos/imprensa-cover.mp4?v=2"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="card-inner">
              <div className="card-body">
                <span className="cqc-label">// imprensa</span>
                <div className="card-label">Na Mídia &<br />Cobertura</div>
                <div className="card-sub">23 links — matérias, vídeos e o que falam sobre o Dragão</div>
              </div>
            </div>
            <div className="card-hover-overlay" />
          </a>

          <button
            type="button"
            onClick={openPerguntas}
            className="card card-perguntas ratio-3-4"
          >
            <div className="card-inner">
              <div className="card-body">
                <span className="perg-bg-mark">?</span>
                <span className="card-tag">FAQ secreto</span>
                <div className="card-label">Perguntas<br />que ninguém<br />faz</div>
                <div className="card-sub">O Dragão responde sem filtro</div>
                <span className="perg-cta">Abrir →</span>
              </div>
            </div>
            <div className="card-hover-overlay" />
          </button>

          <a
            href="https://www.instagram.com/comidadedragao"
            target="_blank"
            rel="noopener noreferrer"
            className="card card-lives ratio-1-1"
          >
            <div className="card-inner">
              <div className="card-body">
                <span className="lives-badge"><span className="lives-dot" />AO VIVO</span>
                <span className="card-tag">Agenda</span>
                <div className="card-label">Lives<br />do Dragão</div>
                <div className="card-sub">Toda quinta 19h · @comidadedragao</div>
                <span className="lives-cta">Entra na próxima →</span>
              </div>
            </div>
            <div className="card-hover-overlay" />
          </a>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="section-label" style={{ marginTop: 40 }}>Não é marketing, é matemática</div>
      <div className="stats-strip">
        {[
          { num: "83%",  label: <>menos <em>carbono</em></>,         hint: "~500g CO₂/kg (BSF) vs ~2.850g/kg (boi)." },
          { num: "15K",  label: <>litros menos <em>água/kg</em></>,  hint: "Economiza 15.000 litros de água por kg de proteína produzida." },
          { num: "142×", label: <>menos <em>uso de terra</em></>,    hint: "1,4m² (BSF) vs 200m² (boi). Cabe numa sala — não num pasto." },
          { num: "45",   label: <>dias de <em>ciclo de vida</em></>, hint: "Ciclo completo da BSF em 45 dias. Boi leva 18–24 meses." },
        ].map((s, i) => (
          <div className="stat-item" key={i}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
            <span className="stat-hint">{s.hint}</span>
          </div>
        ))}
      </div>

      {/* REELS DO DRAGÃO */}
      <ReelsSection />

      {/* COMUNIDADE */}
      <div className="section-label" style={{ marginTop: 40 }}>Comunidade</div>
      <div className="content-grid" style={{ paddingTop: 8 }}>
        <div className="row row-equal-h">
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer" className="card card-social card-social-ig card-social-ig-img ratio-5-4">
            <HoverBg imgKey="instagram" />
            <div className="card-inner"><div className="card-body">
              <span className="social-icon">📸</span>
              <div className="card-tag">Instagram</div>
              <div className="card-label">@comida<br />dedragao</div>
              <div className="card-sub">Posts, stories, reels e o Dragão provocando todo dia</div>
            </div></div>
            <div className="card-hover-overlay" style={{ background: "rgba(255,45,120,0.08)" }} />
          </a>

          <a href="https://wa.me/552139500576" target="_blank" rel="noopener noreferrer" className="card card-social card-social-wa card-social-wa-img ratio-3-4">
            <HoverBg imgKey="whatsapp" />
            <div className="card-inner"><div className="card-body">
              <span className="social-icon">💬</span>
              <div className="card-tag">WhatsApp SAC</div>
              <div className="card-label">Fala<br />com<br />a gente</div>
              <div className="card-sub">(21) 3950-0576 — O Dragão não abandona ninguém</div>
            </div></div>
            <div className="card-hover-overlay" style={{ background: "rgba(0,255,135,0.06)" }} />
          </a>

          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="card card-social card-social-map ratio-1-1">
            <HoverBg imgKey="lojas" />
            <div className="card-inner"><div className="card-body">
              <span className="social-icon">📍</span>
              <div className="card-tag">Presença Física</div>
              <div className="card-label">+30 Lojas<br />SP e RJ</div>
              <div className="card-sub">Encontre a loja mais perto de você</div>
            </div></div>
            <div className="card-hover-overlay" />
          </a>


          <a href="mailto:somos@letsfly.com.br" className="card card-manifesto card-email-manifesto ratio-3-4">
            <HoverBg imgKey="email" />
            <div className="card-inner">
              <div className="card-body">
                <span className="scratch-mark">// email</span>
                <div className="card-label">Escreve<br />pro<br />Dragão</div>
                <div className="card-sub">somos@letsfly.com.br</div>
              </div>
            </div>
            <div className="card-hover-overlay" />
          </a>
        </div>
      </div>

      {/* PERFIS */}
      <div className="section-label" style={{ marginTop: 40 }}>Área por Perfil</div>
      <div className="audience-hub" style={{ paddingTop: 8 }}>
        <div className="audience-grid">

          {/* Consumidor */}
          <a href="https://comidadedragao.com.br/collections/produtos" target="_blank" rel="noopener noreferrer" className="audience-card aud-consumer">
            <HoverBg imgKey="consumer" />
            <div className="audience-card-inner">
              <div className="aud-bg-num">01</div>
              <div className="aud-tag">Tutor de pet</div>
              <div className="aud-title">Quero<br />alimentar<br />bem.</div>
              <div className="aud-desc">Produtos, quiz de recomendação, onde comprar. O Dragão te guia.</div>
              <div className="aud-cta">Ver produtos →</div>
            </div>
          </a>

          {/* Influenciador */}
          <a href="mailto:somos@letsfly.com.br?subject=Quero ser criador de conteúdo Comida de Dragão" className="audience-card aud-influencer">
            <HoverBg imgKey="influencer" />
            <div className="audience-card-inner">
              <div className="aud-bg-num">02</div>
              <div className="aud-tag">Criador de conteúdo</div>
              <div className="aud-title">Quero<br />ser<br />dragão.</div>
              <div className="aud-desc">Manual de marca, kit de assets, briefings e links rastreados.</div>
              <div className="aud-cta">Ver kit →</div>
            </div>
          </a>

          {/* Vendedor */}
          <a href="mailto:somos@letsfly.com.br?subject=Quero revender Comida de Dragão" className="audience-card aud-seller">
            <HoverBg imgKey="seller" />
            <div className="audience-card-inner">
              <div className="aud-bg-num">03</div>
              <div className="aud-tag">Revenda / B2B</div>
              <div className="aud-title">Quero<br />vender<br />junto.</div>
              <div className="aud-desc">Catálogo, tabela de preços, materiais de PDV e contato comercial.</div>
              <div className="aud-cta" style={{ color: "var(--dragon-lime)" }}>Ver catálogo →</div>
            </div>
          </a>

        </div>
      </div>

      {/* ONDE COMPRAR */}
      <div className="section-label" style={{ marginTop: 40 }}>Onde Comprar</div>
      <div className="content-grid" style={{ paddingTop: 8 }}>
        <div className="row">
          {[
            { cls: "card-shop-amazon", href: "https://www.amazon.com.br/s?k=comida+de+dragao", name: "Amazon", tag: "Entrega rápida · Prime", hoverKey: "amazon" },
            { cls: "card-shop-ml", href: "https://www.mercadolivre.com.br", name: "Mercado\nLivre", tag: "Frete Grátis", hoverKey: "ml" },
            { cls: "card-shop-petlove", href: "https://www.petlove.com.br", name: "Petlove", tag: "Especialista em pets", hoverKey: "petlove" },
            { cls: "card-shop-oficial", href: "https://comidadedragao.com.br", name: "Loja\nOficial", tag: "Site próprio · melhor preço", hoverKey: "oficial" },
          ].map((shop, i) => (
            <a key={i} href={shop.href} target="_blank" rel="noopener noreferrer" className={`card card-shop ratio-shop ${shop.cls}`}>
              <HoverBg imgKey={shop.hoverKey} />
              <div className="card-inner">
                <div className="card-body">
                  <div className="shop-name">{shop.name.split("\n").map((line, j) => j > 0 ? <span key={j}><br />{line}</span> : line)}</div>
                  <span className="shop-tag">{shop.tag}</span>
                  <span className="shop-arrow">→</span>
                </div>
              </div>
              <div className="card-hover-overlay" style={{ background: "rgba(0,0,0,0.06)" }} />
            </a>
          ))}
        </div>

        {/* Biofábrica */}
        <div className="row">
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="card card-biofabrica card-biofabrica-img">
            <HoverBg imgKey="biofabrica_hover" />
            <div className="card-inner">
              <div className="card-body">
                <div className="bio-left">
                  <div className="bio-tag">// Cachoeiras de Macacu, RJ</div>
                  <div className="bio-title">Nossa<br />Biofábrica</div>
                  <div className="bio-sub">
                    Produzimos nossos próprios insetos. Do resíduo orgânico à proteína de elite —
                    tudo rastreável, tudo nosso. 83% menos carbono que proteína convencional.
                  </div>
                  <span className="bio-badge">MAPA · ESTAB. RJ 001924-0</span>
                </div>
                <div className="bio-right">
                  <div className="bio-giant">🏭</div>
                  <div className="bio-cert-stack">
                    <span className="bio-cert">BSF · Hermetia illucens</span>
                    <span className="bio-cert">Ciclo 45 dias</span>
                    <span className="bio-cert">Do resíduo à proteína</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-hover-overlay" style={{ background: "rgba(0,255,135,0.04)" }} />
          </a>
        </div>
      </div>

      {/* BOTTOM MARQUEE */}
      <div style={{ marginTop: 24 }}>
        <MarqueeBar items={MARQUEE_BOTTOM} bottom />
      </div>

      {/* FOOTER */}
      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <nav className="footer-links">
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@comidadedragao" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">{footerText}</div>
      </footer>

      {/* MODAL DRAGÃO FALA — VÍDEO */}
      {modalOpen && (
        <div
          className="dragao-fala-overlay"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="dragao-fala-modal">
            <div className="dragao-fala-header">
              <span>🐉 Mensagem do Dragão</span>
              <button className="dragao-fala-close" onClick={closeModal}>✕</button>
            </div>
            <div className="dragao-fala-video-wrap">
              <video
                className="dragao-fala-video"
                controls
                src="/assets/videos/SharkTank Insta .mp4"
              />
            </div>
          </div>
        </div>
      )}
      {/* MODAL MANIFESTO */}
      {manifestoOpen && (
        <div
          className="dragao-fala-overlay"
          onClick={e => { if (e.target === e.currentTarget) closeManifesto(); }}
        >
          <div className="dragao-fala-modal" style={{ maxWidth: 540 }}>
            <div className="dragao-fala-header">
              <span>📜 Manifesto</span>
              <button className="dragao-fala-close" onClick={closeManifesto}>✕</button>
            </div>
            <div style={{ padding: "24px 28px", overflowY: "auto", maxHeight: "calc(90vh - 60px)" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace", marginBottom: 16 }}>// manifesto</p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", marginBottom: 14 }}>Nasci do elo entre a vitalidade da terra e o saber ancestral. Sou milenar e atemporal, carregando a memória dos antigos e a chama que ilumina o caminho para nossa verdadeira natureza.</p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", marginBottom: 14 }}>Meu sopro é de cura. Minha força serve para regenerar, e minha sabedoria uso para questionar e provocar com humildade.</p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", marginBottom: 14 }}>Trago o elixir da regeneração, o néctar que nutre e harmoniza os seres vivos.</p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#fff", fontWeight: 700, marginBottom: 14 }}>Mais do que um alimento, uma revolução.</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontStyle: "italic", marginBottom: 20 }}>— O Dragão</p>
              <div style={{ display: "flex", gap: 12 }}>
                <a href="https://comidadedragao.com.br/collections/produtos" target="_blank" rel="noopener noreferrer" className="btn btn-dragon">Ver os Produtos →</a>
                <button className="btn" style={{ color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.15)" }} onClick={closeManifesto}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DRAGÃO RESPONDE AO NOME */}
      {nameModalOpen && (
        <div
          className="dragao-fala-overlay"
          onClick={e => { if (e.target === e.currentTarget) closeNameModal(); }}
        >
          <div className="name-greeting-modal">
            <button className="name-greeting-close-x" onClick={closeNameModal} aria-label="Fechar">✕</button>
            <div className="name-greeting-eyebrow">🐉 O Dragão Fala</div>
            <div className="name-greeting-name">{heroName.trim().toUpperCase()}</div>
            <div className="name-greeting-msg">...{nameGreeting}</div>
            <div className="name-greeting-actions">
              <button className="btn btn-dragon" onClick={closeNameModal}>Bora explorar →</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PERGUNTAS QUE NINGUÉM FAZ */}
      {perguntasOpen && (
        <div
          className="dragao-fala-overlay"
          onClick={e => { if (e.target === e.currentTarget) closePerguntas(); }}
        >
          <div className="dragao-fala-modal" style={{ maxWidth: 680 }}>
            <div className="dragao-fala-header">
              <span>🤔 Perguntas que ninguém faz</span>
              <button className="dragao-fala-close" onClick={closePerguntas}>✕</button>
            </div>
            <div style={{ padding: "24px 28px 32px", overflowY: "auto", maxHeight: "calc(90vh - 60px)" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace", marginBottom: 18 }}>
                // as perguntas que ficam na cabeça e ninguém tem coragem de mandar no DM
              </p>
              {[
                {
                  q: "Meu gato é super enjoado, vai aceitar mesmo?",
                  a: "Gato aceita BSF melhor que muita ração comum — a palatabilidade é 1,93:1 a favor da farinha de inseto em testes. Dica: começa com 5% misturado na ração normal, não troca tudo de uma vez.",
                },
                {
                  q: "Posso dar todo dia? Não cansa?",
                  a: "Pode e deve. Ingrediente único, hipoalergênico, perfil completo de aminoácidos. Não é snack ocasional — é nutrição diária com 88,9% de digestibilidade.",
                },
                {
                  q: "E se eu provar também? Tipo, de curiosidade.",
                  a: "Não é recomendado pra humanos (a nossa linha é registrada no MAPA como pet food). Mas 2 bilhões de pessoas no mundo comem inseto regularmente — só que existem produtos específicos pra isso.",
                },
                {
                  q: "Meu pet tem alergia a tudo. BSF pode desencadear?",
                  a: "BSF é a proteína nova por excelência em dieta de eliminação — é exatamente o produto que veterinários usam quando o pet é alérgico a frango, boi e laticínio. Cuidado apenas se o pet é alérgico a ácaros/crustáceos (reatividade cruzada rara).",
                },
                {
                  q: "Se eu der pro meu cachorro, meus amigos vão achar estranho. Como explico?",
                  a: "Não explica — mostra o pet devorando. 90% dos tutores que deram pra experimentar mudaram de ideia em 1 semana. E se quiser argumentar: seu cão já come barata no quintal — o nosso só tem 88,9% mais digestibilidade.",
                },
              ].map((qa, i) => (
                <div key={i} style={{ marginBottom: 22 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {i + 1}. {qa.q}
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.55, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {qa.a}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="https://wa.me/552139500576?text=Tenho%20uma%20pergunta%20pro%20Drag%C3%A3o" target="_blank" rel="noopener noreferrer" className="btn btn-dragon">Pergunta direto no Zap →</a>
                <button className="btn" style={{ color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.15)" }} onClick={closePerguntas}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CATÁLOGO */}
      {catalogOpen && (
        <div
          className="modal-overlay open"
          onClick={e => { if (e.target === e.currentTarget) closeCatalog(); }}
          style={{ zIndex: 1000 }}
        >
          <div style={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            <button
              onClick={closeCatalog}
              style={{
                position: "absolute",
                top: -16,
                right: -16,
                background: "var(--dragon-lime, #aaff00)",
                color: "#000",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                zIndex: 10,
                lineHeight: 1,
              }}
            >✕</button>
            <img
              src="/assets/images/Frente.png"
              alt="Catálogo Comida de Dragão"
              style={{
                maxWidth: "100%",
                maxHeight: "88vh",
                objectFit: "contain",
                borderRadius: 8,
                boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
              }}
            />
            <a
              href="https://comidadedragao.com.br/collections/produtos"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dragon"
              style={{ marginTop: 16 }}
            >Ver todos os produtos →</a>
          </div>
        </div>
      )}

      {/* AUDIO PLAYER FLUTUANTE */}
      {audioOpen && (
        <div className={`audio-float-player${audioMinimized ? " minimized" : ""}`}>
          <audio
            ref={audioRef}
            src="/assets/audio/audiocast.mp3"
            preload="metadata"
            onPlay={() => setAudioPlaying(true)}
            onPause={() => setAudioPlaying(false)}
            onEnded={() => setAudioPlaying(false)}
          />
          {!audioMinimized ? (
            <>
              <div className="afp-header">
                <span className="afp-tag">🎙 Audiocast</span>
                <div className="afp-controls">
                  <button className="afp-btn" onClick={() => setAudioMinimized(true)} title="Minimizar">—</button>
                  <button className="afp-btn" onClick={closeAudio} title="Fechar">✕</button>
                </div>
              </div>
              <div className="afp-title">O Dragão Fala ao Microfone</div>
              <div className={`afp-waveform${audioPlaying ? " playing" : ""}`}>
                {Array.from({ length: 20 }).map((_, i) => <div className="afp-bar" key={i} />)}
              </div>
              <div className="afp-actions">
                <button className="afp-play" onClick={() => {
                  const a = audioRef.current;
                  if (!a) return;
                  a.paused ? a.play() : a.pause();
                }}>
                  {audioPlaying ? "⏸ Pausar" : "▶ Ouvir"}
                </button>
              </div>
            </>
          ) : (
            <div className="afp-mini" onClick={() => setAudioMinimized(false)}>
              <span>{audioPlaying ? "🎙 Tocando..." : "🎙 Audiocast"}</span>
              <button className="afp-btn" onClick={e => { e.stopPropagation(); closeAudio(); }}>✕</button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Portal;
