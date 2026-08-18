import { useEffect, useRef, useState, useCallback, ReactNode } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./PlanetaDragao.css";

/* ──────────────────────────────────────────────────────────────
   LP CAMPANHA — PLANETA DRAGÃO · /planeta-dragao
   ⏳ STATUS: SAZONAL — Semana do Meio Ambiente (5–12 jun).
   Pra TIRAR DO AR após 12/jun: comentar o lazy import + a rota no
   App.tsx (a página fica no código pra reativar). Ver LANDING-PAGES.md.
   ──────────────────────────────────────────────────────────────
   Desktop retro-OS verde. Hero = jogo. Recado: bom pro pet + planeta.
   Semana do Meio Ambiente.

   JOGO "DRAGA LIMPA A CIDADE" (runner de 1 botão, fácil):
   o Draga (ele) corre sozinho pela cidade e RECOLHE o lixo no caminho —
   uns embaixo (pega correndo), uns em cima (clique = PULA pra alcançar).
   Tem um buraquinho pra pular. Ao juntar os itens, aparece o pote de
   Comida de Dragão no fim; ele pega e se TRANSFORMA no Drakão → cupom.

   Sprites: 00. DRAGA original / Drakão 1 (cor real). Lixo = ícones da
   pasta "Jogo Semana Meio Ambiente". Pote = pack real do produto.
   ⚠️ Cupom PLANETA precisa existir na Yampi.
────────────────────────────────────────────────────────────── */

const COUPON = "PLANETA";
// CTAs principais levam à PÁGINA GERAL DE PRODUTOS (a pessoa escolhe o item/kit).
// A atribuição nativa da loja (pixel/YampiSnippet) carrega a UTM até o checkout.
const PRODUCT_PAGE = "https://www.comidadedragao.com.br/collections/produtos";
// Compra direta (checkout Yampi) — "Buy Now" do Original 90g com cupom já aplicado.
// Usado no "Quero experimentar" e no sticky.
const DIRECT_BUY = `https://seguro.comidadedragao.com.br/r/TQT4HOZK7X?promocode=${COUPON}`;
const STORE_URL = "https://www.comidadedragao.com.br/collections/produtos";

const UTM_FALLBACK = {
  utm_source: "lp-planeta",
  utm_medium: "lp",
  utm_campaign: "planeta-dragao-pet-planeta",
};
// repassa a UTM de entrada (first-touch) + posição do CTA pra qualquer URL
const productUrl = (cta: string) => buildCheckoutUrl(PRODUCT_PAGE, UTM_FALLBACK, cta);
const buyUrl = (cta: string) => buildCheckoutUrl(DIRECT_BUY, UTM_FALLBACK, cta);

// Kits cão/gato — checkout direto Yampi (Buy Now) com cupom + UTM
const DOG_BUY = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?promocode=${COUPON}`;
const CAT_BUY = `https://seguro.comidadedragao.com.br/r/N9DLSJ6M4J?promocode=${COUPON}`;
const dogUrl = (cta: string) => buildCheckoutUrl(DOG_BUY, UTM_FALLBACK, cta);
const catUrl = (cta: string) => buildCheckoutUrl(CAT_BUY, UTM_FALLBACK, cta);
const DOG_IMG = "/assets/images/produtos/kit-caes.webp";   // composto transparente (Original + Suplemento Integral)
const CAT_IMG = "/assets/images/produtos/kit-gatos.webp";  // composto transparente (Original + Suplemento Felino)

const DRAGA_SPRITE = "/assets/games/planeta/draga_color.png";
const DRAKAO_SPRITE = "/assets/games/planeta/drakao_color.png";
const POTE_SPRITE = "/assets/images/produtos/original-frente.webp";
const TRASH_TYPES = ["banana", "water", "stink", "garbage", "garbage-bag", "trash"];
const lixoSrc = (t: string) => `/assets/games/planeta/lixo/${t}.png`;

const GOAL_TRASH = 6;
const DRAGA_FX = 0.15;

type Phase = "idle" | "playing" | "over" | "won";
interface TrashItem { x: number; y: number; type: string; got: boolean; }
interface Hole { x: number; w: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; }
interface Popup { x: number; y: number; t: number; }

