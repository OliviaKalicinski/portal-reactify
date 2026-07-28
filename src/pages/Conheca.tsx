import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Conheca.css";
import LeadPopup from "@/components/LeadPopup";

/* ──────────────────────────────────────────────────────────────
   LP CAMPANHA — CONHEÇA · /conheca
   Público: SEGUIDOR NOVO do ManyChat (warm — acabou de seguir).
   Produto-foco: KIT CACHORRO (Original + Suplemento Integral).

   ⚠️ MIGRADA do estilo qsd8 (8-bit) para o MOLDE VERDE da /alergia
   em 17/07/26. CSS clonado da Alergia com prefixo próprio (.conheca-lp / cnh-).
   Os easter-eggs antigos (cupons VOOLIVRE/DRAGAOACORDOU) NÃO existem mais
   neste molde — só o cupom principal BEMZAO segue, embutido no checkout.

   Kit Cachorro · token KQXZ5J7LWK · R$145 → R$130,50 com BEMZAO (−10%) ·
   FRETE GRÁTIS no Kit (verificado ativo na Yampi em 17/07).
────────────────────────────────────────────────────────────── */

const PRICE = "145,00";       // "de" — preço cheio do Kit
const PRICE_OFF = "130,50";   // "por" — R$145 −10% com BEMZAO
const COUPON = "BEMZAO";
/* Kit Cachorro · token KQXZ5J7LWK · promocode BEMZAO (10%) embutido · frete grátis. */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?promocode=${COUPON}`;

const UTM_FALLBACK = {
  utm_source: "lp-conheca",
  utm_medium: "lp",
  utm_campaign: "lp-conheca-kit-caes",
};

const ctaUrl = (cta: "hero" | "oferta" | "final" | "sticky") =>
  buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

const HERO_IMG = "/assets/images/produtos/kit-caes.png";

const CHIPS = [
  "🚚 Frete grátis",
  "🛡️ Compra segura",
  "🏭 Reg. MAPA",
  "💚 Garantia 14 dias",
];

/* o "não" que trava o tutor curioso */
const PROBLEMAS = [
  { dor: "\"É larva? Que nojo!\"", causa: "é a mesma cara de quem nunca comeu sushi. 9 em 10 estranham — e mudam de ideia na primeira mordidinha do cão." },
  { dor: "\"Ração boa já não basta?\"", causa: "ultraprocessado é ultraprocessado. Larva é comida de verdade: um ingrediente, sem corante, sem enchimento." },
  { dor: "\"Será que faz bem mesmo?\"", causa: "faz bem, não mal — e tem estudo peer-reviewed desde 2015. Lá fora já virou tendência." },
];

const BENEFICIOS = [
  {
    stat: "88,9%",
    statLbl: "digestível",
    title: "O corpo absorve quase tudo",
    desc: "Estudos indicam digestibilidade altíssima: <strong>mais nutrição no prato, menos cocô no quintal</strong>. A larva é comida que o organismo aproveita de verdade.",
  },
  {
    stat: "1",
    statLbl: "ingrediente",
    title: "Proteína nova, hipoalergênica",
    desc: "A larva é uma proteína que o corpo do seu cão <strong>nunca viu</strong> — sem frango, boi, soja ou grão. A queridinha de quem tem pet alérgico ou sensível.",
  },
  {
    stat: "Ω",
    statLbl: "ácido láurico",
    title: "Pele e pelo de revista",
    desc: "Rica em ácido láurico e ômegas 6 e 9. Estudos associam a <strong>pelo brilhante e pele saudável</strong> — e o intestino agradece.",
  },
];

/* Prova social — abre com o Kit e segue com reviews reais de tutores. */
const SLIDES: Array<{ src: string; alt: string; type: "ugc" | "review" }> = [
  { type: "ugc",    src: "/assets/images/produtos/kit-caes.png", alt: "Kit Cachorro — Original + Suplemento Integral" },
  { type: "review", src: "/assets/images/reviews/3.webp",        alt: "Review — cachorro amou as larvinhas" },
  { type: "review", src: "/assets/images/reviews/5.webp",        alt: "Review — ficou viciado no petisco" },
  { type: "review", src: "/assets/images/reviews/7.webp",        alt: "Review — estranho no começo, viciante no fim" },
  { type: "review", src: "/assets/images/reviews/9.webp",        alt: "Review — natural e sustentável, aprovado" },
  { type: "review", src: "/assets/images/reviews/4.webp",        alt: "Review — pele e pelo melhores" },
  { type: "review", src: "/assets/images/reviews/8.webp",        alt: "Review — fácil de usar, mistura na ração" },
];

const FAQ = [
  {
    q: "É seguro dar larva pro meu cão?",
    a: "Faz bem, não mal. É larva da Mosca Soldado Negra, criada na nossa <strong>biofábrica registrada no MAPA</strong>, tudo rastreável. Tem estudo peer-reviewed desde 2015 e lá fora já é tendência na alimentação de pets.",
  },
  {
    q: "O que vem no Kit Cachorro?",
    a: "O <strong>Original</strong> (larvinhas inteiras, pra usar de petisco ou topper) + o <strong>Suplemento Integral</strong> (pó pra misturar na ração). Um cuida do agrado, o outro reforça a nutrição do dia a dia — numa caixa só, com frete grátis.",
  },
  {
    q: "Como funciona o cupom BEMZAO?",
    a: "É o nosso desconto de boas-vindas: <strong>10% OFF no Kit</strong>, e ele já vem <strong>aplicado sozinho</strong> no link — você não precisa digitar nada. O Kit sai por R$ 130,50, com frete grátis.",
  },
  {
    q: "E se ele não comer?",
    a: "Na maioria das vezes o bloqueio é do tutor 😅. Mistura as larvinhas na ração e deixa ele decidir — a taxa de aceitação surpreende. E tem a <strong>garantia da matilha: 14 dias</strong>.",
  },
  {
    q: "Meu veterinário não conhece",
    a: "Normal — é novidade por aqui. Tem <strong>estudo peer-reviewed desde 2015</strong> sobre proteína de inseto pra pets. Mostra o rótulo pro seu vet: a gente adora essa conversa.",
  },
  {
    q: "Como funciona a entrega?",
    a: "Despachamos em até 1 dia útil e o <strong>frete do Kit é grátis</strong> pra todo o Brasil. Compra <strong>100% segura</strong> via Yampi com cartão, Pix ou boleto.",
  },
];

const Conheca = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="conheca-lp">
      <PageMeta
        title="Conheça a Comida de Dragão — o Kit Cachorro com 10% off e frete grátis"
        description="Alimento pra pet feito de larva de inseto: hipoalergênica, digestível e o seu cão ama. Kit Cachorro com cupom BEMZAO (10% off) e frete grátis."
        image={HERO_IMG}
      />
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMG} fetchPriority="high" />
      </Helmet>

      {/* ════ HERO ════ */}
      <section className="cnh-hero">
        <div className="cnh-hero-inner">
          <div className="cnh-hero-top">
            <Link to="/portal" className="cnh-backlink">← comida de dragão</Link>
            <DragonLogo className="cnh-hero-logo" />
          </div>

          <span className="cnh-hero-eyebrow">prazer, somos a comida de dragão · alimento pra pet feito de inseto</span>

          <h1 className="cnh-hero-title">
            Você seguiu a gente.<br /><span>Bora conhecer o kit?</span>
          </h1>

          <p className="cnh-hero-sub">
            A gente faz <strong>alimento pra pet de larva de inseto</strong> — parece estranho por
            5 segundos, aí a ficha cai: é uma das proteínas mais <strong>completas, digestíveis e
            hipoalergênicas</strong> que existem, e o seu cão ama. O <strong>Kit Cachorro</strong>
            junta o petisco de larva (Original) + o Suplemento Integral do dia a dia. E como você
            é de casa, já vai com <strong>10% off</strong>.
          </p>

          <div className="cnh-hero-product-wrap">
            <img
              className="cnh-hero-product"
              src={HERO_IMG}
              alt="Kit Cachorro Comida de Dragão — Original + Suplemento Integral"
              width={460}
              height={410}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <span className="cnh-hero-frete-tag">Kit com frete grátis</span>
          </div>

          <div className="cnh-hero-price">
            <span className="cnh-price-from">Kit Cachorro <s>R$ {PRICE}</s> por</span>
            <span className="cnh-price-now"><small>R$</small>{PRICE_OFF}</span>
            <span className="cnh-price-installment">🚚 Frete grátis · 4× sem juros</span>
          </div>

          <div className="cnh-hero-coupon">
            🎟️ com <b>{COUPON}</b> · 10% OFF já aplicado no link
          </div>

          <div className="cnh-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="cnh-btn-primary" data-cta="hero">
              Quero conhecer o kit →
            </a>
          </div>

          <div className="cnh-hero-chips">
            {CHIPS.map((c, i) => <span className="cnh-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ A OBJEÇÃO (é larva mesmo) ════ */}
      <section className="cnh-section">
        <div className="cnh-section-inner">
          <span className="cnh-tag tag-pink">vou ser sincero com você</span>
          <h2 className="cnh-section-title title-pink">
            É larva mesmo. <span>E é de propósito.</span>
          </h2>
          <p className="cnh-section-lead">
            9 em 10 pessoas estranham no começo — e é aí que a ficha cai: a natureza levou
            milhões de anos pra criar uma proteína dessas. A gente só percebeu agora.
            O seu cão? <strong>Já sabia desde sempre.</strong>
          </p>

          <ul className="cnh-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="cnh-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ SOLUÇÃO ════ */}
      <section className="cnh-section">
        <div className="cnh-section-inner">
          <span className="cnh-tag">por que faz bemzão</span>
          <h2 className="cnh-section-title">
            Estranho no começo.<br /><span>Genial no fim.</span>
          </h2>
          <p className="cnh-section-lead">
            A gente faz na nossa biofábrica no RJ, com <strong>registro MAPA</strong> e
            rastreabilidade do começo ao fim. Uma proteína que resolve dois problemas de uma vez:
            a saúde do seu cão e o peso da ração no planeta.
          </p>

          <div className="cnh-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="cnh-beneficio" key={i}>
                <div className="cnh-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="cnh-beneficio-title">{b.title}</div>
                <div className="cnh-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ PROVA SOCIAL ════ */}
      <section className="cnh-section">
        <div className="cnh-section-inner">
          <span className="cnh-tag">tutores reais · cães reais</span>
          <h2 className="cnh-section-title">
            Estranho no começo.<br /><span>Viciante no fim.</span>
          </h2>

          <div className="cnh-slider-wrap">
            <div className="cnh-slider" role="region" aria-label="Reviews de tutores">
              {SLIDES.map((s, i) => (
                <figure className="cnh-slide" key={i}>
                  <span className={`cnh-slide-tag${s.type === "ugc" ? " tag-orange" : ""}`}>
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

          <p className="cnh-slider-hint">← arraste pra ver mais →</p>
        </div>
      </section>

      {/* ════ OFERTA ════ */}
      <section className="cnh-oferta">
        <div className="cnh-oferta-inner">
          <span className="cnh-tag tag-lime">kit cachorro</span>
          <h2 className="cnh-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Bora fazer<br /><span>bemzão pro cão?</span>
          </h2>

          <div className="cnh-oferta-coupon-box">
            <div className="cnh-oferta-coupon-label">🎟️ seu cupom de boas-vindas</div>
            <div className="cnh-oferta-coupon-code">{COUPON}</div>
            <div className="cnh-oferta-coupon-desc">10% OFF já aplicado · Kit Cachorro por R$ {PRICE_OFF} · 🚚 frete grátis</div>
          </div>

          <a href={ctaUrl("oferta")} className="cnh-btn-primary" data-cta="oferta">
            Quero o Kit Cachorro →
          </a>

          <p className="cnh-hero-note" style={{ marginTop: 16 }}>
            Frete grátis no Kit · cupom aplica sozinho · compra 100% segura via Yampi
          </p>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════ */}
      <section className="cnh-section">
        <div className="cnh-section-inner">
          <span className="cnh-tag">perguntas frequentes</span>
          <h2 className="cnh-section-title">
            Antes de experimentar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="cnh-faq">
            {FAQ.map((f, i) => (
              <details className="cnh-faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="cnh-faq-answer" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="cnh-garantia">
            <div className="cnh-garantia-icon">💚</div>
            <div className="cnh-garantia-body">
              <strong>Garantia da matilha</strong>
              <span>Se seu cão não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="cnh-cta-final">
        <h2>
          Bora experimentar<br /><span>o kit do cão?</span>
        </h2>
        <p>Proteína nova, digestível e sustentável — com 10% off e frete grátis. Estranho por 5 segundos, viciante pro resto da vida.</p>
        <a href={ctaUrl("final")} className="cnh-btn-primary" data-cta="final">
          Quero conhecer o kit →
        </a>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="cnh-footer">
        <DragonLogo className="cnh-footer-logo-svg" />
        <nav className="cnh-footer-links">
          <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
          <Link to="/produtos">Linha completa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="cnh-footer-tagline">Nojento é o desperdício.</div>
        <div className="cnh-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════ */}
      <div className="cnh-sticky-cta">
        <div className="cnh-sticky-info">
          <span className="cnh-sticky-name">Kit Cachorro · {COUPON}</span>
          <span className="cnh-sticky-price">R$ {PRICE_OFF} · 🚚 frete grátis</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky">Comprar →</a>
      </div>

      <LeadPopup slug="conheca" />
    </div>
  );
};

export default Conheca;
