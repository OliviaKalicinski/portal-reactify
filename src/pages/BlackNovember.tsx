import { useEffect } from "react";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent } from "@/lib/pixel";
import VideosVencedores, { VIDEOS } from "@/components/VideosVencedores";
import { FIM_CURTO, FIM_POR_EXTENSO, JANELA_POR_EXTENSO } from "@/lib/blackNovember";
import "./BlackNovember.css";
/* 07/11 (Olivia: "vamos para a próxima landing page", no estilo da do gato): a página usa o
   visual da /black-november-gato inteiro (classe .bng na raiz), e o que é só dela vem depois. */
import "./BlackNovemberGato.css";
import "./BlackNovemberKitsBlack.css";
import { ligarEditorPosicoes } from "@/lib/editorPosicoes";

/* ──────────────────────────────────────────────────────────────
   /black-november · Black November (03 a 30/11/2026)
   Página de VENDA da campanha, para quem JÁ CONHECE a marca: remarketing do
   Meta, e-mail e WhatsApp para a base. Clonada da /halloween.

   Visual: referência do Canva "BLACK FLYDAY" que a Olivia mandou em 26/10 —
   fundo preto, fita zebrada, balões de fala humorados. A fita e os balões são
   CSS, não imagem; as fotos de produto vêm do CDN da loja.
   🔴 A COR DA FITA É DECISÃO DELA: o Canva usa verde-limão (é o que está aqui);
   a reunião de 26/10 decidiu "fundo preto e a fita rosa da marca em amarelo".

   O plano desta página foi revisado com o Codex em 4 rodadas (aprovado) e mora em
   PROJETOS/Lançamentos & Campanhas/2026-10-26 - LPs da Black November - plano revisado com o Codex.md

   DIFERENÇA QUE MAIS IMPORTA em relação à /halloween: aqui cada botão de compra
   vai DIRETO ao carrinho da Yampi, por kit. Na /halloween o botão levava a uma
   página de kits da loja, que reescrevia o utm_content: medido em 26/10, isso
   custou o crédito de 9 pedidos (R$ 1.181,64) à landing page.

   ✅ O PRESENTE DESTA PÁGINA TEM REGRA PRÓPRIA (28/10). O brinde não é regra fixa da loja:
   é uma regra com data, em Yampi → Marketing → **Brindes** (`app.yampi.com.br/marketing/freebies`),
   tela que NÃO aparece no menu lateral — chega-se a ela pela busca do painel. A do Halloween
   (8253, "suplemento acima de R$ 90") termina em 31/10, e a campanha é de 03 a 30/11: sem
   regra nova, "Todos estes ganham o suplemento" seria falso no dia 03. Por isso foi criada a
   **8402, "Black November - suplemento acima de R$ 100"** — Suplemento Integral (sku 302),
   piso de R$ 100,00 no carrinho, de 03 a 30/11/2026. Todos os 6 kits desta página custam
   R$ 120,20 ou mais, então todos ganham e a frase continua verdadeira.

   📊 O QUE O PISO DECIDE, MEDIDO EM 28/10 (pedidos na Yampi, 19/10 a 28/10, cancelados fora):
   97 pedidos na janela, 58 levaram o brinde, e **36 deles saíram pelo Kit Original 3x — 62%
   de todos os presentes**. Dos 37 pedidos que continham esse kit, 36 ganharam o suplemento.
   A causa é a régua, não o kit: a R$ 120,20 ele é o jeito mais barato de cruzar o piso, e o
   presente de R$ 110,00 vale 91,5% do que o cliente paga. Nos kits de R$ 144,50 vale 76%, nos
   de R$ 185 vale 59%. Minha recomendação na hora foi subir o piso para R$ 130, o que tiraria
   esse kit e o 3 Mordidas; **a Olivia decidiu manter R$ 100** e deixar os dois dentro.
   O custo real do presente não entra nessa conta: a Yampi não traz custo (`price_cost` vazio
   nas 163 linhas do sku 302 que temos), então o que está medido aqui é preço de tabela.

   🔴 NÃO VAI AO AR ANTES DE:
   1. ✅ RESOLVIDO (Olivia, 30/10): vale a lei — 7 dias para devolver, produto lacrado.
      O FAQ daqui segue sem citar prazo, mandando para o WhatsApp; se for para citar,
      é "7 dias, lacrado". As 21 LPs que prometiam 14 dias foram corrigidas em 30/10.
   2. Conferir no checkout, kit por kit, que o preço da página é o cobrado.
   *(O token do Kit Original 3x, sku 1101, deixou de ser pendência: o `DZCHG52YG4` usado
   aqui foi aberto no checkout em 28/10 e trouxe "Kit Comida de Dragão Original FRETE
   GRÁTIS" a R$ 120,20. Faltava só estar no inventário de carrinhos, e já está.)*

   FORA desta página de propósito: "frete grátis acima de R$ 100". A regra da casa
   proíbe prometer frete por valor, e hoje o frete grátis é só dos kits, automático.
   ────────────────────────────────────────────────────────────── */

