import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import DragonLogo from "@/components/DragonLogo";
import "./Portal.css";
import "./Matilde.css";

// Yampi: vai direto ao checkout com o produto + cupom BORALA já aplicado
const ML_URL = "https://comida-de-dragao.pay.yampi.com.br/r/TQT4HOZK7X:1?promocode=BORALA";
const REVIEWS = [3, 4, 5, 6, 7, 8, 9, 10];
const PRESS_LOGOS = [
  "logo-1.png","logo-3.png","logo-4.png","logo-5.png",
  "logo-7.png","logo-8.png","logo-9.png",
  "logo-globo-news.png","logo-globo.png",
]; // logo-2 e logo-6 excluídas (quase totalmente transparentes)

const FAQ_ITEMS = [
  {
    q: "O que convenceu os tutores da Matilde a testar larva?",
    a: "A pesquisa. Quando você lê de verdade o que tem dentro das rações convencionais — conservantes, corantes, proteínas de origem duvidosa — a larva BSF deixa de ser estranha e vira a resposta mais óbvia do mundo.",
  },
  {
    q: "Tem conservante, corante ou químico artificial?",
    a: "Zero. Um ingrediente: larva BSF desidratada. Leia o rótulo — você lê em menos de três segundos e entende tudo.",
  },
  {
    q: "Meu cachorro vai querer comer larva?",
    a: "A maioria aprova na hora. A palatabilidade da larva BSF é naturalmente alta — o cheiro e o sabor são muito atraentes para cães. Se o seu não gostar na primeira vez, misture com o alimento habitual.",
  },
  {
    q: "É seguro? Tem fiscalização?",
    a: "Sim. Nossa biofábrica é registrada no MAPA (Ministério da Agricultura, Pecuária e Abastecimento), no estado do Rio de Janeiro. Cada lote é rastreável. Cada embalagem tem análise garantida.",
  },
  {
    q: "Para quais animais serve?",
    a: "Desenvolvido para cães, mas também usado com gatos, galinhas, peixes e répteis. Se o animal come proteína, come Comida de Dragão.",
  },
  {
    q: "Vale o preço?",
    a: "Para quem pesquisa, sim. Um único petisco de qualidade vale mais do que uma sacola de produto com lista de ingredientes que você não reconhece.",
  },
];

