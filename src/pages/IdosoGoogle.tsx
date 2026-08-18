import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Idoso.css";
import LeadPopup from "@/components/LeadPopup";

/* ──────────────────────────────────────────────────────────────
   LP CAMPANHA — CÃO IDOSO · /idoso
   Página satélite · tráfego pago · público frio (Non-Brand "por dor").
   Tema: TERCEIRA IDADE DO CÃO (perda de massa muscular, articulação,
   apetite/energia em queda). Espelha a LP /alergia (mesmas seções,
   prefixo próprio .idoso-lp / ilp-), com copy e ciência de sênior.
   Produto-foco: KIT CACHORRO (Original + Suplemento Integral).

   Mecanismo (claims checados nos papers da Biblioteca BSF — ver
   BIBLIOTECA/00 - Agentes/04_REFERENCIAS_CIENTIFICAS/Catálogo - Biblioteca BSF.md):
   - Proteína altamente digestível (81–96%; N 87,7%) → ajuda a preservar
     massa magra, que o cão idoso perde. [papers digestibilidade]
   - Glucosamina natural (~0,4–0,5%) + potencial antiartrítico dos
     derivados de BSF → apoio à cartilagem/articulação. [insects-protein-quality]
   - Antioxidante/anti-inflamatório: ↑GPx/SOD e ↓TNF-α em beagles →
     apoio ao envelhecimento saudável. [bsf-defatted-meal-supplementation-beagle]
   - Quitina prebiótica → motilidade intestinal "especialmente em idosos"
     + AGCC (acetato/propionato/butirato). [catálogo/quitina]
   - Alta palatabilidade → ajuda o sênior que anda comendo menos. [palatabilidade]
   Enquadramento sênior: FEDIAF SAB — cão idoso precisa de dieta específica
   + acompanhamento veterinário. [fediaf-sab-statement-nutrition-of-senior-dogs]

   ⚠️ GUARDRAILS: é COMPLEMENTO nutricional (petisco + suplemento), NÃO
   substitui ração nem tratamento veterinário. Sem promessa de cura.
   Proteínas = valores MÍNIMOS: Original mín. 40% · Suplemento Integral mín. 45%.

   ⚠️ PENDÊNCIAS ANTES DE PUBLICAR (flag pra Olivia):
   1. CUPOM: "VITALIDADE" precisa ser cadastrado na Yampi (10% off, 1ª compra).
      Enquanto não existir, trocar por um cupom já ativo (ex.: ALIVIO/BORALA).
   2. PREÇO: herdado da LP /alergia (mesmo Kit Cães · token KQXZ5J7LWK):
      de R$145 → R$116 no site (−20%) → R$104,40 com cupom (−10%).
      Reconferir na Shopify se a loja mudou.
   3. REVIEWS: as imagens são placeholders de tutores — trocar por prints
      reais de cães idosos quando houver.
────────────────────────────────────────────────────────────── */

