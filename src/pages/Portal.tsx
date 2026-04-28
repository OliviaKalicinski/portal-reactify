import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import ReelsSection from "@/components/ReelsSection";
import PageMeta from "@/components/PageMeta";
import portalDogImg from "@/assets/portal-dog.png";
import lojasCoverImg from "@/assets/lojas-cover.png";
import emailCoverImg from "@/assets/email-cover.png";
import shopAmazonCover from "@/assets/shop-amazon-cover.png";
import shopMlCover from "@/assets/shop-ml-cover.png";
import shopPetloveCover from "@/assets/shop-petlove-cover.png";
import "./Portal.css";

const PORTAL_COVER = "/assets/images/" + encodeURIComponent("PORTAL COMIDA DE DRAGÃO.png");

/**
 * FORMSPREE ENDPOINT
 * ------------------
 * Para o "Escreve pro Dragão" capturar leads sem abrir o email do usuário:
 * 1. Criar conta grátis em https://formspree.io
 * 2. Criar form "Escreve pro Dragão" → destino somos@letsfly.com.br
 * 3. Copiar o endpoint (algo tipo https://formspree.io/f/xxxxxxxx)
 * 4. Substituir abaixo
 * Enquanto não tiver endpoint real, o form mostra mensagem de erro (placeholder).
 */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_ME";

const CARD_HOVER_IMAGES: Record<string, string> = {
  manifesto:  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2FuY2JjbDV0aXdjNWgwOHhvcWZqY3ozZWZoZ3FoaXVtNzZ2aDRuOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mrTjb8ZXFeJdC/giphy.gif",
  quiz:       "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJxNHpkYTNjYmI2cTlpOTV4ZTQxZG5ia3VpMnpvamNuZjBzdWEwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1kkxWqT5nvLXupUTwK/giphy.gif",
  audio:      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm13bXZicTVvNWZncXdubnp5NDU4NTd3Y2t4bTU5bWZhcnZqNm0wYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/521JGiED6zWanTJroD/giphy.gif",
  produtos:   "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmMzczJyY2V0YjRhdG16NXdlMzJxcXNneHpuYTR5aWY1M3hwOHk4NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DZ1NZce3T5Q3e/giphy.gif",
  perguntas:  "/assets/images/sus-dog.gif",
  blog:       "/assets/images/portal-comida-dragao.png",  // TODO: trocar por GIF do Blog quando Bruno escolher
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
  amazon:     "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWNlZWR4d3NwdDZ2YndqcTM2aGtpM2NpMDh4NmthMTBwaWRub2ZnbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zkcXND5kY4POU/giphy.gif",
  ml:         "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGg5cjNnNXdqeWRwajRlNTJjdjlubnZndG0wdHFsd2I1bWE2Z3NoeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ovinMYvSg1TSo/giphy.gif",
  petlove:    "/assets/images/instinto-nao-erra.jpg",
  oficial:    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXFxcXNrNnd3OWlybzJ5aTZkdHR0NWl3eGVpd3Mxd2JlaXl2amM0diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZCqpHjpPQ7ZvHQytL7/giphy.gif",
};

const HoverBg = ({ imgKey }: { imgKey: string }) => (
  <>
    <div
      className="card-img-hover"
      style={{ backgroundImage: `url('${CARD_HOVER_IMAGES[imgKey]}')` }}
    />
    <span className="card-cta-arrow" aria-hidden="true">→</span>
  </>
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
  "O DRAGÃO VÊ TUDO",
  "INCLUSIVE O CARRINHO QUE VOCÊ ABANDONOU ÀS 2H DA MANHÃ",
  "BSF — BLACK SOLDIER FLY",
  "NUTRIÇÃO QUE RESPEITA O PLANETA",
];


