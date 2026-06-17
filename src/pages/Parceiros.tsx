import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import ReelsSection from "@/components/ReelsSection";
import PageMeta from "@/components/PageMeta";
import "./Portal.css";
import "./Parceiros.css";

const MARQUEE_TOP = [
  "30% DE COMISSÃO",
  "PRODUTOS MENSAIS",
  "CUPOM EXCLUSIVO",
  "SEM EXCLUSIVIDADE",
  "VOCÊ POSTA DO SEU JEITO",
  "DO RESÍDUO À PROTEÍNA",
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

const STEPS = [
  {
    n: 1,
    title: "Faça seu cadastro",
    sub: "Crie sua conta gratuita no Inflowz, entre na campanha \"Influenciadores\" e cadastre seu cupom personalizado. Leva menos de 5 minutos.",
  },
  {
    n: 2,
    title: "Receba o kit e teste",
    sub: "Após aprovação, enviamos produtos para você e seu pet experimentarem — sem custo. Publique em até 14 dias após o recebimento.",
  },
  {
    n: 3,
    title: "Poste do seu jeito",
    sub: "Feed, reels ou stories — sem script. Seu cupom dá 10% de desconto para seus seguidores e você ganha 30% de comissão por cada venda.",
  },
  {
    n: 4,
    title: "Receba todo mês",
    sub: "Solicite um produto por mês pela plataforma e acompanhe suas comissões em tempo real. Pagamento automático, sem precisar cobrar.",
  },
];

const BENEFICIOS = [
  { icon: "01", title: "30% de comissão", desc: "Por cada venda gerada pelo seu cupom, automaticamente." },
  { icon: "02", title: "Produtos mensais", desc: "Um produto por mês direto na plataforma, sem custo." },
  { icon: "03", title: "Cupom exclusivo", desc: "10% de desconto para seus seguidores, código personalizado." },
  { icon: "04", title: "Liberdade total", desc: "Sem script nem formato obrigatório. Você cria do seu jeito." },
  { icon: "05", title: "Amplificação", desc: "Repostamos seu conteúdo orgânico e ampliamos seu alcance." },
  { icon: "06", title: "Suporte direto", desc: "Acesso direto à Luana para dúvidas, ideias e suporte." },
];

const REQUISITOS = [
  {
    title: "Mínimo de 5.000 seguidores",
    desc: "No Instagram ou TikTok. Valorizamos engajamento real mais do que números grandes.",
  },
  {
    title: "Ter e amar um pet",
    desc: "Cão, gato, réptil ou exótico — não importa o nicho. O que importa é que você tenha um pet e genuinamente goste dele.",
  },
  {
    title: "Conteúdo autêntico",
    desc: "Mostre a reação real do seu pet. Não pedimos script nem formato específico — só autenticidade.",
  },
  {
    title: "Publicação em colab com @comidadedragao",
    desc: "Posts no feed e reels devem ser feitos em colab para aparecerem também no nosso perfil.",
  },
];

const REGRAS = [
  {
    ok: true,
    title: "Dois stories — orgânico + cupom",
    desc: "Um story orgânico com a reação do pet (esse a gente reposta!) e outro com o cupom para converter seus seguidores.",
  },
  {
    ok: true,
    title: "Feed e reels em colab com @comidadedragao",
    desc: "Faça em colab para ampliarmos seu alcance e a publicação entrar no nosso perfil também.",
  },
  {
    ok: true,
    title: "Capa oficial no feed",
    desc: "Use a capa disponível nos templates do Manual do Criador para manter a identidade visual do time.",
  },
  {
    ok: false,
    title: "Stories com cupom não são repostados por nós",
    desc: "Evita competição entre parceiros. Mas você deve postar — é ele que converte seus seguidores.",
  },
  {
    ok: false,
    title: "Sem promessas de saúde",
    desc: "Evite \"cura\", \"trata\" ou \"resolve\". Fale da experiência real e deixe os dados falarem por si.",
  },
];

const INFLOWZ_URL = "https://app.inflowz.io/signup/comida-de-dragao";
const MANUAL_DRIVE_URL = "https://drive.google.com/drive/u/0/folders/1kDnH3JYqgpU9l7nHhRgLybFnN58NBhyY";
const MARKETING_DRIVE_URL = "https://drive.google.com/drive/u/0/folders/1DiTxfcg8ybCkv-1zhwaiThR8pfnijCpJ";

const Parceiros = () => {
  return (
    <div className="portal-page parceiros-page skin-2">
      <PageMeta
        title="Parceiros · Comida de Dragão"
        description="Seja criador de conteúdo Comida de Dragão. 30% de comissão, produtos mensais, cupom exclusivo e liberdade criativa. Entra na matilha."
        image="/assets/images/poster-punk-converte.webp"
      />
      <MarqueeBar items={MARQUEE_TOP} />

      {/* HERO */}
      <section className="parceiros-hero">
        <div className="parceiros-hero-bg" />
        <div className="dragon-silhouette" aria-hidden="true" />
        <div className="parceiros-hero-content">
          <Link to="/portal" className="parceiros-backlink">← voltar pro portal</Link>
          <div className="hero-eyebrow">Comida de Dragão — Parceiros</div>
          <DragonLogo className="hero-logo" />
          <h1 className="parceiros-hero-title">
            Entra
            <span>na matilha.</span>
          </h1>
          <p className="parceiros-hero-sub">
            Produtos mensais, cupom exclusivo e comissão por venda — com a marca brasileira de
            proteína de inseto BSF para pets, produzida aqui no RJ.
          </p>
          <div className="parceiros-hero-badges">
            <span className="parceiros-badge">30% de comissão</span>
            <span className="parceiros-badge">Produtos mensais</span>
            <span className="parceiros-badge">Cupom exclusivo</span>
            <span className="parceiros-badge">Produção própria RJ</span>
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

      {/* INTRO — quem é a Comida de Dragão */}
      <section className="parceiros-brand-intro">
        <div className="parceiros-brand-intro-inner">
          <div className="parceiros-brand-eyebrow">// antes de tudo</div>
          <h2 className="parceiros-brand-titulo">
            Queremos<br />fazer barulho.
          </h2>
          <p className="parceiros-brand-texto">
            A <strong>Comida de Dragão</strong> é uma inovação brasileira que transforma inseto BSF em nutrição premium pra pets. Produzimos nossos próprios insetos em Cachoeiras de Macacu, RJ — do resíduo orgânico à proteína de elite, tudo rastreável, tudo nosso.
          </p>
          <p className="parceiros-brand-texto">
            Somos sustentáveis de verdade: 83% menos carbono, 142× menos uso de terra, ciclo de 45 dias. Não é marketing. É matemática.
          </p>
          <p className="parceiros-brand-callout">
            2 bilhões de pessoas no mundo já comem inseto. Pets são o começo da revolução no Brasil — e queremos que mais gente saiba disso. <strong>É aqui que você entra.</strong>
          </p>
          <div className="parceiros-brand-stats">
            <div className="parceiros-brand-stat">
              <span className="pbs-num">83<small>%</small></span>
              <span className="pbs-lbl">menos carbono</span>
            </div>
            <div className="parceiros-brand-stat">
              <span className="pbs-num">88,9<small>%</small></span>
              <span className="pbs-lbl">digestibilidade</span>
            </div>
            <div className="parceiros-brand-stat">
              <span className="pbs-num">45<small>%</small></span>
              <span className="pbs-lbl">proteína bruta</span>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="parceiros-secao">
        <div className="parceiros-tag">como funciona</div>
        <h2 className="parceiros-secao-titulo">É simples <span>assim</span></h2>
        <div className="parceiros-steps">
          {STEPS.map(s => (
            <div className="parceiros-step" key={s.n}>
              <div className="parceiros-step-num">{s.n}</div>
              <div className="parceiros-step-body">
                <strong>{s.title}</strong>
                <span>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="parceiros-divider" />

      {/* BENEFÍCIOS */}
      <section className="parceiros-secao">
        <div className="parceiros-tag tag-orange">o que você ganha</div>
        <h2 className="parceiros-secao-titulo titulo-orange">Sua <span>parceria</span></h2>
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

      {/* PRÉ-REQUISITOS */}
      <section className="parceiros-secao">
        <div className="parceiros-tag tag-green">pré-requisitos</div>
        <h2 className="parceiros-secao-titulo titulo-green">O que <span>precisamos</span> de você</h2>
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

      {/* PRAZO + REGRAS */}
      <section className="parceiros-secao">
        <div className="parceiros-tag tag-pink">regras</div>
        <h2 className="parceiros-secao-titulo titulo-pink">Como <span>publicar</span></h2>
        <div className="parceiros-prazo-box">
          <div className="parceiros-prazo-num">14</div>
          <div className="parceiros-prazo-texto">
            <strong>dias para a primeira publicação</strong>
            <span>
              Contado após confirmação de entrega. Parceiros fora do prazo podem ter o
              cupom pausado — mas é só avisar se tiver algum imprevisto.
            </span>
          </div>
        </div>
        <div className="parceiros-regras">
          {REGRAS.map((r, i) => (
            <div className="parceiros-regra" key={i}>
              <div className={`parceiros-regra-badge ${r.ok ? "badge-ok" : "badge-no"}`}>
                {r.ok ? "SIM" : "NÃO"}
              </div>
              <div className="parceiros-regra-body">
                <strong>{r.title}</strong>
                <span>{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="parceiros-divider" />

      {/* MATERIAIS */}
      <section className="parceiros-secao">
        <div className="parceiros-tag tag-violet">materiais</div>
        <h2 className="parceiros-secao-titulo titulo-violet">Tudo pronto pra <span>criar</span></h2>
        <p className="parceiros-secao-texto">
          Templates, capas oficiais, fotos dos produtos e tabela nutricional — tudo disponível
          para facilitar sua criação.
        </p>
        <a
          href={MANUAL_DRIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="parceiros-link-box"
        >
          <div>
            <div className="parceiros-link-label">Manual do Criador</div>
            <div className="parceiros-link-url">drive.google.com/drive/folders/1kDnH3JY...</div>
          </div>
          <span className="parceiros-link-btn">Abrir ↗</span>
        </a>
        <a
          href={MARKETING_DRIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="parceiros-link-box"
        >
          <div>
            <div className="parceiros-link-label">Material de Marketing</div>
            <div className="parceiros-link-url">drive.google.com/drive/folders/1DiTxfc...</div>
          </div>
          <span className="parceiros-link-btn">Abrir ↗</span>
        </a>
      </section>

      {/* REELS — prova social de criadores já na matilha, logo antes do CTA final */}
      <div className="parceiros-reels-wrap">
        <ReelsSection
          title="Criadores na matilha"
          subtitle="Conteúdo real dos influenciadores que já toparam. Toca pra ver."
          seeAllUrl="https://www.instagram.com/comidadedragao"
          seeAllLabel="Mais no @comidadedragao →"
        />
      </div>

      {/* CTA FINAL */}
      <section className="parceiros-cta-final">
        <h2 className="parceiros-cta-final-titulo">
          Pronto para <span>fazer parte?</span>
        </h2>
        <p className="parceiros-cta-final-sub">
          Cadastro gratuito. Sem exclusividade. Você posta do seu jeito e ganha por cada venda.
        </p>
        <a
          href={INFLOWZ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="parceiros-btn-primary"
        >
          Fazer meu cadastro ↗
        </a>
        <p className="parceiros-cta-final-note">Dúvidas? Fala com a Luana: (24) 98163-4847</p>
      </section>

      <MarqueeBar items={MARQUEE_BOTTOM} bottom />

      {/* FOOTER */}
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

export default Parceiros;
