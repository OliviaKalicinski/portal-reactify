import { useEffect } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Curiosidade.css";
import VideosVencedores, { VIDEOS } from "@/components/VideosVencedores";

/* ──────────────────────────────────────────────────────────────
   LP DUPLA · /dupla · Kit Original + Mordida
   25/09/26 — pedido da Olivia: a /dupla passa a ter o MESMO TEXTO da
   /curiosidade (já validado), mantendo a FOTO DO PACOTE do kit.
   Estrutura, CSS e copy clonados de Curiosidade.tsx; mudou só o que é do
   produto (nome, preço, conteúdo, frete, claims por produto).

   Kit Original + Mordida · SKU 1303 · R$81,10 (Shopify, conferido 25/09/26)
   · token 8YXY3HISC4. 🔴 SEM frete grátis (abaixo do piso de R$150, sem a
   tag frete-gratis): nenhuma promessa de frete grátis nesta página.
   🔴 CLAIM: a MORDIDA LEVA OVO. "1 ingrediente" e "88,9% digestível" valem
   para o ORIGINAL; o kit não é hipoalergênico.
   SEM LeadPopup: decisão anterior da /dupla (tráfego que compra lê a página).
   SEM Dia do Cliente: a /dupla nunca teve.
────────────────────────────────────────────────────────────── */

