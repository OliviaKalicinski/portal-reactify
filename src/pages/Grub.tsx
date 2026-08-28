import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent, trackAddToCart } from "@/lib/pixel";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Grub.css";
import LeadPopup from "@/components/LeadPopup";

/* ──────────────────────────────────────────────────────────────
   LP CAMPANHA — GRUB · REPTEIS & ANFIBIOS · /grub
   Página satélite · tráfego pago · público frio (Non-Brand "por dor").
   Tema: DEPENDÊNCIA DO INSETO VIVO / CRIADOURO EM CASA.
   Produto-foco: GRUB · SKU 401 · token Yampi 9ZCGSMOOBC · R$110,00.

   ⚠️ POR QUE ESTE ÂNGULO — mineração de keywords 28/07/2026
   (`PROJETOS/Google & TikTok Ads/brief/mineracao-keywords-grub-repteis-
   2026-07-28.md`, fonte Google Keyword Planner):

   1. A CATEGORIA DO PRODUTO NÃO É BUSCADA. "gel para répteis", "comida
      para répteis", "alimento para leopard gecko" — todos abaixo do
      limiar de medição. O Grub inventou um formato sem vocabulário no
      Brasil. Vender pelo nome da categoria = repetir o grupo Alergia de
      junho (termo de produto, CTR 0,33%).
   2. A DEMANDA ESTÁ NO INSETO. `tenébrio` 4.400/mês; o cluster passa de
      9.000. E `criação de tenébrio` = 480/mês — gente pesquisando como
      criar larva DENTRO DE CASA. É a dor em estado puro.
   3. TERMO DE ESPÉCIE É ARMADILHA. `teiú` 18.100 e `leopardo gecko`
      14.800 parecem ouro, mas a expansão é morph, cor, preço e venda:
      é público comprando o ANIMAL, não alimentando.

   ⚠️ O ÂNGULO NÃO É "PARE DE DAR INSETO" — é "pare de DEPENDER do
   criadouro". Quem cria réptil GOSTA de dar inseto; o que ele odeia é a
   dependência (odor, colônia morrendo, polvilhar cálcio, custo semanal).

   ⚠️ GUARDRAILS DESTA PÁGINA:
   - O Grub é ALIMENTO COMPLETO (Olivia, 28/07) — mas NÃO é dieta única.
     O réptil precisa de alimentação variada. Essas duas frases são
     parecidas e dizem coisas diferentes: a página não pode escorregar.
   - ❌ SEM PERCENTUAL DE PROTEÍNA NA COPY. A ficha técnica está com
     defeito: pág. 1 diz 40% (valor herdado do Original) e pág. 2 diz 47%.
     Ver `BIBLIOTECA/02 - Produtos/Ficha Técnica/_CORRIGIR - ficha-tecnica-
     grub (2026-07-28).md`. Liberar o número SÓ quando a ficha fechar.
   - ❌ SEM FRETE GRÁTIS. O Grub custa R$110 e o piso é R$150 (Olivia,
     28/07). A página usa isso como empurrão pra 2ª unidade, não como
     promessa.
   - ⚠️ TARTARUGA/QUELÔNIO = COMPLEMENTO, nunca alimento base (DOC2:
     "quelônios/tartarugas — apenas complemento", uso esporádico).
     Entrar nesse mercado foi decisão da Olivia em 28/07; a promessa fica
     limitada.
   - ⛔ TARÂNTULA NÃO É INDICADA para nenhum produto da linha (DOC2).
   - ❌ SEM REVIEW INVENTADA. Não há review de Grub no banco. O slider usa
      só foto de produto até alguém puxar review real do Judge.me.
────────────────────────────────────────────────────────────── */

