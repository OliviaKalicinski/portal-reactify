import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";

import {
  QUIZZES,
  QuizDef,
  PROFILE_DIMENSIONS,
} from "@/data/quizzes";
import { submitLead } from "@/lib/leads";
import { uploadProfilePhoto } from "@/lib/uploads";
import "./Portal.css";
import "./Parceiros.css";
import "./Quizzes.css";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface DragonProfile {
  name: string;
  /** Telefone com máscara BR: (11) 91234-5678 — só dígitos vão pro Supabase */
  phone: string;
  createdAt: string;
  results: Record<string, ProfileResult>;
  /** URL pública da foto do tutor com o pet (Supabase Storage) */
  photoUrl?: string;
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

/**
 * Aplica máscara BR no telefone enquanto a pessoa digita.
 *  - Aceita só dígitos (descarta o resto)
 *  - Limita a 11 dígitos (DDD + 9 + 8)
 *  - Formata progressivamente: (11) → (11) 9 → (11) 91234-5678
 *
 * Aceita 10 dígitos também (fixo antigo: (11) 1234-5678) caso alguém
 * digite menos — validação do gate exige 10 ou 11.
 */
const formatPhone = (raw: string): string => {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

/** True se o telefone tem 10 ou 11 dígitos válidos. */
const isValidPhone = (raw: string): boolean => {
  const d = raw.replace(/\D/g, "");
  return d.length === 10 || d.length === 11;
};

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

  // Formato 9:16 — stories do Instagram
  const W = 1080, H = 1920;
  const PAD_X = 72;
  const PHOTO_H = 960; // zona duotone ocupa metade superior

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const accent = quiz.accent || "#FF7A00";

  ctx.fillStyle = "#0A0A0A";
  ctx.fillRect(0, 0, W, H);

  // Foto do pet (opcional)
  let petImg: HTMLImageElement | null = null;
  if (petPhotoFile) {
    try {
      const blobUrl = URL.createObjectURL(petPhotoFile);
      petImg = await loadImage(blobUrl);
      URL.revokeObjectURL(blobUrl);
    } catch { petImg = null; }
  }

  // Zona superior: foto duotone accent (mesma fórmula do profile card)
  if (petImg) {
    const offC = document.createElement("canvas");
    offC.width = W; offC.height = PHOTO_H;
    const offCtx = offC.getContext("2d")!;

    const iw = petImg.naturalWidth, ih = petImg.naturalHeight;
    const sc = Math.max(W / iw, PHOTO_H / ih);
    const dw = iw * sc, dh = ih * sc;
    const isPortrait = ih / iw > 1.15;
    const overflowY = dh - PHOTO_H;
    const dy = isPortrait ? -overflowY * 0.22 : -overflowY * 0.5;
    offCtx.drawImage(petImg, (W - dw) / 2, dy, dw, dh);

    // Duotone fotográfico: SHADOW (dark) → HIGHLIGHT (accent) per-pixel
    const accentR = parseInt(accent.slice(1, 3), 16);
    const accentG = parseInt(accent.slice(3, 5), 16);
    const accentB = parseInt(accent.slice(5, 7), 16);
    const SHADOW_R = Math.max(0, Math.floor(accentR * 0.08));
    const SHADOW_G = Math.max(0, Math.floor(accentG * 0.08));
    const SHADOW_B = Math.max(0, Math.floor(accentB * 0.08));
    const HIGH_R = Math.min(255, Math.floor(accentR * 1.08));
    const HIGH_G = Math.min(255, Math.floor(accentG * 1.08));
    const HIGH_B = Math.min(255, Math.floor(accentB * 1.08));

    const imgData = offCtx.getImageData(0, 0, W, PHOTO_H);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const t = lum / 255;
      d[i]     = SHADOW_R + (HIGH_R - SHADOW_R) * t;
      d[i + 1] = SHADOW_G + (HIGH_G - SHADOW_G) * t;
      d[i + 2] = SHADOW_B + (HIGH_B - SHADOW_B) * t;
    }
    offCtx.putImageData(imgData, 0, 0);

    ctx.drawImage(offC, 0, 0);

    // Fade inferior pro preto, transição pro corpo
    const fadeGrad = ctx.createLinearGradient(0, PHOTO_H - 200, 0, PHOTO_H);
    fadeGrad.addColorStop(0, "transparent");
    fadeGrad.addColorStop(1, "#0A0A0A");
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(0, PHOTO_H - 200, W, 200);

    // Fade topo pra logo
    const topFade = ctx.createLinearGradient(0, 0, 0, 160);
    topFade.addColorStop(0, "rgba(0,0,0,0.55)");
    topFade.addColorStop(1, "transparent");
    ctx.fillStyle = topFade;
    ctx.fillRect(0, 0, W, 160);
  }

  // Stripe accent lateral — altura completa, com sombra pra destacar sobre foto
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 10, H);
  ctx.restore();

  // Header: logo top-left + dimension tag top-right
  const logo = await loadLogoColored("#FAFAFA");
  if (logo) {
    const lw = 140;
    const lh = logo.naturalHeight > 0 ? Math.round(lw * logo.naturalHeight / logo.naturalWidth) : 48;
    ctx.globalAlpha = 0.95;
    ctx.drawImage(logo, 40, 40, lw, lh);
    ctx.globalAlpha = 1;
  }

  const dimTitle = (dimension?.title || quiz.title).toUpperCase();
  ctx.font = "700 14px 'Space Mono', 'Big Shoulders Display', Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillStyle = accent;
  ctx.fillText(dimTitle, W - 40, 60);

  // STATEMENT — corpo, frase auto-suficiente grande e centralizada
  const statement = stripEmoji(
    result.manifestoLine || result.profileLabel
  ).toUpperCase();
  const maxStW = W - PAD_X * 2;

  const wrap = (fontSize: number): string[] => {
    ctx.font = `800 ${fontSize}px 'Archivo Black', 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
    const words = statement.split(" ");
    const lines: string[] = [];
    let acc = "";
    for (const word of words) {
      const test = acc ? acc + " " + word : word;
      if (ctx.measureText(test).width > maxStW && acc !== "") {
        lines.push(acc);
        acc = word;
      } else {
        acc = test;
      }
    }
    if (acc) lines.push(acc);
    return lines;
  };

  // Zona do statement: ~1030 até ~1700 (altura 670px)
  const ST_ZONE_TOP = petImg ? PHOTO_H + 80 : 700;
  const ST_ZONE_BOTTOM = H - 260;
  const ST_ZONE_H = ST_ZONE_BOTTOM - ST_ZONE_TOP;

  let stFontSize = 120;
  let stLines = wrap(stFontSize);
  while (stFontSize > 48) {
    const lineH = stFontSize * 1.02;
    const blockH = stLines.length * lineH;
    if (stLines.length <= 5 && blockH <= ST_ZONE_H) break;
    stFontSize -= 6;
    stLines = wrap(stFontSize);
  }

  const stLineH = stFontSize * 1.02;
  const stBlockH = stLines.length * stLineH;
  const stTop = ST_ZONE_TOP + (ST_ZONE_H - stBlockH) / 2;

  ctx.font = `800 ${stFontSize}px 'Archivo Black', 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#FAFAFA";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = petImg ? 12 : 0;

  let stY = stTop + stFontSize * 0.82;
  for (const line of stLines) {
    ctx.fillText(line, W / 2, stY);
    stY += stLineH;
  }
  ctx.shadowBlur = 0;

  // Traço accent editorial embaixo
  const underlineY = stTop + stBlockH + 40;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 70, underlineY);
  ctx.lineTo(W / 2 + 70, underlineY);
  ctx.stroke();

  // FOOTER — logo centralizada + handle
  if (logo) {
    const lw = 130;
    const lh = logo.naturalHeight > 0 ? Math.round(lw * logo.naturalHeight / logo.naturalWidth) : 44;
    ctx.globalAlpha = 0.78;
    ctx.drawImage(logo, (W - lw) / 2, H - 160, lw, lh);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = "rgba(255,255,255,0.38)";
  ctx.font = "700 14px 'Space Mono', 'Big Shoulders Display', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("@COMIDADEDRAGAO  ·  COMIDADEDRAGAO.COM.BR", W / 2, H - 58);

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

  // Formato 9:16 — stories do Instagram, unificado com result card
  const W = 1080, H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const LIME = "#7BFF00";
  const DARK = "#0A0A0A";
  const FOOTER_H = 84;
  const PHOTO_H = 960; // zona duotone ocupa metade superior

  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);

  // Foto do tutor (opcional)
  let ownerImg: HTMLImageElement | null = null;
  if (ownerPhotoFile) {
    try {
      const blobUrl = URL.createObjectURL(ownerPhotoFile);
      ownerImg = await loadImage(blobUrl);
      URL.revokeObjectURL(blobUrl);
    } catch { ownerImg = null; }
  }

  // Zona superior: foto duotone LIME (mesma lógica do result card, color diferente)
  if (ownerImg) {
    const offC = document.createElement("canvas");
    offC.width = W; offC.height = PHOTO_H;
    const offCtx = offC.getContext("2d")!;

    const iw = ownerImg.naturalWidth, ih = ownerImg.naturalHeight;
    const sc = Math.max(W / iw, PHOTO_H / ih);
    const dw = iw * sc, dh = ih * sc;

    const isPortrait = ih / iw > 1.15;
    const overflowY = dh - PHOTO_H;
    const dy = isPortrait ? -overflowY * 0.22 : -overflowY * 0.5;
    offCtx.drawImage(ownerImg, (W - dw) / 2, dy, dw, dh);

    // Duotone fotográfico: SHADOW dark green → HIGHLIGHT lime vibrante
    const SHADOW_R = 0x08, SHADOW_G = 0x18, SHADOW_B = 0x02;
    const HIGH_R   = 0x8C, HIGH_G   = 0xFF, HIGH_B   = 0x1C;

    const imgData = offCtx.getImageData(0, 0, W, PHOTO_H);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const t = lum / 255;
      d[i]     = SHADOW_R + (HIGH_R - SHADOW_R) * t;
      d[i + 1] = SHADOW_G + (HIGH_G - SHADOW_G) * t;
      d[i + 2] = SHADOW_B + (HIGH_B - SHADOW_B) * t;
    }
    offCtx.putImageData(imgData, 0, 0);

    ctx.drawImage(offC, 0, 0);

    // Fade inferior pro preto
    const fadeGrad = ctx.createLinearGradient(0, PHOTO_H - 200, 0, PHOTO_H);
    fadeGrad.addColorStop(0, "transparent");
    fadeGrad.addColorStop(1, DARK);
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(0, PHOTO_H - 200, W, 200);

    // Fade topo pra legibilidade do header
    const topFade = ctx.createLinearGradient(0, 0, 0, 180);
    topFade.addColorStop(0, "rgba(0,0,0,0.55)");
    topFade.addColorStop(1, "transparent");
    ctx.fillStyle = topFade;
    ctx.fillRect(0, 0, W, 180);
  }

  // Stripe lime lateral — altura completa
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.fillStyle = LIME;
  ctx.fillRect(0, 0, 10, H);
  ctx.restore();

  // Header: logo top-left + tag top-right (mesma estrutura do result card)
  const pLogo = await loadLogoColored("#FAFAFA");
  if (pLogo) {
    const lw = 140;
    const lh = pLogo.naturalHeight > 0 ? Math.round(lw * pLogo.naturalHeight / pLogo.naturalWidth) : 48;
    ctx.globalAlpha = 0.95;
    ctx.drawImage(pLogo, 40, 40, lw, lh);
    ctx.globalAlpha = 1;
  }

  const doneCount = Object.keys(profile.results).length;
  const total = PROFILE_DIMENSIONS.length;

  ctx.font = "700 14px 'Space Mono', 'Big Shoulders Display', Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillStyle = LIME;
  ctx.fillText(
    `PERFIL DE TUTOR · ${doneCount}/${total}`,
    W - 40, 60
  );

  // Nome grande, abaixo do header/foto
  const displayName = (profile.name || "TUTOR DRAGÃO").toUpperCase();
  let nameSize = 108;
  ctx.font = `800 ${nameSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
  const NAME_X = 56;
  const maxNameW = W - NAME_X - 48;
  while (ctx.measureText(displayName).width > maxNameW && nameSize > 56) {
    nameSize -= 4;
    ctx.font = `800 ${nameSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
  }
  const nameY = ownerImg ? PHOTO_H - 40 : 300;
  ctx.textAlign = "left";
  ctx.fillStyle = "#FAFAFA";
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = ownerImg ? 12 : 0;
  ctx.fillText(displayName, NAME_X, nameY);
  ctx.shadowBlur = 0;

  // Divisória lime sob o nome
  ctx.fillStyle = LIME;
  ctx.fillRect(NAME_X, nameY + 16, 100, 4);

  // Label "EU, NA REAL · N/8"
  ctx.font = "700 14px 'Space Mono', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = LIME;
  ctx.fillText(`EU, NA REAL · ${doneCount}/${total}`, NAME_X, nameY + 68);

  // MANCHETE — corpo no meio/baixo do 9:16
  const manchete = buildIdentityLines(profile, quizzes);

  const MCH_LEFT = NAME_X;
  const MCH_RIGHT = W - 48;
  const MCH_TOP = nameY + 110;
  const MCH_BOTTOM = H - FOOTER_H - 80;
  const MCH_HEIGHT = MCH_BOTTOM - MCH_TOP;
  const PREFIX_W = 110;
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
  // Em 9:16 há mais altura, então o tamanho máximo é maior.
  const labelSizeMax = 76;
  const labelSizeSingleLineMin = 32;
  const labelSizeHardMin = 26;
  const lineGap = 22;
  const pendingBlockH = manchete.length < total ? 56 : 0;

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
    ctx.font = `700 32px 'Bebas Neue', Arial, sans-serif`;
    ctx.fillStyle = "rgba(250,250,250,0.42)";
    ctx.textAlign = "left";
    ctx.fillText(
      `+ ${pending} ${pending === 1 ? "VERDADE" : "VERDADES"} POR DESCOBRIR`,
      LABEL_X, cursorY + 8
    );
  }

  // FOOTER LIME
  ctx.fillStyle = LIME;
  ctx.fillRect(0, H - FOOTER_H, W, FOOTER_H);

  ctx.fillStyle = DARK;
  ctx.font = "800 18px 'Big Shoulders Display', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(
    doneCount === total ? "PERFIL COMPLETO" : `${doneCount}/${total} DIMENSÕES`,
    36, H - 32
  );

  ctx.textAlign = "right";
  ctx.fillText("@COMIDADEDRAGAO  ·  COMIDADEDRAGAO.COM.BR", W - 36, H - 32);

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

