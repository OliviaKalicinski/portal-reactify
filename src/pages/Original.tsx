import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Original.css";

/* ──────────────────────────────────────────────────────────────
   LP PRODUTO — ORIGINAL
   Página satélite · tráfego pago Meta Ads · público frio
   Ângulo: saúde + longevidade + hipoalergênico
   CTA único: checkout direto Yampi com cupom BORALA (10% off)

   Decisões de performance:
   ─ LP autocontida, NÃO importa Portal.css/Parceiros.css
   ─ Sem ReelsSection (vídeos pesam) — prova social vira reviews em texto
   ─ Code-split via React.lazy em App.tsx
   ─ Helmet faz preload da hero image (LCP)

   ⚠️ Trocar `REVIEWS` por imagens reais quando vocês tiverem.
────────────────────────────────────────────────────────────── */

/* Checkout Yampi do Original 90g.
   /r/TQT4HOZK7X é o "Buy Now URL" oficial do produto — adiciona o
   Original ao carrinho automaticamente e leva direto ao checkout.
   cupom=BORALA é o parâmetro Yampi BR. Passamos `coupon=` também
   como fallback caso a versão da plataforma reconheça o nome em inglês.
   UTMs marcam tráfego como Meta Ads + utm_content varia por CTA. */
const COUPON = "BORALA";
const CHECKOUT_BASE =
  `https://comida-de-dragao.pay.yampi.com.br/r/TQT4HOZK7X` +
  `?cupom=${COUPON}` +
  `&coupon=${COUPON}` +
  `&utm_source=meta` +
  `&utm_medium=cpc` +
  `&utm_campaign=lp-original-borala`;

/** Monta a URL final do checkout com utm_content variando por CTA. */
const ctaUrl = (cta: "hero" | "oferta" | "final" | "sticky") =>
  `${CHECKOUT_BASE}&utm_content=${cta}`;

const HERO_IMG = "/assets/images/produtos/original-frente.webp";

const CHIPS = [
  "🚚 Entrega Brasil",
  "🛡️ Compra segura",
  "🏭 Reg. MAPA",
  "💚 Garantia 14 dias",
];

const PROBLEMAS = [
  { dor: "Coceira, lambida de pata e queda de pelo", causa: "podem ser intolerância a frango, boi ou grãos." },
  { dor: "Pet enjoado, deixa ração no pote", causa: "petisco com cheiro forte vira muleta calórica." },
  { dor: "Tutor cansado de testar marca atrás de marca", causa: "rótulos cheios de promessa, mas com 8+ ingredientes." },
];

const BENEFICIOS = [
  {
    stat: "1",
    statLbl: "ingrediente",
    title: "Hipoalergênico de verdade",
    desc: "<strong>100% larva de Mosca Soldado Negra (BSF)</strong>. Sem frango, boi, peixe, soja ou glúten. Ideal pra pet com alergia ou estômago sensível.",
  },
  {
    stat: "88,9%",
    statLbl: "digestibilidade",
    title: "Energia que vira músculo",
    desc: "<strong>40% de proteína</strong> absorvida de verdade. Mais disposição, pelo brilhante, menos cocô.",
  },
  {
    stat: "Ω",
    statLbl: "ômega 6 e 9",
    title: "Pele saudável, pelo brilhando",
    desc: "Ácido láurico anti-inflamatório natural. Melhora pelagem e reduz coceira em poucas semanas.",
  },
];

/* Slider de prova social — mistura fotos UGC do produto com pets
   e screenshots de reviews. Tudo em imagem, sem texto duplicado.
   ⚠️ Olivia: reordene/troque as URLs aqui pra escolher os melhores 8.
   Tipos: "ugc" (foto do produto/pet) ou "review" (screenshot do depoimento) */
const SLIDES: Array<{ src: string; alt: string; type: "ugc" | "review" }> = [
  { type: "ugc",    src: "/assets/images/produtos/original-07.webp", alt: "Cão de olhos azuis mordendo o pacote Original" },
  { type: "review", src: "/assets/images/reviews/3.webp",            alt: "Review de tutora — coceira melhorou" },
  { type: "ugc",    src: "/assets/images/produtos/original-06.webp", alt: "Cão marrom feliz com 2 pacotes Comida de Dragão" },
  { type: "review", src: "/assets/images/reviews/5.webp",            alt: "Review de tutor — pet com alergia alimentar" },
  { type: "ugc",    src: "/assets/images/produtos/original-08.webp", alt: "Labrador alegre com larvas BSF na mão da tutora" },
  { type: "review", src: "/assets/images/reviews/7.webp",            alt: "Review — recomendo demais" },
  { type: "ugc",    src: "/assets/images/produtos/original-09.webp", alt: "Cão preto e branco cheirando o pacote Original" },
  { type: "review", src: "/assets/images/reviews/9.webp",            alt: "Review — cliente recorrente" },
];

