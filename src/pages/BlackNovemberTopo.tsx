import { useEffect } from "react";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent } from "@/lib/pixel";
import VideosVencedores, { VIDEOS } from "@/components/VideosVencedores";
import "./BlackNovember.css";
import "./BlackNovemberTopo.css";

/* ──────────────────────────────────────────────────────────────
   /black-november-topo · Black November (03 a 30/11/2026)
   Página de VENDA para PÚBLICO FRIO: quem nunca ouviu falar da marca e chega
   pelo anúncio de topo. UMA OFERTA SÓ: 50% no Kit Completo.

   Por que ela existe separada da /black-november: quem não conhece precisa
   primeiro entender o que é comida de inseto. Por isso aqui entram os cinco
   blocos de ciência, e lá não.

   Olivia, 27/10, mandando fazer esta página: o Kit Completo fica com os 50%.
   Isso fecha metade do item 1a do plano — o que continua aberto é COMO impedir
   que o brinde entre junto, que é configuração de checkout, não de página.

   🔴 NÃO VAI AO AR ANTES DE:
   1. O brinde. O gatilho da Yampi dispara a partir de R$ 90 e este kit a 50%
      custa R$ 92,30: hoje ele ganharia o suplemento extra, contra a decisão
      dela. E DOIS kits somam R$ 184,60, então o piso sozinho não resolve.
   2. O preço de R$ 92,30 existir no checkout. Enquanto não existir, a página
      promete um preço que o checkout não cobra.
   3. A garantia — ver o FAQ.

   Herda o visual da /black-november (BlackNovember.css) e acrescenta só o que
   é desta página (BlackNovemberTopo.css).
   ────────────────────────────────────────────────────────────── */

const UTM_FALLBACK = { utm_source: "lp-black-november-topo", utm_medium: "lp", utm_campaign: "black-november-2026" };

const CHECKOUT = "https://seguro.comidadedragao.com.br/r/";
const CDN = "https://cdn.shopify.com/s/files/1/0895/4311/5055/files/";

/* Kit Completo para Cães, sku 1306. Preço cheio lido na Shopify em 26/10/2026. */
const KIT = {
  nome: "Kit Completo para Cães",
  img: CDN + "kit-dog-supremo.png?v=1785150064",
  token: "GPGITR0VZ1",
  sku: "1306",
  cheio: "184,60",
  agora: "92,30",
};

/* Os cinco blocos de ciência, da referência do Canva. Cada um conferido no
   Catálogo - Biblioteca BSF do cofre (04_REFERENCIAS_CIENTIFICAS).
   🔴 REGRA QUE VALE AQUI: o que os estudos mediram é a PROTEÍNA DE LARVA como
   ingrediente, não o nosso produto acabado. A casa não tem ensaio no produto
   pronto. Por isso cada bloco diz de que se fala, e nenhum vira promessa de
   resultado. Ver item 7 do plano. */
const CIENCIA = [
  {
    titulo: "O corpo dele aproveita quase tudo",
    texto: "A proteína da larva tem alta digestibilidade — 88,9% da proteína. Em cães, trocar parte da farinha de frango por larva manteve peso, saúde e exames dentro do normal.",
    fonte: "Freel, McComb e Koutsos (2021); Jian et al. (2022)",
  },
  {
    titulo: "Menos cocô, e melhor",
    texto: "Num ensaio com Beagles, a dieta com farinha de larva reduziu o volume das fezes e teve maior digestibilidade da matéria seca que a de cordeiro.",
    fonte: "ensaio em Beagles, cross-over",
  },
  {
    titulo: "A larva alimenta o intestino dele também",
    texto: "O que não é digerido vira comida para as bactérias boas do intestino, que produzem acetato, propionato e butirato. A microbiota muda, e muda para melhor.",
    fonte: "Bosch, Vervoort e Hendriks (2016); Jian et al. (2022)",
  },
  {
    titulo: "Proteína completa, não pela metade",
    texto: "Perfil completo de aminoácidos essenciais, e de alta qualidade. É proteína inteira, não um complemento que falta alguma coisa.",
    fonte: "Bosch, Vervoort e Hendriks (2016)",
  },
  {
    titulo: "Antioxidante e anti-inflamatório, medido",
    texto: "Em cães que receberam farinha de larva por 42 dias, os marcadores de inflamação (TNF-α) caíram e as enzimas antioxidantes (GPx e SOD) subiram.",
    fonte: "ensaio em Beagles, 42 dias, 1% a 2% de farinha desengordurada",
  },
];