const UTM_FALLBACK = { utm_source: "lp-black-november", utm_medium: "lp", utm_campaign: "black-november-2026" };

const CHECKOUT = "https://seguro.comidadedragao.com.br/r/";
const CDN = "https://cdn.shopify.com/s/files/1/0895/4311/5055/files/";

/* `token`: carrinho da Yampi, de _MIGRAR-PAGINAS/links-checkout-yampi-tokens.md.
   `frete`: frete grátis automático dos kits — o Original + Mordida não tem (regra da casa).
   `brinde`: ganha o suplemento de presente. O piso é R$ 90 até 31/10 (regra 8253) e
   **R$ 100 de 03 a 30/11** (regra 8402), ambas em Marketing → Brindes — ver a nota do topo.
   Nos dois casos o Original + Mordida (R$ 80,10) fica fora — foi o que aconteceu no Halloween, descoberto
   só em 19/10. Preços lidos na Shopify em 26/10/2026. */
/* `esgotado`: sem estoque. Marca o cartão com "COMERAM TUDO!" (a mesma copy da loja) e
   troca o botão por um "Esgotado" que não leva a lugar nenhum, em vez de abrir o checkout
   com "OPS, TEMOS UM PROBLEMA! Quantidade indisponível".
   🔴 HOJE NENHUM KIT USA ISSO: o Rango, que era o caso, saiu da grade em 30/10. O
   mecanismo fica porque custa nada e resolve em uma palavra o dia em que outro kit zerar
   no meio da campanha. Para usar: `esgotado: true` na linha do kit. */
type Kit = { nome: string; img: string; preco: string; sku: string; token: string; vem: string; frete: boolean; brinde: boolean; esgotado?: boolean };

/* Ordem da grade (Olivia, 27/10): "temos que colocar os kits original e mordida em cima,
   dar preferência pra não produto repetido." Então primeiro os que juntam produtos
   DIFERENTES, com Original e Mordida na frente; por último os que repetem o mesmo item. */
/* Ordem da grade (Olivia, 28/10): "O primeiro kit de todos são os três originais, que
   são as embalagens brancas. Original com 3, Mordida com 3, Rango com 7. E aí sim vem
   os outros." Isto SUBSTITUI a ordem de 27/10 (variados primeiro).

   🔧 O Kit Original 3x tem token sim — `DZCHG52YG4`. Eu disse duas vezes que faltava
   porque procurei no inventário por "Kit Comida de Dragão Original" e a linha de lá se
   chama "Kit Original 3x". Procurar por sinônimo, não só pela palavra que eu usei. */
