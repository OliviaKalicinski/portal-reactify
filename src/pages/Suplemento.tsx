import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent, trackAddToCart } from "@/lib/pixel";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Suplemento.css";
import LeadPopup from "@/components/LeadPopup";

/* ──────────────────────────────────────────────────────────────
   LP PRODUTO — SUPLEMENTO INTEGRAL
   Página satélite · tráfego pago Meta Ads · público frio
   Ângulo (25/08): a FASE do cão — filhote, ativo e idoso pedem mais proteína
   do que a ração comum entrega. Hipoalergênico e "só cães" entram como prova,
   não como manchete.
   CTA único: checkout direto Yampi, sem cupom embutido (25/08)

   Espelho exato da LP do Original (Original.tsx) — mesma estrutura,
   mesmas seções, mesmo padrão de performance. Só muda a copy, as
   fotos, o preço e o checkout Yampi (produto diferente).

   Decisões de performance:
   ─ LP autocontida, NÃO importa Portal.css/Parceiros.css
   ─ Prova social em imagem (UGC + reviews), sem vídeo
   ─ Code-split via React.lazy em App.tsx
   ─ Helmet faz preload da hero image (LCP)

   ⚠️ 25/08: as imagens de prova passaram a ser do próprio Integral (ver SLIDES).
────────────────────────────────────────────────────────────── */

/* Checkout Yampi do Suplemento Integral 180g.
   /r/BII063ST2H é o "Buy Now URL" oficial do produto — adiciona o
   Suplemento Integral ao carrinho automaticamente e leva direto ao
   checkout.
   ⚠️ 25/08 — SAIU o `?promocode=BORALA` (decisão da Olivia). O desconto
   que a página menciona agora é o do CREATOR: quem acompanha a marca no
   Instagram tem o cupom de algum influenciador e digita no checkout.
   Mesmo padrão da /original desde 19/08.
   UTMs marcam tráfego como Meta Ads + utm_content varia por CTA. */
const PRODUCT_URL = "https://seguro.comidadedragao.com.br/r/BII063ST2H";

/** Fallback usado SO quando o anuncio nao trouxe utm_ (trafego direto/organico). */
const UTM_FALLBACK = {
  utm_source: "lp-suplemento",
  utm_medium: "lp",
  utm_campaign: "lp-suplemento",
};

/** Repassa a UTM de entrada (do anuncio); posicao do botao vai em cta_pos. */
const ctaUrl = (cta: "hero" | "problema" | "solucao" | "prova" | "oferta" | "final" | "sticky") =>
  buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

/* Identidade do produto pro pixel do Meta. SKU 302 e R$ 110,00 conferidos no
   conector da Shopify em 25/08. Se o preço mudar, muda aqui também — o Meta
   usa esse `value` pra calcular ROAS de AddToCart. */
const PIXEL_PRODUTO = {
  content_name: "Suplemento Integral 180g",
  content_id: "302",
  value: 110,
};

const HERO_IMG = "/assets/images/produtos/suplemento-integral-frente.webp";

/* ⚠️ og:image em JPG de propósito (25/08): o card de link do WhatsApp e do
   Facebook NÃO renderiza WebP — está escrito no próprio PageMeta.tsx desde
   19/08 e esta página vinha passando o `.webp` do hero, ou seja, todo link
   compartilhado saía sem imagem. 1200x675, gerado do
   `suplemento-integral-frente.png`. A /grub já usa um `-og` separado por isso. */
const OG_IMG = "/assets/images/produtos/suplemento-integral-og.jpg";

const CHIPS = [
  "🚚 Entrega Brasil",
  "🛡️ Compra segura",
  "🏭 Reg. MAPA",
  "💚 Garantia 14 dias",
];

/* 26/08 — reescritos na voz do tutor. A versão anterior falava em "fases de
   alta demanda", "suplemento de prateleira" e "cada colher precisa render":
   é vocabulário de rótulo, e quem chega do feed não pensa assim. Cada item
   agora é uma cena que a pessoa reconhece, e a explicação vem depois.
   ⚠️ O PRIMEIRO item é o cão que está bem (Olivia, 26/08): a lista começava
   direto na queixa e contradizia o "pra todos os cães" do hero. */