const FAQ = [
  { q: "Larva? Sério?", a: "Sério. Larva de mosca soldado negro, criada em biofábrica para virar alimento e desidratada. Não é a mosca da sua cozinha, e o seu pet não vê larva nenhuma: vê petisco." },
  { q: "O meu cão vai comer isso?", a: "Nos estudos com cães, as dietas com larva foram bem aceitas. E os vídeos aqui em cima são de tutores de verdade, com os cães deles." },
  { q: "Serve para pet com alergia?", a: "A proteína da larva é hipoalergênica, e é por isso que ela costuma funcionar em quem reage a frango e a boi. Atenção: a Mordida, que vem neste kit, leva ovo em pó — nela o hipoalergênico é a proteína da larva, não o petisco inteiro." },
  { q: "O que vem no kit?", a: "Três produtos: o Original de 90 g, a Mordida de 180 g e o Suplemento Integral de 180 g. Com frete grátis." },
  { q: "Como eu dou?", a: "O Original e a Mordida são petiscos, dá na mão. O Suplemento é um pó que você polvilha por cima da comida que ele já come." },
  /* 🔴 GARANTIA, pendente: a /halloween promete 14 dias e a política publicada é
     arrependimento em 7 dias com produto LACRADO — que não cobre pet que não gostou.
     Até a Olivia decidir prazo, condição e motivo, esta resposta não cita prazo. */
  { q: "E se ele não gostar?", a: "Fala com a gente no WhatsApp (21) 3950-0576 que a gente resolve com você." },
  { q: "Ficou outra dúvida?", a: "Chama no WhatsApp: (21) 3950-0576." },
];

