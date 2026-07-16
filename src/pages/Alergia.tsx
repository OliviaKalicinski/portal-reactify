import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Alergia.css";

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
   - Kit Cachorro · token KQXZ5J7LWK · de R$ 145 → R$ 116 no site (−20%) → R$ 104,40 com ALIVIO.
   - Shopify hoje: preço R$ 116,00 / compare-at R$ 145,00. ALIVIO (10%) entra no checkout Yampi.
   - Trocar imagens de review por screenshots de alergia reais quando tiver.
────────────────────────────────────────────────────────────── */

const COUPON = "AFILIADO10";  // ⚠️ placeholder — cupom do afiliado/creator (10% off). Definir código real + mecânica.
const PRICE = "145,00";       // "de" — compare-at do Shopify (preço cheio)
const PRICE_OFF = "130,50";   // "por" — preço CHEIO R$145 com cupom afiliado (−10%). Frete grátis no Kit (Yampi).
/* Kit Cachorro · token KQXZ5J7LWK · checkout direto Yampi (domínio seguro). */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK`;

const UTM_FALLBACK = {
  utm_source: "lp-alergia",
  utm_medium: "lp",
  utm_campaign: "lp-alergia-kit-caes",
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

const PROBLEMAS = [
  { dor: "Coceira sem parar, lambe e morde as patas", causa: "quase sempre é o corpo reagindo à proteína que ele come todo dia." },
  { dor: "Pele vermelha, queda de pelo e otite de repetição", causa: "inflamação que trocar de ração não resolve — às vezes piora." },
  { dor: "Intestino solto que desregula a cada troca de comida", causa: "estômago sensível costuma sumir quando a proteína é a certa." },
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
  { type: "ugc",    src: "/assets/images/produtos/kit-caes.png", alt: "Kit Cachorro — Original + Suplemento Integral" },
  { type: "review", src: "/assets/images/reviews/3.webp",        alt: "Review — cão alérgico comendo sem reação" },
  { type: "review", src: "/assets/images/reviews/5.webp",        alt: "Review — parou a coceira" },
  { type: "review", src: "/assets/images/reviews/7.webp",        alt: "Review — pet atópico melhorou" },
  { type: "review", src: "/assets/images/reviews/9.webp",        alt: "Review — alérgico a frango, se coça bem menos" },
  { type: "review", src: "/assets/images/reviews/4.webp",        alt: "Review — pele e pelo melhores" },
  { type: "review", src: "/assets/images/reviews/8.webp",        alt: "Review — fácil de usar, mistura na ração" },
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
    a: "O <strong>Original</strong> (larvinhas inteiras, pra usar de petisco/recompensa) + o <strong>Suplemento Integral</strong> (pó pra misturar na ração). Um cuida do dia a dia, o outro reforça a refeição.",
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

const Alergia = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="alergia-lp">
      <PageMeta
        title="Cão vive se coçando? Pode ser alergia à comida — Comida de Dragão"
        description="Alergia em cães quase sempre é a proteína da ração. A Comida de Dragão é proteína de inseto: nova pro corpo, hipoalergênica. Kit Cachorro pra pele e intestino."
        image={HERO_IMG}
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
            Na maioria das vezes a alergia não é "do nada" — é a <strong>proteína da ração</strong>
            (frango, boi, grão) que o corpo dele já conhece. A Comida de Dragão é
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
            <span className="alp-price-from">Kit Cachorro por</span>
            <span className="alp-price-now"><small>R$</small>{PRICE}</span>
            <span className="alp-price-installment">🚚 Frete grátis · 4× sem juros</span>
          </div>

          <div className="alp-hero-coupon">
            🚚 Frete grátis no Kit · conhece um afiliado nosso? usa o cupom dele no checkout
          </div>

          <div className="alp-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="alp-btn-primary" data-cta="hero">
              Quero cuidar da pele dele →
            </a>
          </div>

          <div className="alp-hero-chips">
            {CHIPS.map((c, i) => <span className="alp-chip" key={i}>{c}</span>)}
          </div>
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
            Você já trocou de ração mil vezes e nada? Alergia alimentar é o
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
        </div>
      </section>

      {/* ════ PROVA SOCIAL ════ */}
      <section className="alp-section">
        <div className="alp-section-inner">
          <span className="alp-tag">tutores reais · cães reais</span>
          <h2 className="alp-section-title">
            Atópico, alérgico<br /><span>e comendo tranquilo.</span>
          </h2>

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
            <div className="alp-oferta-coupon-label">🚚 vantagem</div>
            <div className="alp-oferta-coupon-code">FRETE GRÁTIS</div>
            <div className="alp-oferta-coupon-desc">Kit Cachorro por R$ {PRICE} · conhece um afiliado? usa o cupom dele no checkout</div>
          </div>

          <a href={ctaUrl("oferta")} className="alp-btn-primary" data-cta="oferta">
            Quero o Kit Cachorro →
          </a>

          <p className="alp-hero-note" style={{ marginTop: 16 }}>
            Frete grátis no Kit · compra 100% segura via Yampi
          </p>
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
          Bora cuidar da pele dele →
        </a>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="alp-footer">
        <DragonLogo className="alp-footer-logo-svg" />
        <nav className="alp-footer-links">
          <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
          <Link to="/produtos">Linha completa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="alp-footer-tagline">Nojento é o desperdício.</div>
        <div className="alp-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════ */}
      <div className="alp-sticky-cta">
        <div className="alp-sticky-info">
          <span className="alp-sticky-name">Kit Cachorro</span>
          <span className="alp-sticky-price">R$ {PRICE} · 🚚 frete grátis</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky">Comprar →</a>
      </div>
    </div>
  );
};

export default Alergia;