const PROBLEMAS = [
  {
    dor: "Ele está bem — e você quer que continue",
    causa: "manutenção também é trabalho: músculo, pelo e defesa se sustentam com proteína boa entrando todo dia, não só quando algo dá errado.",
  },
  {
    dor: "Ele come tudo e continua magrelo",
    causa: "filhote crescendo e cão que se mexe o dia inteiro gastam mais do que a ração de manutenção repõe.",
  },
  {
    dor: "O idoso está perdendo massa",
    causa: "com a idade ele aproveita menos a proteína da mesma tigela, e a perna fina aparece antes de a balança mudar.",
  },
  {
    dor: "Come pouco, e você fica na dúvida se foi o bastante",
    causa: "quando o apetite é curto, o que importa não é o volume no pote: é o quanto de proteína cabe em cada colher.",
  },
  {
    dor: "Já tentou suplemento e não viu diferença",
    causa: "muita coisa vendida como reforço é corante, aroma e a mesma proteína de frango que ele já come na ração.",
  },
];

const BENEFICIOS = [
  {
    stat: "45%",
    statLbl: "proteína",
    title: "Mais proteína na mesma tigela",
    desc: "<strong>Farinha de larva de mosca soldado negra</strong>, com o perfil completo de aminoácidos essenciais. Uma colher por cima da ração muda o que entra de proteína no dia, sem trocar a comida dele.",
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

/* Slider de prova social.

   ⚠️ REFEITO EM 25/08 — a lista antiga era `reviews/3` a `reviews/9`, os mesmos
   sete cards genéricos que rodam em ONZE LPs. Auditados um a um: falam de
   PETISCO ("larvas, eles amam", "larvinhas como recompensa no adestramento",
   dores articulares) e o `9.webp` mostra a lata do Suplemento CONCENTRADO, que
   está arquivado na Shopify. Numa LP que vende o Integral em pó, isso é prova
   de outro produto — e cada LP escrevia um alt diferente pro MESMO arquivo
   (`3.webp` era "cão alérgico" na /alergia e "mais disposição" aqui), ou seja,
   o alt contava a história da página em vez de descrever a imagem.

   O que entrou é material do próprio Integral, que já existia em
   `public/assets/images/produtos/`. Alt descreve o que a imagem MOSTRA.
   ⚠️ Curadoria fechada pela Olivia em 26/08: 07, 08 e 05, nesta ordem — o pote
   com o cão, o cão comendo e as mensagens de quem já usa. As outras quatro
   (02, 03, 04, 06) ficaram de fora e seguem na pasta. */
const SLIDES: Array<{ src: string; alt: string; type: "ugc" | "review" }> = [
  { type: "ugc",    src: "/assets/images/produtos/integral-07.webp", alt: "Cão deitado ao lado do pote do Suplemento Proteico Integral" },
  { type: "ugc",    src: "/assets/images/produtos/integral-08.webp", alt: "Cão comendo direto do pote do Suplemento Integral" },
  { type: "review", src: "/assets/images/produtos/integral-05.webp", alt: "Três mensagens de tutores sobre colocar o suplemento na ração" },
];

const FAQ = [
  {
    q: "Como ofereço pro meu cão?",
    a: "É só <strong>polvilhar na ração</strong>, uma vez ao dia. Acompanha dosador — a quantidade vai de 1 a 4 medidas conforme o porte do cão. Alta palatabilidade: a maioria aceita de primeira.",
  },
  {
    q: "Isso substitui a ração?",
    a: "Não. O Integral é <strong>complemento</strong> — entra junto da alimentação normal pra reforçar a proteína, e a ração continua sendo a base. Ele é <strong>formulado pra cães</strong>; em gato, só com orientação do veterinário. Pra felino a gente tem o <strong>Suplemento para Gatos</strong>, que leva taurina.",
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
  useEffect(() => {
    captureEntryUtms();
    // 26/08 — a LP passa a emitir ViewContent. Antes daqui o pixel só via
    // PageView, e o InitiateCheckout acontecia no domínio do checkout.
    trackViewContent(PIXEL_PRODUTO);
  }, []);

  /* AddToCart no clique — não bloqueia a navegação: o fbq usa sendBeacon e o
     link segue normalmente pro carrinho. */
  const onCta = (cta: string) => () => trackAddToCart({ ...PIXEL_PRODUTO, cta });
  return (
    <div className="suplemento-lp">
      <PageMeta
        title="Suplemento Integral — 45% de proteína pra todos os cães"
        description="Suplemento em pó com 45% de proteína de Mosca Soldado Negra. Hipoalergênico, cúrcuma e spirulina, acompanha dosador. Polvilha na ração e pronto."
        image={OG_IMG}
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

          {/* HERO REESCRITO 25/08 (opção A, escolhida pela Olivia).
              O que saiu e por quê:
              · "novidade" — o Integral está na loja desde jul/2025. Mesma palavra
                que a /original aposentou em 19/08.
              · "O reforço que falta na tigela" — não diz PRA QUEM. Quem chega do
                feed não sabe se é ração, petisco ou remédio, e não se reconhece.
              · a subheadline abria em "farinha de larva": entregava a objeção
                antes de dar qualquer motivo pra querer.
              · "boost proteico" — palavra de rótulo. A pessoa não busca isso.
              O H1 agora é pergunta de reconhecimento e a sub nomeia as três fases
              (filhote / ativo / idoso), que é o corte que também separa público e
              criativo no Meta. A larva aparece, mas depois do motivo.

              ⚠️ REVISADO 26/08 (Olivia): a pergunta "a ração dele já não dá conta?"
              fazia a página parecer remédio — só pra quem tem problema. O suplemento
              é pra TODOS os cães, e isso tem que estar no hero. A eyebrow abre com
              "para todos os cães" — que a Olivia pediu no H1, então a eyebrow deixou de
              repetir a frase —, e as fases continuam na sub,
              mas como exemplos — com o cão saudável incluído na lista. */}
          <span className="slp-hero-eyebrow">45% de proteína · pó pra polvilhar · Reg. MAPA</span>

          <h1 className="slp-hero-title">
            Proteína a mais,<br /><span>para todos os cães.</span>
          </h1>

          <p className="slp-hero-sub">
            <strong>Todo cão come melhor com mais proteína</strong> — o filhote que está crescendo, o
            adulto que corre, o idoso que precisa segurar o músculo e também o saudável que você quer
            manter assim. O Integral é <strong>pó</strong>: polvilha por cima da ração de sempre, uma
            vez por dia. São <strong>45% de proteína</strong> de larva, com cúrcuma e spirulina,{" "}
            <strong>sem frango, boi, soja nem glúten</strong>.
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
            <span className="slp-price-from">Suplemento Integral 180g</span>
            <span className="slp-price-now"><small>R$</small>110,00</span>
            <span className="slp-price-installment">4× sem juros · 180g</span>
          </div>

          <div className="slp-hero-coupon">
            🎟️ segue algum creator nosso no Instagram? o cupom dele vale no checkout
          </div>

          <div className="slp-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="slp-btn-primary" data-cta="hero" onClick={onCta("hero")}>
              Quero reforçar a ração dele →
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
          {/* 26/08 — a seção inteira era de queixa e desmentia o hero três segundos
              depois dele. Agora ela abre por MOMENTO, não por problema: o cão que
              está bem aparece primeiro na lista, e as fases de demanda alta vêm
              como casos em que a diferença é maior. */}
          <span className="slp-tag tag-pink">quando faz diferença</span>
          <h2 className="slp-section-title title-pink">
            Todo cão aproveita. <span>Uns precisam mais.</span>
          </h2>
          <p className="slp-section-lead">
            Proteína boa é a base de músculo, pelo e defesa — <strong>em qualquer cão, em
            qualquer idade</strong>. Em algumas fases a conta aperta mais, e é aí que uma
            colher a mais muda o dia dele.
          </p>

          <ul className="slp-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="slp-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>

          <div className="slp-section-cta">
            <a href={ctaUrl("problema")} className="slp-btn-primary" data-cta="problema" onClick={onCta("problema")}>
              Quero resolver a proteína →
            </a>
          </div>
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

          {/* 25/08 — mesma correção que a /original recebeu em 19/08 (commit
              90680fc): eram 6.795px sem nenhum botão entre o hero e a oferta,
              e a sticky some acima de 720px, então tablet e desktop passavam
              sete telas sem saída. */}
          <div className="slp-section-cta">
            <a href={ctaUrl("solucao")} className="slp-btn-primary" data-cta="solucao" onClick={onCta("solucao")}>
              Bora reforçar a tigela →
            </a>
          </div>
        </div>
      </section>

      {/* ════ É FARINHA DE LARVA MESMO (anti-rejeição) ═══════════
          25/08 — clonado da /original, que clonou da /curiosidade. Esta página
          escreve "larva" quatro vezes e nunca tratava a reação da pessoa — e
          ela recebe tráfego frio de Meta, onde ninguém pediu pra ver isso.
          A objeção aqui não é a mesma do petisco: no pó não tem larva inteira
          pra olhar, o problema é misturar na comida do cão.
          ⚠️ Depoimentos: os dois são de fonte pública (Instagram) e do produto
          certo. O banco de Vozes tem outros mais fortes, mas são print de
          WhatsApp — conversa privada, exige autorização antes de publicar. */}
      <section className="slp-section">
        <div className="slp-section-inner">
          <span className="slp-tag tag-pink">é farinha de larva mesmo</span>
          <h2 className="slp-section-title title-pink">
            Estranhou?<br /><span>Seu cão não vai.</span>
          </h2>
          <p className="slp-section-lead">
            O nojo é nosso, não dele. E aqui não tem larva pra olhar: o Integral é
            <strong> pó</strong>, e vai por cima da ração de sempre. Se bater dúvida,
            começa assim:
          </p>

          <ul className="slp-problemas-list">
            <li className="slp-problema-item">
              <b>Comece com meia medida</b> — polvilha por cima da ração de sempre, sem misturar, e vai aumentando até a medida do porte dele.
            </li>
            <li className="slp-problema-item">
              <b>Um pote dura semanas</b> — de 12 dias num cão grande a mais de um mês num mini. Dá tempo de o hábito pegar.
            </li>
            <li className="slp-problema-item">
              <b>Não colou mesmo?</b> — <strong>a gente devolve seu dinheiro em 14 dias.</strong> Sem letrinha miúda.
            </li>
          </ul>

          <blockquote className="slp-quote">
            <p>“Que fofoo 😍 <strong>o meu ama o suplemento integral</strong>”</p>
            <cite>— @beatrizdrsamaral · Instagram</cite>
          </blockquote>
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

          {/* CTA logo depois da prova social — é onde a pessoa acabou de ver
              outro cão comendo. Sem ele, o próximo botão só aparecia 4.000px
              adiante, na oferta. */}
          <div className="slp-section-cta">
            <a href={ctaUrl("prova")} className="slp-btn-primary" data-cta="prova" onClick={onCta("prova")}>
              Quero o meu · R$ 110,00 →
            </a>
          </div>
        </div>
      </section>

      {/* ════ OFERTA + CUPOM ═════════════════════════════════════ */}
      <section className="slp-oferta">
        <div className="slp-oferta-inner">
          {/* 25/08 — saíram DUAS coisas: "oferta de lançamento" (o Integral está
              na loja desde jul/2025, mesmo motivo que tirou a palavra da /original
              em 19/08) e o cupom BORALA, por decisão da Olivia. O desconto que
              sobra é o do creator, que a pessoa digita no checkout — a página
              avisa que existe, não promete valor que o link não entrega. */}
          <span className="slp-tag tag-lime">pronto pra levar</span>
          <h2 className="slp-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Suplemento Integral<br /><span>180g por R$ 110,00</span>
          </h2>

          <div className="slp-oferta-coupon-box">
            <div className="slp-oferta-coupon-label">tem cupom de creator?</div>
            <div className="slp-oferta-coupon-desc">
              Vários creators que a gente repostou no Instagram têm cupom — se você
              segue algum, é só digitar o dele no checkout.
            </div>
          </div>

          <a href={ctaUrl("oferta")} className="slp-btn-primary" data-cta="oferta" onClick={onCta("oferta")}>
            Quero o Integral →
          </a>

          <p className="slp-hero-note" style={{ marginTop: 16 }}>
            Compra 100% segura via Yampi · cartão, Pix ou boleto
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
        <a href={ctaUrl("final")} className="slp-btn-primary" data-cta="final" onClick={onCta("final")}>
          Bora reforçar a tigela →
        </a>
      </section>

      {/* ════ FOOTER ═════════════════════════════════════════════ */}
      <footer className="slp-footer">
        <DragonLogo className="slp-footer-logo-svg" />
        <nav className="slp-footer-links">
          <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
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
          <span className="slp-sticky-price">R$ 110,00 · 4× sem juros</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky" onClick={onCta("sticky")}>Comprar →</a>
      </div>

      {/* 25/08 — sem `aposSeletor` o gatilho que abria na prática era o de 50%
          de scroll: 5.898px numa página de 11.795px, ou seja, ANTES da prova
          social (7.530px) e da oferta (7.695px). Mesmo defeito que a Olivia
          mandou corrigir na /grub em 28/07. Agora o popup só pode abrir depois
          que a oferta saiu da tela. */}
      <LeadPopup slug="suplemento" aposSeletor=".slp-oferta" />
    </div>
  );
};

export default Suplemento;