export default function BlackNovemberTopo() {
  useEffect(() => {
    captureEntryUtms();
    trackViewContent({ content_name: "LP Black November topo — Kit Completo 50%", content_id: "lp-black-november-topo", value: 0 });
  }, []);

  const comprar = (pos: string) => buildCheckoutUrl(CHECKOUT + KIT.token, UTM_FALLBACK, pos);

  return (
    <div className="bn bnt">
      <PageMeta
        title="Kit Completo com 50% — Comida de Dragão"
        description="Proteína de larva para cães: o kit com os três produtos, pela metade do preço. De 03 a 30 de novembro."
      />

      <div className="bn-faixa" aria-label="Black November: Kit Completo com 50 por cento de desconto, de 03 a 30 de novembro">
        <div className="bn-faixa-trilho" aria-hidden>
          {[0, 1].map((n) => (
            <span key={n}>
              BLACK NOVEMBER ✦ KIT COMPLETO COM 50% ✦ DE R$ 184,60 POR R$ 92,30 ✦ ATÉ 30/11 ✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      <header className="bn-hero">
        <div className="bn-topo">
          <a href="https://www.comidadedragao.com.br/collections/produtos">
            <img className="bn-logo" src="/assets/images/logo-preto.png" alt="Comida de Dragão" />
          </a>
          <a className="bn-voltar" href="https://www.comidadedragao.com.br/">voltar para a home</a>
        </div>

        {/* Olivia, 27/10: "o kit tem que aparecer primeiro. É uma pessoa que nunca viu. Então
            tem que ser o kit inteiro pela metade, o kit e o valor. Primeira coisa ali, o botão,
            na primeira tela."
            Ordem: título · FOTO DO KIT · preço · botão — e tudo tem de caber em 812 px no
            celular. Bate com a regra da casa: primeiro o produto em cena, depois o preço e o
            botão. A explicação do que é a marca desceu para depois dos vídeos. */}
        <span className="bn-eyebrow">black november · 03 a 30 de novembro</span>
        <h1 className="bn-h1">O kit inteiro,<br /><span>pela metade.</span></h1>

        {/* A foto leva ao carrinho, como na /original e na /curiosidade. Aqui pode, porque
            há UM produto só: a foto representa exatamente o que o botão compra. */}
        <div className="bn-foto">
          <a href={comprar("foto")} data-cta="foto" aria-label={`Comprar o ${KIT.nome} por R$ ${KIT.agora}`}>
            <img className="bn-cao" src={KIT.img} alt="Kit Completo para cães: o pacote Original, a Mordida e o pote do Suplemento Integral" />
          </a>
        </div>

        <p className="bn-preco-topo">
          de <s>R$ {KIT.cheio}</s> por <strong>R$ {KIT.agora}</strong>
          <small>os três produtos, com frete grátis</small>
        </p>

        <div className="bn-cta-texto">
          <a className="bn-botao" href={comprar("titulo")} data-cta="titulo">Comprar o kit →</a>
        </div>
      </header>

      {/* Barra fixa: aqui ela COMPRA, não rola — há um produto só. */}
      <a className="bn-barra" href={comprar("barra")} data-cta="barra">
        <span className="bn-barra-txt">Kit Completo<small>R$ {KIT.agora}, metade do preço</small></span>
        <strong className="bn-barra-btn">Comprar →</strong>
      </a>

      {/* Olivia, 27/10: "aí logo embaixo, os vídeos". Quem nunca viu a marca precisa de gente
          antes de qualquer explicação. Regra da casa (Olivia, 02/10): página com vídeo de
          creator fica sem review, nem em foto nem em texto. */}
      <div className="bn-reels">
        <VideosVencedores reels={[VIDEOS.vitydalmata, VIDEOS.omeninomerlin, VIDEOS.pitanga, VIDEOS.sushijullie, VIDEOS.mytribesete, VIDEOS.pipo, VIDEOS.carla, VIDEOS.gabi]} />
      </div>

      {/* A explicação do que é a marca vem DEPOIS dos vídeos: a pessoa já viu cães comendo. */}
      <section className="bn-bloco bnt-oque">
        <p className="bn-texto">
          Comida de Dragão é alimento de larva de mosca soldado negro para cães: uma proteína
          que o seu provavelmente nunca comeu, e que o corpo dele aproveita quase inteira.
        </p>
        <p className="bn-balao">“ele não sabe que é larva. e não precisa saber”</p>
      </section>

      <section className="bn-bloco">
        <h2 className="bn-h2">O que vem na caixa</h2>
        <div className="bnt-caixa">
          <article>
            <h3>Original · 90 g</h3>
            <p>O petisco de larva desidratada. É por ele que quase todo mundo começa.</p>
          </article>
          <article>
            <h3>Mordida · 180 g</h3>
            <p>O petisco que quebra na mão, para cão pequeno e para pet seletivo. Leva ovo em pó.</p>
          </article>
          <article>
            <h3>Suplemento Integral · 180 g</h3>
            <p>O pó que você polvilha na comida que ele já come. No mínimo 40% de proteína, podendo chegar a 45%.</p>
          </article>
        </div>
        <a className="bn-botao" href={comprar("caixa")} data-cta="caixa">Comprar por R$ {KIT.agora} →</a>
      </section>

      <section className="bn-bloco">
        <h2 className="bn-h2">Por que larva,<br /><span>e não frango?</span></h2>
        <p className="bn-texto">
          Cinco coisas que os estudos mediram sobre a proteína de larva em cães. Nenhuma delas é
          promessa do nosso produto pronto: é o que a pesquisa viu no ingrediente.
        </p>
        <div className="bnt-ciencia">
          {CIENCIA.map((c, i) => (
            <article className="bnt-card" key={c.titulo}>
              <span className="bnt-num" aria-hidden>{i + 1}</span>
              <h3>{c.titulo}</h3>
              <p>{c.texto}</p>
              <small>{c.fonte}</small>
            </article>
          ))}
        </div>
        <p className="bnt-rodape-ciencia">
          Os estudos inteiros ficam na <a href="/biblioteca">biblioteca científica</a> da casa.
        </p>
        <a className="bn-botao" href={comprar("ciencia")} data-cta="ciencia">Comprar o kit →</a>
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
          O kit inteiro por <strong>R$ {KIT.agora}</strong>, com frete grátis. Até 30/11.
        </p>
        <a className="bn-botao" href={comprar("final")} data-cta="final">Comprar o kit →</a>
        <img className="bn-dragao" src="/assets/halloween/silhueta-dragao.webp" alt="" aria-hidden />
      </footer>
    </div>
  );
}
