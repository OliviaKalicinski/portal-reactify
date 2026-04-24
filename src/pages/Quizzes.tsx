import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";

import {
  QUIZZES,
  QuizDef,
  PROFILE_DIMENSIONS,
} from "@/data/quizzes";
import "./Portal.css";
import "./Parceiros.css";
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
  "O DRAGÃO QUER TE CONHECER",
  "MONTA TEU PERFIL DE TUTOR",
  "8 DIMENSÕES · 8 QUIZZES",
  "PERSONALIDADE · NOJO · CONSCIÊNCIA · CONHECIMENTO · PET · REVOLUÇÃO · ESTILO · ALIMENTAÇÃO",
  "ENTRA NA MATILHA",
];

const MARQUEE_BOTTOM = [
  "// 88,9% DIGESTIBILIDADE",
  "// 83% MENOS CARBONO",
  "// 142× MENOS TERRA",
  "// 15K LITROS MENOS ÁGUA",
  "NOJENTO É O DESPERDÍCIO",
  "A NATUREZA SEMPRE SOUBE",
];

const CONFETTI_COLORS = ["#FF7A00", "#7BFF00", "#FFE600", "#FF2D78", "#925AED", "#00D96F"];
const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

// Remove emojis do início e de dentro do texto de perguntas/opções
const stripEmoji = (s: string): string =>
  s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F300}-\u{1FAFF}\u24C2\uFE0F\u20E3]/gu, "")
   .replace(/\s{2,}/g, " ")
   .trim();

