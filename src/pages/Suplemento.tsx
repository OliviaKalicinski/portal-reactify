import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Suplemento.css";

/* ──────────────────────────────────────────────────────────────
   LP PRODUTO — SUPLEMENTO INTEGRAL
   Página satélite · tráfego pago Meta Ads · público frio
   Ângulo: boost proteico diário + hipoalergênico + só cães
   CTA único: checkout direto Yampi com cupom BORALA (10% off)

   Espelho exato da LP do Original (Original.tsx) — mesma estrutura,
   mesmas seções, mesmo padrão de performance. Só muda a copy, as
   fotos, o preço e o checkout Yampi (produto diferente).

   Decisões de performance:
   ─ LP autocontida, NÃO importa Portal.css/Parceiros.css
   ─ Prova social em imagem (UGC + reviews), sem vídeo
   ─ Code-split via React.lazy em App.tsx
   ─ Helmet faz preload da hero image (LCP)

   ⚠️ Trocar as imagens UGC/REVIEWS por reais quando tiver os melhores.
────────────────────────────────────────────────────────────── */

/* Checkout Yampi do Suplemento Integral 180g.
   /r/BII063ST2H é o "Buy Now URL" oficial do produto — adiciona o
   Suplemento Integral ao carrinho automaticamente e leva direto ao
   checkout. ?promocode=BORALA é o parâmetro correto da Yampi pra
   aplicar o cupom automaticamente.
   UTMs marcam tráfego como Meta Ads + utm_content varia por CTA. */
