import { useEffect, useRef, useState } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Mordida.css";

/* ──────────────────────────────────────────────────────────────
   LP DE LANÇAMENTO — MORDIDA V2 · /mordida
   Página satélite · tráfego pago/orgânico · público FRIO
   Objetivo: VENDA. Em 27/07/26 a lista de espera saiu e a oferta entrou
   no lugar dela — o form de captura e o popup foram removidos.

   OFERTA (decidida com a Olivia, 27/07): Kit Mordida + Suplemento, com
   frete grátis. O destino é a PÁGINA DO PRODUTO na loja (não o checkout
   Yampi direto, como fazem /alergia e /idoso) — foi o pedido dela.

   Direção (validada com a Olivia, 20/07):
   - Cold-first: hero entra pelo PRODUTO, não pelo mistério.
   - Ancorada na VOZ DOS CLIENTES (reviews reais, verbatim) — palatabilidade
     + cético convertido + natural/sustentável.
   - CLAIM DE HIPOALERGÊNICO (regra fina, validada com a Olivia 20/07):
     pode-se dizer que a PROTEÍNA (a de inseto/BSF) é hipoalergênica; NÃO se
     pode chamar o PRODUTO de hipoalergênico — a Mordida V2 tem OVO (alérgeno).
     Sempre "proteína ... hipoalergênica", nunca um selo solto "hipoalergênico".
   - Números batem com a ficha oficial V2.2: 24% proteína · 43g/pacote.
   - Molde verde /alergia (prefixo mdp-). Prova social em TEXTO (Índice de
     Qualidade do Google não conta imagem).
   - "100% natural" evitado de propósito (trava de claims 09/07) → "natural
     de verdade". Se Diego/Marcelle liberarem, é só trocar.
────────────────────────────────────────────────────────────── */

const CHIPS = [
  "Sem grãos",
  "Sem glúten",
  "Proteína de inseto",
  "Proteína hipoalergênica", // claim atribuído à PROTEÍNA, nunca ao produto (tem ovo)
];

/* Faixa passante de lançamento (marquee no topo). Mesmo idioma do MarqueeBar
   de /parceiros e /quero-ser-dragao: itens duplicados + scroll translateX(-50%).
   Voz: hook do briefing ("a Mordida evoluiu: sem grão, mais proteína") + teaser. */
const MARQUEE = [
  "A Mordida evoluiu",
  "Sem grão · mais proteína",
  "Lançamento · frete grátis",
  "A gente aprontou uma",
];

/* ── OFERTA ────────────────────────────────────────────────────
   Kit Mordida + Suplemento. Preço e disponibilidade conferidos na loja
   em 27/07/26 (produto ACTIVE, available=true, tag frete-gratis).
   Se o preço mudar na Shopify, ele muda aqui — não há sincronia.

   Destino = página do produto na loja. As UTMs seguem a convenção das
   outras LPs (lp-<nome> / lp / lp-<nome>-<oferta>), e buildCheckoutUrl
   repassa fielmente a UTM de ENTRADA quando o anúncio trouxe uma —
   o fallback abaixo só vale pra quem chegou sem UTM nenhuma. */
const PRODUCT_URL =
  "https://www.comidadedragao.com.br/products/kit-mordida-suplemento";
const PRICE = "121,76";

const UTM_FALLBACK = {
  utm_source: "lp-mordida",
  utm_medium: "lp",
  utm_campaign: "lp-mordida-kit-mordida-suplemento",
};

const ctaUrl = (
  cta: "hero" | "beneficios" | "reviews" | "oferta" | "banner" | "sticky"
) => buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

/* Reviews REAIS, transcritos exatamente como o cliente escreveu (gírias e
   erros preservados = a prova de que é gente). Fonte: Catálogo de Argumentos
   - Vozes dos Clientes / Melhores Argumentos por Dor (Reviews). */
const REVIEWS = [
  {
    quote: "O PETISCO QUE LEVA MEUS CÃES A LOUCURA E O MELHOR SEEEEEM DAR DOR DE BARRIGA! EU AMEI!",
    who: "@patascubo",
  },
  {
    quote: "Ela simplesmente viciou nas larvinhas.. fica me olhando qdo não coloco na comida 🤣 Cliente e afiliada fiel já",
    who: "Arya",
  },
  {
    quote: "Pedi amostra grátis pra testar. Tenho 7 cães, TODOS AMARAM!!!! Volto agora pro site e, podem ter certeza, terão uma cliente fiel!",
    who: "@gisa_valverde",
  },
  {
    quote: "Confesso que não estava acreditando não, que era só mkt mesmo. Mas a Kate amou os petiscos, ficava enlouquecida cada vez q eu pegava o pacote…",
    who: "cliente verificado · Judge.me · 5★",
  },
];

