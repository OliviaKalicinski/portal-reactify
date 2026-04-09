import { useState, useCallback, useRef, useEffect } from "react";
import "./Portal.css";

const PORTAL_COVER = "/assets/images/" + encodeURIComponent("PORTAL COMIDA DE DRAGÃO.png");

const CARD_HOVER_IMAGES: Record<string, string> = {
  manifesto:  "/assets/images/nojento-desperdicio.png",
  quiz:       "/assets/images/instinto-nao-erra.jpg",
  audio:      "/assets/images/Audiocast.png",
  produtos:   "/assets/images/larva-pets-amam.jpg",
  biofabrica: "/assets/images/biofabrica-exterior.jpeg",
  manual:     "/assets/images/Manual_do_Criador.png",
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

const QUIZ_PRODUCTS: Record<string, { icon: string; name: string; desc: string; coupon: string; link: string }> = {
  cao: { icon: "🐕", name: "COMIDA DE DRAGÃO ORIGINAL", desc: "Larva BSF 100% pura — o petisco mais proteico que seu cão vai conhecer.", coupon: "PRIMEIRODRAGO", link: "https://comidadedragao.com.br/collections/produtos" },
  gato: { icon: "🐈", name: "SUPLEMENTO FELINO", desc: "Formulação especial com taurina — essencial pra saúde cardíaca e visual do seu gato.", coupon: "PRIMEIRODRAGO", link: "https://comidadedragao.com.br/collections/produtos" },
  reptil: { icon: "🦎", name: "GRUB — ALIMENTO EM GEL", desc: "Proteína de 3 insetos em gel. Ca:P otimizado. Zero insetos vivos pra manusear.", coupon: "PRIMEIRODRAGO", link: "https://comidadedragao.com.br/collections/produtos" },
  outro: { icon: "🐦", name: "COMIDA DE DRAGÃO ORIGINAL", desc: "Versátil e nutritivo — aceito por aves, peixes, anfíbios e mais. A natureza sempre soube.", coupon: "PRIMEIRODRAGO", link: "https://comidadedragao.com.br/collections/produtos" },
};

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
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  const [audioMinimized, setAudioMinimized] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [quizResult, setQuizResult] = useState(QUIZ_PRODUCTS.cao);

  // Modal drag state
  const modalWindowRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{ dragging: boolean; sx: number; sy: number; ol: number; ot: number; left: number; top: number; manual: boolean }>({ dragging: false, sx: 0, sy: 0, ol: 0, ot: 0, left: 0, top: 0, manual: false });

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setDragState(prev => ({ ...prev, manual: false }));
  }, []);
  const openCatalog = useCallback(() => setCatalogOpen(true), []);
  const closeCatalog = useCallback(() => setCatalogOpen(false), []);
  const openManual = useCallback(() => setManualOpen(true), []);
  const closeManual = useCallback(() => setManualOpen(false), []);
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

  // Lock body scroll when any modal is open
  useEffect(() => {
    const anyOpen = modalOpen || catalogOpen || manualOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen, catalogOpen, manualOpen]);

  // Keyboard Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { closeModal(); closeCatalog(); closeManual(); } };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeModal]);

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

  const quizGo = (toStep: number) => {
    setQuizStep(-1); // trigger exit
    setTimeout(() => {
      setQuizStep(toStep);
      if (toStep > 0) setQuizActive(true);
    }, 160);
  };

  const quizSelectPet = (pet: string) => {
    setQuizResult(QUIZ_PRODUCTS[pet]);
    quizGo(2);
  };

  const quizReset = () => {
    setQuizStep(-1);
    setTimeout(() => {
      setQuizStep(0);
      setQuizActive(false);
    }, 160);
  };

  const nameUpper = heroName.trim().toUpperCase();

  const heroTaglineContent = nameUpper ? (
    <>
      <strong>{nameUpper}</strong>, seu pet merece o melhor da natureza.<br />
      Mesmo que seja inseto.
    </>
  ) : (
    <>
      O Dragão sabe que seu cachorro merece<br />
      <strong>o melhor da natureza.</strong><br />
      Mesmo que seja inseto.
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
          <h1 className="hero-title">
            COMIDA
            <span className="accent">DE DRAGÃO</span>
            <span className={`hero-name-output${nameUpper ? " visible" : ""}`}>
              {nameUpper ? `PRA ${nameUpper}` : ""}
            </span>
          </h1>
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
            />
          </div>
        </div>
      </section>

      {/* CONTROLS BAR */}
      <nav className="controls-bar">
        <button className="btn btn-dragon" onClick={openModal}>🐉 O Dragão Fala</button>
        <span className="label">Modo</span>
        <div className="skin-dots">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`skin-dot s${n}${skin === n ? " active" : ""}`}
              title={["Modo Fogo", "Modo Floresta", "Modo Neon"][n - 1]}
              onClick={() => setSkin(n)}
            />
          ))}
        </div>
        <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="btn btn-buy">Comprar Agora →</a>
      </nav>

      {/* CONTEÚDOS */}
      <div className="section-label">Conteúdos</div>
      <div className="content-grid">
        {/* ROW 1 */}
        <div className="row">
          <a href="https://www.youtube.com/@comidadedragao" target="_blank" rel="noopener noreferrer" className="card card-video ratio-16-9">
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

          <div onClick={openManual} style={{ cursor: "pointer" }} className="card card-pdf ratio-3-4">
            <div className="card-pdf-top">
              <div className="card-tag">Manual</div>
              <HoverBg imgKey="manual" />
            </div>
            <div className="card-pdf-bottom">
              <div className="pdf-icon">📖</div>
              <div className="card-label">Manual do<br />Criador</div>
              <div className="card-sub">Clique e acesse o guia completo para criadores de conteúdo</div>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="row">
          <div onClick={openCatalog} style={{ cursor: "pointer" }} className="card card-produtos ratio-1-1">
            <HoverBg imgKey="produtos" />
            <div className="card-inner">
              <div className="card-body">
                <span className="produto-emoji">🐛</span>
                <div className="card-label">Nossos<br />Produtos</div>
                <div className="card-sub" style={{ marginTop: 8 }}>Clique e veja o catálogo completo</div>
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
          </div>

          <div onClick={openAudio} style={{ cursor: "pointer" }} className="card card-audio ratio-3-5">
            <div className="card-audio-top">
              <span className="card-tag">Audiocasts</span>
              <HoverBg imgKey="audio" />
            </div>
            <div className="card-audio-bottom">
              <div className="waveform">
                {Array.from({ length: 14 }).map((_, i) => <div className="waveform-bar" key={i} />)}
              </div>
              <div className="card-label">O Dragão<br />Fala ao<br />Microfone</div>
              <div className="card-sub">Clique e ouça enquanto navega</div>
            </div>
          </div>

          <a href="#" onClick={e => { e.preventDefault(); openModal(); }} className="card card-manifesto ratio-5-4">
            <HoverBg imgKey="manifesto" />
            <div className="card-inner">
              <div className="card-body">
                <span className="scratch-mark">// manifesto</span>
                <div className="card-label">Nojento<br />é o<br />desperdício.</div>
                <div className="card-sub">Leia o nosso manifesto — escrito pelo próprio Dragão</div>
              </div>
            </div>
            <div className="card-hover-overlay" style={{ background: "rgba(0,0,0,0.04)" }} />
          </a>
        </div>

        {/* ROW 3: Quiz + Companion */}
        <div className="row">
          <div className={`card card-quiz${quizActive ? " qactive" : ""}`}>
            <HoverBg imgKey="quiz" />
            <div className="quiz-bg" />

            {/* Step 0 */}
            <div className={`quiz-step${quizStep === 0 ? " qon" : ""}`}>
              <div className="quiz-dragon-big">🐉</div>
              <div className="quiz-intro-label">// descoberta personalizada</div>
              <div className="quiz-intro-title">O DRAGÃO<br />QUER TE<br />CONHECER</div>
              <button className="quiz-start-btn" onClick={() => quizGo(1)}>QUAL É O SEU PET? →</button>
            </div>

            {/* Step 1 */}
            <div className={`quiz-step${quizStep === 1 ? " qon" : ""}`}>
              <div className="quiz-q-label">// pergunta 1 de 1</div>
              <div className="quiz-question">QUAL É<br />O SEU PET?</div>
              <div className="quiz-pets">
                {[
                  { key: "cao", icon: "🐕", label: "Cão" },
                  { key: "gato", icon: "🐈", label: "Gato" },
                  { key: "reptil", icon: "🦎", label: "Réptil" },
                  { key: "outro", icon: "🐦", label: "Outro" },
                ].map(p => (
                  <button className="quiz-pet-btn" key={p.key} onClick={() => quizSelectPet(p.key)}>
                    <span className="quiz-pet-icon">{p.icon}</span>{p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className={`quiz-step${quizStep === 2 ? " qon" : ""}`}>
              <div className="quiz-result-icon">{quizResult.icon}</div>
              <div className="quiz-dragon-says">O DRAGÃO ESCOLHEU</div>
              <div className="quiz-result-product">{quizResult.name}</div>
              <div className="quiz-result-desc">{quizResult.desc}</div>
              <div className="quiz-coupon">
                <span className="quiz-coupon-lbl">seu cupom · 20% off na primeira compra</span>
                <span className="quiz-coupon-code">PRIMEIRODRAGO</span>
              </div>
              <a href={quizResult.link} target="_blank" rel="noopener noreferrer" className="quiz-buy-link">COMPRAR AGORA →</a>
              <button className="quiz-reset" onClick={quizReset}>← recomeçar</button>
            </div>
          </div>

          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="card card-quiz-companion">
            <div className="card-inner">
              <div className="card-body">
                <span className="cqc-label">// digestibilidade</span>
                <div>
                  <div className="cqc-big">88,9%</div>
                  <div className="cqc-unit">de proteína absorvida</div>
                </div>
                <div className="cqc-tagline">Ração comum chega<br />a 70–80%.<br />BSF é outro nível.</div>
              </div>
            </div>
            <div className="card-hover-overlay" />
          </a>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="stats-strip">
        {[
          { num: "83%", label: <>menos <em>carbono</em></> },
          { num: "15K", label: <>litros menos <em>água/kg</em></> },
          { num: "142×", label: <>menos <em>uso de terra</em></> },
          { num: "88,9%", label: <><em>digestibilidade</em></> },
          { num: "45", label: <>dias de <em>ciclo de vida</em></> },
        ].map((s, i) => (
          <div className="stat-item" key={i}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* COMUNIDADE */}
      <div className="section-label" style={{ marginTop: 32 }}>Comunidade</div>
      <div className="content-grid" style={{ paddingTop: 8 }}>
        <div className="row">
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer" className="card card-social card-social-ig ratio-5-4" style={{ flexGrow: 5 / 4 }}>
            <div className="card-inner"><div className="card-body">
              <span className="social-icon">📸</span>
              <div className="card-tag">Instagram</div>
              <div className="card-label">@comida<br />dedragao</div>
              <div className="card-sub">Posts, stories, reels e o Dragão provocando todo dia</div>
            </div></div>
            <div className="card-hover-overlay" style={{ background: "rgba(255,45,120,0.08)" }} />
          </a>

          <a href="https://wa.me/552139500576" target="_blank" rel="noopener noreferrer" className="card card-social card-social-wa ratio-3-4" style={{ flexGrow: 3 / 4 }}>
            <div className="card-inner"><div className="card-body">
              <span className="social-icon">💬</span>
              <div className="card-tag">WhatsApp SAC</div>
              <div className="card-label">Fala<br />com<br />a gente</div>
              <div className="card-sub">(21) 3950-0576 — O Dragão não abandona ninguém</div>
            </div></div>
            <div className="card-hover-overlay" style={{ background: "rgba(0,255,135,0.06)" }} />
          </a>

          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="card card-social card-social-map ratio-16-9" style={{ flexGrow: 16 / 9 }}>
            <div className="card-inner"><div className="card-body">
              <span className="social-icon">📍</span>
              <div className="card-tag">Presença Física</div>
              <div className="card-label">+30 Lojas<br />SP e RJ</div>
              <div className="card-sub">Encontre a loja mais perto de você</div>
            </div></div>
            <div className="card-hover-overlay" />
          </a>

          <a href="mailto:somos@letsfly.com.br" className="card card-social card-social-email ratio-3-5" style={{ flexGrow: 3 / 5 }}>
            <div className="card-inner"><div className="card-body">
              <span className="social-icon">✉️</span>
              <div className="card-tag">Email</div>
              <div className="card-label">Escreve<br />pro<br />Dragão</div>
              <div className="card-sub">somos@letsfly.com.br</div>
            </div></div>
            <div className="card-hover-overlay" />
          </a>
        </div>
      </div>

      {/* PERFIS */}
      <div className="section-label" style={{ marginTop: 16 }}>Área por Perfil</div>
      <div className="audience-hub" style={{ paddingTop: 8 }}>
        <div className="audience-grid">

          {/* Consumidor */}
          <a href="https://comidadedragao.com.br/collections/produtos" target="_blank" rel="noopener noreferrer" className="audience-card aud-consumer">
            <div className="audience-card-inner">
              <div className="aud-bg-num">01</div>
              <div className="aud-tag">Tutor de pet</div>
              <div className="aud-title">Quero<br />alimentar<br />bem.</div>
              <div className="aud-desc">Produtos, quiz de recomendação, onde comprar. O Dragão te guia.</div>
              <div className="aud-cta">Ver produtos →</div>
            </div>
          </a>

          {/* Influenciador */}
          <a href="#influenciador" className="audience-card aud-influencer">
            <div className="audience-card-inner">
              <div className="aud-bg-num">02</div>
              <div className="aud-tag">Criador de conteúdo</div>
              <div className="aud-title">Quero<br />ser<br />dragão.</div>
              <div className="aud-desc">Manual de marca, kit de assets, briefings e links rastreados.</div>
              <div className="aud-cta">Ver kit →</div>
            </div>
          </a>

          {/* Vendedor */}
          <a href="#vendedor" className="audience-card aud-seller">
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
      <div className="section-label" style={{ marginTop: 16 }}>Onde Comprar</div>
      <div className="content-grid" style={{ paddingTop: 8 }}>
        <div className="row">
          {[
            { cls: "card-shop-amazon", href: "https://www.amazon.com.br/s?k=comida+de+dragao", name: "Amazon", tag: "Entrega rápida · Prime" },
            { cls: "card-shop-ml", href: "https://www.mercadolivre.com.br", name: "Mercado\nLivre", tag: "Frete Grátis" },
            { cls: "card-shop-petlove", href: "https://www.petlove.com.br", name: "Petlove", tag: "Especialista em pets" },
            { cls: "card-shop-oficial", href: "https://comidadedragao.com.br", name: "Loja\nOficial", tag: "Site próprio · melhor preço" },
          ].map((shop, i) => (
            <a key={i} href={shop.href} target="_blank" rel="noopener noreferrer" className={`card card-shop ${shop.cls}`}>
              <div className="card-inner ratio-shop">
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
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="card card-biofabrica">
            <HoverBg imgKey="biofabrica" />
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
        <div className="footer-logo">COMIDA <span>DE DRAGÃO</span></div>
        <nav className="footer-links">
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@comidadedragao" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">{footerText}</div>
      </footer>

      {/* MODAL */}
      <div
        className={`modal-overlay${modalOpen ? " open" : ""}`}
        onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div
          className="modal-window"
          ref={modalWindowRef}
          style={dragState.manual ? { left: dragState.left, top: dragState.top, transform: "none" } : undefined}
        >
          <div className="modal-titlebar" onMouseDown={handleTitlebarMouseDown}>
            <span className="title">🐉 O Dragão Fala</span>
            <button className="modal-close" onClick={closeModal}>✕</button>
          </div>
          <div className="modal-body" style={{ padding: 0 }}>
            <video
              src="/assets/videos/SharkTank%20Insta%20.mp4"
              controls
              autoPlay
              style={{ width: "100%", display: "block", borderRadius: "0 0 12px 12px" }}
            />
          </div>
        </div>
      </div>
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

      {/* MODAL MANUAL DO CRIADOR */}
      {manualOpen && (
        <div
          className="modal-overlay open"
          onClick={e => { if (e.target === e.currentTarget) closeManual(); }}
          style={{
            zIndex: 1000,
            background: `rgba(0,0,0,0.72) url('${PORTAL_COVER}') center/cover no-repeat`,
          }}
        >
          <div style={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 2,
          }}>
            <button
              onClick={closeManual}
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
            <div style={{
              maxWidth: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}>
              <img
                src="/assets/images/poster-punk-converte.png"
                alt="Manual do Criador — Página 1"
                style={{
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                  boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
                }}
              />
              <img
                src="/assets/images/poster-punk-gato.png"
                alt="Manual do Criador — Página 2"
                style={{
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                  boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
                }}
              />
            </div>
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
