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

   🔴 NÃO VAI AO AR ANTES DE:
   1. A decisão do brinde. O brinde da Yampi dispara a partir de R$ 90 e o Kit
      Completo a 50% custa R$ 92,30: do jeito que está, ele ganha o suplemento
      extra, contra a decisão da Olivia. Por isso a oferta de 50% do Kit Completo
      NÃO está nesta página ainda — ela é da /black-november-topo, que espera a
      decisão. Ver item 1a do plano.
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
   `brinde`: ganha o suplemento de presente. O piso do brinde na Yampi é R$ 90, então o
   Original + Mordida (R$ 80,10) fica fora — foi o que aconteceu no Halloween, descoberto
   só em 19/10. Preços lidos na Shopify em 26/10/2026. */
type Kit = { nome: string; img: string; preco: string; sku: string; token: string; vem: string; frete: boolean; brinde: boolean };

const KITS: Kit[] = [
  { nome: "Kit Completo para Cães", img: CDN + "kit-dog-supremo.png?v=1785150064", preco: "184,60", sku: "1306", token: "GPGITR0VZ1", vem: "Original 90g + Mordida 180g + Suplemento Integral 180g", frete: true, brinde: true },
  { nome: "Kit Comida de Dragão para Cães", img: CDN + "Anuncios_Multiplataforma_Mordida_Suplemento_030f2ec7-353e-45e0-ae37-979a624c15ec.png?v=1785160455", preco: "144,50", sku: "1302", token: "KQXZ5J7LWK", vem: "Original 90g + Suplemento Integral 180g", frete: true, brinde: true },
  { nome: "Kit Mordida + Suplemento", img: CDN + "kit-dog-mordida-suplemento.png?v=1785150064", preco: "144,50", sku: "1305", token: "ZWOQZDQBW1", vem: "Mordida 180g + Suplemento Integral 180g", frete: true, brinde: true },
  { nome: "Kit Rango do Dragão", img: CDN + "Copia_de_Anuncios_Multiplataforma_Rango_do_Dragao_1.png?v=1791472229", preco: "185,40", sku: "1501", token: "MJ9H9ZNKPG", vem: "7 pacotes de Rango — compre 6, ganhe 1", frete: true, brinde: true },
  { nome: "Kit 3 Mordidas", img: CDN + "kit-mordidas.png?v=1785150064", preco: "120,20", sku: "1304", token: "AMX9A1HEPD", vem: "3 Mordida de 180g", frete: true, brinde: true },
  { nome: "Kit Original + Mordida", img: CDN + "kit-petiscos.png?v=1785150064", preco: "80,10", sku: "1303", token: "8YXY3HISC4", vem: "Original 90g + Mordida 180g", frete: false, brinde: false },
  /* 🔴 FALTA O TOKEN: Kit Comida de Dragão Original (3 Original), sku 1101, R$ 120,20.
     É o único kit sem carrinho no inventário da casa. Pedir, não improvisar — por isso
     ele não está nesta lista: kit sem token é botão que não leva a lugar nenhum. */
];

/* O suplemento avulso a 50% (Olivia, 26/10). Preço cheio lido na Shopify em 26/10.
   🔴 O desconto precisa existir no checkout antes de a página ir ao ar. */
const SUPLEMENTO = {
  img: CDN + "Anuncios_Multiplataforma_Suplemento_Integral.png?v=1785161368",
  token: "BII063ST2H",
  cheio: "110,00",
  agora: "55,00",
};

/* O gato mantém o preço do Halloween (Olivia, 26/10).
   🔴 Estoque lido em 26/10: −18. Sem reposição, esta oferta não se sustenta e o bloco
   tem de sair da página. */
const GATO = {
  img: CDN + "Anuncios_Multiplataforma_Suplemento_Integral.png?v=1785161368",
  token: "4DO9WVBVH0",
  cheio: "110,00",
  agora: "85,00",
};

