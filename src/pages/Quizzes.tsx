import { useState, useEffect, useCallback, useRef } from "react";
import DragonLogo from "@/components/DragonLogo";

import {
  QUIZZES,
  QuizDef,
  PROFILE_DIMENSIONS,
  GRID_LAYOUT,
} from "@/data/quizzes";
import "./Quizzes.css";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface DragonProfile {
  name: string;
  email: string;
  createdAt: string;
  results: Record<string, ProfileResult>;
}

interface ProfileResult {
  quizId: string;
  resultKey: string;
  resultLabel: string;
  resultEmoji: string;
  profileLabel: string;
  completedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "dragon_quiz_profile";

const MARQUEE_TOP = [
  "QUIZZES DO DRAGÃO",
  "DESCUBRA SEU PERFIL DE TUTOR",
  "O DRAGÃO TE CONHECE",
  "QUAL PROTEÍNA É A SUA?",
  "MONTA SEU PERFIL",
  "ENTRE NA MATILHA",
  "NOJENTO É O DESPERDÍCIO",
];

const MARQUEE_BOTTOM = [
  "88,9% DE DIGESTIBILIDADE",
  "83% MENOS CARBONO",
  "142× MENOS USO DE TERRA",
  "@COMIDADEDRAGAO",
  "BIOFÁBRICA REGISTRADA NO MAPA",
  "DO RESÍDUO À PROTEÍNA",
  "A NATUREZA SEMPRE SOUBE",
];

const CONFETTI_COLORS = ["#FF7A00", "#7BFF00", "#FFE600", "#FF2D78", "#925AED", "#00D96F"];
const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

// Remove emojis do início e de dentro do texto de perguntas/opções
const stripEmoji = (s: string): string =>
  s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F300}-\u{1FAFF}\u24C2\uFE0F\u20E3]/gu, "")
   .replace(/\s{2,}/g, " ")
   .trim();

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const loadProfile = (): DragonProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const saveProfile = (p: DragonProfile) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* silent */ }
};

const clearProfile = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* silent */ }
};

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS CARD UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

async function loadLogoColored(color: string): Promise<HTMLImageElement | null> {
  try {
    const resp = await fetch("/assets/images/logo-dragao.svg");
    const svgText = await resp.text();
    const colored = svgText.replace(/currentColor/g, color);
    const blob = new Blob([colored], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = await loadImage(url);
    URL.revokeObjectURL(url);
    return img;
  } catch {
    return null;
  }
}

function drawCornerMarks(ctx: CanvasRenderingContext2D, S: number, color: string, size = 32, gap = 18) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const corners = [
    { x: gap, y: gap, dx: 1, dy: 1 },
    { x: S - gap, y: gap, dx: -1, dy: 1 },
    { x: gap, y: S - gap, dx: 1, dy: -1 },
    { x: S - gap, y: S - gap, dx: -1, dy: -1 },
  ];
  for (const { x, y, dx, dy } of corners) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx * size, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + dy * size); ctx.stroke();
  }
}