const KITS: Kit[] = [
  { nome: "Kit Original 3x", img: CDN + "Anuncios_Multiplataforma_Original_3x_4804eede-2fc5-41aa-b9a6-3ca0a3c2c776.png?v=1785160614", preco: "120,20", sku: "1101", token: "DZCHG52YG4", vem: "3 Original de 90g", frete: true, brinde: true },
  { nome: "Kit 3 Mordidas", img: CDN + "kit-mordidas.png?v=1785150064", preco: "120,20", sku: "1304", token: "AMX9A1HEPD", vem: "3 Mordida de 180g", frete: true, brinde: true },
  /* 🔴 O Kit Rango SAIU DA GRADE em 30/10, por decisão da Olivia: "aqui na LP podemos
     tirar o rango". Está esgotado e vai seguir assim, porque o centro de distribuição
     está mudando de volta para a biofábrica no Rio e o estoque está em transporte.
     Medido em 30/10: sku 1501 e o avulso 501 com estoque 0 na Shopify, os dois
     configurados para não vender sem estoque; o botão abria o checkout com
     "OPS, TEMOS UM PROBLEMA! Quantidade indisponível".
     Na LOJA ele continua aparecendo, com "COMERAM TUDO!" riscando o preço, porque lá
     isso é prova de que saiu muito. Aqui é página de venda de campanha, e cartão que
     não vende só ocupa a tela.
     Para trazer de volta quando o estoque chegar: descomentar a linha abaixo.
  { nome: "Kit Rango do Dragão", img: CDN + "Copia_de_Anuncios_Multiplataforma_Rango_do_Dragao_1.png?v=1791472229", preco: "185,40", sku: "1501", token: "MJ9H9ZNKPG", vem: "7 pacotes de Rango — compre 6, ganhe 1", frete: true, brinde: true },
  */
  { nome: "Kit Completo para Cães", img: CDN + "kit-dog-supremo.png?v=1785150064", preco: "184,60", sku: "1306", token: "GPGITR0VZ1", vem: "Original 90g + Mordida 180g + Suplemento Integral 180g", frete: true, brinde: true },
  { nome: "Kit Comida de Dragão para Cães", img: CDN + "Anuncios_Multiplataforma_Mordida_Suplemento_030f2ec7-353e-45e0-ae37-979a624c15ec.png?v=1785160455", preco: "144,50", sku: "1302", token: "KQXZ5J7LWK", vem: "Original 90g + Suplemento Integral 180g", frete: true, brinde: true },
  { nome: "Kit Mordida + Suplemento", img: CDN + "kit-dog-mordida-suplemento.png?v=1785150064", preco: "144,50", sku: "1305", token: "ZWOQZDQBW1", vem: "Mordida 180g + Suplemento Integral 180g", frete: true, brinde: true },
];

/* 🔴 O BLOCO DO SUPLEMENTO AVULSO A 50% SAIU DA PÁGINA em 28/10.
   Olivia: "lá embaixo, só o suplemento pela metade do preço? Tá errado. Essa promoção
   não existe, eu acho. Eu tenho que verificar." Enquanto ela não confirma, a página não
   anuncia preço que o checkout pode não cobrar.
   A imagem segue aqui porque o pote é o PRESENTE da primeira tela. */
const SUPLEMENTO = {
  img: CDN + "Anuncios_Multiplataforma_Suplemento_Integral.png?v=1785161368",
  token: "BII063ST2H",
  cheio: "110,00",
};

/* O gato mantém o preço do Halloween (Olivia, 26/10).
   🔴 Estoque lido em 26/10: −18. Sem reposição, esta oferta não se sustenta e o bloco
   tem de sair da página. */
/* 🔴 Corrigido em 28/10 (Olivia pegou): a foto aqui era a do suplemento de CÃO.
   O pote de gato é outro — laranja, com o gato e o selo de taurina. */
const GATO = {
  img: "/assets/images/produtos/suplemento-felino-frente.webp",
  token: "4DO9WVBVH0",
  cheio: "110,00",
  agora: "82,50", // 06/11 (Olivia): 25%, era R$ 85,00
};

/* FAQ reescrito em 28/10 lendo a casa, não adaptando o do Halloween (Olivia pegou que
   eu tinha copiado de outro lugar). Fontes abertas: `00_CONTEXTO_BASE/Voz da marca
   (marketing).md`, `Objeções e respostas - onde achar (índice).md` e as falas reais em
   `03 - Vozes & Argumentos (copy de reviews)/melhores-argumentos-por-dor-*.md`.
   O que a voz manda e está aplicado aqui: a quebra do nojo é a PORTA DE ENTRADA e vem
   primeiro; humor alto com o nojo e o preconceito, zero humor em problema do pet; de 3 a
   4 linhas por resposta; e o truque de credibilidade da casa — contar um defeito pequeno,
   porque "a honestinha ganha confiança". */