const MarqueeBar = ({ items, bottom = false }: { items: string[]; bottom?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-bar${bottom ? " bottom" : ""}`}>
      <div
        className="marquee-track"
        style={bottom ? { animationDirection: "reverse" } : undefined}
      >
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
};

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
  _profileName: string,
  petPhotoFile?: File | null
): Promise<Blob> {
  await document.fonts.ready;

  const result = quiz.results[resultKey];
  if (!result) throw new Error("Result not found");
  const dimension = PROFILE_DIMENSIONS.find((d) => d.quizId === quiz.id);

  const S = 1080;
  const PAD_X = 72;
  const PHOTO_H = 460; // zona duotone quando há foto

  const canvas = document.createElement("canvas");
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const accent = quiz.accent || "#FF7A00";

  // ── Background preto
  ctx.fillStyle = "#0A0A0A";
  ctx.fillRect(0, 0, S, S);

  // ── Carrega foto, se houver
  let petImg: HTMLImageElement | null = null;
  if (petPhotoFile) {
    try {
      const blobUrl = URL.createObjectURL(petPhotoFile);
      petImg = await loadImage(blobUrl);
      URL.revokeObjectURL(blobUrl);
    } catch { petImg = null; }
  }

  // ─────────────────────────────────────────────────────────────────────
  // ZONA DE FOTO (duotone) — só se tem foto
  // ─────────────────────────────────────────────────────────────────────
  if (petImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, S, PHOTO_H);
    ctx.clip();

    const offC = document.createElement("canvas");
    offC.width = S; offC.height = PHOTO_H;
    const offCtx = offC.getContext("2d")!;
    const iw = petImg.naturalWidth, ih = petImg.naturalHeight;
    const sc = Math.max(S / iw, PHOTO_H / ih);
    const dw = iw * sc, dh = ih * sc;
    offCtx.drawImage(petImg, (S - dw) / 2, (PHOTO_H - dh) / 2, dw, dh);
    const imgData = offCtx.getImageData(0, 0, S, PHOTO_H);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      d[i] = d[i + 1] = d[i + 2] = g;
    }
    offCtx.putImageData(imgData, 0, 0);
    ctx.drawImage(offC, 0, 0);
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, S, PHOTO_H);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.restore();

    // Fade inferior da foto pro preto — transição suave
    const fadeGrad = ctx.createLinearGradient(0, PHOTO_H - 140, 0, PHOTO_H);
    fadeGrad.addColorStop(0, "transparent");
    fadeGrad.addColorStop(1, "#0A0A0A");
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(0, 0, S, PHOTO_H);

    // Fade topo pra legibilidade do logo
    const topFade = ctx.createLinearGradient(0, 0, 0, 120);
    topFade.addColorStop(0, "rgba(0,0,0,0.55)");
    topFade.addColorStop(1, "transparent");
    ctx.fillStyle = topFade;
    ctx.fillRect(0, 0, S, 120);
  }

  // ── Accent stripe lateral esquerda (6px)
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 6, S);

  // ── Logo top-left pequeno
  const logo = await loadLogoColored("#FAFAFA");
  if (logo) {
    const lw = 116;
    const lh = logo.naturalHeight > 0 ? Math.round(lw * logo.naturalHeight / logo.naturalWidth) : 40;
    ctx.globalAlpha = petImg ? 0.92 : 0.78;
    ctx.drawImage(logo, 30, 26, lw, lh);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = "700 14px 'Big Shoulders Display', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("COMIDA DE DRAGÃO", 30, 48);
  }

  // ── Dimension tag muted top-right
  const dimTitle = (dimension?.title || quiz.title).toUpperCase();
  ctx.font = "600 11px 'Space Grotesk', Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.fillText(dimTitle, S - 30, 42);

  // ─────────────────────────────────────────────────────────────────────
  // STATEMENT — única coisa que importa
  // ─────────────────────────────────────────────────────────────────────
  const statement = stripEmoji(result.profileLabel).toUpperCase();
  const maxStW = S - PAD_X * 2;

  // Quebra em linhas dentro de um font-size candidato; devolve linhas
  const wrap = (fontSize: number): string[] => {
    ctx.font = `800 ${fontSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
    const words = statement.split(" ");
    const lines: string[] = [];
    let acc = "";
    for (const word of words) {
      const test = acc + word + " ";
      if (ctx.measureText(test).width > maxStW && acc !== "") {
        lines.push(acc.trim());
        acc = word + " ";
      } else {
        acc = test;
      }
    }
    if (acc.trim()) lines.push(acc.trim());
    return lines;
  };

  // Escolhe tamanho que caiba bonito
  let stFontSize = petImg ? 110 : 140;
  let stLines = wrap(stFontSize);
  while ((stLines.length > 3 || stLines.some(l => ctx.measureText(l).width > maxStW)) && stFontSize > 54) {
    stFontSize -= 6;
    stLines = wrap(stFontSize);
  }
  const stLineH = stFontSize * 1.04;
  const stBlockH = stLines.length * stLineH;

  // Posiciona: com foto, logo abaixo do fade; sem foto, centraliza vertical
  const stTop = petImg
    ? PHOTO_H + 30
    : (S - stBlockH) / 2 - 20;

  ctx.font = `800 ${stFontSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#FAFAFA";
  let stY = stTop + stFontSize * 0.82;
  for (const line of stLines) {
    ctx.fillText(line, S / 2, stY);
    stY += stLineH;
  }

  // Traço accent embaixo da frase (editorial)
  const underlineY = stTop + stBlockH + 26;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(S / 2 - 54, underlineY);
  ctx.lineTo(S / 2 + 54, underlineY);
  ctx.stroke();

  // ─────────────────────────────────────────────────────────────────────
  // FOOTER mínimo
  // ─────────────────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.font = "700 14px 'Big Shoulders Display', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("@COMIDADEDRAGAO", S / 2, S - 56);

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "500 11px 'Space Grotesk', Arial, sans-serif";
  ctx.fillText("comidadedragao.com.br", S / 2, S - 34);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
  );
}

async function generateProfileCardBlob(
  profile: DragonProfile,
  quizzes: QuizDef[],
  ownerPhotoFile?: File | null
): Promise<Blob> {
  await document.fonts.ready;

  const S = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  const LIME = "#7BFF00";
  const DARK = "#0A0A0A";
  const FOOTER_H = 68;

  // ── Background preto base
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, S, S);

  // ── Carrega foto do tutor+pet (opcional)
  let ownerImg: HTMLImageElement | null = null;
  if (ownerPhotoFile) {
    try {
      const blobUrl = URL.createObjectURL(ownerPhotoFile);
      ownerImg = await loadImage(blobUrl);
      URL.revokeObjectURL(blobUrl);
    } catch { ownerImg = null; }
  }

  // ── Foto como BACKDROP duotone fotográfico (preserva tons do pet)
  if (ownerImg) {
    const offC = document.createElement("canvas");
    offC.width = S; offC.height = S;
    const offCtx = offC.getContext("2d")!;

    const iw = ownerImg.naturalWidth, ih = ownerImg.naturalHeight;
    const sc = Math.max(S / iw, S / ih);
    const dw = iw * sc, dh = ih * sc;

    const isPortrait = ih / iw > 1.15;
    const overflowY = dh - S;
    const dy = isPortrait ? -overflowY * 0.22 : -overflowY * 0.5;
    offCtx.drawImage(ownerImg, (S - dw) / 2, dy, dw, dh);

    // Duotone per-pixel: interpola cada pixel entre SHADOW e HIGHLIGHT
    // segundo a luminância. Isso preserva tons, textura e volume da foto
    // em vez de chapar tudo na mesma cor.
    //   SHADOW   = verde muito escuro (quase preto com tinge lime)
    //   HIGHLIGHT= lime vibrante da marca
    const SHADOW_R = 0x08, SHADOW_G = 0x18, SHADOW_B = 0x02;
    const HIGH_R   = 0x8C, HIGH_G   = 0xFF, HIGH_B   = 0x1C;

    const imgData = offCtx.getImageData(0, 0, S, S);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      // Luminância percebida (Rec. 601)
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const t = lum / 255;
      d[i]     = SHADOW_R + (HIGH_R - SHADOW_R) * t;
      d[i + 1] = SHADOW_G + (HIGH_G - SHADOW_G) * t;
      d[i + 2] = SHADOW_B + (HIGH_B - SHADOW_B) * t;
    }
    offCtx.putImageData(imgData, 0, 0);

    // Desenha com opacidade maior pro pet aparecer (40% vs antes 22%)
    ctx.globalAlpha = 0.52;
    ctx.drawImage(offC, 0, 0);
    ctx.globalAlpha = 1;

    // Vignette escurecendo as bordas pra tipografia destacar
    const vign = ctx.createRadialGradient(
      S / 2, S * 0.35, S * 0.25,
      S / 2, S * 0.55, S * 0.85
    );
    vign.addColorStop(0, "rgba(0,0,0,0.0)");
    vign.addColorStop(0.65, "rgba(0,0,0,0.35)");
    vign.addColorStop(1, "rgba(0,0,0,0.75)");
    ctx.fillStyle = vign;
    ctx.fillRect(0, 0, S, S);

    // Escurecimento adicional na zona da tipografia principal (faixa central-esquerda)
    const textShade = ctx.createLinearGradient(0, 0, S * 0.7, 0);
    textShade.addColorStop(0, "rgba(0,0,0,0.55)");
    textShade.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = textShade;
    ctx.fillRect(0, 130, S * 0.78, S - 200);
  }

  // ── Accent stripe lateral lime (com sombra pra destacar sobre foto)
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.fillStyle = LIME;
  ctx.fillRect(0, 0, 10, S);
  ctx.restore();

  // ── Logo top-left
  const pLogo = await loadLogoColored("#FAFAFA");
  if (pLogo) {
    const lw = 128;
    const lh = pLogo.naturalHeight > 0 ? Math.round(lw * pLogo.naturalHeight / pLogo.naturalWidth) : 44;
    ctx.globalAlpha = 0.95;
    ctx.drawImage(pLogo, 36, 32, lw, lh);
    ctx.globalAlpha = 1;
  }

  // ── Tag top-right "COMIDA DE DRAGÃO · PERFIL N/8"
  const doneCount = Object.keys(profile.results).length;
  const total = PROFILE_DIMENSIONS.length;

  ctx.font = "700 12px 'Space Mono', 'Big Shoulders Display', Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillStyle = LIME;
  ctx.fillText(
    `PERFIL DE TUTOR · ${doneCount}/${total}`,
    S - 36, 54
  );

  // ── Nome grande (left-aligned, abaixo do logo)
  const displayName = (profile.name || "TUTOR DRAGÃO").toUpperCase();
  let nameSize = 92;
  ctx.font = `800 ${nameSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
  const NAME_X = 48;
  const maxNameW = S - NAME_X - 48;
  while (ctx.measureText(displayName).width > maxNameW && nameSize > 48) {
    nameSize -= 4;
    ctx.font = `800 ${nameSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
  }
  const nameY = 180;
  ctx.textAlign = "left";
  ctx.fillStyle = "#FAFAFA";
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = ownerImg ? 12 : 0;
  ctx.fillText(displayName, NAME_X, nameY);
  ctx.shadowBlur = 0;

  // ── Divisória lime sob o nome
  ctx.fillStyle = LIME;
  ctx.fillRect(NAME_X, nameY + 12, 86, 4);

  // ── Label "EU, NA REAL · N/8"
  ctx.font = "700 13px 'Space Mono', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = LIME;
  ctx.fillText(`EU, NA REAL · ${doneCount}/${total}`, NAME_X, nameY + 58);

  // ─────────────────────────────────────────────────────────────────────
  // MANCHETE — linhas coloridas com prefixo SOU/TÔ/E
  // ─────────────────────────────────────────────────────────────────────
  const manchete = buildIdentityLines(profile, quizzes);

  // Constants layout
  const MCH_LEFT = NAME_X;
  const MCH_RIGHT = S - 48;
  const MCH_TOP = nameY + 90;
  const MCH_BOTTOM = S - FOOTER_H - 60;
  const MCH_HEIGHT = MCH_BOTTOM - MCH_TOP;
  const PREFIX_W = 90;
  const LABEL_X = MCH_LEFT + PREFIX_W;
  const LABEL_MAX_W = MCH_RIGHT - LABEL_X;

  // Helper: word-wrap dado fonte fixa
  const wrap = (text: string, maxW: number, font: string): string[] => {
    ctx.font = font;
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      const test = cur ? cur + " " + w : w;
      if (ctx.measureText(test).width > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  };

  // Auto-fit: prefere SEMPRE 1 linha por entrada (sem órfãs de palavra).
  // Decrementa o labelSize até todas as entradas caberem em 1 linha dentro
  // do MCH_HEIGHT. Se chegar em 24px e ainda não couber, aceita wrap 2-linhas.
  const labelSizeMax = 48;
  const labelSizeSingleLineMin = 24;
  const labelSizeHardMin = 20;
  const lineGap = 14;
  const pendingBlockH = manchete.length < total ? 42 : 0;

  let labelSize = labelSizeMax;
  let wrappedPerEntry: string[][] = [];
  let lineH = 0;

  // Fase 1: busca tamanho onde TUDO cabe em 1 linha (sem wrap)
  for (; labelSize >= labelSizeSingleLineMin; labelSize -= 2) {
    const labelFont = `800 ${labelSize}px 'Archivo Black', 'Bebas Neue', Arial, sans-serif`;
    ctx.font = labelFont;
    const allSingleLine = manchete.every(
      (ln) => ctx.measureText(ln.label).width <= LABEL_MAX_W
    );
    if (!allSingleLine) continue;

    lineH = Math.round(labelSize * 1.02);
    const totalH = manchete.length * lineH + (manchete.length - 1) * lineGap + pendingBlockH;
    if (totalH <= MCH_HEIGHT) {
      wrappedPerEntry = manchete.map((ln) => [ln.label]);
      break;
    }
  }

  // Fase 2: se fase 1 não encontrou solução, permite wrap 2 linhas
  if (wrappedPerEntry.length === 0) {
    for (labelSize = labelSizeSingleLineMin; labelSize >= labelSizeHardMin; labelSize -= 2) {
      const labelFont = `800 ${labelSize}px 'Archivo Black', 'Bebas Neue', Arial, sans-serif`;
      lineH = Math.round(labelSize * 1.02);
      wrappedPerEntry = manchete.map((ln) => wrap(ln.label, LABEL_MAX_W, labelFont).slice(0, 2));
      const totalLines = wrappedPerEntry.reduce((s, w) => s + w.length, 0);
      const totalH = totalLines * lineH + (manchete.length - 1) * lineGap + pendingBlockH;
      if (totalH <= MCH_HEIGHT) break;
    }
  }

  const labelFont = `800 ${labelSize}px 'Archivo Black', 'Bebas Neue', Arial, sans-serif`;
  const prefixFont = `700 ${Math.round(labelSize * 0.55)}px 'Bebas Neue', Arial, sans-serif`;

  let cursorY = MCH_TOP + labelSize; // primeira baseline

  manchete.forEach((ln, i) => {
    const prefix = i === 0 ? "SOU" : i === manchete.length - 1 && manchete.length > 1 ? "E" : "·";
    const wrapped = wrappedPerEntry[i];

    // Prefix
    ctx.font = prefixFont;
    ctx.fillStyle = "rgba(250,250,250,0.35)";
    ctx.textAlign = "right";
    ctx.fillText(prefix, MCH_LEFT + PREFIX_W - 18, cursorY - labelSize * 0.15);

    // Label (pode ser 1-2 linhas)
    ctx.font = labelFont;
    ctx.fillStyle = ln.accent;
    ctx.textAlign = "left";
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = ownerImg ? 10 : 0;

    wrapped.forEach((wline, wi) => {
      ctx.fillText(wline, LABEL_X, cursorY + wi * lineH);
    });
    ctx.shadowBlur = 0;

    cursorY += wrapped.length * lineH + lineGap;
  });

  // ── "+ N VERDADES POR DESCOBRIR"
  if (manchete.length < total) {
    const pending = total - manchete.length;
    ctx.font = `700 22px 'Bebas Neue', Arial, sans-serif`;
    ctx.fillStyle = "rgba(250,250,250,0.42)";
    ctx.textAlign = "left";
    ctx.fillText(
      `+ ${pending} ${pending === 1 ? "VERDADE" : "VERDADES"} POR DESCOBRIR`,
      LABEL_X, cursorY + 4
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // FOOTER LIME
  // ─────────────────────────────────────────────────────────────────────
  ctx.fillStyle = LIME;
  ctx.fillRect(0, S - FOOTER_H, S, FOOTER_H);

  ctx.fillStyle = DARK;
  ctx.font = "800 15px 'Big Shoulders Display', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(
    doneCount === total ? "PERFIL COMPLETO" : `${doneCount}/${total} DIMENSÕES`,
    30, S - 26
  );

  ctx.textAlign = "right";
  ctx.fillText("@COMIDADEDRAGAO  ·  COMIDADEDRAGAO.COM.BR", S - 30, S - 26);

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
// CONFETTI (inside modal)
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
// IDENTITY LINES — monta linhas de identidade a partir dos quizzes respondidos
// ─────────────────────────────────────────────────────────────────────────────

interface IdentityLine {
  label: string;   // profileLabel sem emoji ("BANGUELA", "EM TRANSIÇÃO"...)
  accent: string;  // cor do quiz de origem
  quizId: string;
}

const buildIdentityLines = (
  profile: DragonProfile,
  quizzes: QuizDef[]
): IdentityLine[] => {
  const lines: IdentityLine[] = [];
  // Ordena pela ordem das dimensões pra manter consistência visual
  for (const dim of PROFILE_DIMENSIONS) {
    const pr = profile.results[dim.quizId];
    if (!pr) continue;
    const quiz = quizzes.find((q) => q.id === dim.quizId);
    if (!quiz) continue;
    const result = quiz.results[pr.resultKey];
    // manifestoLine (auto-contida) > profileLabel (curto). Fallback garantido.
    const source = result?.manifestoLine || pr.profileLabel;
    lines.push({
      label: stripEmoji(source).toUpperCase(),
      accent: quiz.accent,
      quizId: dim.quizId,
    });
  }
  return lines;
};

// Monta a frase pronta pra "marca um tutor que..." / copiar
const buildFriendTagText = (lines: IdentityLine[], profileName: string): string => {
  if (lines.length === 0) return "";
  const parts = lines.map((l) => l.label.toLowerCase());
  let joined: string;
  if (parts.length === 1) joined = parts[0];
  else if (parts.length === 2) joined = `${parts[0]} e ${parts[1]}`;
  else joined = `${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`;
  return `Marca um tutor que também é ${joined} — vocês formam a matilha 🐉 Faz o teu em comidadedragao.com.br #ComidaDeDragao`;
};

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
  const [petPhotoFile, setPetPhotoFile] = useState<File | null>(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const petPhotoRef = useRef<HTMLInputElement>(null);

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

  const removePetPhoto = () => {
    if (petPhotoPreview) URL.revokeObjectURL(petPhotoPreview);
    setPetPhotoFile(null);
    setPetPhotoPreview(null);
    if (petPhotoRef.current) petPhotoRef.current.value = "";
  };

  const handlePetPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (petPhotoPreview) URL.revokeObjectURL(petPhotoPreview);
    setPetPhotoFile(file);
    setPetPhotoPreview(URL.createObjectURL(file));
  };

  const retry = () => {
    removePetPhoto();
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
      const blob = await generateResultCardBlob(quiz, resultKey, name, petPhotoFile);
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

  // Revoke pet photo URL on unmount or change
  useEffect(() => {
    return () => { if (petPhotoPreview) URL.revokeObjectURL(petPhotoPreview); };
  }, [petPhotoPreview]);

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
            <div className="qz-modal-quiz-name">{quiz.title}</div>
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

              {/* Pet photo upload */}
              <div className="qz-pet-photo-section">
                <input
                  ref={petPhotoRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePetPhotoChange}
                />
                {petPhotoPreview ? (
                  <div className="qz-pet-preview-wrap">
                    <img src={petPhotoPreview} className="qz-pet-preview-img" alt="Foto do pet" />
                    <div className="qz-pet-preview-label">Foto do pet no card</div>
                    <button className="qz-pet-remove-btn" onClick={removePetPhoto}>Remover</button>
                  </div>
                ) : (
                  <button
                    className="qz-add-photo-btn"
                    onClick={() => petPhotoRef.current?.click()}
                  >
                    + Adicionar foto do pet no card
                  </button>
                )}
              </div>

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
// FRIEND TAG BLOCK — frase pronta pra "marca um tutor que..." + copy/share
// ─────────────────────────────────────────────────────────────────────────────

const FriendTagBlock = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && !!(navigator as Navigator & { share?: unknown }).share;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: tenta selecionar + execCommand pra browsers antigos
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch { /* ignore */ }
    }
  };

  const handleShare = async () => {
    if (!canNativeShare) return handleCopy();
    setSharing(true);
    try {
      await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
        title: "Meu perfil de tutor — Comida de Dragão",
        text,
        url: "https://comidadedragao.com.br",
      });
    } catch { /* user cancelou, ignora */ }
    finally {
      setSharing(false);
    }
  };

  return (
    <div className="qz-friend-tag">
      <div className="qz-friend-tag-label">MANDA PRA TEU GRUPO</div>
      <p className="qz-friend-tag-text">{text}</p>
      <div className="qz-friend-tag-actions">
        <button
          type="button"
          className={`qz-friend-btn primary${copied ? " copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? "COPIADO ✓" : "COPIAR TEXTO"}
        </button>
        {canNativeShare && (
          <button
            type="button"
            className="qz-friend-btn ghost"
            onClick={handleShare}
            disabled={sharing}
          >
            {sharing ? "ABRINDO…" : "COMPARTILHAR ↗"}
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ CARD — editorial pattern (index circle + tag + big "?" + title + sub)
// ─────────────────────────────────────────────────────────────────────────────

interface QuizCardProps {
  quiz: QuizDef;
  index: number;
  completed?: ProfileResult;
  onOpen: () => void;
}

const QuizCard = ({ quiz, index, completed, onOpen }: QuizCardProps) => {
  const label = completed ? stripEmoji(completed.profileLabel) : null;
  const dim = PROFILE_DIMENSIONS.find((d) => d.quizId === quiz.id);
  const tagText = dim?.title || "Quiz";
  const disabled = !!quiz.comingSoon;

  return (
    <div
      className={[
        "quiz-card",
        disabled ? "coming-soon" : "",
        completed ? "done" : "",
      ].filter(Boolean).join(" ")}
      style={{ "--card-accent": quiz.accent } as React.CSSProperties}
      onClick={disabled ? undefined : onOpen}
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? undefined : 0}
      onKeyDown={disabled ? undefined : (e) => { if (e.key === "Enter") onOpen(); }}
      aria-label={`${quiz.title} — ${tagText}`}
    >
      {/* Texturas sobrepostas à cor chapada */}
      <div className="quiz-card-halftone" aria-hidden="true" />
      <div className="quiz-card-grain" aria-hidden="true" />

      {/* GIF hover preview (opcional, vem por cima no hover) */}
      {quiz.hoverImage && !disabled && (
        <div
          className="quiz-card-img"
          style={{ backgroundImage: `url('${quiz.hoverImage}')` }}
          aria-hidden="true"
        />
      )}

      {/* Top: índice + tag da dimensão */}
      <div className="quiz-card-top">
        <span className="quiz-card-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="quiz-card-tag">{tagText}</span>
      </div>

      {/* Centro: "?" tipográfico ou "…" pra coming-soon */}
      <div className="quiz-card-visual" aria-hidden="true">
        {disabled ? "…" : "?"}
      </div>

      {/* Bottom: título, subtítulo, meta */}
      <div className="quiz-card-body">
        <h3 className="quiz-card-title">{quiz.title}</h3>
        <p className="quiz-card-sub">{quiz.subtitle}</p>
        {disabled && (
          <span className="quiz-card-meta quiz-card-meta-soon">Em breve</span>
        )}
        {!disabled && completed && label && (
          <span className="quiz-card-meta quiz-card-meta-done">
            ✓ {label} · refazer →
          </span>
        )}
        {!disabled && !completed && (
          <span className="quiz-card-meta">
            {quiz.questions.length} pergunta{quiz.questions.length !== 1 ? "s" : ""} →
          </span>
        )}
      </div>
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
  const [ownerPhotoFile, setOwnerPhotoFile] = useState<File | null>(null);
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState<string | null>(null);
  const ownerPhotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(loadProfile());
    setProfileLoaded(true);
  }, []);

  useEffect(() => {
    return () => { if (ownerPhotoPreview) URL.revokeObjectURL(ownerPhotoPreview); };
  }, [ownerPhotoPreview]);

  const handleOwnerPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (ownerPhotoPreview) URL.revokeObjectURL(ownerPhotoPreview);
    setOwnerPhotoFile(file);
    setOwnerPhotoPreview(URL.createObjectURL(file));
  };

  const removeOwnerPhoto = () => {
    if (ownerPhotoPreview) URL.revokeObjectURL(ownerPhotoPreview);
    setOwnerPhotoFile(null);
    setOwnerPhotoPreview(null);
    if (ownerPhotoRef.current) ownerPhotoRef.current.value = "";
  };

  const handleReset = useCallback(() => {
    if (window.confirm("Tem certeza? Isso vai apagar seu perfil e resultados.")) {
      clearProfile();
      setProfile(null);
      setShareProfileStatus("idle");
      if (ownerPhotoPreview) URL.revokeObjectURL(ownerPhotoPreview);
      setOwnerPhotoFile(null);
      setOwnerPhotoPreview(null);
      if (ownerPhotoRef.current) ownerPhotoRef.current.value = "";
    }
  }, [ownerPhotoPreview]);

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
      const blob = await generateProfileCardBlob(profile, QUIZZES, ownerPhotoFile);
      const done = Object.keys(profile.results).length;
      const total = PROFILE_DIMENSIONS.length;
      const text = `Meu perfil de tutor está ${done === total ? "completo" : "em construção"}! 🐉 Faz o teu em comidadedragao.com.br #ComidaDeDragao`;
      await shareCard(blob, "perfil-tutor-dragao.png", text);
      setShareProfileStatus("ok");
    } catch {
      setShareProfileStatus("err");
    } finally {
      setSharingProfile(false);
    }
  }, [profile, sharingProfile, ownerPhotoFile]);

  const completedCount = profile ? Object.keys(profile.results).length : 0;
  const totalActive = QUIZZES.filter((q) => !q.comingSoon).length;
  const totalDimensions = PROFILE_DIMENSIONS.length;

  if (!profileLoaded) return null;

  return (
    <div className="portal-page quizzes-page skin-2">
      <PageMeta
        title="Quizzes do Dragão · Comida de Dragão"
        description="8 quizzes pra descobrir quem você é como tutor. Personalidade, nojo, consciência ambiental, conhecimento, pet, revolução, estilo e alimentação."
      />
      <MarqueeBar items={MARQUEE_TOP} />

      {/* HERO — unificado (constante nos dois estados) */}
      <section className="archive-hero">
        <div className="archive-hero-bg" />
        <div className="dragon-silhouette" aria-hidden="true" />
        <div className="archive-hero-content">
          <Link to="/portal" className="archive-backlink">← voltar pro portal</Link>
          <div className="hero-eyebrow">Comida de Dragão — Quizzes</div>
          <DragonLogo className="hero-logo" />
          <h1 className="archive-hero-title">
            O Dragão quer
            <span>te conhecer!</span>
          </h1>
          <p className="archive-hero-sub">
            {totalActive} quizzes pra descobrir quem você é como tutor.
            Personalidade, nojo, consciência ambiental, conhecimento,
            perfil do pet, grau de revolução, estilo de cuidado e
            alimentação. Responde, monta seu perfil e entra na matilha.
          </p>
        </div>
      </section>

      {/* PROFILE SECTION — só aparece se já tem perfil */}
      {profile && (
        <>
          <section className="qz-profile-section">

            {/* ── IDENTIDADE: foto + nome + ações ────────────── */}
            <div className="qz-profile-id">
              <input
                ref={ownerPhotoRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleOwnerPhotoChange}
              />

              <div
                className={`qz-profile-avatar${ownerPhotoPreview ? "" : " empty"}`}
                onClick={() => ownerPhotoRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") ownerPhotoRef.current?.click(); }}
                title={ownerPhotoPreview ? "Trocar foto" : "Adicionar foto"}
              >
                {ownerPhotoPreview ? (
                  <img src={ownerPhotoPreview} alt="Foto do tutor" />
                ) : (
                  <span className="qz-profile-avatar-plus">+</span>
                )}
                <span className="qz-profile-avatar-hint">
                  {ownerPhotoPreview ? "Trocar" : "Adicionar foto"}
                </span>
              </div>

              <div className="qz-profile-meta">
                <div className="qz-profile-role">PERFIL DE TUTOR — SUPER TRUNFO</div>
                <div className="qz-profile-name-big">{profile.name}</div>
                {profile.email && (
                  <div className="qz-profile-email">{profile.email}</div>
                )}
                {!ownerPhotoPreview && (
                  <button
                    type="button"
                    className="qz-profile-photo-hint"
                    onClick={() => ownerPhotoRef.current?.click()}
                  >
                    <span className="qz-profile-photo-hint-icon">📷</span>
                    <span>
                      <strong>Sobe uma foto com teu pet</strong> — teu card de perfil fica personalizado e pronto pra compartilhar.
                    </span>
                  </button>
                )}
              </div>

              <div className="qz-profile-actions-top">
                <button
                  className={`qz-share-btn profile-share${sharingProfile ? " loading" : ""}${shareProfileStatus === "ok" ? " ok" : ""}`}
                  onClick={handleShareProfile}
                  disabled={sharingProfile}
                >
                  {sharingProfile ? "GERANDO…"
                    : shareProfileStatus === "ok" ? "CARD GERADO!"
                    : "COMPARTILHAR PERFIL"}
                </button>
                <button className="qz-profile-reset" onClick={handleReset}>
                  Sair do perfil ×
                </button>
              </div>
            </div>

            {/* ── PROGRESSO: 8 segmentos coloridos ───────────── */}
            <div className="qz-progress-wrap">
              <div className="qz-progress-head">
                <span className="qz-progress-count">
                  <strong>{completedCount}</strong>/{totalDimensions}
                </span>
                <span className="qz-progress-label">
                  {completedCount === totalDimensions
                    ? "PERFIL COMPLETO"
                    : completedCount === 0
                      ? "DIMENSÕES RESPONDIDAS"
                      : `FALTAM ${totalDimensions - completedCount} DIMENSÕES`}
                </span>
              </div>
              <div className="qz-progress-segments">
                {PROFILE_DIMENSIONS.map((dim) => {
                  const done = !!profile.results[dim.quizId];
                  const q = QUIZZES.find((x) => x.id === dim.quizId);
                  return (
                    <div
                      key={dim.key}
                      className={`qz-progress-segment${done ? " done" : ""}`}
                      style={done ? { background: q?.accent || "#FAFAFA" } : undefined}
                      title={dim.title}
                    />
                  );
                })}
              </div>
            </div>

            {/* ── MANCHETE DE IDENTIDADE + MARCA-UM-AMIGO ─── */}
            {completedCount > 0 && (() => {
              const lines = buildIdentityLines(profile, QUIZZES);
              const friendText = buildFriendTagText(lines, profile.name);
              const pending = totalDimensions - lines.length;

              return (
                <>
                  <div className="qz-identity">
                    <div className="qz-identity-label">
                      EU, NA REAL · {lines.length}/{totalDimensions}
                    </div>
                    <div className="qz-identity-stack">
                      {lines.map((l, idx) => (
                        <div key={l.quizId} className="qz-identity-line">
                          <span className="qz-identity-prefix">
                            {idx === 0 ? "SOU" : idx === lines.length - 1 && lines.length > 1 ? "E" : "·"}
                          </span>
                          <span
                            className="qz-identity-word"
                            style={{ color: l.accent }}
                          >
                            {l.label}
                          </span>
                        </div>
                      ))}
                      {pending > 0 && (
                        <div className="qz-identity-line qz-identity-line-pending">
                          <span className="qz-identity-prefix">+</span>
                          <span className="qz-identity-word">
                            {pending} {pending === 1 ? "VERDADE" : "VERDADES"} POR DESCOBRIR
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <FriendTagBlock text={friendText} />
                </>
              );
            })()}

          </section>

          <div className="parceiros-divider" />
        </>
      )}

      {/* QUIZ GRID SECTION — só título/intro pra quem ainda não tem perfil */}
      {!profile && (
        <section className="parceiros-secao">
          <div className="parceiros-tag tag-green">monta teu perfil</div>
          <h2 className="parceiros-secao-titulo titulo-green">
            8 quizzes pra <span>descobrir quem você é</span> como tutor
          </h2>
          <p className="qz-intro-pitch">
            Personalidade, nojo, consciência ambiental, conhecimento, perfil do pet,
            grau de revolução, estilo de cuidado e alimentação.
            <br />
            <strong>Responde, monta teu perfil e entra na matilha.</strong>
          </p>
        </section>
      )}

      <div className="quiz-grid-wrap">
        <div className="quiz-grid" id="quiz-grid">
          {QUIZZES.map((quiz, i) => {
            const completed = profile?.results[quiz.id];
            return (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                index={i}
                completed={completed}
                onOpen={() => handleOpenQuiz(quiz)}
              />
            );
          })}
        </div>
      </div>

      {/* CTA FINAL */}
      <section className="parceiros-cta-final">
        <h2 className="parceiros-cta-final-titulo">
          {profile && completedCount === totalDimensions
            ? <>Teu Super Trunfo tá <span>pronto!</span></>
            : profile
              ? <>Completa teu <span>perfil</span></>
              : <>Começa pelo <span>primeiro quiz</span></>}
        </h2>
        <p className="parceiros-cta-final-sub">
          {profile && completedCount === totalDimensions
            ? "Gera teu card e posta no Instagram marcando @comidadedragao. A matilha dá RP nos melhores perfis."
            : profile
              ? "Ainda tem quizzes pra responder. Cada resposta monta mais uma dimensão do teu perfil de tutor."
              : `Oito quizzes curtos, oito dimensões do teu perfil. No final, um card pronto pra postar no Instagram.`}
        </p>
        {profile && completedCount === totalDimensions ? (
          <div className="qz-cta-actions">
            <button
              className={`parceiros-btn-primary${sharingProfile ? " loading" : ""}`}
              onClick={handleShareProfile}
              disabled={sharingProfile}
            >
              {sharingProfile ? "Gerando card…" : "Gerar card de perfil ↓"}
            </button>
            <a
              href="https://www.instagram.com/comidadedragao"
              target="_blank"
              rel="noopener noreferrer"
              className="parceiros-btn-ghost"
            >
              Abrir @comidadedragao ↗
            </a>
          </div>
        ) : (
          <a href="#quiz-grid" className="parceiros-btn-primary">
            {profile ? "Ver quizzes restantes ↓" : "Escolher um quiz ↓"}
          </a>
        )}
        <p className="parceiros-cta-final-note">
          {profile && completedCount === totalDimensions
            ? "É uma brincadeira pra conhecer teu estilo de tutor. Quanto mais gente joga, mais a matilha cresce. Marca a gente no story e a gente reposta."
            : "Sem cadastro obrigatório — só no final do primeiro quiz. No fim, card pronto pra postar no Instagram marcando @comidadedragao."}
        </p>
      </section>

      <MarqueeBar items={MARQUEE_BOTTOM} bottom />

      {/* FOOTER */}
      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <nav className="footer-links">
          <Link to="/portal">Portal</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/parceiros">Parceiros</Link>
          <Link to="/biblioteca">Biblioteca</Link>
          <Link to="/imprensa">Imprensa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@comidadedragao" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">O Dragão te conhece. A natureza sempre soube.</div>
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