const COUPON = "BORALA";
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/BII063ST2H?promocode=${COUPON}`;

/** Fallback usado SO quando o anuncio nao trouxe utm_ (trafego direto/organico). */
const UTM_FALLBACK = {
  utm_source: "lp-suplemento",
  utm_medium: "cpc",
  utm_campaign: "lp-suplemento-borala",
};

/** Repassa a UTM de entrada (do anuncio); posicao do botao vai em cta_pos. */
const ctaUrl = (cta: "hero" | "oferta" | "final" | "sticky") =>
  buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

const HERO_IMG = "/assets/images/produtos/suplemento-integral-frente.webp";

const CHIPS = [
  "🚚 Entrega Brasil",
  "🛡️ Compra segura",
  "🏭 Reg. MAPA",
  "💚 Garantia 14 dias",
];

const PROBLEMAS = [
  { dor: "Cão ativo, filhote ou idoso comendo só ração comum", causa: "fases de alta demanda pedem mais proteína do que a tigela padrão entrega." },
  { dor: "Suplemento de prateleira cheio de promessa", causa: "rótulo com corante, aroma artificial e proteína alergênica." },
  { dor: "Pet de baixo apetite que come pouco", causa: "cada colher precisa render o máximo de proteína possível." },
];

const BENEFICIOS = [
  {
    stat: "45%",
    statLbl: "proteína",
    title: "Boost proteico de verdade",
    desc: "<strong>Farinha de larva de Mosca Soldado Negra (BSF)</strong> com perfil completo de aminoácidos essenciais. Mais músculo, mais energia, mais disposição.",
  },
  {
    stat: "+2",
    statLbl: "superalimentos",
    title: "Cúrcuma e spirulina juntas",
    desc: "Anti-inflamatório natural e antioxidante na mesma colher. <strong>Reforço de defesa e recuperação</strong> a cada refeição.",
  },
  {
    stat: "0",
    statLbl: "alérgenos comuns",
    title: "Hipoalergênico de verdade",
    desc: "Sem frango, boi, soja ou glúten. Mistura na ração sem risco pra pet sensível. <strong>Acompanha dosador.</strong>",
  },
];

/* Slider de prova social — abre com 1 foto mostrando o produto e
   na sequência só screenshots de reviews reais. Tudo em imagem.
   ⚠️ Olivia: reordene/troque as URLs dos reviews aqui pra escolher
   os melhores depoimentos.
   Tipos: "ugc" (foto do produto) ou "review" (screenshot do depoimento) */
const SLIDES: Array<{ src: string; alt: string; type: "ugc" | "review" }> = [
  { type: "ugc",    src: "/assets/images/produtos/integral-02.webp", alt: "Suplemento Integral polvilhado na ração do cão" },
  { type: "review", src: "/assets/images/reviews/3.webp",            alt: "Review de tutora — cão com mais disposição" },
  { type: "review", src: "/assets/images/reviews/4.webp",            alt: "Review de tutor — filhote em crescimento" },
  { type: "review", src: "/assets/images/reviews/5.webp",            alt: "Review — pelo mais bonito" },
  { type: "review", src: "/assets/images/reviews/6.webp",            alt: "Review — cão idoso recuperou massa" },
  { type: "review", src: "/assets/images/reviews/7.webp",            alt: "Review — recomendo demais" },
  { type: "review", src: "/assets/images/reviews/8.webp",            alt: "Review — fácil de usar, mistura na ração" },
  { type: "review", src: "/assets/images/reviews/9.webp",            alt: "Review — cliente recorrente" },
];

const FAQ = [
  {
    q: "Como ofereço pro meu cão?",
    a: "É só <strong>polvilhar na ração</strong>, uma vez ao dia. Acompanha dosador — a quantidade vai de 1 a 4 medidas conforme o porte do cão. Alta palatabilidade: a maioria aceita de primeira.",
  },
  {
    q: "Isso substitui a ração?",
    a: "Não. O Integral é <strong>complemento</strong> — entra junto da alimentação normal pra reforçar a proteína, a ração continua sendo a base. É formulado <strong>só pra cães</strong>; pra felinos temos o Suplemento Felino.",
  },
  {
    q: "Quanto tempo dura o pote de 180g?",
    a: "Depende do porte: de cerca de <strong>12 dias</strong> (cão grande, 20g/dia) a <strong>36 dias</strong> (cão mini, 5g/dia). Validade plena, guardado em local seco e fechado.",
  },
  {
    q: "Como funciona a entrega?",
    a: "Despachamos em até 1 dia útil. Frete calculado no fim do pedido pelo seu CEP. Compra <strong>100% segura</strong> via Yampi com cartão, Pix ou boleto.",
  },
];

const Suplemento = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="suplemento-lp">
      <PageMeta
        title="Comida de Dragão Suplemento Integral — boost proteico hipoalergênico pro seu cão"
        description="Suplemento em pó com 45% de proteína de Mosca Soldado Negra. Hipoalergênico, cúrcuma e spirulina, acompanha dosador. Cupom BORALA: 10% off."
        image={HERO_IMG}
      />
      {/* preload da hero image — melhora LCP em tráfego pago */}
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMG} fetchPriority="high" />
      </Helmet>

      {/* ════ HERO ═══════════════════════════════════════════════ */}
      <section className="slp-hero">
        <div className="slp-hero-inner">
          <div className="slp-hero-top">
            <Link to="/portal" className="slp-backlink">← comida de dragão</Link>
            <DragonLogo className="slp-hero-logo" />
          </div>

          <span className="slp-hero-eyebrow">novidade · 45% proteína · só cães</span>

          <h1 className="slp-hero-title">
            O reforço que<br /><span>falta na tigela.</span>
          </h1>

          <p className="slp-hero-sub">
            A gente faz <strong>suplemento com farinha de larva</strong> de
            Mosca Soldado Negra — 45% de proteína, com cúrcuma e spirulina.
            Polvilha na ração e pronto: boost proteico real, hipoalergênico,
            sem promessa de rótulo.
          </p>

          <img
            className="slp-hero-product"
            src={HERO_IMG}
            alt="Pote Comida de Dragão Suplemento Integral — 180g de farinha de larva BSF"
            width={440}
            height={543}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <div className="slp-hero-price">
            <span className="slp-price-from">a partir de</span>
            <span className="slp-price-now"><small>R$</small>110,00</span>
            <span className="slp-price-installment">ou R$ 99,00 com BORALA · 4× sem juros</span>
          </div>

          <div className="slp-hero-coupon">
            🎟️ cupom <b>{COUPON}</b> — 10% off
          </div>

          <div className="slp-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="slp-btn-primary" data-cta="hero">
              Bora reforçar a tigela →
            </a>
          </div>

          <div className="slp-hero-chips">
            {CHIPS.map((c, i) => <span className="slp-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ PROBLEMA → SOLUÇÃO ═════════════════════════════════ */}
      <section className="slp-section">
        <div className="slp-section-inner">
          <span className="slp-tag tag-pink">se isso te soa familiar</span>
          <h2 className="slp-section-title title-pink">
            A ração sozinha <span>nem sempre dá conta.</span>
          </h2>
          <p className="slp-section-lead">
            Cão ativo, filhote em crescimento, fêmea gestante, idoso perdendo
            músculo — todos têm <strong>demanda proteica maior</strong> que a
            ração comum entrega. E a maioria dos suplementos do mercado é
            aditivo com cara de proteína.
          </p>

          <ul className="slp-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="slp-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ BENEFÍCIOS ═════════════════════════════════════════ */}
      <section className="slp-section">
        <div className="slp-section-inner">
          <span className="slp-tag">a solução</span>
          <h2 className="slp-section-title">
            Uma colher.<br /><span>Proteína de verdade.</span>
          </h2>
          <p className="slp-section-lead">
            A gente faz na nossa biofábrica em Cachoeiras de Macacu. Farinha
            de larva de Mosca Soldado Negra, <strong>registro MAPA</strong>,
            rastreabilidade do começo ao fim. Sustentável de verdade — sem
            greenwashing.
          </p>

          <div className="slp-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="slp-beneficio" key={i}>
                <div className="slp-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="slp-beneficio-title">{b.title}</div>
                <div
                  className="slp-beneficio-desc"
                  dangerouslySetInnerHTML={{ __html: b.desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SLIDER · UGC + REVIEWS EM IMAGEM ═══════════════════ */}
      <section className="slp-section">
        <div className="slp-section-inner">
          <span className="slp-tag">tutores reais · pets reais</span>
          <h2 className="slp-section-title">
            Quem topou,<br /><span>não larga mais.</span>
          </h2>

          <div className="slp-slider-wrap">
            <div
              className="slp-slider"
              role="region"
              aria-label="Fotos de pets e reviews de tutores"
            >
              {SLIDES.map((s, i) => (
                <figure className="slp-slide" key={i}>
                  <span
                    className={`slp-slide-tag${s.type === "ugc" ? " tag-orange" : ""}`}
                  >
                    {s.type === "ugc" ? "o produto" : "review"}
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

          <p className="slp-slider-hint">← arraste pra ver mais →</p>
        </div>
      </section>

      {/* ════ OFERTA + CUPOM ═════════════════════════════════════ */}
      <section className="slp-oferta">
        <div className="slp-oferta-inner">
          <span className="slp-tag tag-lime">oferta de lançamento</span>
          <h2 className="slp-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Comece com<br /><span>10% de desconto</span>
          </h2>

          <div className="slp-oferta-coupon-box">
            <div className="slp-oferta-coupon-label">use o cupom</div>
            <div className="slp-oferta-coupon-code">{COUPON}</div>
            <div className="slp-oferta-coupon-desc">10% off na primeira compra</div>
          </div>

          <a href={ctaUrl("oferta")} className="slp-btn-primary" data-cta="oferta">
            Quero meu BORALA →
          </a>

          <p className="slp-hero-note" style={{ marginTop: 16 }}>
            Cupom aplica sozinho no checkout · Só na primeira compra
          </p>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════════════════════════════════════ */}
      <section className="slp-section">
        <div className="slp-section-inner">
          <span className="slp-tag">perguntas frequentes</span>
          <h2 className="slp-section-title">
            Antes de comprar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="slp-faq">
            {FAQ.map((f, i) => (
              <details className="slp-faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="slp-faq-answer" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="slp-garantia">
            <div className="slp-garantia-icon">💚</div>
            <div className="slp-garantia-body">
              <strong>Garantia da matilha</strong>
              <span>Se seu cão não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ══════════════════════════════════════════ */}
      <section className="slp-cta-final">
        <h2>
          Bora reforçar<br /><span>a tigela do seu cão?</span>
        </h2>
        <p>Um pote, uma colher por dia, zero promessa furada. Seu cão sente nas primeiras semanas.</p>
        <a href={ctaUrl("final")} className="slp-btn-primary" data-cta="final">
          Bora — meu {COUPON} →
        </a>
      </section>

      {/* ════ FOOTER ═════════════════════════════════════════════ */}
      <footer className="slp-footer">
        <DragonLogo className="slp-footer-logo-svg" />
        <nav className="slp-footer-links">
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
          <Link to="/produtos">Linha completa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="slp-footer-tagline">Nojento é o desperdício.</div>
        <div className="slp-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════════════════════════════════ */}
      <div className="slp-sticky-cta">
        <div className="slp-sticky-info">
          <span className="slp-sticky-name">Suplemento Integral 180g</span>
          <span className="slp-sticky-price">R$ 110,00 · cupom {COUPON}</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky">Comprar →</a>
      </div>
    </div>
  );
};

export default Suplemento;