const FAQ = [
  { q: "Larva? Que nojo.", a: "O nojo é seu, não dele. Cachorro come inseto desde antes de existir ração — e a proteína da larva ele digere quase inteira: 88,9%. Nojento mesmo é o desperdício." },
  { q: "E se o meu não comer?", a: "Acontece de o tutor ter mais preconceito que o próprio pet. Uma cliente escreveu assim: \u201cNão acreditei quando o meu cachorro devorou! Sempre que pego o pacote ele fica doido!\u201d" },
  { q: "Vou ser sincera: cheira bem?", a: "Não. É meio fedidinho, e a sua mão vai querer sabão depois. O seu cão discorda de nós dois." },
  { q: "Serve para pet com alergia?", a: "A proteína da larva é hipoalergênica, e é por isso que ela costuma funcionar em quem reage a frango e a boi. Atenção à Mordida, que leva ovo em pó: nela o hipoalergênico é a proteína, não o petisco inteiro. Se o seu pet tem quadro alérgico, fale com o veterinário dele." },
  { q: "Tá caro.", a: "É proteína de verdade, com perfil completo de aminoácidos, no lugar de um petisco que só enche. E no kit você leva o suplemento de R$ 110,00 sem pagar nada por ele." },
  { q: "Isso faz mal para ele?", a: "Nossa larva é criada em biofábrica registrada no MAPA, do ovo ao pacote, tudo rastreável. Não é inseto apanhado por aí." },
  { q: "Como eu dou?", a: "O Original e a Mordida são petiscos: dá na mão. O Suplemento é um pó que você joga por cima da comida que ele já come." },
  /* GARANTIA (decidido por Olivia em 30/10): vale a lei — arrependimento em 7 dias com o
     produto LACRADO, que não cobre pet que não gostou. Esta resposta segue sem citar prazo,
     de propósito: manda para o WhatsApp, onde o caso é tratado um a um. */
  { q: "E se não rolar?", a: "Chama a gente no WhatsApp (21) 3950-0576 que a gente resolve com você." },
];

/* largura, em px, em que o topo é montado no celular e no computador; o topo inteiro cresce ou
   encolhe a partir dela (zoom) para caber na largura e na primeira tela. Mesmos números do gato. */
const BASE_CELULAR = 362;
const BASE_COMPUTADOR = 1023;
const ZOOM_MAX_COMPUTADOR = 1.5;