const FAQ = [
  { q: "O suplemento de presente vem como?", a: "Ele entra sozinho no seu pedido quando você escolhe um kit, sem cupom. Chega na mesma caixa." },
  { q: "Vale para qualquer kit?", a: "Vale para os kits a partir de R$ 90. O Kit Original + Mordida, de R$ 80,10, fica fora — nele o presente não entra." },
  { q: "Até quando vale?", a: "Até 30 de novembro, ou enquanto durar o estoque do suplemento." },
  { q: "É larva mesmo?", a: "É. Larva de mosca soldado negro, criada para isso e desidratada. Proteína que o seu pet reconhece como comida." },
  { q: "Serve para pet com alergia?", a: "A proteína da larva é hipoalergênica, e é por isso que ela costuma funcionar em quem reage a frango e a boi. Na Mordida há ovo em pó, então nela o que é hipoalergênico é a proteína, não o petisco inteiro." },
  /* 🔴 GARANTIA, pendente: a /halloween promete 14 dias e a política publicada da loja é
     arrependimento em 7 dias com o produto LACRADO — que não cobre pet que não gostou.
     Até a Olivia decidir prazo, condição do produto e motivo coberto, esta resposta não
     cita prazo nenhum. Não é marcador de preenchimento: é verdadeira como está. */
  { q: "E se o meu pet não gostar?", a: "Fala com a gente no WhatsApp (21) 3950-0576 que a gente resolve com você." },
  { q: "Ficou outra dúvida?", a: "Chama no WhatsApp: (21) 3950-0576." },
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
        {/* Logo normal da marca, não a "escorrendo" do Halloween (Olivia, 27/10: tirar o que é
            de Halloween daqui). O arquivo é preto com fundo transparente; o CSS inverte. */}
        <div className="bn-topo">
          <a href="https://www.comidadedragao.com.br/collections/produtos">
            <img className="bn-logo" src="/assets/images/logo-preto.png" alt="Comida de Dragão" />
          </a>
          <a className="bn-voltar" href="https://www.comidadedragao.com.br/">voltar para a home</a>
        </div>

        {/* Reescrito em 27/10: a Olivia achou a primeira tela confusa, e estava.
            O que confundia: três números de uma vez ("de R$ 80,10 a R$ 185,40" mais "a partir
            de R$ 90"), nenhum deles sendo O preço; e a foto de um kit no topo, que fazia parecer
            que a oferta era daquele kit só.
            Agora a primeira tela mostra UMA coisa: o PRESENTE. É o que a oferta é — o resto
            (qual kit, por quanto) se resolve na grade, um kit por cartão. */}
        <span className="bn-eyebrow">black november · 03 a 30 de novembro</span>
        <h1 className="bn-h1">Compre um kit e<br /><span>ganhe um suplemento.</span></h1>

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

      {/* Barra fixa de compra: rola até a grade, porque aqui há vários kits e nenhum
          representa os outros. (Na /black-november-topo ela vai compr direto.) */}
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
          {KITS.filter((k) => k.brinde).map((k) => (
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

        {/* O que fica abaixo do piso do presente, dito uma vez e sem alarde — mas dito, porque
            esconder um kit da página também confunde quem já o conhece. */}
        {KITS.filter((k) => !k.brinde).map((k) => (
          <p className="bn-kit-fora" key={k.sku}>
            Procurando o {k.nome}? Ele custa R$ {k.preco} e fica abaixo do valor do presente, então
            vai sem o suplemento. <a href={comprar(k.token, k.sku)} data-cta={k.sku}>Comprar assim mesmo →</a>
          </p>
        ))}
      </section>

      {/* Prova social: os vídeos dos creators. Regra da casa (Olivia, 02/10): página com
          vídeo de creator fica sem review, nem em foto nem em texto. */}
      <div className="bn-reels">
        <VideosVencedores reels={[VIDEOS.vitydalmata, VIDEOS.omeninomerlin, VIDEOS.pitanga, VIDEOS.sushijullie, VIDEOS.mytribesete, VIDEOS.pipo, VIDEOS.carla, VIDEOS.gabi]} />
      </div>

      <section className="bn-bloco bn-bloco--avulso">
        <h2 className="bn-h2">Só o suplemento,<br /><span>pela metade do preço.</span></h2>
        <p className="bn-texto">
          Se o seu pet já come a ração dele e você só quer somar proteína à tigela, é este.
          No mínimo 40% de proteína, podendo chegar a 45%, com perfil completo de aminoácidos
          essenciais. Hipoalergênico.
        </p>
        <div className="bn-avulso">
          <img className="bn-avulso-foto" src={SUPLEMENTO.img} alt="Suplemento Integral de 180 g" loading="lazy" />
          <div className="bn-avulso-txt">
            <h3 className="bn-kit-nome">Suplemento Integral · 180 g</h3>
            <p className="bn-kit-preco">
              <s>R$ {SUPLEMENTO.cheio}</s> R$ {SUPLEMENTO.agora}
            </p>
            <a className="bn-botao" href={comprar(SUPLEMENTO.token, "suplemento")} data-cta="suplemento">
              Comprar →
            </a>
          </div>
        </div>
        <p className="bn-balao bn-balao--dir">“metade do preço, dobro de larva. é matemática”</p>
      </section>

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
