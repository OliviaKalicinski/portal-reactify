/* Modo de arrastar peças da página, só na prévia local (localhost) e com ?editar na URL.
   Criado em 06/11/2026 a pedido da Olivia ("deixar isso editável para eu mexer de lugar").
   Cada peça arrastada ganha um deslocamento (propriedade CSS `translate`, que não briga com o
   `transform: rotate` das peças tortas). O painel mostra os números para eu gravar no CSS;
   no ar este código não faz nada.
   06/11 (Olivia: "dar para girar os elementos e diminuir e aumentar"): clicar numa peça a escolhe;
   os botões da barrinha giram e mudam o tamanho dela, e a rodinha do mouse também
   (rodinha = tamanho; shift + rodinha = girar). Usa as propriedades `rotate` e `scale`. */

type Peca = { x: number; y: number; r?: number; s?: number };
type Posicoes = Record<string, Peca>;

const NOMES: Record<string, string> = {
  ".bn-logo": "logo", ".bng-titulo": "25% OFF", ".bng-eyebrow": "só para gatos", ".bng-foto": "pote",
  ".bn-preco-topo": "preço", ".bn-cta-texto": "botão", ".bng-gato": "gatinho", ".bn-nuvem": "nuvem", ".bng-taurina": "rico em taurina",
};