export default function BlackNovember() {
  // na prévia local, ?editar deixa a Olivia arrastar, girar e mudar o tamanho das peças do topo
  useEffect(() => ligarEditorPosicoes(
    [".bn-logo", ".bng-titulo", ".bng-eyebrow", ".bng-foto", ".bn-preco-topo", ".bn-cta-texto", ".bng-gato", ".bn-nuvem"],
    "black-november",
  ), []);

  // topo em proporção, igual ao do gato: tudo na primeira tela, em qualquer tela
  useEffect(() => {
    const aplicar = () => {
      const raiz = document.documentElement;
      const w = window.innerWidth;
      const computador = w >= 900;
      raiz.style.setProperty("--bng-zoom", "1");
      const hero = document.querySelector<HTMLElement>(".bnk .bn-hero");
      const faixa = document.querySelector<HTMLElement>(".bnk .bn-faixa")?.getBoundingClientRect().height ?? 0;
      const barra = document.querySelector<HTMLElement>(".bnk .bn-barra")?.getBoundingClientRect().height ?? 0;
      const alturaBase = hero?.getBoundingClientRect().height ?? 0;
      const kLargura = computador ? Math.min(w / BASE_COMPUTADOR, ZOOM_MAX_COMPUTADOR) : w / BASE_CELULAR;
      const kAltura = alturaBase ? (window.innerHeight - faixa - barra) / alturaBase : kLargura;
      raiz.style.setProperty("--bng-zoom", String(Math.min(kLargura, kAltura)));
    };
    aplicar();
    const imgs = [...document.querySelectorAll<HTMLImageElement>(".bnk .bn-hero img")];
    imgs.forEach((i) => { if (!i.complete) i.addEventListener("load", aplicar, { once: true }); });
    window.addEventListener("resize", aplicar);
    return () => { window.removeEventListener("resize", aplicar); document.documentElement.style.removeProperty("--bng-zoom"); };
  }, []);

  useEffect(() => {
    captureEntryUtms();
    trackViewContent({ content_name: "LP Black November — kit + suplemento", content_id: "lp-black-november", value: 0 });
  }, []);

  /* Botão que COMPRA: vai direto ao carrinho do kit, repassando a origem. */
  const comprar = (token: string, pos: string) => buildCheckoutUrl(CHECKOUT + token, UTM_FALLBACK, pos);

  return (
    <div className="bn bng bnk">
      <PageMeta
        title="Black November — Comida de Dragão"
        description={`Compre um kit e ganhe um suplemento. E o suplemento avulso pela metade do preço. ${JANELA_POR_EXTENSO[0].toUpperCase() + JANELA_POR_EXTENSO.slice(1)}.`}
      />

      {/* Fita zebrada passante, no molde da faixa da /halloween. */}
      <div className="bn-faixa" aria-label={`Black November da Comida de Dragão: compre um kit e ganhe um suplemento, ${JANELA_POR_EXTENSO}`}>
        <div className="bn-faixa-trilho" aria-hidden>
          {[0, 1].map((n) => (
            <span key={n}>
              {`BLACK NOVEMBER ✦ COMPRE UM KIT E GANHE UM SUPLEMENTO ✦ SUPLEMENTO AVULSO PELA METADE ✦ ATÉ ${FIM_CURTO} ✦\u00a0`}
            </span>
          ))}
        </div>
      </div>

      <div className="bng-ceu">
      <header className="bn-hero">
        {/* Nuvens pixeladas de 8 bits, da peça da Bianca. São CSS puro (box-shadow em blocos),
            não imagem — assim escalam sem serrilhar e não pesam. */}
        <i className="bn-nuvem bn-nuvem--1" aria-hidden />
        <i className="bn-nuvem bn-nuvem--2" aria-hidden />
        <i className="bn-nuvem bn-nuvem--3" aria-hidden />
        <i className="bn-nuvem bn-nuvem--4" aria-hidden />
        <i className="bn-nuvem bn-nuvem--5" aria-hidden />
        {/* o cachorro 8-bit de óculos das peças */}
        <img className="bng-gato bnk-cao-pixel" src="/assets/black-november/cao-pixel.png" alt="" aria-hidden />

        {/* Logo normal da marca, não a "escorrendo" do Halloween (Olivia, 27/10). */}
        <div className="bn-topo">
          <a href="https://www.comidadedragao.com.br/collections/produtos">
            <img className="bn-logo bng-logo" src="/assets/black-november/logo-3.png" alt="Comida de Dragão" />
          </a>
          <a className="bn-voltar" href="https://www.comidadedragao.com.br/">voltar para a home</a>
        </div>
        {/* 28/10: a logo deixou de ser invertida — o fundo agora é verde, não preto. */}

        {/* Reescrito em 27/10: a Olivia achou a primeira tela confusa, e estava.
            O que confundia: três números de uma vez ("de R$ 80,10 a R$ 185,40" mais "a partir
            de R$ 90"), nenhum deles sendo O preço; e a foto de um kit no topo, que fazia parecer
            que a oferta era daquele kit só.
            Agora a primeira tela mostra UMA coisa: o PRESENTE. É o que a oferta é — o resto
            (qual kit, por quanto) se resolve na grade, um kit por cartão. */}
        {/* Título em bloco, com a linha do meio vazada — é o jeito da peça da Bianca, em que
            "BLACK FLYDAY" alterna cheio e contornado. */}
        {/* Duas linhas, não três (Olivia, 28/10). */}
        {/* 07/11: o título vira o "GANHE UM SUPLEMENTO" das peças (PDF do Canva), com a
            etiqueta tortinha embaixo dizendo a condição */}
        <h1 className="bn-h1 bng-titulo">
          <img src="/assets/black-november/ganhe-um-suplemento.png" alt="Compre um kit para cães e ganhe um Suplemento Integral" />
        </h1>
        <span className="bn-eyebrow bng-eyebrow">na compra de um kit para cães</span>

        {/* O presente em cena: é ele que a pessoa ganha, e é ele que faz decidir. */}
        <div className="bn-foto bn-foto--presente bng-foto">
          <img className="bn-cao" src={SUPLEMENTO.img} alt="Pote do Suplemento Integral de 180 g" />
        </div>

        <p className="bn-preco-topo">
          de <s>R$ 110</s> por <strong>R$ 0</strong>
        </p>

        <div className="bn-cta-texto">
          <a className="bn-botao" href="#kits" data-cta="titulo">Comprar agora ↓</a>
        </div>
      </header>

      {/* A grade em perspectiva da peça, fazendo o "chão" entre o cartaz e o conteúdo. */}
      <div className="bn-grade-chao" aria-hidden />
      </div>

      {/* Barra fixa de compra: rola até a grade de kits, porque aqui há vários kits e nenhum
          representa os outros. (Na /black-november-topo ela compra direto.) */}
      <a className="bn-barra" href="#kits" data-cta="barra">
        <span className="bn-barra-txt">Kit + suplemento<small>de presente até {FIM_CURTO}</small></span>
        <strong className="bn-barra-btn">Ver os kits ↓</strong>
      </a>

      {/* Reescrito em 27/10. O que confundia: todo cartão trazia um selo dizendo se ganhava ou
          não o presente, e a pessoa tinha de comparar seis cartões linha a linha para descobrir
          qual era a regra. Agora o kit que NÃO ganha sai da grade e vira uma linha no pé: todos
          os da grade ganham, e isso se diz uma vez, acima dela. */}
      <section className="bn-bloco bng-bloco--1" id="kits">
        <h2 className="bn-h2">Escolha o kit.<br />O suplemento vem junto.</h2>
        <p className="bn-texto">
          <strong>Todos estes ganham o suplemento</strong>, e todos têm frete grátis.
          O botão abre o carrinho já com o kit dentro; o presente entra sozinho.
        </p>

        <div className="bn-grade">
          {KITS.map((k) => (
            <article className="bn-kit" key={k.sku}>
              <img className="bn-kit-foto" src={k.img} alt={k.nome} loading="lazy" />
              <h3 className="bn-kit-nome">{k.nome}</h3>
              <p className="bn-kit-vem">{k.vem}</p>
              {/* Esgotado: mesma copy da loja, "COMERAM TUDO!", e botão que não leva
                  a lugar nenhum. O preço sai de cena porque não há o que comprar. */}
              {k.esgotado ? (
                <>
                  <p className="bn-kit-preco bn-kit-preco--esgotado">COMERAM TUDO!</p>
                  <span className="bn-botao bn-botao--kit bn-botao--esgotado" aria-disabled="true">
                    Esgotado
                  </span>
                </>
              ) : (
                <>
                  <p className="bn-kit-preco">R$ {k.preco}</p>
                  <a className="bn-botao bn-botao--kit" href={comprar(k.token, k.sku)} data-cta={k.sku}>
                    Comprar →
                  </a>
                </>
              )}
            </article>
          ))}
        </div>

      </section>

      {/* Prova social: os vídeos dos creators. Regra da casa (Olivia, 02/10): página com
          vídeo de creator fica sem review, nem em foto nem em texto. */}
      <div className="bn-reels">
        <VideosVencedores reels={[VIDEOS.vitydalmata, VIDEOS.omeninomerlin, VIDEOS.pitanga, VIDEOS.sushijullie, VIDEOS.mytribesete, VIDEOS.pipo, VIDEOS.carla, VIDEOS.gabi]} />
      </div>

      {/* 🔴 O bloco do suplemento avulso a 50% saiu em 28/10 — a oferta pode não existir e a
          Olivia vai verificar. Quando ela confirmar, volta aqui, com o carrinho BII063ST2H. */}

      {/* 🔴 Bloco do gato: SAI DA PÁGINA se o estoque não for reposto (−18 em 26/10). */}
      <section className="bn-bloco bng-bloco--2">
        <h2 className="bn-h2">Tem gato em casa?</h2>
        <p className="bn-texto">
          O suplemento para gatos também está na Black, com 25% de desconto.
        </p>
        <div className="bn-avulso">
          <img className="bn-avulso-foto" src={GATO.img} alt="Suplemento para Gatos" loading="lazy" />
          <div className="bn-avulso-txt">
            <h3 className="bn-kit-nome">Suplemento para Gatos</h3>
            <p className="bn-kit-preco">
              <s>R$ {GATO.cheio}</s> R$ {GATO.agora}
            </p>
            <a className="bn-botao" href={comprar(GATO.token, "gato")} data-cta="gato">
              Comprar →
            </a>
          </div>
        </div>
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
          Compre um kit e <strong>ganhe um suplemento</strong>. Até {FIM_CURTO}.
        </p>
        <a className="bn-botao" href="#kits" data-cta="final">Ver os kits ↓</a>
        {/* A silhueta é a mascote da marca, não peça de Halloween — mora na pasta do Halloween
            porque foi lá que entrou. Fica. */}
        <img className="bn-dragao" src="/assets/halloween/silhueta-dragao.webp" alt="" aria-hidden />
      </footer>
    </div>
  );
}