const FAQ = [
  {
    q: "Meu pet tem alergia — posso dar?",
    a: "Sim. Tem <strong>1 único ingrediente</strong> e é hipoalergênico por natureza — sem as proteínas mais alergênicas do mercado pet (frango, boi, soja, glúten). Em casos de acompanhamento veterinário, mostre o rótulo pro profissional antes.",
  },
  {
    q: "Como ofereço pela primeira vez?",
    a: "Comece com 2 a 4 unidades por dia, entre as refeições. Alta palatabilidade — a maioria dos pets aceita de primeira.",
  },
  {
    q: "Quanto tempo dura o pacote de 90g?",
    a: "Pra um cão médio que recebe 5–6 unidades/dia, dura cerca de <strong>30 a 45 dias</strong>. Validade plena de 18 meses depois de aberto, em local seco.",
  },
  {
    q: "Como funciona a entrega?",
    a: "Despachamos em até 1 dia útil. Frete calculado no fim do pedido pelo seu CEP. Compra <strong>100% segura</strong> via Yampi com cartão, Pix ou boleto.",
  },
];

const Original = () => {
  return (
    <div className="original-lp">
      <PageMeta
        title="Comida de Dragão Original — petisco hipoalergênico que transforma a saúde do pet"
        description="Petisco com proteína única de Mosca Soldado Negra. Hipoalergênico, 40% proteína, 88,9% digestibilidade. Cupom BORALA: 10% off."
        image={HERO_IMG}
      />
      {/* preload da hero image — melhora LCP em tráfego pago */}
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMG} fetchPriority="high" />
      </Helmet>

      {/* ════ HERO ═══════════════════════════════════════════════ */}
      <section className="olp-hero">
        <div className="olp-hero-inner">
          <div className="olp-hero-top">
            <Link to="/portal" className="olp-backlink">← comida de dragão</Link>
            <DragonLogo className="olp-hero-logo" />
          </div>

          <span className="olp-hero-eyebrow">novidade · 1 ingrediente · hipoalergênico</span>

          <h1 className="olp-hero-title">
            O petisco que<br /><span>seu pet vai amar.</span>
          </h1>

          <p className="olp-hero-sub">
            A gente faz <strong>petisco com 1 ingrediente só</strong> — larva
            de Mosca Soldado Negra. 40% de proteína, sem frango, sem grão,
            hipoalergênico de verdade. Pet merece comida real, não promessa de rótulo.
          </p>

          <img
            className="olp-hero-product"
            src={HERO_IMG}
            alt="Pacote Comida de Dragão Original — 90g de larvas inteiras desidratadas"
            width={440}
            height={543}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <div className="olp-hero-price">
            <span className="olp-price-from">a partir de</span>
            <span className="olp-price-now"><small>R$</small>38,90</span>
            <span className="olp-price-installment">ou R$ 35,01 com BORALA · 4× sem juros</span>
          </div>

          <div className="olp-hero-coupon">
            🎟️ cupom <b>{COUPON}</b> — 10% off
          </div>

          <div className="olp-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="olp-btn-primary" data-cta="hero">
              Bora experimentar →
            </a>
          </div>

          <div className="olp-hero-chips">
            {CHIPS.map((c, i) => <span className="olp-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ PROBLEMA → SOLUÇÃO ═════════════════════════════════ */}
      <section className="olp-section">
        <div className="olp-section-inner">
          <span className="olp-tag tag-pink">se isso te soa familiar</span>
          <h2 className="olp-section-title title-pink">
            Seu pet pode estar <span>sofrendo em silêncio.</span>
          </h2>
          <p className="olp-section-lead">
            A maioria dos petiscos do mercado é a <strong>mesma proteína
            alergênica</strong> que tá na ração — frango, boi, soja, milho.
            Seu pet come o dia inteiro o que faz mal pra ele e a gente
            acha normal.
          </p>

          <ul className="olp-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="olp-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ BENEFÍCIOS ═════════════════════════════════════════ */}
      <section className="olp-section">
        <div className="olp-section-inner">
          <span className="olp-tag">a solução</span>
          <h2 className="olp-section-title">
            Um ingrediente.<br /><span>Tudo o que ele precisa.</span>
          </h2>
          <p className="olp-section-lead">
            A gente faz na nossa biofábrica no RJ. 100% larva de Mosca
            Soldado Negra, <strong>registro MAPA</strong>, rastreabilidade
            do começo ao fim. Sustentável de verdade — sem greenwashing.
          </p>

          <div className="olp-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="olp-beneficio" key={i}>
                <div className="olp-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="olp-beneficio-title">{b.title}</div>
                <div
                  className="olp-beneficio-desc"
                  dangerouslySetInnerHTML={{ __html: b.desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SLIDER · UGC + REVIEWS EM IMAGEM ═══════════════════ */}
      <section className="olp-section">
        <div className="olp-section-inner">
          <span className="olp-tag">tutores reais · pets reais</span>
          <h2 className="olp-section-title">
            Quem topou,<br /><span>não larga mais.</span>
          </h2>

          <div className="olp-slider-wrap">
            <div
              className="olp-slider"
              role="region"
              aria-label="Fotos de pets e reviews de tutores"
            >
              {SLIDES.map((s, i) => (
                <figure className="olp-slide" key={i}>
                  <span
                    className={`olp-slide-tag${s.type === "ugc" ? " tag-orange" : ""}`}
                  >
                    {s.type === "ugc" ? "pet real" : "review"}
                  </span>
                  <img
                    src={s.src}
                    alt={s.alt}
                    width={600}
                    height={600}
                    /* primeiro slide carrega eager pra LCP visual da seção,
                       resto lazy pra economizar dados */
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>

          <p className="olp-slider-hint">← arraste pra ver mais →</p>
        </div>
      </section>

      {/* ════ OFERTA + CUPOM ═════════════════════════════════════ */}
      <section className="olp-oferta">
        <div className="olp-oferta-inner">
          <span className="olp-tag tag-lime">oferta de lançamento</span>
          <h2 className="olp-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Comece com<br /><span>10% de desconto</span>
          </h2>

          <div className="olp-oferta-coupon-box">
            <div className="olp-oferta-coupon-label">use o cupom</div>
            <div className="olp-oferta-coupon-code">{COUPON}</div>
            <div className="olp-oferta-coupon-desc">10% off na primeira compra</div>
          </div>

          <a href={ctaUrl("oferta")} className="olp-btn-primary" data-cta="oferta">
            Quero meu BORALA →
          </a>

          <p className="olp-hero-note" style={{ marginTop: 16 }}>
            Cupom aplica sozinho no checkout · Só na primeira compra
          </p>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════════════════════════════════════ */}
      <section className="olp-section">
        <div className="olp-section-inner">
          <span className="olp-tag">perguntas frequentes</span>
          <h2 className="olp-section-title">
            Antes de comprar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="olp-faq">
            {FAQ.map((f, i) => (
              <details className="olp-faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="olp-faq-answer" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="olp-garantia">
            <div className="olp-garantia-icon">💚</div>
            <div className="olp-garantia-body">
              <strong>Garantia da matilha</strong>
              <span>Se seu pet não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ══════════════════════════════════════════ */}
      <section className="olp-cta-final">
        <h2>
          Bora cuidar<br /><span>do seu melhor amigo?</span>
        </h2>
        <p>Um pacote, um ingrediente, zero promessa furada. Seu pet sente nas primeiras semanas.</p>
        <a href={ctaUrl("final")} className="olp-btn-primary" data-cta="final">
          Bora — meu {COUPON} →
        </a>
      </section>

      {/* ════ FOOTER ═════════════════════════════════════════════ */}
      <footer className="olp-footer">
        <DragonLogo className="olp-footer-logo-svg" />
        <nav className="olp-footer-links">
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
          <Link to="/produtos">Linha completa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="olp-footer-tagline">Nojento é o desperdício.</div>
        <div className="olp-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════════════════════════════════ */}
      <div className="olp-sticky-cta">
        <div className="olp-sticky-info">
          <span className="olp-sticky-name">Original 90g</span>
          <span className="olp-sticky-price">R$ 38,90 · cupom {COUPON}</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky">Comprar →</a>
      </div>
    </div>
  );
};

export default Original;