const PRICE = "110,00";        // Shopify, verificado 28/07/2026 · SKU 401
const FRETE_GRATIS_A_PARTIR = "150,00";
/* Grub — Répteis & Anfíbios · SKU 401 · token 9ZCGSMOOBC */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/9ZCGSMOOBC`;

/* ⚠️ PENDENTE — não usar na copy até a ficha técnica ser corrigida.
   Deixado aqui pra ser uma linha só de mudança quando fechar. */
const PROTEINA_PCT_PENDENTE = null; // 47% (pág.2/DOC2) vs 40% (pág.1). Ver _CORRIGIR.

/* Identidade do produto pros eventos do Meta (26/08). SKU 401 e R$ 110,00
   conferidos no conector da Shopify. Antes daqui o pixel só via PageView nesta
   página, e o InitiateCheckout acontecia só no domínio do checkout — não dava
   pra montar público de quem viu o Grub a não ser por regra de URL. */
const PIXEL_PRODUTO = {
  content_name: "Grub 120g — répteis e anfíbios",
  content_id: "401",
  value: 110,
};

const UTM_FALLBACK = {
  utm_source: "lp-grub",
  utm_medium: "lp",
  utm_campaign: "lp-grub",
};

const ctaUrl = (cta: "hero" | "oferta" | "final" | "sticky") =>
  buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

/* ⚠️ hero em .webp de propósito: o grub-frente.PNG tem 4,3 MB (o hero da
   /gato-coceira tem 483 KB). Numa LP onde o gargalo é ATENÇÃO, 4,3 MB com
   fetchPriority="high" mata a página antes dela abrir. O .webp tem 131 KB.
   O .png fica só como og:image, que é lido por scraper e não pelo usuário. */
const HERO_IMG = "/assets/images/produtos/grub-frente.webp";
const OG_IMG = "/assets/images/produtos/grub-frente-og.png";

const CHIPS = [
  "🦎 Répteis e anfíbios",
  "🛡️ Compra segura",
  "🏭 Fábrica registrada",
  "💚 Garantia 14 dias",
];

/* ⚠️ REBALANCEADO 28/07 (feedback da Olivia): a praticidade fica, mas o
   "inseto vivo" deixa de ser a página inteira e vira UM argumento entre
   outros. O peso vai pra composição (três farinhas de inseto), nutrição
   e modo de uso. */
const PROBLEMAS = [
  {
    dor: "Num dia ele come uma coisa, no outro come outra",
    causa: "e o nutriente muda junto. Variar de verdade é comprar, guardar e revezar três coisas — quase ninguém mantém.",
  },
  {
    dor: "O cálcio fica por sua conta",
    causa: "é pra isso que serve aquele pó que se polvilha antes de servir. E é por isso que esquecer algumas vezes cobra caro lá na frente.",
  },
  {
    dor: "Guardar bicho vivo em casa cansa",
    causa: "tem cheiro, ocupa espaço e sempre acaba na semana em que você não pode sair pra comprar.",
  },
];

const BENEFICIOS = [
  {
    stat: "2,5",
    statLbl: "vezes mais cálcio que fósforo",
    title: "A conta que não dá pra errar",
    desc: "Réptil precisa de <strong>bem mais cálcio do que fósforo</strong>, e quase todo inseto vem ao contrário — por isso o pó que se polvilha antes de servir. Faltando cálcio por meses, o osso fica <strong>fraco e mole</strong>, e quando dá pra ver já foi longe. Aqui a conta <strong>já sai certa de fábrica</strong>.",
  },
  {
    stat: "3",
    statLbl: "insetos no pote",
    title: "Larva, grilo e tenébrio",
    desc: "São <strong>três</strong> — larva de mosca soldado negra, grilo preto e tenébrio —, mais cúrcuma, spirulina e levedura. A variedade que você montaria com três potes diferentes, igual em toda porção.",
  },
  {
    stat: "2 min",
    statLbl: "e está na tigela",
    title: "E ainda é rápido de fazer",
    desc: "Vira <strong>gel firme</strong> ou <strong>papinha</strong>, do jeito que ele aceita melhor. Fechado dura <strong>meses</strong>; pronto, de 3 a 5 dias na geladeira. E <strong>não tem cheiro</strong> — nem no pote, nem na casa.",
  },
];

/* Bloco de preparo — entrou no lugar da seção "a gente não veio brigar com
   o inseto vivo", que virou item de FAQ. Praticidade demonstrada vale mais
   que praticidade afirmada. Proporções conferidas no DOC2. */
const PREPARO = [
  {
    modo: "Gel firme",
    receita: "2 partes de água quente para 1 de Grub",
    como: "Misture até dissolver e deixe gelificar, em temperatura ambiente ou na geladeira. Corta em cubos e vai pro pote.",
  },
  {
    modo: "Papinha cremosa",
    receita: "3 partes de água morna para 1 de Grub",
    como: "Água morna de torneira quente, não fervendo. Misture até ficar sem grumos e sirva em temperatura ambiente. É a versão pra iguana e pros geckos-de-crista.",
  },
];

/* Lista de bichos — pedido da Olivia (28/07): estava enterrada no FAQ e
   precisava virar seção visível.
   ⚠️ Nomes escolhidos pelo que a MINERAÇÃO mostrou que as pessoas digitam,
   não pelo que a ficha usa: `dragão barbudo` faz 14.800/mês contra 8.100 de
   `pogona`; `gecko leopardo` e `leopardo gecko` somam mais que "leopard
   gecko"; `gecko de crista` (590) em vez de "crested". Nome científico fica
   de fora — quem procura não escreve Eublepharis macularius.
   Hierarquia vem do DOC2 (uso em todos os estágios / frequente / complementar
   / esporádico / anfíbios). */
const BICHOS = [
  {
    quando: "Pode sempre, em qualquer idade",
    quem: "Gecko-leopardo · teiú preto-e-branco · teiú-vermelho",
  },
  {
    quando: "Bastante enquanto é filhote e jovem",
    quem: "Dragão-barbudo (pogona) — quando cresce, umas 1x por semana junto com os vegetais",
  },
  {
    quando: "Como parte da comida do dia",
    quem: "Tokay · lagartixa-de-madagascar · lagarto-de-língua-azul · varano · jacarerana (essa junto com inseto e peixe)",
  },
  {
    quando: "De vez em quando, na versão mais aguada",
    quem: "Iguana-verde · gecko-de-crista · leachianus",
  },
  {
    quando: "Anfíbios",
    quem: "Sapo-pacman · sapo-pipa · sapo-boi · rãs de árvore · salamandras",
  },
  {
    quando: "Só como complemento",
    quem: "Jabuti, tartaruga e outros quelônios — entra de vez em quando, nunca como a comida principal deles",
  },
];

/* ⚠️ 26/08: as cinco fotos levavam a MESMA badge ("o pote"), o que jogava fora a
   única imagem da página com bicho vivo (a grub-05). Agora cada slide diz o que
   é, e a foto do bicho leva legenda — com a ressalva de quelônio, que o DOC2
   exige e que a foto sozinha não dá.
   ⚠️ Isto NÃO é prova social: é foto nossa. A prova de verdade depende de foto
   ou vídeo de cliente. Existem 2 compradores de Grub nos últimos 90 dias
   (Shopify, 26/08) — quando chegar material deles, entra aqui e vira `cliente`. */
/* ⚠️ a classe era `grb-slide-badge`, que NÃO EXISTE no Grub.css — a tag estava
   renderizando sem estilo nenhum desde que a página nasceu. O nome certo é
   `grb-slide-tag`, e `tag-orange` (lime) é o destaque que o CSS reserva pra foto
   de bicho real. */
const SLIDES: Array<{ src: string; alt: string; badge: string; cap?: string }> = [
  { badge: "o pote", src: "/assets/images/produtos/grub-frente.webp", alt: "Grub — alimento para répteis e anfíbios, pote de 120g" },
  { badge: "o pó", src: "/assets/images/produtos/grub-02.webp", alt: "Grub — o pó antes de virar gel" },
  { badge: "120g", src: "/assets/images/produtos/grub-03.webp", alt: "Grub — peso líquido de 120 gramas" },
  { badge: "o preparo", src: "/assets/images/produtos/grub-04.webp", alt: "Grub — os quatro passos do preparo" },
  {
    badge: "no bicho",
    src: "/assets/images/produtos/grub-05.webp",
    alt: "Pote de Grub ao lado de uma tartaruga",
    cap: "Em tartaruga e outros quelônios o Grub entra como complemento — a comida principal deles é outra.",
  },
];

const FAQ = [
  {
    q: "Isso substitui a alimentação do meu réptil?",
    a: "O Grub é <strong>alimento completo</strong> — mas isso não quer dizer dieta única. Réptil precisa de <strong>alimentação variada</strong>, e a gente não vai dizer o contrário. A ideia é o Grub ser a <strong>base pronta e equilibrada</strong>, com o inseto vivo virando variedade e enriquecimento — não obrigação diária.",
  },
  {
    q: "Então eu paro de dar inseto vivo?",
    a: "Não precisa, e a gente nem sugere isso. Quem cria réptil normalmente <strong>gosta</strong> de dar inseto — faz parte. O que a gente resolve é a <strong>dependência</strong>: o criadouro em casa, o cheiro, a colônia que morre e o cálcio que você tem que lembrar de polvilhar em cada um.",
  },
  {
    q: "Quanto devo servir?",
    a: "A quantidade <strong>varia conforme o bicho</strong> — espécie, idade e fase. Por isso a gente não publica uma tabela igual pra todos: a orientação do rótulo é ajustar à necessidade do animal e <strong>consultar um médico-veterinário</strong>. Na prática: ofereça uma porção, veja quanto ele consome e <strong>retire o que sobrar</strong> — gel esquecido no terrário resseca e não serve mais.",
  },
  {
    q: "O que tem dentro, exatamente?",
    a: "Farinha de larva de mosca soldado negra, farinha de grilo preto e farinha de tenébrio — as três fontes de inseto. Mais cúrcuma, spirulina, levedura de cervejaria, gelatina, fécula de mandioca modificada, <strong>lecitina de soja</strong>, páprica, goma xantana, cloreto de sódio e carbonato de cálcio. É a composição inteira do rótulo, sem corte.",
  },
  {
    q: "Como eu preparo?",
    a: "Dois jeitos, escolhe o que o seu bicho aceita melhor. <strong>Gel firme:</strong> 2 partes de água quente pra 1 de Grub, mistura e deixa endurecer. <strong>Papinha:</strong> 3 partes de água morna pra 1 de Grub, mistura até ficar sem bolinha. Depois de pronto dura de <strong>3 a 5 dias na geladeira</strong> — e dá pra congelar em porções.",
  },
  {
    q: "Serve pra qual bicho?",
    a: "Vai bem em <strong>leopard gecko, teiú-preto-e-branco e teiú-vermelho</strong> — nesses, em qualquer idade. No <strong>dragão-barbudo</strong>, enquanto ele ainda come inseto: filhote e jovem podem receber com frequência; adulto, mais ou menos 1x por semana, junto com os vegetais. Também <strong>gekko tokay, phelsumas, tiliquas e varanus</strong>. Em anfíbios: <strong>sapo-pacman, sapo-pipa, sapo-boi, rãs arborícolas e salamandras</strong>. Iguana e crested gecko aceitam em preparação mais hidratada, de forma esporádica.",
  },
  {
    q: "E pra tartaruga ou jabuti?",
    a: "Para <strong>quelônios o Grub entra como complemento</strong>, não como alimento base — a alimentação principal deles é outra. Dá pra usar como enriquecimento pontual, sem substituir a dieta.",
  },
  {
    q: "Serve pra tarântula?",
    a: "<strong>Não.</strong> Tarântulas não são espécie indicada para nenhum produto da linha Comida de Dragão. Preferimos falar isso na cara do que vender errado.",
  },
  {
    q: "Como funciona a entrega e o frete?",
    a: `Despachamos em até 1 dia útil pra todo o Brasil, com compra <strong>100% segura</strong> via Yampi — cartão, Pix ou boleto. O <strong>frete fica grátis acima de R$&nbsp;${FRETE_GRATIS_A_PARTIR}</strong>, então duas unidades já passam do valor.`,
  },
];

const Grub = () => {
  useEffect(() => {
    captureEntryUtms();
    trackViewContent(PIXEL_PRODUTO);
  }, []);

  const onCta = (cta: string) => () => trackAddToCart({ ...PIXEL_PRODUTO, cta });
  return (
    <div className="grub-lp">
      <PageMeta
        title="Alimentação para répteis e anfíbios · três insetos num pó — Comida de Dragão"
        description="Alimento em pó de três insetos — larva, grilo e tenébrio — já com o cálcio certo. Mistura com água e vira gel. Para gecko, teiú, dragão-barbudo e mais."
        image={OG_IMG}
      />
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMG} fetchPriority="high" />
      </Helmet>

      {/* ════ HERO ════ */}
      <section className="grb-hero">
        <div className="grb-hero-inner">
          <div className="grb-hero-top">
            <Link to="/portal" className="grb-backlink">← comida de dragão</Link>
            <DragonLogo className="grb-hero-logo" />
          </div>

          {/* O H1 já leva "répteis e anfíbios" + praticidade, então a eyebrow
              carrega o que sobrou de fora: composição e perfil nutricional. */}
          {/* ⚠️ "Reg. MAPA" saiu daqui em 26/08: a ficha técnica do Grub diz
              "produto ISENTO de registro no Ministério da Agricultura"; o que é
              registrado é o ESTABELECIMENTO (RJ 001924-0). As duas frases não são
              a mesma coisa e a segunda é a verdadeira. */}
          <span className="grb-hero-eyebrow">
            alimento para pet não convencional · répteis e anfíbios
          </span>

          {/* H1 lidera por COMPOSIÇÃO + PRATICIDADE (rebalanceado 28/07).
              A versão anterior liderava por "não precisa criar inseto" e
              deixava a página inteira brigando com o hobby do tutor.
              A keyword do cluster ("alimentação de répteis", ~1.000/mês)
              entra na 1ª linha da subheadline, que é o que resolve QS. */}
          {/* ⚠️ MÁXIMO 3 LINHAS RENDERIZADAS (regra da Olivia, 28/07) e o H1
              tem que dizer "répteis e anfíbios" + praticidade.
              A 82px isso é impossível: a caixa tem ~443px, o que dá ~13
              caracteres por linha, e as 10 variações testadas estouravam
              pra 4. Por isso o teto do clamp caiu pra 72px no Grub.css.
              Alternativas medidas que também fecham em 3 linhas a 72px:
              "…sem complicação." · "…com praticidade." · "…em 2 minutos."
              Escolhida a com número: mais concreta que "praticidade".
              ⚠️ "exótico" foi testado e descartado como palavra de campanha:
              `animais exóticos` faz 9.900/mês mas TODA intenção de comida
              ("alimento/ração/comida para pet exótico") está abaixo do
              limiar. Mesma armadilha de `teiú` e `leopardo gecko`. */}
          {/* ⚠️ VIRADA DE CANAL — 26/08/2026.
              O H1 anterior ("Alimentação de répteis e anfíbios, pronta.") era de
              BUSCA: nome de categoria, feito pra Quality Score, e está no git se o
              Google voltar. No feed ninguém digitou nada — o que segura é a dor.
              A keyword de categoria desceu pra eyebrow e pra subheadline, que é
              onde ela continua fazendo efeito sem gastar a primeira linha.
              Mantidas as 3 linhas renderizadas (regra da Olivia, 28/07). */}
          {/* ⚠️ HERO LITERAL — 27/08/2026, escrito pela Olivia.
              O formato não existe no Brasil: antes de qualquer promessa, a
              página tem que dizer O QUE É e PRA QUEM. Nomear a espécie é o
              caminho mais curto — ninguém pesquisa "pet não convencional",
              mas todo mundo reconhece o próprio bicho.
              ⚠️ "ALIMENTO COMPLETO" no H1 é decisão da Olivia (28/08), no
              lugar de "Comida pronta". O produto É alimento completo (Olivia,
              28/07) — e "completo" não quer dizer "dieta única": essa fronteira
              tem que continuar dita na subheadline, no FAQ e na nota do fim da
              seção de benefícios. Se sair de lá, o H1 fica sozinho prometendo
              mais do que a casa sustenta.
              ⚠️ O JABUTI ESTÁ NO H1 POR DECISÃO DA OLIVIA (27/08).
              Em quelônio o uso é DE VEZ EM QUANDO, junto do cardápio próprio
              deles (DOC2) — isso fica dito na subheadline, na lista de
              espécies e no FAQ, nessas três. Se mexer no H1, conferir que a
              subheadline continua carregando essa parte. */}
          <h1 className="grb-hero-title">
            Alimento completo<br />
            para <b className="grb-bicho">gecko</b>, <b className="grb-bicho">teiú</b>,<br />
            <b className="grb-bicho">sapo</b>, <b className="grb-bicho">rã</b> e{" "}
            <b className="grb-bicho">jabuti</b>.
          </h1>

          {/* ⚠️ Cortada de ~90 pra ~40 palavras em 26/08 (furo #8 da auditoria de
              25/08): quem vem do feed não lê parágrafo. O argumento do cálcio se
              repete inteiro na seção de benefícios — aqui basta plantar. */}
          <p className="grb-hero-sub">
            Você mistura com água e vira gel. São <strong>três insetos num pó só</strong> — larva,
            grilo e tenébrio — e o <strong>cálcio já vem na medida certa</strong>, sem polvilhar
            nada. No <strong>jabuti e nas tartarugas</strong> ele entra{" "}
            <strong>de vez em quando</strong>, junto do que eles já comem — nesses o cardápio do
            dia a dia é outro.
          </p>

          <div className="grb-hero-product-wrap">
            <img
              className="grb-hero-product"
              src={HERO_IMG}
              alt="Grub Comida de Dragão — alimento para répteis e anfíbios, 120g"
              width={460}
              height={410}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <span className="grb-hero-frete-tag">120g · rende muito</span>
          </div>

          <div className="grb-hero-price">
            <span className="grb-price-from">Grub 120g por</span>
            <span className="grb-price-now"><small>R$</small>{PRICE}</span>
            <span className="grb-price-installment">4× sem juros · frete grátis acima de R$ {FRETE_GRATIS_A_PARTIR}</span>
          </div>

          <div className="grb-hero-coupon">
            🚚 Duas unidades já passam do frete grátis · conhece um afiliado nosso? usa o cupom dele no checkout
          </div>

          <div className="grb-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="grb-btn-primary" data-cta="hero" onClick={onCta("hero")}>
              Quero o Grub →
            </a>
          </div>

          <div className="grb-hero-chips">
            {CHIPS.map((c, i) => <span className="grb-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ PRA QUEM SERVE ════
          Seção pedida pela Olivia em 28/07. Antes essa informação só existia
          no FAQ, fechada num <details> — ou seja, invisível pra quem bate o
          olho. "Serve pro meu bicho?" é a primeira pergunta de quem chega,
          e vem antes de qualquer argumento de nutrição. */}
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag">pra quem serve</span>
          <h2 className="grb-section-title">
            Serve pro seu bicho?<br /><span>Olha a lista.</span>
          </h2>
          <p className="grb-section-lead">
            Nem todo bicho come do mesmo jeito, então vale olhar onde o seu se encaixa.
          </p>

          <ul className="grb-problemas-list">
            {BICHOS.map((b, i) => (
              <li className="grb-problema-item" key={i}>
                <b>{b.quando}</b> — {b.quem}
              </li>
            ))}
          </ul>

          <p className="grb-section-lead" style={{ marginTop: 20, fontSize: 15 }}>
            <strong>Não serve pra tarântula nem outras aranhas.</strong> Nenhum produto da linha
            Comida de Dragão é indicado pra elas — a gente prefere falar isso na cara do que
            vender errado.
          </p>
        </div>
      </section>

      {/* ════ E SE ELE NÃO COMER ════
          Entrou em 27/08/2026, a partir do benchmark da categoria
          (`BIBLIOTECA/04 - Marketing & Criativos/Playbooks & Guias (referência)/
          Alimento em gel para réptil — como o mercado se comunica`).
          É a objeção nº 1 do formato no mundo inteiro: o produto líder tem
          4,2★ em 772 reviews, com 71% de 5 estrelas e 11% de 1 — ou o bicho
          come, ou o pote vira lixo. A página não tratava disso em lugar
          nenhum. Os métodos abaixo são os que os próprios criadores
          descrevem; nenhum deles é promessa de aceitação. */}
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag tag-pink">a pergunta que todo mundo faz</span>
          <h2 className="grb-section-title title-pink">
            E se ele<br /><span>não comer?</span>
          </h2>
          <p className="grb-section-lead">
            Pode acontecer, e a gente não vai fingir que não. Bicho que caça reage a{" "}
            <strong>movimento</strong> — comida parada na tigela não é o que ele espera. A boa
            notícia é que existe caminho, e quem já faz isso há tempo faz assim:
          </p>

          <ul className="grb-problemas-list">
            <li className="grb-problema-item">
              <b>Ofereça na pinça</b> — enrole um pedaço em formato de larva e balance devagar na
              frente dele. O movimento é o que liga a fome.
            </li>
            <li className="grb-problema-item">
              <b>Deixe ele sentir o cheiro</b> — um pedaço parado perto do focinho, sem insistir.
              Muitos aceitam no segundo ou terceiro dia, não no primeiro.
            </li>
            <li className="grb-problema-item">
              <b>Use como isca no que ele já come</b> — passe o gel no inseto vivo. Ele associa o
              sabor ao que já conhece.
            </li>
            <li className="grb-problema-item">
              <b>Mude a textura</b> — se recusar o gel firme, faça a papinha, que é mais aguada e
              mais fácil de lamber.
            </li>
          </ul>

          <p className="grb-section-lead" style={{ marginTop: 20, fontSize: 15 }}>
            E tem uma coisa que joga a favor: <strong>o Grub não tem cheiro</strong>. Não é o odor
            que afasta o bicho nem que toma conta da casa — e, diferente do inseto vivo, o que
            sobra não estraga em cima da hora.
          </p>
        </div>
      </section>

      {/* ════ PROBLEMA ════ */}
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag tag-pink">se isso te soa familiar</span>
          <h2 className="grb-section-title title-pink">
            O bicho come todo dia.<br /><span>O que ele recebe é que muda.</span>
          </h2>
          <p className="grb-section-lead">
            O que ele come muda toda semana, e lembrar do cálcio é sempre com você.
          </p>

          <ul className="grb-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="grb-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>

          {/* ⚠️ 27/08: "a solução" era uma SEÇÃO separada, com título e respiro
              próprios. No mobile isso custava uma tela inteira só pra trocar de
              assunto dentro do mesmo raciocínio. Virou a virada desta seção.
              ⚠️ Aqui também saiu "registro no MAPA": a ficha do Grub diz que o
              PRODUTO é isento de registro e o ESTABELECIMENTO é que é
              registrado (RJ 001924-0). */}
          <p className="grb-section-lead" style={{ marginTop: 32 }}>
            <strong>É isso que o Grub resolve.</strong> A larva é criada na nossa biofábrica no
            Rio, em <strong>fábrica registrada no MAPA</strong>. O que sai de lá é um{" "}
            <strong>pó com a proporção já fechada</strong> — em vez de você montar a dieta
            juntando produto e torcendo pra conta bater.
          </p>

          <div className="grb-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="grb-beneficio" key={i}>
                <div className="grb-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="grb-beneficio-title">{b.title}</div>
                <div className="grb-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>

          <p className="grb-section-lead" style={{ marginTop: 20, fontSize: 14, opacity: 0.7 }}>
            É alimento completo, mas para usar dentro de uma alimentação variada — não substitui
            tudo o que ele come, nem o acompanhamento do veterinário.
          </p>
        </div>
      </section>

      {/* ════ COMO SE USA ════
          Entrou no lugar da seção "a gente não veio brigar com o inseto
          vivo" (rebalanceamento de 28/07). Aquela objeção continua tratada,
          mas no FAQ — aqui o espaço nobre vai pra praticidade DEMONSTRADA.
          Proporções e prazos conferidos no DOC2. */}
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag tag-pink">como se usa</span>
          <h2 className="grb-section-title title-pink">
            Água, mexer,<br /><span>e escolher a textura.</span>
          </h2>
          <p className="grb-section-lead">
            O mesmo pote serve dos dois jeitos. Você escolhe pelo que o seu bicho aceita melhor —
            e dá pra preparar a quantidade da semana de uma vez.
          </p>

          <ul className="grb-problemas-list">
            {PREPARO.map((p, i) => (
              <li className="grb-problema-item" key={i}>
                <b>{p.modo}</b> — <strong>{p.receita}</strong>. {p.como}
              </li>
            ))}
            <li className="grb-problema-item">
              <b>Guarda fácil</b> — fechado dura <strong>meses na prateleira</strong>; preparado,
              de <strong>3 a 5 dias na geladeira</strong>. Dá pra congelar em porções e ir tirando.
            </li>
            <li className="grb-problema-item">
              <b>Não colou?</b> — <strong>a gente devolve seu dinheiro em 14 dias.</strong> Sem
              letrinha miúda.
            </li>
          </ul>
        </div>
      </section>

      {/* ════ O PRODUTO ════
          ⚠️ Sem review: não existe review de Grub no banco de Vozes &
          Argumentos nem no Judge.me até 28/07. Slider usa só foto de
          produto. NÃO inventar depoimento — quando houver review real,
          trocar aqui e reativar o badge "review". */}
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag">o pote por dentro</span>
          <h2 className="grb-section-title">
            120 gramas de pó<br /><span>que rende muito gel.</span>
          </h2>

          <div className="grb-slider" role="region" aria-label="Fotos do Grub">
            {SLIDES.map((s, i) => (
              <figure className="grb-slide" key={i}>
                <span className={`grb-slide-tag${s.cap ? " tag-orange" : ""}`}>{s.badge}</span>
                <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
                {s.cap && <figcaption className="grb-slide-cap">{s.cap}</figcaption>}
              </figure>
            ))}
          </div>
          <p className="grb-slider-hint">← arraste pra ver mais →</p>
        </div>
      </section>

      {/* ════ OFERTA ════ */}
      <section className="grb-oferta">
        <div className="grb-oferta-inner">
          <span className="grb-tag tag-lime">grub · 120g</span>
          <h2 className="grb-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            A dieta dele<br /><span>resolvida num pote</span>
          </h2>

          <div className="grb-oferta-coupon-box">
            <div className="grb-oferta-coupon-label">🚚 vantagem</div>
            <div className="grb-oferta-coupon-code">2 POTES = FRETE GRÁTIS</div>
            <div className="grb-oferta-coupon-desc">
              Grub por R$ {PRICE} · frete grátis a partir de R$ {FRETE_GRATIS_A_PARTIR}
            </div>
          </div>

          <a href={ctaUrl("oferta")} className="grb-btn-primary" data-cta="oferta" onClick={onCta("oferta")}>
            Quero o Grub · R$ {PRICE} →
          </a>

          <p className="grb-hero-note" style={{ marginTop: 16 }}>
            Compra 100% segura via Yampi · cartão, Pix ou boleto
          </p>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════ */}
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag">perguntas frequentes</span>
          <h2 className="grb-section-title">
            Antes de comprar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="grb-faq">
            {FAQ.map((f, i) => (
              <details className="grb-faq-item" key={i}>
                <summary className="grb-faq-q">{f.q}</summary>
                <div className="grb-faq-a" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="grb-garantia">
            <div className="grb-garantia-icon">💚</div>
            <div>
              <div className="grb-garantia-title">Garantia da matilha</div>
              <div className="grb-garantia-text">
                Se ele não topar em 14 dias da entrega, a gente devolve seu dinheiro.
                Sem letrinha miúda.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="grb-cta-final">
        <div className="grb-section-inner">
          <h2>Bora simplificar a dieta dele?</h2>
          <p>
            Três insetos num pote, o cálcio já na medida certa, e dois minutos de preparo.
            É alimento completo — mas ele continua precisando de comida variada.
          </p>
          <a href={ctaUrl("final")} className="grb-btn-primary" data-cta="final" onClick={onCta("final")}>
            Quero o Grub · R$ {PRICE} →
          </a>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="grb-footer">
        <div className="grb-footer-inner">
          <nav className="grb-footer-nav">
            <a href="https://www.comidadedragao.com.br">Loja</a>
            <Link to="/produtos">Linha completa</Link>
            <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/5521993049400" target="_blank" rel="noreferrer">Contato</a>
          </nav>
          <p className="grb-footer-tagline">Nojento é o desperdício.</p>
          <p className="grb-footer-credits">
            Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
          </p>
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════ */}
      {/* ⚠️ A classe TEM que ser `grb-sticky-cta` — o CSS define
          `.grb-sticky-cta { position: fixed }`. Estava como `grb-sticky`
          (herdado da /gato-coceira, que tem o MESMO bug no ar): sem casar,
          a barra perdia o `position: fixed` e virava um bloco comum no fim
          da página, ou seja, mobile ficava SEM CTA persistente.
          Achado em 28/07 auditando a página no navegador. */}
      <div className="grb-sticky-cta">
        <div className="grb-sticky-info">
          <span className="grb-sticky-name">Grub 120g</span>
          <span className="grb-sticky-price">R$ {PRICE} · 4× sem juros</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky" onClick={onCta("sticky")}>
          Comprar →
        </a>
      </div>

      {/* Popup só depois que a pessoa rolou além do hero (pedido da Olivia,
          28/07). Sem `aposSeletor` o gatilho que abria na prática era o timer
          de 15s — e as LPs de dor prendem 21 a 33s, ou seja, ele caía no meio
          da leitura da oferta. */}
      <LeadPopup slug="grub" aposSeletor=".grb-hero" />
    </div>
  );
};

export default Grub;
