import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./GatoCoceira.css";

/* ──────────────────────────────────────────────────────────────
   LP CAMPANHA — GATO QUE SE COÇA · /gato-coceira
   Página satélite · tráfego pago · público frio (Non-Brand "por dor").
   Tema: COCEIRA / ALERGIA ALIMENTAR EM GATOS.
   Produto-foco: KIT PARA GATOS (Original + Suplemento Felino).
   SKU 1301 · token Yampi N9DLSJ6M4J · de R$145 → R$116 → R$104,40 c/ cupom.

   ⚠️ POR QUE ESTE ÂNGULO, E NÃO "GATO NÃO QUER COMER":
   "gato não quer comer" é a maior dor de gato do Brasil (880 buscas/mês),
   MAS é exatamente onde o produto falha: o Suplemento Felino tem 3,63★ e
   concentra 40% de todas as reviews ≤3★ da marca ("tenho 9 gatos, e nenhum
   aceitou"). Comprar essa busca = pagar caro pra fabricar review de 1★.
   O cluster de COCEIRA (2.000+ buscas/mês) vende pelo MECANISMO (proteína
   nova), não pela palatabilidade — funciona mesmo com gato exigente.
   Decisão da Olivia + Agente CMO, 13/07/2026.

   Mecanismo (papers da Biblioteca BSF):
   - Proteína NOVA (novel protein): o organismo nunca viu BSF → não tem
     defesa criada. Base das dietas de eliminação. [bsf-protein-substitute-
     canine-dermatitis: a dieta BSF NÃO agravou o prurido]
   - Gatos: BSF aumentou digestibilidade de proteína/gordura/aminoácidos,
     fezes bem formadas, ↑Bifidobacterium e AGCC. [bsf-substrates-cat-diets
     -fecal-microbiota · bsf-extruded-food-health-parameters-cats]
   - Taurina 1.520 mg/kg no Suplemento Felino — gato não produz sozinho.
   - Ácido láurico: apoio à barreira da pele.

   ⚠️ GUARDRAILS: complemento, NÃO substitui ração nem tratamento.
   Sem promessa de cura. Coceira em gato tem várias causas (pulga, ácaro,
   ambiental) — a página NÃO afirma que é sempre comida.
   O BLOCO DE ACEITAÇÃO é obrigatório aqui: é a fraqueza conhecida do
   produto em gatos, e a instrução (triturar + misturar na úmida) veio de
   uma cliente real que salvou a própria compra.
────────────────────────────────────────────────────────────── */

