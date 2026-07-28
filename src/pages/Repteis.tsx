import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Repteis.css";

/* ──────────────────────────────────────────────────────────────
   LP CAMPANHA — RÉPTEIS & ANFÍBIOS · /repteis
   Página satélite · tráfego pago · público frio (Non-Brand "por dor").
   Tema: DEPENDÊNCIA DO INSETO VIVO / CRIADOURO EM CASA.
   Produto-foco: GRUB · SKU 401 · token Yampi 9ZCGSMOOBC · R$110,00.

   ⚠️ POR QUE ESTE ÂNGULO — mineração de keywords 28/07/2026
   (`PROJETOS/Google & TikTok Ads/brief/mineracao-keywords-grub-repteis-
   2026-07-28.md`, fonte Google Keyword Planner):

   1. A CATEGORIA DO PRODUTO NÃO É BUSCADA. "gel para répteis", "comida
      para répteis", "alimento para leopard gecko" — todos abaixo do
      limiar de medição. O Grub inventou um formato sem vocabulário no
      Brasil. Vender pelo nome da categoria = repetir o grupo Alergia de
      junho (termo de produto, CTR 0,33%).
   2. A DEMANDA ESTÁ NO INSETO. `tenébrio` 4.400/mês; o cluster passa de
      9.000. E `criação de tenébrio` = 480/mês — gente pesquisando como
      criar larva DENTRO DE CASA. É a dor em estado puro.
   3. TERMO DE ESPÉCIE É ARMADILHA. `teiú` 18.100 e `leopardo gecko`
      14.800 parecem ouro, mas a expansão é morph, cor, preço e venda:
      é público comprando o ANIMAL, não alimentando.

   ⚠️ O ÂNGULO NÃO É "PARE DE DAR INSETO" — é "pare de DEPENDER do
   criadouro". Quem cria réptil GOSTA de dar inseto; o que ele odeia é a
   dependência (odor, colônia morrendo, polvilhar cálcio, custo semanal).

   ⚠️ GUARDRAILS DESTA PÁGINA:
   - O Grub é ALIMENTO COMPLETO (Olivia, 28/07) — mas NÃO é dieta única.
     O réptil precisa de alimentação variada. Essas duas frases são
     parecidas e dizem coisas diferentes: a página não pode escorregar.
   - ❌ SEM PERCENTUAL DE PROTEÍNA NA COPY. A ficha técnica está com
     defeito: pág. 1 diz 40% (valor herdado do Original) e pág. 2 diz 47%.
     Ver `BIBLIOTECA/02 - Produtos/Ficha Técnica/_CORRIGIR - ficha-tecnica-
     grub (2026-07-28).md`. Liberar o número SÓ quando a ficha fechar.
   - ❌ SEM FRETE GRÁTIS. O Grub custa R$110 e o piso é R$150 (Olivia,
     28/07). A página usa isso como empurrão pra 2ª unidade, não como
     promessa.
   - ⚠️ TARTARUGA/QUELÔNIO = COMPLEMENTO, nunca alimento base (DOC2:
     "quelônios/tartarugas — apenas complemento", uso esporádico).
     Entrar nesse mercado foi decisão da Olivia em 28/07; a promessa fica
     limitada.
   - ⛔ TARÂNTULA NÃO É INDICADA para nenhum produto da linha (DOC2).
   - ❌ SEM REVIEW INVENTADA. Não há review de Grub no banco. O slider usa
      só foto de produto até alguém puxar review real do Judge.me.
────────────────────────────────────────────────────────────── */

