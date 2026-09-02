import type { Dragao } from "@/data/dragoes";

/* ──────────────────────────────────────────────────────────────
   CARTEIRA DO GUARDIÃO — a foto do pet dentro do CARD DA BIANCA.

   O card é a arte dela, exportada do Canva ("Card Quizzes") com a copy v2 e a
   URL já corrigidas: /assets/quiz-cards/<dragao>.png, 1080×1920.
   Aqui não se desenha moldura, título nem texto — tudo isso já está na arte.
   O que este arquivo faz é só: colar a foto no lugar dela e os stickers por cima.

   🔴 A ORDEM DE DESENHO IMPORTA:
     1. o card inteiro   2. a foto sobre o slot   3. os stickers sobre a foto
   O slot é um retângulo de cor chapada no card — a foto o cobre por completo,
   e nada da arte passa por baixo dela.

   Se a Bianca reexportar os cards, é só trocar os PNGs. Se ela MOVER o slot,
   aí sim mexer em SLOT abaixo — os valores vieram lidos do arquivo dela, e são
   idênticos nos seis.
   ────────────────────────────────────────────────────────────── */

const W = 1080;
const H = 1920;

/* o quadro da foto no card, lido do Canva. `b` = a borda preta de 6px do
   retângulo, que fica DE FORA da foto pra moldura não sumir. */
const SLOT = { x: 80.88, y: 502.56, w: 931.07, h: 868.34, b: 6 };

/* 🔴 A FAIXA COMEÇA DENTRO DO SLOT. No card da Bianca a faixa preta do nome
   ("É O SOBERANO") e a caixa de texto ficam POR CIMA da parte de baixo do
   quadro da foto. Desenhar a foto no slot inteiro apagava a faixa — foi o
   primeiro defeito do teste. Por isso, depois da foto, tudo daqui pra baixo é
   redesenhado a partir do card original. */
const FAIXA_Y = 1302;

export interface CarteiraInput {
  dragao: Dragao;
  top4: Array<{ dragao: Dragao; pontos: number }>;
  fotoFile: File | null;
  nomePet: string;
  numero: number;
}

function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`falhou: ${src}`));
    img.src = src;
  });
}

/** Desenha `img` preenchendo o retângulo, cortando o excedente (object-fit: cover). */
function cover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number
) {
  const escala = Math.max(w / img.width, h / img.height);
  const dw = img.width * escala;
  const dh = img.height * escala;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.restore();
}

export async function gerarCarteira(input: CarteiraInput): Promise<Blob> {
  const { dragao, fotoFile } = input;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-2d-context-unavailable");

  /* 1 · o card da Bianca, inteiro */
  const card = await carregarImagem(`/assets/quiz-cards/${dragao.id}.webp`);
  ctx.drawImage(card, 0, 0, W, H);

  /* 2 · a foto do pet, dentro do slot (a borda preta fica de fora) */
  const fx = SLOT.x + SLOT.b;
  const fy = SLOT.y + SLOT.b;
  const fw = SLOT.w - SLOT.b * 2;
  const fh = SLOT.h - SLOT.b * 2;
  /* área REALMENTE visível: o resto do slot vive atrás da faixa */
  const vh = FAIXA_Y - fy;

  if (fotoFile) {
    const url = URL.createObjectURL(fotoFile);
    try {
      const foto = await carregarImagem(url);
      cover(ctx, foto, fx, fy, fw, fh);
      /* devolve faixa, texto e rodapé por cima da foto */
      ctx.drawImage(card, 0, FAIXA_Y, W, H - FAIXA_Y, 0, FAIXA_Y, W, H - FAIXA_Y);
    } catch {
      /* sem foto o card ainda sai — fica o quadro de cor do próprio card */
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  /* 3 · A CAMADA DE STICKERS — a página par do Canva, INTEIRA, por cima.
     A Bianca já posicionou os stickers lá; a composição é dela, não minha.
     Aqui só se tira o branco (o alpha foi feito por código, ver
     extrair-stickers-do-canva.py) e se sobrepõe alinhado, 1080×1920 sobre
     1080×1920. Se ela mover um sticker, basta reexportar o PNG. */
  try {
    const overlay = await carregarImagem(`/assets/quiz-overlay/${dragao.id}.webp`);
    ctx.drawImage(overlay, 0, 0, W, H);
  } catch {
    /* sem a camada de sticker a carteira ainda sai — só mais sóbria */
  }

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas-toblob-failed"))),
      "image/png"
    );
  });
}
