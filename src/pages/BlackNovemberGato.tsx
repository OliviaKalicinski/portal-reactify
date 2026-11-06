import { useEffect } from "react";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent } from "@/lib/pixel";
import VideosVencedores, { VIDEOS_GATOS } from "@/components/VideosVencedores";
import type { Reel } from "@/components/ReelsSection";
import { ligarEditorPosicoes } from "@/lib/editorPosicoes";
import { FIM_CURTO, FIM_POR_EXTENSO, JANELA_POR_EXTENSO } from "@/lib/blackNovember";
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
const PRECO = "82,50"; // 06/11 (Olivia): "vai ser 25%", era R$ 85
const PRECO_DE = "110";
/* largura, em px, da tela de celular em que a Olivia posicionou o topo (modo ?editar, 06/11) */
const BASE_CELULAR = 362;
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
  // 06/11 (Olivia): "retire o terceiro vídeo" — saiu o @rani.labradora
  reelGato("ogatinhosamu-gatos", "ogatinhosamu"),
];

const FAQ = [
  { q: "Até quando vale?", a: `Até ${FIM_POR_EXTENSO}, ou enquanto durar o estoque.` },
  { q: "Serve para cachorro?", a: "Não. Este é feito para gatos, na medida deles. Para cães existe o Suplemento Integral." },
  { q: "Quanto eu dou?", a: "Use a medida que vem no pacote, pelo peso do gato. É só misturar na comida de sempre." },
  { q: "É larva mesmo?", a: "É. Farinha de larva de mosca soldado negra, criada em biofábrica para isso e desidratada. Uma proteína que o seu gato provavelmente nunca comeu." },
  { q: "Vou ser sincera: cheira bem?", a: "Não. É meio fedidinho, e a sua mão vai querer sabão depois. O seu gato discorda de nós dois." },
  { q: "E se o meu gato não gostar?", a: "Chama a gente no WhatsApp (21) 3950-0576 que a gente resolve com você." },
];

