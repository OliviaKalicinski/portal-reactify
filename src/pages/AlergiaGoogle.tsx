import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Alergia.css";
import LeadPopup from "@/components/LeadPopup";

/* ──────────────────────────────────────────────────────────────
   LP CAMPANHA — ALERGIA · /alergia
   Página satélite · tráfego pago · público frio
   Tema: ALERGIA ALIMENTAR EM CÃES (a dor nº 1 dos reviews/100 dores).
   Produto-foco: KIT CACHORRO (Original + Suplemento Integral).
   Mecanismo: proteína de inseto é NOVA pro corpo → não reage =
   hipoalergênica; ácido láurico anti-inflamatório acalma a pele.

   Espelha a estrutura da LP Suplemento (mesmas seções), com prefixo
   próprio (.alergia-lp / alp-) e copy/produto de alergia.

   ⚠️ PREÇO FIXO (atualizar à mão se a loja mudar):
   - Kit Cachorro · token KQXZ5J7LWK · de R$ 145,00 (Shopify) -> R$ 130,50 com GOOGLE10 (-10%). Conferido na Shopify
     em 02/09/26. O "R$116 no site" que estava aqui era o Kit Original 3x (SKU
     1101), outro produto — nao este.
   - Shopify hoje: preço R$ 116,00 / compare-at R$ 145,00. ALIVIO (10%) entra no checkout Yampi.
   - Trocar imagens de review por screenshots de alergia reais quando tiver.
────────────────────────────────────────────────────────────── */

