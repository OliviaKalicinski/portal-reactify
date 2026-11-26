/* Bianca (29/10): o creator monta a arte do template da semana dentro do painel — sobe a foto do pet,
   confere o cupom e baixa a imagem pronta. Tudo acontece no aparelho dele: a foto não sai do celular.
   A ficha da Black November pede "uma página só para o creator subir a foto do pet e sair a peça no template" (Olivia, 26/10). */
import { useEffect, useRef, useState } from "react";

type Area = { x: number; y: number; w: number; h: number };
type Cupom = { x: number; y: number; largura: number; giro: number; tamanho: number };
type Formato = { rotulo: string; src: string; w: number; h: number; foto: Area; cupom: Cupom };
type Template = { nome: string; arquivo: string; formatos: Record<"story" | "feed", Formato> };

/* As imagens vêm do Canva da Bianca com a foto de exemplo (céu e colina) no lugar da foto.
   "foto" é o miolo da moldura lima, medido nas próprias imagens; "cupom" é o centro do selo de explosão. */
export const TEMPLATES: Record<string, Template> = {
  "black-friday": {
    nome: "Black Flyday",
    arquivo: "black-flyday",
    formatos: {
      story: { rotulo: "Story", src: "/assets/templates/black-flyday-story.webp", w: 1080, h: 1920,
        foto: { x: 122, y: 507, w: 830, h: 827 }, cupom: { x: 815, y: 1282, largura: 300, giro: -4.4, tamanho: 64 } },
      feed: { rotulo: "Feed", src: "/assets/templates/black-flyday-feed.webp", w: 1080, h: 1350,
        foto: { x: 122, y: 338, w: 838, h: 666 }, cupom: { x: 847, y: 926, largura: 262, giro: -4.4, tamanho: 56 } },
    },
  },
};

const carregar = (src: string) => new Promise<HTMLImageElement>((ok, falha) => {
  const img = new Image();
  img.onload = () => ok(img);
  img.onerror = falha;
  img.src = src;
});

/* O selo do cupom fica por cima da foto. Dentro da moldura, é selo o que for lima forte ou o contorno escuro;
   o resto (céu, nuvem e colina de exemplo) dá lugar à foto. */
const ehSelo = (r: number, g: number, b: number) => (g > 235 && b < 140 && r < 225) || r + g + b < 150;

/* Codex (30/10): trocar de formato ou digitar o cupom dispara montagens que terminam fora de ordem. "aindaVale"
   deixa só a última desenhar: sem isso a arte de uma escolha antiga podia aparecer por cima da atual. */
const montar = async (canvas: HTMLCanvasElement, f: Formato, foto: HTMLImageElement | null, cupom: string,
                      aindaVale: () => boolean) => {
  const base = await carregar(f.src);
  if (!aindaVale()) return;
  canvas.width = f.w; canvas.height = f.h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(base, 0, 0, f.w, f.h);

  if (foto) {
    const { x, y, w, h } = f.foto;
    /* foto em "cover": preenche a moldura toda, cortando o que sobra, centrada */
    const tmp = document.createElement("canvas");
    tmp.width = w; tmp.height = h;
    const t = tmp.getContext("2d")!;
    /* Codex (30/10): só o RGB da foto é copiado, então PNG com fundo transparente sairia preto. Fundo branco antes. */
    t.fillStyle = "#fff"; t.fillRect(0, 0, w, h);
    const escala = Math.max(w / foto.naturalWidth, h / foto.naturalHeight);
    const fw = foto.naturalWidth * escala, fh = foto.naturalHeight * escala;
    t.drawImage(foto, (w - fw) / 2, (h - fh) / 2, fw, fh);
    const daFoto = t.getImageData(0, 0, w, h).data;
    const miolo = ctx.getImageData(x, y, w, h);
    const p = miolo.data;
    for (let i = 0; i < p.length; i += 4) {
      if (!ehSelo(p[i], p[i + 1], p[i + 2])) { p[i] = daFoto[i]; p[i + 1] = daFoto[i + 1]; p[i + 2] = daFoto[i + 2]; }
    }
    ctx.putImageData(miolo, x, y);
  }

  /* cupom no selo, inclinado como o "seu cupom aqui" do Canva: rótulo pequeno e o código grande */
  const c = f.cupom;
  const codigo = (cupom.trim() || "SEU CUPOM").toUpperCase();
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.rotate((c.giro * Math.PI) / 180);
  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fonte = (px: number) => `900 ${px}px "Arial Black", "Archivo Black", Impact, sans-serif`;
  /* Olivia (30/10): o código TEM que caber no selo. Encolher a letra sozinho não bastava: a partir de 18 letras
     o código vazava para fora da explosão. Agora a letra encolhe até um piso legível e, se ainda passar, o texto
     é espremido na horizontal, que cabe sempre e continua alto o bastante para ler. */
  const escrever = (texto: string, y: number, tamanho: number, piso: number) => {
    let px = tamanho;
    ctx.font = fonte(px);
    while (ctx.measureText(texto).width > c.largura && px > piso) { px -= 2; ctx.font = fonte(px); }
    const medida = ctx.measureText(texto).width;
    ctx.save();
    if (medida > c.largura) ctx.scale(c.largura / medida, 1);
    ctx.fillText(texto, 0, y);
    ctx.restore();
  };
  const pequeno = Math.round(c.tamanho * 0.5);
  escrever("USE O CUPOM", -c.tamanho * 0.55, pequeno, Math.round(pequeno * 0.6));
  escrever(codigo, c.tamanho * 0.25, c.tamanho, Math.round(c.tamanho * 0.45));
  ctx.restore();
};

