import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import ReelsSection from "@/components/ReelsSection";
import PageMeta from "@/components/PageMeta";
import "./Portal.css";
import "./Parceiros.css";

/* ──────────────────────────────────────────────────────────────
   VETERINÁRIOS — espelho da /quero-ser-dragao com olhar de vet.
   Mesma estrutura, mesmo Inflowz, mesmos contatos.
   A parceria é a mesma dos criadores; muda o público e os
   benefícios (amostras pra pacientes, treinamento técnico),
   e o ângulo: vet como autoridade que endossa a causa.
────────────────────────────────────────────────────────────── */

const MARQUEE_TOP = [
  "VETERINÁRIO PARCEIRO",
  "30% DE COMISSÃO",
  "AMOSTRAS PRA PACIENTES",
  "CUPOM EXCLUSIVO",
  "TREINAMENTO TÉCNICO",
  "SEM EXCLUSIVIDADE",
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
    title: "Amostras pra seus pacientes",
    desc: "A gente manda kits de amostras pra você entregar aos tutores na consulta. O paciente testa em casa, você acompanha o resultado.",
  },
  {
    icon: "🏷️",
    title: "Cupom exclusivo",
    desc: "Você recebe um cupom personalizado pra repassar aos tutores. Desconto real, fácil de indicar dentro do atendimento.",
  },
  {
    icon: "💸",
    title: "Comissão por indicação",
    desc: "Cada compra feita com seu cupom gera comissão direto pra você. Recomendação que faz sentido e ainda vira retorno.",
  },
  {
    icon: "🎓",
    title: "Treinamento técnico",
    desc: "Acesso a treinamentos sobre proteína de inseto BSF, fichas técnicas e a biblioteca científica pra embasar a sua recomendação.",
  },
  {
    icon: "🤝",
    title: "Suporte direto",
    desc: "Você fala com a gente pelo WhatsApp — sem chatbot, sem demora. Dúvida técnica ou logística, a gente resolve na hora.",
  },
  {
    icon: "🩺",
    title: "Vet no time do Dragão",
    desc: "Você entra como endossante da causa — pode aparecer nas nossas parcerias e materiais como veterinário parceiro.",
  },
];

const REQUISITOS = [
  {
    title: "CRMV ativo e em situação regular",
    desc: "A parceria é com profissionais habilitados — clínico geral ou especialista, todos são bem-vindos.",
  },
  {
    title: "Atendimento ativo a cães, gatos, répteis ou exóticos",
    desc: "Clínica, consultório, atendimento domiciliar ou hospital veterinário — todos contam.",
  },
  {
    title: "Abertura pra nutrição diferente",
    desc: "Proteína de inseto ainda é novidade no Brasil. A gente precisa de vets que topam estudar o que foge do óbvio.",
  },
  {
    title: "Recomendação honesta",
    desc: "Você só indica se fizer sentido pro paciente. A gente não pede recomendação forçada — endosso de verdade vale mais.",
  },
  {
    title: "Compromisso com a causa",
    desc: "Sustentabilidade e bem-estar animal precisam fazer parte do seu jeito de clinicar.",
  },
];

const REGRAS = [
  {
    num: "01",
    title: "Recomendação técnica",
    desc: "Indicação baseada no caso clínico, sem roteiro fixo. Você recomenda porque faz sentido, não por obrigação.",
  },
  {
    num: "02",
    title: "Uso das amostras",
    desc: "As amostras são pra entregar aos tutores em consulta, sempre com orientação de uso. Sem revenda.",
  },
  {
    num: "03",
    title: "Cadastro no Inflowz",
    desc: "Toda a parceria é gerenciada pela plataforma — amostras, cupom e comissão tudo centralizado lá.",
  },
  {
    num: "04",
    title: "Comunicação aberta",
    desc: "Dúvida técnica, problema com um paciente ou logística? Nos avise antes. A gente prefere resolver junto.",
  },
];

const INFLOWZ_URL = "https://app.inflowz.io/signup/comida-de-dragao";

const Veterinarios = () => {
  return (
    <div className="portal-page parceiros-page skin-2">
      <PageMeta
        title="Quero ser Vet Parceiro — Comida de Dragão"
        description="Seja veterinário parceiro da Comida de Dragão. Amostras pra pacientes, cupom exclusivo, comissão por indicação e treinamento técnico. Entra na matilha."
        image="/assets/images/poster-punk-converte.webp"
      />
      <MarqueeBar items={MARQUEE_TOP} />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="parceiros-hero">
        <div className="parceiros-hero-bg" />
        <div className="dragon-silhouette" aria-hidden="true" />
        <div className="parceiros-hero-content">
          <Link to="/portal" className="parceiros-backlink">← voltar pro portal</Link>
          <div className="hero-row">
            <DragonLogo className="hero-logo" />
            <div className="hero-copy">
              <div className="hero-eyebrow">Comida de Dragão — Parcerias com Veterinários</div>
              <h1 className="parceiros-hero-title">
                Quero virar<br />
                <span>vet parceiro do dragão.</span>
              </h1>
              <p className="parceiros-hero-sub">
                A gente faz <strong>petisco e suplemento pra pet com proteína de inseto BSF</strong> —
                nutritivo, hipoalergênico e sustentável. Se você acredita em nutrição diferente e quer
                embasar isso na sua clínica, bora fazer junto.
              </p>
            </div>
          </div>
          <div className="parceiros-hero-badges">
            <span className="parceiros-badge">Amostras pra pacientes</span>
            <span className="parceiros-badge">Cupom exclusivo</span>
            <span className="parceiros-badge">Comissão por indicação</span>
            <span className="parceiros-badge">Treinamento técnico</span>
          </div>
          <div className="parceiros-hero-cta">
            <a
              href={INFLOWZ_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="parceiros-btn-primary"
            >
              Quero ser vet parceiro ↗
            </a>
          </div>
          <p className="parceiros-hero-note">
            Cadastro gratuito · Sem exclusividade · Você recomenda do seu jeito
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
          title="A matilha em campo"
          subtitle="Conteúdo real de quem já está com a gente nessa. Toca pra ver."
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
          Quero ser vet parceiro ↗
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
          <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">Nojento é o desperdício.</div>
      </footer>
    </div>
  );
};

export default Veterinarios;
