import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import "./Ciencia.css";

/* ──────────────────────────────────────────────────────────────
   LP /ciencia — 10 Motivos Científicos
   Comida de Dragão · material pra enviar pra clientes

   Conceito: documento científico zine. Tutor que pesquisa
   chega aqui, lê com calma, decide. Accordion permite pular
   pra motivo que coincide com a dor dele.

   Design: light zine paper (creme + tinta + lime + pink + halftone)
   alinhado com /original e /matilde. Autocontido.

   CTAs vão pra https://comidadedragao.com.br/produtos com UTMs.
────────────────────────────────────────────────────────────── */

const PRODUTOS_URL = "https://comidadedragao.com.br/produtos";
const COUPON = "BORALA";

const ctaUrl = (cta: string) =>
  `${PRODUTOS_URL}?utm_source=lp-ciencia&utm_medium=link-direto&utm_campaign=10-motivos&utm_content=${cta}`;

const STATS = [
  { num: "88,9%", lbl: "digestibilidade" },
  { num: "40–55%", lbl: "proteína bruta" },
  { num: "1", lbl: "ingrediente único" },
  { num: "MAPA", lbl: "RJ 001924-0" },
];

type Motivo = {
  num: string;
  emoji: string;
  titulo: string;
  dor: string;
  solucao: string;
  bullets: string[];
};

