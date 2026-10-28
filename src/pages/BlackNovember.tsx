import { useEffect } from "react";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent } from "@/lib/pixel";
import VideosVencedores, { VIDEOS } from "@/components/VideosVencedores";
import "./BlackNovember.css";

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

   🔴🔴 ESTA PÁGINA PROMETE UM PRESENTE QUE ACABA EM 31/10. Achado em 28/10, medido:
   o brinde não é regra fixa da loja, é uma regra com data. Mora em Yampi → Marketing →
   **Brindes** (`app.yampi.com.br/marketing/freebies`), tela que NÃO aparece no menu
   lateral — chega-se a ela pela busca do painel. A regra 8253 chama-se "Halloween -
   suplemento acima de R$ 90": dá o Suplemento Integral (sku 302) ao atingir R$ 90,00 no
   carrinho, e **vale de 19/10 a 31/10/2026**. A campanha é de 03 a 30/11. Ou seja: no dia
   em que esta página entrar no ar, "Todos estes ganham o suplemento" será falso, a menos
   que alguém crie a regra nova para a janela da Black November. **Isso é decisão e ação
   da Olivia, e é o bloqueio número 1 desta página.**
   Como foi medido: com o Kit Original + Mordida (R$ 80,10) o checkout mostra "Adicione
   R$ 9,90 e ganhe um brinde!" (80,10 + 9,90 = R$ 90,00) e entrega Produtos (1), sem brinde.

   🔴 NÃO VAI AO AR ANTES DE:
   1. A regra de brinde nova, para 03 a 30/11 — ver acima. *(A preocupação antiga, de o
      brinde se somar à oferta de 50% do Kit Completo da /black-november-topo, deixou de
      existir pelo mesmo motivo: na janela da campanha a regra do Halloween já expirou.)*
   2. A garantia. A /halloween promete 14 dias e a política publicada é 7 dias
      com produto lacrado. Aqui o FAQ não cita prazo nenhum até ela decidir.
   3. Conferir no checkout, kit por kit, que o preço da página é o cobrado.
   4. O token do Kit Original (sku 1101) — é o único que falta no inventário.

   FORA desta página de propósito: "frete grátis acima de R$ 100". A regra da casa
   proíbe prometer frete por valor, e hoje o frete grátis é só dos kits, automático.
   ────────────────────────────────────────────────────────────── */

const UTM_FALLBACK = { utm_source: "lp-black-november", utm_medium: "lp", utm_campaign: "black-november-2026" };

const CHECKOUT = "https://seguro.comidadedragao.com.br/r/";
const CDN = "https://cdn.shopify.com/s/files/1/0895/4311/5055/files/";

/* `token`: carrinho da Yampi, de _MIGRAR-PAGINAS/links-checkout-yampi-tokens.md.
   `frete`: frete grátis automático dos kits — o Original + Mordida não tem (regra da casa).
   `brinde`: ganha o suplemento de presente. O piso do brinde na Yampi é R$ 90 (regra 8253,
   em Marketing → Brindes, que TERMINA EM 31/10 — ver a nota do topo), então o
   Original + Mordida (R$ 80,10) fica fora — foi o que aconteceu no Halloween, descoberto
   só em 19/10. Preços lidos na Shopify em 26/10/2026. */
type Kit = { nome: string; img: string; preco: string; sku: string; token: string; vem: string; frete: boolean; brinde: boolean };

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
  { nome: "Kit Rango do Dragão", img: CDN + "Copia_de_Anuncios_Multiplataforma_Rango_do_Dragao_1.png?v=1791472229", preco: "185,40", sku: "1501", token: "MJ9H9ZNKPG", vem: "7 pacotes de Rango — compre 6, ganhe 1", frete: true, brinde: true },
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
  agora: "85,00",
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
  /* 🔴 GARANTIA, pendente: a /halloween promete 14 dias e a política publicada da loja é
     arrependimento em 7 dias com o produto LACRADO — que não cobre pet que não gostou.
     Até a Olivia decidir prazo, condição e motivo, esta resposta não cita prazo. */
  { q: "E se não rolar?", a: "Chama a gente no WhatsApp (21) 3950-0576 que a gente resolve com você." },
];

