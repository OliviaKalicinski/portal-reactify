import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Grub.css";

/* ──────────────────────────────────────────────────────────────
   LP CAMPANHA — GRUB · REPTEIS & ANFIBIOS · /grub
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
  utm_source: "lp-grub",
  utm_medium: "lp",
  utm_campaign: "lp-grub",
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

/* ⚠️ REBALANCEADO 28/07 (feedback da Olivia): a praticidade fica, mas o
   "inseto vivo" deixa de ser a página inteira e vira UM argumento entre
   outros. O peso vai pra composição (três farinhas de inseto), nutrição
   e modo de uso. */
const PROBLEMAS = [
  {
    dor: "Cada oferta com um valor nutricional diferente",
    causa: "o que ele come hoje não tem o mesmo perfil do que comeu semana passada. Nutrição vira sorteio.",
  },
  {
    dor: "Uma fonte de proteína só, sempre a mesma",
    causa: "variar de verdade exige comprar, guardar e revezar três coisas diferentes — quase ninguém mantém isso.",
  },
  {
    dor: "O cálcio depende de você lembrar",
    causa: "é por isso que existe o ritual de polvilhar pó a cada oferta. E é por isso que esquecer algumas vezes cobra caro.",
  },
  {
    dor: "Preparar dá trabalho — e às vezes acaba",
    causa: "manter alimento vivo em casa tem cheiro, exige espaço e some justo na semana errada.",
  },
];

const BENEFICIOS = [
  {
    stat: "3",
    statLbl: "farinhas de inseto",
    title: "Larva BSF, grilo preto e tenébrio",
    desc: "Não é uma farinha só. O Grub junta <strong>larva de Mosca Soldado Negra, grilo preto e tenébrio</strong> — três aminogramas diferentes no mesmo pote — mais <strong>cúrcuma, spirulina e levedura nutricional</strong>. A variedade que você tentaria montar comprando três produtos.",
  },
  {
    stat: "2,5:1",
    statLbl: "cálcio : fósforo",
    title: "A proporção certa já vem pronta",
    desc: "Réptil precisa de <strong>mais cálcio que fósforo</strong> — e a maioria dos alimentos de inseto entrega o contrário, daí o ritual de polvilhar pó. O Grub sai da fábrica com a relação <strong>Ca:P em 2,5:1</strong>, mais carbonato de cálcio na formulação.",
  },
  {
    stat: "2 min",
    statLbl: "de preparo",
    title: "Mistura com água e está pronto",
    desc: "Vira <strong>gel firme</strong> ou <strong>papinha cremosa</strong>, do jeito que a sua espécie aceita melhor. Fechado dura <strong>meses na prateleira</strong>; preparado, de 3 a 5 dias na geladeira — e dá pra congelar em porções.",
  },
];

/* Bloco de preparo — entrou no lugar da seção "a gente não veio brigar com
   o inseto vivo", que virou item de FAQ. Praticidade demonstrada vale mais
   que praticidade afirmada. Proporções conferidas no DOC2. */