const COUPON = "GOOGLE10";  // 10% off — aprovado pela Olivia 10/08/26
const PRICE = "145,00";       // "de" — compare-at do Shopify (preço cheio)
const PRICE_OFF = "130,50";  // "por" — R$ 145,00 com o cupom GOOGLE10 (-10%), aplicado sozinho na URL
/* Kit Cachorro · token KQXZ5J7LWK · checkout direto Yampi (domínio seguro). */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?promocode=${COUPON}`;

const UTM_FALLBACK = {
  utm_source: "lp-alergia-google",
  utm_medium: "lp",
  utm_campaign: "lp-alergia-kit-caes-google",
};

const ctaUrl = (cta: "hero" | "oferta" | "final" | "sticky" | "secao-solucao" | "secao-prova" | "secao-hidrolisada" | "secao-aceitacao") =>
  buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

const HERO_IMG = "/assets/images/produtos/kit-caes.webp";

const CHIPS = [
  "🚚 Frete grátis",
  "🛡️ Compra segura",
  "🏭 Reg. MAPA",
  "💚 Garantia 14 dias",
];

const PROBLEMAS = [
  { dor: "Coceira sem parar, lambe e morde as patas", causa: "quase sempre é o corpo reagindo à proteína que ele come todo dia." },
  { dor: "Pele vermelha, queda de pelo e otite de repetição", causa: "inflamação que trocar de marca não resolve — às vezes piora." },
  { dor: "Intestino solto que desregula a cada troca de comida", causa: "estômago sensível costuma sumir quando a proteína é a certa." },
];

/* Seção "Se não tem pulga, por que ele se coça?" — entra ANTES do PROBLEMA.
   Existe porque as keywords que mais trazem gente nesta campanha são PERGUNTAS
   ("o que dar para cachorro que se coça", "meu cachorro se coça mas não tem pulgas")
   e a página respondia com produto. É o conteúdo que sustenta a nota de experiência
   de página no Google — hoje "Below average" em 28 de 32 keywords do Non-Brand.
   ⚠️ NÃO afirmar qual causa é mais frequente sem fonte — e NÃO citar prazo de dieta
   de eliminação sem alinhar com a garantia de 14 dias. Ver o brief de 01/09/26. */
const CAUSAS = [
  { t: "Parasita", d: "pulga, sarna, ácaro. É a primeira a descartar e a mais simples: antiparasitário resolve. Se você já tratou e a coceira continuou, pode riscar da lista." },
  { t: "Alergia ambiental", d: "pólen, ácaro de poeira, grama. Costuma variar com a época do ano, e não some com troca de comida." },
  { t: "Infecção de pele", d: "bactéria ou fungo que entrou onde ele já tinha se coçado. Vem depois de outra causa e precisa de veterinário." },
  { t: "Alergia alimentar", d: "o corpo reagindo a uma proteína que ele come todo dia. É a única que <strong>você consegue testar em casa</strong>, trocando a proteína e observando." },
];

const BENEFICIOS = [
  {
    stat: "1",
    statLbl: "proteína nova",
    title: "Hipoalergênica de verdade",
    desc: "A larva da Mosca Soldado Negra é uma proteína que o corpo do seu cão <strong>nunca encontrou</strong>. Sem histórico, sem reação. Sem frango, boi, soja ou grão.",
  },
  {
    stat: "Ω",
    statLbl: "ácido láurico",
    title: "Acalma a pele por dentro",
    desc: "Anti-inflamatório natural da própria larva. Tutores relatam a <strong>coceira dando trégua</strong> e o pet mais tranquilo em poucas semanas.",
  },
  {
    stat: "45%",
    statLbl: "proteína",
    title: "Pele, pelo e intestino",
    desc: "O suplemento reforça proteína e ômegas pra <strong>pelagem voltar a brilhar</strong> — e cai bem no intestino, com fezes mais firmes.",
  },
];

/* Prova social — abre com o Kit e segue com reviews reais de tutores
   de cães alérgicos/atópicos. ⚠️ Trocar pelas melhores prints de alergia. */
const SLIDES: Array<{ src: string; alt: string; type: "ugc" | "review" }> = [
  { type: "ugc",    src: "/assets/images/produtos/kit-caes.webp", alt: "Kit Cachorro — Original + Suplemento Integral" },
  { type: "review", src: "/assets/images/reviews/3.webp",        alt: "Review — cão alérgico comendo sem reação" },
  { type: "review", src: "/assets/images/reviews/5.webp",        alt: "Review — parou a coceira" },
  { type: "review", src: "/assets/images/reviews/7.webp",        alt: "Review — pet atópico melhorou" },
  { type: "review", src: "/assets/images/reviews/9.webp",        alt: "Review — alérgico a frango, se coça bem menos" },
  { type: "review", src: "/assets/images/reviews/4.webp",        alt: "Review — pele e pelo melhores" },
  { type: "review", src: "/assets/images/reviews/8.webp",        alt: "Review — fácil de usar, mistura na comida" },
];

/* Reviews em TEXTO — prova social que CONTA pro Índice de Qualidade do Google
   (print/imagem NÃO conta). Transcritas exatamente como o cliente escreveu
   (gírias e erros preservados) — banco "Vozes & Argumentos", dor nº1 (alergia/
   atopia/pele/intestino). NÃO inventar: só reviews reais. */
const REVIEWS_TXT = [
  {
    quote: "Maravilha pois minha <strong>pug d atópica</strong> d melhorou muito a <strong>coceira</strong> e ela <strong>não está abrindo mais feridas</strong>.",
    author: "Kátia Chamon · Rio de Janeiro/RJ · Suplemento Integral · Judge.me 5★",
  },
  {
    quote: "Maravilhoso! meu cão é <strong>alérgico a proteina de frango</strong> então o suplemento ajuda bastante na alimentação. <strong>Ele tem se coçado bem menos.</strong>",
    author: "Carolina Caballero · Porto Alegre/RS · Suplemento Concentrado · Judge.me 5★",
  },
  {
    quote: "ótimo! meu cachorro é <strong>alérgico a proteína animal e atópico</strong>, então é super complicado conseguir petiscos pra ele. Não só ele amou, como <strong>não causou nenhuma irritabilidade nem na pele nem no intestino</strong>.",
    author: "Carolina · São Paulo/SP · Kit Original 3x · Judge.me 5★",
  },
];

const FAQ = [
  {
    q: "Meu cão é alérgico ou atópico — pode dar?",
    a: "Sim — é justamente por isso que muitos tutores chegam até a gente. Inseto é uma proteína <strong>completamente diferente</strong> de frango, boi e soja, então o corpo não reage porque nunca viu antes. E o ácido láurico ajuda a acalmar a pele. Em acompanhamento veterinário, mostre o rótulo antes.",
  },
  {
    q: "Como sei que é alergia alimentar?",
    a: "Coceira persistente, lambida de pata, <strong>otite de repetição</strong>, pele vermelha e intestino solto são sinais comuns. Trocar pra uma proteína nova ajuda a observar a melhora — mas o diagnóstico é sempre com o veterinário.",
  },
  {
    q: "O que vem no Kit Cachorro?",
    a: "O <strong>Original</strong> (larvinhas inteiras, pra usar de petisco/recompensa) + o <strong>Suplemento Integral</strong> (pó pra misturar na comida). Um cuida do dia a dia, o outro reforça a refeição.",
  },
  {
    q: "Meu veterinário indicou proteína hidrolisada. Posso dar isso?",
    a: "São dois caminhos pro mesmo objetivo. A <strong>hidrolisada</strong> quebra a proteína em pedaços pequenos demais pro sistema imune reconhecer. A <strong>proteína nova</strong> (o nosso caso) resolve por outro lado: o corpo dele <strong>nunca viu</strong> a larva antes, então nunca aprendeu a reagir. Dieta de proteína nova é uma abordagem reconhecida — e o Original tem <strong>ingrediente único</strong>, o que facilita rastrear o que ele come. Não substitui a prescrição do seu vet: mostre o rótulo pra ele.",
  },
  {
    q: "Em quanto tempo vejo resultado?",
    a: "Tutores costumam relatar a <strong>coceira diminuindo em poucas semanas</strong>. Cada cão responde no seu tempo — pele e pelo levam um pouco mais.",
  },
  {
    q: "Como funciona a entrega?",
    a: "Despachamos em até 1 dia útil e o <strong>frete do Kit é grátis</strong> pra todo o Brasil. Compra <strong>100% segura</strong> via Yampi com cartão, Pix ou boleto.",
  },
];

const AlergiaGoogle = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="alergia-lp">
      {/* 19/08 — noindex: esta pagina e quase identica a /alergia e as duas
          competiriam pela mesma busca organica. Ela existe so pra separar o
          trafego do Google Ads (utm_source proprio + cupom GOOGLE10 embutido)
          e nunca esteve no sitemap. O Ads nao precisa de indexacao: o AdsBot
          rastreia a landing page independente do noindex. */}
      <PageMeta
        title="Cão se coça sem parar? Pode ser alergia alimentar — Comida de Dragão"
        description="Cão que se coça sem parar pode estar reagindo à proteína que come todo dia. Petisco e suplemento de proteína de inseto — nova pro corpo dele, hipoalergênica. Para coceira, queda de pelo e pele."
        image={HERO_IMG}
        noindex
      />
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMG} fetchPriority="high" />
      </Helmet>

      {/* ════ HERO ════ */}
      <section className="alp-hero">
        <div className="alp-hero-inner">
          <div className="alp-hero-top">
            <Link to="/portal" className="alp-backlink">← comida de dragão</Link>
            <DragonLogo className="alp-hero-logo" />
          </div>

          <span className="alp-hero-eyebrow">cão alérgico · proteína nova · hipoalergênico</span>

          <h1 className="alp-hero-title">
            Seu cão vive<br /><span>se coçando?</span>
          </h1>

          <p className="alp-hero-sub">
            Na maioria das vezes a alergia não é "do nada" — é a <strong>proteína que está na comida dele</strong>
            (frango, boi, grão) que o corpo já conhece. A Comida de Dragão é
            <strong> proteína de inseto</strong>: nova pro organismo, <strong>hipoalergênica de verdade</strong>.
            O <strong>Kit Cachorro</strong> junta o petisco e o suplemento pra cuidar da pele e do intestino.
          </p>

          <div className="alp-hero-product-wrap">
            <img
              className="alp-hero-product"
              src={HERO_IMG}
              alt="Kit Cachorro Comida de Dragão — Original + Suplemento Integral"
              width={460}
              height={410}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <span className="alp-hero-frete-tag">Kit com frete grátis</span>
          </div>

          <div className="alp-hero-price">
            <span className="alp-price-from">Kit Cachorro de <s>R$ {PRICE}</s> por</span>
            <span className="alp-price-now"><small>R$</small>{PRICE_OFF}</span>
            <span className="alp-price-installment">🚚 Frete grátis · 4× sem juros</span>
          </div>

          <div className="alp-hero-coupon">
            🏷️ <strong>10% de desconto já aplicado</strong> · 🚚 frete grátis no Kit
          </div>

          <div className="alp-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="alp-btn-primary" data-cta="hero">
              Comprar o Kit Cachorro — R$ {PRICE_OFF} →
            </a>
          </div>

          <div className="alp-hero-chips">
            {CHIPS.map((c, i) => <span className="alp-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ CAUSAS — responde antes de vender ════ */}
      <section className="alp-section">
        <div className="alp-section-inner">
          <span className="alp-tag">antes de trocar a comida</span>
          <h2 className="alp-section-title">
            Se não tem pulga,<br /><span>por que ele se coça?</span>
          </h2>
          <p className="alp-section-lead">
            Coceira em cachorro tem quatro causas comuns — e só uma delas se resolve na tigela.
            Vale saber qual é a dele antes de gastar dinheiro no palpite errado.
          </p>

          <ul className="alp-problemas-list">
            {CAUSAS.map((c, i) => (
              <li className="alp-problema-item" key={i}>
                <b>{c.t}</b> — <span dangerouslySetInnerHTML={{ __html: c.d }} />
              </li>
            ))}
          </ul>

          <p className="alp-section-lead">
            Não dá para saber qual é a dele só olhando — quem fecha esse diagnóstico é o veterinário.
            O que dá para fazer é eliminar uma causa de cada vez, e a alimentar é a mais barata de
            eliminar: troca-se por uma proteína que o corpo dele nunca viu e observa-se a pele.
          </p>

          <p className="alp-section-lead">
            <Link to="/ciencia">Como uma proteína nova não dispara alergia →</Link>
          </p>
        </div>
      </section>

      {/* ════ PROBLEMA ════ */}
      <section className="alp-section">
        <div className="alp-section-inner">
          <span className="alp-tag tag-pink">se isso te soa familiar</span>
          <h2 className="alp-section-title title-pink">
            A coceira não para? <span>Pode ser a comida.</span>
          </h2>
          <p className="alp-section-lead">
            Você já trocou de marca mil vezes e nada? Alergia alimentar é o
            corpo reagindo a uma <strong>proteína que ele come todo dia</strong> —
            e a maioria das rações e petiscos usa as mesmas (frango, boi, soja, grão).
          </p>

          <ul className="alp-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="alp-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ SOLUÇÃO ════ */}
      <section className="alp-section">
        <div className="alp-section-inner">
          <span className="alp-tag">a solução</span>
          <h2 className="alp-section-title">
            Proteína nova.<br /><span>Corpo sem reação.</span>
          </h2>
          <p className="alp-section-lead">
            A gente faz na nossa biofábrica no RJ, com <strong>registro MAPA</strong> e
            rastreabilidade do começo ao fim. A larva da Mosca Soldado Negra é uma
            proteína que o organismo do seu cão nunca viu — por isso não dispara a alergia.
          </p>

          <div className="alp-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="alp-beneficio" key={i}>
                <div className="alp-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="alp-beneficio-title">{b.title}</div>
                <div className="alp-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>

          <p className="alp-section-lead">
            <Link to="/biblioteca">Os estudos sobre proteína de inseto na alimentação animal →</Link>
          </p>

          <div className="alp-secao-cta">
            <a href={ctaUrl("secao-solucao")} className="alp-btn-primary" data-cta="secao-solucao">
              Comprar o Kit Cachorro — R$ {PRICE_OFF} →
            </a>
          </div>
        </div>
      </section>

      {/* ════ PROVA SOCIAL ════ */}
      <section className="alp-section">
        <div className="alp-section-inner">
          <span className="alp-tag">tutores reais · cães reais</span>
          <h2 className="alp-section-title">
            Atópico, alérgico<br /><span>e comendo tranquilo.</span>
          </h2>

          <div className="alp-quotes">
            {REVIEWS_TXT.map((r, i) => (
              <blockquote className="alp-quote" key={i}>
                <p dangerouslySetInnerHTML={{ __html: `“${r.quote}”` }} />
                <cite>— {r.author}</cite>
              </blockquote>
            ))}
          </div>

          <div className="alp-slider-wrap">
            <div className="alp-slider" role="region" aria-label="Reviews de tutores de cães alérgicos">
              {SLIDES.map((s, i) => (
                <figure className="alp-slide" key={i}>
                  <span className={`alp-slide-tag${s.type === "ugc" ? " tag-orange" : ""}`}>
                    {s.type === "ugc" ? "o kit" : "review"}
                  </span>
                  <img
                    src={s.src}
                    alt={s.alt}
                    width={600}
                    height={600}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>

          <p className="alp-slider-hint">← arraste pra ver mais →</p>

          <div className="alp-secao-cta">
            <a href={ctaUrl("secao-prova")} className="alp-btn-primary" data-cta="secao-prova">
              Comprar o Kit Cachorro — R$ {PRICE_OFF} →
            </a>
          </div>
        </div>
      </section>

      {/* ════ OFERTA ════ */}
      <section className="alp-oferta">
        <div className="alp-oferta-inner">
          <span className="alp-tag tag-lime">kit cachorro</span>
          <h2 className="alp-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Comece a cuidar<br /><span>da pele dele</span>
          </h2>

          <div className="alp-oferta-coupon-box">
            <div className="alp-oferta-coupon-label">🏷️ seu desconto</div>
            <div className="alp-oferta-coupon-code">10% OFF</div>
            <div className="alp-oferta-coupon-desc">Kit Cachorro de <s>R$ {PRICE}</s> por <strong>R$ {PRICE_OFF}</strong> · desconto já aplicado, sem digitar cupom · frete grátis</div>
          </div>

          <a href={ctaUrl("oferta")} className="alp-btn-primary" data-cta="oferta">
              Comprar o Kit Cachorro — R$ {PRICE_OFF} →
            </a>

          <p className="alp-hero-note" style={{ marginTop: 16 }}>
            Frete grátis no Kit · compra 100% segura via Yampi
          </p>
        </div>
      </section>

      {/* ════ HIDROLISADA vs PROTEÍNA NOVA ════
          Veio do relatório de termos de pesquisa do Google (90d): "petisco
          proteína hidrolisada" aparece como busca real e a LP não respondia.
          Quem procura isso JÁ FOI AO VETERINÁRIO — é o lead mais qualificado
          desta dor. Enquadramento: dois caminhos legítimos, sem depreciar a
          hidrolisada e sem prometer cura. Decisão final é do vet. */}
      <section className="alp-section">
        <div className="alp-section-inner">
          <span className="alp-tag tag-pink">veio do consultório?</span>
          <h2 className="alp-section-title title-pink">
            Seu vet indicou<br /><span>proteína hidrolisada?</span>
          </h2>
          <p className="alp-section-lead">
            Então ele já identificou o caminho: <strong>tirar do prato a proteína que o corpo
            dele reconhece</strong>. Existem duas formas de fazer isso — e a segunda quase
            ninguém conta pra você.
          </p>

          <ul className="alp-problemas-list">
            <li className="alp-problema-item">
              <b>Proteína hidrolisada</b> — quebra a proteína em pedaços pequenos demais pro
              sistema imune reconhecer. Funciona escondendo o alérgeno.
            </li>
            <li className="alp-problema-item">
              <b>Proteína nova</b> — é o nosso caminho. O corpo dele <strong>nunca viu</strong> a
              larva antes, então nunca aprendeu a reagir contra ela. Não tem o que esconder.
            </li>
            <li className="alp-problema-item">
              <b>Ingrediente único</b> — o Original é 100% larva, e mais nada. Numa dieta de
              eliminação isso importa: você sabe exatamente o que ele comeu.
            </li>
          </ul>

          <p className="alp-section-lead" style={{ marginTop: 20, fontSize: 14, opacity: 0.7 }}>
            Dieta de proteína nova é uma abordagem reconhecida — mas <strong>não substitui a
            prescrição do seu veterinário</strong>. Leve o rótulo pra ele e decidam juntos.
          </p>

          <div className="alp-secao-cta">
            <a href={ctaUrl("secao-hidrolisada")} className="alp-btn-primary" data-cta="secao-hidrolisada">
              Comprar o Kit Cachorro — R$ {PRICE_OFF} →
            </a>
          </div>
        </div>
      </section>

      {/* ════ E SE ELE NÃO COMER? (bloco anti-rejeição) ════
          Regra da marca: toda LP de tráfego frio tem bloco anti-rejeição
          (NPS é governado pela reação do pet: 'amou' +82, 'recusou' −50).
          Em cão a palatabilidade é forte, mas o desconfiado tem conserto —
          e a garantia derruba o risco de compra. */}
      <section className="alp-section">
        <div className="alp-section-inner">
          <span className="alp-tag tag-pink">sem susto</span>
          <h2 className="alp-section-title title-pink">
            E se ele<br /><span>estranhar no começo?</span>
          </h2>
          <p className="alp-section-lead">
            A maioria dos cães faz festa de primeira — mas se o seu for do tipo desconfiado,
            tem conserto simples.
          </p>

          <ul className="alp-problemas-list">
            <li className="alp-problema-item">
              <b>Comece como topper</b> — jogue as larvinhas por cima da ração de sempre; o cheiro puxa o interesse.
            </li>
            <li className="alp-problema-item">
              <b>Use de recompensa</b> — o Original inteiro vira petisco de treino, um de cada vez.
            </li>
            <li className="alp-problema-item">
              <b>Não colou mesmo?</b> — <strong>a gente devolve seu dinheiro em 14 dias.</strong> Sem letrinha miúda.
            </li>
          </ul>

          <blockquote className="alp-quote">
            <p>
              “Confesso que não estava acreditando não, que era só mkt mesmo. Mas a Kate
              <strong> amou os petiscos</strong>, ficava enlouquecida cada vez q eu pegava o pacote… 😊”
            </p>
            <cite>— Michelle Klemar · Osasco/SP · Amostra · Judge.me 5★</cite>
          </blockquote>

          <div className="alp-secao-cta">
            <a href={ctaUrl("secao-aceitacao")} className="alp-btn-primary" data-cta="secao-aceitacao">
              Comprar o Kit Cachorro — R$ {PRICE_OFF} →
            </a>
          </div>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════ */}
      <section className="alp-section">
        <div className="alp-section-inner">
          <span className="alp-tag">perguntas frequentes</span>
          <h2 className="alp-section-title">
            Antes de comprar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="alp-faq">
            {FAQ.map((f, i) => (
              <details className="alp-faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="alp-faq-answer" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="alp-garantia">
            <div className="alp-garantia-icon">💚</div>
            <div className="alp-garantia-body">
              <strong>Garantia da matilha</strong>
              <span>Se seu cão não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="alp-cta-final">
        <h2>
          Bora cuidar da pele<br /><span>do seu cão?</span>
        </h2>
        <p>Proteína nova, pele mais calma, intestino firme. A maioria sente nas primeiras semanas.</p>
        <a href={ctaUrl("final")} className="alp-btn-primary" data-cta="final">
              Comprar o Kit Cachorro — R$ {PRICE_OFF} →
            </a>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="alp-footer">
        <DragonLogo className="alp-footer-logo-svg" />
        <div className="alp-footer-tagline">Nojento é o desperdício.</div>
        <div className="alp-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════ */}
      <div className="alp-sticky-cta">
        <div className="alp-sticky-info">
          <span className="alp-sticky-name">Kit Cachorro</span>
          <span className="alp-sticky-price">R$ {PRICE_OFF} · 🏷️ 10% off</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky">Comprar — R$ {PRICE_OFF} →</a>
      </div>

      <LeadPopup slug="alergia-google" aposSeletor=".alp-cta-final" />
    </div>
  );
};

export default AlergiaGoogle;