// Frase pronta pra "manda pra um amigo / copiar"
// (a função recebe lines/profileName por compatibilidade, mas usa frase fixa)
const buildFriendTagText = (_lines: IdentityLine[], _profileName: string): string => {
  return `pet do futuro? talvez. ou só uma página muito doida que vale você ver — comidadedragao.com.br`;
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
    gateData?: { name: string; phone: string; photoUrl?: string | null }
  ) => void;
}

const QuizModal = ({ quiz, profile, onClose, onComplete }: QuizModalProps) => {
  const [phase, setPhase]         = useState<ModalPhase>("questions");
  const [stepIdx, setStepIdx]     = useState(0);
  // Feedback visual pós-resposta em quizzes de trivia (right/wrong)
  const [feedbackPick, setFeedbackPick] = useState<string | null>(null);
  const [answers, setAnswers]     = useState<string[]>([]);
  const [transitioning, setTrans] = useState(false);
  const [resultKey, setResultKey] = useState("");
  const [gateName, setGateName]   = useState(profile?.name || "");
  const [gatePhone, setGatePhone] = useState(profile?.phone || "");
  const [gateError, setGateError] = useState("");
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const [sharing, setSharing]     = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "ok" | "err">("idle");
  const [petPhotoFile, setPetPhotoFile] = useState<File | null>(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const petPhotoRef = useRef<HTMLInputElement>(null);

  const totalSteps = quiz.questions.length;
  const question = quiz.questions[stepIdx];
  const progressPct =
    phase === "questions" ? (stepIdx / totalSteps) * 100
    : phase === "gate"    ? 85
    : 100;

  const transition = useCallback((fn: () => void) => {
    setTrans(true);
    setTimeout(() => { fn(); setTrans(false); }, 160);
  }, []);

  // Quiz do tipo trivia: options com values 'right'/'wrong' nesta pergunta
  const isTriviaQuestion =
    !!question?.options.some((o) => o.value === "right" || o.value === "wrong");

  const selectAnswer = (value: string) => {
    // Bloqueia clicks extras durante feedback
    if (feedbackPick !== null) return;

    const next = [...answers];
    next[stepIdx] = value;
    setAnswers(next);

    const proceed = () => {
      if (stepIdx < totalSteps - 1) {
        transition(() => {
          setStepIdx((s) => s + 1);
          setFeedbackPick(null);
        });
      } else {
        const key = quiz.computeResult(next);
        setResultKey(key);
        setFeedbackPick(null);
        if (!profile) {
          transition(() => setPhase("gate"));
        } else {
          transition(() => setPhase("result"));
          onComplete(quiz.id, key);
        }
      }
    };

    if (isTriviaQuestion) {
      setFeedbackPick(value);
      window.setTimeout(proceed, 1500);
    } else {
      proceed();
    }
  };

  const submitGate = async () => {
    if (gateSubmitting) return;
    if (!gateName.trim()) { setGateError("Coloca seu nome 👆"); return; }
    if (!isValidPhone(gatePhone)) { setGateError("Telefone precisa ter DDD + número"); return; }
    setGateError("");

    // Resolve o resultado pra mandar junto pro Supabase
    const result = quiz.results[resultKey];

    // Snapshot completo dos resultados acumulados (pode ter quizzes anteriores
    // de uma sessão atual mesmo sem profile salvo, mas hoje só tem o atual)
    const allResults = profile?.results
      ? {
          ...profile.results,
          [quiz.id]: {
            quizId: quiz.id,
            resultKey,
            resultLabel: result?.label || "",
            profileLabel: result?.profileLabel || "",
            completedAt: new Date().toISOString(),
          },
        }
      : {
          [quiz.id]: {
            quizId: quiz.id,
            resultKey,
            resultLabel: result?.label || "",
            profileLabel: result?.profileLabel || "",
            completedAt: new Date().toISOString(),
          },
        };

    // Se a pessoa subiu foto, espera o upload terminar pra ter a URL
    // antes de inserir o lead. Se falhar, segue sem foto — nunca trava UX.
    let photoUrl: string | null = null;
    if (petPhotoFile) {
      setGateSubmitting(true);
      try {
        const { url } = await uploadProfilePhoto(petPhotoFile);
        photoUrl = url;
      } catch {
        photoUrl = null;
      } finally {
        setGateSubmitting(false);
      }
    }

    // Fire-and-forget: não esperamos a resposta pra continuar pro resultado.
    // Falhas são logadas no console (ver leads.ts) — UX não é afetada.
    void submitLead({
      phone: gatePhone,
      name: gateName,
      firstQuizId: quiz.id,
      firstQuizResultKey: resultKey,
      firstQuizResultLabel: result?.label || "",
      allResults,
      photoUrl,
    });

    transition(() => setPhase("result"));
    onComplete(quiz.id, resultKey, { name: gateName, phone: gatePhone, photoUrl });
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
                {question.options.map((opt, i) => {
                  const isPicked = feedbackPick === opt.value;
                  const showFeedback = feedbackPick !== null && isTriviaQuestion;
                  const isRight = opt.value === "right";
                  const isWrong = opt.value === "wrong";

                  let stateClass = "";
                  if (answers[stepIdx] === opt.value && !showFeedback) stateClass = " selected";
                  if (showFeedback) {
                    if (isRight) stateClass = " correct";
                    else if (isPicked && isWrong) stateClass = " incorrect";
                    else stateClass = " dimmed";
                  }

                  return (
                    <button
                      key={`${stepIdx}-${i}-${opt.value}`}
                      className={`qz-option${stateClass}`}
                      onClick={() => selectAnswer(opt.value)}
                      disabled={showFeedback}
                    >
                      <span className="qz-option-letter">{OPTION_LETTERS[i]}</span>
                      {stripEmoji(opt.text)}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── GATE ── */}
          {phase === "gate" && (
            <div className="qz-gate">
              <DragonLogo className="qz-gate-logo" />
              <div className="qz-gate-title">O DRAGÃO TEM SEU RESULTADO</div>
              <div className="qz-gate-sub">
                Deixa seu WhatsApp pra revelar —<br />
                tem coisa maneirona vindo pra você.
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
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(11) 91234-5678"
                  value={gatePhone}
                  onChange={(e) => setGatePhone(formatPhone(e.target.value))}
                  onKeyDown={(e) => { if (e.key === "Enter") void submitGate(); }}
                  maxLength={16}
                />

                {/* Foto opcional do tutor com o pet — sobe pro Supabase no submit */}
                <input
                  ref={petPhotoRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePetPhotoChange}
                />
                {petPhotoPreview ? (
                  <div className="qz-gate-photo-preview">
                    <img src={petPhotoPreview} alt="Foto com seu pet" />
                    <div className="qz-gate-photo-actions">
                      <button
                        type="button"
                        className="qz-gate-photo-link"
                        onClick={() => petPhotoRef.current?.click()}
                      >
                        Trocar
                      </button>
                      <button
                        type="button"
                        className="qz-gate-photo-link qz-gate-photo-remove"
                        onClick={removePetPhoto}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="qz-gate-photo-btn"
                    onClick={() => petPhotoRef.current?.click()}
                  >
                    📷 Adicionar foto sua com seu pet (opcional)
                  </button>
                )}

                {gateError && <span className="qz-gate-error">{gateError}</span>}
                <button
                  className={`qz-gate-btn${gateSubmitting ? " loading" : ""}`}
                  onClick={() => void submitGate()}
                  disabled={gateSubmitting}
                >
                  {gateSubmitting ? "SALVANDO FOTO…" : "REVELAR MEU RESULTADO"}
                </button>
                <span className="qz-gate-privacy">
                  O Dragão vai usar seu WhatsApp pra mandar drops,
                  achados e coisa maneirona — nunca spam.
                </span>
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {phase === "result" && result && (
            <div className="qz-result">
              <Confetti />

              {/* 1) DETALHES primeiro — pessoa lê o que ela é */}
              <div className="qz-result-details qz-result-details-top">
                <div className="qz-result-details-head">
                  <span className="qz-result-tag">SEU PERFIL</span>
                  <span className="qz-result-label" style={{ color: quiz.accent }}>
                    {result.label}
                  </span>
                </div>
                <p className="qz-result-desc">{result.description}</p>

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
              </div>

              {/* 2) CARD PREVIEW — peça de share, embaixo */}
              <div className="qz-result-share-block">
                <div className="qz-result-share-label">PRONTO PRA COMPARTILHAR</div>
                <div className="qz-result-card-preview">
                  <div className="qz-preview-stripe" />
                  <div className="qz-preview-head">
                    <DragonLogo className="qz-preview-logo-top" />
                    <span className="qz-preview-dim">
                      {(PROFILE_DIMENSIONS.find((d) => d.quizId === quiz.id)?.title || quiz.title).toUpperCase()}
                    </span>
                  </div>
                  <div className="qz-preview-statement">
                    {stripEmoji(result.manifestoLine || result.profileLabel).toUpperCase()}
                  </div>
                  <div
                    className="qz-preview-divider"
                    style={{ background: quiz.accent }}
                  />
                  <div className="qz-preview-foot">
                    <DragonLogo className="qz-preview-logo-bottom" />
                    <span className="qz-preview-handle">
                      @COMIDADEDRAGAO · COMIDADEDRAGAO.COM.BR
                    </span>
                  </div>
                </div>

                {/* 3) AÇÕES — share + foto + refazer */}
                <div className="qz-result-actions">
                  <button
                    className={`qz-share-btn${sharing ? " loading" : ""}${shareStatus === "ok" ? " ok" : ""}`}
                    onClick={handleShare}
                    disabled={sharing}
                  >
                    {sharing ? "GERANDO CARD…"
                      : shareStatus === "ok" ? "CARD GERADO!"
                      : "COMPARTILHAR ↗"}
                  </button>

                  <input
                    ref={petPhotoRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePetPhotoChange}
                  />
                  <button
                    className="qz-pet-change-btn"
                    onClick={() => petPhotoRef.current?.click()}
                  >
                    {petPhotoPreview ? "📷 Trocar foto do pet" : "📷 Adicionar foto do pet"}
                  </button>

                  <button className="qz-result-retry" onClick={retry}>
                    ← Refazer o quiz
                  </button>
                </div>
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
        {!disabled && completed && (
          <span className="quiz-card-meta quiz-card-meta-done">
            ✓ Refazer →
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
    (
      quizId: string,
      resultKey: string,
      gateData?: { name: string; phone: string; photoUrl?: string | null }
    ) => {
      const quiz = QUIZZES.find((q) => q.id === quizId);
      if (!quiz) return;
      const result = quiz.results[resultKey];
      if (!result) return;

      setProfile((prev) => {
        const base: DragonProfile = prev || {
          name: gateData?.name?.trim() || "Tutor Dragão",
          phone: gateData?.phone?.trim() || "",
          createdAt: new Date().toISOString(),
          results: {},
        };
        const updated: DragonProfile = {
          ...base,
          // Só sobrescreve photoUrl se o gate trouxe uma URL nova (não-null).
          // Mantém a foto antiga em re-runs do quiz que não anexam nova foto.
          ...(gateData?.photoUrl ? { photoUrl: gateData.photoUrl } : {}),
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
                {profile.phone && (
                  <div className="qz-profile-email">{formatPhone(profile.phone)}</div>
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

          </section>

          <div className="parceiros-divider" />
        </>
      )}

      {/* QUIZ GRID SECTION — header enxuto pra quem ainda não tem perfil
         (hero acima já apresenta os 8 quizzes — aqui só sinaliza a ação) */}
      {!profile && (
        <section className="qz-pick-header">
          <div className="qz-pick-header-tag">ESCOLHE TEU QUIZ ↓</div>
          <div className="qz-pick-header-line">
            o dragão <span>tá te observando.</span>
          </div>
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

      {/* MANCHETE DE IDENTIDADE + MARCA-UM-AMIGO
         Posicionada entre o grid e o CTA final: o grid é a AÇÃO (quizzes
         a fazer), a manchete é a RECOMPENSA (peça de share). Só aparece
         pra quem já tem ao menos 1 quiz respondido. */}
      {profile && completedCount > 0 && (() => {
        const lines = buildIdentityLines(profile, QUIZZES);
        const friendText = buildFriendTagText(lines, profile.name);
        const pending = totalDimensions - lines.length;

        return (
          <section className="qz-manchete-section">
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
          </section>
        );
      })()}

      {/* CTA FINAL */}
      <section className="parceiros-cta-final">
        <h2 className="parceiros-cta-final-titulo">
          {profile && completedCount === totalDimensions
            ? <>Curtiu? <span>Posta aí o resultado!</span></>
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