export const MontarTemplate = ({ template, cupomInicial, aoFechar }: { template: Template; cupomInicial: string; aoFechar: () => void }) => {
  const [formato, setFormato] = useState<"story" | "feed">("story");
  const [foto, setFoto] = useState<HTMLImageElement | null>(null);
  const [cupom, setCupom] = useState(cupomInicial);
  const [pronto, setPronto] = useState(false);
  const [problema, setProblema] = useState<string | null>(null);        // a foto que não abriu
  const [erroDaArte, setErroDaArte] = useState<string | null>(null);    // Codex (30/10): some quando a arte monta
  const tela = useRef<HTMLCanvasElement>(null);
  const caixa = useRef<HTMLDivElement>(null);
  const vezDaArte = useRef(0);
  const vezDaFoto = useRef(0);
  /* Codex (30/10): o painel refaz "aoFechar" a cada render (a lista de vídeos chega depois), e com ela na lista
     de dependências o efeito do foco rodava de novo e tirava o creator do campo do cupom no meio da digitação. */
  const fechar = useRef(aoFechar);
  fechar.current = aoFechar;
  const f = template.formatos[formato];
  const podeCompartilhar = typeof navigator !== "undefined" && "canShare" in navigator;

  useEffect(() => {
    if (!tela.current) return;
    const minhaVez = ++vezDaArte.current;
    const minha = () => minhaVez === vezDaArte.current;
    setPronto(false);
    montar(tela.current, f, foto, cupom, minha)
      .then(() => { if (minha()) { setPronto(true); setErroDaArte(null); } })
      .catch(() => { if (minha()) setErroDaArte("Não deu para montar a arte. Tente de novo."); });
  }, [f, foto, cupom]);

  /* Esc fecha; o foco começa dentro da janela, não escapa para a página atrás dela (Codex, 30/10) e volta
     para o botão que abriu quando ela fecha. */
  useEffect(() => {
    const voltarPara = document.activeElement as HTMLElement | null;
    const focaveis = () => [...(caixa.current?.querySelectorAll<HTMLElement>(
      'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])') ?? [])]
      .filter((e) => !e.hasAttribute("disabled") && e.offsetParent !== null);
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") { fechar.current(); return; }
      if (e.key !== "Tab") return;
      const lista = focaveis();
      if (lista.length === 0) return;
      const primeiro = lista[0], ultimo = lista[lista.length - 1];
      const agora = document.activeElement;
      if (e.shiftKey && (agora === primeiro || agora === caixa.current)) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && agora === ultimo) { e.preventDefault(); primeiro.focus(); }
    };
    window.addEventListener("keydown", tecla);
    caixa.current?.focus();
    return () => { window.removeEventListener("keydown", tecla); voltarPara?.focus?.(); };
    /* de propósito sem dependências: isto vale pela abertura e pelo fechamento da janela, não por cada render */
  }, []);

  /* Codex (30/10): escolher duas fotos seguidas podia deixar a primeira ganhar, por demorar mais a abrir;
     e o endereço temporário de cada foto nunca era liberado, acumulando memória no celular. */
  const escolherFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arq = e.target.files?.[0];
    if (!arq) return;
    setProblema(null);
    const minhaVez = ++vezDaFoto.current;
    const url = URL.createObjectURL(arq);
    carregar(url)
      .then((img) => { if (minhaVez === vezDaFoto.current) setFoto(img); })
      .catch(() => { if (minhaVez === vezDaFoto.current) setProblema("Essa foto não abriu. Tente outra (JPG ou PNG)."); })
      .finally(() => URL.revokeObjectURL(url));
  };

  const temCupom = cupom.trim().length > 0;
  const nomeArquivo = `${template.arquivo}-${formato}-${(cupom.trim() || "cupom").toLowerCase()}.png`;
  const comArquivo = (fazer: (arq: File) => void) =>
    tela.current?.toBlob((b) => { if (b) fazer(new File([b], nomeArquivo, { type: "image/png" })); }, "image/png");

  const baixar = () => comArquivo((arq) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(arq);
    a.download = arq.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  /* no celular, "Salvar ou compartilhar" abre a folha do sistema (salvar na galeria, mandar no Instagram) */
  const compartilhar = () => comArquivo((arq) => {
    if (!navigator.canShare?.({ files: [arq] })) { baixar(); return; }
    /* Codex (30/10): antes qualquer falha era lida como "fechou a folha" e a arte não chegava a lugar nenhum.
       Cancelar é silencioso; qualquer outro problema cai no download. */
    navigator.share({ files: [arq] }).catch((e: DOMException) => { if (e?.name !== "AbortError") baixar(); });
  });

  return (
    <div className="pc-tpl-fundo" onClick={(e) => { if (e.target === e.currentTarget) aoFechar(); }}>
      <div className="pc-tpl" role="dialog" aria-modal="true" aria-labelledby="pc-tpl-titulo" tabIndex={-1} ref={caixa}>
        <header className="pc-tpl-topo">
          <h2 id="pc-tpl-titulo">Sua arte <span>{template.nome}</span></h2>
          <button type="button" className="pc-tpl-fechar" onClick={aoFechar} aria-label="Fechar">×</button>
        </header>

        <div className="pc-tpl-corpo">
          <div className="pc-tpl-previa">
            <canvas ref={tela} aria-label={`Prévia da arte em formato ${f.rotulo}`} className={pronto ? "" : "carregando"} />
          </div>

          <div className="pc-tpl-passos">
            <fieldset className="pc-tpl-formato">
              <legend>1. Formato</legend>
              {(Object.keys(template.formatos) as ("story" | "feed")[]).map((k) => (
                <label key={k} className={formato === k ? "ativo" : ""}>
                  <input type="radio" name="pc-tpl-formato" value={k} checked={formato === k} onChange={() => setFormato(k)} />
                  {template.formatos[k].rotulo}
                </label>
              ))}
            </fieldset>

            <label className="pc-tpl-campo">
              <span>2. Foto do seu pet</span>
              <span className="pc-tpl-arquivo">
                {foto ? "Trocar a foto" : "Escolher a foto"}
                <input type="file" accept="image/*" onChange={escolherFoto} />
              </span>
              <small>A foto fica só no seu aparelho: ela não é enviada para a gente.</small>
            </label>

            <label className="pc-tpl-campo">
              <span>3. Seu cupom</span>
              <input type="text" value={cupom} maxLength={20} autoCapitalize="characters" spellCheck={false}
                onChange={(e) => setCupom(e.target.value.replace(/\s+/g, "").toUpperCase())} />
            </label>

            {(problema ?? erroDaArte) && <p className="pc-problema" role="alert">{problema ?? erroDaArte}</p>}

            <div className="pc-tpl-acoes">
              <button type="button" className="qsd8-btn" onClick={podeCompartilhar ? compartilhar : baixar} disabled={!foto || !pronto || !temCupom}>
                {podeCompartilhar ? "Salvar ou compartilhar" : "Baixar a imagem"}
              </button>
              {podeCompartilhar && (
                <button type="button" className="pc-link" onClick={baixar} disabled={!foto || !pronto || !temCupom}>baixar o arquivo</button>
              )}
              {/* Codex (30/10): sem cupom escrito a arte sai com "SEU CUPOM" no lugar do código, e dava para baixar assim */}
              {!foto && <small>Escolha a foto para liberar o download.</small>}
              {foto && !temCupom && <small>Escreva o seu cupom para liberar o download.</small>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