/* ── nuvem pixel simples (usada no céu do jogo) ── */
function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#FFFFFF";
  ([[0, 10, 14], [16, 4, 18], [36, 10, 14], [13, 15, 16]] as const).forEach(([dx, dy, r]) => {
    ctx.beginPath(); ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2); ctx.fill();
  });
}

/* ── Janela retro-OS reutilizável ── */
const Win = ({ name, children, className, accent }: {
  name: string; children: ReactNode; className?: string; accent?: boolean;
}) => (
  <section className={`os-win${accent ? " os-win-accent" : ""}${className ? " " + className : ""}`}>
    <div className="os-titlebar">
      <span className="os-tb-name">{name}</span>
      <span className="os-tb-ctrls" aria-hidden="true">
        <i className="os-c">_</i><i className="os-c">□</i><i className="os-c os-x">×</i>
      </span>
    </div>
    <div className="os-body">{children}</div>
  </section>
);

const PlanetaDragao = () => {
  useEffect(() => { captureEntryUtms(); }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgDraga = useRef<HTMLImageElement | null>(null);
  const imgDrakao = useRef<HTMLImageElement | null>(null);
  const imgPote = useRef<HTMLImageElement | null>(null);
  const imgTrash = useRef<Record<string, HTMLImageElement>>({});

  const phaseRef = useRef<Phase>("idle");
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const dimsRef = useRef({ w: 760, h: 380, ground: 274 });

  const playerRef = useRef({ y: 0, vy: 0, onGround: true });
  const speedRef = useRef(250);
  const distRef = useRef(0);
  const trashRef = useRef<TrashItem[]>([]);
  const holeRef = useRef<Hole[]>([]);
  const partRef = useRef<Particle[]>([]);
  const popupRef = useRef<Popup[]>([]);
  const collectedRef = useRef(0);
  const nextTrashRef = useRef(0);
  const nextHoleRef = useRef(0);
  const poteRef = useRef<{ active: boolean; x: number; y: number; got: boolean }>({ active: false, x: 0, y: 0, got: false });
  const transformedRef = useRef(false);
  const winAtRef = useRef(0);
  const winShownRef = useRef(false);
  const hopRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [collected, setCollected] = useState(0);
  const [winOverlay, setWinOverlay] = useState(false);

  useEffect(() => {
    const a = new Image(); a.src = DRAGA_SPRITE; imgDraga.current = a;
    const d = new Image(); d.src = DRAKAO_SPRITE; imgDrakao.current = d;
    const p = new Image(); p.src = POTE_SPRITE; imgPote.current = p;
    TRASH_TYPES.forEach((t) => { const im = new Image(); im.src = lixoSrc(t); imgTrash.current[t] = im; });
  }, []);

  const setPhaseBoth = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  const spawnBurst = (x: number, y: number, n = 16) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 50 + Math.random() * 160;
      partRef.current.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1 });
    }
  };

  // medidas do personagem
  const playerBox = () => {
    const { w, h, ground } = dimsRef.current;
    const mob = w < 600;
    const img = transformedRef.current ? imgDrakao.current : imgDraga.current;
    const dh = h * (transformedRef.current ? (mob ? 0.30 : 0.42) : (mob ? 0.24 : 0.36));
    const ratio = img && img.naturalWidth ? img.naturalWidth / img.naturalHeight : 1.1;
    const dw = dh * ratio;
    const drawX = DRAGA_FX * w - dw * 0.3;
    const drawY = ground - dh - playerRef.current.y;
    return { drawX, drawY, dw, dh, bx: drawX + dw * 0.22, by: drawY + dh * 0.15, bw: dw * 0.56, bh: dh * 0.72 };
  };

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h, ground } = dimsRef.current;
    const dist = distRef.current;

    // céu
    const sky = ctx.createLinearGradient(0, 0, 0, ground);
    sky.addColorStop(0, "#BFE9FF");
    sky.addColorStop(1, "#E9F8E6");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // sol (preenche o céu)
    const sunX = w * 0.84, sunY = h * 0.14, sunR = Math.max(18, h * 0.05);
    ctx.strokeStyle = "rgba(255,206,64,0.55)"; ctx.lineWidth = 3;
    for (let r = 0; r < 8; r++) {
      const a = (r / 8) * Math.PI * 2 + dist * 0.002;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(a) * (sunR + 6), sunY + Math.sin(a) * (sunR + 6));
      ctx.lineTo(sunX + Math.cos(a) * (sunR + 15), sunY + Math.sin(a) * (sunR + 15));
      ctx.stroke();
    }
    ctx.fillStyle = "#FFE24D";
    ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2); ctx.fill();

    // nuvens (parallax lento, espalhadas pelo céu)
    const cspan = w + 220;
    const cloudOff = (dist * 0.2) % cspan;
    const cloudYs = [0.12, 0.26, 0.18, 0.34, 0.22];
    for (let i = 0; i < 5; i++) {
      const cx = ((i * cspan / 5) - cloudOff + cspan) % cspan - 70;
      drawCloud(ctx, cx, h * cloudYs[i]);
    }

    // prédios scroll (parallax)
    const blds = [[0.34, 0.13], [0.46, 0.11], [0.30, 0.14], [0.50, 0.12], [0.36, 0.13], [0.46, 0.15], [0.40, 0.12]];
    const period = w * 1.2;
    const off = (dist * 0.4) % period;
    blds.forEach(([fh, fw], i) => {
      const bw = fw * w, bh = fh * h;
      const baseX = (i / blds.length) * period;
      const bx = ((baseX - off) % period + period) % period - 40;
      const by = ground - bh;
      ctx.fillStyle = i % 2 ? "#5C9C7C" : "#7FBE9E";
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      for (let yy = by + 10; yy < ground - 10; yy += 18)
        for (let xx = bx + 6; xx < bx + bw - 8; xx += 14) ctx.fillRect(xx, yy, 6, 8);
    });

    // chão
    ctx.fillStyle = "#7C8A86"; ctx.fillRect(0, ground, w, h - ground);
    ctx.fillStyle = "#5BBF3A"; ctx.fillRect(0, ground, w, 7);
    // faixa correndo
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 3;
    const dash = (dist) % 40;
    for (let x = -dash; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, ground + (h - ground) * 0.55); ctx.lineTo(x + 20, ground + (h - ground) * 0.55); ctx.stroke(); }

    // buracos (pit)
    holeRef.current.forEach((hl) => {
      ctx.fillStyle = "#161210"; ctx.fillRect(hl.x, ground, hl.w, h - ground);
      ctx.fillStyle = "#0c0a08"; ctx.fillRect(hl.x, ground, 3, h - ground); ctx.fillRect(hl.x + hl.w - 3, ground, 3, h - ground);
    });

    // lixo
    trashRef.current.forEach((t) => {
      if (t.got) return;
      const im = imgTrash.current[t.type];
      const th = h * (w < 600 ? 0.10 : 0.13);
      const tw = im && im.naturalWidth ? th * (im.naturalWidth / im.naturalHeight) : th;
      // sombrinha no chão
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.beginPath(); ctx.ellipse(t.x, ground + 4, tw * 0.4, 5, 0, 0, Math.PI * 2); ctx.fill();
      if (im && im.complete && im.naturalWidth) ctx.drawImage(im, t.x - tw / 2, t.y - th / 2, tw, th);
    });

    // pote (recompensa) no chão
    if (poteRef.current.active && imgPote.current?.complete && imgPote.current.naturalWidth) {
      const pim = imgPote.current;
      const ph = h * 0.36, pw = ph * (pim.naturalWidth / pim.naturalHeight);
      const px = poteRef.current.x, py = poteRef.current.y;
      ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = "#FFE08A";
      ctx.beginPath(); ctx.arc(px, py, pw * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.drawImage(pim, px - pw / 2, py - ph / 2, pw, ph);
    }

    // partículas
    partRef.current.forEach((p, i) => {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = i % 2 === 0 ? "#B9FF33" : "#925AED";
      ctx.fillRect(p.x, p.y, 3, 3);
      ctx.globalAlpha = 1;
    });

    // popups "+1" (lixo recolhido)
    popupRef.current.forEach((p) => {
      const a = Math.max(0, 1 - p.t / 0.9);
      const yy = p.y - p.t * 46;
      ctx.globalAlpha = a;
      ctx.font = "700 16px 'Silkscreen', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.lineWidth = 4; ctx.strokeStyle = "#000"; ctx.strokeText("+1", p.x, yy);
      ctx.fillStyle = "#B9FF33"; ctx.fillText("+1", p.x, yy);
      ctx.globalAlpha = 1;
    });
    ctx.textAlign = "left"; ctx.textBaseline = "top";

    // personagem
    const pb = playerBox();
    const img = transformedRef.current ? imgDrakao.current : imgDraga.current;
    if (img?.complete && img.naturalWidth) {
      const hop = Math.sin(hopRef.current * Math.PI) * (h * 0.04);
      ctx.drawImage(img, pb.drawX, pb.drawY - hop, pb.dw, pb.dh);
    }

    // HUD (só quando o jogo está rolando)
    if (phaseRef.current !== "idle") {
      ctx.font = "700 14px 'Silkscreen', monospace";
      ctx.textBaseline = "top"; ctx.textAlign = "left";
      const txt = `LIXO x0${collectedRef.current}/0${GOAL_TRASH}`;
      const tw = ctx.measureText(txt).width;
      ctx.fillStyle = "rgba(6,37,26,0.82)";
      ctx.fillRect(8, 6, tw + 18, 26);
      ctx.strokeStyle = "#B9FF33"; ctx.lineWidth = 2; ctx.strokeRect(8, 6, tw + 18, 26);
      ctx.fillStyle = "#B9FF33"; ctx.fillText(txt, 17, 12);
    }
  }, []);

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const w = Math.min(wrap.clientWidth, 760);
    // jogo deixou de ser o hero inteiro → proporção normal
    const mobile = window.innerWidth < 700;
    const h = mobile ? Math.round(w * 0.92) : Math.round(w * 0.5);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dimsRef.current = { w, h, ground: Math.round(h * 0.74) };
    drawScene();
  }, [drawScene]);

  const endGame = useCallback(() => { setPhaseBoth("over"); }, []);

  const loop = useCallback((ts: number) => {
    const last = lastTsRef.current || ts;
    let dt = (ts - last) / 1000;
    lastTsRef.current = ts;
    if (dt > 0.05) dt = 0.05;

    const ph = phaseRef.current;
    const { w, h, ground } = dimsRef.current;
    const p = playerRef.current;

    if (ph === "playing" || ph === "won") {
      const won = ph === "won";
      const speed = speedRef.current;
      if (!won) speedRef.current = Math.min(400, speed + dt * 6);
      distRef.current += speed * dt;
      const dx = speed * dt;

      // física
      p.vy += 2200 * dt;
      p.y -= p.vy * dt;
      if (p.y <= 0) { p.y = 0; p.vy = 0; p.onGround = true; } else p.onGround = false;
      if (hopRef.current > 0) hopRef.current = Math.max(0, hopRef.current - dt * 3);

      const doneCollecting = collectedRef.current >= GOAL_TRASH;

      if (!won && !doneCollecting) {
        // spawn lixo
        nextTrashRef.current -= dt;
        if (nextTrashRef.current <= 0) {
          const high = Math.random() < 0.5;
          const type = TRASH_TYPES[(Math.random() * TRASH_TYPES.length) | 0];
          trashRef.current.push({ x: w + 30, y: high ? ground - h * 0.42 : ground - h * 0.18, type, got: false });
          nextTrashRef.current = 0.85 + Math.random() * 0.7;
        }
        // spawn buraco
        nextHoleRef.current -= dt;
        if (nextHoleRef.current <= 0) {
          holeRef.current.push({ x: w + 60, w: w * 0.11 });
          nextHoleRef.current = 2.6 + Math.random() * 2.2;
        }
      }

      // aparece o pote quando juntou tudo (só uma vez, na fase de corrida)
      if (!won && doneCollecting && !poteRef.current.active && !poteRef.current.got) {
        poteRef.current = { active: true, x: w + 80, y: ground - h * 0.18, got: false };
        holeRef.current = [];
      }

      // move
      trashRef.current.forEach((t) => (t.x -= dx));
      trashRef.current = trashRef.current.filter((t) => t.x > -60 && !t.got);
      holeRef.current.forEach((hl) => (hl.x -= dx));
      holeRef.current = holeRef.current.filter((hl) => hl.x + hl.w > -10);
      if (poteRef.current.active) poteRef.current.x -= dx;
      partRef.current.forEach((pt) => { pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.life -= dt * 1.4; });
      partRef.current = partRef.current.filter((pt) => pt.life > 0);
      popupRef.current.forEach((p) => { p.t += dt; });
      popupRef.current = popupRef.current.filter((p) => p.t < 0.9);

      const pb = playerBox();
      const overlap = (ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) =>
        ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

      if (!won) {
        // coleta de lixo
        trashRef.current.forEach((t) => {
          if (t.got) return;
          const th = h * (w < 600 ? 0.10 : 0.13), tw = th;
          if (overlap(pb.bx, pb.by, pb.bw, pb.bh, t.x - tw / 2, t.y - th / 2, tw, th)) {
            t.got = true;
            collectedRef.current += 1;
            setCollected(collectedRef.current);
            hopRef.current = 1;
            spawnBurst(t.x, t.y, 12);
            popupRef.current.push({ x: t.x, y: t.y - 8, t: 0 });
          }
        });

        // buraco: cai se estiver no chão sobre o buraco
        const pcx = pb.bx + pb.bw / 2;
        for (const hl of holeRef.current) {
          if (p.onGround && pcx > hl.x + 6 && pcx < hl.x + hl.w - 6) { endGame(); break; }
        }

        // pega o pote → transforma
        if (poteRef.current.active && !poteRef.current.got) {
          const ph2 = h * 0.36, pw2 = ph2 * 0.8;
          if (overlap(pb.bx, pb.by, pb.bw, pb.bh, poteRef.current.x - pw2 / 2, poteRef.current.y - ph2 / 2, pw2, ph2)) {
            poteRef.current.got = true;
            transformedRef.current = true;
            winAtRef.current = ts;
            hopRef.current = 1;
            spawnBurst(poteRef.current.x, poteRef.current.y, 40);
          }
        }
      } else {
        // sumir com o pote coletado
        if (poteRef.current.got) poteRef.current.active = false;
        if (!winShownRef.current && ts - winAtRef.current > 1300) {
          winShownRef.current = true;
          setWinOverlay(true);
        }
      }

      if (transformedRef.current && phaseRef.current === "playing") setPhaseBoth("won");
    }

    drawScene();
    rafRef.current = requestAnimationFrame(loop);
  }, [drawScene, endGame]);

  const startGame = useCallback(() => {
    playerRef.current = { y: 0, vy: 0, onGround: true };
    speedRef.current = 250;
    distRef.current = 0;
    trashRef.current = [];
    holeRef.current = [];
    partRef.current = [];
    popupRef.current = [];
    collectedRef.current = 0;
    nextTrashRef.current = 0.6;
    nextHoleRef.current = 3.5;
    poteRef.current = { active: false, x: 0, y: 0, got: false };
    transformedRef.current = false;
    winAtRef.current = 0;
    winShownRef.current = false;
    hopRef.current = 0;
    setCollected(0);
    setWinOverlay(false);
    setPhaseBoth("playing");
    lastTsRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const jump = useCallback(() => {
    if (phaseRef.current === "playing") {
      const p = playerRef.current;
      if (p.onGround) { p.vy = -760; p.onGround = false; }
    } else if (phaseRef.current === "idle" || phaseRef.current === "over") {
      startGame();
    }
  }, [startGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        if (phaseRef.current !== "idle") e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  useEffect(() => {
    sizeCanvas();
    const t1 = window.setTimeout(sizeCanvas, 350); // re-mede após fonte/layout assentar
    const onResize = () => sizeCanvas();
    window.addEventListener("resize", onResize);
    const id = window.setInterval(() => { if (phaseRef.current === "idle") drawScene(); }, 250);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearInterval(id);
      window.clearTimeout(t1);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sizeCanvas, drawScene]);

  /* ── conteúdo: duplo benefício ── */
  const PET = [
    { ico: "🛡️", t: "Proteína hipoalergênica", d: "1 ingrediente só. Cães alérgicos a frango, aves ou proteína animal comem sem reação — o relato que mais se repete." },
    { ico: "🐾", t: "A coceira dá trégua", d: "Tutores contam o pet se coçando bem menos, mais calmo e tranquilo em poucas semanas." },
    { ico: "🌿", t: "Cai bem no intestino", d: "Fezes menores e firmes, sem dor de barriga — petisco que até pet sensível pode comer." },
    { ico: "😋", t: "Até o enjoado se rende", d: "Vira festa: o pet ama, esconde o pacote e até os mais exigentes aceitam de primeira." },
  ];
  const PLANETA: Array<{ ico: string; img?: string; t: string; d: string }> = [
    { ico: "♻️", t: "Upcycling de resíduo", d: "A larva come o resíduo orgânico que ia virar lixo e devolve proteína nobre. Nada se perde." },
    { ico: "💧", t: "Bem menos água e terra", d: "Proteína de inseto usa uma fração da água e da terra de frango ou boi. Mesmo nutriente, impacto lá embaixo." },
    { ico: "🌱", t: "Zero desperdício", d: "Produção local na biofábrica RJ, registro MAPA, rastreável do começo ao fim." },
    { ico: "🔁", img: "/assets/games/planeta/loop/chain.png", t: "Economia circular", d: "O que seria lixo orgânico volta como comida. Um ciclo fechado, sem desperdício." },
  ];
  const LOOP = [
    { img: "/assets/games/planeta/lixo/stink.png", t: "Resíduo orgânico" },
    { img: "/assets/games/planeta/loop/larva.png", t: "Larva BSF" },
    { img: POTE_SPRITE, t: "Vira comida" },
    { img: DRAKAO_SPRITE, t: "Pet forte" },
  ];
  const REVIEWS = ["/assets/images/reviews/3.webp", "/assets/images/reviews/5.webp", "/assets/images/reviews/7.webp", "/assets/images/reviews/9.webp"];
  const FAQ = [
    { q: "Meu pet tem alergia — posso dar?", a: "Sim. É 1 ingrediente só e hipoalergênico por natureza, sem as proteínas mais alergênicas (frango, boi, soja, glúten). Em acompanhamento veterinário, mostre o rótulo antes." },
    { q: "Por que larva faz bem pro planeta?", a: "A Mosca Soldado Negra faz upcycling: come resíduo orgânico e vira proteína usando pouquíssima água e terra. Menos desperdício, menos impacto — mesmo nutriente." },
    { q: "Como ofereço pela primeira vez?", a: "Comece com 2 a 4 unidades por dia, entre as refeições. Alta palatabilidade: a maioria aceita de primeira." },
    { q: "Como funciona a entrega?", a: "Despacho em até 1 dia útil, frete pelo seu CEP. Compra 100% segura via Yampi (cartão, Pix ou boleto)." },
  ];

  const allClean = collected >= GOAL_TRASH;

  return (
    <div className="planeta-lp">
      <PageMeta
        title="Planeta Dragão — bom pro pet, bom pro planeta | Comida de Dragão"
        description="Ajude o Draga a limpar a cidade, ganhe o pote e vire o Drakão. Petisco BSF que cuida do pet e do planeta. Semana do Meio Ambiente. Cupom PLANETA."
        image="/assets/games/planeta/drakao_color.png"
      />

      <div className="os-menubar">
        <span className="os-menu-brand"><DragonLogo className="os-menu-logo" /> 🌱 Semana do Meio Ambiente · 5–12 jun</span>
        <Link to="/portal" className="os-menu-link"><span className="os-back-arrow">←</span> <span className="os-back-txt">comida de dragão</span></Link>
      </div>

      <div className="os-desktop">
        {/* HERO em janela — destaque + contexto pro público frio */}
        <Win name="🐉 COMIDA DE DRAGÃO" accent className="os-hero-win">
          <div className="os-hero-msg">
            <h1>Bom pro pet. <span>Bom pro planeta.</span></h1>
            <p className="os-hero-trust">reg. mapa · +5 mil pets · 4,89★ · entenda mais ↓</p>
          </div>
        </Win>

        {/* DOIS KITS — uma janela por pet */}
        <div className="os-grid2">
          <Win name="🐶 KIT PARA CÃES" accent className="os-kit-win">
            <div className="os-kit">
              <div className="os-kit-imgwrap">
                <span className="os-kit-badge">25% OFF</span>
                <img src={DOG_IMG} alt="Kit Comida de Dragão para Cães" loading="eager" />
              </div>
              <span className="os-kit-name">Original + Suplemento · proteína hipoalergênica</span>
              <div className="os-kit-price"><span className="os-kit-from">R$ 145</span><b>R$ 108,75</b></div>
              <span className="os-kit-bonus">+ cupom PLANETA: 10%</span>
              <a href={dogUrl("hero-dog")} className="pl-btn pl-btn-buy" data-cta="hero-dog">COMPRAR →</a>
            </div>
          </Win>
          <Win name="🐱 KIT PARA GATOS" accent className="os-kit-win">
            <div className="os-kit">
              <div className="os-kit-imgwrap">
                <span className="os-kit-badge">25% OFF</span>
                <img src={CAT_IMG} alt="Kit Comida de Dragão para Gatos" loading="eager" />
              </div>
              <span className="os-kit-name">Original + Suplemento · proteína hipoalergênica</span>
              <div className="os-kit-price"><span className="os-kit-from">R$ 145</span><b>R$ 108,75</b></div>
              <span className="os-kit-bonus">+ cupom PLANETA: 10%</span>
              <a href={catUrl("hero-cat")} className="pl-btn pl-btn-buy" data-cta="hero-cat">COMPRAR →</a>
            </div>
          </Win>
        </div>
        <div className="os-prod-chips os-kit-chips"><span>🛡️ Reg. MAPA</span><span>🚚 Entrega Brasil</span><span>💚 Garantia 14 dias</span></div>

        {/* POR QUE — bom pro pet / bom pro planeta */}
        <div className="os-grid2">
          <Win name="🐾 BOM_PRO_PET.txt">
            <ul className="os-benef">
              {PET.map((b, i) => (<li key={i}><span className="os-benef-ico">{b.ico}</span><div><b>{b.t}</b><p>{b.d}</p></div></li>))}
            </ul>
          </Win>
          <Win name="🌍 BOM_PRO_PLANETA.txt">
            <ul className="os-benef">
              {PLANETA.map((b, i) => (<li key={i}><span className="os-benef-ico">{b.img ? <img src={b.img} alt="" /> : b.ico}</span><div><b>{b.t}</b><p>{b.d}</p></div></li>))}
            </ul>
          </Win>
        </div>

        <p className="os-game-cap">🎮 Ou jogue, vire o Drakão e ganhe o cupom PLANETA</p>

        {/* JOGO = gancho do cupom */}
        <Win name="🎮 DRAGA_LIMPA_A_CIDADE.EXE" accent className="os-game-win">
          <div className="pl-screen" ref={wrapRef}>
            <canvas
              ref={canvasRef}
              className="pl-canvas"
              onPointerDown={(e) => { e.preventDefault(); jump(); }}
              role="img"
              aria-label="Jogo: o Draga corre e recolhe o lixo; clique pra pular e pegar o de cima"
            />
            {phase === "idle" && (
              <div className="pl-overlay">
                <p className="pl-ov-txt">Recolha o lixo da cidade.<br />Toque pra pular.</p>
                <button className="pl-btn" onClick={startGame}>▶ JOGAR</button>
              </div>
            )}
            {phase === "over" && (
              <div className="pl-overlay">
                <p className="pl-ov-title pl-over">CAIU NO BURACO! 🕳️</p>
                <p className="pl-ov-txt">Lixo recolhido: <b>{collected}/{GOAL_TRASH}</b><br />Bora de novo?</p>
                <button className="pl-btn" onClick={startGame}>↺ TENTAR DE NOVO</button>
              </div>
            )}
            {winOverlay && (
              <div className="pl-overlay pl-overlay-win">
                <p className="pl-ov-title pl-win">VIROU DRAKÃO! 🐉</p>
                <p className="pl-ov-txt">Cidade limpa! O Draga pegou o pote<br />e se transformou. No mundo real,<br />o prêmio é seu: cupom <b className="pl-coupon">{COUPON}</b>.</p>
                <a href={productUrl("vitoria")} className="pl-btn pl-btn-buy" data-cta="vitoria">RESGATAR CUPOM →</a>
                <button className="pl-replay" onClick={startGame}>↺ jogar de novo</button>
              </div>
            )}
          </div>
          {phase !== "idle" && (
            <p className="os-game-hint">
              {phase === "playing" && !allClean && "clique pra pular e pegar o lixo do alto 🧹"}
              {phase === "playing" && allClean && "pega o pote no fim pra virar Drakão 🎁"}
              {phase === "over" && "quase! tenta de novo 🕳️"}
              {phase === "won" && "cidade limpa, Draga virou Drakão 🐉"}
            </p>
          )}
        </Win>

        {/* COMO FUNCIONA */}
        <Win name="♻️ COMO_FUNCIONA.exe">
          <p className="os-section-lead">A larva da Mosca Soldado Negra fecha o ciclo: o que seria lixo vira a comida que fortalece seu pet.</p>
          <div className="os-loop">
            {LOOP.map((s, i) => (
              <div className="os-loop-step" key={i}>
                <div className="os-loop-ico"><img src={s.img} alt={s.t} /></div>
                <div className="os-loop-t">{s.t}</div>
                {i < LOOP.length - 1 && <div className="os-loop-arrow">→</div>}
              </div>
            ))}
          </div>
          <p className="os-loop-note"><b>Nojento é o desperdício</b> — não a larva.</p>
        </Win>

        {/* PROVA SOCIAL */}
        <Win name="💬 DEPOIMENTOS.log">
          <p className="os-section-lead">Tutores reais, pets reais. Quem topou, não larga mais.</p>
          <div className="os-reviews">
            {REVIEWS.map((src, i) => (
              <figure className="os-review" key={i}>
                <img src={src} alt={`Depoimento de tutor ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              </figure>
            ))}
          </div>
          <p className="os-reviews-hint">← arraste pra ver mais →</p>
        </Win>

        {/* OFERTA */}
        <Win name="⚠️ SYSTEM MESSAGE" accent>
          <div className="os-offer">
            <p className="os-offer-head">Cupom de campanha desbloqueado</p>
            <div className="os-coupon">
              <span className="os-coupon-label">CUPOM</span>
              <span className="os-coupon-code">{COUPON}</span>
              <span className="os-coupon-desc">desconto na primeira compra · aplica sozinho no checkout</span>
            </div>
            <a href={buyUrl("oferta")} className="pl-btn pl-btn-buy" data-cta="oferta">QUERO EXPERIMENTAR →</a>
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="os-store-link">ou ver a linha completa →</a>
          </div>
        </Win>

        {/* FAQ + GARANTIA */}
        <Win name="❓ FAQ.txt">
          <div className="os-faq">
            {FAQ.map((f, i) => (
              <details className="os-faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="os-faq-a">{f.a}</div>
              </details>
            ))}
          </div>
          <div className="os-garantia">
            <span className="os-garantia-ico">💚</span>
            <div><b>Garantia da matilha</b><p>Se seu pet não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</p></div>
          </div>
        </Win>

        {/* CTA FINAL */}
        <Win name="🐉 TRANSFORMACAO.exe" accent>
          <div className="os-final">
            <h2>Seu pet também<br /><span>vira dragão.</span></h2>
            <p>É o que a Comida de Dragão faz de verdade: 1 ingrediente hipoalergênico que para a coceira, cai bem no intestino e os pets amam de primeira — e ainda devolve menos lixo pro planeta.</p>
            <p className="os-final-note">Garantia de 14 dias · cupom <b>{COUPON}</b> na primeira compra</p>
            <a href={productUrl("final")} className="pl-btn pl-btn-buy" data-cta="final">VER OS PRODUTOS →</a>
          </div>
        </Win>

        <footer className="os-taskbar">
          <DragonLogo className="os-task-logo" />
          <nav className="os-task-links">
            <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
            <Link to="/produtos">Linha completa</Link>
            <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="mailto:somos@letsfly.com.br">Contato</a>
          </nav>
          <span className="os-task-legal">Comida de Dragão · Lets Fly · Biofábrica RJ</span>
        </footer>
      </div>

      <div className="os-sticky">
        <div className="os-sticky-info">
          <span className="os-sticky-name">🐉 Comida de Dragão</span>
          <span className="os-sticky-price">cupom {COUPON} em todos os produtos</span>
        </div>
        <a href={productUrl("sticky")} data-cta="sticky">Ver no site →</a>
      </div>
    </div>
  );
};

export default PlanetaDragao;