const PRICE = "110,00";        // Shopify, verificado 28/07/2026 · SKU 401
const FRETE_GRATIS_A_PARTIR = "150,00";
/* Grub — Répteis & Anfíbios · SKU 401 · token 9ZCGSMOOBC */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/9ZCGSMOOBC`;

/* ⚠️ PENDENTE — não usar na copy até a ficha técnica ser corrigida.
   Deixado aqui pra ser uma linha só de mudança quando fechar. */
const PROTEINA_PCT_PENDENTE = null; // 47% (pág.2/DOC2) vs 40% (pág.1). Ver _CORRIGIR.

const UTM_FALLBACK = {
  utm_source: "lp-repteis",
  utm_medium: "lp",
  utm_campaign: "lp-repteis-grub",
};

const ctaUrl = (cta: "hero" | "oferta" | "final" | "sticky") =>
  buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

/* ⚠️ hero em .webp de propósito: o grub-frente.PNG tem 4,3 MB (o hero da
   /gato-coceira tem 483 KB). Numa LP onde o gargalo é ATENÇÃO, 4,3 MB com
   fetchPriority="high" mata a página antes dela abrir. O .webp tem 131 KB.
   O .png fica só como og:image, que é lido por scraper e não pelo usuário. */
const HERO_IMG = "/assets/images/produtos/grub-frente.webp";
const OG_IMG = "/assets/images/produtos/grub-frente.png";

const CHIPS = [
  "🦎 Répteis e anfíbios",
  "🛡️ Compra segura",
  "🏭 Reg. MAPA",
  "💚 Garantia 14 dias",
];

const PROBLEMAS = [
  {
    dor: "O criadouro toma conta da casa",
    causa: "pote de tenébrio na despensa, cheiro, mosca escapando. Ninguém entrou nesse hobby pra criar inseto — entrou pelo bicho.",
  },
  {
    dor: "A colônia morre e ele fica sem comer",
    causa: "quando o alimento do seu réptil também é um ser vivo, você tem dois bichos pra manter — e um deles morre fácil.",
  },
  {
    dor: "Polvilhar cálcio em todo inseto, toda vez",
    causa: "inseto vivo tem relação cálcio-fósforo ruim. Por isso existe o ritual do pó — e por isso esquecer cobra caro.",
  },
  {
    dor: "A conta que não para de vir",
    causa: "comprar inseto vivo toda semana, o ano inteiro, sai caro e depende de alguém ter em estoque.",
  },
];

const BENEFICIOS = [
  {
    stat: "2,5:1",
    statLbl: "Ca:P",
    title: "O cálcio já vem na conta certa",
    desc: "A relação <strong>cálcio-fósforo de 2,5:1</strong> é a faixa que réptil precisa — e é justamente onde o inseto vivo falha, por isso o ritual de polvilhar pó em cada grilo. No Grub isso <strong>já vem pronto na formulação</strong>.",
  },
  {
    stat: "3",
    statLbl: "fontes de inseto",
    title: "Larva BSF, grilo preto e tenébrio",
    desc: "Não é uma farinha só: o Grub junta <strong>larva de Mosca Soldado Negra, grilo preto e tenébrio</strong>, mais cúrcuma, spirulina e levedura. A variedade que você tentaria montar comprando três potes diferentes.",
  },
  {
    stat: "6",
    statLbl: "meses fechado",
    title: "Não morre na sua despensa",
    desc: "É <strong>pó</strong> — mistura com água e vira gel firme ou papinha cremosa, do jeito que a espécie aceita melhor. Fechado dura <strong>meses</strong>; preparado, de 3 a 5 dias na geladeira. Sem odor, sem fuga, sem colônia pra manter.",
  },
];

const SLIDES: Array<{ src: string; alt: string; type: "produto" }> = [
  { type: "produto", src: "/assets/images/produtos/grub-frente.webp", alt: "Grub — alimento para répteis e anfíbios, pote de 120g" },
  { type: "produto", src: "/assets/images/produtos/grub-02.webp", alt: "Grub — detalhe do produto" },
  { type: "produto", src: "/assets/images/produtos/grub-03.webp", alt: "Grub — detalhe do produto" },
  { type: "produto", src: "/assets/images/produtos/grub-04.webp", alt: "Grub — detalhe do produto" },
  { type: "produto", src: "/assets/images/produtos/grub-05.webp", alt: "Grub — detalhe do produto" },
];

const FAQ = [
  {
    q: "Isso substitui a alimentação do meu réptil?",
    a: "O Grub é <strong>alimento completo</strong> — mas isso não quer dizer dieta única. Réptil precisa de <strong>alimentação variada</strong>, e a gente não vai dizer o contrário. A ideia é o Grub ser a <strong>base pronta e equilibrada</strong>, com o inseto vivo virando variedade e enriquecimento — não obrigação diária.",
  },
  {
    q: "Então eu paro de dar inseto vivo?",
    a: "Não precisa, e a gente nem sugere isso. Quem cria réptil normalmente <strong>gosta</strong> de dar inseto — faz parte. O que a gente resolve é a <strong>dependência</strong>: o criadouro em casa, o cheiro, a colônia que morre e o cálcio que você tem que lembrar de polvilhar em cada um.",
  },
  {
    q: "Como eu preparo?",
    a: "Dois jeitos, escolhe o que a sua espécie aceita melhor. <strong>Gel firme:</strong> 2 partes de água quente pra 1 de Grub, mistura e deixa gelificar. <strong>Papinha cremosa:</strong> 3 partes de água morna (50–60&nbsp;°C) pra 1 de Grub, mistura até ficar sem grumos. Preparado dura de <strong>3 a 5 dias na geladeira</strong> — e dá pra congelar em porções.",
  },
  {
    q: "Serve pra qual bicho?",
    a: "Indicação mais forte em <strong>leopard gecko, teiú-preto-e-branco e teiú-vermelho</strong> (todos os estágios) e no <strong>dragão-barbudo</strong> na fase insetívora — filhotes e jovens com frequência, adultos cerca de 1x por semana junto com vegetais. Também <strong>gekko tokay, phelsumas, tiliquas e varanus</strong>. Em anfíbios: <strong>sapo-pacman, sapo-pipa, sapo-boi, rãs arborícolas e salamandras</strong>. Iguana e crested gecko aceitam em preparação mais hidratada, de forma esporádica.",
  },
  {
    q: "E pra tartaruga ou jabuti?",
    a: "Para <strong>quelônios o Grub entra como complemento</strong>, não como alimento base — a alimentação principal deles é outra. Dá pra usar como enriquecimento pontual, sem substituir a dieta.",
  },
  {
    q: "Serve pra tarântula?",
    a: "<strong>Não.</strong> Tarântulas não são espécie indicada para nenhum produto da linha Comida de Dragão. Preferimos falar isso na cara do que vender errado.",
  },
  {
    q: "Como funciona a entrega e o frete?",
    a: `Despachamos em até 1 dia útil pra todo o Brasil, com compra <strong>100% segura</strong> via Yampi — cartão, Pix ou boleto. O <strong>frete fica grátis acima de R$&nbsp;${FRETE_GRATIS_A_PARTIR}</strong>, então duas unidades já passam do valor.`,
  },
];

const Repteis = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="repteis-lp">
      <PageMeta
        title="Alimentação de répteis sem criar inseto em casa — Comida de Dragão"
        description="Cansou de manter criadouro de tenébrio, do cheiro e de polvilhar cálcio em cada grilo? Grub é alimento em pó à base de três insetos, com relação cálcio-fósforo 2,5:1 já pronta. Para geckos, teiús, dragões-barbudos, sapos e rãs."
        image={OG_IMG}
      />
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMG} fetchPriority="high" />
      </Helmet>

      {/* ════ HERO ════ */}
      <section className="rep-hero">
        <div className="rep-hero-inner">
          <div className="rep-hero-top">
            <Link to="/portal" className="rep-backlink">← comida de dragão</Link>
            <DragonLogo className="rep-hero-logo" />
          </div>

          <span className="rep-hero-eyebrow">répteis e anfíbios · três insetos · Ca:P 2,5:1</span>

          {/* H1 não pede pra parar de dar inseto — pede pra parar de CRIAR.
              É a diferença entre falar com o tutor e brigar com o hobby dele.
              A keyword real do cluster ("alimentação de répteis", ~1.000/mês,
              e o cluster de tenébrio) entra na subheadline. */}
          <h1 className="rep-hero-title">
            Seu réptil come inseto.<br /><span>Você não precisa criar um.</span>
          </h1>

          <p className="rep-hero-sub">
            <strong>O pote de tenébrio na despensa, o cheiro, a colônia que morre justo na semana
            errada.</strong> Ninguém entrou nesse hobby pra virar criador de larva — entrou pelo
            bicho. O <strong>Grub</strong> é pó que vira gel ou papinha, feito de{" "}
            <strong>três fontes de inseto</strong>, com a relação <strong>cálcio-fósforo já
            equilibrada em 2,5:1</strong> — aquela que você tenta acertar polvilhando pó em cada
            grilo. Alimento completo, dentro de uma alimentação variada.
          </p>

          <div className="rep-hero-product-wrap">
            <img
              className="rep-hero-product"
              src={HERO_IMG}
              alt="Grub Comida de Dragão — alimento para répteis e anfíbios, 120g"
              width={460}
              height={410}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <span className="rep-hero-frete-tag">120g · rende muito</span>
          </div>

          <div className="rep-hero-price">
            <span className="rep-price-from">Grub 120g por</span>
            <span className="rep-price-now"><small>R$</small>{PRICE}</span>
            <span className="rep-price-installment">4× sem juros · frete grátis acima de R$ {FRETE_GRATIS_A_PARTIR}</span>
          </div>

          <div className="rep-hero-coupon">
            🚚 Duas unidades já passam do frete grátis · conhece um afiliado nosso? usa o cupom dele no checkout
          </div>

          <div className="rep-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="rep-btn-primary" data-cta="hero">
              Quero parar de criar inseto →
            </a>
          </div>

          <div className="rep-hero-chips">
            {CHIPS.map((c, i) => <span className="rep-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ PROBLEMA ════ */}
      <section className="rep-section">
        <div className="rep-section-inner">
          <span className="rep-tag tag-pink">se isso te soa familiar</span>
          <h2 className="rep-section-title title-pink">
            O bicho é fácil.<br /><span>Manter a comida dele é que não.</span>
          </h2>
          <p className="rep-section-lead">
            Réptil é um pet de rotina simples — até você perceber que passou a cuidar de{" "}
            <strong>dois</strong> bichos: o seu, e a caixa de larva que alimenta o seu.
          </p>

          <ul className="rep-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="rep-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ SOLUÇÃO ════ */}
      <section className="rep-section">
        <div className="rep-section-inner">
          <span className="rep-tag">a solução</span>
          <h2 className="rep-section-title">
            A base pronta —<br /><span>o inseto vivo vira escolha.</span>
          </h2>
          <p className="rep-section-lead">
            A gente cria a larva na nossa biofábrica no RJ, com <strong>registro MAPA</strong> e
            rastreabilidade. O Grub chega em pó: mistura com água, vira gel firme ou papinha
            cremosa, e vai pro pote.
          </p>

          <div className="rep-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="rep-beneficio" key={i}>
                <div className="rep-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="rep-beneficio-title">{b.title}</div>
                <div className="rep-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>

          <p className="rep-section-lead" style={{ marginTop: 20, fontSize: 14, opacity: 0.7 }}>
            Alimento completo, para uso dentro de uma alimentação variada — não substitui
            integralmente a alimentação do animal nem o acompanhamento veterinário.
          </p>
        </div>
      </section>

      {/* ════ A CONVERSA HONESTA ════
          Bloco equivalente ao "e se ele não comer?" da /gato-coceira.
          Aqui a objeção real não é palatabilidade — é o tutor achando que a
          gente está mandando ele abandonar o inseto vivo. Se a página não
          desarmar isso, o criador experiente rejeita de cara. */}
      <section className="rep-section">
        <div className="rep-section-inner">
          <span className="rep-tag tag-pink">falando sério</span>
          <h2 className="rep-section-title title-pink">
            A gente não veio<br /><span>brigar com o inseto vivo.</span>
          </h2>
          <p className="rep-section-lead">
            Dar inseto faz parte — é enriquecimento, é comportamento de caça, e muita gente
            gosta disso. O que a gente quer tirar da sua vida é a <strong>dependência</strong>,
            não o hábito.
          </p>

          <ul className="rep-problemas-list">
            <li className="rep-problema-item">
              <b>Comece misturado</b> — ofereça o gel junto do que ele já come, pra reconhecer o
              cheiro antes de virar refeição inteira.
            </li>
            <li className="rep-problema-item">
              <b>Ajuste a consistência</b> — gel mais firme pra quem morde, papinha mais hidratada
              pra iguana, crested e leachianus.
            </li>
            <li className="rep-problema-item">
              <b>Mantenha a variedade</b> — a base pronta não elimina a necessidade de dieta
              variada. Inseto vivo continua bem-vindo, só deixa de ser obrigação.
            </li>
            <li className="rep-problema-item">
              <b>Não colou mesmo?</b> — <strong>a gente devolve seu dinheiro em 14 dias.</strong> Sem
              letrinha miúda.
            </li>
          </ul>
        </div>
      </section>

      {/* ════ O PRODUTO ════
          ⚠️ Sem review: não existe review de Grub no banco de Vozes &
          Argumentos nem no Judge.me até 28/07. Slider usa só foto de
          produto. NÃO inventar depoimento — quando houver review real,
          trocar aqui e reativar o badge "review". */}
      <section className="rep-section">
        <div className="rep-section-inner">
          <span className="rep-tag">o pote por dentro</span>
          <h2 className="rep-section-title">
            120 gramas de pó<br /><span>que rende muito gel.</span>
          </h2>

          <div className="rep-slider" role="region" aria-label="Fotos do Grub">
            {SLIDES.map((s, i) => (
              <figure className="rep-slide" key={i}>
                <span className="rep-slide-badge">o pote</span>
                <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
          <p className="rep-slider-hint">← arraste pra ver mais →</p>
        </div>
      </section>

      {/* ════ OFERTA ════ */}
      <section className="rep-oferta">
        <div className="rep-oferta-inner">
          <span className="rep-tag tag-lime">grub · 120g</span>
          <h2 className="rep-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Tira o criadouro<br /><span>da sua despensa</span>
          </h2>

          <div className="rep-oferta-coupon-box">
            <div className="rep-oferta-coupon-label">🚚 vantagem</div>
            <div className="rep-oferta-coupon-code">2 POTES = FRETE GRÁTIS</div>
            <div className="rep-oferta-coupon-desc">
              Grub por R$ {PRICE} · frete grátis a partir de R$ {FRETE_GRATIS_A_PARTIR}
            </div>
          </div>

          <a href={ctaUrl("oferta")} className="rep-btn-primary" data-cta="oferta">
            Quero o Grub →
          </a>

          <p className="rep-hero-note" style={{ marginTop: 16 }}>
            Compra 100% segura via Yampi · cartão, Pix ou boleto
          </p>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════ */}
      <section className="rep-section">
        <div className="rep-section-inner">
          <span className="rep-tag">perguntas frequentes</span>
          <h2 className="rep-section-title">
            Antes de comprar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="rep-faq">
            {FAQ.map((f, i) => (
              <details className="rep-faq-item" key={i}>
                <summary className="rep-faq-q">{f.q}</summary>
                <div className="rep-faq-a" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="rep-garantia">
            <div className="rep-garantia-icon">💚</div>
            <div>
              <div className="rep-garantia-title">Garantia da matilha</div>
              <div className="rep-garantia-text">
                Se ele não topar em 14 dias da entrega, a gente devolve seu dinheiro.
                Sem letrinha miúda.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="rep-cta-final">
        <div className="rep-section-inner">
          <h2>Bora tirar o criadouro de casa?</h2>
          <p>
            Três insetos num pote, cálcio e fósforo já na proporção certa, e nada pra manter vivo
            na despensa. O inseto vivo continua — só deixa de ser obrigação.
          </p>
          <a href={ctaUrl("final")} className="rep-btn-primary" data-cta="final">
            Quero o Grub →
          </a>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="rep-footer">
        <div className="rep-footer-inner">
          <nav className="rep-footer-nav">
            <a href="https://www.comidadedragao.com.br">Loja</a>
            <Link to="/produtos">Linha completa</Link>
            <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/5521993049400" target="_blank" rel="noreferrer">Contato</a>
          </nav>
          <p className="rep-footer-tagline">Nojento é o desperdício.</p>
          <p className="rep-footer-credits">
            Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
          </p>
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════ */}
      <div className="rep-sticky">
        <div className="rep-sticky-price">
          Grub 120g · <b>R$ {PRICE}</b>
        </div>
        <a href={ctaUrl("sticky")} className="rep-btn-primary rep-btn-sticky" data-cta="sticky">
          Comprar →
        </a>
      </div>
    </div>
  );
};

export default Repteis;
