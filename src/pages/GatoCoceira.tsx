import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./GatoCoceira.css";
import VideosVencedores, { VIDEOS_GATOS } from "@/components/VideosVencedores";
import LeadPopup from "@/components/LeadPopup";

/* ──────────────────────────────────────────────────────────────
   LP PARA QUEM TEM GATO · /gatos (até 09/10/26: /gato-coceira)
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

/* 🔄 REESCRITA DE 09/10/2026 (Olivia: "aplica o copy"):
   a página deixou de falar só com quem tem gato com coceira. Quem chega
   hoje é quem tocou "Tenho gato" no Boas Vindas do ManyChat. A coceira
   virou um de três motivos; o bloco "e se ele não comer?" subiu para logo
   depois do hero. Saiu o "88,9% de digestibilidade" (não conferido se o
   estudo é com gato). Proposta e pendências no vault:
   PROJETOS/CRO & Landing Pages/2026-10-09 - LP gato-coceira - proposta de reescrita. */
const COUPON = "GATOALIVIO";  // criado na Shopify 13/07 · 10% off, 1 uso/cliente
const PRICE = "145,00";       // compare-at do Shopify
const PRICE_OFF = "104,40";   // R$116 no site (−20%) → −10% com cupom
/* Kit para Gatos · SKU 1301 · token N9DLSJ6M4J */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/N9DLSJ6M4J`;

const UTM_FALLBACK = {
  utm_source: "lp-gatos",          // até 09/10/26: lp-gato-coceira (nunca teve pedido)
  utm_medium: "lp",
  utm_campaign: "lp-gatos-kit",
};

const ctaUrl = (cta: "hero" | "oferta" | "final" | "sticky") =>
  buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

const HERO_IMG = "/assets/images/produtos/kit-gatos.webp";

const CHIPS = [
  "🚚 Frete grátis",
  "🛡️ Compra segura",
  "🏭 Reg. MAPA",
  "💚 Garantia 14 dias",
];

const KIT_ITENS = [
  { nome: "Comida de Dragão Original", desc: "larvinhas inteiras. Dá pra oferecer na mão, como um agrado, ou por cima da comida." },
  { nome: "Suplemento para Gatos", desc: "pó com taurina, pra misturar na refeição." },
];

const BENEFICIOS = [
  {
    stat: "1.520",
    statLbl: "mg/kg taurina",
    title: "O que só o gato precisa",
    desc: "Gato <strong>não produz taurina suficiente sozinho</strong>. O Suplemento para Gatos tem <strong>taurina adicionada</strong> e no mínimo 40% de proteína.",
  },
  {
    stat: "Nova",
    statLbl: "proteína",
    title: "Uma proteína que ele nunca comeu",
    desc: "Quando o gato se coça, se lambe demais ou perde pelo, e pulga e ambiente já foram descartados, <strong>a comida entra na lista de suspeitos</strong>. A larva é uma proteína que ele nunca comeu. Quem fecha o diagnóstico é o veterinário.",
  },
  {
    stat: "Leve",
    statLbl: "pro intestino",
    title: "Intestino que agradece",
    desc: "Em estudos com gatos, a proteína da larva foi <strong>bem digerida</strong> e as <strong>fezes ficaram bem formadas</strong>.",
  },
];

const SLIDES: Array<{ src: string; alt: string; type: "ugc" | "review" }> = [
  { type: "ugc",    src: "/assets/images/produtos/kit-gatos.webp", alt: "Kit para Gatos — Original + Suplemento Felino" },
  { type: "review", src: "/assets/images/reviews/3.webp",         alt: "Review de cliente Comida de Dragão" },
  { type: "review", src: "/assets/images/reviews/5.webp",         alt: "Review de cliente Comida de Dragão" },
  { type: "review", src: "/assets/images/reviews/7.webp",         alt: "Review de cliente Comida de Dragão" },
  { type: "review", src: "/assets/images/reviews/9.webp",         alt: "Review de cliente Comida de Dragão" },
  { type: "review", src: "/assets/images/reviews/4.webp",         alt: "Review de cliente Comida de Dragão" },
];

const FAQ = [
  {
    q: "Serve pra qualquer gato?",
    a: "Pra gatos de <strong>todas as idades</strong>. Se o seu tem alguma doença ou toma remédio, combine com o veterinário.",
  },
  {
    q: "E se o meu gato não comer?",
    a: "Gato é gato, acontece. O que mais funciona: <strong>triturar e misturar no sachê</strong> em vez de oferecer puro, começar com uma pitada e insistir alguns dias. Se mesmo assim não rolar, <strong>a gente devolve seu dinheiro em 14 dias</strong>.",
  },
  {
    q: "Meu gato se coça. Isso resolve?",
    a: "A gente não promete cura. Coceira tem várias causas; se pulga e ambiente já foram descartados, <strong>trocar a proteína</strong> é um caminho que o veterinário costuma testar.",
  },
  {
    q: "Substitui a comida dele?",
    a: "Não. É <strong>complemento</strong>: soma à alimentação dele, não troca a comida do dia a dia nem o acompanhamento do veterinário.",
  },
  {
    q: "Como chega?",
    a: "Despachamos em até 1 dia útil e o <strong>frete do Kit é grátis</strong> pra todo o Brasil. Pagamento por cartão, Pix ou boleto.",
  },
];

const GatoCoceira = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="gato-lp">
      <PageMeta
        title="Para quem tem gato: proteína de inseto com taurina — Comida de Dragão"
        description="Kit para Gatos: larvinhas inteiras e um pó com taurina pra misturar na comida. Proteína que ele nunca comeu. Se ele não topar em 14 dias, a gente devolve o dinheiro."
        image={HERO_IMG}
        preload={HERO_IMG}
      />

      {/* ════ HERO ════ */}
      <section className="gcp-hero">
        <div className="gcp-hero-inner">
          <div className="gcp-hero-top">
            <a href="https://www.comidadedragao.com.br/collections/produtos" className="gcp-backlink">← comida de dragão</a>
            <a href="https://www.comidadedragao.com.br/collections/produtos">
              <DragonLogo className="gcp-hero-logo" />
            </a>
          </div>

          <span className="gcp-hero-eyebrow">para quem tem gato · proteína de inseto · com taurina</span>

          <h1 className="gcp-hero-title">
            Seu gato é exigente.<br /><span>A gente sabe.</span>
          </h1>

          <p className="gcp-hero-sub">
            <strong>Proteína de larva, feita no Rio, pra gato:</strong> um pacote de larvinhas
            inteiras e um pó com taurina pra misturar na comida dele. É uma proteína que ele
            nunca comeu, e por isso costuma ser bem recebida por gato sensível. Vem com um
            combinado: <strong>se ele não topar em 14 dias, a gente devolve o dinheiro.</strong>
          </p>

          <div className="gcp-hero-product-wrap">
            <img
              className="gcp-hero-product"
              src={HERO_IMG}
              alt="Kit para Gatos Comida de Dragão — Original + Suplemento para Gatos"
              width={460}
              height={410}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <span className="gcp-hero-frete-tag">Kit com frete grátis</span>
          </div>

          <div className="gcp-hero-price">
            <span className="gcp-price-from">Kit para Gatos por</span>
            <span className="gcp-price-now"><small>R$</small>{PRICE}</span>
            <span className="gcp-price-installment">🚚 Frete grátis · 4× sem juros</span>
          </div>

          <div className="gcp-hero-coupon">
            🚚 Frete grátis no Kit · conhece um afiliado nosso? usa o cupom dele no checkout
          </div>

          <div className="gcp-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="gcp-btn-primary" data-cta="hero">
              Quero o Kit para Gatos — R$ {PRICE} →
            </a>
          </div>

          <div className="gcp-hero-chips">
            {CHIPS.map((c, i) => <span className="gcp-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ E SE ELE NÃO COMER? ════
          Bloco OBRIGATÓRIO nesta LP, e desde 09/10/26 o primeiro depois do hero.
          É a fraqueza conhecida do produto em gatos (Suplemento Felino: 3,63★,
          40% das reviews ≤3★ da marca). A instrução é de cliente real que salvou
          a própria compra. */}
      <section className="gcp-section">
        <div className="gcp-section-inner">
          <span className="gcp-tag tag-pink">falando sério</span>
          <h2 className="gcp-section-title title-pink">
            E se ele<br /><span>não comer?</span>
          </h2>
          <p className="gcp-section-lead">
            Gato é gato. Alguns devoram na primeira. Outros cheiram, olham pra você e vão embora.
            A gente não vai fingir que isso não acontece.
          </p>

          <ul className="gcp-problemas-list">
            <li className="gcp-problema-item">
              <b>Triture e misture no sachê</b> — é o que mais funciona. Oferecer puro é onde
              a maioria desiste.
            </li>
            <li className="gcp-problema-item">
              <b>Comece com uma pitada</b> — por cima da comida de sempre, e vá aumentando.
            </li>
            <li className="gcp-problema-item">
              <b>Insista alguns dias</b> — cheiro novo, gato desconfia.
            </li>
            <li className="gcp-problema-item">
              <b>Não rolou?</b> — <strong>a gente devolve seu dinheiro em 14 dias.</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* 02/10/26 — reviews em foto e em texto saíram desta página (Olivia): a prova social agora são os vídeos de creator */}

      {/* ════ VÍDEOS DE CREATOR (faixa verde; padrão 25/09) — só aparece se houver vídeo ════ */}
      {VIDEOS_GATOS.length > 0 && <VideosVencedores reels={VIDEOS_GATOS} />}

      {/* ════ POR QUE DAR ISSO PRA UM GATO ════ */}
      <section className="gcp-section">
        <div className="gcp-section-inner">
          <span className="gcp-tag">três motivos</span>
          <h2 className="gcp-section-title">
            Por que dar isso<br /><span>pra um gato.</span>
          </h2>
          <p className="gcp-section-lead">
            A gente cria a larva na nossa biofábrica no RJ, com <strong>registro MAPA</strong> e
            rastreabilidade.
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
        </div>
      </section>

      {/* ════ O QUE VEM NO KIT ════ */}
      <section className="gcp-section">
        <div className="gcp-section-inner">
          <span className="gcp-tag tag-pink">o que vem no kit</span>
          <h2 className="gcp-section-title title-pink">
            Dois produtos,<br /><span>um pra cada hora.</span>
          </h2>

          <ul className="gcp-problemas-list">
            {KIT_ITENS.map((k, i) => (
              <li className="gcp-problema-item" key={i}>
                <b>{k.nome}</b> — {k.desc}
              </li>
            ))}
          </ul>

          <p className="gcp-section-lead" style={{ marginTop: 20, fontSize: 16, opacity: 0.7 }}>
            É complemento: soma à alimentação dele, não troca a comida do dia a dia nem o
            acompanhamento do veterinário.
          </p>
        </div>
      </section>

      {/* ════ OFERTA ════ */}
      <section className="gcp-oferta">
        <div className="gcp-oferta-inner">
          <span className="gcp-tag tag-lime">kit para gatos</span>
          <h2 className="gcp-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Larvinhas + taurina<br /><span>com frete grátis</span>
          </h2>

          <div className="gcp-oferta-coupon-box">
            <div className="gcp-oferta-coupon-label">🚚 vantagem</div>
            <div className="gcp-oferta-coupon-code">FRETE GRÁTIS</div>
            <div className="gcp-oferta-coupon-desc">Kit para Gatos por R$ {PRICE} · conhece um afiliado? usa o cupom dele no checkout</div>
          </div>

          <a href={ctaUrl("oferta")} className="gcp-btn-primary" data-cta="oferta">
              Quero o Kit para Gatos — R$ {PRICE} →
            </a>

          <p className="gcp-hero-note" style={{ marginTop: 16 }}>
            Frete grátis no Kit · compra 100% segura via Yampi
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="gcp-cta-final">
        <div className="gcp-section-inner">
          <h2>Bora apresentar o Dragão pro seu gato?</h2>
          <p>
            Taurina que ele precisa, proteína que ele nunca comeu e 14 dias pra ele decidir.
          </p>
          <a href={ctaUrl("final")} className="gcp-btn-primary" data-cta="final">
              Quero o Kit para Gatos — R$ {PRICE} →
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
            <a href="https://wa.me/552139500576" target="_blank" rel="noreferrer">Contato</a>
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
          Kit para Gatos · <b>R$ {PRICE}</b> · 🚚 frete grátis
        </div>
        <a href={ctaUrl("sticky")} className="gcp-btn-primary gcp-btn-sticky" data-cta="sticky">
          Comprar →
        </a>
      </div>

      <LeadPopup slug="gatos" aposSeletor=".gcp-oferta" />
    </div>
  );
};

export default GatoCoceira;
