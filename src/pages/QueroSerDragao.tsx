import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import ReelsSection from "@/components/ReelsSection";
import PageMeta from "@/components/PageMeta";
import "./Portal.css";
import "./Parceiros.css";

const MARQUEE_TOP = [
  "QUERO SER DRAGÃO",
  "30% DE COMISSÃO",
  "PRODUTOS MENSAIS",
  "CUPOM EXCLUSIVO",
  "SEM EXCLUSIVIDADE",
  "VOCÊ POSTA DO SEU JEITO",
  "BIOFÁBRICA REGISTRADA NO MAPA",
];

const MARQUEE_BOTTOM = [
  "// PARCEIROS",
  "// MATILHA DO DRAGÃO",
  "@COMIDADEDRAGAO",
  "NOJENTO É O DESPERDÍCIO",
  "ENTRA NA MATILHA",
  "COMIDA DE DRAGÃO · LET'S FLY",
];

const MarqueeBar = ({ items, bottom = false }: { items: string[]; bottom?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-bar${bottom ? " bottom" : ""}`}>
      <div className="marquee-track" style={bottom ? { animationDirection: "reverse" } : undefined}>
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
};

const STATS = [
  { num: "88,9%", label: "Digestibilidade" },
  { num: "83%",   label: "Menos carbono" },
  { num: "6",     label: "Produtos na linha" },
  { num: "100%",  label: "Feito no RJ" },
];

const BENEFICIOS = [
  {
    icon: "📦",
    title: "Produtos pra testar",
    desc: "A gente manda alguns dos nossos produtos pra você e seu pet experimentarem. Review honesto, sem roteiro.",
  },
  {
    icon: "🏷️",
    title: "Cupom exclusivo",
    desc: "Você recebe um cupom personalizado pra compartilhar com sua audiência. Desconto real, fácil de divulgar.",
  },
  {
    icon: "💸",
    title: "Comissão por venda",
    desc: "Cada compra feita com seu cupom gera comissão direto pra você. Quanto mais vende, mais ganha.",
  },
  {
    icon: "🤝",
    title: "Suporte direto",
    desc: "Você fala com a gente pelo WhatsApp — sem chatbot, sem demora. Qualquer dúvida, a gente resolve na hora.",
  },
];

const REQUISITOS = [
  {
    title: "Mínimo 5 mil seguidores no Instagram ou TikTok",
    desc: "Nano e micro creators são muito bem-vindos — engajamento importa mais que volume.",
  },
  {
    title: "Ter pet — cão, gato, réptil ou exótico",
    desc: "O animal precisa fazer parte da sua vida e do seu conteúdo.",
  },
  {
    title: "Conta ativa nos últimos 30 dias",
    desc: "Não precisa postar todo dia, mas a relação com a audiência precisa ser real.",
  },
  {
    title: "Nicho: pets, sustentabilidade ou lifestyle consciente",
    desc: "Qualquer combinação dessas três áreas funciona.",
  },
  {
    title: "Abertura pra conteúdo diferente",
    desc: "Proteína de inseto é novidade — a gente precisa de criadores que topam questionar o óbvio.",
  },
];

const REGRAS = [
  {
    num: "01",
    title: "Conteúdo autêntico",
    desc: "Review honesto, sem roteiro fixo. A gente não pede pra você fingir que amou se não amou.",
  },
  {
    num: "02",
    title: "Prazo do post",
    desc: "Após receber os produtos, o post deve ser feito em até 14 dias. Sem prazo, sem parceria.",
  },
  {
    num: "03",
    title: "Cadastro no Inflowz",
    desc: "Toda a parceria é gerenciada pela plataforma — produtos, cupom e comissão tudo centralizado lá.",
  },
  {
    num: "04",
    title: "Comunicação aberta",
    desc: "Problema? Nos avise antes. A gente prefere resolver junto do que encerrar uma parceria por falta de papo.",
  },
];

const INFLOWZ_URL = "https://app.inflowz.io/signup/comida-de-dragao";

const QueroSerDragao = () => {
  return (
    <div className="portal-page parceiros-page skin-2">
      <PageMeta
        title="Quero ser Dragão — Comida de Dragão"
        description="Seja parceiro Comida de Dragão. Produtos pra testar, cupom exclusivo e comissão por venda. Entra na matilha."
        image="/assets/images/poster-punk-converte.webp"
      />
      <MarqueeBar items={MARQUEE_TOP} />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="parceiros-hero">
        <div className="parceiros-hero-bg" />
        <div className="dragon-silhouette" aria-hidden="true" />
        <div className="parceiros-hero-content">
          <Link to="/portal" className="parceiros-backlink">← voltar pro portal</Link>
          <div className="hero-eyebrow">Comida de Dragão — Parcerias</div>
          <DragonLogo className="hero-logo" />
          <h1 className="parceiros-hero-title">
            Quero virar<br />
            <span>parceiro do dragão.</span>
          </h1>
          <p className="parceiros-hero-sub">
            A gente faz <strong>petisco pra pet com proteína de inseto BSF</strong> — nutritiva,
            sustentável e diferente de tudo no mercado pet. Se você tem audiência engajada e
            acredita no que faz, bora fazer junto.
          </p>
          <div className="parceiros-hero-badges">
            <span className="parceiros-badge">Produtos pra testar</span>
            <span className="parceiros-badge">Cupom exclusivo</span>
            <span className="parceiros-badge">Comissão por venda</span>
            <span className="parceiros-badge">Suporte direto</span>
          </div>
          <div className="parceiros-hero-cta">
            <a
              href={INFLOWZ_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="parceiros-btn-primary"
            >
              Quero ser parceiro ↗
            </a>
          </div>
          <p className="parceiros-hero-note">
            Cadastro gratuito · Sem exclusividade · Você posta do seu jeito
          </p>
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════════════ */}
      <div className="parceiros-stats-bar">
        {STATS.map((s, i) => (
          <div className="parceiros-stat-item" key={i}>
            <span className="pbs-num">{s.num}</span>
            <span className="pbs-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ══ O QUE GANHA ═══════════════════════════════════════════ */}
      <section className="parceiros-secao">
        <div className="parceiros-tag">a parceria</div>
        <h2 className="parceiros-secao-titulo titulo-orange">O que você <span>ganha</span></h2>
        <div className="parceiros-beneficios">
          {BENEFICIOS.map((b, i) => (
            <div className="parceiros-beneficio" key={i}>
              <div className="parceiros-beneficio-icon">{b.icon}</div>
              <div className="parceiros-beneficio-titulo">{b.title}</div>
              <div className="parceiros-beneficio-desc">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="parceiros-divider" />

      {/* ══ PRÉ-REQUISITOS ════════════════════════════════════════ */}
      <section className="parceiros-secao">
        <div className="parceiros-tag tag-green">quem pode participar</div>
        <h2 className="parceiros-secao-titulo titulo-green">Pré-<span>requisitos</span></h2>
        <div className="parceiros-requisitos">
          {REQUISITOS.map((r, i) => (
            <div className="parceiros-req" key={i}>
              <div className="parceiros-req-check">✓</div>
              <div className="parceiros-req-body">
                <strong>{r.title}</strong>
                <span>{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="parceiros-divider" />

      {/* ══ REGRAS ════════════════════════════════════════════════ */}
      <section className="parceiros-secao">
        <div className="parceiros-tag tag-pink">como funciona</div>
        <h2 className="parceiros-secao-titulo titulo-pink">Principais <span>regras</span></h2>
        <div className="parceiros-regras-grid">
          {REGRAS.map((r, i) => (
            <div className="parceiros-regra-card" key={i}>
              <div className="parceiros-regra-num">{r.num}</div>
              <div className="parceiros-regra-titulo">{r.title}</div>
              <div className="parceiros-regra-desc">{r.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="parceiros-divider" />

      {/* ══ REELS — prova social ═══════════════════════════════════ */}
      <div className="parceiros-reels-wrap">
        <ReelsSection
          title="Criadores na matilha"
          subtitle="Conteúdo real dos criadores que já toparam. Toca pra ver."
          seeAllUrl="https://www.instagram.com/comidadedragao"
          seeAllLabel="Mais no @comidadedragao →"
        />
      </div>

      {/* ══ CTA FINAL ═════════════════════════════════════════════ */}
      <section className="parceiros-cta-final">
        <h2 className="parceiros-cta-final-titulo">
          Bora<br /><span>fazer junto?</span>
        </h2>
        <p className="parceiros-cta-final-sub">
          Se você chegou até aqui e fez sentido, o próximo passo é simples —
          se cadastra no Inflowz e a gente entra em contato.
        </p>
        <a
          href={INFLOWZ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="parceiros-btn-primary"
        >
          Quero ser parceiro ↗
        </a>
        <p className="parceiros-cta-final-note">Dúvidas? Fala com a Luana: (24) 98163-4847</p>
      </section>

      <MarqueeBar items={MARQUEE_BOTTOM} bottom />

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <nav className="footer-links">
          <Link to="/portal">Portal</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/biblioteca">Biblioteca</Link>
          <Link to="/imprensa">Imprensa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@comidadedragao" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">Nojento é o desperdício.</div>
      </footer>
    </div>
  );
};

export default QueroSerDragao;