const PREPARO = [
  {
    modo: "Gel firme",
    receita: "2 partes de água quente para 1 de Grub",
    como: "Misture até dissolver e deixe gelificar, em temperatura ambiente ou na geladeira. Corta em cubos e vai pro pote.",
  },
  {
    modo: "Papinha cremosa",
    receita: "3 partes de água morna (50–60 °C) para 1 de Grub",
    como: "Misture até ficar sem grumos e sirva em temperatura ambiente. É a versão pra iguana, crested e leachianus.",
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

const Grub = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="grub-lp">
      <PageMeta
        title="Alimentação para répteis e anfíbios · três insetos num pó — Comida de Dragão"
        description="Grub: alimento em pó com farinha de larva BSF, grilo preto e tenébrio, mais cúrcuma, spirulina e levedura. Relação cálcio-fósforo 2,5:1 já pronta. Mistura com água e vira gel ou papinha. Para geckos, teiús, dragões-barbudos, sapos e rãs."
        image={OG_IMG}
      />
      <Helmet>
        <link rel="preload" as="image" href={HERO_IMG} fetchPriority="high" />
      </Helmet>

      {/* ════ HERO ════ */}
      <section className="grb-hero">
        <div className="grb-hero-inner">
          <div className="grb-hero-top">
            <Link to="/portal" className="grb-backlink">← comida de dragão</Link>
            <DragonLogo className="grb-hero-logo" />
          </div>

          {/* O H1 já leva "répteis e anfíbios" + praticidade, então a eyebrow
              carrega o que sobrou de fora: composição e perfil nutricional. */}
          <span className="grb-hero-eyebrow">
            três farinhas de inseto · Ca:P 2,5:1 · alimento completo
          </span>

          {/* H1 lidera por COMPOSIÇÃO + PRATICIDADE (rebalanceado 28/07).
              A versão anterior liderava por "não precisa criar inseto" e
              deixava a página inteira brigando com o hobby do tutor.
              A keyword do cluster ("alimentação de répteis", ~1.000/mês)
              entra na 1ª linha da subheadline, que é o que resolve QS. */}
          {/* ⚠️ MÁXIMO 3 LINHAS RENDERIZADAS (regra da Olivia, 28/07) e o H1
              tem que dizer "répteis e anfíbios" + praticidade.
              A 82px isso é impossível: a caixa tem ~443px, o que dá ~13
              caracteres por linha, e as 10 variações testadas estouravam
              pra 4. Por isso o teto do clamp caiu pra 72px no Grub.css.
              Alternativas medidas que também fecham em 3 linhas a 72px:
              "…sem complicação." · "…com praticidade." · "…em 2 minutos."
              Escolhida a com número: mais concreta que "praticidade".
              ⚠️ "exótico" foi testado e descartado como palavra de campanha:
              `animais exóticos` faz 9.900/mês mas TODA intenção de comida
              ("alimento/ração/comida para pet exótico") está abaixo do
              limiar. Mesma armadilha de `teiú` e `leopardo gecko`. */}
          <h1 className="grb-hero-title">
            Alimente répteis e anfíbios<br /><span>em dois minutos.</span>
          </h1>

          <p className="grb-hero-sub">
            <strong>Alimentação de répteis e anfíbios em pó</strong>, feita de{" "}
            <strong>farinha de larva BSF, grilo preto e tenébrio</strong> — três aminogramas
            diferentes no mesmo pote —, com cúrcuma, spirulina e levedura nutricional. A relação{" "}
            <strong>cálcio-fósforo já sai equilibrada em 2,5:1</strong>, aquela que normalmente se
            tenta acertar polvilhando pó. Mistura com água e vira gel firme ou papinha cremosa.
            Alimento completo, dentro de uma alimentação variada — e sem nada pra manter vivo na
            despensa.
          </p>

          <div className="grb-hero-product-wrap">
            <img
              className="grb-hero-product"
              src={HERO_IMG}
              alt="Grub Comida de Dragão — alimento para répteis e anfíbios, 120g"
              width={460}
              height={410}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <span className="grb-hero-frete-tag">120g · rende muito</span>
          </div>

          <div className="grb-hero-price">
            <span className="grb-price-from">Grub 120g por</span>
            <span className="grb-price-now"><small>R$</small>{PRICE}</span>
            <span className="grb-price-installment">4× sem juros · frete grátis acima de R$ {FRETE_GRATIS_A_PARTIR}</span>
          </div>

          <div className="grb-hero-coupon">
            🚚 Duas unidades já passam do frete grátis · conhece um afiliado nosso? usa o cupom dele no checkout
          </div>

          <div className="grb-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="grb-btn-primary" data-cta="hero">
              Quero o Grub →
            </a>
          </div>

          <div className="grb-hero-chips">
            {CHIPS.map((c, i) => <span className="grb-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ PROBLEMA ════ */}
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag tag-pink">se isso te soa familiar</span>
          <h2 className="grb-section-title title-pink">
            O bicho come todo dia.<br /><span>A nutrição é que oscila.</span>
          </h2>
          <p className="grb-section-lead">
            Alimentar réptil parece simples até você olhar de perto: o perfil nutricional muda a
            cada oferta, a variedade depende de você manter três coisas diferentes em casa, e o
            cálcio fica por conta da sua memória.
          </p>

          <ul className="grb-problemas-list">
            {PROBLEMAS.map((p, i) => (
              <li className="grb-problema-item" key={i}>
                <b>{p.dor}</b> — {p.causa}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════ SOLUÇÃO ════ */}
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag">a solução</span>
          <h2 className="grb-section-title">
            Três farinhas de inseto<br /><span>num pó só.</span>
          </h2>
          <p className="grb-section-lead">
            A larva é criada na nossa biofábrica no RJ, com <strong>registro MAPA</strong> e
            rastreabilidade. O que sai de lá é um <strong>pó formador de gel</strong> — a
            composição inteira já balanceada, em vez de você montar a dieta juntando produto.
          </p>

          <div className="grb-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="grb-beneficio" key={i}>
                <div className="grb-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="grb-beneficio-title">{b.title}</div>
                <div className="grb-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>

          <p className="grb-section-lead" style={{ marginTop: 20, fontSize: 14, opacity: 0.7 }}>
            Alimento completo, para uso dentro de uma alimentação variada — não substitui
            integralmente a alimentação do animal nem o acompanhamento veterinário.
          </p>
        </div>
      </section>

      {/* ════ COMO SE USA ════
          Entrou no lugar da seção "a gente não veio brigar com o inseto
          vivo" (rebalanceamento de 28/07). Aquela objeção continua tratada,
          mas no FAQ — aqui o espaço nobre vai pra praticidade DEMONSTRADA.
          Proporções e prazos conferidos no DOC2. */}
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag tag-pink">como se usa</span>
          <h2 className="grb-section-title title-pink">
            Água, mexer,<br /><span>e escolher a textura.</span>
          </h2>
          <p className="grb-section-lead">
            A mesma lata serve os dois jeitos. Você decide pela espécie e pelo que ela aceita
            melhor — e prepara a quantidade da semana de uma vez.
          </p>

          <ul className="grb-problemas-list">
            {PREPARO.map((p, i) => (
              <li className="grb-problema-item" key={i}>
                <b>{p.modo}</b> — <strong>{p.receita}</strong>. {p.como}
              </li>
            ))}
            <li className="grb-problema-item">
              <b>Guarda fácil</b> — fechado dura <strong>meses na prateleira</strong>; preparado,
              de <strong>3 a 5 dias na geladeira</strong>. Dá pra congelar em porções e ir tirando.
            </li>
            <li className="grb-problema-item">
              <b>Não colou?</b> — <strong>a gente devolve seu dinheiro em 14 dias.</strong> Sem
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
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag">o pote por dentro</span>
          <h2 className="grb-section-title">
            120 gramas de pó<br /><span>que rende muito gel.</span>
          </h2>

          <div className="grb-slider" role="region" aria-label="Fotos do Grub">
            {SLIDES.map((s, i) => (
              <figure className="grb-slide" key={i}>
                <span className="grb-slide-badge">o pote</span>
                <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
          <p className="grb-slider-hint">← arraste pra ver mais →</p>
        </div>
      </section>

      {/* ════ OFERTA ════ */}
      <section className="grb-oferta">
        <div className="grb-oferta-inner">
          <span className="grb-tag tag-lime">grub · 120g</span>
          <h2 className="grb-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            A dieta dele<br /><span>resolvida num pote</span>
          </h2>

          <div className="grb-oferta-coupon-box">
            <div className="grb-oferta-coupon-label">🚚 vantagem</div>
            <div className="grb-oferta-coupon-code">2 POTES = FRETE GRÁTIS</div>
            <div className="grb-oferta-coupon-desc">
              Grub por R$ {PRICE} · frete grátis a partir de R$ {FRETE_GRATIS_A_PARTIR}
            </div>
          </div>

          <a href={ctaUrl("oferta")} className="grb-btn-primary" data-cta="oferta">
            Quero o Grub →
          </a>

          <p className="grb-hero-note" style={{ marginTop: 16 }}>
            Compra 100% segura via Yampi · cartão, Pix ou boleto
          </p>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════ */}
      <section className="grb-section">
        <div className="grb-section-inner">
          <span className="grb-tag">perguntas frequentes</span>
          <h2 className="grb-section-title">
            Antes de comprar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="grb-faq">
            {FAQ.map((f, i) => (
              <details className="grb-faq-item" key={i}>
                <summary className="grb-faq-q">{f.q}</summary>
                <div className="grb-faq-a" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="grb-garantia">
            <div className="grb-garantia-icon">💚</div>
            <div>
              <div className="grb-garantia-title">Garantia da matilha</div>
              <div className="grb-garantia-text">
                Se ele não topar em 14 dias da entrega, a gente devolve seu dinheiro.
                Sem letrinha miúda.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="grb-cta-final">
        <div className="grb-section-inner">
          <h2>Bora simplificar a dieta dele?</h2>
          <p>
            Três farinhas de inseto, cálcio e fósforo já na proporção certa, e dois minutos de
            preparo. Alimento completo, dentro de uma alimentação variada.
          </p>
          <a href={ctaUrl("final")} className="grb-btn-primary" data-cta="final">
            Quero o Grub →
          </a>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="grb-footer">
        <div className="grb-footer-inner">
          <nav className="grb-footer-nav">
            <a href="https://www.comidadedragao.com.br">Loja</a>
            <Link to="/produtos">Linha completa</Link>
            <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/5521993049400" target="_blank" rel="noreferrer">Contato</a>
          </nav>
          <p className="grb-footer-tagline">Nojento é o desperdício.</p>
          <p className="grb-footer-credits">
            Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
          </p>
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════ */}
      <div className="grb-sticky">
        <div className="grb-sticky-price">
          Grub 120g · <b>R$ {PRICE}</b>
        </div>
        <a href={ctaUrl("sticky")} className="grb-btn-primary grb-btn-sticky" data-cta="sticky">
          Comprar →
        </a>
      </div>
    </div>
  );
};

export default Grub;
