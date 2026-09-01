import type { Dragao } from "@/data/dragoes";

/* ──────────────────────────────────────────────────────────────
   CARTEIRA DO GUARDIÃO — gerador no <canvas>, SEM IA.

   Desenha a carta 9:16 (1080×1920, nativo de Story) no estilo qsd8:
   janela de OS anos 90, barra de título "<DRAGAO>.EXE", foto limpa do pet,
   confissão em destaque e o painel STATUS com as barras de vida do TOP-4.

   ⚠️ PROVISÓRIO POR DESIGN. A Bianca já fez os 6 templates de colagem —
   quando eles chegarem, é ESTE arquivo que se troca: a página só chama
   gerarCarteira() e recebe um Blob. Nada da mecânica do quiz depende do
   desenho. Para trocar: manter a assinatura, trocar o corpo.

   Regras de arte que vêm do brief e não podem se perder:
   - Título SEM ACENTO (Press Start 2P não tem glifo acentuado) → dragao.nomePix.
   - Foto LIMPA: nada desenhado por cima do pet.
   - TOP-4 nas barras: 2 dragões ficam de fora, é o que faz a carta única.
   ────────────────────────────────────────────────────────────── */

const W = 1080;
const H = 1920;
const INK = "#240746";      /* roxo-preto (tema cf-pink) */
const PAPER = "#FFFDF5";    /* creme das janelas */
const PIX = '"Press Start 2P", monospace';
const SANS = '"Space Grotesk", system-ui, sans-serif';

export interface CarteiraInput {
  dragao: Dragao;
  top4: Array<{ dragao: Dragao; pontos: number }>;
  fotoFile: File | null;
  nomePet: string;
  numero: number;
}

/** Garante que as fontes já estão prontas — canvas não espera por webfont. */
async function esperarFontes() {
  if (typeof document === "undefined" || !document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`64px ${PIX}`),
      document.fonts.load(`24px ${PIX}`),
      document.fonts.load(`700 28px ${SANS}`),
    ]);
    await document.fonts.ready;
  } catch {
    /* sem webfont o canvas cai no monospace do sistema — feio, mas não quebra */
  }
}

/** Press Start 2P não tem glifo de maiúscula acentuada — tudo que for pixel passa por aqui. */
function semAcento(t: string): string {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image-load-failed"));
    img.src = src;
  });
}

/** Quebra texto em linhas que cabem em maxW, na fonte já setada no ctx. */
function quebrar(ctx: CanvasRenderingContext2D, texto: string, maxW: number): string[] {
  const palavras = texto.split(/\s+/);
  const linhas: string[] = [];
  let atual = "";
  palavras.forEach((p) => {
    const teste = atual ? `${atual} ${p}` : p;
    if (ctx.measureText(teste).width > maxW && atual) {
      linhas.push(atual);
      atual = p;
    } else {
      atual = teste;
    }
  });
  if (atual) linhas.push(atual);
  return linhas;
}

/** Retângulo com borda dura + sombra sólida deslocada (o "adesivo" do qsd8). */
function caixa(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  fill: string, borda = INK, sombra = 0, corSombra = INK
) {
  if (sombra) {
    ctx.fillStyle = corSombra;
    ctx.fillRect(x + sombra, y + sombra, w, h);
  }
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.lineWidth = 8;
  ctx.strokeStyle = borda;
  ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
}

