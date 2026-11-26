import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import "./ListaJanelas.css";

/**
 * LISTA EM JANELINHAS — a lista de arquivo (papers, matérias) no estilo das janelas,
 * clonada da ficha de produto da /produtos (15/10 e 21/10/2026): filtros em cima,
 * cartões coloridos em grade (3 por linha no computador, 2 no celular) e a ficha
 * abrindo numa janela clara por cima da página.
 *
 * Substitui o StripeList (faixas pretas com modal escuro), que era o estilo antigo.
 * As classes `pj-*` e `produtos-filtro*` vêm do ProdutosJanelas.css e do Produtos.css:
 * quem usa este componente importa os dois, como a /produtos faz.
 */

export interface ItemLista {
  id: string | number;
  category: string;
  title: string;
  shortTitle?: string;  // título curto do cartão (sem ele, o título inteiro)
  summary: string;
  meta?: string;        // ex.: "Exame · Matéria"
  href: string;
}

interface Props {
  items: ItemLista[];
  /** cor de fundo do cartão, por categoria */
  colors: Record<string, string>;
  /** texto do botão que abre o link de fora */
  openLabel?: string;
  /** mostra os filtros por categoria (só vale a pena na lista grande) */
  filtros?: boolean;
  /** nome da janela da ficha, no estilo ARQUIVO.TXT */
  fichaNome?: string;
  emptyMessage?: string;
}

const ListaJanelas = ({
  items,
  colors,
  openLabel = "Abrir ↗",
  filtros = false,
  fichaNome = "FICHA.TXT",
  emptyMessage = "Nada pra mostrar.",
}: Props) => {
  const [filtro, setFiltro] = useState<string>("todas");
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const fecharRef = useRef<HTMLButtonElement>(null);
  const abriuDe = useRef<HTMLElement | null>(null);

  const categorias = useMemo(() => {
    const vistas: string[] = [];
    items.forEach((i) => { if (!vistas.includes(i.category)) vistas.push(i.category); });
    return vistas;
  }, [items]);

  const listados = useMemo(
    () => (filtro === "todas" ? items : items.filter((i) => i.category === filtro)),
    [items, filtro]
  );

  const active = useMemo(() => items.find((i) => i.id === activeId) ?? null, [items, activeId]);

  const abrir = useCallback((id: string | number) => {
    abriuDe.current = document.activeElement as HTMLElement | null;
    setActiveId(id);
  }, []);
  const fechar = useCallback(() => {
    setActiveId(null);
    // devolve o foco ao cartão que abriu a ficha
    setTimeout(() => abriuDe.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      const h = (e: KeyboardEvent) => { if (e.key === "Escape") fechar(); };
      document.addEventListener("keydown", h);
      fecharRef.current?.focus();
      return () => {
        document.removeEventListener("keydown", h);
        document.body.style.overflow = "";
      };
    }
  }, [active, fechar]);

  if (items.length === 0) return <p className="lj-vazio">{emptyMessage}</p>;

  const indiceNaLista = active ? items.findIndex((i) => i.id === active.id) + 1 : 0;

  return (
    <>
      {filtros && categorias.length > 1 && (
        <div className="produtos-filtros lj-filtros">
          <button
            type="button"
            className={`produtos-filtro${filtro === "todas" ? " active" : ""}`}
            onClick={() => setFiltro("todas")}
          >
            Todas <span className="produtos-filtro-count">{items.length}</span>
          </button>
          {categorias.map((c) => (
            <button
              type="button"
              key={c}
              className={`produtos-filtro${filtro === c ? " active" : ""}`}
              onClick={() => setFiltro(c)}
            >
              {c} <span className="produtos-filtro-count">{items.filter((i) => i.category === c).length}</span>
            </button>
          ))}
        </div>
      )}

      <div className="lj-grid">
        {/* o número é a posição na lista inteira, não na filtrada: é o mesmo que a ficha mostra */}
        {listados.map((it) => (
          <button
            type="button"
            key={it.id}
            className="lj-card"
            /* fundo neutro: a cor da categoria entra só como marca na lateral e no ponto,
               porque sobre o rosa e o laranja cheios o texto ficava difícil de ler */
            style={{ "--lj-cor": colors[it.category] ?? "#FFCC00" } as React.CSSProperties}
            onClick={() => abrir(it.id)}
            aria-label={`Abrir: ${it.title}`}
          >
            <span className="lj-card-num">{String(items.indexOf(it) + 1).padStart(2, "0")}</span>
            <span className="lj-card-cat"><i className="lj-card-ponto" aria-hidden="true" />{it.category}</span>
            <span className="lj-card-title">{it.shortTitle ?? it.title}</span>
            {it.meta && <span className="lj-card-meta">{it.meta}</span>}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="pj-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) fechar(); }}
        >
          <section
            className="qsd8-win pj-ficha lj-ficha"
            style={{ "--lj-cor": colors[active.category] ?? "#FFCC00" } as React.CSSProperties}
            role="dialog" aria-modal="true" aria-label={active.title}
          >
            <div className="qsd8-titlebar">
              <span className="qsd8-mac-dots" aria-hidden="true"><i /><i /></span>
              <span className="qsd8-tb-name">{fichaNome}</span>
              <span className="qsd8-tb-stripes" aria-hidden="true" />
              <button type="button" ref={fecharRef} className="pj-fechar" onClick={fechar} aria-label="Fechar">×</button>
            </div>
            <div className="qsd8-win-body">
              <div className="qsd8-eyebrow lj-ficha-cat">
                <i className="lj-card-ponto" aria-hidden="true" />
                {active.category} · {String(indiceNaLista).padStart(2, "0")}
              </div>
              <h2 className="qsd8-h2 pj-nome">{active.shortTitle ?? active.title}</h2>
              {active.meta && <p className="pj-variante">{active.meta}</p>}
              <div className="pj-secao lj-ficha-secao">
                <h3 className="pj-secao-titulo">Do que se trata</h3>
                <p className="lj-ficha-titulo">{active.title}</p>
                <p className="lj-ficha-resumo">{active.summary}</p>
              </div>
              <div className="qsd8-btnrow lj-ficha-btns">
                <a href={active.href} target="_blank" rel="noopener noreferrer" className="qsd8-btn lj-ficha-btn">
                  {openLabel}
                </a>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ListaJanelas;