export function ligarEditorPosicoes(seletores: string[], chave: string) {
  if (typeof window === "undefined") return () => {};
  const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (!local || !new URLSearchParams(window.location.search).has("editar")) return () => {};

  const tela = () => (window.innerWidth >= 900 ? "computador" : "celular");
  const guardado = () => `editor-posicoes:${chave}:${tela()}`;
  let pos: Posicoes = {};
  try { pos = JSON.parse(localStorage.getItem(guardado()) || "{}"); } catch { pos = {}; }

  const painel = document.createElement("div");
  painel.style.cssText =
    "position:fixed;right:8px;top:8px;z-index:99999;background:#000;color:#81fb5a;font:11px/1.3 monospace;" +
    "padding:5px 8px;border:1px solid #81fb5a;border-radius:6px;max-width:260px;white-space:pre-wrap;display:flex;gap:6px;align-items:center;flex-wrap:wrap";
  // 06/11 (Olivia: "esse quadro preto" tapava a página): fica pequeno no canto; os números só abrem se pedir
  let aberto = false;
  const botao = (txt: string, fn: () => void) => {
    const b = document.createElement("button");
    b.textContent = txt; b.onclick = fn;
    b.style.cssText = "background:#81fb5a;color:#000;border:0;padding:2px 6px;cursor:pointer;font:inherit";
    return b;
  };

  // peça sem nada guardado parte de onde o CSS gravado já a deixou (posição, giro e tamanho salvos)
  const atual = (el: HTMLElement): Peca => {
    const cs = getComputedStyle(el);
    const [tx, ty] = (cs.translate === "none" ? "0px 0px" : cs.translate).split(" ").map((v) => parseFloat(v) || 0);
    const r = cs.rotate === "none" ? 0 : parseFloat(cs.rotate) || 0;
    const sc = cs.scale === "none" ? 1 : parseFloat(cs.scale) || 1;
    return { x: tx, y: ty ?? 0, r, s: sc };
  };
  let escolhida: { el: HTMLElement; id: string } | null = null;
  const guardar = () => { try { localStorage.setItem(guardado(), JSON.stringify(pos)); } catch { /* sem armazenamento: só não lembra */ } };
  const mexer = (dr: number, ds: number) => {
    if (!escolhida) return;
    const p = pos[escolhida.id] || atual(escolhida.el);
    p.r = Math.round(((p.r || 0) + dr) * 10) / 10;
    p.s = Math.max(0.2, Math.round(((p.s ?? 1) + ds) * 100) / 100);
    pos[escolhida.id] = p; pintar(escolhida.el, p); guardar(); atualizarPainel();
  };
  const atualizarPainel = () => {
    painel.textContent = `editar (${tela()}) · ${Object.keys(pos).length} mexida(s)`;
    if (escolhida) {
      const nome = document.createElement("span");
      const [sel, n] = escolhida.id.split("#");
      nome.textContent = ` · escolhida: ${NOMES[sel] ? NOMES[sel] + (sel === ".bn-nuvem" ? ` ${Number(n) + 1}` : "") : escolhida.id}`;
      painel.appendChild(nome);
      painel.appendChild(botao("⟲ girar", () => mexer(-2, 0)));
      painel.appendChild(botao("girar ⟳", () => mexer(2, 0)));
      painel.appendChild(botao("menor", () => mexer(0, -0.05)));
      painel.appendChild(botao("maior", () => mexer(0, 0.05)));
    } else {
      const dica = document.createElement("span");
      dica.textContent = " · clique numa peça para girar ou mudar o tamanho";
      painel.appendChild(dica);
    }
    painel.appendChild(botao(aberto ? "esconder números" : "números", () => { aberto = !aberto; atualizarPainel(); }));
    painel.appendChild(botao("desfazer tudo", () => { pos = {}; localStorage.removeItem(guardado()); aplicar(); atualizarPainel(); }));
    if (aberto) {
      const pre = document.createElement("div");
      pre.style.cssText = "flex-basis:100%;max-height:40vh;overflow:auto";
      pre.textContent = Object.keys(pos).length ? JSON.stringify(pos, null, 1) : "nada mexido ainda";
      painel.appendChild(pre);
    }
  };
  document.body.appendChild(painel);

  const elementos = () => seletores.flatMap((s) => [...document.querySelectorAll<HTMLElement>(s)].map((el, i) => ({ el, id: `${s}#${i}` })));
  const pintar = (el: HTMLElement, p?: Peca) => {
    el.style.translate = p ? `${p.x}px ${p.y}px` : "";
    el.style.rotate = p?.r ? `${p.r}deg` : "";
    el.style.scale = p?.s && p.s !== 1 ? `${p.s}` : "";
  };
  const aplicar = () => elementos().forEach(({ el, id }) => pintar(el, pos[id]));

  const limpar: Array<() => void> = [];
  elementos().forEach(({ el, id }) => {
    el.style.pointerEvents = "auto"; el.style.cursor = "move"; el.style.outline = "1px dashed rgba(0,0,0,.5)";
    el.style.touchAction = "none"; el.style.userSelect = "none";
    const bloquearClique = (e: Event) => e.preventDefault();
    el.addEventListener("click", bloquearClique, true);
    el.querySelectorAll("img").forEach((img) => (img.draggable = false));
    const down = (e: PointerEvent) => {
      e.preventDefault(); e.stopPropagation(); el.setPointerCapture(e.pointerId);
      if (escolhida) escolhida.el.style.outline = "1px dashed rgba(0,0,0,.5)";
      escolhida = { el, id }; el.style.outline = "2px solid #81fb5a";
      const ini = { x: e.clientX, y: e.clientY }, base = { ...(pos[id] || atual(el)) };
      // se a peça está dentro de algo com `zoom` (o topo do celular encolhe em proporção), o
      // arrasto na tela vale menos ou mais px dentro dela
      let z = 1;
      for (let n: HTMLElement | null = el.parentElement; n; n = n.parentElement) z *= parseFloat(getComputedStyle(n).zoom) || 1;
      const move = (m: PointerEvent) => {
        pos[id] = { ...base, x: Math.round(base.x + (m.clientX - ini.x) / z), y: Math.round(base.y + (m.clientY - ini.y) / z) };
        pintar(el, pos[id]);
      };
      const up = () => {
        el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up);
        guardar(); atualizarPainel();
      };
      el.addEventListener("pointermove", move); el.addEventListener("pointerup", up);
    };
    const roda = (w: WheelEvent) => {
      w.preventDefault(); escolhida = { el, id };
      if (w.shiftKey) mexer((w.deltaY || w.deltaX) > 0 ? 2 : -2, 0); else mexer(0, w.deltaY > 0 ? -0.03 : 0.03);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("wheel", roda, { passive: false });
    limpar.push(() => { el.removeEventListener("pointerdown", down); el.removeEventListener("wheel", roda); el.removeEventListener("click", bloquearClique, true); });
  });
  aplicar(); atualizarPainel();
  return () => { limpar.forEach((f) => f()); painel.remove(); };
}
