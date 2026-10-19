import { useEffect } from "react";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent } from "@/lib/pixel";
import VideosVencedores, { VIDEOS_GATOS } from "@/components/VideosVencedores";
import "./Halloween.css";
import "./HalloweenGatos.css";

/* ──────────────────────────────────────────────────────────────
   /suplemento-gato · Halloween dos gatos (19 a 31/10/2026)
   Página de VENDA: Suplemento para Gatos de R$ 110 por R$ 85 (Olivia, 19/10: "aprovado";
   "a página dos gatos deve ser de halloween"). Clonada da /halloween: mesmo visual e peças.
   - Preço na Shopify: R$ 85 com comparação R$ 110, posto em 19/10. Volta a R$ 110 em 01/11
     (tarefa agendada "cdd-fim-halloween-suplemento-gato").
   - A R$ 85 fica abaixo dos R$ 90: NÃO ganha o brinde de cão nem o frete grátis. Por isso a
     página não fala de frete.
   - Texto pela ficha (Produtos - decisões e claims, PRODUTO 4): só para gatos, taurina adicionada,
     40% de proteína. Dose: a medida do pacote, pelo peso do gato (sem número aqui).
   ────────────────────────────────────────────────────────────── */

const UTM_FALLBACK = { utm_source: "lp-suplemento-gato", utm_medium: "lp", utm_campaign: "halloween-2026" };

/* Suplemento para Gatos · SKU 303 · token Yampi 4DO9WVBVH0 (links-checkout-yampi-tokens.md) */
const CARRINHO = "https://seguro.comidadedragao.com.br/r/4DO9WVBVH0";
const PRECO = "85";
const PRECO_DE = "110";
const FOTO = "https://cdn.shopify.com/s/files/1/0895/4311/5055/files/17_ac0e9ce0-1e13-4785-8cd9-cc31d8abffb6.png?v=1776965150";

const FAQ = [
  { q: "Até quando vale?", a: "Até 31 de outubro, ou enquanto durar o estoque." },
  { q: "Serve para cachorro?", a: "Não. Ele é feito para gatos: tem taurina adicionada, na medida deles." },
  { q: "Quanto eu dou?", a: "Use a medida que vem no pacote, pelo peso do gato. É só misturar na comida de sempre." },
  { q: "É larva mesmo?", a: "É. Farinha de larva de mosca soldado negra, criada para isso e desidratada. Uma proteína que o seu gato provavelmente nunca comeu." },
  { q: "E se o meu gato não gostar?", a: "Se ele não topar em 14 dias da entrega, a gente devolve o seu dinheiro." },
  { q: "Ficou alguma dúvida?", a: "Chama a gente no WhatsApp: (21) 3950-0576." },
];

export default function HalloweenGatos() {
  useEffect(() => {
    captureEntryUtms();
    trackViewContent({ content_name: "LP Halloween — Suplemento para Gatos R$ 85", content_id: "303", value: 85 });
  }, []);
  const comprar = (pos: string) => buildCheckoutUrl(CARRINHO, UTM_FALLBACK, pos);

  return (
    <div className="hw hwg">
      <PageMeta
        title="Halloween dos gatos — Comida de Dragão"
        description="Suplemento para Gatos de R$ 110 por R$ 85. Rico em taurina. Só até 31/10."
      />

      <div className="hw-faixa" aria-label="Halloween sinistro do Dragão: Suplemento para Gatos de R$ 110 por R$ 85, só até 31/10">
        <div className="hw-faixa-trilho" aria-hidden>
          {[0, 1].map((n) => (
            <span key={n}>
              Halloween sinistro do Dragão ✦ Suplemento para Gatos por R$ 85 ✦ Só até 31/10 ✦ Halloween sinistro do Dragão ✦ Suplemento para Gatos por R$ 85 ✦ Só até 31/10 ✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      <header className="hw-hero">
        <div className="hw-topo">
          <a href="https://www.comidadedragao.com.br/collections/produtos">
            <img className="hw-logo" src="/assets/halloween/logo-comida-de-dragao-escorrendo.webp" alt="Comida de Dragão" />
          </a>
          <a className="hw-voltar" href="https://www.comidadedragao.com.br/">voltar para a home</a>
        </div>

        <span className="hw-eyebrow">promoção sinistra de Halloween</span>
        <h1 className="hw-h1">Suplemento<br /><span>para gatos.</span></h1>

        {/* cena do gato hipnotizado pelo pote (Magnific, versão 7 escolhida pela Olivia em 19/10);
            o rótulo do pote na cena é inventado pela IA, por isso o pote real aparece junto do preço */}
        <div className="hwg-cena">
          <img src="/assets/halloween/cena-gato-preto-suplemento.webp" alt="Gato preto hipnotizado levantando a pata para o pote do Suplemento para Gatos, que flutua e despeja o pó na tigela" />
        </div>

        {/* pacote primeiro, preço e botão depois (regra da casa) */}
        <div className="hwg-preco">
          <img className="hwg-pote" src={FOTO} alt="Pote do Suplemento para Gatos, Comida de Dragão" />
          <span className="hwg-de">de <s>R$ {PRECO_DE}</s></span>
          <span className="hwg-por"><small>por R$</small>{PRECO}</span>
        </div>
        <a className="hw-botao" href={comprar("titulo")} data-cta="titulo">Quero o suplemento →</a>
        <p className="hw-sub">Rico em taurina, com 40% de proteína. Só até 31/10.</p>
        <img className="hwg-titulo" src="/assets/halloween/titulo-larvas-e-travessuras.webp" alt="Larvas e Travessuras" />
      </header>

      <a className="hw-barra" href={comprar("barra")} data-cta="barra">
        <span className="hw-barra-txt">Suplemento para Gatos<small>R$ {PRECO} até 31/10</small></span>
        <strong className="hw-barra-btn">Quero →</strong>
      </a>

      <section className="hw-bloco hw-papel">
        <h2 className="hw-h2">Por que gato precisa<br />de taurina?</h2>
        <p className="hw-texto">O gato não produz taurina suficiente sozinho, e ela é essencial para o coração e a visão dele. O Suplemento para Gatos tem taurina adicionada, junto com farinha de larva de mosca soldado negra, cúrcuma e spirulina.</p>
        <a className="hw-botao" href={comprar("taurina")} data-cta="taurina">Quero por R$ {PRECO} →</a>
      </section>

      {VIDEOS_GATOS.length > 0 && (
        <div className="hw-reels">
          <VideosVencedores reels={VIDEOS_GATOS} />
        </div>
      )}

      <section className="hw-bloco">
        <img className="hw-selo hw-selo--dir" src="/assets/halloween/selo-halloween-original.webp" alt="" aria-hidden />
        <h2 className="hw-h2 hw-h2--claro">Por que tem larva<br />no pote do seu gato?</h2>
        <p className="hw-texto">Porque é uma proteína que ele reconhece como comida de verdade. Larva de mosca soldado negra, criada para isso e desidratada, misturada na comida de sempre.</p>
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
        <p className="hw-oferta-chamada">Suplemento para Gatos de R$ {PRECO_DE} por <strong>R$ {PRECO}</strong>. Só até 31/10.</p>
        <a className="hw-botao" href={comprar("final")} data-cta="final">Quero o suplemento</a>
        <img className="hw-dragao" src="/assets/halloween/silhueta-dragao.webp" alt="" aria-hidden />
      </footer>
    </div>
  );
}