const COUPON = "GOOGLE10";  // 10% off — aprovado pela Olivia 10/08/26
const PRICE = "145,00";       // "de" — compare-at do Shopify (preço cheio)
const PRICE_OFF = "130,50";  // "por" — R$ 145,00 com o cupom GOOGLE10 (-10%), aplicado sozinho na URL
/* Kit Cachorro · token KQXZ5J7LWK · checkout direto Yampi (domínio seguro). */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?promocode=${COUPON}`;

const UTM_FALLBACK = {
  utm_source: "lp-idoso-google",
  utm_medium: "lp",
  utm_campaign: "lp-idoso-kit-caes-google",
};

const ctaUrl = (cta: "hero" | "oferta" | "final" | "sticky") =>
  buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

const HERO_IMG = "/assets/images/produtos/kit-caes.webp";

const CHIPS = [
  "🚚 Frete grátis",
  "🛡️ Compra segura",
  "🏭 Reg. MAPA",
  "💚 Garantia 14 dias",
];

const PROBLEMAS = [
  { dor: "Perdeu massa muscular — ficou mais “murcho” e fraco", causa: "com a idade o corpo aproveita menos a proteína; ele precisa de proteína boa e fácil de absorver." },
  { dor: "Anda devagar, tem preguiça de levantar e subir", causa: "articulação desgastada é comum na terceira idade — cartilagem pede reforço." },
  { dor: "Come cada vez menos e torce o nariz pra ração", causa: "olfato e apetite caem com a idade; um complemento saboroso ajuda a puxar a refeição." },
];

const BENEFICIOS = [
  {
    stat: "45%",
    statLbl: "proteína",
    title: "Músculo que a idade leva",
    desc: "O Suplemento Integral tem <strong>no mínimo 45% de proteína</strong>, altamente digestível (estudos apontam de 81% a 96% de digestibilidade). Proteína que o corpo aproveita de verdade ajuda a <strong>preservar a massa magra</strong> que o cão idoso costuma perder.",
  },
  {
    stat: "0,4%",
    statLbl: "glucosamina",
    title: "Articulação com apoio",
    desc: "A larva da Mosca Soldado Negra carrega <strong>glucosamina natural (~0,4–0,5%)</strong> — o mesmo bloco que forma a cartilagem. Em estudos, derivados da proteína de BSF mostraram <strong>potencial de proteção articular</strong>.",
  },
  {
    stat: "Ω",
    statLbl: "antioxidante",
    title: "Envelhecer com viço",
    desc: "Em cães, a BSF <strong>elevou enzimas antioxidantes (GPx, SOD)</strong> e reduziu marcador inflamatório (TNF-α). A quitina ainda ajuda a <strong>motilidade intestinal</strong> — importante justamente na fase idosa.",
  },
];

/* Prova social — abre com o Kit e segue com reviews reais de tutores.
   ⚠️ Trocar pelas melhores prints de tutores de cães idosos quando tiver. */
const SLIDES: Array<{ src: string; alt: string; type: "ugc" | "review" }> = [
  { type: "ugc",    src: "/assets/images/produtos/kit-caes.webp", alt: "Kit Cachorro — Original + Suplemento Integral" },
  { type: "review", src: "/assets/images/reviews/3.webp",        alt: "Review — cão idoso comendo com apetite de novo" },
  { type: "review", src: "/assets/images/reviews/5.webp",        alt: "Review — mais disposição na terceira idade" },
  { type: "review", src: "/assets/images/reviews/7.webp",        alt: "Review — pet sênior aceitou bem o suplemento" },
  { type: "review", src: "/assets/images/reviews/9.webp",        alt: "Review — pelo e energia melhores no cão velhinho" },
  { type: "review", src: "/assets/images/reviews/4.webp",        alt: "Review — fácil de misturar na ração" },
  { type: "review", src: "/assets/images/reviews/8.webp",        alt: "Review — tutor de cão idoso aprovou" },
];

const FAQ = [
  {
    q: "Meu cão já é idoso — pode dar?",
    a: "Pode. É proteína de inseto, <strong>altamente digestível</strong> e leve pro organismo — cai bem em cães de todas as idades, inclusive idosos. Como todo cão sênior merece acompanhamento, se ele tem alguma condição (rim, fígado) mostre o rótulo ao veterinário antes.",
  },
  {
    q: "Isso substitui a ração dele?",
    a: "Não. O Kit é um <strong>complemento</strong>: o Original é petisco/topper pra puxar o apetite e o Suplemento Integral é pó pra reforçar a proteína da refeição. Ele soma à alimentação — não troca a ração nem substitui tratamento veterinário.",
  },
  {
    q: "Ajuda mesmo na articulação?",
    a: "A larva tem <strong>glucosamina natural (~0,4–0,5%)</strong>, o mesmo bloco que forma a cartilagem, e derivados da proteína mostraram potencial de proteção articular em estudos. É <strong>apoio nutricional</strong>, não remédio — não promete cura.",
  },
  {
    q: "Meu cão anda comendo pouco. Vai aceitar?",
    a: "A proteína de BSF é bem palatável — em testes, cães aceitaram prontamente. O cheirinho costuma <strong>puxar o interesse do sênior</strong> que já torce o nariz pra ração. Dá pra usar o Original como recompensa e o pó misturado na comida.",
  },
  {
    q: "Como funciona a entrega?",
    a: "Despachamos em até 1 dia útil e o <strong>frete do Kit é grátis</strong> pra todo o Brasil. Compra <strong>100% segura</strong> via Yampi com cartão, Pix ou boleto.",
  },
];

const IdosoGoogle = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="idoso-lp">
      <PageMeta
        title="Suplemento para Cão Idoso — proteína que ele aproveita | Comida de Dragão"
        description="Suplemento para cachorro idoso à base de proteína de inseto: altamente digestível, com glucosamina natural pra articulação. Kit Cachorro pra músculo, disposição e apoio às juntas."
        image={HERO_IMG}
      />
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMG} fetchPriority="high" />
      </Helmet>

      {/* ════ HERO ════ */}
      <section className="ilp-hero">
        <div className="ilp-hero-inner">
          <div className="ilp-hero-top">
            <DragonLogo className="ilp-hero-logo" />
          </div>

          <span className="ilp-hero-eyebrow">suplemento para cão idoso · proteína que ele aproveita · fácil de aceitar</span>

          <h1 className="ilp-hero-title">
            Seu cão<br /><span>envelheceu?</span>
          </h1>

          <p className="ilp-hero-sub">
            Na terceira idade o corpo aproveita menos a proteína — e vem a
            <strong> perda de músculo</strong>, a preguiça de levantar e o apetite que cai.
            O <strong>suplemento para cão idoso</strong> da Comida de Dragão é{" "}
            <strong>proteína de inseto</strong>: leve, altamente digestível e com{" "}
            <strong>glucosamina natural</strong> pra articulação. O <strong>Kit Cachorro</strong>
            {" "}junta o petisco e o suplemento pra dar músculo, disposição e apoio às juntas.
          </p>

          <div className="ilp-hero-product-wrap">
            <img
              className="ilp-hero-product"
              src={HERO_IMG}
              alt="Kit Cachorro Comida de Dragão — Original + Suplemento Integral"
              width={460}
              height={410}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <span className="ilp-hero-frete-tag">Kit com frete grátis</span>
          </div>

          <div className="ilp-hero-price">
            <span className="ilp-price-from">Kit Cachorro de <s>R$ {PRICE}</s> por</span>
            <span className="ilp-price-now"><small>R$</small>{PRICE_OFF}</span>
            <span className="ilp-price-installment">🚚 Frete grátis · 4× sem juros</span>
          </div>

          <div className="ilp-hero-coupon">
            🏷️ <strong>10% de desconto já aplicado</strong> · 🚚 frete grátis no Kit
          </div>

          <div className="ilp-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="ilp-btn-primary" data-cta="hero">
              Comprar o Kit Cachorro — R$ {PRICE_OFF} →
            </a>
          </div>

          <div className="ilp-hero-chips">
            {CHIPS.map((c, i) => <span className="ilp-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ DEPOIMENTO (texto) ════
          Sobe prova social pra 2ª tela: 74% da atenção fica nas 2 primeiras
          telas e só ~50% chega na 3ª seção. Texto (não imagem) também conta
          pra relevância de landing page no Índice de Qualidade do Google. */}
      <section className="ilp-section ilp-quote-section">
        <div className="ilp-section-inner">
          <blockquote className="ilp-quote">
            <p>
              “Estou testando tem alguns meses o suplemento no meu cachorro idoso. Tô gostando
              bastante. <strong>Ele está mantendo bem a massa muscular e tava perdendo antes.</strong>{" "}
              Daqui a pouco vou começar a receitar para os meus pacientes.”
            </p>
            <cite>— veterinária, cliente Comida de Dragão</cite>
          </blockquote>
        </div>
      </section>

      {/* ════ PROBLEMA ════ */}
      <section className="ilp-section">
        <div className="ilp-section-inner">
          <span className="ilp-tag tag-pink">se isso te soa familiar</span>
          <h2 className="ilp-section-title title-pink">
            Ele tá mais devagar? <span>A idade pesa — mas dá pra ajudar.</span>
          </h2>
          <p className="ilp-section-lead">
            Cão idoso não precisa virar sinônimo de fraqueza. Boa parte do que
            parece “só velhice” é <strong>menos proteína aproveitada</strong> e
            <strong> articulação sem reforço</strong> — e isso a nutrição consegue apoiar.
          </p>

          <ul className="ilp-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="ilp-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ SOLUÇÃO ════ */}
      <section className="ilp-section">
        <div className="ilp-section-inner">
          <span className="ilp-tag">a solução</span>
          <h2 className="ilp-section-title">
            Proteína leve.<br /><span>Corpo que aproveita.</span>
          </h2>
          <p className="ilp-section-lead">
            A gente faz na nossa biofábrica no RJ, com <strong>registro MAPA</strong> e
            rastreabilidade do começo ao fim. A larva da Mosca Soldado Negra entrega
            proteína <strong>altamente digestível</strong> — o que importa quando o
            organismo do idoso já não absorve como antes.
          </p>

          <div className="ilp-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="ilp-beneficio" key={i}>
                <div className="ilp-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="ilp-beneficio-title">{b.title}</div>
                <div className="ilp-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>

          <p className="ilp-section-lead" style={{ marginTop: 20, fontSize: 14, opacity: 0.7 }}>
            Complemento nutricional — não substitui a ração nem o acompanhamento veterinário.
            Todo cão sênior merece dieta específica e checagem regular com o vet.
          </p>
        </div>
      </section>

      {/* ════ PROVA SOCIAL ════ */}
      <section className="ilp-section">
        <div className="ilp-section-inner">
          <span className="ilp-tag">tutores reais · cães reais</span>
          <h2 className="ilp-section-title">
            Velhinhos comendo bem<br /><span>e com mais ânimo.</span>
          </h2>

          {/* Review em TEXTO (real, banco Vozes & Argumentos) — conta pro Índice
              de Qualidade; o print/imagem do slider não conta. Foco no idoso:
              apetite que volta. */}
          <blockquote className="ilp-quote" style={{ marginBottom: 20 }}>
            <p>
              “Tenho duas, uma <strong>golden idosa</strong> e uma srd de 3 anos… Elas amaram. Depois dei
              misturada na ração e <strong>a golden pula e late desesperada querendo comer</strong>.
              Filhas felizes, mamãe feliz :)”
            </p>
            <cite>— Déborah Morato · Santo Cristo/RS · Kit Original · Judge.me 5★</cite>
          </blockquote>

          <div className="ilp-slider-wrap">
            <div className="ilp-slider" role="region" aria-label="Reviews de tutores de cães idosos">
              {SLIDES.map((s, i) => (
                <figure className="ilp-slide" key={i}>
                  <span className={`ilp-slide-tag${s.type === "ugc" ? " tag-orange" : ""}`}>
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

          <p className="ilp-slider-hint">← arraste pra ver mais →</p>
        </div>
      </section>

      {/* ════ OFERTA ════ */}
      <section className="ilp-oferta">
        <div className="ilp-oferta-inner">
          <span className="ilp-tag tag-lime">kit cachorro</span>
          <h2 className="ilp-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Cuide da terceira<br /><span>idade dele</span>
          </h2>

          <div className="ilp-oferta-coupon-box">
            <div className="ilp-oferta-coupon-label">🏷️ seu desconto</div>
            <div className="ilp-oferta-coupon-code">10% OFF</div>
            <div className="ilp-oferta-coupon-desc">Kit Cachorro de <s>R$ {PRICE}</s> por <strong>R$ {PRICE_OFF}</strong> · desconto já aplicado, sem digitar cupom · frete grátis</div>
          </div>

          <a href={ctaUrl("oferta")} className="ilp-btn-primary" data-cta="oferta">
              Comprar o Kit Cachorro — R$ {PRICE_OFF} →
            </a>

          <p className="ilp-hero-note" style={{ marginTop: 16 }}>
            Frete grátis no Kit · compra 100% segura via Yampi
          </p>
        </div>
      </section>

      {/* ════ E SE ELE TORCER O NARIZ? ════
          Bloco anti-rejeição. Dado (Panorama do Survey 08/07/26): o NPS é
          governado pela reação do pet — "amou" = +82, "recusou" = −50, com
          11% de rejeição. A dica de triturar e misturar na comida úmida veio
          de uma cliente real (7 gatos) que salvou a própria compra assim. */}
      <section className="ilp-section">
        <div className="ilp-section-inner">
          <span className="ilp-tag tag-pink">sem susto</span>
          <h2 className="ilp-section-title title-pink">
            E se ele<br /><span>torcer o nariz?</span>
          </h2>
          <p className="ilp-section-lead">
            Acontece — principalmente com sênior, que já anda enjoado. E quase sempre tem conserto.
          </p>

          <ul className="ilp-problemas-list">
            <li className="ilp-problema-item">
              <b>Triture e misture</b> — no lugar de oferecer puro, triture e misture na comida
              úmida. Foi assim que uma tutora conseguiu, depois de a primeira tentativa não colar.
            </li>
            <li className="ilp-problema-item">
              <b>Use como topper</b> — jogue por cima da ração, em vez de servir separado. O cheiro
              puxa o interesse de quem anda comendo pouco.
            </li>
            <li className="ilp-problema-item">
              <b>Insista com calma</b> — muito cão estranha na primeira e come na terceira.
            </li>
            <li className="ilp-problema-item">
              <b>Não colou mesmo?</b> — chama a gente no WhatsApp. E, se em 14 dias ele não topar,
              a gente devolve seu dinheiro.
            </li>
          </ul>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════ */}
      <section className="ilp-section">
        <div className="ilp-section-inner">
          <span className="ilp-tag">perguntas frequentes</span>
          <h2 className="ilp-section-title">
            Antes de comprar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="ilp-faq">
            {FAQ.map((f, i) => (
              <details className="ilp-faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="ilp-faq-answer" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="ilp-garantia">
            <div className="ilp-garantia-icon">💚</div>
            <div className="ilp-garantia-body">
              <strong>Garantia da matilha</strong>
              <span>Se seu cão não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="ilp-cta-final">
        <h2>
          Bora dar mais vida<br /><span>aos anos dele?</span>
        </h2>
        <p>Proteína que ele aproveita, articulação com apoio, apetite de volta. A idade chega — a disposição pode ficar.</p>
        <a href={ctaUrl("final")} className="ilp-btn-primary" data-cta="final">
              Comprar o Kit Cachorro — R$ {PRICE_OFF} →
            </a>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="ilp-footer">
        <DragonLogo className="ilp-footer-logo-svg" />
        <div className="ilp-footer-tagline">Nojento é o desperdício.</div>
        <div className="ilp-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════ */}
      <div className="ilp-sticky-cta">
        <div className="ilp-sticky-info">
          <span className="ilp-sticky-name">Kit Cachorro</span>
          <span className="ilp-sticky-price">R$ {PRICE_OFF} · 🏷️ 10% off</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky">Comprar — R$ {PRICE_OFF} →</a>
      </div>

      <LeadPopup slug="idoso-google" aposSeletor=".ilp-oferta" />
    </div>
  );
};

export default IdosoGoogle;