const MOTIVOS: Motivo[] = [
  {
    num: "01",
    emoji: "🩺",
    titulo: "Solução pra pet com alergia alimentar",
    dor: "Seu pet sofre com coceiras, lambida de pata, dermatite ou problemas digestivos? Já tentou várias rações e nenhuma resolveu?",
    solucao: "A proteína BSF (larva de Mosca Soldado Negra) é naturalmente hipoalergênica — uma fonte que seu pet nunca experimentou antes. Sem reação cruzada com frango, boi, soja, grão.",
    bullets: [
      "88,9% de digestibilidade — superior à carne bovina",
      "Zero reações alérgicas registradas em estudos",
      "Recomendado por veterinários nutrólogos",
      "Melhora visível em 14 a 30 dias",
    ],
  },
  {
    num: "02",
    emoji: "🌱",
    titulo: "A proteína mais sustentável do planeta",
    dor: "Você se preocupa com o impacto ambiental da alimentação do pet? Sente que tá faltando uma opção que respeite o planeta?",
    solucao: "Cada petisco economiza 15.000 litros de água em comparação com proteína tradicional. A gente transforma resíduo orgânico em nutrição de alta qualidade.",
    bullets: [
      "83% menos emissões de carbono",
      "142× menos terra utilizada",
      "Economia circular: resíduo vira proteína",
      "100% produção nacional — menos transporte, menos CO₂",
    ],
  },
  {
    num: "03",
    emoji: "💪",
    titulo: "Superalimento: 40-55% proteína + ômegas 3, 6 e 9",
    dor: "Ração convencional tem ingrediente duvidoso e valor nutricional baixo. Você quer o melhor pro pet, mas não confia no que tá disponível.",
    solucao: "Nutrição cientificamente superior — sem aditivo químico, sem corante, sem conservante.",
    bullets: [
      "40-55% de proteína pura (vs. 25-30% das rações comuns)",
      "Todos os aminoácidos essenciais em proporção ideal",
      "Ácido láurico com ação antimicrobiana natural",
      "Ômegas 3, 6 e 9 pra pelagem brilhante",
      "3.500+ kcal/kg de energia concentrada",
    ],
  },
  {
    num: "04",
    emoji: "🐱",
    titulo: "Perfeito pra gato exigente e felino sensível",
    dor: "Seu gato recusa tudo, tem estômago sensível ou sofre com alergia alimentar?",
    solucao: "Sabor umami irresistível que até gato exigente aprova, com nutrição específica pra felino.",
    bullets: [
      "98% de aceitação em testes de palatabilidade",
      "Rico em taurina natural pra saúde cardíaca",
      "Ideal pra gato com sensibilidade alimentar",
      "Textura variada: larva crocante ou petisco macio",
    ],
  },
  {
    num: "05",
    emoji: "🔬",
    titulo: "Tecnologia brasileira aprovada pelo MAPA",
    dor: "Desconfiança com produto sem regulamentação ou importado sem garantia de qualidade?",
    solucao: "Primeira biofábrica de insetos pra pet aprovada pelo Ministério da Agricultura no Brasil.",
    bullets: [
      "Registro MAPA: RJ 001924-0",
      "Controle de qualidade farmacêutico",
      "Rastreabilidade completa da produção",
      "Tecnologia desenvolvida em parceria com Embrapa",
    ],
  },
  {
    num: "06",
    emoji: "🦎",
    titulo: "Único petisco multi-espécies do mercado",
    dor: "Você tem pets de espécies diferentes e precisa comprar produto separado pra cada um?",
    solucao: "Um único produto pra cão, gato, ave, réptil, peixe, anfíbio e pequeno mamífero.",
    bullets: [
      "Aprovado pra 50+ espécies diferentes",
      "Substituto superior aos grilos e tenébrios",
      "Rico em cálcio pra quelônios",
      "Ideal pra ave ornamental e psitacídeos",
    ],
  },
  {
    num: "07",
    emoji: "⚡",
    titulo: "Digestibilidade superior: sem inchaço, sem gás",
    dor: "Seu pet tem gases constantes, inchaço abdominal, fezes com odor forte ou volume excessivo?",
    solucao: "Proteína leve e altamente digestível, com fibras prebióticas naturais.",
    bullets: [
      "Digestibilidade 30% superior à carne bovina",
      "Quitina prebiótica natural pra microbiota saudável",
      "Reduz odor das fezes em até 40%",
      "Menor volume fecal — menos desperdício",
    ],
  },
  {
    num: "08",
    emoji: "🎯",
    titulo: "Funciona como suplemento proteico natural",
    dor: "Seu pet tá em recuperação, é muito ativo, acima do peso ou precisa ganhar massa muscular?",
    solucao: "Suplementação proteica concentrada — sem precisar trocar a ração completa.",
    bullets: [
      "Ideal pra ganho de massa muscular",
      "Perfeito pra pet atleta ou de trabalho",
      "Seguro pra filhote e pet sênior",
      "Auxilia na recuperação pós-cirúrgica",
      "2 versões: Integral (45%) e Concentrado (55%)",
    ],
  },
  {
    num: "09",
    emoji: "💰",
    titulo: "Custo-benefício inteligente",
    dor: "Produto premium importado custa uma fortuna e você não sabe se vale a pena.",
    solucao: "Proteína concentrada: pouca quantidade entrega máxima nutrição.",
    bullets: [
      "1 pacote rende até 30 dias pra cão pequeno",
      "Até 70% mais econômico que importado similar",
      "Clube do Dragão: 10% off + frete grátis",
      "Menos gasto veterinário com problema alimentar",
    ],
  },
  {
    num: "10",
    emoji: "🏆",
    titulo: "Resultado comprovado em 30 dias",
    dor: "Cansado de promessa vazia e produto que não funciona?",
    solucao: "Milhares de tutores comprovam: funciona.",
    bullets: [
      "4,8/5 estrelas de satisfação",
      "+2.000 depoimentos positivos verificados",
      "95% de recompra entre clientes",
      "87% relatam redução/eliminação de coceira",
      "92% relatam pelagem mais brilhante",
      "78% relatam mais energia e disposição",
    ],
  },
];

const KIT_INCLUI = [
  "1× Comida de Dragão Original (90g)",
  "1× Mordidas Legumes (180g)",
  "1× Mordidas Spirulina (180g)",
  "Frete grátis pra todo Brasil",
  "Garantia de satisfação — se não aprovar, devolvemos",
];

const BONUS = [
  "Guia completo «Alimentação Natural Pra Pets» (PDF premium)",
  "Dosador profissional em inox",
  "Acesso ao grupo VIP de tutores conscientes",
  "Consultoria nutricional online (30min)",
  "15% off na próxima compra",
];