export async function gerarCarteira(input: CarteiraInput): Promise<Blob> {
  const { dragao, top4, fotoFile, nomePet, numero } = input;
  await esperarFontes();

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-2d-context-unavailable");

  /* ── fundo: a cor do dragão ─────────────────────────────── */
  ctx.fillStyle = dragao.cor;
  ctx.fillRect(0, 0, W, H);

  /* dither leve, pra não ficar chapado */
  ctx.fillStyle = "rgba(255,255,255,.10)";
  for (let y = 0; y < H; y += 8) {
    for (let x = 0; x < W; x += 8) ctx.fillRect(x, y, 2, 2);
  }

  /* ── a janela ───────────────────────────────────────────── */
  const CX = 48, CY = 48, CW = W - 96, CH = H - 96;
  caixa(ctx, CX, CY, CW, CH, PAPER, INK, 0);

  /* barra de título */
  const TB = 92;
  ctx.fillStyle = PAPER;
  ctx.fillRect(CX + 8, CY + 8, CW - 16, TB);
  ctx.fillStyle = INK;
  ctx.fillRect(CX + 8, CY + TB + 4, CW - 16, 8);

  /* nome do arquivo, em caixa escura */
  const exe = `${dragao.nomePix.replace(/^O\s+/, "")}.EXE`;
  ctx.font = `26px ${PIX}`;
  const exeW = ctx.measureText(exe).width + 36;
  ctx.fillStyle = INK;
  ctx.fillRect(CX + 26, CY + 26, exeW, 56);
  ctx.fillStyle = dragao.cor;
  ctx.textBaseline = "middle";
  ctx.fillText(exe, CX + 44, CY + 55);

  /* listras + botões _ [] X */
  ctx.fillStyle = INK;
  for (let y = CY + 32; y < CY + 78; y += 8) {
    ctx.fillRect(CX + 40 + exeW, y, CW - 260 - exeW, 4);
  }
  ["_", "[]", "X"].forEach((b, i) => {
    const bx = CX + CW - 210 + i * 62;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5;
    ctx.strokeRect(bx, CY + 26, 52, 52);
    ctx.font = `18px ${PIX}`;
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.fillText(b, bx + 26, CY + 54);
    ctx.textAlign = "left";
  });

  /* ── a confissão — a frase que faz a pessoa compartilhar ──
     Vai em FAIXA na cor do dragão, não solta no creme: é a manchete
     do card, e é ela que a pessoa lê no feed antes de qualquer coisa. */
  ctx.font = `24px ${PIX}`;
  ctx.textAlign = "center";
  const confLinhas = quebrar(ctx, semAcento(dragao.confissao), CW - 160);
  const confH = confLinhas.length * 42 + 44;
  const confY = CY + TB + 34;
  ctx.fillStyle = dragao.cor;
  ctx.fillRect(CX + 26, confY, CW - 52, confH);
  ctx.lineWidth = 6;
  ctx.strokeStyle = INK;
  ctx.strokeRect(CX + 29, confY + 3, CW - 58, confH - 6);

  /* no amarelo do Devorador, texto branco some — só nele o texto é escuro */
  ctx.fillStyle = dragao.id === "devorador" ? INK : "#fff";
  let cy = confY + 44;
  confLinhas.forEach((l) => {
    ctx.fillText(l, W / 2, cy);
    cy += 42;
  });
  cy = confY + confH;

  /* ── a foto do pet — quadrada, limpa, sem nada por cima ── */
  const FS = CW - 120;
  const FX = CX + 60;
  const FY = cy + 26;
  ctx.fillStyle = dragao.corEscura;
  ctx.fillRect(FX, FY, FS, FS);
  if (fotoFile) {
    const url = URL.createObjectURL(fotoFile);
    try {
      const img = await carregarImagem(url);
      /* cover: preenche o quadrado sem distorcer */
      const escala = Math.max(FS / img.width, FS / img.height);
      const dw = img.width * escala;
      const dh = img.height * escala;
      ctx.save();
      ctx.beginPath();
      ctx.rect(FX, FY, FS, FS);
      ctx.clip();
      ctx.drawImage(img, FX + (FS - dw) / 2, FY + (FS - dh) / 2, dw, dh);
      ctx.restore();
    } catch {
      /* sem foto o card ainda sai — só fica o bloco de cor */
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  ctx.lineWidth = 8;
  ctx.strokeStyle = INK;
  ctx.strokeRect(FX + 4, FY + 4, FS - 8, FS - 8);

  /* ── nome do dragão + epíteto ───────────────────────────── */
  let ty = FY + FS + 78;
  ctx.font = `44px ${PIX}`;
  ctx.fillStyle = INK;
  ctx.fillText(semAcento(dragao.nomePix), W / 2, ty);

  ty += 56;
  ctx.font = `500 26px ${SANS}`;
  ctx.fillStyle = INK;
  quebrar(ctx, dragao.epiteto, CW - 160).forEach((l) => {
    ctx.fillText(l, W / 2, ty);
    ty += 34;
  });

  /* ── painel STATUS — barras de vida do TOP-4 ────────────── */
  ty += 26;
  ctx.textAlign = "left";
  const PX0 = CX + 60;
  const PW = CW - 120;
  ctx.font = `20px ${PIX}`;
  ctx.fillStyle = INK;
  ctx.fillText("STATUS", PX0, ty);
  ty += 34;

  const MAX = 6; /* 6 perguntas = teto do placar */
  top4.forEach(({ dragao: d, pontos }) => {
    ctx.font = `16px ${PIX}`;
    ctx.fillStyle = INK;
    ctx.fillText(semAcento(d.nomePix.replace(/^O\s+/, "")), PX0, ty + 14);

    const BX = PX0 + 300;
    const BW = PW - 300 - 70;
    const BH = 28;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 5;
    ctx.strokeRect(BX, ty, BW, BH);
    /* barra em blocos, não contínua — é 8-bit */
    const blocos = Math.round((pontos / MAX) * 12);
    for (let i = 0; i < blocos; i++) {
      ctx.fillStyle = d.cor;
      ctx.fillRect(BX + 8 + i * ((BW - 16) / 12), ty + 7, (BW - 16) / 12 - 4, BH - 14);
    }
    ctx.font = `18px ${PIX}`;
    ctx.fillStyle = INK;
    ctx.fillText(String(pontos), BX + BW + 22, ty + 22);
    ty += 52;
  });

  /* ── rodapé ─────────────────────────────────────────────────
     🔴 A URL é obrigatória, e não é enfeite de marca.
     Berger (Contágio, cap. Público): o resíduo comportamental só trabalha se
     ele mesmo disser onde ir — "produtos que se anunciam sozinhos". E a
     "viralidade valiosa": se a marca for detalhe removível, ela some na
     recontagem. Um card que circula sem endereço é alcance que não vira nada.
     (Vale encurtar o domínio: este é longo pra um rodapé de card.) */
  const RY = CY + CH - 92;
  ctx.font = `17px ${PIX}`;
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.fillText("CAVERNA.COMIDADEDRAGAO.COM.BR/QUAL-DRAGAO", W / 2, RY);

  const RY2 = CY + CH - 48;
  ctx.font = `18px ${PIX}`;
  ctx.textAlign = "left";
  ctx.fillText(semAcento((nomePet || "SEU DRAGAO").toUpperCase()).slice(0, 18), CX + 40, RY2);
  ctx.textAlign = "right";
  ctx.fillText(`No ${String(numero).padStart(3, "0")}`, CX + CW - 40, RY2);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas-toblob-failed"))),
      "image/png"
    );
  });
}
