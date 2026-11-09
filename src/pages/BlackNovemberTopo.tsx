import { useEffect } from "react";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent } from "@/lib/pixel";
import VideosVencedores, { VIDEOS } from "@/components/VideosVencedores";
import { FIM_CURTO, FIM_POR_EXTENSO, JANELA_POR_EXTENSO } from "@/lib/blackNovember";
import "./BlackNovember.css";
import "./BlackNovemberTopo.css";
/* 06/11 (Olivia: "agora vamos colocar no estilo da do gato, igualzinha"): a página usa o
   visual da /black-november-gato inteiro (classe .bng na raiz), e o que é só dela vem depois. */
import "./BlackNovemberGato.css";
import "./BlackNovemberTopoBlack.css";
import { ligarEditorPosicoes } from "@/lib/editorPosicoes";

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

   🔴 28/10, e a decisão mudou duas vezes no mesmo dia — leia inteiro antes de mexer.
   De manhã o preço era R$ 92,30 (metade de R$ 184,60) e o piso de frete grátis da
   Yampi subiu de R$ 90 para R$ 95; para o kit não ficar abaixo do piso, ele subiu
   para R$ 96,00 e o título deixou de dizer "pela metade" (R$ 96,00 sobre R$ 184,60
   é 48%, não 50%).
   À tarde a Olivia reviu: **esta oferta não era para ter frete grátis**. A regra que
   ela deu para o piso é "o preço do kit mais barato já com 10% de desconto" — o kit
   mais barato é o Original 3x a R$ 120,20 (o Original + Mordida, de R$ 80,10, não
   conta), então 120,20 × 0,90 = R$ 108,18, arredondado para **R$ 108,00** nos 27
   estados. Com isso o kit de R$ 96,00 fica abaixo do piso e **não tem frete grátis**,
   que é o que ela quis.
   Por isso a promessa de frete grátis saiu dos quatro lugares desta página: o FAQ,
   a linha sob o preço, a barra do pé e a descrição da prévia no vite.config.ts.
   ⚠️ O preço continua R$ 96,00: a Olivia não pediu para voltar aos R$ 92,30, e voltar
   mudaria o título de novo.
   🔴 06/11: a Olivia decidiu "coloca com 50%": o kit volta a R$ 92,30, metade exata, e o
   título passa a ser "50% OFF". Continua abaixo do piso de R$ 108, sem frete grátis.
   O 1306-BN precisa ir a R$ 92,30 na Shopify E na Yampi (produto 46529699) antes de esta
   versão subir: a Yampi cobra o preço dela.

   ✅ O BRINDE, RESOLVIDO (28/10, medido). A regra mora em Yampi → Marketing →
   **Brindes** (`app.yampi.com.br/marketing/freebies`), uma tela que não aparece no
   menu lateral — só pela busca do painel. É a regra 8253, "Halloween - suplemento
   acima de R$ 90": dá o Suplemento Integral (sku 302) ao atingir R$ 90,00 no
   carrinho, e **termina em 31/10/2026**. A campanha começa em 03/11, então nessa
   janela ela já não existe, e as duas ofertas não se somam. Medido assim: com o
   Kit Original + Mordida (R$ 80,10) o checkout mostra "Adicione R$ 9,90 e ganhe um
   brinde!" — 80,10 + 9,90 = R$ 90,00 — e entrega Produtos (1), sem brinde.
   *(Por isso o brinde aparece em qualquer teste feito hoje: hoje é 28/10.)*

   🔴 NÃO VAI AO AR ANTES DE: a garantia — ver o FAQ.

   Herda o visual da /black-november (BlackNovember.css) e acrescenta só o que
   é desta página (BlackNovemberTopo.css).
   ────────────────────────────────────────────────────────────── */

const UTM_FALLBACK = { utm_source: "lp-black-november-topo", utm_medium: "lp", utm_campaign: "black-november-2026" };

const CHECKOUT = "https://seguro.comidadedragao.com.br/r/";
const CDN = "https://cdn.shopify.com/s/files/1/0895/4311/5055/files/";