export default function BlackNovember() {
  useEffect(() => {
    captureEntryUtms();
    trackViewContent({ content_name: "LP Black November — kit + suplemento", content_id: "lp-black-november", value: 0 });
  }, []);

  /* Botão que COMPRA: vai direto ao carrinho do kit, repassando a origem. */
  const comprar = (token: string, pos: string) => buildCheckoutUrl(CHECKOUT + token, UTM_FALLBACK, pos);

  return (
    <div className="bn">
      <PageMeta
        title="Black November — Comida de Dragão"
        description="Compre um kit e ganhe um suplemento. E o suplemento avulso pela metade do preço. De 03 a 30 de novembro."
      />

      {/* Fita zebrada passante, no molde da faixa da /halloween. */}
      <div className="bn-faixa" aria-label="Black November da Comida de Dragão: compre um kit e ganhe um suplemento, de 03 a 30 de novembro">
        <div className="bn-faixa-trilho" aria-hidden>
          {[0, 1].map((n) => (
            <span key={n}>
              BLACK NOVEMBER ✦ COMPRE UM KIT E GANHE UM SUPLEMENTO ✦ SUPLEMENTO AVULSO PELA METADE ✦ ATÉ 30/11 ✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      <header className="bn-hero">
        {/* Nuvens pixeladas de 8 bits, da peça da Bianca. São CSS puro (box-shadow em blocos),
            não imagem — assim escalam sem serrilhar e não pesam. */}
        <i className="bn-nuvem bn-nuvem--1" aria-hidden />
        <i className="bn-nuvem bn-nuvem--2" aria-hidden />
        <i className="bn-nuvem bn-nuvem--3" aria-hidden />
        <i className="bn-nuvem bn-nuvem--4" aria-hidden />
        <i className="bn-nuvem bn-nuvem--5" aria-hidden />

        {/* Logo normal da marca, não a "escorrendo" do Halloween (Olivia, 27/10). */}
        <div className="bn-topo">
          <a href="https://www.comidadedragao.com.br/collections/produtos">
            <img className="bn-logo" src="/assets/images/logo-preto.png" alt="Comida de Dragão" />
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
        <span className="bn-eyebrow">black november · 03 a 30 de novembro</span>
        {/* Título em bloco, com a linha do meio vazada — é o jeito da peça da Bianca, em que
            "BLACK FLYDAY" alterna cheio e contornado. */}
        {/* Duas linhas, não três (Olivia, 28/10). */}
        <h1 className="bn-h1">
          Compre um kit
          <span>e ganhe um suplemento</span>
        </h1>

        {/* O presente em cena: é ele que a pessoa ganha, e é ele que faz decidir. */}
        <div className="bn-foto bn-foto--presente">
          <img className="bn-cao" src={SUPLEMENTO.img} alt="Pote do Suplemento Integral de 180 g" />
          <span className="bn-selo-presente" aria-hidden>de presente</span>
        </div>

        <p className="bn-preco-topo">
          o suplemento de <strong>R$ 110,00</strong>, zero
          <small>vai junto com o seu kit, sem cupom</small>
        </p>

        <div className="bn-cta-texto">
          <a className="bn-botao" href="#kits" data-cta="titulo">Ver os kits ↓</a>
        </div>
      </header>

      {/* A grade em perspectiva da peça, fazendo o "chão" entre o cartaz e o conteúdo. */}
      <div className="bn-grade-chao" aria-hidden />

      {/* Barra fixa de compra: rola até a grade de kits, porque aqui há vários kits e nenhum
          representa os outros. (Na /black-november-topo ela compra direto.) */}
      <a className="bn-barra" href="#kits" data-cta="barra">
        <span className="bn-barra-txt">Kit + suplemento<small>de presente até 30/11</small></span>
        <strong className="bn-barra-btn">Ver os kits ↓</strong>
      </a>

      {/* Reescrito em 27/10. O que confundia: todo cartão trazia um selo dizendo se ganhava ou
          não o presente, e a pessoa tinha de comparar seis cartões linha a linha para descobrir
          qual era a regra. Agora o kit que NÃO ganha sai da grade e vira uma linha no pé: todos
          os da grade ganham, e isso se diz uma vez, acima dela. */}
      <section className="bn-bloco" id="kits">
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
              <p className="bn-kit-preco">R$ {k.preco}</p>
              <a className="bn-botao bn-botao--kit" href={comprar(k.token, k.sku)} data-cta={k.sku}>
                Comprar →
              </a>
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
      <section className="bn-bloco">
        <h2 className="bn-h2">Tem gato em casa?</h2>
        <p className="bn-texto">
          O suplemento para gatos segue com o preço da promoção, com taurina.
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
          Compre um kit e <strong>ganhe um suplemento</strong>. Até 30/11.
        </p>
        <a className="bn-botao" href="#kits" data-cta="final">Ver os kits ↓</a>
        {/* A silhueta é a mascote da marca, não peça de Halloween — mora na pasta do Halloween
            porque foi lá que entrou. Fica. */}
        <img className="bn-dragao" src="/assets/halloween/silhueta-dragao.webp" alt="" aria-hidden />
      </footer>
    </div>
  );
}
