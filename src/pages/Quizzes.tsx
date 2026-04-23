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
  const TOP_H = 420; // zona da foto / headline

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

  // ── Zona topo: foto duotone lime ou fundo neutro
  if (ownerImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, S, TOP_H);
    ctx.clip();

    const offC = document.createElement("canvas");
    offC.width = S; offC.height = TOP_H;
    const offCtx = offC.getContext("2d")!;
    const iw = ownerImg.naturalWidth, ih = ownerImg.naturalHeight;
    const sc = Math.max(S / iw, TOP_H / ih);
    const dw = iw * sc, dh = ih * sc;
    offCtx.drawImage(ownerImg, (S - dw) / 2, (TOP_H - dh) / 2, dw, dh);
    const imgData = offCtx.getImageData(0, 0, S, TOP_H);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      d[i] = d[i + 1] = d[i + 2] = g;
    }
    offCtx.putImageData(imgData, 0, 0);
    ctx.drawImage(offC, 0, 0);
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = LIME;
    ctx.fillRect(0, 0, S, TOP_H);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.restore();

    // Fade inferior pro preto
    const fadeGrad = ctx.createLinearGradient(0, TOP_H - 140, 0, TOP_H);
    fadeGrad.addColorStop(0, "transparent");
    fadeGrad.addColorStop(1, DARK);
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(0, 0, S, TOP_H);

    // Fade topo pra legibilidade
    const topFade = ctx.createLinearGradient(0, 0, 0, 120);
    topFade.addColorStop(0, "rgba(0,0,0,0.55)");
    topFade.addColorStop(1, "transparent");
    ctx.fillStyle = topFade;
    ctx.fillRect(0, 0, S, 120);
  } else {
    // Sem foto: sutil glow lime
    const pglow = ctx.createRadialGradient(S / 2, TOP_H * 0.4, 0, S / 2, TOP_H * 0.4, S * 0.45);
    pglow.addColorStop(0, "#7BFF0018");
    pglow.addColorStop(1, "transparent");
    ctx.fillStyle = pglow;
    ctx.fillRect(0, 0, S, TOP_H);
  }

  // ── Accent stripe lateral lime
  ctx.fillStyle = LIME;
  ctx.fillRect(0, 0, 8, S);

  // ── Logo top-left
  const pLogo = await loadLogoColored("#FAFAFA");
  if (pLogo) {
    const lw = 128;
    const lh = pLogo.naturalHeight > 0 ? Math.round(lw * pLogo.naturalHeight / pLogo.naturalWidth) : 44;
    ctx.globalAlpha = 0.92;
    ctx.drawImage(pLogo, 30, 28, lw, lh);
    ctx.globalAlpha = 1;
  }

  // ── Tag "PERFIL DE TUTOR" top-right
  ctx.font = "800 12px 'Big Shoulders Display', Arial, sans-serif";
  ctx.textAlign = "right";
  const ptag = "PERFIL DE TUTOR · SUPER TRUNFO";
  ctx.fillStyle = "rgba(123,255,0,0.92)";
  ctx.fillText(ptag, S - 30, 46);

  // ── Nome grande (center, sobrepõe foto)
  const displayName = (profile.name || "TUTOR DRAGÃO").toUpperCase();
  let nameSize = 96;
  ctx.font = `800 ${nameSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
  const maxNameW = S - 140;
  while (ctx.measureText(displayName).width > maxNameW && nameSize > 48) {
    nameSize -= 4;
    ctx.font = `800 ${nameSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
  }
  const nameY = ownerImg ? TOP_H - 24 : TOP_H - 60;
  ctx.textAlign = "center";
  ctx.fillStyle = "#FAFAFA";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = ownerImg ? 10 : 0;
  ctx.fillText(displayName, S / 2, nameY);
  ctx.shadowBlur = 0;

  // ── Divisória accent sob o nome
  ctx.strokeStyle = LIME;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(S / 2 - 48, nameY + 14);
  ctx.lineTo(S / 2 + 48, nameY + 14);
  ctx.stroke();

  // ─────────────────────────────────────────────────────────────────────
  // STATS SUPER TRUNFO — 8 linhas com barra + valor
  // ─────────────────────────────────────────────────────────────────────
  const STATS_Y_START = TOP_H + 40;
  const STATS_Y_END = S - 92;
  const ROW_H = (STATS_Y_END - STATS_Y_START) / PROFILE_DIMENSIONS.length;
  const PAD_X = 72;
  const VAL_COL = 120; // largura reservada pra coluna do valor
  const BAR_W = S - PAD_X * 2 - VAL_COL;
  const BAR_X = PAD_X;
  const VAL_X = S - PAD_X;

  // Linha separadora accent acima das stats
  ctx.strokeStyle = "rgba(123,255,0,0.28)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD_X, STATS_Y_START - 18);
  ctx.lineTo(S - PAD_X, STATS_Y_START - 18);
  ctx.stroke();

  PROFILE_DIMENSIONS.forEach((dim, i) => {
    const rowY = STATS_Y_START + i * ROW_H;
    const pr = profile.results[dim.quizId];
    const quiz = quizzes.find((q) => q.id === dim.quizId);
    const done = pr && quiz;
    const accentColor = quiz?.accent || "#FFFFFF";

    // Valor agregado: média dos stats do resultado (fallback 0)
    let aggregate = 0;
    if (done) {
      const res = quiz!.results[pr!.resultKey];
      const stats = res?.stats ?? [];
      if (stats.length > 0) {
        aggregate = Math.round(
          stats.reduce((s, st) => s + (st.value || 0), 0) / stats.length
        );
      }
    }

    // Dimension title (esquerda, topo da linha)
    ctx.font = "700 13px 'Big Shoulders Display', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = done ? "rgba(250,250,250,0.88)" : "rgba(255,255,255,0.32)";
    ctx.fillText(dim.title.toUpperCase(), BAR_X, rowY + 16);

    // Resultado curto (label do quiz) abaixo do título — só se completou
    if (done) {
      const res = quiz!.results[pr!.resultKey];
      const resLabel = stripEmoji(res?.label || pr!.resultLabel || "").toUpperCase();
      ctx.font = "500 11px 'Space Grotesk', Arial, sans-serif";
      ctx.fillStyle = accentColor + "CC";
      const trimmed = resLabel.length > 36 ? resLabel.slice(0, 36) + "…" : resLabel;
      ctx.fillText(trimmed, BAR_X, rowY + 34);
    } else {
      ctx.font = "500 11px 'Space Grotesk', Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.20)";
      ctx.fillText("A RESPONDER", BAR_X, rowY + 34);
    }

    // Barra de progresso
    const barY = rowY + ROW_H - 16;
    const barH = 4;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(BAR_X, barY, BAR_W, barH);
    if (done) {
      ctx.fillStyle = accentColor;
      ctx.fillRect(BAR_X, barY, BAR_W * (aggregate / 100), barH);
    }

    // Valor numérico grande à direita
    const numSize = Math.min(52, ROW_H - 14);
    ctx.font = `800 ${numSize}px 'Bebas Neue', 'Big Shoulders Display', Arial, sans-serif`;
    ctx.textAlign = "right";
    if (done) {
      ctx.fillStyle = accentColor;
      ctx.fillText(String(aggregate), VAL_X, rowY + ROW_H - 10);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillText("—", VAL_X, rowY + ROW_H - 10);
    }
  });

  // ─────────────────────────────────────────────────────────────────────
  // FOOTER LIME
  // ─────────────────────────────────────────────────────────────────────
  const FOOTER_H = 72;
  ctx.fillStyle = LIME;
  ctx.fillRect(0, S - FOOTER_H, S, FOOTER_H);

  const doneCount = Object.keys(profile.results).length;
  const total = PROFILE_DIMENSIONS.length;

  ctx.fillStyle = DARK;
  ctx.font = "800 16px 'Big Shoulders Display', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(
    doneCount === total ? "PERFIL COMPLETO" : `${doneCount}/${total} DIMENSÕES`,
    30, S - 30
  );

  ctx.textAlign = "right";
  ctx.fillText("@COMIDADEDRAGAO  ·  COMIDADEDRAGAO.COM.BR", S - 30, S - 30);

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
// AGGREGATE STATS — reúne stats cross-quiz por label, calcula média
// ─────────────────────────────────────────────────────────────────────────────