const COUPON = "GATOALIVIO";  // criado na Shopify 13/07 · 10% off, 1 uso/cliente
const PRICE = "145,00";       // compare-at do Shopify
const PRICE_OFF = "104,40";   // R$116 no site (−20%) → −10% com cupom
/* Kit para Gatos · SKU 1301 · token N9DLSJ6M4J */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/N9DLSJ6M4J?promocode=${COUPON}`;

const UTM_FALLBACK = {
  utm_source: "lp-gato-coceira",
  utm_medium: "lp",
  utm_campaign: "lp-gato-coceira-kit",
};

const ctaUrl = (cta: "hero" | "oferta" | "final" | "sticky") =>
  buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

const HERO_IMG = "/assets/images/produtos/kit-gatos.png";

const CHIPS = [
  "🚚 Entrega Brasil",
  "🛡️ Compra segura",
  "🏭 Reg. MAPA",
  "💚 Garantia 14 dias",
];

const PROBLEMAS = [
  { dor: "Se coça, se lambe demais e arranca o pelo", causa: "lambedura excessiva é como o gato coça — e costuma ser reação, não mania." },
  { dor: "Já tratou a pulga e ele continua se coçando", causa: "quando não é parasita, a comida entra na lista de suspeitos." },
  { dor: "Feridinhas, casquinhas e falhas no pelo", causa: "a pele inflamada pede pausa do que está irritando ela todo dia." },
];

const BENEFICIOS = [
  {
    stat: "Nova",
    statLbl: "proteína",
    title: "O corpo dele nunca viu isso",
    desc: "Alergia alimentar é o corpo <strong>reconhecendo</strong> uma proteína e reagindo. A larva da Mosca Soldado Negra é uma <strong>proteína nova</strong> — ele nunca comeu, então nunca criou defesa. Em estudos com cães, a dieta de BSF <strong>não agravou a coceira</strong> e se mostrou promissora para dietas hipoalergênicas.",
  },
  {
    stat: "1.520",
    statLbl: "mg/kg taurina",
    title: "O que só o gato precisa",
    desc: "Gato <strong>não produz taurina sozinho</strong> — ela é essencial pro coração, visão e imunidade. O Suplemento Felino tem <strong>1.520 mg/kg de taurina</strong> adicionada, além de no mínimo 40% de proteína.",
  },
  {
    stat: "88,9%",
    statLbl: "digestibilidade",
    title: "Intestino que agradece",
    desc: "Em gatos, a BSF <strong>aumentou a digestibilidade</strong> da proteína e dos aminoácidos, deixou as <strong>fezes bem formadas</strong> e favoreceu bactérias boas (Bifidobacterium). A quitina da casca funciona como fibra prebiótica.",
  },
];

const SLIDES: Array<{ src: string; alt: string; type: "ugc" | "review" }> = [
  { type: "ugc",    src: "/assets/images/produtos/kit-gatos.png", alt: "Kit para Gatos — Original + Suplemento Felino" },
  { type: "review", src: "/assets/images/reviews/3.webp",         alt: "Review de cliente Comida de Dragão" },
  { type: "review", src: "/assets/images/reviews/5.webp",         alt: "Review de cliente Comida de Dragão" },
  { type: "review", src: "/assets/images/reviews/7.webp",         alt: "Review de cliente Comida de Dragão" },
  { type: "review", src: "/assets/images/reviews/9.webp",         alt: "Review de cliente Comida de Dragão" },
  { type: "review", src: "/assets/images/reviews/4.webp",         alt: "Review de cliente Comida de Dragão" },
];

const FAQ = [
  {
    q: "Meu gato se coça, mas o veterinário não achou pulga. Pode ser comida?",
    a: "Pode. Quando parasita e ambiente já foram descartados, <strong>alergia alimentar entra na lista</strong> — e o caminho é trocar a proteína por uma que o corpo dele não reconheça. O diagnóstico é sempre do veterinário; a gente entra na parte da comida.",
  },
  {
    q: "E se o meu gato simplesmente não comer?",
    a: "Gato é gato — acontece, e a gente não vai fingir que não. O que mais funciona: <strong>triturar e misturar na ração úmida</strong> em vez de oferecer puro. Uma cliente com 7 gatos fez exatamente isso depois da primeira recusa e todos comeram. E se mesmo assim não colar, <strong>a gente devolve seu dinheiro em 14 dias</strong>.",
  },
  {
    q: "Isso substitui a ração dele?",
    a: "Não. O Kit é <strong>complemento</strong>: o Original é petisco/topper e o Suplemento Felino é pó pra misturar na refeição. Soma à alimentação — não troca a ração nem substitui tratamento veterinário.",
  },
  {
    q: "O que vem no Kit para Gatos?",
    a: "O <strong>Original</strong> (larvinhas inteiras, pra petisco ou por cima da comida) + o <strong>Suplemento Felino</strong> (pó com taurina, pra misturar na ração).",
  },
  {
    q: "Como funciona a entrega?",
    a: "Despachamos em até 1 dia útil. Frete calculado no fim do pedido pelo seu CEP. Compra <strong>100% segura</strong> via Yampi com cartão, Pix ou boleto.",
  },
];

const GatoCoceira = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="gato-lp">
      <PageMeta
        title="Gato se coçando e perdendo pelo? Pode ser a comida — Comida de Dragão"
        description="Gato que se coça, se lambe demais e perde pelo — e a pulga já foi descartada. Proteína nova de inseto: o corpo dele nunca viu, então não reage. Kit para Gatos com taurina."
        image={HERO_IMG}
      />
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMG} fetchPriority="high" />
      </Helmet>

      {/* ════ HERO ════ */}
      <section className="gcp-hero">
        <div className="gcp-hero-inner">
          <div className="gcp-hero-top">
            <Link to="/portal" className="gcp-backlink">← comida de dragão</Link>
            <DragonLogo className="gcp-hero-logo" />
          </div>

          <span className="gcp-hero-eyebrow">gato que se coça · proteína nova · com taurina</span>

          {/* H1 pergunta, não afirma: coceira em gato tem várias causas (pulga,
              ácaro, ambiente) e a página NÃO pode cravar que é a comida.
              A keyword real ("gato se coçando e perdendo pelo", 390+90/mês)
              entra na subheadline — 1ª linha lida, resolve o Índice de
              Qualidade sem sujar o título. */}
          <h1 className="gcp-hero-title">
            E se a coceira do seu gato<br /><span>estiver no pote?</span>
          </h1>

          <p className="gcp-hero-sub">
            <strong>Ele se coça, se lambe demais e está perdendo pelo — e a pulga já foi
            tratada?</strong> Quando o parasita é descartado e a coceira não passa, a comida entra
            na lista de suspeitos. Alergia alimentar é o corpo <strong>reconhecendo</strong> uma
            proteína e reagindo a ela. A Comida de Dragão é <strong>proteína nova</strong>: ele
            nunca comeu larva, então nunca criou defesa contra ela. O <strong>Kit para Gatos</strong>{" "}
            junta o petisco e o suplemento com taurina.
          </p>

          <img
            className="gcp-hero-product"
            src={HERO_IMG}
            alt="Kit para Gatos Comida de Dragão — Original + Suplemento Felino"
            width={460}
            height={410}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <div className="gcp-hero-price">
            <span className="gcp-price-from">Kit para Gatos · de R$ {PRICE}</span>
            <span className="gcp-price-now"><small>R$</small>{PRICE_OFF}</span>
            <span className="gcp-price-installment">20% no site + cupom <b>{COUPON}</b> (10% off) · 4× sem juros</span>
          </div>

          <div className="gcp-hero-coupon">
            🎟️ cupom <b>{COUPON}</b> — 10% off na 1ª compra
          </div>

          <div className="gcp-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="gcp-btn-primary" data-cta="hero">
              Quero aliviar a coceira dele →
            </a>
          </div>

          <div className="gcp-hero-chips">
            {CHIPS.map((c, i) => <span className="gcp-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ PROBLEMA ════ */}
      <section className="gcp-section">
        <div className="gcp-section-inner">
          <span className="gcp-tag tag-pink">se isso te soa familiar</span>
          <h2 className="gcp-section-title title-pink">
            Já tratou a pulga<br /><span>e ele continua se coçando?</span>
          </h2>
          <p className="gcp-section-lead">
            Coceira em gato tem várias causas — pulga, ácaro, ambiente. Mas quando essas já foram
            descartadas e a coceira <strong>não passa</strong>, sobra o que ele come todo dia.
          </p>

          <ul className="gcp-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="gcp-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ SOLUÇÃO ════ */}
      <section className="gcp-section">
        <div className="gcp-section-inner">
          <span className="gcp-tag">a solução</span>
          <h2 className="gcp-section-title">
            Proteína que o corpo dele<br /><span>nunca aprendeu a rejeitar.</span>
          </h2>
          <p className="gcp-section-lead">
            A gente cria a larva na nossa biofábrica no RJ, com <strong>registro MAPA</strong> e
            rastreabilidade. Ingrediente único, sem frango, sem peixe, sem boi — nada do que
            costuma disparar a reação.
          </p>

          <div className="gcp-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="gcp-beneficio" key={i}>
                <div className="gcp-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="gcp-beneficio-title">{b.title}</div>
                <div className="gcp-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>

          <p className="gcp-section-lead" style={{ marginTop: 20, fontSize: 14, opacity: 0.7 }}>
            Complemento nutricional — não substitui a ração nem o acompanhamento veterinário.
            Coceira tem várias causas: o diagnóstico é sempre do vet.
          </p>
        </div>
      </section>

      {/* ════ E SE ELE NÃO COMER? ════
          Bloco OBRIGATÓRIO nesta LP. É a fraqueza conhecida do produto em
          gatos (Suplemento Felino: 3,63★, 40% das reviews ≤3★ da marca).
          A instrução é verbatim de cliente real que salvou a própria compra.
          Sem isso, tráfego pago de gato = fábrica de review de 1 estrela. */}
      <section className="gcp-section">
        <div className="gcp-section-inner">
          <span className="gcp-tag tag-pink">falando sério</span>
          <h2 className="gcp-section-title title-pink">
            E se ele<br /><span>simplesmente não comer?</span>
          </h2>
          <p className="gcp-section-lead">
            Gato é gato. Alguns devoram na primeira; outros olham, cheiram e viram as costas.
            A gente não vai fingir que isso não acontece — vai te contar o que funciona.
          </p>

          <ul className="gcp-problemas-list">
            <li className="gcp-problema-item">
              <b>Triture e misture na ração úmida</b> — é o que mais funciona. Oferecer puro é onde
              a maioria erra.
            </li>
            <li className="gcp-problema-item">
              <b>Comece com pouco</b> — uma pitada por cima da comida de sempre, e vá aumentando.
            </li>
            <li className="gcp-problema-item">
              <b>Insista alguns dias</b> — gato costuma estranhar cheiro novo antes de aceitar.
            </li>
            <li className="gcp-problema-item">
              <b>Não colou mesmo?</b> — <strong>a gente devolve seu dinheiro em 14 dias.</strong> Sem
              letrinha miúda.
            </li>
          </ul>

          <blockquote className="gcp-quote">
            <p>
              “Na primeira vez que ofertei, apenas 1 dos meus gatos comeu (tenho 7 ao total), mas
              percebi que ofertei ‘pura’, daí <strong>triturei e misturei na ração úmida, após isso
              eles comeram</strong>.”
            </p>
            <cite>— cliente real, pesquisa pós-compra</cite>
          </blockquote>
        </div>
      </section>

      {/* ════ PROVA SOCIAL ════ */}
      <section className="gcp-section">
        <div className="gcp-section-inner">
          <span className="gcp-tag">tutores reais · gatos reais</span>
          <h2 className="gcp-section-title">
            Tem gato que<br /><span>faz festa.</span>
          </h2>

          <blockquote className="gcp-quote">
            <p>
              “Amei muito!! Aqui em casa ninguém dispensou <strong>nem mesmo os 5 gatos</strong>,
              auxilia em caso de necessidade de fezes mais firmes e também{" "}
              <strong>notei uma diferença na queda dos pelos</strong>.”
            </p>
            <cite>— Yasa, review 5★ no Judge.me</cite>
          </blockquote>

          <div className="gcp-slider" role="region" aria-label="Reviews de tutores">
            {SLIDES.map((s, i) => (
              <figure className="gcp-slide" key={i}>
                <span className="gcp-slide-badge">{s.type === "ugc" ? "o kit" : "review"}</span>
                <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
          <p className="gcp-slider-hint">← arraste pra ver mais →</p>
        </div>
      </section>

      {/* ════ OFERTA ════ */}
      <section className="gcp-oferta">
        <div className="gcp-oferta-inner">
          <span className="gcp-tag tag-lime">kit para gatos</span>
          <h2 className="gcp-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Tira a proteína<br /><span>que irrita ele</span>
          </h2>

          <div className="gcp-oferta-coupon-box">
            <div className="gcp-oferta-coupon-label">use o cupom</div>
            <div className="gcp-oferta-coupon-code">{COUPON}</div>
            <div className="gcp-oferta-coupon-desc">20% no site + cupom (10% off) · R$ {PRICE} → R$ {PRICE_OFF}</div>
          </div>

          <a href={ctaUrl("oferta")} className="gcp-btn-primary" data-cta="oferta">
            Quero o Kit para Gatos →
          </a>

          <p className="gcp-hero-note" style={{ marginTop: 16 }}>
            Cupom aplica sozinho no checkout · Só na primeira compra
          </p>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════ */}
      <section className="gcp-section">
        <div className="gcp-section-inner">
          <span className="gcp-tag">perguntas frequentes</span>
          <h2 className="gcp-section-title">
            Antes de comprar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="gcp-faq">
            {FAQ.map((f, i) => (
              <details className="gcp-faq-item" key={i}>
                <summary className="gcp-faq-q">{f.q}</summary>
                <div className="gcp-faq-a" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="gcp-garantia">
            <div className="gcp-garantia-icon">💚</div>
            <div>
              <div className="gcp-garantia-title">Garantia da matilha</div>
              <div className="gcp-garantia-text">
                Se seu gato não topar em 14 dias da entrega, a gente devolve seu dinheiro.
                Sem letrinha miúda.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="gcp-cta-final">
        <div className="gcp-section-inner">
          <h2>Bora dar um alívio pra ele?</h2>
          <p>
            Proteína nova, taurina que ele precisa e intestino que agradece. A coceira tem causa —
            e a comida é uma delas.
          </p>
          <a href={ctaUrl("final")} className="gcp-btn-primary" data-cta="final">
            Quero aliviar a coceira dele →
          </a>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="gcp-footer">
        <div className="gcp-footer-inner">
          <nav className="gcp-footer-nav">
            <a href="https://www.comidadedragao.com.br">Loja</a>
            <Link to="/produtos">Linha completa</Link>
            <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/5521993049400" target="_blank" rel="noreferrer">Contato</a>
          </nav>
          <p className="gcp-footer-tagline">Nojento é o desperdício.</p>
          <p className="gcp-footer-credits">
            Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
          </p>
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════ */}
      <div className="gcp-sticky">
        <div className="gcp-sticky-price">
          Kit para Gatos · <s>R$ {PRICE}</s> <b>R$ {PRICE_OFF}</b>
        </div>
        <a href={ctaUrl("sticky")} className="gcp-btn-primary gcp-btn-sticky" data-cta="sticky">
          Comprar →
        </a>
      </div>
    </div>
  );
};

export default GatoCoceira;