async function generateResultCardBlob(
  quiz: QuizDef,
  resultKey: string,
  profileName: string
): Promise<Blob> {
  await document.fonts.ready;

  const result = quiz.results[resultKey];
  if (!result) throw new Error("Result not found");
  const dimension = PROFILE_DIMENSIONS.find((d) => d.quizId === quiz.id);

  const S = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const accent = quiz.accent || "#FF7A00";

  // ── Background preto
  ctx.fillStyle = "#0A0A0A";
  ctx.fillRect(0, 0, S, S);

  // ── Grade sutil
  ctx.strokeStyle = "rgba(255,255,255,0.018)";
  ctx.lineWidth = 1;
  for (let x = 0; x < S; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,S); ctx.stroke(); }
  for (let y = 0; y < S; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(S,y); ctx.stroke(); }

  // ── Glow radial central
  const glow = ctx.createRadialGradient(S/2, S*0.5, 0, S/2, S*0.5, S*0.6);
  glow.addColorStop(0, accent + "30");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, S, S);

  // ── Corner marks decorativos
  drawCornerMarks(ctx, S, accent + "99", 40, 24);

  // ── Barra lateral esquerda (accent)
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 8, S);

  // ── Logo colorida no topo
  const logo = await loadLogoColored("#FAFAFA");
  const logoY = 52;
  if (logo) {
    const logoW = 200;
    const logoH = logo.naturalHeight > 0 ? Math.round(logoW * logo.naturalHeight / logo.naturalWidth) : 70;
    ctx.globalAlpha = 0.9;
    ctx.drawImage(logo, (S - logoW) / 2, logoY, logoW, logoH);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = "#FAFAFA";
    ctx.font = "700 26px 'Big Shoulders Display', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COMIDA DE DRAGÃO", S/2, logoY + 30);
  }

  // ── Linha separadora abaixo da logo
  ctx.strokeStyle = accent + "55";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 152); ctx.lineTo(S - 80, 152); ctx.stroke();

  // ── Dimension tag
  if (dimension) {
    ctx.fillStyle = accent;
    const tagText = dimension.title.toUpperCase();
    ctx.font = "700 15px 'Big Shoulders Display', Arial, sans-serif";
    const tw = ctx.measureText(tagText).width + 28;
    ctx.fillRect((S - tw) / 2, 168, tw, 30);
    ctx.fillStyle = "#0A0A0A";
    ctx.font = "800 14px 'Big Shoulders Display', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(tagText, S/2, 188);
  }

  // ── Emoji grande com glow
  const emojiY = 360;
  const emojiGlow = ctx.createRadialGradient(S/2, emojiY - 30, 0, S/2, emojiY - 30, 140);
  emojiGlow.addColorStop(0, accent + "40");
  emojiGlow.addColorStop(1, "transparent");
  ctx.fillStyle = emojiGlow;
  ctx.beginPath(); ctx.arc(S/2, emojiY - 30, 140, 0, Math.PI * 2); ctx.fill();
  ctx.font = "140px serif";
  ctx.textAlign = "center";
  ctx.fillText(result.emoji, S/2, emojiY);

  // ── profileLabel — grande, cor accent
  const labelText = stripEmoji(result.profileLabel).toUpperCase();
  const labelSize = labelText.length > 18 ? 68 : labelText.length > 12 ? 82 : 96;
  ctx.fillStyle = accent;
  ctx.font = `800 ${labelSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
  ctx.fillText(labelText, S/2, 530);

  // ── Category — branco
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 24px 'Space Grotesk', Arial, sans-serif";
  ctx.fillText(result.category.toUpperCase(), S/2, 576);

  // ── Linha separadora
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(120, 608); ctx.lineTo(S - 120, 608); ctx.stroke();

  // ── Description snippet
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.font = "400 21px 'Space Grotesk', Arial, sans-serif";
  const firstLine = result.description.split("\n")[0];
  const desc = firstLine.length > 90 ? firstLine.slice(0, 90) + "…" : firstLine;
  wrapText(ctx, desc, S/2, 640, S - 200, 32);

  // ── Nome do usuário
  ctx.fillStyle = "#FAFAFA";
  ctx.font = "700 32px 'Big Shoulders Display', Arial, sans-serif";
  ctx.fillText(profileName.toUpperCase(), S/2, 840);

  // ── Ponto accent abaixo do nome
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.arc(S/2, 862, 4, 0, Math.PI * 2); ctx.fill();

  // ── Footer — accent colorido
  ctx.fillStyle = accent;
  ctx.fillRect(0, S - 72, S, 72);
  ctx.fillStyle = "#0A0A0A";
  ctx.font = "800 20px 'Big Shoulders Display', Arial, sans-serif";
  ctx.fillText("@COMIDADEDRAGAO · COMIDADEDRAGAO.COM.BR", S/2, S - 24);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
  );
}

async function generateProfileCardBlob(
  profile: DragonProfile,
  quizzes: QuizDef[]
): Promise<Blob> {
  await document.fonts.ready;

  const S = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#0A0A0A";
  ctx.fillRect(0, 0, S, S);

  // Grade sutil
  ctx.strokeStyle = "rgba(255,255,255,0.018)";
  ctx.lineWidth = 1;
  for (let x = 0; x < S; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,S); ctx.stroke(); }
  for (let y = 0; y < S; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(S,y); ctx.stroke(); }

  // Glow lime
  const pglow = ctx.createRadialGradient(S/2, S*0.18, 0, S/2, S*0.18, S*0.5);
  pglow.addColorStop(0, "#7BFF0022"); pglow.addColorStop(1, "transparent");
  ctx.fillStyle = pglow; ctx.fillRect(0, 0, S, S);

  // Barra lateral lime
  ctx.fillStyle = "#7BFF00";
  ctx.fillRect(0, 0, 8, S);

  // Corner marks
  drawCornerMarks(ctx, S, "#7BFF0099", 40, 24);

  // Logo colorida no topo
  const pLogo = await loadLogoColored("#FAFAFA");
  if (pLogo) {
    const lw = 200;
    const lh = pLogo.naturalHeight > 0 ? Math.round(lw * pLogo.naturalHeight / pLogo.naturalWidth) : 70;
    ctx.globalAlpha = 0.9;
    ctx.drawImage(pLogo, (S - lw) / 2, 36, lw, lh);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = "#FAFAFA";
    ctx.font = "700 26px 'Big Shoulders Display', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COMIDA DE DRAGÃO", S/2, 68);
  }

  // Tag "PERFIL DE TUTOR"
  ctx.fillStyle = "#7BFF00";
  const ptag = "PERFIL DE TUTOR";
  ctx.font = "800 13px 'Big Shoulders Display', Arial, sans-serif";
  const ptagW = ctx.measureText(ptag).width + 28;
  ctx.fillRect((S - ptagW) / 2, 134, ptagW, 26);
  ctx.fillStyle = "#0A0A0A";
  ctx.textAlign = "center";
  ctx.fillText(ptag, S/2, 152);

  // Linha separadora
  ctx.strokeStyle = "rgba(123,255,0,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 174); ctx.lineTo(S - 80, 174); ctx.stroke();

  // Nome do usuário
  ctx.fillStyle = "#FAFAFA";
  ctx.font = "800 72px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(profile.name.toUpperCase(), S / 2, 232);

  // Linha separadora
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 252); ctx.lineTo(S - 80, 252); ctx.stroke();

  // Dimension slots: 3 em cima, 2 em baixo
  const SW = 310, SH = 210, GX = 20, GY = 18;
  const ROW1_Y = 270;

  PROFILE_DIMENSIONS.forEach((dim, i) => {
    const isRow1 = i < 3;
    const col = isRow1 ? i : i - 3;
    const rowLen = isRow1 ? 3 : 2;
    const totalW = rowLen * SW + (rowLen - 1) * GX;
    const sx = (S - totalW) / 2 + col * (SW + GX);
    const sy = isRow1 ? ROW1_Y : ROW1_Y + SH + GY;

    const pr = profile.results[dim.quizId];
    const quiz = quizzes.find((q) => q.id === dim.quizId);
    const accentColor = quiz?.accent || "#FF7A00";

    if (pr && quiz) {
      const res = quiz.results[pr.resultKey];

      // Background fill
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = accentColor;
      ctx.fillRect(sx, sy, SW, SH);
      ctx.globalAlpha = 1;

      // Border
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, SW, SH);

      // Accent top bar
      ctx.fillStyle = accentColor;
      ctx.fillRect(sx, sy, SW, 5);

      // Dimension title (pequeno, no topo)
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "700 13px 'Big Shoulders Display', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(dim.title.toUpperCase(), sx + SW / 2, sy + 28);

      // profileLabel (grande, accent)
      const pl = stripEmoji(res?.profileLabel || pr.profileLabel || pr.resultLabel).toUpperCase();
      const plSize = pl.length > 18 ? 30 : pl.length > 12 ? 36 : 42;
      ctx.fillStyle = accentColor;
      ctx.font = `800 ${plSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
      ctx.fillText(pl, sx + SW / 2, sy + 100);

      // Result label (sub, sem emoji)
      const shortLabel = stripEmoji(pr.resultLabel);
      const shortTrim = shortLabel.length > 20 ? shortLabel.slice(0, 20) + "…" : shortLabel;
      ctx.font = "500 13px 'Space Grotesk', Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText(shortTrim.toUpperCase(), sx + SW / 2, sy + 130);

      // Checkmark ✓
      ctx.fillStyle = accentColor;
      ctx.font = "600 13px 'Big Shoulders Display', Arial, sans-serif";
      ctx.fillText("✓", sx + SW - 18, sy + 18);

    } else {
      // Empty slot — tracejado
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 1, sy + 1, SW - 2, SH - 2);
      ctx.setLineDash([]);

      ctx.font = "700 12px 'Big Shoulders Display', Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.textAlign = "center";
      ctx.fillText(dim.title.toUpperCase(), sx + SW / 2, sy + SH / 2 - 10);

      ctx.font = "600 11px 'Space Grotesk', Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillText("A RESPONDER", sx + SW / 2, sy + SH / 2 + 14);
    }
  });

  // Completed count
  const done = Object.keys(profile.results).length;
  ctx.fillStyle = done === 5 ? "#7BFF00" : "rgba(255,255,255,0.3)";
  ctx.font = `700 18px 'Big Shoulders Display', Arial, sans-serif`;
  ctx.textAlign = "center";
  const countY = ROW1_Y + SH + GY + SH + 36;
  ctx.fillText(
    done === 5 ? "PERFIL COMPLETO" : `${done} DE 5 DIMENSÕES COMPLETAS`,
    S / 2, countY
  );

  // Footer
  ctx.fillStyle = "#7BFF00";
  ctx.fillRect(0, S - 68, S, 68);
  ctx.fillStyle = "#0A0A0A";
  ctx.font = "800 18px 'Big Shoulders Display', Arial, sans-serif";
  ctx.fillText("@COMIDADEDRAGAO · COMIDADEDRAGAO.COM.BR", S / 2, S - 22);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARE UTILITY