export default function BlackNovemberGato() {
  // 06/11: na prévia local, ?editar deixa a Olivia arrastar as peças do topo (ver editorPosicoes.ts)
  useEffect(() => ligarEditorPosicoes(
    [".bn-logo", ".bng-titulo", ".bng-eyebrow", ".bng-foto", ".bn-preco-topo", ".bn-cta-texto", ".bng-gato", ".bn-nuvem"],
    "black-november-gato",
  ), []);

  // 06/11 (Olivia: "tinha que ir diminuindo, proporcionalmente, de um jeito que as coisas não saiam
  // da tela"). No celular o topo é montado numa largura fixa (BASE_CELULAR, a tela em que ela
  // posicionou as peças) e ampliado ou reduzido inteiro para caber na tela, com `zoom`. Assim as
  // posições gravadas valem em qualquer celular. No computador (900 px ou mais) não mexe em nada.
  useEffect(() => {
    const aplicar = () => {
      const w = window.innerWidth;
      const k = w < 900 ? w / BASE_CELULAR : 1;
      document.documentElement.style.setProperty("--bng-zoom", String(k));
    };
    aplicar();
    window.addEventListener("resize", aplicar);
    return () => { window.removeEventListener("resize", aplicar); document.documentElement.style.removeProperty("--bng-zoom"); };
  }, []);

  useEffect(() => {
    captureEntryUtms();
    trackViewContent({ content_name: "LP Black November — Suplemento para Gatos R$ 82,50", content_id: "303", value: 82.5 });
  }, []);

  const comprar = (pos: string) => buildCheckoutUrl(CARRINHO, UTM_FALLBACK, pos);

  return (
    <div className="bn bng">
      <PageMeta
        title="Black November dos gatos — Comida de Dragão"
        description={`O suplemento do seu gato, de R$ ${PRECO_DE} por R$ ${PRECO}. ${JANELA_POR_EXTENSO[0].toUpperCase() + JANELA_POR_EXTENSO.slice(1)}.`}
      />

      <div className="bn-faixa" aria-label={`Black November dos gatos: Suplemento para Gatos de R$ ${PRECO_DE} por R$ ${PRECO}, ${JANELA_POR_EXTENSO}`}>
        <div className="bn-faixa-trilho" aria-hidden>
          {[0, 1].map((n) => (
            <span key={n}>
              {`BLACK NOVEMBER ✦ O SUPLEMENTO DO SEU GATO POR R$ ${PRECO} ✦ ATÉ ${FIM_CURTO} ✦\u00a0`}
            </span>
          ))}
        </div>
      </div>

      {/* 06/11: céu atrás do topo e do chão juntos, como nas peças de anúncio */}
      <div className="bng-ceu">
      <header className="bn-hero">
        {/* Nuvens da peça da Bianca, com posições próprias desta página: aqui o pote é
            estreito e alto, e as da /black-november-topo caíam em cima dele. */}
        <i className="bn-nuvem bn-nuvem--1" aria-hidden />
        <i className="bn-nuvem bn-nuvem--2" aria-hidden />
        <i className="bn-nuvem bn-nuvem--3" aria-hidden />
        <i className="bn-nuvem bn-nuvem--4" aria-hidden />
        {/* 06/11 (Olivia): o céu e o gatinho de pixel saem das peças de anúncio da Black (PDF do Canva). */}
        <img className="bng-gato" src="/assets/black-november/gato-pixel.png" alt="" aria-hidden />

        <div className="bn-topo">
          <a href="https://www.comidadedragao.com.br/collections/produtos">
            <img className="bn-logo bng-logo" src="/assets/black-november/logo-3.png" alt="Comida de Dragão" />
          </a>
          <a className="bn-voltar" href="https://www.comidadedragao.com.br/">voltar para a home</a>
        </div>

        {/* Mesma ordem que a /black-november-topo: título, produto em cena, preço, botão,
            tudo na primeira tela do celular. */}
        {/* 06/11 (Olivia): o título vira o "25% OFF" das peças (PDF do Canva), com o
            "só para gatos" embaixo, tortinho. O texto do título fica para leitor de tela. */}
        <h1 className="bn-h1 bng-titulo">
          <img src="/assets/black-november/25off.png" alt={`25% off no Suplemento para Gatos, por R$ ${PRECO}`} />
        </h1>
        {/* 06/11 (Olivia): "ficou faltando dizer o que é: SUPLEMENTO" */}
        <span className="bn-eyebrow bng-eyebrow">suplemento só para gatos</span>

        <div className="bn-foto bng-foto">
          <a href={comprar("foto")} data-cta="foto" aria-label={`Quero o Suplemento para Gatos por R$ ${PRECO}`}>
            <img className="bn-cao" src={FOTO} alt="Pote do Suplemento para Gatos da Comida de Dragão" />
          </a>
        </div>

        <p className="bn-preco-topo">
          {/* 06/11 (Olivia): "no preço vamos fazer direto o de 110 por 82,50" */}
          de <s>R$ {PRECO_DE}</s> por <strong>R$ {PRECO}</strong>
        </p>

        <div className="bn-cta-texto">
          <a className="bn-botao" href={comprar("titulo")} data-cta="titulo">Quero o dele →</a>
        </div>
      </header>

      <div className="bn-grade-chao" aria-hidden />
      </div>

      {/* Barra fixa que COMPRA: há um produto só nesta página. */}
      <a className="bn-barra" href={comprar("barra")} data-cta="barra">
        <span className="bn-barra-txt">Suplemento para Gatos<small>R$ {PRECO} até {FIM_CURTO}</small></span>
        <strong className="bn-barra-btn">Quero →</strong>
      </a>

      {/* Vídeos logo depois da primeira tela, como na /black-november-topo: gente de
          verdade antes de qualquer explicação. Página com vídeo de creator fica sem
          review, em foto e em texto (regra da casa, Olivia 02/10). */}
      <div className="bn-reels">
        <VideosVencedores reels={VIDEOS_DESTA_PAGINA} />
      </div>

      <section className="bn-bloco bng-bloco--1">
        {/* 06/11 (Olivia): "ele fala de taurina, mas temos que falar do suplemento". Texto só com o
            que a ficha do PRODUTO 4 sustenta: só para gatos, 40% de proteína, larva BSF, cúrcuma e
            spirulina, reforço de proteína do dia a dia, medida pelo peso, misturado na comida. */}
        <h2 className="bn-h2">O que é o<br /><span>suplemento dele?</span></h2>
        <p className="bn-texto">
          Um reforço de proteína para o dia a dia do seu gato. Você mistura na comida de sempre,
          na medida do peso dele. São 40% de proteína, de farinha de larva de mosca soldado negra,
          com cúrcuma e spirulina. Feito só para gatos.
        </p>
        <a className="bn-botao" href={comprar("suplemento")} data-cta="suplemento">Quero por R$ {PRECO} →</a>
      </section>

      <section className="bn-bloco bng-bloco--2">
        <h2 className="bn-h2">Por que tem larva<br /><span>no pote dele?</span></h2>
        <p className="bn-texto">
          Porque é uma proteína que o gato reconhece como comida de verdade, e que o corpo dele
          aproveita quase inteira. Larva de mosca soldado negra, criada em biofábrica registrada
          no MAPA, do ovo ao pacote, e desidratada. Não é inseto apanhado por aí.
        </p>
        <a className="bn-botao" href={comprar("larva")} data-cta="larva">Quero o dele por R$ {PRECO} →</a>
      </section>

      <section className="bn-bloco bng-bloco--3">
        <h2 className="bn-h2">Antes de comprar</h2>
        <div className="bn-faq">
          {FAQ.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>

      <footer className="bn-fim">
        <p className="bn-oferta-chamada">
          O suplemento do seu gato por <strong>R$ {PRECO}</strong>. Até {FIM_CURTO}.
        </p>
        <a className="bn-botao" href={comprar("final")} data-cta="final">Quero o dele →</a>
        <img className="bn-dragao" src="/assets/halloween/silhueta-dragao.webp" alt="" aria-hidden />
      </footer>
    </div>
  );
}
