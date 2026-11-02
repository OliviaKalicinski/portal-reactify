import { useEffect } from "react";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent } from "@/lib/pixel";
import VideosVencedores, { VIDEOS_GATOS } from "@/components/VideosVencedores";
import type { Reel } from "@/components/ReelsSection";
import "./BlackNovember.css";
import "./BlackNovemberGato.css";

/* ──────────────────────────────────────────────────────────────
   /black-november-gato · Black November dos gatos (03 a 30/11/2026)
   Pedido da Olivia em 30/10: "a gente precisa fazer uma de gato, 85".
   Uma oferta só: Suplemento para Gatos de R$ 110 por R$ 85.

   DE ONDE VEIO: clonada da /black-november-topo, que já é a LP de uma oferta só no
   visual da Black. O texto do produto veio da /halloween-gato, que vende o mesmo item
   desde 19/10, e os claims foram conferidos na ficha (`00_CONTEXTO_BASE/Produtos -
   decisões e claims.md`, PRODUTO 4): só para gatos, taurina adicionada, 40% de proteína,
   com farinha de larva BSF, cúrcuma e spirulina. Nada de "hipoalergênico" aqui: a ficha
   deste produto não traz o claim, e quem o tem é a proteína, não o pote.

   🔴🔴 DOIS BLOQUEIOS, E OS DOIS SÃO DA OLIVIA:

   1. O PREÇO VOLTA A R$ 110 EM 01/11. A tarefa agendada `cdd-fim-halloween-suplemento-gato`
      roda no domingo 01/11 às 15h e devolve o sku 303 ao preço cheio, porque o Halloween
      acaba. A campanha começa em 03/11. Se nada mudar, esta página promete R$ 85 e o
      checkout cobra R$ 110 no dia em que ela entrar no ar.
      Dois jeitos de resolver, e a escolha é dela: adiar a volta do preço para 01/12, ou
      criar um produto oculto da campanha (sku 303-BN), como foi feito com o Kit Completo.

   2. O ESTOQUE ESTÁ NEGATIVO. Medido em 30/10: sku 303 com -18 na Shopify, e o checkout
      VENDE assim mesmo (testado no carrinho). Vender o que não existe é pior que não
      vender. Há to-do de reposição com o Breno, prazo 31/10.

   SEM FRETE GRÁTIS, de propósito: a R$ 85 o pedido fica abaixo do piso de R$ 108, e esta
   página não fala de frete. Também fica fora do brinde (piso R$ 100 na regra 8402).
   ────────────────────────────────────────────────────────────── */

const UTM_FALLBACK = { utm_source: "lp-black-november-gato", utm_medium: "lp", utm_campaign: "black-november-2026" };

/* Suplemento para Gatos · sku 303 · token Yampi de links-checkout-yampi-tokens.md.
   Conferido no checkout em 30/10: abre a R$ 85,00. */
const CARRINHO = "https://seguro.comidadedragao.com.br/r/4DO9WVBVH0";
/* 🔴 01/11: PREÇO DE VOLTA A R$ 110, por decisão da Olivia ("volta pra 110").
   A página nasceu a R$ 85, que era o preço do Halloween. Em 01/11 às 15h a tarefa
   `cdd-fim-halloween-suplemento-gato` devolveu o sku 303 ao preço cheio, e a página
   passou a prometer um valor que o checkout não cobrava. Ela escolheu alinhar a
   página ao checkout, não o checkout à página.
   ⚠️ COM ISSO A PÁGINA FICA SEM OFERTA: é uma LP de campanha mostrando preço de
   tabela. A oferta de Black do gato ainda não foi decidida. Quando for, troque o
   PRECO abaixo e devolva o PRECO_DE com o valor riscado. */
const PRECO = "110";
/* Foto do pote de GATO. 🔴 Em 28/10 a Olivia pegou que aqui estava a foto do suplemento
   de cão: o de gato é outro pote, laranja, com o gato e o selo de taurina. */
const FOTO = "/assets/images/produtos/suplemento-felino-frente.webp";

/* Os dois vídeos de gato que só existem na /halloween-gato, somados aos da /gatos. */
const reelGato = (id: string, handle: string): Reel => ({
  id,
  src: `/assets/videos/reels/creator-${id}.mp4`,
  poster: `/assets/videos/reels/creator-${id}.jpg`,
  title: `@${handle}`,
});
const VIDEOS_DESTA_PAGINA: Reel[] = [
  ...VIDEOS_GATOS,
  reelGato("rani-labradora-gatos", "rani.labradora"),
  reelGato("ogatinhosamu-gatos", "ogatinhosamu"),
];

const FAQ = [
  { q: "Tem estoque?", a: "Enquanto durar. Se sumir do site, é porque acabou e estamos repondo." },
  { q: "Serve para cachorro?", a: "Não. Este é feito para gatos: tem taurina adicionada, na medida deles. Para cães existe o Suplemento Integral." },
  { q: "Por que taurina?", a: "Porque o gato não produz taurina suficiente sozinho, diferente do cão. Ela é essencial para o coração, a visão, a imunidade e a reprodução dele." },
  { q: "Quanto eu dou?", a: "Use a medida que vem no pacote, pelo peso do gato. É só misturar na comida de sempre." },
  { q: "É larva mesmo?", a: "É. Farinha de larva de mosca soldado negra, criada em biofábrica para isso e desidratada. Uma proteína que o seu gato provavelmente nunca comeu." },
  { q: "Vou ser sincera: cheira bem?", a: "Não. É meio fedidinho, e a sua mão vai querer sabão depois. O seu gato discorda de nós dois." },
  { q: "E se o meu gato não gostar?", a: "Chama a gente no WhatsApp (21) 3950-0576 que a gente resolve com você." },
];

