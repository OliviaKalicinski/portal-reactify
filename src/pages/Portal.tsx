import { useState, useCallback, useRef, useEffect } from "react";
import "./Portal.css";

const PORTAL_COVER = "/assets/images/" + encodeURIComponent("PORTAL COMIDA DE DRAGÃO.png");

const CARD_HOVER_IMAGES: Record<string, string> = {
  manifesto:  "/assets/images/nojento-desperdicio.png",
  quiz:       "/assets/images/instinto-nao-erra.jpg",
  audio:      "/assets/images/Audiocast.png",
  produtos:   "/assets/images/larva-pets-amam.jpg",
  biofabrica: "/assets/images/biofabrica-exterior.jpeg",
  manual:     "/assets/images/matilha.png",
  youtube:    "/assets/images/portal-comida-dragao.png",
  companion:  "/assets/images/estranho-cultural.jpg",
  instagram:  "/assets/images/matilha.png",
  whatsapp:   "/assets/images/amostra-gratis.png",
  lojas:      "/assets/images/biofabrica-interior.jpeg",
  email:      "/assets/images/de larva.png",
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
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  
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
  const openManifesto = useCallback(() => setManifestoOpen(true), []);
  const closeManifesto = useCallback(() => setManifestoOpen(false), []);
  const openCatalog = useCallback(() => setCatalogOpen(true), []);
  const closeCatalog = useCallback(() => setCatalogOpen(false), []);
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
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { closeModal(); closeManifesto(); closeCatalog(); } };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeModal]);

  // Body overflow lock when any modal is open
  useEffect(() => {
    if (modalOpen || manifestoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen, manifestoOpen]);

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
          <svg className="hero-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500" aria-label="Comida de Dragão">
            <g>
              <path fill="currentColor" d="M606.17,247.84l.02-.47c.92-16.1-13.48-28.41-28.66-30.12-22.92-3.68-40.76,17.31-32.34,39.12,11.98,29.43,59.49,24.43,60.98-8.53"/>
              <path fill="currentColor" d="M479.64,274.53c-3.8-13.9-20.45-8.15-30.52-5.88-11.14,2.85-21.91,4.87-32.05,9.66-18.56,8.42-29.21,25.99-8.12,36.61,18.28,8.91,44.7,8.05,59.94-6.93,8.07-8.31,13.18-21.43,10.86-33.04l-.11-.42Z"/>
              <path fill="currentColor" d="M324.94,175.84c7.4-.35,12.88-5.69,17.05-11.5,2.65-3.44,4.7-5.27,4.71-8.2v-.22c-.4-3.45-2.53-5.82-4.16-10.39-.7-1.71-1.43-3.45-2.51-4.96-8.37-11.15-32.8-8.94-38.11,4.34-5.45,13.94,7.62,31.93,23.01,30.93"/>
              <path fill="currentColor" d="M751.84,274.97c-.93-13.4-10.69-10.88-21.38-7.28l-22.66,5.43c-10.51,1.66-21.16,5.73-29.85,12.07-42.47,33.02,78.47,61.88,73.94-9.74l-.04-.48Z"/>
              <path fill="currentColor" d="M874.81,171.44c-7.61-2.05-15.64-3.05-24.55-3.05-12.44,0-26.22,1.96-43.47,6.21-3.42.89-6.52,1.32-9.47,1.32-15.14,0-20.61-10.45-25.31-22.1-.04-.1-.08-.2-.12-.29-5.81-13.1-13.99-24.44-23.68-32.79-6.21-5.36-14.54-8.55-23.31-11.64-4.55-1.57-8.98-3.35-13.31-5.1-11.16-4.49-21.7-8.73-32.18-8.73-2.39,0-4.65.21-6.92.66-.12.02-.23.05-.35.07l-4.79,1.14c-10.64,2.55-21.65,5.18-33.36,5.18-4.37,0-8.65-.38-12.75-1.12-.17-.03-.35-.06-.53-.08-12.27-1.52-22.23-6.66-31.93-11.66-8.3-4.28-16.14-8.32-24.51-9.46l-.27-.04c-4.38-.67-8.7-1-12.82-1-7.82,0-14.99,1.19-21.47,3.6-8.42,3.32-16.74,6.3-25.97,6.3-3.96,0-7.86-.57-11.74-1.75-1.86-.53-3.74-1.11-5.64-1.69-6.43-1.98-12.5-3.85-18.43-3.85,0,0-.89.02-.89.02l-.5-.03c-.44-.02-.89-.03-1.33-.03-8.48,0-16.47,4.22-24.95,8.69-5.97,3.15-12.73,6.71-19.95,8.81l-.27.08c-8.43,2.27-17.17,2.61-25.07,2.92-2.66.1-5.31.2-7.8.38l-.41.02c-3.64.16-7.24.43-11.04.73l-.26.02c-5.78.44-11.76.91-17.74.91h-1.59c-5.97-.06-11.89-.48-17.67-.9-5.49-.4-10.67-.77-16.11-.84-4.24.04-8.53.44-13.22.86-5.12.47-10.41.95-15.88.95-.96,0-1.9-.01-3.07-.05-6.51-.06-12.88-.86-19.04-1.63-4.34-.54-8.45-1.05-12.4-1.31l-.36-.03c-1.54-.13-3.1-.19-4.65-.19-12.97,0-25.02,4.26-39.26,9.78l-.55.2c-8.18,2.79-17.19,4.09-28.33,4.09-2.61,0-5.38-.07-8.39-.21h-.25c-2.01-.14-4.04-.2-6.03-.2-13.78,0-38.64,3.12-50.32,23.95l-.17.29c-2.24,3.73-3.69,8.19-5.11,12.55-1.3,4.01-2.54,7.81-4.5,11.62-5.01,10.13-13.72,16.5-22.14,22.66-5.18,3.78-10.06,7.36-13.69,11.57l-.34.37c-14.48,14.89-22.52,37.32-24.61,68.55,0,.13-.01.26-.02.39-.65,25.65,13.36,57.44,33.31,75.59.12.11.24.21.36.32,20.33,16.67,45.11,26.24,68,26.24,2.86,0,5.73-.15,8.54-.44.12-.01.25-.03.37-.05,14.47-2.08,28.46-2.37,41.42-2.37,3.45,0,6.9.02,10.35.05,3.42.02,6.84.04,10.28.04,6.29,0,11.44-.08,16.18-.25,3.63-.13,7.39-.19,11.49-.19,7.11,0,14.21.18,21.07.36,6.74.17,13.72.35,20.56.35,10.69,0,19.43-.45,27.4-1.41,6.43-.71,12.95-2.54,19.9-4.49,3.01-.85,5.99-1.68,9.01-2.44,5.5-1.32,11.09-1.99,16.62-1.99,6.14,0,12.35.83,18.36,2.44l.32.09c12.42,3.64,25.1,5.49,37.69,5.49,3.92,0,7.84-.18,11.82-.56,3.22-.36,7.04-.72,11.01-.72,12.9,0,22.16,4.07,28.26,12.37,1.66,2.3,3.27,4.67,4.9,7.08,5.11,7.53,10.4,15.32,17.56,20.23.09.06.17.12.26.17,19.05,12.15,43.22,18.58,69.91,18.58,12.35,0,25.05-1.35,37.71-4.01l.15-.03c25.11-4.94,50.62-12.38,67.1-33.15l.16-.21.19-.21c3.09-3.37,7.26-7.69,12.05-11.05,15.54-10.7,37.68-12.31,53.05-12.59h.31c4.37.08,8.75.44,13,.79,4.6.38,9.35.77,13.88.77,3.4,0,6.37-.22,8.88-.64l.56-.08c5.28-.66,11.44-1.38,17.6-1.38,2.94,0,5.69.15,8.52.49,7.32.77,14.26,2.98,20.38,4.93l.31.1c2.02.64,4.04,1.28,6.04,1.86,9.01,2.6,18.43,3.92,27.98,3.92,4.81,0,9.69-.34,14.41-.99l.28-.04c28.3-3.36,50.87-24.08,64.97-41.03,10.59-13.35,16.24-31.44,17.29-55.34l.02-.68c2.88-47.68-27.27-88.28-75-101.02M676.91,133.07c3.85-1.93,11.52-3.38,10.48-8.98-.71-2.74-5.63-3.7-7.05-4.93-1.85-1.92,1.66-3.89,3.41-4.41,14.66-4.3,11.81,27.9,22.53,38.24,7.39,2.46,14.13,7.18,20.79,6.25.2-.03.38-.09.57-.12,3.3-1.3,6.27-5.23,4.39-7.31-2.5-3.2-9.53-2.44-13.49-2.76-5.08.02-10-3.1-8.31-8.56,5.24-16.19,28.78-13.24,30.25,3.95l.05.42c.32,2.46.1,4.98-.55,7.38.24-.15.48-.32.72-.46,6.77-4.2,11.13,2.49,11.01,9.08v.49c.09,6.78-2.58,13.87-7.61,18.29-9.3,8.39-23.9,1.41-37.08-3.43-8.69-3.84-16.57-2.27-24.2,2.82-9.83,6.11-12.67-4.31-10.56-12.41.52-2.32,1.43-4.34,2.6-6.12-7.06-8.09-8.28-22.46,2.04-27.43M605.85,150.75c7.99-1.77,24.71-1.55,26.1-11.51.08-5.07-6.89-9.72-12.57-9.4-6.84-.18-8.85,7.17-13.04,11.17-3.12,3.38-9.22,3.6-10.99-1.14-3.08-8.34,5.03-16.32,12.91-17.88,27.36-5.96,36.54,10.04,35.47,34.88.47,8.27-.85,15.1,8.49,16.47.78.32,1.2.4,1.7,1.19l.07.16c.35,1.16-.53,2.63-1.47,3.61-6.41,6.11-15.34.69-23.19,2.13-12.33,2.57-30.76,7.16-37.81-5.54-6.05-10.73,2.43-23.13,14.33-24.12M519.02,135.61c2.07-3.56,5.71-6.89,9.27-8.73,5.83-3.23,13.3-3.84,18.98-3.13,5.91.62,10.47,1.73,12.82-1.21,2.43-2.74,2.61-9.14-.31-12.17-2.42-2.74-6.66-3.38-9.7-5.18-2.33-1.14-3.78-3.76-1.4-5.53,3.22-2.7,12.24-3.01,17.4-1.07,4.73,1.6,6.81,6.4,7.16,11.16,1.17,16.09-.87,32.88-.1,49.24.18,3.36.58,6.79,2.06,9.83,2.32,4.93,7.97,8.42,7.8,11.09l-.02.21c-3.82,7.05-14.44,1.95-20.39,2.27-2.45-.02-4.9.37-7.6,1.04-28.45,9.91-50.44-23.71-35.97-47.82M481.73,107.28l.04.43c.72,9.87-15.47,13.31-18.73,3.83-3.58-13.1,15.91-16.87,18.69-4.26M467.59,139.99c-4.95-6.13-21.96-9.96-19.37-13.64,2.97-2.43,7.32-2.49,11.45-2.66,9.42-.13,19.77,3.7,23.77,12.59,6.84,16.39,2.22,28.77,20.96,38.25,2.56,1.75,6.88,3.4,7.53,5.73v.12c-.17.8-.98,1.2-1.84,1.56-3.93,1.71-15.04,2.03-26.1,2.82-7.37.32-37.31,4.75-37.52-1.91,5.65-5.39,16.26-7.16,21.56-13.66,7.09-7.68,7.02-21.6-.43-29.19M370.75,125.21c12.8-.97,25.41-2.69,38.67-2.81,7.2-.61,16.12-.82,19.16,7.19,5.22,12.3-.93,27.58,4.18,39.07,1.42,3.7,4.6,7.69,4.69,11.55v.29c-1.35,6.49-12.2,5.79-16.66,2.7-4.87-3.08-1.63-11.27-.67-17.42.9-7.66.61-16.43-1.02-23.86-1.81-7.28-7.07-5.92-10-.2-3.45,6.51-4.1,15.91-3.14,23.68.9,5.82,4.81,14.9-2,17.04-5.76,1.97-12.43-.15-10.65-7.72,2.28-8.26,1.92-18.32,1.6-27.1.25-6.9-3.63-14.52-10.15-8.7-5.83,6.23-4.46,14.79-4.05,23.29.16,2.62.58,5.23,1.28,7.73,1.94,6.1,3.27,12.88-3.73,14.78-3.88,1.28-11.68,1.65-12.37-3.41-.17-3.22,1.69-6.76,2.53-9.94,1.58-4.82,1.35-10.39,1.3-16.1.33-7.92-.61-15.11-3.88-22.03-2.03-5.01-.47-7.58,4.91-8.02M294.33,139.62c6.55-15.67,30.07-22.77,44.35-13.12,5.19,3.53,10.15,7.89,12.86,13.7,2.12,5.17,1.43,13.03,2,17.23v.25c.53,12.14-9.26,24.31-20.88,27.77-14.53,3.59-30.99-5.7-38.62-17.99-3.97-8.77-2.83-19.03.3-27.84M232.92,328.37l-.07.26c-4.98,12.61-28.45,7.16-41.31,8.22-.78,0-1.57.01-2.35.03,2.91-8.82,6.03-22.17,6.03-39.12,0-31.8-10.96-51.09-10.96-51.09,0,0-10.96,26.78-10.96,51.09,0,14.4,3.85,29.66,6.98,39.71-12.82,1.31-25.66,4.18-38.5,3.34-44.2-2.83-77.82-55.18-65.28-98.99,6.08-22.6,25.66-40.08,49.01-42.93,16.37-3.19,40.53,2.37,53.77-8.28,5.45-4.4,7.4-11.88,4.43-18.25-3.74-8.65-14.38-14.07-20.68-20.65-3.78-3.5-4.7-8.77-.05-11.71,6.92-5.36,25.14-5.66,35.31-.46,14.01,5.95,18.64,21.65,18.9,35.83.8,22.91-2.58,47.11-3.15,70-.39,15.9.41,32.14,5.76,47.24,4.06,12.99,15.3,25.56,13.13,35.76M231.27,173.81c-9.65-10.91-9.27-26.26-2.8-38.32,3.42-6.81,9.47-11.63,16.83-13.6,13.02-2.98,32.54-.03,35.9,15.21,1.88,9.65-9,13.49-14.81,5.94-4.7-6.83-7.09-12.39-16.15-10.83-6.83,1.17-12.74,6.67-14.38,13.42-2.22,10.41.2,24.59,10.62,28.6,9.19,3.28,18.59-4.52,25.7-8.81,3.74-2.12,7.72,1.47,7.28,5.52l-.02.28c-.38,4.45-5.79,7.91-11.19,10.73-12.33,6.19-28.04,2.21-36.97-8.13M654.79,358.66l-.04.41c-6.76,38.08-65.76,43.12-97.23,38.83-16.57-2.05-35.59-6.83-44.65-22.08-6.78-11.3-5.36-25.17-4.2-37.8.28-2.8.52-5.61.74-8.41-12.06,2.57-25.33-1.28-37.72.36-14,1.36-28.1,5.89-42.36,6.13-28.77.94-55.43-12.1-56.27-34.65-.46-10.89,4.52-22.02,12.53-29.43,16.2-14.8,40.63-12.78,61.19-17.41,23.23-4.33,35.12-22.06,13.44-37.06-7.2-4.73-16.92-6.75-24.66-2.31-8.28,4.52-13.33,16.09-21.78,22.16-8.29,6.21-16.98,5.3-22.38.58-4.05,3.93-10.11,5.68-15.78,3.68-8.91-2.62-15.77-12.39-24.03-15.79-21.53-7.44-40.31,15.32-46.64,33.7-5.2,14.77-7.53,34.45,2.34,45.68,9.27,11.07,40.28,19.29,9.98,29.3-13.49,4.17-64.15,9.13-73.37-3.05-2.2-6.53,15.58-12.91,19.72-17.65,11.78-9.87,12.76-25.16,12.92-41.37-.59-14.87,1.28-32.27-8.21-44.69-5.03-6.47-15.21-10.43-21.43-15.93-9.87-9.48,4.58-13.65,15.57-14.06,9.25-.41,18.65,1.68,27.51,4.01,6.65,1.69,13.31,3.12,20.18,2.78,13.91-.61,29.23-8.01,44.33-8.25,13.32-1.2,29.48,4.07,37.22,14.77,16.03-21.85,49.62-25.69,74.09-17.26,38.81,13.56,30.41,66.92,40.37,104.37,1.21,3.41,3.24,5.93,5.5,8.13.49-3.28,1.08-6.51,1.84-9.69,2.01-8.84,4.72-17.55,5.75-26.58,1.56-12.01-.31-24.62,2.1-36.58,4-23.43,25.54-37.14,49.42-36.82,13.51-.05,26.84,1.94,40.37.64,11.24-.74,22.68-2.43,32.41,1.57,8.15,2.89,12.71,12.01,7.5,19.7-4.34,7.16-11.49,12.94-16.15,20.03-6.78,9.51-8.29,21.84-15.24,31.8-5.26,7.84-13.22,13.46-22.05,16.72-12.95,5.01-28.29,5.53-40.63,8.89-20.57,5.4-20.3,20.23,1.52,22.98,23.57,2.21,48.43-2.49,70.79,7.25,13.26,5.3,26.79,16.98,25.48,32.37M778.17,331.3c-10.7.72-21.32-4.63-31.92-3.98-6.42.19-13.06,2.34-19.38,4.35-41.93,14.65-95.48-6.87-76.32-48.5,11.49-30.19,50.36-22.58,75.27-29.07,28.46-5.9,23.15-30.71,1.38-41.17-22.53-10.67-26.76,8.75-36.17,25.08-6.45,11.37-25.1,9.21-31.32-.86-7.79-15,8.48-34.79,23.1-41.31,12.26-5.62,27.81-6.75,41.35-5.43,55.19,5.56,40.19,74.7,51.73,118.62,3.74,7.58,16.87-4.05,20.18,4.33l.07.26c2.02,8.78-8.59,17.98-17.96,17.68M928.09,275.26c-6.32,58.17-50.89,79.88-92.48,62.74,3.01-8.78,6.39-22.57,6.39-40.24,0-31.8-10.96-51.09-10.96-51.09,0,0-10.96,26.78-10.96,51.09,0,12.48,2.89,25.6,5.7,35.42-7.38-4.21-14.56-9.66-21.29-16.43-18.16-16.23-24.44-41.96-18.7-64.79,9.1-43.3,57.84-70.49,98.93-52.15,18.55,8.99,32.69,22.64,39,40.37,3.27,9.2,6.21,18.1,4.37,35.08"/>
              <path fill="currentColor" d="M677.79,156.98c.86.79,1.83,1.55,2.87,2.35.71.57,2.12,1.33,2.62,1.47.29.11.6.19.9.27.18.04.36.08.54.11.05,0,.1.02.15.02,4.66.65,10.07-1.97,11.24-6.27l.1-.36c1.32-7.53-1.08-20.39-11.07-19.87-5.14.33-9.27,4.58-10.71,9.5-1.31,5.14-.28,9.44,3.26,12.87.03-.03.06-.06.09-.09M676.27,155.1s0-.03,0-.04c.02,0,.04.02.06.03l-.06.02Z"/>
              <path fill="currentColor" d="M734.71,142.97c1.63-4.02-5.56-7.33-8.6-8.15-2.05-.37-4.26.13-6.22.86-3.72,1.42-6.57,2.26-6.42,6.08.34,4.04,5.33,2.83,8.45,3.02,4.04-.1,9.67,1.34,12.61-1.56l.17-.26Z"/>
              <path fill="currentColor" d="M619.14,176.18c9.28-1.47,16.58-9.19,16.05-18.85l-.02-.47c-.18-4.32-2.5-5.22-6.24-3.87-6.13,2.52-12.95,2.27-19.25,4.19-5.28,1.71-11.55,6.92-10.13,12.99,3,6.91,12.82,7.2,19.59,6.02"/>
              <path fill="currentColor" d="M527.92,164.01c4.32,8.81,13.93,14.44,23.9,10.01,9.18-4.01,11.41-14.65,11.78-24.18v-.48c.91-17.66-25.2-22.13-33.65-8.92-3.06,5.11-4.71,11.9-4.41,17.71.26,2.2,1.17,4.05,2.38,5.86"/>
              <path fill="currentColor" d="M633.66,353.2c-6.42-22.56-54.41-21.09-73.05-17.2-12.81,2.68-40.37,9.74-30.42,27.51,15.85,25.88,104.17,22.28,103.53-9.99l-.05-.32ZM544.89,366.26c-2.29-1.42-4.11-3.1-5.29-5.04-3.42-6.1.07-10.23,5.3-13.01,2.11-1.12,4.66.6,4.4,2.97-.19,1.69-.29,3.43-.29,5.2,0,2.37.18,4.69.51,6.92.38,2.55-2.43,4.33-4.62,2.97M564.39,371.26c-1.16-.19-2.3-.42-3.41-.67-.99-.22-1.78-.96-2.14-1.91-1.41-3.69-2.21-7.86-2.21-12.29,0-3.46.5-6.76,1.38-9.8.31-1.05,1.13-1.88,2.19-2.14,1.34-.33,2.59-.61,3.68-.84.01,0,.03,0,.04,0,2.08-.43,3.91,1.4,3.55,3.49-.51,2.98-.78,6.17-.78,9.31,0,3.83.39,7.73,1.15,11.24.45,2.1-1.34,3.99-3.45,3.64M586.15,370.01c-.36,1.22-1.47,2.07-2.74,2.12-1.53.06-3.07.07-4.6.04-1.27-.03-2.4-.88-2.77-2.09-1.09-3.61-1.82-8.34-1.82-13.69,0-4.44.5-8.46,1.29-11.76.31-1.29,1.44-2.2,2.76-2.29,1.71-.11,3.51-.18,5.34-.2,1.4-.01,2.65.91,2.98,2.27.82,3.34,1.35,7.43,1.35,11.97,0,5.32-.72,10.03-1.8,13.63M604.08,368.51c-.34.9-1.12,1.58-2.05,1.81-1.13.28-2.29.52-3.47.74-2.13.39-3.95-1.51-3.5-3.63.73-3.46,1.11-7.29,1.11-11.05,0-3.46-.32-6.98-.94-10.21-.38-2,1.3-3.78,3.33-3.55,1.2.14,2.38.3,3.54.5,1.09.19,1.97.99,2.33,2.05,1.16,3.42,1.8,7.22,1.8,11.22,0,4.37-.78,8.48-2.15,12.13M617.74,365.85c-2.17,1.38-4.97-.42-4.61-2.96.29-2.1.45-4.28.45-6.51s-.16-4.53-.48-6.69c-.36-2.47,2.21-4.31,4.41-3.13,3.55,1.9,6.17,4.51,7.18,8.06l.04.21c.09,4.58-2.61,8.25-6.99,11.02"/>
            </g>
          </svg>
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
              title={["Curioso", "Nojentinho", "Estudado"][n - 1]}
              onClick={() => setSkin(n)}
            />
          ))}
        </div>
        <span className="skin-active-name">{["Curioso", "Nojentinho", "Estudado"][skin - 1]}</span>
        <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="btn btn-buy">Comprar Agora →</a>
      </nav>

      {/* CONTEÚDOS */}
      <div className="section-label">Conteúdos</div>
      <div className="content-grid">
        {/* ROW 1 */}
        <div className="row">
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

          <a href="/assets/pdfs/Manual%20do%20Criador.pdf" target="_blank" rel="noopener noreferrer" className="card card-pdf ratio-3-4">
            <HoverBg imgKey="manual" />
            <div className="card-pdf-top">
              <div className="card-tag">Manual</div>
            </div>
            <div className="card-pdf-bottom">
              <div className="pdf-icon">📖</div>
              <div className="card-label">Manual do<br />Criador</div>
              <div className="card-sub">Clique e acesse o guia completo para criadores de conteúdo</div>
            </div>
          </a>
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

          <a href="/imprensa" className="card card-quiz-companion">
            <HoverBg imgKey="companion" />
            <div className="card-inner">
              <div className="card-body">
                <span className="cqc-label">// imprensa</span>
                <div className="card-label">Na Mídia &<br />Cobertura</div>
                <div className="card-sub">23 links — matérias, vídeos e o que falam sobre o Dragão</div>
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
            <HoverBg imgKey="instagram" />
            <div className="card-inner"><div className="card-body">
              <span className="social-icon">📸</span>
              <div className="card-tag">Instagram</div>
              <div className="card-label">@comida<br />dedragao</div>
              <div className="card-sub">Posts, stories, reels e o Dragão provocando todo dia</div>
            </div></div>
            <div className="card-hover-overlay" style={{ background: "rgba(255,45,120,0.08)" }} />
          </a>

          <a href="https://wa.me/552139500576" target="_blank" rel="noopener noreferrer" className="card card-social card-social-wa ratio-3-4" style={{ flexGrow: 3 / 4 }}>
            <HoverBg imgKey="whatsapp" />
            <div className="card-inner"><div className="card-body">
              <span className="social-icon">💬</span>
              <div className="card-tag">WhatsApp SAC</div>
              <div className="card-label">Fala<br />com<br />a gente</div>
              <div className="card-sub">(21) 3950-0576 — O Dragão não abandona ninguém</div>
            </div></div>
            <div className="card-hover-overlay" style={{ background: "rgba(0,255,135,0.06)" }} />
          </a>

          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="card card-social card-social-map ratio-16-9" style={{ flexGrow: 16 / 9 }}>
            <HoverBg imgKey="lojas" />
            <div className="card-inner"><div className="card-body">
              <span className="social-icon">📍</span>
              <div className="card-tag">Presença Física</div>
              <div className="card-label">+30 Lojas<br />SP e RJ</div>
              <div className="card-sub">Encontre a loja mais perto de você</div>
            </div></div>
            <div className="card-hover-overlay" />
          </a>

          <a href="mailto:somos@letsfly.com.br" className="card card-social card-social-email ratio-3-4" style={{ flexGrow: 3 / 4 }}>
            <HoverBg imgKey="email" />
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
      <div className="section-label" style={{ marginTop: 16 }}>Onde Comprar</div>
      <div className="content-grid" style={{ paddingTop: 8 }}>
        <div className="row">
          {[
            { cls: "card-shop-amazon", href: "https://www.amazon.com.br/s?k=comida+de+dragao", name: "Amazon", tag: "Entrega rápida · Prime", hoverKey: "amazon" },
            { cls: "card-shop-ml", href: "https://www.mercadolivre.com.br", name: "Mercado\nLivre", tag: "Frete Grátis", hoverKey: "ml" },
            { cls: "card-shop-petlove", href: "https://www.petlove.com.br", name: "Petlove", tag: "Especialista em pets", hoverKey: "petlove" },
            { cls: "card-shop-oficial", href: "https://comidadedragao.com.br", name: "Loja\nOficial", tag: "Site próprio · melhor preço", hoverKey: "oficial" },
          ].map((shop, i) => (
            <a key={i} href={shop.href} target="_blank" rel="noopener noreferrer" className={`card card-shop ${shop.cls}`}>
              <HoverBg imgKey={shop.hoverKey} />
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
