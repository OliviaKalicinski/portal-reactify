import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import "./Obrigado.css";

/* ──────────────────────────────────────────────────────────────
   PÁGINA DE OBRIGADO — /obrigado
   Comida de Dragão · destino do redirecionamento Yampi pós-compra

   Conceito: rito de passagem. O cliente atravessou o portal —
   agora é convidado a explorar a caverna (o ecossistema da marca).

   Design: dark brutalist caverna · alinhado com o Portal principal,
   intencionalmente diferente das LPs (que são light zine paper).
   Cards com GIF hover preview no padrão do Portal.

   ⚠️ Configurar redirecionamento em:
      Yampi admin → Checkout → Redirecionamento (por método de pagamento)
   ⚠️ Pix simples NÃO redireciona — limitação da plataforma.
────────────────────────────────────────────────────────────── */

const COUPON = "VOLTOU10";

/** GIFs reusados do Portal — mesmo arsenal visual da marca */
const GIF = {
  manifesto:  "/assets/images/team.gif", // local — pop-up quem faz acontecer
  biblioteca: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2FuY2JjbDV0aXdjNWgwOHhvcWZqY3ozZWZoZ3FoaXVtNzZ2aDRuOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mrTjb8ZXFeJdC/giphy.gif",
  quiz:       "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJxNHpkYTNjYmI2cTlpOTV4ZTQxZG5ia3VpMnpvamNuZjBzdWEwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1kkxWqT5nvLXupUTwK/giphy.gif",
  midia:      "https://media.giphy.com/media/HIWNaM05qJAENE1TJM/giphy.gif",
  instagram:  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2N1NDBpdDdvaWkyaDh5YnNhMXFnNWd6anNjMGJvYmJ6eXptN2FhOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Fu3OjBQiCs3s0ZuLY3/giphy.gif",
  whatsapp:   "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2RzczUzNDA0eHg1ZXg4czhoemg4aXIybXprMGd6eGJrYzdzMm9zMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/y0mkt9yBEsrPW/giphy.gif",
};

type Sala = {
  num: string;
  titulo: React.ReactNode;
  desc: string;
  url: string;
  arrow: string;
  gif: string;
  external: boolean;
};

const SALAS: Sala[] = [
  {
    num: "01",
    titulo: <>Quem faz<br />acontecer.</>,
    desc: "A matilha por trás do Dragão. Quem cozinha, quem decide, quem topa.",
    url: "/portal?modal=manifesto",
    arrow: "Conhecer a matilha",
    gif: GIF.manifesto,
    external: false,
  },
  {
    num: "02",
    titulo: <>Biblioteca<br />científica.</>,
    desc: "17 artigos sobre inseto na alimentação pet — a ciência por trás do Dragão.",
    url: "/biblioteca",
    arrow: "Entrar na biblioteca",
    gif: GIF.biblioteca,
    external: false,
  },
  {
    num: "03",
    titulo: <>O Dragão quer<br />te conhecer.</>,
    desc: "Quizz rápido pra montar seu perfil de tutor — em 1 minuto.",
    url: "/quizzes",
    arrow: "Fazer o quiz",
    gif: GIF.quiz,
    external: false,
  },
  {
    num: "04",
    titulo: <>Na<br />mídia.</>,
    desc: "O Dragão saiu na imprensa. Vê o que andam falando da gente.",
    url: "/imprensa",
    arrow: "Ler matérias",
    gif: GIF.midia,
    external: false,
  },
  {
    num: "05",
    titulo: <>@comida<br />dedragao</>,
    desc: "Posts, stories, reels e o Dragão provocando todo dia.",
    url: "https://instagram.com/comidadedragao",
    arrow: "Abrir Instagram",
    gif: GIF.instagram,
    external: true,
  },
  {
    num: "06",
    titulo: <>Fala com<br />a gente.</>,
    desc: "WhatsApp SAC (21) 3950-0576 — o Dragão não abandona ninguém.",
    url: "https://wa.me/552139500576",
    arrow: "Abrir WhatsApp",
    gif: GIF.whatsapp,
    external: true,
  },
];