const PRODUCTS_LIST = [
  { icon: "01", name: "ORIGINAL BSF", who: "Todos os pets", delay: "0s" },
  { icon: "02", name: "MORDIDA LEGUMES", who: "Só cães", delay: "0.07s" },
  { icon: "03", name: "MORDIDA SPIRULINA", who: "Só cães", delay: "0.13s" },
  { icon: "04", name: "SUPLEMENTO", who: "Cães + gatos", delay: "0.19s" },
  { icon: "05", name: "GRUB GEL", who: "Répteis + anfíbios", delay: "0.25s" },
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
  const [profileJoke, setProfileJoke] = useState<number | null>(null);

  // Piadinhas por perfil (aparece quando clica num card do perfil-selector)
  const PROFILE_JOKES: Record<number, { tag: string; title: string; text: string }> = {
    1: {
      tag: "perfil 01 · curioso",
      title: "Ei, detetive.",
      text: "Você é o tipo que googla 'larva desidratada é seguro pra cachorro?' e lê até o último PDF. Boa. A gente tem muita carne nova pro seu cérebro.",
    },
    2: {
      tag: "perfil 02 · nojentinho",
      title: "Calma aí.",
      text: "A gente sabe. Da primeira vez também arrepiou. Hoje a gente serve no petisco do filhote. Se liga — nojento mesmo é o desperdício.",
    },
    3: {
      tag: "perfil 03 · estudado",
      title: "Beleza, nerd.",
      text: "Proteína 40%, digestibilidade 88,9%, ingrediente único hipoalergênico, 83% menos CO₂. Ficha técnica completa, papers, tudo aqui. Não vamos te insultar com marketing.",
    },
  };

  const [audioOpen, setAudioOpen] = useState(false);
  const [audioMinimized, setAudioMinimized] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Email / Escreve pro Dragão
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: "", nome: "", mensagem: "" });
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [emailErrMsg, setEmailErrMsg] = useState("");

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

  const openEmail = useCallback(() => {
    setEmailStatus("idle");
    setEmailErrMsg("");
    setEmailOpen(true);
  }, []);
  const closeEmail = useCallback(() => {
    setEmailOpen(false);
    // mantém o conteúdo digitado caso o user reabra
  }, []);

  const submitEmail = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailForm.email.trim();
    const mensagem = emailForm.mensagem.trim();
    if (!email || !mensagem) {
      setEmailStatus("err");
      setEmailErrMsg("Preenche email e mensagem.");
      return;
    }
    // validação básica de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus("err");
      setEmailErrMsg("Esse email parece torto, confere aí.");
      return;
    }
    if (FORMSPREE_ENDPOINT.includes("REPLACE_ME")) {
      setEmailStatus("err");
      setEmailErrMsg("Endpoint ainda não configurado (Bruno precisa criar form no Formspree).");
      return;
    }
    setEmailStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          nome: emailForm.nome.trim() || "(sem nome)",
          mensagem,
          origem: "Portal do Dragão — Escreve pro Dragão",
          _subject: `Dragão recebeu uma mensagem de ${emailForm.nome.trim() || email}`,
        }),
      });
      if (res.ok) {
        setEmailStatus("ok");
        setEmailForm({ email: "", nome: "", mensagem: "" });
      } else {
        setEmailStatus("err");
        setEmailErrMsg("Algo deu ruim no envio. Tenta de novo em 1 min.");
      }
    } catch {
      setEmailStatus("err");
      setEmailErrMsg("Sem conexão. Verifica sua internet.");
    }
  }, [emailForm]);

  // Keyboard Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { closeModal(); closeManifesto(); closeCatalog(); closePerguntas(); closeEmail(); } };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeModal, closeEmail]);

  // Body overflow lock when any modal is open
  useEffect(() => {
    if (modalOpen || manifestoOpen || perguntasOpen || emailOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen, manifestoOpen, perguntasOpen, emailOpen]);

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

  // (heroTaglineContent removido — novo hero com título + descrição + interativo abaixo)

  const footerText = nameUpper
    ? `O Dragão viu, ${nameUpper}. O Dragão aprovou. Agora é sua vez.`
    : "O Dragão viu. O Dragão aprovou. Agora é sua vez.";

  return (
    <div className={`portal-page skin-${skin}`}>
      <PageMeta
        title="Comida de Dragão — Hub do Dragão"
        description="Nojento é o desperdício. Proteína de inseto pra pets — 88,9% de digestibilidade, feita na nossa biofábrica em Cachoeiras de Macacu. Mais que um alimento, uma revolução."
        image="/assets/images/canal-dragao-cover.png"
      />
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

        /* ============================================================
           RISOGRAPH DO DRAGÃO — popups com misregistration + grain
           ============================================================ */
        .riso-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,10,10,0.85);
          backdrop-filter: blur(5px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: riso-fade 0.22s ease;
        }
        @keyframes riso-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .riso {
          position: relative;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 36px 30px 32px;
          font-family: 'Space Grotesk', sans-serif;
          box-shadow:
            0 0 0 2.5px #0A0A0A,
            12px 14px 0 0 #0A0A0A;
          animation: riso-pop 0.24s cubic-bezier(0.2, 0.9, 0.4, 1.4);
        }
        .riso.large { max-width: 620px; }
        @keyframes riso-pop {
          from { opacity: 0; transform: scale(0.94) translateY(14px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .riso::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
          mix-blend-mode: multiply;
          opacity: 1;
          pointer-events: none;
          z-index: 1;
        }
        .riso > * { position: relative; z-index: 2; }

        .riso-close {
          position: absolute;
          top: 14px;
          right: 16px;
          width: 36px;
          height: 36px;
          border: 2.5px solid #0A0A0A;
          background: #FAFAFA;
          color: #0A0A0A;
          font-family: 'Space Mono', monospace;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          z-index: 10;
          transition: transform 0.15s;
          padding: 0;
          line-height: 1;
        }
        .riso-close:hover { transform: rotate(90deg); }

        .riso-pagenum {
          position: absolute;
          font-family: 'Archivo Black', 'Bebas Neue', sans-serif;
          font-size: 260px;
          line-height: 0.78;
          opacity: 0.09;
          bottom: -34px;
          right: -16px;
          pointer-events: none;
          z-index: 1;
          letter-spacing: -0.04em;
          color: #0A0A0A;
          font-weight: 900;
        }

        .riso-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          padding: 5px 9px;
          display: inline-block;
          border: 1.5px solid #0A0A0A;
          background: rgba(0,0,0,0.08);
          margin-bottom: 10px;
          color: #0A0A0A;
        }

        .riso-title {
          font-family: 'Archivo Black', 'Big Shoulders Display', sans-serif;
          font-size: clamp(48px, 6.5vw, 82px);
          line-height: 0.85;
          letter-spacing: -0.015em;
          text-transform: uppercase;
          margin: 16px 0 22px;
          color: #0A0A0A;
          font-weight: 900;
        }

        .riso-body { }
        .riso-body p {
          font-size: 14.5px;
          line-height: 1.55;
          margin-bottom: 10px;
          color: rgba(10,10,10,0.88);
        }
        .riso-body p.pull {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          line-height: 1;
          letter-spacing: 0.01em;
          color: #0A0A0A;
          border-top: 3px solid #0A0A0A;
          border-bottom: 3px solid #0A0A0A;
          padding: 12px 0;
          margin: 18px 0;
        }
        .riso-body p.meta {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: rgba(10,10,10,0.75);
          letter-spacing: 0.08em;
        }
        .riso-body p.strong {
          font-weight: 700;
          color: #0A0A0A;
        }

        .riso-signature {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-top: 14px;
          font-weight: 700;
          color: rgba(10,10,10,0.7);
        }

        .riso-btn {
          display: inline-block;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.12em;
          padding: 13px 24px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          margin-top: 16px;
          margin-right: 8px;
          box-shadow: 4px 4px 0 rgba(0,0,0,0.3);
          transition: transform 0.12s, box-shadow 0.12s;
          color: #0A0A0A;
        }
        .riso-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 rgba(0,0,0,0.35);
        }
        .riso-btn:disabled {
          opacity: 0.55;
          cursor: wait;
          transform: none;
        }
        .riso-btn.ghost {
          background: transparent;
          border: 2.5px solid #0A0A0A;
          box-shadow: none;
          color: #0A0A0A;
        }
        .riso-btn.ghost:hover {
          background: #0A0A0A;
          color: #FAFAFA;
        }

        .riso-strip {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 9px;
          background: #0A0A0A;
          z-index: 3;
        }
        .riso-strip::after {
          content: '';
          position: absolute;
          top: 5px;
          left: 0;
          right: 0;
          height: 4px;
        }

        /* COMBO 2 — MANIFESTO (laranja + pink) */
        .riso-manifesto { background: #FF7A00; }
        .riso-manifesto .riso-title { text-shadow: 3px 3px 0 #FF2D78, 6px 6px 0 rgba(0,0,0,0.15); }
        .riso-manifesto .riso-strip::after { background: #FF2D78; }
        .riso-manifesto .riso-btn { background: #FF2D78; color: #0A0A0A; }

        /* COMBO 7 — EMAIL (yellow + pink) */
        .riso-email { background: #FFE600; }
        .riso-email .riso-title { text-shadow: 3px 3px 0 #FF2D78, 6px 6px 0 rgba(0,0,0,0.15); }
        .riso-email .riso-strip::after { background: #FF2D78; }
        .riso-email .riso-btn { background: #FF2D78; color: #FAFAFA; }

        /* COMBO 4 — DRAGÃO FALA VIDEO (pink + lime) */
        .riso-video { background: #FF2D78; padding: 24px 26px 22px; }
        .riso-video .riso-title {
          text-shadow: 3px 3px 0 #7BFF00, 6px 6px 0 rgba(0,0,0,0.2);
          font-size: clamp(38px, 5vw, 56px);
          margin: 10px 0 14px;
        }
        .riso-video .riso-strip::after { background: #7BFF00; }
        .riso-video .riso-btn { background: #7BFF00; color: #0A0A0A; }
        .riso-video .riso-body p { font-size: 13.5px; line-height: 1.5; }
        .riso-video .riso-signature { margin-top: 8px; }

        /* COMBO 10 — PERGUNTAS (violet + lime · texto branco) */
        .riso-perguntas { background: #925AED; color: #FAFAFA; }
        .riso-perguntas .riso-title { color: #FAFAFA; text-shadow: 3px 3px 0 #7BFF00, 6px 6px 0 rgba(0,0,0,0.3); }
        .riso-perguntas .riso-strip::after { background: #7BFF00; }
        .riso-perguntas .riso-btn { background: #7BFF00; color: #0A0A0A; }
        .riso-perguntas .riso-eyebrow { border-color: #FAFAFA; background: rgba(255,255,255,0.1); color: #FAFAFA; }
        .riso-perguntas .riso-body p { color: rgba(255,255,255,0.88); }
        .riso-perguntas .riso-body p.pull { color: #FAFAFA; border-color: #FAFAFA; }
        .riso-perguntas .riso-body p.strong { color: #FAFAFA; }
        .riso-perguntas .riso-body p.meta { color: rgba(255,255,255,0.7); }
        .riso-perguntas .riso-signature { color: rgba(255,255,255,0.65); }
        .riso-perguntas .riso-pagenum { color: #FAFAFA; opacity: 0.1; }
        .riso-perguntas .riso-btn.ghost { color: #FAFAFA; border-color: #FAFAFA; }
        .riso-perguntas .riso-btn.ghost:hover { background: #FAFAFA; color: #0A0A0A; }
        .riso-perguntas .riso-close { background: #FAFAFA; border-color: #FAFAFA; color: #0A0A0A; }

        /* Q&A list styles (usado no Perguntas) */
        .riso-qa {
          margin-top: 4px;
        }
        .riso-qa-item {
          padding: 18px 0;
          border-bottom: 2px dashed rgba(255,255,255,0.22);
        }
        .riso-qa-item:last-of-type { border-bottom: none; }
        .riso-qa-num {
          display: inline-block;
          font-family: 'Archivo Black', 'Bebas Neue', sans-serif;
          font-size: 22px;
          line-height: 1;
          color: #7BFF00;
          text-shadow: 2px 2px 0 rgba(10,10,10,0.35);
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }
        .riso-qa-q {
          font-family: 'Big Shoulders Display', 'Bebas Neue', sans-serif;
          font-size: 20px;
          line-height: 1.1;
          color: #FAFAFA;
          margin-bottom: 8px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.01em;
        }
        .riso-qa-a {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          line-height: 1.55;
          color: rgba(255,255,255,0.85);
        }

        /* FORMS */
        .riso-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 18px;
        }
        .riso-field { display: flex; flex-direction: column; gap: 5px; }
        .riso-field-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 700;
          color: rgba(10,10,10,0.72);
        }
        .riso-input,
        .riso-textarea {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          color: #0A0A0A;
          background: rgba(255,255,255,0.55);
          border: 2.5px solid #0A0A0A;
          padding: 10px 12px;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }
        .riso-input:focus,
        .riso-textarea:focus {
          background: #fff;
          box-shadow: 3px 3px 0 #FF2D78;
        }
        .riso-textarea { min-height: 110px; resize: vertical; line-height: 1.45; font-family: 'Space Grotesk', sans-serif; }
        .riso-helper {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(10,10,10,0.55);
          margin-top: -2px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .riso-status {
          padding: 10px 12px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          line-height: 1.45;
          border: 2px solid #0A0A0A;
          font-weight: 700;
        }
        .riso-status.ok { background: #7BFF00; color: #0A0A0A; }
        .riso-status.err { background: rgba(10,10,10,0.9); color: #FF2D78; }

        /* VIDEO FRAMES (vertical 9:16 pra video de boas-vindas)
           limite por altura — largura calculada pelo aspect-ratio
           pra garantir que o popup caiba em viewport típico sem scroll */
        .riso-video-frame {
          margin: 10px auto 8px;
          border: 3px solid #0A0A0A;
          aspect-ratio: 9 / 16;
          width: auto;
          max-height: 42vh;
          max-width: calc(42vh * 9 / 16);
          background: #0A0A0A;
          position: relative;
          box-shadow: 5px 5px 0 rgba(0,0,0,0.35);
          overflow: hidden;
        }
        .riso-video-frame video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .riso-video-frame::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom, transparent 0 2px, rgba(255,255,255,0.04) 2px 3px
          );
          pointer-events: none;
          z-index: 3;
        }
        .riso-video-tag {
          position: absolute;
          top: 10px;
          left: 12px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          background: rgba(10,10,10,0.85);
          padding: 3px 7px;
          z-index: 5;
          border: 1.5px solid;
          color: #7BFF00;
          border-color: #7BFF00;
        }

        @media (max-width: 600px) {
          .riso { padding: 28px 22px 24px; box-shadow: 0 0 0 2px #0A0A0A, 8px 10px 0 #0A0A0A; }
          .riso-title { font-size: clamp(40px, 10vw, 62px); }
          .riso-pagenum { font-size: 180px; bottom: -20px; right: -10px; }
        }

      `}</style>
      {/* TOP MARQUEE */}
      <MarqueeBar items={MARQUEE_TOP} />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-eyebrow">// portal do dragão</div>
          <DragonLogo className="hero-logo" />

          <h1 className="hero-title hero-title-inline">
            Bem-vindo à caverna.
          </h1>

          <p className="hero-descricao">
            Manifesto, produtos, ciência real, o que a mídia fala, como virar parceiro e as perguntas que ninguém tem coragem de fazer. Tudo num lugar só. <strong>Descobre. Aprende. Se diverte.</strong>
          </p>

          <div className="hero-name-block">
            <label className="hero-name-label" htmlFor="hero-name-input">como te chama?</label>
            <input
              id="hero-name-input"
              type="text"
              className="hero-name-input"
              placeholder="seu nome"
              maxLength={16}
              autoComplete="off"
              spellCheck={false}
              value={heroName}
              onChange={e => setHeroName(e.target.value)}
            />
            {nameUpper.length >= 2 ? (
              <p className="hero-tagline-sub hero-tagline-sub-reveal">
                <span className="hero-tagline-name">{nameUpper}</span>
                <span className="hero-tagline-rest"> já faz parte da revolução.</span>
              </p>
            ) : (
              <p className="hero-tagline-sub hero-tagline-sub-empty">
                segue o fio...
              </p>
            )}
          </div>
        </div>
      </section>

      {/* PERFIL SELECTOR — a brincadeira dos 3 modos + comprar discreto ao lado */}
      <section className="perfil-selector">
        <div className="perfil-selector-label">// quem é você?</div>
        <div className="perfil-selector-grid">
          {[
            { n: 1, name: "CURIOSO" },
            { n: 2, name: "NOJENTINHO" },
            { n: 3, name: "ESTUDADO" },
          ].map(p => (
            <button
              key={p.n}
              type="button"
              className={`perfil-card perfil-card-s${p.n}${skin === p.n ? " active" : ""}`}
              onClick={() => { setSkin(p.n); setProfileJoke(p.n); }}
              aria-pressed={skin === p.n}
            >
              <span className="perfil-num">{String(p.n).padStart(2, "0")}</span>
              <span className="perfil-name">{p.name}</span>
              <span className="perfil-indicator" aria-hidden="true" />
              <span className="perfil-cta">{skin === p.n ? "●" : "→"}</span>
            </button>
          ))}
          <a
            href="https://comidadedragao.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="perfil-buy-link"
          >
            <span className="perfil-buy-label">comprar</span>
            <span className="perfil-buy-cta">→</span>
          </a>
        </div>
      </section>

      {/* O DRAGÃO FALA — CTA principal, solo, gigante */}
      <nav className="dragon-cta-bar">
        <button type="button" className="btn-dragon-hero" onClick={openModal}>
          <span className="btn-dragon-hero-eyebrow">// apertou aqui você some por um tempo</span>
          <span className="btn-dragon-hero-title">O Dragão Fala</span>
          <span className="btn-dragon-hero-sub">clica se tiver coragem <span className="btn-dragon-hero-arrow">→</span></span>
        </button>
      </nav>

      {/* PROFILE JOKE POPUP — piadinha por perfil escolhido */}
      {profileJoke !== null && (
        <div
          className="profile-joke-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setProfileJoke(null); }}
          role="dialog"
          aria-modal="true"
        >
          <div className={`profile-joke-card profile-joke-card-s${profileJoke}`}>
            <button
              type="button"
              className="profile-joke-close"
              onClick={() => setProfileJoke(null)}
              aria-label="Fechar"
            >
              ×
            </button>
            <div className="profile-joke-tag">
              {PROFILE_JOKES[profileJoke].tag}
            </div>
            <div className="profile-joke-title">
              {PROFILE_JOKES[profileJoke].title}
            </div>
            <p className="profile-joke-text">
              {PROFILE_JOKES[profileJoke].text}
            </p>
            <button
              type="button"
              className="profile-joke-cta"
              onClick={() => setProfileJoke(null)}
            >
              bora lá →
            </button>
          </div>
        </div>
      )}

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
                <div className="card-label">Vira<br />Parceiro</div>
                <div className="card-sub">Entre na matilha →</div>
              </div>
            </div>
            <div className="card-hover-overlay" />
          </Link>

          <div onClick={openManifesto} style={{ cursor: "pointer" }} className="card card-manifesto-cta ratio-3-4">
            <div className="card-inner">
              <div className="card-body">
                <span className="card-tag">Manifesto</span>
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
            <img src="/assets/images/nossos-produtos.png" alt="" className="card-produtos-cover" draggable={false} />
            <HoverBg imgKey="produtos" />
            <div className="card-inner">
              <div className="card-body">
                <div className="card-label">Nossos<br />Produtos</div>
                <div className="card-sub" style={{ marginTop: 8 }}>Veja a linha completa — 7 SKUs</div>
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
              src="/assets/videos/na-midia.mp4?v=1"
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
            <HoverBg imgKey="perguntas" />
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
            href="https://comidadedragao.com.br/blogs/news"
            target="_blank"
            rel="noopener noreferrer"
            className="card card-lives ratio-1-1"
          >
            <HoverBg imgKey="blog" />
            <div className="card-inner">
              <div className="card-body">
                <span className="card-tag">Blog</span>
                <div className="card-label">Blog do<br />Dragão</div>
                <div className="card-sub">Histórias, ciência e o que o Dragão tá pensando</div>
                <span className="lives-cta">Ler →</span>
              </div>
            </div>
            <div className="card-hover-overlay" />
          </a>
        </div>
      </div>

      {/* STATS STRIP */}
      <h2 className="thesis-label thesis-label-center" style={{ marginTop: 40 }}>
        Não é marketing, <span>é matemática.</span>
      </h2>
      <div className="stats-strip">
        {[
          { num: <>83<span className="stat-unit">%</span></>,     label: <>menos <em>carbono</em></>,      hint: "~500g CO₂/kg (BSF) vs ~2.850g/kg (boi)." },
          { num: <>3140<span className="stat-unit">×</span></>,   label: <>mais <em>eficiente</em></>,     hint: "Agregado: menos água + menos terra + mais proteína por kg vs. gado." },
          { num: <>88,9<span className="stat-unit">%</span></>,   label: <>de <em>digestibilidade</em></>, hint: "Proteína de BSF é quase totalmente absorvida — superior à maioria das fontes convencionais em cães." },
          { num: <>45<span className="stat-unit">%</span></>,     label: <>de <em>proteína</em></>,        hint: "Alta densidade proteica — quase o dobro da maioria das rações convencionais." },
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
              <div className="card-tag">WhatsApp SAC</div>
              <div className="card-label">Fala<br />com<br />a gente</div>
              <div className="card-sub">(21) 3950-0576 — O Dragão não abandona ninguém</div>
            </div></div>
            <div className="card-hover-overlay" style={{ background: "rgba(0,255,135,0.06)" }} />
          </a>

          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="card card-social card-social-map ratio-1-1">
            <img src={lojasCoverImg} alt="" className="card-produtos-cover" draggable={false} />
            <HoverBg imgKey="lojas" />
            <div className="card-hover-overlay" />
          </a>


          <button
            type="button"
            onClick={openEmail}
            className="card card-manifesto card-email-manifesto ratio-3-4"
            style={{ border: "none", font: "inherit", color: "inherit", textAlign: "left", cursor: "pointer" }}
          >
            <img src={emailCoverImg} alt="" className="card-produtos-cover" draggable={false} />
            <HoverBg imgKey="email" />
            <div className="card-hover-overlay" />
          </button>
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
            { cls: "card-shop-amazon", href: "https://www.amazon.com.br/s?k=comida+de+dragao", name: "Amazon", tag: "Entrega rápida · Prime", hoverKey: "amazon", cover: shopAmazonCover },
            { cls: "card-shop-ml", href: "https://www.mercadolivre.com.br", name: "Mercado\nLivre", tag: "Frete Grátis", hoverKey: "ml", cover: shopMlCover },
            { cls: "card-shop-petlove", href: "https://www.petlove.com.br", name: "Petlove", tag: "Especialista em pets", hoverKey: "petlove", cover: shopPetloveCover },
            { cls: "card-shop-oficial", href: "https://comidadedragao.com.br", name: "Loja\nOficial", tag: "Site próprio · melhor preço", hoverKey: "oficial", cover: null as string | null },
          ].map((shop, i) => (
            <a key={i} href={shop.href} target="_blank" rel="noopener noreferrer" className={`card card-shop ratio-shop ${shop.cls}`}>
              {shop.cover && <img src={shop.cover} alt="" className="card-shop-cover" />}
              <HoverBg imgKey={shop.hoverKey} />
              {!shop.cover && (
                <div className="card-inner">
                  <div className="card-body">
                    <div className="shop-name">{shop.name.split("\n").map((line, j) => j > 0 ? <span key={j}><br />{line}</span> : line)}</div>
                    <span className="shop-tag">{shop.tag}</span>
                    <span className="shop-arrow">→</span>
                  </div>
                </div>
              )}
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
          <Link to="/produtos">Produtos</Link>
          <Link to="/parceiros">Parceiros</Link>
          <Link to="/biblioteca">Biblioteca</Link>
          <Link to="/imprensa">Imprensa</Link>
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
          className="riso-overlay"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <article className="riso riso-video large" role="dialog">
            <div className="riso-strip" />
            <button className="riso-close" onClick={closeModal} aria-label="Fechar">×</button>
            <div className="riso-pagenum">03</div>
            <span className="riso-eyebrow">RECADO · DO DRAGÃO PRA VOCÊ</span>
            <h2 className="riso-title">Bem-<br/>vindo.</h2>
            <div className="riso-video-frame">
              <span className="riso-video-tag">DRAGÃO FALA</span>
              <video
                controls
                autoPlay
                playsInline
                src="/assets/videos/SharkTank Insta .mp4"
              />
            </div>
            <div className="riso-body">
              <p className="meta">MENSAGEM · DIRETO DA BIOFÁBRICA</p>
              <p>Dois bilhões de pessoas no mundo já comem inseto. Pet food é só o começo da revolução. O Dragão te conta tudo — aperta o play.</p>
            </div>
            <div className="riso-signature">— O DRAGÃO · CACHOEIRAS DE MACACU</div>
          </article>
        </div>
      )}
      {/* MODAL MANIFESTO — Risograph (laranja + pink) */}
      {manifestoOpen && (
        <div
          className="riso-overlay"
          onClick={e => { if (e.target === e.currentTarget) closeManifesto(); }}
        >
          <article className="riso riso-manifesto" role="dialog" aria-labelledby="manifesto-title">
            <div className="riso-strip" />
            <button className="riso-close" onClick={closeManifesto} aria-label="Fechar">×</button>
            <div className="riso-pagenum">01</div>
            <span className="riso-eyebrow">MANIFESTO · O DRAGÃO</span>
            <h2 id="manifesto-title" className="riso-title">Nojento é<br/>o desper-<br/>dício.</h2>
            <div className="riso-body">
              <p>Nasci do elo entre a vitalidade da terra e o saber ancestral. Sou milenar e atemporal, carregando a memória dos antigos e a chama que ilumina o caminho para nossa verdadeira natureza.</p>
              <p className="pull">Meu sopro é de cura. Minha força regenera.</p>
              <p>Trago o elixir da regeneração, o néctar que nutre e harmoniza os seres vivos.</p>
              <p className="strong">Mais do que um alimento, uma revolução.</p>
            </div>
            <div className="riso-signature">— O DRAGÃO · CACHOEIRAS DE MACACU · 2026</div>
            <a href="https://comidadedragao.com.br/collections/produtos" target="_blank" rel="noopener noreferrer" className="riso-btn">VER PRODUTOS →</a>
            <button className="riso-btn ghost" onClick={closeManifesto}>FECHAR</button>
          </article>
        </div>
      )}

      {/* MODAL EMAIL — Risograph (yellow + pink) · Escreve pro Dragão */}
      {emailOpen && (
        <div
          className="riso-overlay"
          onClick={e => { if (e.target === e.currentTarget) closeEmail(); }}
        >
          <article className="riso riso-email large" role="dialog" aria-labelledby="email-title">
            <div className="riso-strip" />
            <button className="riso-close" onClick={closeEmail} aria-label="Fechar">×</button>
            <div className="riso-pagenum">02</div>
            {emailStatus === "ok" ? (
              <>
                <span className="riso-eyebrow">STATUS · ENTREGUE</span>
                <h2 id="email-title" className="riso-title">Mensagem<br/>enviada.</h2>
                <div className="riso-body">
                  <p>O Dragão recebeu. A gente responde no email que você deixou, normalmente em até 48h.</p>
                  <p className="strong">Obrigado por escrever.</p>
                </div>
                <button className="riso-btn" onClick={closeEmail}>FECHAR →</button>
                <button
                  className="riso-btn ghost"
                  onClick={() => { setEmailStatus("idle"); }}
                >
                  ENVIAR OUTRA
                </button>
              </>
            ) : (
              <>
                <span className="riso-eyebrow">CARTA ABERTA · SOMOS@</span>
                <h2 id="email-title" className="riso-title">Manda<br/>o recado.</h2>
                <div className="riso-body">
                  <p>Dúvida, parceria, ideia maluca, elogio, crítica. <strong>O Dragão lê tudo.</strong> Resposta em até 48h no email que você deixar.</p>
                </div>
                <form className="riso-form" onSubmit={submitEmail}>
                  <div className="riso-field">
                    <label className="riso-field-label" htmlFor="email-nome">&gt; seu nome (opcional)</label>
                    <input
                      id="email-nome"
                      type="text"
                      className="riso-input"
                      placeholder="como o Dragão te chama?"
                      value={emailForm.nome}
                      onChange={e => setEmailForm(f => ({ ...f, nome: e.target.value }))}
                      maxLength={60}
                    />
                  </div>
                  <div className="riso-field">
                    <label className="riso-field-label" htmlFor="email-email">&gt; email *</label>
                    <input
                      id="email-email"
                      type="email"
                      required
                      className="riso-input"
                      placeholder="voce@email.com"
                      value={emailForm.email}
                      onChange={e => setEmailForm(f => ({ ...f, email: e.target.value }))}
                    />
                    <span className="riso-helper">pra onde o Dragão responde</span>
                  </div>
                  <div className="riso-field">
                    <label className="riso-field-label" htmlFor="email-msg">&gt; mensagem *</label>
                    <textarea
                      id="email-msg"
                      required
                      className="riso-textarea"
                      placeholder="escreve aqui. sem papo formal."
                      value={emailForm.mensagem}
                      onChange={e => setEmailForm(f => ({ ...f, mensagem: e.target.value }))}
                      maxLength={2000}
                    />
                  </div>
                  {emailStatus === "err" && (
                    <div className="riso-status err">// {emailErrMsg}</div>
                  )}
                  <div style={{ marginTop: 4 }}>
                    <button
                      type="submit"
                      className="riso-btn"
                      disabled={emailStatus === "sending"}
                    >
                      {emailStatus === "sending" ? "ENVIANDO..." : "POSTAR →"}
                    </button>
                    <button
                      type="button"
                      className="riso-btn ghost"
                      onClick={closeEmail}
                    >
                      CANCELAR
                    </button>
                  </div>
                </form>
              </>
            )}
          </article>
        </div>
      )}
      {/* MODAL PERGUNTAS QUE NINGUÉM FAZ — Risograph (violet + lime) */}
      {perguntasOpen && (
        <div
          className="riso-overlay"
          onClick={e => { if (e.target === e.currentTarget) closePerguntas(); }}
        >
          <article className="riso riso-perguntas large" role="dialog" aria-labelledby="perguntas-title">
            <div className="riso-strip" />
            <button className="riso-close" onClick={closePerguntas} aria-label="Fechar">×</button>
            <div className="riso-pagenum">05</div>
            <span className="riso-eyebrow">Q&amp;A · O QUE NINGUÉM PERGUNTA</span>
            <h2 id="perguntas-title" className="riso-title">Pergunta<br/>sem filtro.</h2>
            <div className="riso-body">
              <p className="meta">// AS QUE FICAM NA CABEÇA E NINGUÉM MANDA NO DM</p>
            </div>
            <div className="riso-qa">
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
                  a: "Experimenta. BSF é uma das proteínas mais limpas e completas da natureza — 2 bilhões de pessoas no mundo já comem inseto regularmente. Nossa linha é registrada no MAPA como pet food (questão de regulação, não de segurança), mas se seu pet tá comendo e bateu a curiosidade, manda bala. A gente não vai dedurar.",
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
                <div key={i} className="riso-qa-item">
                  <div className="riso-qa-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="riso-qa-q">{qa.q}</div>
                  <div className="riso-qa-a">{qa.a}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <a
                href="https://wa.me/552139500576?text=Tenho%20uma%20pergunta%20pro%20Drag%C3%A3o"
                target="_blank"
                rel="noopener noreferrer"
                className="riso-btn"
              >
                PERGUNTA NO ZAP →
              </a>
              <button className="riso-btn ghost" onClick={closePerguntas}>FECHAR</button>
            </div>
          </article>
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
                <span className="afp-tag">// AUDIOCAST</span>
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
              <span>{audioPlaying ? "// TOCANDO..." : "// AUDIOCAST"}</span>
              <button className="afp-btn" onClick={e => { e.stopPropagation(); closeAudio(); }}>✕</button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Portal;