const PRICE = "81,10"; // Shopify, SKU 1303, conferido 25/09/26
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/8YXY3HISC4`;

const UTM_FALLBACK = {
  utm_source: "lp-dupla",
  utm_medium: "lp",
  utm_campaign: "lp-dupla-kit-original-mordida",
};

const ctaUrl = (cta: "hero" | "oferta" | "final" | "sticky") =>
  buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

/* Foto do pacote: a mesma da /dupla antiga (foto oficial do kit na CDN da Shopify). */
const HERO_IMG =
  "https://cdn.shopify.com/s/files/1/0895/4311/5055/files/kit-petiscos.png?v=1785150064";

const SELOS = ["Sem glúten", "Sem conservante artificial", "Natural", "Proteína hipoalergênica"];

const CHIPS = [
  "🚚 Entrega Brasil",
  "🛡️ Compra segura",
  "🏭 Reg. MAPA",
  "💚 Garantia 14 dias",
];

/* ÂNGULO "VÍCIO DO BOM": o petisco que o cão ama E que faz bem por dentro.
   Benefícios no eixo PET (aceitação + digestão + nutrição) — sem liderar por
   alergia (isso é da /alergia) nem idoso. */
const BENEFICIOS = [
  {
    stat: "88,9%",
    statLbl: "digestível",
    title: "Vira nutriente, não cocô",
    desc: "Digestibilidade altíssima: <strong>mais nutrição no prato, menos cocô no quintal</strong>. Comida que o corpo aproveita de verdade.",
  },
  {
    stat: "1",
    statLbl: "ingrediente",
    title: "Comida de verdade",
    desc: "O Original é larva inteira e nada mais — <strong>sem corante, sem enchimento, sem subproduto</strong>. Você lê o rótulo sem tradutor.",
  },
  {
    stat: "Ω",
    statLbl: "ômega 6 e 9",
    title: "Pele, pelo e disposição",
    desc: "Rica em ômegas e aminoácidos. Tutores relatam <strong>pelo mais bonito e o cão sempre pedindo mais</strong>.",
  },
];

/* Reviews REAIS em texto (paridade com /alergia · verbatim do banco de Vozes).
   Voz da PALATABILIDADE ('vício do bom'): o cão ama + faz bem. NÃO inventar. */
const REVIEWS_TXT = [
  {
    quote: "O PETISCO QUE LEVA MEUS CÃES A <strong>LOUCURA</strong> E O MELHOR <strong>SEEEEEM DAR DOR DE BARRIGA</strong>! EU AMEI!",
    author: "@patascubo · Instagram",
  },
  {
    quote: "Meu cachorro esta <strong>alucinado</strong> com as larvinhas! O Chico simplesmente amou! <strong>Fica rondando o armario</strong> onde eu guardei kkkk",
    author: "tutora do Chico · review real",
  },
  {
    quote: "Pedi amostra grátis pra testar. <strong>Tenho 7 cães, TODOS AMARAM!!!!</strong> Volto agora pro site e, podem ter certeza, terão uma cliente fiel!",
    author: "@gisa_valverde · Instagram",
  },
  {
    quote: "Nunca tinha visto ela gostar tanto de um petisco como gostou das larvinhas. <strong>Indicando pra todo mundo e indo comprar mais!</strong>",
    author: "cliente · Kit Completo · Judge.me 5★",
  },
];

/* Prova social — abre com o Kit e segue com reviews reais de tutores.
   ⚠️ Trocar pelas melhores prints de "cão amando larva" quando tiver. */
const SLIDES: Array<{ src: string; alt: string; type: "ugc" | "review" }> = [
  { type: "ugc",    src: HERO_IMG, alt: "Kit Original + Mordida — Comida de Dragão" },
  { type: "review", src: "/assets/images/reviews/3.webp",        alt: "Review — cachorro amou as larvinhas" },
  { type: "review", src: "/assets/images/reviews/5.webp",        alt: "Review — ficou viciado no petisco" },
  { type: "review", src: "/assets/images/reviews/7.webp",        alt: "Review — estranho no começo, viciante no fim" },
  { type: "review", src: "/assets/images/reviews/9.webp",        alt: "Review — natural e sustentável, aprovado" },
  { type: "review", src: "/assets/images/reviews/4.webp",        alt: "Review — pele e pelo melhores" },
  { type: "review", src: "/assets/images/reviews/8.webp",        alt: "Review — fácil de usar, mistura na ração" },
];

const FAQ = [
  {
    q: "É seguro dar larva pro meu cão?",
    a: "Faz bem, não mal. É larva da Mosca Soldado Negra, criada na nossa <strong>biofábrica registrada no MAPA</strong>, tudo rastreável. Tem estudo peer-reviewed desde 2015 e lá fora já é tendência na alimentação de pets.",
  },
  {
    q: "O que vem no kit?",
    a: `O <strong>Original de 90g</strong> (larvinhas inteiras, pra usar de petisco ou topper) + a <strong>Mordida de Dragão de 180g</strong> (o petisco de mastigar). São 270g por R$ ${PRICE}, o mesmo que custaria comprando os dois separados.`,
  },
  {
    q: "Por que os dois, e não só um?",
    a: "Porque cão gosta dos dois: o Original some numa mordida e vira <strong>recompensa de treino</strong> ou topper; a Mordida é de <strong>mastigar</strong> e ocupa por mais tempo. <strong>Atenção: a Mordida leva ovo</strong> — se o seu cão tem alergia a ovo, leve só o Original.",
  },
  {
    q: "E se ele não comer?",
    a: "Na maioria das vezes o bloqueio é do tutor 😅. Mistura as larvinhas na ração e deixa ele decidir — a taxa de aceitação surpreende. E tem a <strong>garantia da matilha: 14 dias</strong>.",
  },
  {
    q: "Meu veterinário não conhece",
    a: "Normal — é novidade por aqui. Tem <strong>estudo peer-reviewed desde 2015</strong> sobre proteína de inseto pra pets. Mostra o rótulo pro seu vet: a gente adora essa conversa.",
  },
  {
    q: "Como funciona a entrega?",
    a: "Despachamos em até 1 dia útil pra todo o Brasil. <strong>O frete aparece no checkout</strong> pelo seu CEP. Compra <strong>100% segura</strong> via Yampi com cartão, Pix ou boleto.",
  },
];

const Dupla = () => {
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="curiosidade-lp dupla-lp">
      <PageMeta
        title="O petisco que seu cão ama — e que faz bem | Comida de Dragão"
        description="Larva de inseto, comida de verdade. O raro petisco que o cão vira vício e o corpo aproveita. Kit Original + Mordida."
        image={HERO_IMG}
        preload={HERO_IMG}
      />

      {/* ════ HERO ════ */}
      <section className="cur-hero">
        <div className="cur-hero-inner">
          <div className="cur-hero-top">
            <a href="https://www.comidadedragao.com.br/collections/produtos" className="cur-backlink">← comida de dragão</a>
            <a href="https://www.comidadedragao.com.br/collections/produtos">
              <DragonLogo className="cur-hero-logo" />
            </a>
          </div>

          <span className="cur-hero-eyebrow">petisco para cães · original + mordida · feito no rio</span>

          <h1 className="cur-hero-title">
            Seu cão vai enlouquecer.<br /><span>E dessa vez, faz bem.</span>
          </h1>

          {/* Claim de proteina = 45%, decidido pela Olivia 02/09/26. Ver _TESES-DERRUBADAS.md. */}
          <p className="cur-hero-claim">
            Original: <strong>45% de proteína</strong>, 88,9% digestível e 1 ingrediente só.
          </p>

          <p className="cur-hero-sub">
            A larvinha que vira o <strong>petisco favorito do seu cachorro</strong> — ele vai
            <strong> rondar o armário</strong> atrás. E você pode dar <strong>sem dó</strong>:
            1 ingrediente só, <strong>88,9% digestível</strong>, comida de verdade do jeito que o corpo
            dele aproveita. Na dupla <strong>Original + Mordida</strong>.
          </p>

          <div className="cur-hero-product-wrap">
            <img
              className="cur-hero-product"
              src={HERO_IMG}
              alt="Kit Original + Mordida — Comida de Dragão"
              width={460}
              height={410}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            {/* 25/09 (opção B) — selos de benefício EMBAIXO da foto (Olivia, 25/09), sem cobrir a embalagem.
                Claims conferidos em "Produtos - decisões e claims": sem glúten vale nos dois
                (wording da Mordida a validar com a Marcelle); a Mordida é "sem conservante
                ARTIFICIAL" (usa extrato de alecrim); hipoalergênica é a PROTEÍNA, não o kit (ovo). */}
            <div className="dupla-selos" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, margin: "14px auto 0" }}>
              {/* 2×2, centralizado (Olivia, 25/09): rosa / verde · verde / rosa */}
              {[SELOS.slice(0, 2), SELOS.slice(2, 4)].map((linha, l) => (
                <div key={l} style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                  {linha.map((t, k) => {
                    const verde = (l + k) % 2 === 1;
                    return (
                      <span
                        className="cur-hero-frete-tag"
                        key={t}
                        style={{
                          fontSize: 11,
                          padding: "4px 8px",
                          boxShadow: "2px 2px 0 var(--ink-primary)",
                          transform: `rotate(${verde ? -2 : 2}deg)`, /* ângulos invertidos (Olivia, 25/09) */
                          ...(verde ? { background: "var(--dragon-lime)", color: "var(--ink-primary)" } : {}),
                        }}
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="cur-hero-price">
            <span className="cur-price-from">Original + Mordida por</span>
            <span className="cur-price-now"><small>R$</small>{PRICE}</span>
            <span className="cur-price-installment">4× sem juros · frete pelo CEP no checkout</span>
          </div>

          <div className="cur-hero-coupon">
            🎟️ conhece um afiliado nosso? usa o cupom dele no checkout
          </div>

          <div className="cur-hero-cta-wrap">
            <a href={ctaUrl("hero")} className="cur-btn-primary" data-cta="hero">
              Quero dar pro meu cão →
            </a>
          </div>

          <div className="cur-hero-chips">
            {CHIPS.map((c, i) => <span className="cur-chip" key={i}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* ════ POR QUE FAZ BEM (benefícios pet — sobe logo após o hero) ════ */}
      <section className="cur-section">
        <div className="cur-section-inner">
          <span className="cur-tag">por que faz bem</span>
          <h2 className="cur-section-title">
            Vício, sim.<br /><span>Do bom.</span>
          </h2>
          <p className="cur-section-lead">
            Petisco que deixa o cão louco quase sempre é porcaria — ultraprocessado, dá dor de barriga.
            A larva é a <strong>exceção rara</strong>: um ingrediente só, altíssima digestão, comida de
            verdade. Ele ama — e o corpo aproveita.
          </p>

          <div className="cur-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="cur-beneficio" key={i}>
                <div className="cur-beneficio-stat">
                  {b.stat}<small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>
                </div>
                <div className="cur-beneficio-title">{b.title}</div>
                <div className="cur-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ E SE ELE ESTRANHAR? (anti-rejeição + cético — a objeção 'é larva' encolhida) ════ */}
      <section className="cur-section">
        <div className="cur-section-inner">
          <span className="cur-tag tag-pink">é larva mesmo</span>
          <h2 className="cur-section-title title-pink">
            Estranhou?<br /><span>Passa em 5 segundos.</span>
          </h2>
          <p className="cur-section-lead">
            9 em 10 tutores torcem o nariz — e mudam de ideia na primeira mordidinha do cão.
            Se o seu for do tipo desconfiado, tem conserto simples:
          </p>

          <ul className="cur-problemas-list">
            <li className="cur-problema-item">
              <b>Comece como topper</b> — jogue as larvinhas por cima da ração de sempre; o cheiro puxa o interesse.
            </li>
            <li className="cur-problema-item">
              <b>Use de recompensa</b> — o Original inteiro vira petisco de treino, um de cada vez.
            </li>
            <li className="cur-problema-item">
              <b>Não colou mesmo?</b> — <strong>a gente devolve seu dinheiro em 14 dias.</strong> Sem letrinha miúda.
            </li>
          </ul>

          <blockquote className="cur-quote">
            <p>
              “Confesso que não estava acreditando não, que era só mkt mesmo. Mas a Kate
              <strong> amou os petiscos</strong>, ficava enlouquecida cada vez q eu pegava o pacote… 😊”
            </p>
            <cite>— Michelle Klemar · Osasco/SP · Amostra · Judge.me 5★</cite>
          </blockquote>
        </div>
      </section>

      {/* ════ PROVA SOCIAL ════ */}
      <section className="cur-section">
        <div className="cur-section-inner">
          <span className="cur-tag">tutores reais · cães reais</span>
          <h2 className="cur-section-title">
            Eles viram vício.<br /><span>Do bom.</span>
          </h2>

          <div className="cur-quotes">
            {REVIEWS_TXT.map((r, i) => (
              <blockquote className="cur-quote" key={i}>
                <p dangerouslySetInnerHTML={{ __html: `“${r.quote}”` }} />
                <cite>— {r.author}</cite>
              </blockquote>
            ))}
          </div>

          {/* 25/09 — carrossel de reviews em FOTO saiu (Olivia); os vídeos vencedores vêm logo abaixo */}
        </div>
      </section>

      {/* ════ VÍDEOS VENCEDORES (faixa verde; padrão 25/09) ════ */}
      <VideosVencedores reels={[VIDEOS.vitydalmata, VIDEOS.omeninomerlin, VIDEOS.mytribesete, VIDEOS.pipo]} />

      {/* ════ OFERTA ════ */}
      <section className="cur-oferta">
        <div className="cur-oferta-inner">
          <span className="cur-tag tag-lime">original + mordida</span>
          <h2 className="cur-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Bora fazer<br /><span>bemzão pro cão?</span>
          </h2>

          <div className="cur-oferta-coupon-box">
            <div className="cur-oferta-coupon-label">🎟️ vantagem</div>
            <div className="cur-oferta-coupon-code">CUPOM DE AFILIADO</div>
            <div className="cur-oferta-coupon-desc">
              {`Original + Mordida por R$ ${PRICE}`} · conhece um afiliado? usa o cupom dele no checkout
            </div>
          </div>

          <a href={ctaUrl("oferta")} className="cur-btn-primary" data-cta="oferta">
            Quero a dupla →
          </a>

          <p className="cur-hero-note" style={{ marginTop: 16 }}>
            Frete pelo CEP no checkout · compra 100% segura via Yampi
          </p>
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════ */}
      <section className="cur-section">
        <div className="cur-section-inner">
          <span className="cur-tag">perguntas frequentes</span>
          <h2 className="cur-section-title">
            Antes de experimentar,<br /><span>tudo o que importa.</span>
          </h2>

          <div className="cur-faq">
            {FAQ.map((f, i) => (
              <details className="cur-faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="cur-faq-answer" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="cur-garantia">
            <div className="cur-garantia-icon">💚</div>
            <div className="cur-garantia-body">
              <strong>Garantia da matilha</strong>
              <span>Se seu cão não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="cur-cta-final">
        <h2>
          Bora experimentar<br /><span>o kit do cão?</span>
        </h2>
        <p>Larva de verdade, 88,9% digestível no Original. O petisco que ele ama e que faz bem por dentro.</p>
        <a href={ctaUrl("final")} className="cur-btn-primary" data-cta="final">
          Quero conhecer o kit →
        </a>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="cur-footer">
        <DragonLogo className="cur-footer-logo-svg" />
        <nav className="cur-footer-links">
          <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
          <Link to="/produtos">Linha completa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="cur-footer-tagline">Nojento é o desperdício.</div>
        <div className="cur-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════ */}
      <div className="cur-sticky-cta">
        <div className="cur-sticky-info">
          <span className="cur-sticky-name">Original + Mordida</span>
          <span className="cur-sticky-price">
            {`R$ ${PRICE}`} · 4× sem juros
          </span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky">Comprar →</a>
      </div>

      {/* SEM LeadPopup — decisão anterior da /dupla (30/07): quem compra aqui lê a página inteira. */}
    </div>
  );
};

export default Dupla;