const MARQUEE_PHRASES = [
  "ACESSO LIBERADO",
  "A MATILHA TE VIU",
  "NOJENTO É O DESPERDÍCIO",
  "BIOFÁBRICA RJ 001924-0",
  "88,9% DIGESTIBILIDADE",
];

/** Card reutilizável com GIF hover (mesmo padrão visual do portal). */
const SalaCard = ({ sala }: { sala: Sala }) => {
  const inner = (
    <>
      <div
        className="obg-sala-bg"
        style={{ backgroundImage: `url('${sala.gif}')` }}
        aria-hidden="true"
      />
      <div className="obg-sala-content">
        <div className="obg-sala-num">// {sala.num}</div>
        <h3 className="obg-sala-titulo">{sala.titulo}</h3>
        <p className="obg-sala-desc">{sala.desc}</p>
      </div>
      <span className="obg-sala-arrow" aria-hidden="true">→</span>
    </>
  );

  if (sala.external) {
    return (
      <a
        className="obg-sala"
        href={sala.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={sala.arrow}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link className="obg-sala" to={sala.url} aria-label={sala.arrow}>
      {inner}
    </Link>
  );
};

export default function Obrigado() {
  return (
    <div className="obg-page">
      <Helmet>
        <title>Bem-vindo à caverna · Comida de Dragão</title>
        <meta
          name="description"
          content="Você entrou na caverna do dragão. Vem conhecer o que tem aqui dentro."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="obg-wrap">
        {/* ════ TOP BAR ═══════════════════════════════════════════ */}
        <div className="obg-topbar">
          <div className="obg-badge">// 01 · acesso liberado</div>
          <a href="https://comidadedragao.com.br">← voltar pra loja</a>
        </div>

        {/* ════ HERO — RITO DE PASSAGEM ═══════════════════════════ */}
        <section className="obg-hero">
          <DragonLogo className="obg-hero-logo" />
          <div className="obg-eyebrow">// o dragão te viu</div>
          <h1 className="obg-title">
            Você entrou na<br />
            caverna do <em>dragão</em>.
          </h1>

          <p className="obg-sub-info">
            Sobre o seu pedido: <strong>a gente registrou</strong>. Já já você
            recebe o código de rastreio.
          </p>
          <p className="obg-sub">
            <strong>Essa é a nossa casa.</strong> Vem conhecer o que tem aqui dentro.
          </p>
        </section>

        {/* ════ 6 SALAS DA CAVERNA — peça-chave ══════════════════ */}
        <section className="obg-section">
          <div className="obg-head">// 02 · o que tem lá dentro</div>
          <h2 className="obg-h2">
            Explore a <em>caverna</em>.
          </h2>

          <div className="obg-salas">
            {SALAS.map((sala) => <SalaCard key={sala.num} sala={sala} />)}
          </div>
        </section>

        {/* ════ MARQUEE ═══════════════════════════════════════════ */}
        <div className="obg-marquee" aria-hidden="true">
          <div className="obg-marquee-track">
            {[...MARQUEE_PHRASES, ...MARQUEE_PHRASES, ...MARQUEE_PHRASES].map(
              (phrase, i) => <span key={i}>{phrase}</span>
            )}
          </div>
        </div>

        {/* ════ SELO DA MATILHA — cupom mais discreto ════════════ */}
        <section className="obg-selo">
          <div className="obg-selo-eyebrow">// selo da matilha</div>
          <h2 className="obg-selo-titulo">
            10% off na sua <em>próxima.</em>
          </h2>
          <div className="obg-selo-codigo">{COUPON}</div>
          <div className="obg-selo-small">
            válido por 30 dias · 1 uso por cliente
          </div>
        </section>

        {/* ════ FOOTER ════════════════════════════════════════════ */}
        <footer className="obg-footer">
          <div className="obg-footer-tagline">Nojento é o desperdício.</div>
          Comida de Dragão · Lets Fly Sustentável<br />
          Biofábrica registrada no MAPA — RJ 001924-0
        </footer>
      </div>
    </div>
  );
}