const FAQ = [
  {
    q: "Meu pet tem alergia. Posso dar mesmo?",
    a: "Sim. A larva de BSF é uma proteína completamente diferente das mais comuns (frango, boi, soja, grão), então é hipoalergênica por natureza. Em casos de acompanhamento veterinário, mostra o rótulo pro profissional antes de introduzir.",
  },
  {
    q: "Como ofereço pela primeira vez?",
    a: "Comece com 2 a 4 unidades por dia, como petisco entre as refeições. A palatabilidade é alta — a maioria dos pets aceita de primeira. Em casos de transição alimentar mais ampla, faça aos poucos.",
  },
  {
    q: "Funciona pra gato?",
    a: "Funciona. 98% de aceitação em testes de palatabilidade com felinos. Rico em taurina natural pra saúde cardíaca, ideal pra gato com sensibilidade alimentar.",
  },
  {
    q: "Quanto tempo dura um pacote?",
    a: "Pacote de 90g rende cerca de 30 a 45 dias pra cão médio (5-6 unidades/dia). Validade plena de 18 meses, em local seco e fechado depois de aberto.",
  },
];

export default function Ciencia() {
  return (
    <div className="cie-page">
      <Helmet>
        <title>10 motivos científicos · Comida de Dragão</title>
        <meta
          name="description"
          content="A ciência por trás do petisco de larva BSF — hipoalergênico, 88,9% de digestibilidade, MAPA RJ 001924-0."
        />
        <meta property="og:title" content="10 motivos científicos · Comida de Dragão" />
        <meta property="og:description" content="A ciência por trás do petisco hipoalergênico de larva BSF." />
      </Helmet>

      <div className="cie-wrap">
        {/* ════ TOP BAR ═══════════════════════════════════════════ */}
        <div className="cie-topbar">
          <Link to="/portal" className="cie-backlink">← comida de dragão</Link>
          <DragonLogo className="cie-logo" />
        </div>

        {/* ════ HERO ══════════════════════════════════════════════ */}
        <section className="cie-hero">
          <span className="cie-eyebrow">// 10 motivos científicos</span>
          <h1 className="cie-hero-title">
            Sua pesquisa<br />
            <span>terminou aqui.</span>
          </h1>
          <p className="cie-hero-sub">
            A gente compilou a ciência por trás do petisco de larva de Mosca
            Soldado Negra. Você lê, decide com cabeça — <strong>seu pet
            aprova com fome.</strong>
          </p>

          <div className="cie-stats">
            {STATS.map((s, i) => (
              <div className="cie-stat" key={i}>
                <span className="cie-stat-num">{s.num}</span>
                <span className="cie-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>

          <a href={ctaUrl("hero")} className="cie-btn-primary" target="_blank" rel="noopener noreferrer">
            Quero conhecer os produtos →
          </a>
        </section>

        {/* ════ 10 MOTIVOS — accordion ═══════════════════════════ */}
        <section className="cie-section">
          <span className="cie-tag">os 10 motivos</span>
          <h2 className="cie-h2">
            A ciência por trás <span>do dragão.</span>
          </h2>
          <p className="cie-lead">
            Cada motivo abre a dor real, a solução e os dados que provam.
            Clica no que mais te chama.
          </p>

          <div className="cie-motivos">
            {MOTIVOS.map((m) => (
              <details className="cie-motivo" key={m.num}>
                <summary className="cie-motivo-head">
                  <span className="cie-motivo-num">{m.num}</span>
                  <span className="cie-motivo-emoji" aria-hidden="true">{m.emoji}</span>
                  <span className="cie-motivo-titulo">{m.titulo}</span>
                  <span className="cie-motivo-plus" aria-hidden="true">+</span>
                </summary>
                <div className="cie-motivo-body">
                  <div className="cie-motivo-block">
                    <div className="cie-motivo-label">// a dor</div>
                    <p className="cie-motivo-text">{m.dor}</p>
                  </div>
                  <div className="cie-motivo-block">
                    <div className="cie-motivo-label cie-label-lime">// a solução</div>
                    <p className="cie-motivo-text">{m.solucao}</p>
                  </div>
                  <ul className="cie-motivo-bullets">
                    {m.bullets.map((b, i) => (
                      <li key={i}><strong>✓</strong>{b}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ════ KIT DEGUSTAÇÃO ═══════════════════════════════════ */}
        <section className="cie-kit">
          <span className="cie-tag tag-pink">oferta especial</span>
          <h2 className="cie-h2 title-pink">
            Kit Degustação <span>do dragão.</span>
          </h2>
          <p className="cie-lead">
            Comece a experiência com 3 produtos por <strong>R$ 89,90</strong> —
            sem risco. Se seu pet não aprovar, a gente devolve seu dinheiro.
          </p>

          <div className="cie-kit-grid">
            <div className="cie-kit-card">
              <div className="cie-kit-label">// o kit inclui</div>
              <ul className="cie-kit-list">
                {KIT_INCLUI.map((item, i) => <li key={i}><strong>✓</strong>{item}</li>)}
              </ul>
            </div>

            <div className="cie-kit-card cie-kit-bonus">
              <div className="cie-kit-label cie-label-pink">// bônus exclusivo</div>
              <ul className="cie-kit-list">
                {BONUS.map((item, i) => <li key={i}><strong>★</strong>{item}</li>)}
              </ul>
            </div>
          </div>

          <a href={ctaUrl("kit")} className="cie-btn-primary" target="_blank" rel="noopener noreferrer">
            Quero o Kit Degustação →
          </a>

          <div className="cie-cupom">
            <span className="cie-cupom-label">// selo do dragão</span>
            <span className="cie-cupom-divider" aria-hidden="true">·</span>
            <span className="cie-cupom-code">{COUPON}</span>
            <span className="cie-cupom-divider" aria-hidden="true">·</span>
            <span className="cie-cupom-meta">10% off na primeira compra</span>
          </div>
        </section>

        {/* ════ MANIFESTO ════════════════════════════════════════ */}
        <section className="cie-manifesto">
          <div className="cie-manifesto-strip" />
          <span className="cie-manifesto-eyebrow">// manifesto do dragão</span>
          <blockquote className="cie-manifesto-quote">
            «Nasci do elo entre a vitalidade da terra e o saber ancestral.
            Trago o elixir da regeneração — o néctar que nutre e harmoniza
            os seres vivos. <em>Mais do que um alimento, uma revolução.</em>
            Nutrir-se de Comida de Dragão é um ato de rebeldia contra a
            inércia.»
          </blockquote>
          <div className="cie-manifesto-sig">
            — LET'S FLY · CACHOEIRAS DE MACACU · RJ
          </div>
        </section>

        {/* ════ FAQ ═══════════════════════════════════════════════ */}
        <section className="cie-section">
          <span className="cie-tag">perguntas frequentes</span>
          <h2 className="cie-h2">Antes de comprar.</h2>
          <div className="cie-faq">
            {FAQ.map((f, i) => (
              <details className="cie-faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="cie-faq-answer">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ════ CTA FINAL ═════════════════════════════════════════ */}
        <section className="cie-cta-final">
          <h2 className="cie-cta-final-title">Bora começar?</h2>
          <p className="cie-cta-final-sub">
            Um pacote, um ingrediente, zero promessa furada. Seu pet sente em
            poucas semanas — a gente devolve o dinheiro se não rolar.
          </p>
          <a href={ctaUrl("final")} className="cie-btn-primary" target="_blank" rel="noopener noreferrer">
            Quero meu kit com {COUPON} →
          </a>
        </section>

        {/* ════ FOOTER ════════════════════════════════════════════ */}
        <footer className="cie-footer">
          <div className="cie-footer-tagline">Nojento é o desperdício.</div>
          <div className="cie-footer-info">
            <strong>Lets Fly Sustentável Comércio de Produtos de Proteína Desidratados LTDA</strong><br />
            CNPJ 42.041.946/0001-46 · MAPA RJ 001924-0<br />
            🇧🇷 Indústria Brasileira — Feito no Rio
          </div>
          <div className="cie-footer-contato">
            <a href="https://wa.me/552139500576" target="_blank" rel="noopener noreferrer">WhatsApp (21) 3950-0576</a>
            <span aria-hidden="true">·</span>
            <a href="mailto:comidadedragao@letsfly.com.br">comidadedragao@letsfly.com.br</a>
            <span aria-hidden="true">·</span>
            <a href="https://instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">@comidadedragao</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