export default function Matilde() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, scrollLeft: 0 });

  const onReviewMouseDown = (e: React.MouseEvent) => {
    const el = reviewsRef.current; if (!el) return;
    dragState.current = { dragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
  };
  const onReviewMouseMove = (e: React.MouseEvent) => {
    const el = reviewsRef.current; if (!el || !dragState.current.dragging) return;
    e.preventDefault();
    el.scrollLeft = dragState.current.scrollLeft - (e.pageX - el.offsetLeft - dragState.current.startX);
  };
  const onReviewMouseUp = () => {
    dragState.current.dragging = false;
    if (reviewsRef.current) reviewsRef.current.style.cursor = "grab";
  };

  return (
    <div className="portal-page matilde-page skin-3">
      <PageMeta
        title="Quero Alimentar Bem — Matilde & Comida de Dragão"
        description="Um ingrediente. 45% de proteína. Zero conservante. O petisco que tutores que pesquisam escolhem."
        image="/assets/images/matilde/7.png"
      />

      {/* ══ 1. HERO ═══════════════════════════════════════════════ */}
      <section className="m-hero">
        <div className="m-hero-bg" />
        <div className="m-hero-content">
          <Link to="/portal" className="archive-backlink">← voltar pro portal</Link>
          <DragonLogo className="m-hero-logo" />
          <div className="m-hero-eyebrow">Para cachorros e gatos 🐶🐱</div>
          <h1 className="m-hero-title">
            Você não aceita<br />
            qualquer coisa<br />
            <span>na tigela do seu pet.</span>
          </h1>
          <p className="m-hero-naoe">Não é mesmo?</p>
          <p className="m-hero-sub">
            Existe um petisco com ingrediente único, rastreável do início ao fim —
            feito para quem pesquisa antes de comprar.
          </p>
          <a href={ML_URL} target="_blank" rel="noopener noreferrer" className="m-btn m-btn-pink">
            Quero dar o melhor pro meu pet →
          </a>
        </div>
      </section>

      {/* ══ 2. BENEFÍCIOS ════════════════════════════════════════ */}
      <section className="m-benefits">
        <div className="m-benefit">
          <div className="m-benefit-body">
            <div className="m-benefit-stat">45% <span>de proteína</span></div>
            <p>88,9% de digestibilidade. Seu pet absorve de verdade — não só ingere. Análise garantida por lote.</p>
          </div>
        </div>
        <div className="m-benefit-divider" />
        <div className="m-benefit">
          <div className="m-benefit-body">
            <div className="m-benefit-stat">1 <span>único ingrediente</span></div>
            <p>Larva BSF desidratada. Rastreável do início ao fim. Sem conservante, sem corante, sem lista pra decifrar.</p>
          </div>
        </div>
        <div className="m-benefit-divider" />
        <div className="m-benefit">
          <div className="m-benefit-body">
            <div className="m-benefit-stat">Zero <span>conservante · hipoalergênico</span></div>
            <p>Sem químico artificial, sem aditivo, sem ingrediente que você não reconhece. Ideal para pets sensíveis.</p>
          </div>
        </div>
      </section>
      <div className="m-benefits-marquee-wrap">
        <div className="m-benefits-marquee">
          {["45% de proteína mínima", "Um ingrediente", "Zero conservante", "Hipoalergênico", "88,9% digestibilidade", "83% menos carbono", "Rastreável por lote"].concat(
            ["45% de proteína mínima", "Um ingrediente", "Zero conservante", "Hipoalergênico", "88,9% digestibilidade", "83% menos carbono", "Rastreável por lote"]
          ).map((item, i) => (
            <span key={i} className="m-benefits-marquee-item">
              {item} <span className="m-marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ CTA RÁPIDO entre benefícios e história ══════════════ */}
      <div className="m-quick-cta">
        <div className="m-quick-cta-left">
          <span className="m-quick-cta-eyebrow">Já convencido?</span>
          <span className="m-quick-cta-headline">Pula a história e vai direto.</span>
        </div>
        <a href={ML_URL} target="_blank" rel="noopener noreferrer" className="m-btn m-btn-lime">
          🛒 Comprar agora com 10% OFF →
        </a>
      </div>

      {/* ══ 3. PROBLEMA ══════════════════════════════════════════ */}
      <section className="m-problem">
        <div className="m-problem-photo">
          <img src="/assets/images/matilde/1.png" alt="Matilde" />
        </div>
        <div className="m-problem-text">
          <h2 className="m-problem-title">
            Você já leu um rótulo e não reconheceu nenhum ingrediente.
          </h2>
          <p className="m-problem-body">
            Você não está exagerando — você está prestando atenção. Conservantes que nenhum
            veterinário explica. Corantes artificiais. Listas com 30 ingredientes que você
            não pronuncia. Quanto mais você pesquisa, mais pesado fica. Mas o pote ainda
            precisa ser preenchido. Com algo que você realmente entende.
          </p>
          <a href={ML_URL} target="_blank" rel="noopener noreferrer" className="m-btn m-btn-outline">
            Existe uma alternativa →
          </a>
        </div>
      </section>

      {/* ══ 4. HISTÓRIA DA MATILDE ════════════════════════════════ */}
      <section className="m-history">
        <div className="m-history-text">
          <div className="m-history-eyebrow">Como chegamos até aqui</div>
          <h2 className="m-history-title">Dois tutores que<br /><span>não aceitavam qualquer coisa.</span></h2>
          <p className="m-history-body">
            Há três anos, adotamos a Matilde. Ela chegou subnutrida, mal conseguia ficar de pé —
            e nós fizemos o que qualquer tutor que se preocupa faz: pesquisamos. Muito. O que
            encontramos foi pesado. Rações com conservantes que a gente não reconhecia, corantes
            artificiais, listas com 30 ingredientes que ninguém explica. Não dava.
          </p>
          <p className="m-history-bold">
            Foi aí que chegamos à mesma conclusão que você provavelmente está chegando agora.
          </p>
        </div>
        <div className="m-history-photo">
          <img src="/assets/images/matilde/2.png" alt="Tutores da Matilde" />
        </div>
      </section>

      {/* ══ 5. DESCOBERTA ════════════════════════════════════════ */}
      <section className="m-discovery">
        <div className="m-discovery-photo">
          <img src="/assets/images/matilde/6.png" alt="Matilde descobrindo a larva BSF" />
        </div>
        <div className="m-discovery-text">
          <h2 className="m-section-title m-discovery-title">
            E então encontraram<br />algo diferente.
          </h2>
          <p className="m-discovery-body">
            Com o compromisso de cuidar dela, começou uma pesquisa que a maioria dos tutores
            nunca faz. O resultado foi pesado: rações com conservantes que nenhum veterinário
            explica, corantes artificiais, embalagens com "natural" na frente e lista de 30
            ingredientes atrás.
          </p>
          <p className="m-discovery-body m-discovery-quote">
            "Chegamos à conclusão que a maioria das rações e petiscos são muito ruins."
            Precisavam de outra resposta.
          </p>
          <p className="m-discovery-body"><strong>E encontraram.</strong></p>
          <p className="m-discovery-body">
            Um petisco com ingrediente único. Só larva BSF desidratada. Sem mais nada.
            A primeira reação foi: <em>"inseto?"</em> A segunda foi: <em>"vou ler tudo."</em>
          </p>
        </div>
      </section>

      {/* ══ 6. COMPRA (1ª) ════════════════════════════════════════ */}
      <section className="m-buy">
        <div className="m-buy-wrap">

          {/* — cabeçalho full-width — */}
          <div className="m-buy-header">
            <span className="m-buy-label">Produto</span>
            <h2 className="m-buy-title">Comida de Dragão<span> – Original®</span></h2>
          </div>

          <div className="m-buy-inner">
            {/* — esquerda: imagem + tags — */}
            <div className="m-buy-left">
              <div className="m-buy-product">
                <img src="/assets/images/matilde/5.png" alt="Comida de Dragão Original" />
              </div>
              <div className="m-buy-tags">
                <span className="m-buy-tag">Todos os pets</span>
                <span className="m-buy-tag">Todas as idades</span>
                <span className="m-buy-tag">Todos os portes</span>
              </div>
            </div>

            {/* — direita: dados + checklist + preço + CTA — */}
            <div className="m-buy-info">
              <div className="m-buy-label">Análise garantida</div>
              <dl className="m-buy-dados">
                <div><dt>Proteína</dt><dd>Mín. 40%</dd></div>
                <div><dt>Digestib.</dt><dd>88,9%</dd></div>
                <div><dt>Embalagem</dt><dd>90g</dd></div>
                <div><dt>Conservante</dt><dd>Zero</dd></div>
              </dl>

              <div className="m-buy-sep" />
              <div className="m-buy-label">Por que escolher</div>
              <ul className="m-buy-check">
                <li>Ingrediente único — larva BSF desidratada</li>
                <li>100% natural, sem corante nem aditivo</li>
                <li>Hipoalergênico e rastreável</li>
                <li>Biofábrica registrada no MAPA/RJ</li>
              </ul>

              <div className="m-buy-sep" />
              <div className="m-buy-price">R$ 38,90</div>
              <a href={ML_URL} target="_blank" rel="noopener noreferrer" className="m-btn m-btn-lime m-btn-full">
                🛒 Comprar agora com 10% OFF
              </a>
              <div className="m-buy-cupom">Cupom BORALA aplicado automaticamente · vai direto para o checkout</div>
            </div>
          </div>

        </div>
      </section>

      {/* ══ 7. MAPA / CREDENCIAIS ═════════════════════════════════ */}
      <section className="m-mapa">
        <div className="m-inner m-mapa-inner">
          <div className="m-mapa-eyebrow">Credenciais</div>
          <h2 className="m-section-title">
            Não é produto importado.<br />Não é experimento.
          </h2>
          <p className="m-mapa-text">
            A Comida de Dragão é produzida na primeira biofábrica de insetos registrada no MAPA
            do estado do Rio de Janeiro. Cada lote rastreável. Cada embalagem com análise garantida.
          </p>
          <div className="m-mapa-cards">
            <div className="m-mapa-card">
              <div className="m-mapa-card-num">01</div>
              <div className="m-mapa-card-title">Registrada no MAPA</div>
              <div className="m-mapa-card-sub">Rio de Janeiro — primeira biofábrica de insetos do estado</div>
            </div>
            <div className="m-mapa-card">
              <div className="m-mapa-card-num">02</div>
              <div className="m-mapa-card-title">Biofábrica própria</div>
              <div className="m-mapa-card-sub">Cachoeiras de Macacu/RJ — cada lote rastreável</div>
            </div>
            <div className="m-mapa-card">
              <div className="m-mapa-card-num">03</div>
              <div className="m-mapa-card-title">88,9% digestibilidade</div>
              <div className="m-mapa-card-sub">Proteica comprovada — análise garantida por lote</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 7. QUOTE ══════════════════════════════════════════════ */}
      <section className="m-quote">
        <div className="m-inner m-quote-inner">
          <h2 className="m-quote-label">Se isso soa familiar, o próximo passo é simples...</h2>
          <blockquote className="m-quote-text">
            "Se você quer dar um up na alimentação do seu animal, na saúde dele e ainda contribuir
            pra regeneração do planeta, compre Comida de Dragão. Mais que um alimento, uma revolução
            — e aprovado pela Matilde."
          </blockquote>
          <div className="m-quote-attr">— Pai da Matilde, Rio de Janeiro</div>
          <a href={ML_URL} target="_blank" rel="noopener noreferrer" className="m-btn m-btn-lime">
            Sim, eu quero experimentar
          </a>
        </div>
      </section>

      {/* ══ 8. NA MÍDIA + REVIEWS ═════════════════════════════════ */}
      <section className="m-press">

        {/* — faixa de logos em loop — sem título */}
        <div className="m-press-marquee-wrap">
          <div className="m-press-marquee">
            {[...PRESS_LOGOS, ...PRESS_LOGOS].map((logo, i) => (
              <div key={i} className="m-press-logo-item">
                <img
                  src={`/assets/images/press/${logo}`}
                  alt="logo mídia"
                  className="m-press-logo-img"
                />
              </div>
            ))}
          </div>
        </div>

        {/* — reviews com título + drag-to-scroll — */}
        <div className="m-reviews-section">
          <div className="m-inner">
            <h2 className="m-reviews-title">O que os tutores dizem</h2>
            <p className="m-reviews-hint">← arraste para o lado →</p>
          </div>
          <div
            className="m-reviews-scroll"
            ref={reviewsRef}
            onMouseDown={onReviewMouseDown}
            onMouseMove={onReviewMouseMove}
            onMouseUp={onReviewMouseUp}
            onMouseLeave={onReviewMouseUp}
          >
            {REVIEWS.map(n => (
              <div key={n} className="m-review-item">
                <img
                  src={`/assets/images/reviews/${n}.png`}
                  alt={`Review ${n}`}
                  className="m-review-img"
                />
              </div>
            ))}
          </div>
          <div className="m-reviews-arrow">
            <div className="m-reviews-arrow-icon">
              <span /><span /><span />
            </div>
            arraste para ver mais
            <div className="m-reviews-arrow-icon">
              <span /><span /><span />
            </div>
          </div>
        </div>

      </section>

      {/* ══ 9. ANTES / DEPOIS ═════════════════════════════════════ */}
      <section className="m-ba">
        <div className="m-ba-header">
          <span className="m-ba-eyebrow">Transformação real</span>
          <h2 className="m-ba-title">A Matilde antes e depois.</h2>
        </div>
        <div className="m-ba-cols">
          <div className="m-ba-col m-ba-antes">
            <div className="m-ba-photo-wrap">
              <div className="m-ba-tag m-ba-tag-antes">✗ Antes</div>
              <div className="m-ba-polaroid">
                <img src="/assets/images/matilde/3.png" alt="Antes — Matilde subnutrida" />
              </div>
              <p className="m-ba-caption">Chegou subnutrida, precisou de cirurgia</p>
            </div>
          </div>
          <div className="m-ba-vs">VS</div>
          <div className="m-ba-col m-ba-depois">
            <div className="m-ba-photo-wrap">
              <div className="m-ba-tag m-ba-tag-depois">✓ Depois</div>
              <div className="m-ba-polaroid">
                <img src="/assets/images/matilde/4.png" alt="Depois — Matilde saudável" />
              </div>
              <p className="m-ba-caption">Saudável, no peso ideal, ativa</p>
            </div>
          </div>
        </div>
      </section>


      {/* ══ PROOF BAR ═════════════════════════════════════════════ */}
      <section className="m-proof">
        <div className="m-inner m-proof-inner">
          <p className="m-proof-text">
            88,9% de digestibilidade proteica. Zero conservantes. Zero químicos artificiais.
            Não é promessa de embalagem.
          </p>
          <p className="m-proof-sub">
            É análise garantida de biofábrica registrada no MAPA do Rio de Janeiro.
          </p>
        </div>
      </section>

      {/* ══ 11. COMPRA (2ª — detalhada) ══════════════════════════ */}
      <section className="m-buy m-buy-2">
        <div className="m-buy-wrap">

          {/* — cabeçalho full-width — */}
          <div className="m-buy-header">
            <span className="m-buy-label">Produto</span>
            <h2 className="m-buy-title">Comida de Dragão<span> – Original®</span></h2>
          </div>

          <div className="m-buy-inner">
            {/* — esquerda: imagem + tags — */}
            <div className="m-buy-left">
              <div className="m-buy-product">
                <img src="/assets/images/matilde/5.png" alt="Comida de Dragão Original" />
              </div>
              <div className="m-buy-tags">
                <span className="m-buy-tag">Todos os pets</span>
                <span className="m-buy-tag">Todas as idades</span>
                <span className="m-buy-tag">Todos os portes</span>
              </div>
            </div>

            {/* — direita: dados + checklist + preço + CTA — */}
            <div className="m-buy-info">
              <div className="m-buy-label">Análise garantida</div>
              <dl className="m-buy-dados">
                <div><dt>Proteína</dt><dd>Mín. 40%</dd></div>
                <div><dt>Digestib.</dt><dd>88,9%</dd></div>
                <div><dt>Embalagem</dt><dd>90g</dd></div>
                <div><dt>Conservante</dt><dd>Zero</dd></div>
              </dl>

              <div className="m-buy-sep" />
              <div className="m-buy-label">Por que escolher</div>
              <ul className="m-buy-check">
                <li>Ingrediente único — larva BSF desidratada</li>
                <li>100% natural, sem conservante, sem corante, sem aditivo</li>
                <li>Hipoalergênico — rastreável do início ao fim</li>
                <li>Todas as idades e portes</li>
                <li>88,9% de digestibilidade proteica</li>
                <li>Biofábrica registrada no MAPA/RJ</li>
              </ul>

              <div className="m-buy-sep" />
              <div className="m-buy-price">R$ 38,90</div>
              <a href={ML_URL} target="_blank" rel="noopener noreferrer" className="m-btn m-btn-lime m-btn-full">
                🛒 Comprar agora com 10% OFF
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ══ PENÚLTIMO. FAQ ════════════════════════════════════════ */}
      <section className="m-faq">
        <div className="m-inner">
          <h2 className="m-faq-title">Dúvidas antes de testar</h2>
          <div className="m-faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className={`m-faq-item${openFaq === i ? " open" : ""}`}>
                <button className="m-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  <span className="m-faq-icon">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div className="m-faq-a">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ÚLTIMO. APROVADO PELA MATILDE ════════════════════════ */}
      <section className="m-aprovado">
        <div className="m-aprovado-photo">
          <img src="/assets/images/matilde/9.png" alt="Aprovado pela Matilde" />
        </div>
        <div className="m-aprovado-card-wrap">
          <div className="m-aprovado-card">
            <div className="m-aprovado-title">Aprovado pela Matilde!</div>
            <p className="m-aprovado-text">
              Natural, nutritivo, ingrediente único. Sem conservantes.
              Só o que seu pet precisa.
            </p>
            <a href={ML_URL} target="_blank" rel="noopener noreferrer" className="m-btn m-btn-lime">
              Só gente legal clica aqui!
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lojas-footer">
        <p>Dúvidas? <a href="mailto:somos@letsfly.com.br">somos@letsfly.com.br</a></p>
        <Link to="/portal" className="lojas-back-bottom">← Voltar ao Portal</Link>
      </footer>
    </div>
  );
}