/* Kit Completo para Cães, sku 1306. Preço cheio lido na Shopify em 26/10/2026.
   🔴 28/10/2026: o botão NÃO leva mais ao carrinho do kit normal com cupom. Leva a um
   produto próprio da campanha, oculto da loja (não está em nenhuma coleção), criado na
   Shopify (sku 1306-BN) e cadastrado à mão na Yampi (produto 46529699), já com o preço
   promocional de R$ 96,00. Assim a pessoa cai no checkout com o valor certo sem cupom,
   e o preço da campanha não aparece para quem navega o site.
   Conferido no checkout em 28/10: abre a R$ 96,00. Fica ABAIXO do piso de frete grátis
   (R$ 108,00 desde a tarde de 28/10), de propósito — ver a nota do topo. Num teste feito
   hoje ele vem com o brinde junto, porque a regra do Halloween ainda está valendo; ela
   termina em 31/10, e a da campanha (piso R$ 100) começa em 03/11, então na janela da
   Black November este kit de R$ 96,00 também fica fora do presente. */
const KIT = {
  nome: "Kit Completo para Cães",
  img: CDN + "kit-dog-supremo.png?v=1785150064",
  token: "PDYJH8ZOQU",
  sku: "1306-BN",
  cheio: "184,60",
  agora: "92,30", // 06/11 (Olivia): "coloca com 50%" — metade exata de R$ 184,60; era R$ 96,00
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

/* FAQ reescrito em 28/10 lendo a casa: `00_CONTEXTO_BASE/Voz da marca (marketing).md`,
   o índice de objeções e as falas reais em `03 - Vozes & Argumentos (copy de reviews)`.
   Aqui quem chega NÃO CONHECE a marca, então a quebra do nojo vem primeiro e o tom é
   mais explicativo que na página da campanha — mas sem virar professoral, que a voz
   proíbe. O defeito pequeno (o cheiro) fica, porque é o que ganha confiança. */
const FAQ = [
  { q: "Larva? Sério?", a: "Sério, e sem drama: larva de mosca soldado negro, criada em biofábrica para virar alimento e desidratada. Não é a mosca da sua cozinha, e o seu cão não vê larva — vê petisco." },
  { q: "Por que larva e não frango?", a: "Porque é proteína que o corpo dele aproveita quase inteira, com perfil completo de aminoácidos, e que quase nenhum cão já comeu antes — por isso costuma funcionar em quem reage a frango e a boi." },
  { q: "O meu vai querer comer?", a: "Nos estudos com cães, as dietas com larva foram bem aceitas. E os vídeos aqui em cima são de tutores de verdade: um deles escreveu que teve de guardar o pacote na geladeira porque o cachorro procurava pela casa." },
  { q: "Vou ser sincera: cheira bem?", a: "Não. É meio fedidinho, e a sua mão vai querer sabão depois. O seu cão discorda de nós dois." },
  { q: "Isso faz mal para ele?", a: "A larva é criada em biofábrica registrada no MAPA, do ovo ao pacote, tudo rastreável. Não é inseto apanhado por aí." },
  { q: "Serve para pet com alergia?", a: "A proteína da larva é hipoalergênica, e é por isso que ela costuma funcionar em quem reage a frango e a boi. Atenção à Mordida, que vem neste kit e leva ovo em pó: nela o hipoalergênico é a proteína, não o petisco inteiro. Se o seu pet tem quadro alérgico, fale com o veterinário dele." },
  { q: "O que vem no kit?", a: "Três produtos: o Original de 90 g, a Mordida de 180 g e o Suplemento Integral de 180 g." },
  { q: "Como eu dou?", a: "O Original e a Mordida são petiscos: dá na mão. O Suplemento é um pó que você joga por cima da comida que ele já come." },
  /* GARANTIA (decidido por Olivia em 30/10): vale a lei — 7 dias com produto LACRADO,
     que não cobre pet que não gostou. Esta resposta segue sem prazo, de propósito. */
  { q: "E se não rolar?", a: "Chama a gente no WhatsApp (21) 3950-0576 que a gente resolve com você." },
];

/* largura, em px, em que o topo é montado no celular e no computador; o topo inteiro cresce ou
   encolhe a partir dela (zoom) para caber na largura e na primeira tela. Mesmos números do gato. */
const BASE_CELULAR = 362;
const BASE_COMPUTADOR = 1023;
const ZOOM_MAX_COMPUTADOR = 1.5;

export default function BlackNovemberTopo() {
  // na prévia local, ?editar deixa a Olivia arrastar, girar e mudar o tamanho das peças do topo
  useEffect(() => ligarEditorPosicoes(
    [".bn-logo", ".bng-titulo", ".bng-eyebrow", ".bng-foto", ".bn-preco-topo", ".bn-cta-texto", ".bng-gato", ".bn-nuvem"],
    "black-november-topo",
  ), []);

  // topo em proporção, igual ao do gato: o fator é o menor entre o que a largura e o que a
  // altura permitem (descontando a faixa do topo e a barra fixa), para tudo ficar na primeira tela
  useEffect(() => {
    const aplicar = () => {
      const raiz = document.documentElement;
      const w = window.innerWidth;
      const computador = w >= 900;
      raiz.style.setProperty("--bng-zoom", "1");
      const hero = document.querySelector<HTMLElement>(".bnt .bn-hero");
      const faixa = document.querySelector<HTMLElement>(".bnt .bn-faixa")?.getBoundingClientRect().height ?? 0;
      const barra = document.querySelector<HTMLElement>(".bnt .bn-barra")?.getBoundingClientRect().height ?? 0;
      const alturaBase = hero?.getBoundingClientRect().height ?? 0;
      const kLargura = computador ? Math.min(w / BASE_COMPUTADOR, ZOOM_MAX_COMPUTADOR) : w / BASE_CELULAR;
      const kAltura = alturaBase ? (window.innerHeight - faixa - barra) / alturaBase : kLargura;
      raiz.style.setProperty("--bng-zoom", String(Math.min(kLargura, kAltura)));
    };
    aplicar();
    const imgs = [...document.querySelectorAll<HTMLImageElement>(".bnt .bn-hero img")];
    imgs.forEach((i) => { if (!i.complete) i.addEventListener("load", aplicar, { once: true }); });
    window.addEventListener("resize", aplicar);
    return () => { window.removeEventListener("resize", aplicar); document.documentElement.style.removeProperty("--bng-zoom"); };
  }, []);

  useEffect(() => {
    captureEntryUtms();
    trackViewContent({ content_name: "LP Black November topo — Kit Completo 50%", content_id: "lp-black-november-topo", value: 0 });
  }, []);

  const comprar = (pos: string) => buildCheckoutUrl(CHECKOUT + KIT.token, UTM_FALLBACK, pos);

  return (
    <div className="bn bng bnt">
      <PageMeta
        title="Você é novo por aqui? Pega esse presente — Comida de Dragão"
        description={`Você é novo por aqui? Pega esse presente: o kit inteiro de proteína de larva para cães, por R$ ${KIT.agora}. Até ${FIM_POR_EXTENSO}.`}
      />

      <div className="bn-faixa" aria-label={`Black November: é a sua primeira vez aqui? O kit inteiro por R$ ${KIT.agora}, ${JANELA_POR_EXTENSO}`}>
        <div className="bn-faixa-trilho" aria-hidden>
          {[0, 1].map((n) => (
            <span key={n}>
              {`BLACK NOVEMBER ✦ VOCÊ É NOVO AQUI? PEGA O KIT INTEIRO POR R$ ${KIT.agora} ✦ ATÉ ${FIM_CURTO} ✦\u00a0`}
            </span>
          ))}
        </div>
      </div>

      <div className="bng-ceu">
      <header className="bn-hero">
        {/* Nuvens recortadas da peça da Bianca. Posições próprias desta página, no
            BlackNovemberTopo.css: aqui o kit é maior e as de lá caíam em cima dele. */}
        <i className="bn-nuvem bn-nuvem--1" aria-hidden />
        <i className="bn-nuvem bn-nuvem--2" aria-hidden />
        <i className="bn-nuvem bn-nuvem--3" aria-hidden />
        <i className="bn-nuvem bn-nuvem--4" aria-hidden />
        <i className="bn-nuvem bn-nuvem--5" aria-hidden />
        {/* o cachorro 8-bit de óculos das peças, no lugar do gatinho */}
        <img className="bng-gato bnt-cao-pixel" src="/assets/black-november/cao-pixel.png" alt="" aria-hidden />

        <div className="bn-topo">
          <a href="https://www.comidadedragao.com.br/collections/produtos">
            <img className="bn-logo bng-logo" src="/assets/black-november/logo-3.png" alt="Comida de Dragão" />
          </a>
          <a className="bn-voltar" href="https://www.comidadedragao.com.br/">voltar para a home</a>
        </div>

        {/* Olivia, 27/10: "o kit tem que aparecer primeiro. É uma pessoa que nunca viu. Então
            tem que ser o kit inteiro pela metade, o kit e o valor. Primeira coisa ali, o botão,
            na primeira tela."
            Ordem: título · FOTO DO KIT · preço · botão — e tudo tem de caber em 812 px no
            celular. Bate com a regra da casa: primeiro o produto em cena, depois o preço e o
            botão. A explicação do que é a marca desceu para depois dos vídeos. */}
        {/* Olivia, 27/10: "nessa do kit inteiro seria legal a gente colocar falando assim: você
            é novo aqui, então pega esse presente — porque essa vai para topo, aberto, a gente
            vai divulgar abertão."
            O enquadramento deixa de ser liquidação e vira boas-vindas: quem chega aqui não
            conhece a marca, e o preço de entrada é o jeito de dizer oi. */}
        {/* 06/11 (Olivia: "coloca com 50%"): o kit foi a R$ 92,30, metade exata de R$ 184,60,
            e o título vira o "50% OFF" no desenho das peças (montado com as letras do "25% OFF"
            do PDF dela). Embaixo, tortinha, a etiqueta que diz o que é. */}
        <h1 className="bn-h1 bng-titulo">
          <img src="/assets/black-november/50off.png" alt={`50% off no Kit Completo para Cães, por R$ ${KIT.agora}`} />
        </h1>
        <span className="bn-eyebrow bng-eyebrow">kit completo para cães</span>

        {/* A foto leva ao carrinho, como na /original e na /curiosidade. Aqui pode, porque
            há UM produto só: a foto representa exatamente o que o botão compra. */}
        <div className="bn-foto bng-foto">
          <a href={comprar("foto")} data-cta="foto" aria-label={`Pegar o ${KIT.nome} por R$ ${KIT.agora}`}>
            <img className="bn-cao" src={KIT.img} alt="Kit Completo para cães: o pacote Original, a Mordida e o pote do Suplemento Integral" />
          </a>
        </div>

        <p className="bn-preco-topo">
          de <s>R$ {KIT.cheio}</s> por <strong>R$ {KIT.agora}</strong>
        </p>

        <div className="bn-cta-texto">
          <a className="bn-botao" href={comprar("titulo")} data-cta="titulo">Comprar agora →</a>
        </div>
      </header>

      {/* A grade em perspectiva da peça, fazendo o "chão" entre o cartaz e o conteúdo. */}
      <div className="bn-grade-chao" aria-hidden />
      </div>

      {/* Barra fixa: aqui ela COMPRA, não rola — há um produto só. */}
      <a className="bn-barra" href={comprar("barra")} data-cta="barra">
        <span className="bn-barra-txt">O seu presente<small>o kit inteiro por R$ {KIT.agora}</small></span>
        <strong className="bn-barra-btn">Pegar →</strong>
      </a>

      {/* Olivia, 27/10: "aí logo embaixo, os vídeos". Quem nunca viu a marca precisa de gente
          antes de qualquer explicação. Regra da casa (Olivia, 02/10): página com vídeo de
          creator fica sem review, nem em foto nem em texto. */}
      <div className="bn-reels">
        <VideosVencedores reels={[VIDEOS.vitydalmata, VIDEOS.omeninomerlin, VIDEOS.pitanga, VIDEOS.sushijullie, VIDEOS.mytribesete, VIDEOS.pipo, VIDEOS.carla, VIDEOS.gabi]} />
      </div>

      {/* A explicação do que é a marca vem DEPOIS dos vídeos: a pessoa já viu cães comendo. */}
      <section className="bn-bloco bnt-oque bng-bloco--1">
        <p className="bn-texto">
          Comida de Dragão é alimento de larva de mosca soldado negro para cães: uma proteína
          que o seu provavelmente nunca comeu, e que o corpo dele aproveita quase inteira.
        </p>
      </section>

      <section className="bn-bloco bng-bloco--2">
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
        <a className="bn-botao" href={comprar("caixa")} data-cta="caixa">Pegar o meu por R$ {KIT.agora} →</a>
      </section>

      <section className="bn-bloco bng-bloco--3">
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
        <a className="bn-botao" href={comprar("ciencia")} data-cta="ciencia">Pegar o presente →</a>
      </section>

      <section className="bn-bloco bng-bloco--4">
        <h2 className="bn-h2">Antes de comprar</h2>
        <div className="bn-faq">
          {FAQ.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>

      <footer className="bn-fim">
        <p className="bn-oferta-chamada">
          Boas-vindas: o kit inteiro por <strong>R$ {KIT.agora}</strong>. Até {FIM_CURTO}.
        </p>
        <a className="bn-botao" href={comprar("final")} data-cta="final">Pegar o presente →</a>
        <img className="bn-dragao" src="/assets/halloween/silhueta-dragao.webp" alt="" aria-hidden />
      </footer>
    </div>
  );
}