export default function BlackNovemberGato() {
  useEffect(() => {
    captureEntryUtms();
    trackViewContent({ content_name: "LP Black November — Suplemento para Gatos R$ 85", content_id: "303", value: 85 });
  }, []);

  const comprar = (pos: string) => buildCheckoutUrl(CARRINHO, UTM_FALLBACK, pos);

  return (
    <div className="bn bng">
      <PageMeta
        title="O suplemento do seu gato — Comida de Dragão"
        description={`O suplemento do seu gato, rico em taurina, por R$ ${PRECO}. 180 g, com 40% de proteína.`}
      />

      <div className="bn-faixa" aria-label={`Suplemento para Gatos da Comida de Dragão, rico em taurina, por R$ ${PRECO}`}>
        <div className="bn-faixa-trilho" aria-hidden>
          {[0, 1].map((n) => (
            <span key={n}>
              {`O SUPLEMENTO DO SEU GATO ✦ RICO EM TAURINA ✦ 40% DE PROTEÍNA ✦\u00a0`}
            </span>
          ))}
        </div>
      </div>

      <header className="bn-hero">
        {/* Nuvens da peça da Bianca, com posições próprias desta página: aqui o pote é
            estreito e alto, e as da /black-november-topo caíam em cima dele. */}
        <i className="bn-nuvem bn-nuvem--1" aria-hidden />
        <i className="bn-nuvem bn-nuvem--2" aria-hidden />
        <i className="bn-nuvem bn-nuvem--3" aria-hidden />
        <i className="bn-nuvem bn-nuvem--4" aria-hidden />

        <div className="bn-topo">
          <a href="https://www.comidadedragao.com.br/collections/produtos">
            <img className="bn-logo" src="/assets/images/logo-preto.png" alt="Comida de Dragão" />
          </a>
          <a className="bn-voltar" href="https://www.comidadedragao.com.br/">voltar para a home</a>
        </div>

        {/* Mesma ordem que a /black-november-topo: título, produto em cena, preço, botão,
            tudo na primeira tela do celular. */}
        <span className="bn-eyebrow">só para gatos</span>
        <h1 className="bn-h1">
          O suplemento dele
          <span>com taurina</span>
        </h1>

        <div className="bn-foto bng-foto">
          <a href={comprar("foto")} data-cta="foto" aria-label={`Quero o Suplemento para Gatos por R$ ${PRECO}`}>
            <img className="bn-cao" src={FOTO} alt="Pote do Suplemento para Gatos da Comida de Dragão, com o selo de taurina" />
          </a>
        </div>

        <p className="bn-preco-topo">
          <b className="bng-oferta-linha">rico em taurina</b>
          <strong>R$ {PRECO}</strong>
          <small>180 g, com 40% de proteína</small>
        </p>

        <div className="bn-cta-texto">
          <a className="bn-botao" href={comprar("titulo")} data-cta="titulo">Quero o dele →</a>
        </div>
      </header>

      <div className="bn-grade-chao" aria-hidden />

      {/* Barra fixa que COMPRA: há um produto só nesta página. */}
      <a className="bn-barra" href={comprar("barra")} data-cta="barra">
        <span className="bn-barra-txt">Suplemento para Gatos<small>R$ {PRECO}, rico em taurina</small></span>
        <strong className="bn-barra-btn">Quero →</strong>
      </a>

      {/* Vídeos logo depois da primeira tela, como na /black-november-topo: gente de
          verdade antes de qualquer explicação. Página com vídeo de creator fica sem
          review, em foto e em texto (regra da casa, Olivia 02/10). */}
      <div className="bn-reels">
        <VideosVencedores reels={VIDEOS_DESTA_PAGINA} />
      </div>

      <section className="bn-bloco">
        <h2 className="bn-h2">Por que gato precisa<br /><span>de taurina?</span></h2>
        <p className="bn-texto">
          O gato não produz taurina suficiente sozinho, diferente do cão. Ela é essencial para
          o coração, a visão, a imunidade e a reprodução dele, e a falta dela cobra caro.
          Este pote tem taurina adicionada, junto com farinha de larva de mosca soldado negra,
          cúrcuma e spirulina.
        </p>
        <a className="bn-botao" href={comprar("taurina")} data-cta="taurina">Quero por R$ {PRECO} →</a>
      </section>

      <section className="bn-bloco">
        <h2 className="bn-h2">Por que tem larva<br /><span>no pote dele?</span></h2>
        <p className="bn-texto">
          Porque é uma proteína que o gato reconhece como comida de verdade, e que o corpo dele
          aproveita quase inteira. Larva de mosca soldado negra, criada em biofábrica registrada
          no MAPA, do ovo ao pacote, e desidratada. Não é inseto apanhado por aí.
        </p>
        <p className="bn-balao">“ele não sabe que é larva. e não precisa saber”</p>
        <a className="bn-botao" href={comprar("larva")} data-cta="larva">Quero o dele por R$ {PRECO} →</a>
      </section>

      <section className="bn-bloco">
        <h2 className="bn-h2">Antes de comprar</h2>
        <div className="bn-faq">
          {FAQ.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>

      <footer className="bn-fim">
        <p className="bn-oferta-chamada">
          O suplemento do seu gato, rico em taurina, por <strong>R$ {PRECO}</strong>.
        </p>
        <a className="bn-botao" href={comprar("final")} data-cta="final">Quero o dele →</a>
        <img className="bn-dragao" src="/assets/halloween/silhueta-dragao.webp" alt="" aria-hidden />
      </footer>
    </div>
  );
}