interface AggregateStat {
  label: string;
  value: number;
  samples: number;
}

const computeAggregateStats = (
  profile: DragonProfile,
  quizzes: QuizDef[],
  limit = 4
): AggregateStat[] => {
  const bucket: Record<string, { total: number; count: number }> = {};

  for (const quizId of Object.keys(profile.results)) {
    const pr = profile.results[quizId];
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) continue;
    const res = quiz.results[pr.resultKey];
    if (!res?.stats) continue;
    for (const st of res.stats) {
      const key = st.label.toUpperCase();
      if (!bucket[key]) bucket[key] = { total: 0, count: 0 };
      bucket[key].total += st.value || 0;
      bucket[key].count += 1;
    }
  }

  const entries: AggregateStat[] = Object.entries(bucket).map(([label, v]) => ({
    label,
    value: v.count > 0 ? Math.round(v.total / v.count) : 0,
    samples: v.count,
  }));

  // Ordena: primeiro por nº de samples (mais frequentes), depois por valor
  entries.sort((a, b) => (b.samples - a.samples) || (b.value - a.value));

  return entries.slice(0, limit);
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
          <section className="parceiros-secao">
            <div className="parceiros-tag tag-orange">teu perfil</div>
            <h2 className="parceiros-secao-titulo titulo-orange">
              Olá, <span>{profile.name}</span>
            </h2>
          </section>

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
                  {completedCount === totalDimensions ? "PERFIL COMPLETO" : "DIMENSÕES RESPONDIDAS"}
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

            {/* ── STATS AGREGADAS ──────────────────────────── */}
            {completedCount > 0 && (() => {
              const aggregates = computeAggregateStats(profile, QUIZZES, 4);
              if (aggregates.length === 0) return null;
              return (
                <div className="qz-aggregates">
                  <div className="qz-aggregates-label">ESTATÍSTICAS AGREGADAS</div>
                  <div className="qz-aggregates-grid">
                    {aggregates.map((a) => (
                      <div key={a.label} className="qz-agg-card">
                        <div className="qz-agg-head">
                          <div className="qz-agg-name">{a.label}</div>
                          <div className="qz-agg-value">{a.value}</div>
                        </div>
                        <div className="qz-agg-bar">
                          <div
                            className="qz-agg-bar-fill"
                            style={{ width: `${Math.max(4, a.value)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </section>

          <div className="parceiros-divider" />
        </>
      )}

      {/* QUIZ GRID SECTION */}
      <section className="parceiros-secao">
        <div className="parceiros-tag tag-green">
          {profile ? "continue teu perfil" : "monta teu perfil"}
        </div>
        <h2 className="parceiros-secao-titulo titulo-green">
          {profile
            ? <>Faltam <span>{Math.max(0, totalDimensions - completedCount)}</span> dimensões</>
            : <>{totalDimensions} quizzes, <span>{totalDimensions} dimensões</span></>}
        </h2>
      </section>

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
            ? <>Teu perfil tá <span>completo!</span></>
            : profile
              ? <>Completa teu <span>perfil</span></>
              : <>Começa pelo <span>primeiro quiz</span></>}
        </h2>
        <p className="parceiros-cta-final-sub">
          {profile && completedCount === totalDimensions
            ? "Gera teu card de perfil e compartilha com a matilha. O Dragão já te conhece inteiro."
            : profile
              ? "Ainda tem quizzes pra responder. Cada resposta monta mais uma dimensão do teu perfil de tutor."
              : `Oito quizzes curtos, oito dimensões do teu perfil. No final, um card pronto pra compartilhar.`}
        </p>
        {profile && completedCount === totalDimensions ? (
          <button
            className={`parceiros-btn-primary${sharingProfile ? " loading" : ""}`}
            onClick={handleShareProfile}
            disabled={sharingProfile}
          >
            {sharingProfile ? "Gerando card…" : "Compartilhar perfil ↗"}
          </button>
        ) : (
          <a href="#quiz-grid" className="parceiros-btn-primary">
            {profile ? "Ver quizzes restantes ↓" : "Escolher um quiz ↓"}
          </a>
        )}
        <p className="parceiros-cta-final-note">
          Sem cadastro obrigatório — só no final do primeiro quiz.
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
