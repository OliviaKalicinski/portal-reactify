import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Curiosidade.css";

/* ──────────────────────────────────────────────────────────────
   LP CAMPANHA — CURIOSIDADE (LARVA) · /curiosidade
   Público FRIO dos ads de curiosidade ("olha, larva!").
   Produto-foco: KIT CACHORRO (Original + Suplemento Integral).

   ⚠️ MIGRADA do estilo qsd8 (8-bit) para o MOLDE VERDE da /alergia
   em 17/07/26 — decisão por dado: a versão qsd8 convertia visita→checkout
   a 0,65% vs 8,0% da /original e 2,8% da /alergia (GA4, 30d). CSS clonado
   da Alergia com prefixo próprio (.curiosidade-lp / cur-).

   Kit Cachorro · token KQXZ5J7LWK · R$145 no checkout Yampi · FRETE GRÁTIS.
   SEM promocode: o desconto é o cupom do AFILIADO (−10%) que a pessoa digita.
────────────────────────────────────────────────────────────── */

const PRICE = "145,00";       // preço-cheio exibido (Yampi cobra R$145 no Kit)
/* Kit Cachorro · token KQXZ5J7LWK · checkout direto Yampi (domínio seguro). */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK`;

const UTM_FALLBACK = {
  utm_source: "lp-curiosidade",
  utm_medium: "lp",
  utm_campaign: "lp-curiosidade-kit-caes",
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

/* o "não" que trava o tutor (a objeção honesta da curiosidade) */
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

/* Prova social — abre com o Kit e segue com reviews reais de tutores.
   ⚠️ Trocar pelas melhores prints de "cão amando larva" quando tiver. */
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
    q: "Por que o kit, e não só o petisco?",
    a: "Porque cão gosta dos dois: o Original é o petisco/topper de larva e o Suplemento Integral completa a refeição. Sai <strong>mais em conta que comprar separado</strong> e o frete é por nossa conta.",
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

const Curiosidade = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="curiosidade-lp">
      <PageMeta
        title="Já imaginou dar larva pro seu cão? Conheça a Comida de Dragão"
        description="Larva de inseto é uma das proteínas mais completas e digestíveis que existem: hipoalergênica, sustentável e o seu cão ama. Kit Cachorro com frete grátis."
        image={HERO_IMG}
      />
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMG} fetchPriority="high" />
      </Helmet>

      {/* ════ HERO ════ */}
      <section className="cur-hero">
        <div className="cur-hero-inner">
          <div className="cur-hero-top">
            <Link to="/portal" className="cur-backlink">← comida de dragão</Link>
            <DragonLogo className="cur-hero-logo" />
          </div>

          <span className="cur-hero-eyebrow">larva de inseto · proteína nova · feito no rio</span>

          <h1 className="cur-hero-title">
            Já imaginou dar<br /><span>larva</span> pro seu cão?
          </h1>

          <p className="cur-hero-sub">
            Parece estranho — por uns 5 segundos. A larva da <strong>Mosca Soldado Negra</strong> é
            uma das proteínas mais completas e digestíveis que existem: <strong>hipoalergênica</strong>,
            sustentável, e o seu cão simplesmente ama. O <strong>Kit Cachorro</strong> junta o petisco
            de larva (Original) + o Suplemento Integral do dia a dia.
          </p>

          <div className="cur-hero-product-wrap">
            <img
              className="cur-hero-product"
              src={HERO_IMG}
              alt="Kit Cachorro Comida de Dragão — Original + Suplemento Integral"
              width={460}
              height={410}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <span className="cur-hero-frete-tag">Kit com frete grátis</span>
          </div>

          <div className="cur-hero-price">
            <span className="cur-price-from">Kit Cachorro por</span>
            <span className="cur-price-now"><small>R$</small>{PRICE}</span>
            <span className="cur-price-installment">🚚 Frete grátis · 4× sem juros</span>
          </div>

          <div className="cur-hero-coupon">
            🚚 Frete grátis no Kit · conhece um afiliado nosso? usa o cupom dele no checkout
          </div>

          <div className="cur-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="cur-btn-primary" data-cta="hero">
              Quero conhecer o kit →
            </a>
          </div>

          <div className="cur-hero-chips">
            {CHIPS.map((c, i) => <span className="cur-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ A OBJEÇÃO (é larva mesmo) ════ */}
      <section className="cur-section">
        <div className="cur-section-inner">
          <span className="cur-tag tag-pink">vou ser sincero com você</span>
          <h2 className="cur-section-title title-pink">
            É larva mesmo. <span>E é de propósito.</span>
          </h2>
          <p className="cur-section-lead">
            9 em 10 pessoas estranham no começo — e é aí que a ficha cai: a natureza levou
            milhões de anos pra criar uma proteína dessas. A gente só percebeu agora.
            O seu cão? <strong>Já sabia desde sempre.</strong>
          </p>

          <ul className="cur-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="cur-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ SOLUÇÃO ════ */}
      <section className="cur-section">
        <div className="cur-section-inner">
          <span className="cur-tag">por que faz bemzão</span>
          <h2 className="cur-section-title">
            Estranho no começo.<br /><span>Genial no fim.</span>
          </h2>
          <p className="cur-section-lead">
            A gente faz na nossa biofábrica no RJ, com <strong>registro MAPA</strong> e
            rastreabilidade do começo ao fim. Uma proteína que resolve dois problemas de uma vez:
            a saúde do seu cão e o peso da ração no planeta.
          </p>

          <div className="cur-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="cur-beneficio" key={i}>
                <div className="cur-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="cur-beneficio-title">{b.title}</div>
                <div className="cur-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ PROVA SOCIAL ════ */}
      <section className="cur-section">
        <div className="cur-section-inner">
          <span className="cur-tag">tutores reais · cães reais</span>
          <h2 className="cur-section-title">
            Estranho no começo.<br /><span>Viciante no fim.</span>
          </h2>

          <div className="cur-slider-wrap">
            <div className="cur-slider" role="region" aria-label="Reviews de tutores">
              {SLIDES.map((s, i) => (
                <figure className="cur-slide" key={i}>
                  <span className={`cur-slide-tag${s.type === "ugc" ? " tag-orange" : ""}`}>
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

          <p className="cur-slider-hint">← arraste pra ver mais →</p>
        </div>
      </section>

      {/* ════ OFERTA ════ */}
      <section className="cur-oferta">
        <div className="cur-oferta-inner">
          <span className="cur-tag tag-lime">kit cachorro</span>
          <h2 className="cur-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Bora fazer<br /><span>bemzão pro cão?</span>
          </h2>

          <div className="cur-oferta-coupon-box">
            <div className="cur-oferta-coupon-label">🚚 vantagem</div>
            <div className="cur-oferta-coupon-code">FRETE GRÁTIS</div>
            <div className="cur-oferta-coupon-desc">Kit Cachorro por R$ {PRICE} · conhece um afiliado? usa o cupom dele no checkout</div>
          </div>

          <a href={ctaUrl("oferta")} className="cur-btn-primary" data-cta="oferta">
            Quero o Kit Cachorro →
          </a>

          <p className="cur-hero-note" style={{ marginTop: 16 }}>
            Frete grátis no Kit · compra 100% segura via Yampi
          </p>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════ */}
      <section className="cur-section">
        <div className="cur-section-inner">
          <span className="cur-tag">perguntas frequentes</span>
          <h2 className="cur-section-title">
            Antes de experimentar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="cur-faq">
            {FAQ.map((f, i) => (
              <details className="cur-faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="cur-faq-answer" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="cur-garantia">
            <div className="cur-garantia-icon">💚</div>
            <div className="cur-garantia-body">
              <strong>Garantia da matilha</strong>
              <span>Se seu cão não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="cur-cta-final">
        <h2>
          Bora experimentar<br /><span>o kit do cão?</span>
        </h2>
        <p>Proteína nova, digestível e sustentável. Estranho por 5 segundos, viciante pro resto da vida.</p>
        <a href={ctaUrl("final")} className="cur-btn-primary" data-cta="final">
          Quero conhecer o kit →
        </a>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="cur-footer">
        <DragonLogo className="cur-footer-logo-svg" />
        <nav className="cur-footer-links">
          <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
          <Link to="/produtos">Linha completa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="cur-footer-tagline">Nojento é o desperdício.</div>
        <div className="cur-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════ */}
      <div className="cur-sticky-cta">
        <div className="cur-sticky-info">
          <span className="cur-sticky-name">Kit Cachorro</span>
          <span className="cur-sticky-price">R$ {PRICE} · 🚚 frete grátis</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky">Comprar →</a>
      </div>
    </div>
  );
};

export default Curiosidade;
