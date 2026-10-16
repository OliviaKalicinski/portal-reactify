import { useEffect } from "react";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import "./Halloween.css";

/* ──────────────────────────────────────────────────────────────
   /halloween · "Larvas e Travessuras" (19 a 31/10/2026)
   Página de VENDA da promoção de Halloween: compre um kit e ganhe um suplemento.
   Visual do cartão-postal da campanha (Canva), peças em /assets/halloween/.

   RASCUNHO (16/10/2026), não está no ar:
   - Quais kits entram ainda não foi decidido: estão os 8 kits ativos na Shopify
     (preços lidos em 16/10). Tirar da lista KITS os que não entrarem.
   - O carrinho de cada kit COM o suplemento de brinde ainda não existe na Yampi.
     Enquanto `carrinho` estiver vazio, o botão fica desligado ("carrinho em preparo").
     Não apontar para o carrinho do kit sem o brinde: a página prometeria algo
     que o checkout não entrega.
   - Qual suplemento vai de brinde e a validade do lote: a confirmar (ficha da campanha).
   ────────────────────────────────────────────────────────────── */

const UTM_FALLBACK = { utm_source: "lp-halloween", utm_medium: "lp", utm_campaign: "halloween-2026" };

type Kit = { nome: string; img: string; preco: string; para: string; carrinho?: string };

const CDN = "https://cdn.shopify.com/s/files/1/0895/4311/5055/files/";
const KITS: Kit[] = [
  { nome: "Kit Comida de Dragão para Cães", img: CDN + "Anuncios_Multiplataforma_Mordida_Suplemento_030f2ec7-353e-45e0-ae37-979a624c15ec.png?v=1785160455", preco: "144,50", para: "cães" },
  { nome: "Kit Completo para Cães", img: CDN + "kit-dog-supremo.png?v=1785150064", preco: "184,60", para: "cães" },
  { nome: "Kit Comida de Dragão Original", img: CDN + "Anuncios_Multiplataforma_Original_3x_4804eede-2fc5-41aa-b9a6-3ca0a3c2c776.png?v=1785160614", preco: "120,20", para: "cães e gatos" },
  { nome: "Kit 3 Mordidas", img: CDN + "kit-mordidas.png?v=1785150064", preco: "120,20", para: "cães" },
  { nome: "Kit Mordida + Suplemento", img: CDN + "kit-dog-mordida-suplemento.png?v=1785150064", preco: "144,50", para: "cães" },
  { nome: "Kit Original + Mordida", img: CDN + "kit-petiscos.png?v=1785150064", preco: "80,10", para: "cães" },
  { nome: "Kit Comida de Dragão para Gatos", img: CDN + "Anuncios_Multiplataforma_Kit_Gato.png?v=1785160535", preco: "144,50", para: "gatos" },
  { nome: "Kit Rango do Dragão (compre 6, ganhe 1)", img: CDN + "Copia_de_Anuncios_Multiplataforma_Rango_do_Dragao_1.png?v=1791472229", preco: "185,40", para: "cães" },
];

const FAQ = [
  { q: "Como eu ganho o suplemento?", a: "É só comprar um dos kits desta página. O suplemento já vai junto no mesmo pedido, sem cupom." },
  { q: "Até quando vale?", a: "Até 31 de outubro, ou enquanto durar o estoque do suplemento." },
  { q: "É larva mesmo?", a: "É. Larva de mosca soldado negro, criada para isso e desidratada. Proteína que o seu pet reconhece como comida." },
  { q: "E se o meu pet não gostar?", a: "Você tem garantia: fala com a gente e a gente resolve." },
];

export default function Halloween() {
  useEffect(() => { captureEntryUtms(); }, []);
  const link = (k: Kit, pos: string) => (k.carrinho ? buildCheckoutUrl(k.carrinho, UTM_FALLBACK, pos) : undefined);

  return (
    <div className="hw">
      <PageMeta
        title="Larvas e Travessuras — Comida de Dragão"
        description="Halloween da Comida de Dragão: compre um kit e ganhe um suplemento. Só até 31/10."
      />

      <header className="hw-hero">
        <img className="hw-logo" src="/assets/halloween/logo-comida-de-dragao-escorrendo.webp" alt="Comida de Dragão" />
        <img className="hw-cao" src="/assets/halloween/cao-com-tigela-cozinha-azul.webp" alt="Cão olhando uma tigela de larvas" />
        <img className="hw-titulo" src="/assets/halloween/titulo-larvas-e-travessuras.webp" alt="Larvas e Travessuras" />
        <p className="hw-oferta-chamada">Compre um kit e <strong>ganhe um suplemento</strong>.</p>
        <p className="hw-prazo">Só até 31/10</p>
        <a className="hw-botao" href="#kits">Escolher meu kit</a>
      </header>

      <section className="hw-bloco hw-papel" id="kits">
        <img className="hw-selo hw-selo--esq" src="/assets/halloween/selo-halloween-gato-preto.webp" alt="" aria-hidden />
        <h2 className="hw-h2">Escolha o kit.<br />O suplemento vem junto.</h2>
        <div className="hw-kits">
          {KITS.map((k) => {
            const href = link(k, `kit-${k.nome}`);
            return (
              <article className="hw-kit" key={k.nome}>
                <img src={k.img} alt={k.nome} loading="lazy" />
                <h3>{k.nome}</h3>
                <p className="hw-para">para {k.para}</p>
                <p className="hw-brinde">+ 1 suplemento de presente</p>
                <p className="hw-preco"><small>R$</small>{k.preco}</p>
                {href ? (
                  <a className="hw-botao hw-botao--kit" href={href} data-cta="kit">Quero este</a>
                ) : (
                  <span className="hw-botao hw-botao--off" aria-disabled>carrinho em preparo</span>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="hw-bloco">
        <img className="hw-selo hw-selo--dir" src="/assets/halloween/selo-halloween-original.webp" alt="" aria-hidden />
        <h2 className="hw-h2 hw-h2--claro">Por que tem larva<br />no pote do seu pet?</h2>
        <p className="hw-texto">Porque é a proteína que ele reconhece como comida de verdade. Larva de mosca soldado negro, criada para isso e desidratada, sem nojinho para o seu pet.</p>
      </section>

      <section className="hw-bloco hw-papel">
        <h2 className="hw-h2">Antes de comprar</h2>
        <div className="hw-faq">
          {FAQ.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>

      <footer className="hw-fim">
        <img className="hw-titulo hw-titulo--pequeno" src="/assets/halloween/titulo-larvas-e-travessuras.webp" alt="Larvas e Travessuras" />
        <p className="hw-oferta-chamada">Compre um kit e <strong>ganhe um suplemento</strong>. Só até 31/10.</p>
        <a className="hw-botao" href="#kits">Escolher meu kit</a>
        <img className="hw-dragao" src="/assets/halloween/silhueta-dragao.webp" alt="" aria-hidden />
      </footer>
    </div>
  );
}