const BENEFICIOS = [
  {
    stat: "88,9%",
    statLbl: "digestível",
    title: "Proteína de inseto hipoalergênica",
    desc: "Uma proteína que o corpo dele <strong>absorve de verdade</strong> — leve e diferente de tudo.",
  },
  {
    stat: "24%",
    statLbl: "proteína",
    title: "43g por pacote",
    desc: "Parrudo pro tamanho — e <strong>mais forte que a versão antiga</strong>.",
  },
  {
    stat: "ZERO",
    statLbl: "grão · glúten",
    title: "Leve pro intestino",
    desc: "Saiu o trigo, saiu a aveia. Ficou fácil de digerir.",
  },
  {
    stat: "NATURAL",
    statLbl: "de verdade",
    title: "Comida, não química",
    desc: "Você reconhece cada ingrediente que vai pro pacote.",
  },
  {
    stat: "NOVA",
    statLbl: "proteína",
    title: "Diferente de tudo",
    desc: "Uma proteína que ele nunca provou — pro cão que precisa de algo <strong>diferente</strong>.",
  },
];

const Mordida = () => {
  useEffect(() => { captureEntryUtms(); }, []);

  /* O sticky só entra depois que o CTA da hero sai da tela. Enquanto o botão
     principal está à vista, a barra seria redundante e ainda comeria tela na
     dobra. (Até 27/07 a referência era o banner do topo; ele saiu, e o CTA da
     hero passou a ser a régua.) */
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const [stickyVisivel, setStickyVisivel] = useState(false);

  useEffect(() => {
    const alvo = heroCtaRef.current;
    if (!alvo) return;

    // Sem IntersectionObserver (browser antigo), mostra sempre — melhor a
    // barra aparecer cedo demais do que o CTA nunca aparecer.
    if (typeof IntersectionObserver === "undefined") {
      setStickyVisivel(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisivel(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="mordida-lp">
      <PageMeta
        title="Novo Mordida de Dragão — snack natural de verdade | Comida de Dragão"
        description="O novo Mordida de Dragão chegou: snack natural com 24% de proteína de inseto, sem grão e sem glúten. Leve com o Suplemento Integral e o frete é por nossa conta."
      />

      {/* ════ FAIXA PASSANTE DE LANÇAMENTO ════
          Decorativa: a mesma informação já vive no eyebrow + sub + chips da
          hero, então aria-hidden evita o leitor de tela repetir o loop. */}
      <div className="mdp-marquee" aria-hidden="true">
        <div className="mdp-marquee-track">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* O banner do topo saiu em 27/07/26 (decisão da Olivia): a página abre
          direto na hero. Os arquivos seguem em assets/images/mordida/ — a arte
          continua servindo pra anúncio. */}

      {/* ════ HERO ════ */}
      <section className="mdp-hero">
        <div className="mdp-hero-inner">
          <div className="mdp-hero-top">
            <Link to="/portal" className="mdp-backlink">← comida de dragão</Link>
          </div>

          {/* Desktop = 2 colunas: título+texto à esquerda, foto grande + botão à direita.
              Mobile = empilha na mesma ordem (esquerda depois direita). */}
          {/* Dobra vertical e limpa: logo → título → texto → BOTÃO → imagem grande → selos.
              Sem badge de pré-lançamento (duplicava a faixa do topo). Botão ANTES da imagem
              pra ficar acima da dobra — a imagem (tamanho de tela) vem logo depois. */}
          {/* Desktop = 2 colunas (texto+CTA à esquerda, foto do produto à direita)
              pra não deixar o conteúdo numa ilha estreita na tela larga.
              Mobile = empilha; a foto some (o BANNER do topo já é o visual). */}
          <div className="mdp-hero-grid">
            <div className="mdp-hero-main">
              <div className="mdp-hero-text">
                <DragonLogo className="mdp-hero-logo" />

                <h1 className="mdp-hero-title">
                  Novo Mordida de Dragão<br />
                  <span>snack natural de verdade</span>
                </h1>

                <p className="mdp-hero-sub">
                  Milhares de cães já viraram fãs da gente — e foram eles que pediram essa versão:
                  <strong> 24% de proteína de inseto</strong> (hipoalergênica), <strong>sem grão e
                  sem glúten</strong>, que faz um benzão pra saúde.
                </p>
              </div>

              <div className="mdp-hero-chips">
                {CHIPS.map((c, i) => <span className="mdp-chip" key={i}>{c}</span>)}
              </div>

              <div className="mdp-hero-cta-wrap" ref={heroCtaRef}>
                <a href={ctaUrl("hero")} className="mdp-btn-primary mdp-btn-sm" data-cta="hero">
                  Compre o kit com frete grátis
                </a>
              </div>
            </div>

            {/* Foto real do produto. Passou a aparecer no mobile também em
                27/07: antes ficava escondida porque o banner do topo já era o
                visual — sem ele, o mobile abriria sem imagem nenhuma. */}
            <div className="mdp-hero-visual">
              <img
                className="mdp-hero-prod"
                src="/assets/images/produtos/mordida-v2-frente.webp"
                alt="Mordida V2 — embalagem"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════ POR QUE É BOM DEMAIS ════ (vem ANTES da prova: o frio precisa da substância cedo) */}
      <section className="mdp-section">
        <div className="mdp-section-inner">
          <span className="mdp-tag">o petisco</span>
          <h2 className="mdp-section-title">
            Por que ele é<br /><span>bom demais?</span>
          </h2>

          <div className="mdp-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="mdp-beneficio" key={i}>
                <div className="mdp-beneficio-stat">
                  {b.stat}{b.statLbl && <small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>}
                </div>
                <div className="mdp-beneficio-title">{b.title}</div>
                <div className="mdp-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>

          {/* CTA de seção (só desktop → botão a cada etapa pro retardatário) */}
          <div className="mdp-section-cta">
            <a href={ctaUrl("beneficios")} className="mdp-btn-primary" data-cta="secao-beneficios">
              Compre o kit com frete grátis
            </a>
          </div>
        </div>
      </section>

      {/* ════ V1 → V2: o que mudou (falando com quem já é cliente) ════ */}
      <section className="mdp-section mdp-sec-verde">
        <div className="mdp-section-inner">
          <span className="mdp-tag">a mordida evoluiu</span>
          <h2 className="mdp-section-title">
            O que mudou<br /><span>da antiga pra essa.</span>
          </h2>
          <p className="mdp-section-lead">
            Quem já é de casa merece saber: a gente não mexeu por mexer. Ouvimos cada mensagem
            e refizemos a Mordida do zero. O que melhorou:
          </p>

          <div className="mdp-evolui">
            <div className="mdp-evolui-row">
              <span className="mdp-evolui-de">Com trigo e aveia</span>
              <span className="mdp-evolui-seta">→</span>
              <span className="mdp-evolui-pra">
                <strong>Sem grão, sem glúten</strong> — mandioca e batata-doce no lugar. Mais leve pro intestino.
              </span>
            </div>
            <div className="mdp-evolui-row">
              <span className="mdp-evolui-de">Menos proteína</span>
              <span className="mdp-evolui-seta">→</span>
              <span className="mdp-evolui-pra">
                <strong>43g de proteína</strong> (24%) por pacote. Bem mais parruda que a anterior.
              </span>
            </div>
            <div className="mdp-evolui-row">
              <span className="mdp-evolui-de">Conservante artificial</span>
              <span className="mdp-evolui-seta">→</span>
              <span className="mdp-evolui-pra">
                <strong>Alecrim natural</strong> pra conservar + <strong>inulina</strong> (fibra prebiótica) que faz bem por dentro.
              </span>
            </div>
          </div>

          <p className="mdp-evolui-fecho">
            Mesma larvinha que seu cão ama. Só que <strong>a melhor versão dela.</strong> 🐉
          </p>
        </div>
      </section>

      {/* ════ PROVA — nível MARCA (é lançamento: ninguém provou ESTE ainda) ════ */}
      <section className="mdp-section">
        <div className="mdp-section-inner">
          <span className="mdp-tag">quem já é de casa</span>
          <h2 className="mdp-section-title">
            Veja o que já falam<br /><span>da Comida de Dragão.</span>
          </h2>

          <div className="mdp-reviews">
            {REVIEWS.map((r, i) => (
              <figure className="mdp-review" key={i}>
                <blockquote>"{r.quote}"</blockquote>
                <figcaption>— {r.who}</figcaption>
              </figure>
            ))}
          </div>

          <div className="mdp-section-cta">
            <a href={ctaUrl("reviews")} className="mdp-btn-primary" data-cta="secao-reviews">
              Compre o kit com frete grátis
            </a>
          </div>
        </div>
      </section>

      {/* ════ PRA QUEM TEM CORAGEM ════ */}
      <section className="mdp-section">
        <div className="mdp-section-inner">
          <span className="mdp-tag tag-pink">não é pra todo mundo</span>
          <h2 className="mdp-section-title title-pink">
            Pra quem<br /><span>tem coragem.</span>
          </h2>
          <p className="mdp-section-lead">
            A Comida de Dragão é pra quem tem coragem de fazer diferente — dar o melhor
            pro pet e ainda ajudar a mudar o mundo. Cada mordida transforma
            <strong> desperdício em proteína</strong>.
          </p>
          <figure className="mdp-review mdp-review-solo">
            <blockquote>"Esse AUmigão sabe oque é bom pra nós e pro planeta 🌎"</blockquote>
            <figcaption>— cliente · Instagram</figcaption>
          </figure>
        </div>
      </section>

      {/* ════ A GENTE OUVIU (wink pra base) ════ */}
      <section className="mdp-section mdp-wink">
        <div className="mdp-section-inner">
          <p className="mdp-wink-text">
            📞 <strong>Já é de casa?</strong> Essa é pra você: a gente ouviu cada comentário,
            cada sugestão, cada mensagem. <strong>A Mordida evoluiu por causa de vocês.</strong> 🐉
          </p>
        </div>
      </section>

      {/* ════ OFERTA ════
          Substituiu o form de lista de espera em 27/07/26. Os benefícios
          vêm dos mesmos fatos da ficha usados no resto da página — nada
          novo foi afirmado aqui. */}
      <section className="mdp-oferta" id="oferta">
        <div className="mdp-oferta-inner">
          <span className="mdp-tag tag-lime">novo kit · frete grátis</span>
          <h2 className="mdp-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            A Mordida nova<br /><span>e o pó que já é de casa.</span>
          </h2>

          <p className="mdp-oferta-sub">
            <strong>O lançamento é a Mordida</strong> — refeita do zero, sem grão,
            com 24% de proteína. No kit ela chega junto do{" "}
            <strong>Suplemento Integral</strong>, que já é o queridinho de quem
            mistura na ração. Uma é a novidade que ele pede sentado; o outro é a
            rotina que sustenta o resultado. Mesma proteína nos dois —{" "}
            <strong>88,9% do corpo dele aproveita</strong>.
          </p>

          {/* Foto do que chega na casa da pessoa. A hero segue com a Mordida
              sozinha (é ela o lançamento); aqui, na hora de pedir dinheiro,
              tem que ser o kit inteiro. */}
          <img
            className="mdp-oferta-img"
            src="/assets/images/produtos/kit-mordida-suplemento.webp"
            alt="Kit: pacote da Mordida de Dragão 180g ao lado da lata do Suplemento Integral 180g"
            loading="lazy"
            decoding="async"
          />

          <ul className="mdp-oferta-itens">
            <li><strong>1 Mordida de Dragão</strong> (180g) — <strong>a nova</strong>: sem grão, sem glúten, 24% de proteína</li>
            <li><strong>1 Suplemento Integral para cães</strong> (180g) — o pó que entra na ração todo dia</li>
            <li><strong>Frete grátis</strong> — por nossa conta</li>
          </ul>

          <div className="mdp-oferta-preco">
            <span className="mdp-oferta-preco-valor">R$ {PRICE}</span>
            <span className="mdp-oferta-preco-nota">à vista · frete incluso</span>
          </div>

          <a href={ctaUrl("oferta")} className="mdp-btn-primary" data-cta="oferta">
            Compre o kit com frete grátis
          </a>

          <p className="mdp-form-micro">
            Contém ovo. A proteína de inseto é hipoalergênica; o produto, por
            causa do ovo, não é indicado pra quem tem alergia a ele.
          </p>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="mdp-footer">
        <DragonLogo className="mdp-footer-logo-svg" />
        <nav className="mdp-footer-links">
          <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
          <Link to="/produtos">Linha completa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="mdp-footer-tagline">Nojento é o desperdício.</div>
        <div className="mdp-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════
          Mesmo padrão de /alergia e /idoso. Só mobile: no desktop os CTAs de
          seção já acompanham a rolagem do olho. A página ganha padding-bottom
          pra barra não cobrir o rodapé.
          Entra só depois do banner (ver o IntersectionObserver acima) —
          aria-hidden + inert enquanto escondido, pra leitor de tela e Tab
          não pegarem um botão que ninguém vê. */}
      <div
        className={`mdp-sticky-cta${stickyVisivel ? " is-visivel" : ""}`}
        aria-hidden={!stickyVisivel}
        inert={!stickyVisivel ? "" : undefined}
      >
        <div className="mdp-sticky-info">
          <span className="mdp-sticky-name">Kit Mordida + Suplemento</span>
          <span className="mdp-sticky-price">R$ {PRICE} · 🚚 frete grátis</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky">Comprar →</a>
      </div>

    </div>
  );
};

export default Mordida;