// ─────────────────────────────────────────────────────────────────────────────

async function shareCard(blob: Blob, fileName: string, text: string) {
  const file = new File([blob], fileName, { type: "image/png" });

  if (
    navigator.share &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file], title: "Comida de Dragão 🐉", text });
      return;
    } catch {
      /* user cancelled or browser error — fall through to download */
    }
  }

  // Fallback: download PNG
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEE BAR
// ─────────────────────────────────────────────────────────────────────────────

const MarqueeBar = ({ items, bottom = false }: { items: string[]; bottom?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div className={`qz-marquee${bottom ? " bottom" : ""}`}>
      <div className="qz-marquee-track" style={bottom ? { animationDirection: "reverse" } : undefined}>
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED HERO DOTS
// ─────────────────────────────────────────────────────────────────────────────

const HeroDots = () => {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 37.3 + 5) % 100}%`,
    top: `${(i * 53.7 + 10) % 90}%`,
    size: `${4 + (i * 7) % 10}px`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: `${(i * 0.63) % 5}s`,
    duration: `${4 + (i * 1.1) % 6}s`,
  }));
  return (
    <div className="qz-hero-dots">
      {dots.map((d) => (
        <div
          key={d.id}
          className="qz-hero-dot"
          style={{ left: d.left, top: d.top, width: d.size, height: d.size, background: d.color, animationDelay: d.delay, animationDuration: d.duration }}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFETTI
// ─────────────────────────────────────────────────────────────────────────────

const Confetti = () => {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${(i * 17.3 + 5) % 90}%`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: `${5 + (i * 3) % 7}px`,
    delay: `${(i * 0.13) % 0.8}s`,
    duration: `${0.8 + (i * 0.11) % 0.8}s`,
  }));
  return (
    <div className="qz-confetti">
      {dots.map((d) => (
        <div
          key={d.id}
          className="qz-confetti-dot"
          style={{ left: d.left, top: 0, width: d.size, height: d.size, background: d.color, animationDelay: d.delay, animationDuration: d.duration }}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE DIMENSION SLOTS
// ─────────────────────────────────────────────────────────────────────────────

const ProfileDimensionSlots = ({
  profile,
  onQuizClick,
}: {
  profile: DragonProfile;
  onQuizClick: (quiz: QuizDef) => void;
}) => (
  <div className="qz-dimensions">
    {PROFILE_DIMENSIONS.map((dim) => {
      const pr = profile.results[dim.quizId];
      const quiz = QUIZZES.find((q) => q.id === dim.quizId);
      const res = pr && quiz ? quiz.results[pr.resultKey] : null;
      const accent = quiz?.accent || "#FF7A00";

      return (
        <div
          key={dim.key}
          className={`qz-dim-slot${pr ? " filled" : " empty"}`}
          style={pr ? ({ "--dim-accent": accent } as React.CSSProperties) : undefined}
          onClick={!pr && quiz && !quiz.comingSoon ? () => onQuizClick(quiz) : undefined}
          role={!pr && quiz && !quiz.comingSoon ? "button" : undefined}
          tabIndex={!pr && quiz && !quiz.comingSoon ? 0 : undefined}
        >
          <div className="qz-dim-title">{dim.title}</div>
          {pr && res ? (
            <>
              <div className="qz-dim-label" style={{ color: accent }}>
                {stripEmoji(res.profileLabel)}
              </div>
              <div className="qz-dim-sub">
                {stripEmoji(pr.resultLabel)}
              </div>
              <div className="qz-dim-check" style={{ color: accent }}>✓</div>
            </>
          ) : (
            <div className="qz-dim-cta">
              {quiz?.comingSoon ? "Em breve" : "Fazer quiz →"}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ MODAL
// ─────────────────────────────────────────────────────────────────────────────

type ModalPhase = "questions" | "gate" | "result";

interface QuizModalProps {
  quiz: QuizDef;
  profile: DragonProfile | null;
  onClose: () => void;
  onComplete: (
    quizId: string,
    resultKey: string,
    gateData?: { name: string; email: string }
  ) => void;
}

const QuizModal = ({ quiz, profile, onClose, onComplete }: QuizModalProps) => {
  const [phase, setPhase]         = useState<ModalPhase>("questions");
  const [stepIdx, setStepIdx]     = useState(0);
  const [answers, setAnswers]     = useState<string[]>([]);
  const [transitioning, setTrans] = useState(false);
  const [resultKey, setResultKey] = useState("");
  const [gateName, setGateName]   = useState(profile?.name || "");
  const [gateEmail, setGateEmail] = useState(profile?.email || "");
  const [gateError, setGateError] = useState("");
  const [sharing, setSharing]     = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "ok" | "err">("idle");
  const bodyRef = useRef<HTMLDivElement>(null);

  const totalSteps = quiz.questions.length;
  const progressPct =
    phase === "questions" ? (stepIdx / totalSteps) * 100
    : phase === "gate"    ? 85
    : 100;

  const transition = useCallback((fn: () => void) => {
    setTrans(true);
    setTimeout(() => { fn(); setTrans(false); }, 160);
  }, []);

  const selectAnswer = (value: string) => {
    const next = [...answers];
    next[stepIdx] = value;
    setAnswers(next);

    if (stepIdx < totalSteps - 1) {
      transition(() => setStepIdx((s) => s + 1));
    } else {
      const key = quiz.computeResult(next);
      setResultKey(key);
      if (!profile) {
        transition(() => setPhase("gate"));
      } else {
        transition(() => setPhase("result"));
        onComplete(quiz.id, key);
      }
    }
  };

  const submitGate = () => {
    if (!gateName.trim()) { setGateError("Coloca seu nome 👆"); return; }
    if (!gateEmail.includes("@")) { setGateError("Email inválido"); return; }
    setGateError("");
    transition(() => setPhase("result"));
    onComplete(quiz.id, resultKey, { name: gateName, email: gateEmail });
  };

  const retry = () => {
    transition(() => {
      setPhase("questions");
      setStepIdx(0);
      setAnswers([]);
      setResultKey("");
      setShareStatus("idle");
    });
  };

  const handleShare = async () => {
    if (!resultKey || sharing) return;
    const name = profile?.name || gateName || "Tutor Dragão";
    setSharing(true);
    setShareStatus("idle");
    try {
      const blob = await generateResultCardBlob(quiz, resultKey, name);
      const resultData = quiz.results[resultKey];
      const text = `Descobri que sou ${resultData?.profileLabel || resultData?.label} no quiz do Dragão! ${resultData?.emoji || "🐉"} Descobre o seu: comidadedragao.com.br #ComidaDeDragao`;
      await shareCard(blob, "resultado-dragao.png", text);
      setShareStatus("ok");
    } catch {
      setShareStatus("err");
    } finally {
      setSharing(false);
    }
  };

  // Escape to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const result  = resultKey ? quiz.results[resultKey] : null;
  const question = quiz.questions[stepIdx];

  return (
    <div
      className="qz-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="qz-modal"
        style={{ "--quiz-accent": quiz.accent } as React.CSSProperties}
      >
        {/* Progress */}
        <div className="qz-progress">
          <div className="qz-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Header */}
        <div className="qz-modal-header">
          <div className="qz-modal-header-info">
            <div className="qz-modal-quiz-name">{quiz.emoji} {quiz.title}</div>
            <div className="qz-modal-step-count">
              {phase === "questions" ? `Pergunta ${stepIdx + 1} de ${totalSteps}`
                : phase === "gate"   ? "Quase lá…"
                : "Seu resultado"}
            </div>
          </div>
          <button className="qz-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          className={`qz-modal-body${transitioning ? " exiting" : ""}`}
        >

          {/* ── QUESTIONS ── */}
          {phase === "questions" && question && (
            <>
              <div className="qz-question">{stripEmoji(question.question)}</div>
              <div className="qz-options">
                {question.options.map((opt, i) => (
                  <button
                    key={opt.value}
                    className={`qz-option${answers[stepIdx] === opt.value ? " selected" : ""}`}
                    onClick={() => selectAnswer(opt.value)}
                  >
                    <span className="qz-option-letter">{OPTION_LETTERS[i]}</span>
                    {stripEmoji(opt.text)}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── GATE ── */}
          {phase === "gate" && (
            <div className="qz-gate">
              <DragonLogo className="qz-gate-logo" />
              <div className="qz-gate-title">O DRAGÃO TEM SEU RESULTADO</div>
              <div className="qz-gate-sub">
                Deixa seu email pra revelar — e salvar<br />
                seu perfil pra sempre.
              </div>
              <div className="qz-gate-form">
                <input
                  className="qz-gate-input"
                  type="text"
                  placeholder="Seu nome"
                  value={gateName}
                  onChange={(e) => setGateName(e.target.value)}
                  autoFocus
                />
                <input
                  className="qz-gate-input"
                  type="email"
                  placeholder="Seu melhor email"
                  value={gateEmail}
                  onChange={(e) => setGateEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submitGate(); }}
                />
                {gateError && <span className="qz-gate-error">{gateError}</span>}
                <button className="qz-gate-btn" onClick={submitGate}>
                  REVELAR MEU RESULTADO
                </button>
                <span className="qz-gate-privacy">
                  Sem spam. O Dragão respeita sua privacidade.
                </span>
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {phase === "result" && result && (
            <div className="qz-result">
              <Confetti />

              <div className="qz-result-emoji-wrap">
                <span className="qz-result-emoji-big">{result.emoji}</span>
                <div className="qz-result-glow" />
              </div>

              <div className="qz-result-tag">SEU PERFIL</div>
              <div className="qz-result-label">{result.label}</div>
              <div className="qz-result-profile-label" style={{ color: quiz.accent }}>
                {result.profileLabel}
              </div>
              <div className="qz-result-desc">{result.description}</div>

              {result.coupon && (
                <div className="qz-result-coupon">
                  <span className="qz-coupon-label">CUPOM EXCLUSIVO</span>
                  <span className="qz-coupon-code">{result.coupon}</span>
                </div>
              )}

              {result.ctaLink && (
                <a
                  href={result.ctaLink}
                  target={result.ctaLink.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="qz-result-cta"
                  style={{ background: quiz.accent }}
                >
                  {result.ctaText || "EXPLORAR →"}
                </a>
              )}

              <div className="qz-result-actions">
                <button
                  className={`qz-share-btn${sharing ? " loading" : ""}${shareStatus === "ok" ? " ok" : ""}`}
                  onClick={handleShare}
                  disabled={sharing}
                >
                  {sharing ? "GERANDO CARD…"
                    : shareStatus === "ok" ? "CARD GERADO!"
                    : "COMPARTILHAR RESULTADO"}
                </button>
                <button className="qz-result-retry" onClick={retry}>
                  ← Refazer o quiz
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ CARD
// ─────────────────────────────────────────────────────────────────────────────

interface QuizCardProps {
  quiz: QuizDef;
  completed?: ProfileResult;
  onOpen: () => void;
}

const QuizCard = ({ quiz, completed, onOpen }: QuizCardProps) => (
  <div
    className={[
      "qz-card",
      quiz.cardRatio || "ratio-16-9",
      quiz.comingSoon ? "coming-soon" : "",
      completed ? "done" : "",
    ].filter(Boolean).join(" ")}
    style={{
      flexGrow: quiz.cardFlex || 1,
      "--card-accent": quiz.accent,
    } as React.CSSProperties}
    onClick={quiz.comingSoon ? undefined : onOpen}
    role={quiz.comingSoon ? undefined : "button"}
    tabIndex={quiz.comingSoon ? undefined : 0}
    onKeyDown={quiz.comingSoon ? undefined : (e) => { if (e.key === "Enter") onOpen(); }}
  >
    {quiz.hoverImage && (
      <div
        className="qz-card-img"
        style={{ backgroundImage: `url('${quiz.hoverImage}')` }}
      />
    )}

    <div className="qz-card-inner">
      <div className="qz-card-body">
        <div className="qz-card-tag">// Quiz</div>
        <span className="qz-card-emoji">{quiz.emoji}</span>
        <div className="qz-card-title">{quiz.title}</div>
        <div className="qz-card-sub">{quiz.subtitle}</div>
        {!quiz.comingSoon && (
          <div className="qz-card-meta">
            {quiz.questions.length} pergunta{quiz.questions.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>

    {completed && (
      <div className="qz-card-done-badge">
        <span className="qz-done-check">✓</span>
        <span>{stripEmoji(completed.profileLabel)}</span>
        <span className="qz-done-redo">Fazer de novo →</span>
      </div>
    )}

    {quiz.comingSoon && (
      <div className="qz-soon-overlay">
        <span className="qz-soon-label">Em breve</span>
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// WELCOME HERO (no profile)
// ─────────────────────────────────────────────────────────────────────────────

const WelcomeHero = () => (
  <div className="qz-hero-content">
    <DragonLogo className="qz-hero-logo" />
    <div className="qz-hero-eyebrow">Quizzes do Dragão</div>
    <div className="qz-welcome-title">
      O DRAGÃO<br />
      <span className="qz-accent">TE CONHECE</span>
    </div>
    <div className="qz-welcome-sub">
      5 quizzes pra descobrir quem você é como tutor.<br />
      Personalidade, nível de nojo, consciência ambiental,<br />
      conhecimento sobre pet food — e o produto certo pro seu pet.<br />
      <strong>Responde, monta seu perfil completo e entra na matilha.</strong>
    </div>
    <div className="qz-welcome-hint">
      ↓ Escolha um quiz pra começar
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE DISPLAY (has profile)
// ─────────────────────────────────────────────────────────────────────────────

interface ProfileDisplayProps {
  profile: DragonProfile;
  onReset: () => void;
  onShareProfile: () => void;
  sharingProfile: boolean;
  shareProfileStatus: "idle" | "ok" | "err";
  onQuizClick: (quiz: QuizDef) => void;
}

const ProfileDisplay = ({
  profile,
  onReset,
  onShareProfile,
  sharingProfile,
  shareProfileStatus,
  onQuizClick,
}: ProfileDisplayProps) => {
  const completedCount = Object.keys(profile.results).length;

  return (
    <div className="qz-hero-content qz-profile-content">

      {/* Logo + descrição */}
      <div className="qz-profile-header">
        <DragonLogo className="qz-hero-logo qz-profile-logo" />
        <p className="qz-profile-desc">
          5 quizzes pra montar seu perfil completo de tutor.
          Personalidade, nível de nojo, consciência ambiental,
          conhecimento sobre pet food e o produto certo pro seu pet.
        </p>
      </div>

      {/* Top bar */}
      <div className="qz-profile-bar">
        <div className="qz-profile-avatar">
          <DragonLogo className="qz-avatar-logo" />
        </div>
        <div className="qz-profile-info">
          <div className="qz-profile-greeting">Perfil do Dragão</div>
          <div className="qz-profile-name">{profile.name.toUpperCase()}</div>
          <div className="qz-profile-progress">
            <strong>{completedCount}</strong> de 5 dimensões completas
          </div>
        </div>
        <div className="qz-profile-actions-top">
          <button
            className={`qz-share-btn profile-share${sharingProfile ? " loading" : ""}${shareProfileStatus === "ok" ? " ok" : ""}`}
            onClick={onShareProfile}
            disabled={sharingProfile}
          >
            {sharingProfile ? "GERANDO…"
              : shareProfileStatus === "ok" ? "CARD GERADO!"
              : "COMPARTILHAR PERFIL"}
          </button>
          <button className="qz-profile-reset" onClick={onReset}>
            Sair do perfil ×
          </button>
        </div>
      </div>

      {/* Dimension slots */}
      <ProfileDimensionSlots profile={profile} onQuizClick={onQuizClick} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const Quizzes = () => {
  const [profile, setProfile]             = useState<DragonProfile | null>(null);
  const [activeQuiz, setActiveQuiz]       = useState<QuizDef | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [sharingProfile, setSharingProfile] = useState(false);
  const [shareProfileStatus, setShareProfileStatus] = useState<"idle" | "ok" | "err">("idle");

  useEffect(() => {
    setProfile(loadProfile());
    setProfileLoaded(true);
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("Tem certeza? Isso vai apagar seu perfil e resultados.")) {
      clearProfile();
      setProfile(null);
      setShareProfileStatus("idle");
    }
  }, []);

  const handleOpenQuiz = useCallback((quiz: QuizDef) => {
    if (!quiz.comingSoon) setActiveQuiz(quiz);
  }, []);

  const handleCloseQuiz = useCallback(() => {
    setActiveQuiz(null);
  }, []);

  const handleComplete = useCallback(
    (quizId: string, resultKey: string, gateData?: { name: string; email: string }) => {
      const quiz = QUIZZES.find((q) => q.id === quizId);
      if (!quiz) return;
      const result = quiz.results[resultKey];
      if (!result) return;

      setProfile((prev) => {
        const base: DragonProfile = prev || {
          name: gateData?.name?.trim() || "Tutor Dragão",
          email: gateData?.email?.trim().toLowerCase() || "",
          createdAt: new Date().toISOString(),
          results: {},
        };
        const updated: DragonProfile = {
          ...base,
          results: {
            ...base.results,
            [quizId]: {
              quizId,
              resultKey,
              resultLabel: result.label,
              resultEmoji: result.emoji,
              profileLabel: result.profileLabel,
              completedAt: new Date().toISOString(),
            },
          },
        };
        saveProfile(updated);
        return updated;
      });
    },
    []
  );

  const handleShareProfile = useCallback(async () => {
    if (!profile || sharingProfile) return;
    setSharingProfile(true);
    setShareProfileStatus("idle");
    try {
      const blob = await generateProfileCardBlob(profile, QUIZZES);
      const done = Object.keys(profile.results).length;
      const text = `Meu perfil de tutor está ${done === 5 ? "completo" : "em construção"}! 🐉 Faz o teu em comidadedragao.com.br #ComidaDeDragao`;
      await shareCard(blob, "perfil-tutor-dragao.png", text);
      setShareProfileStatus("ok");
    } catch {
      setShareProfileStatus("err");
    } finally {
      setSharingProfile(false);
    }
  }, [profile, sharingProfile]);

  const completedCount = profile ? Object.keys(profile.results).length : 0;

  if (!profileLoaded) return null;

  return (
    <div className="quizzes-page">
      {/* TOP MARQUEE */}
      <MarqueeBar items={MARQUEE_TOP} />

      {/* HERO — profile zone */}
      <section className="qz-hero">
        <div className="qz-hero-bg" />
        <HeroDots />
        {profile ? (
          <ProfileDisplay
            profile={profile}
            onReset={handleReset}
            onShareProfile={handleShareProfile}
            sharingProfile={sharingProfile}
            shareProfileStatus={shareProfileStatus}
            onQuizClick={handleOpenQuiz}
          />
        ) : (
          <WelcomeHero />
        )}
      </section>

      {/* SECTION LABEL */}
      <div className="qz-section-label">
        {profile
          ? `Quizzes do Dragão — ${completedCount}/5 dimensões completas`
          : "Quizzes do Dragão — escolha um pra começar"}
      </div>

      {/* QUIZ GRID */}
      <div className="qz-grid">
        {GRID_LAYOUT.map((row, rowIdx) => (
          <div className="qz-row" key={rowIdx}>
            {row.map((quizIdx) => {
              const quiz = QUIZZES[quizIdx];
              if (!quiz) return null;
              const completed = profile?.results[quiz.id];
              return (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  completed={completed}
                  onOpen={() => handleOpenQuiz(quiz)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* STATS STRIP */}
      <div className="qz-stats">
        {[
          { num: "83%", label: "menos carbono" },
          { num: "15K", label: "litros menos água/kg" },
          { num: "142×", label: "menos uso de terra" },
          { num: "88,9%", label: "digestibilidade proteína" },
          { num: "5", label: "dimensões do seu perfil" },
        ].map((s, i) => (
          <div className="qz-stat" key={i}>
            <span className="qz-stat-num">{s.num}</span>
            <span className="qz-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* BOTTOM MARQUEE */}
      <MarqueeBar items={MARQUEE_BOTTOM} bottom />

      {/* FOOTER */}
      <footer className="qz-footer">
        <DragonLogo style={{ width: 120, margin: "0 auto 14px", display: "block", opacity: 0.4 }} />
        Comida de Dragão — Let's Fly Sustentável &nbsp;·&nbsp;{" "}
        <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">
          comidadedragao.com.br
        </a>
        &nbsp;·&nbsp;
        <a href="/portal">← Voltar ao Portal</a>
      </footer>

      {/* QUIZ MODAL */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          profile={profile}
          onClose={handleCloseQuiz}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default Quizzes;
