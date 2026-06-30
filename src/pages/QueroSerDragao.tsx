import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import ReelsSection from "@/components/ReelsSection";
import PageMeta from "@/components/PageMeta";
import "./QueroSerDragao.css";

const INFLOWZ_URL = "https://app.inflowz.io/signup/comida-de-dragao";
const ICON = "/assets/pixel-icons";

const MARQUEE_TOP = [
  "QUERO SER DRAGAO", "30% DE COMISSAO", "PRODUTOS MENSAIS", "CUPOM EXCLUSIVO",
  "SEM EXCLUSIVIDADE", "VOCE POSTA DO SEU JEITO", "BIOFABRICA REGISTRADA NO MAPA",
];

/* ── ícones de desktop (laterais) ── */
const DESK_LEFT = [
  { img: "games.png",      label: "MATILHA.GG" },
  { img: "heart-eyes.png", label: "MEU-PET" },
  { img: "crown.png",      label: "VIP.EXE" },
];
const DESK_RIGHT = [
  { img: "love.png",       label: "CUPOM♥" },
  { img: "star.png",       label: "FAVORITOS" },
  { img: "sleeping.png",   label: "LIXEIRA" },
];

/* ── janela OS reutilizável ── */
const Win = ({ name, children, className, inverted, violet, mac }: {
  name: string; children: ReactNode; className?: string; inverted?: boolean; violet?: boolean; mac?: boolean;
}) => (
  <section className={`qsd8-win${inverted ? " inverted" : ""}${violet ? " violet" : ""}${className ? " " + className : ""}`}>
    <div className="qsd8-titlebar">
      {mac && (
        <span className="qsd8-mac-dots" aria-hidden="true"><i /><i /></span>
      )}
      <span className="qsd8-tb-name">{name}</span>
      <span className="qsd8-tb-stripes" aria-hidden="true" />
      <span className="qsd8-tb-x" aria-hidden="true">×</span>
    </div>
    <div className="qsd8-win-body">{children}</div>
  </section>
);

const DeskCol = ({ items, side }: { items: typeof DESK_LEFT; side: "left" | "right" }) => (
  <div className={`qsd8-desk-icons ${side}`} aria-hidden="true">
    {items.map((it, i) => (
      <div className="qsd8-icon" key={i}>
        <img className="qsd8-duo" src={`${ICON}/${it.img}`} alt="" />
        <span>{it.label}</span>
      </div>
    ))}
  </div>
);

const STATS = [
  { num: "88,9%", label: "Digestibilidade" },
  { num: "83%",   label: "Menos carbono" },
  { num: "6",     label: "Produtos" },
  { num: "100%",  label: "Feito no RJ" },
];

const BENEFICIOS = [
  { img: "games.png",      title: "Produtos pra testar", desc: "A gente manda alguns dos nossos produtos pra você e seu pet experimentarem. Review honesto, sem roteiro." },
  { img: "love.png",       title: "Cupom exclusivo",     desc: "Você recebe um cupom personalizado pra compartilhar com sua audiência. Desconto real, fácil de divulgar." },
  { img: "crown.png",      title: "Comissão por venda",  desc: "Cada compra feita com seu cupom gera comissão direto pra você. Quanto mais vende, mais ganha." },
  { img: "heart-eyes.png", title: "Suporte direto",      desc: "Você fala com a gente pelo WhatsApp — sem chatbot, sem demora. Qualquer dúvida, a gente resolve na hora." },
];

const REQUISITOS = [
  { title: "Mínimo 5 mil seguidores no Instagram ou TikTok", desc: "Nano e micro creators são muito bem-vindos — engajamento importa mais que volume." },
  { title: "Ter pet — cão, gato, réptil ou exótico", desc: "O animal precisa fazer parte da sua vida e do seu conteúdo." },
  { title: "Conta ativa nos últimos 30 dias", desc: "Não precisa postar todo dia, mas a relação com a audiência precisa ser real." },
  { title: "Nicho: pets, sustentabilidade ou lifestyle consciente", desc: "Qualquer combinação dessas três áreas funciona." },
  { title: "Abertura pra conteúdo diferente", desc: "Proteína de inseto é novidade — a gente precisa de criadores que topam questionar o óbvio." },
];

const REGRAS = [
  { num: "01", title: "Conteúdo autêntico", desc: "Review honesto, sem roteiro fixo. A gente não pede pra você fingir que amou se não amou." },
  { num: "02", title: "Prazo do post", desc: "Após receber os produtos, o post deve ser feito em até 14 dias. Sem prazo, sem parceria." },
  { num: "03", title: "Cadastro no Inflowz", desc: "Toda a parceria é gerenciada pela plataforma — produtos, cupom e comissão tudo centralizado lá." },
  { num: "04", title: "Comunicação aberta", desc: "Problema? Nos avise antes. A gente prefere resolver junto do que encerrar uma parceria por falta de papo." },
];

const Marquee = () => {
  const doubled = [...MARQUEE_TOP, ...MARQUEE_TOP];
  return (
    <div className="qsd8-marquee">
      <div className="qsd8-marquee-track">{doubled.map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
};

const ProgressBar = ({ total = 14, cta = false }: { total?: number; cta?: boolean }) => (
  <div className={`qsd8-prog${cta ? " is-cta" : ""}`} aria-hidden="true">
    {Array.from({ length: total }).map((_, i) => <i key={i} />)}
  </div>
);

const QueroSerDragao = () => {
  return (
    <div className="qsd8">
      <PageMeta
        title="Quero ser Dragão — Comida de Dragão"
        description="Seja parceiro Comida de Dragão. Produtos pra testar, cupom exclusivo e comissão por venda. Entra na matilha."
        image="/assets/images/poster-punk-converte.webp"
      />

      {/* filtro duotone (ink -> lime) aplicado aos PNGs de pixel */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="qsd8-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.055 0.482" />
            <feFuncG type="table" tableValues="0.055 1.0" />
            <feFuncB type="table" tableValues="0.055 0.0" />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* fundo de céu azul natural */}
      <img className="qsd8-bg" src="/assets/bg-clouds.jpg" alt="" aria-hidden="true" />

      <DeskCol items={DESK_LEFT} side="left" />
      <DeskCol items={DESK_RIGHT} side="right" />

      <div className="qsd8-wrap">
        <Marquee />

        {/* ══ HERO — janela de instalação (limpo) ══════════════════ */}
        <Win name="MATILHA-DO-DRAGAO.EXE" mac className="qsd8-hero-win">
          <DragonLogo className="qsd8-hero-logo" />
          <div className="qsd8-eyebrow">Comida de Dragão — Parcerias</div>
          <h1 className="qsd8-title">Quero virar parceiro do <span>dragão</span></h1>
          <p className="qsd8-sub">
            Petisco pra pet com proteína de inseto BSF — nutritiva, sustentável e diferente
            de tudo no mercado pet. Tem audiência engajada? Bora fazer junto.
          </p>
          <div className="qsd8-btnrow">
            <a href={INFLOWZ_URL} target="_blank" rel="noopener noreferrer" className="qsd8-btn">
              <span className="qsd8-blink">▶</span> Quero ser parceiro
            </a>
            <Link to="/portal" className="qsd8-btn ghost">Voltar</Link>
          </div>
          <p className="qsd8-note">Cadastro gratuito · Sem exclusividade · Você posta do seu jeito</p>
        </Win>

        {/* ══ STATS ════════════════════════════════════════════════ */}
        <Win name="STATUS-DA-MARCA.SYS" inverted>
          <div className="qsd8-loot">
            {STATS.map((s, i) => (
              <div className="qsd8-card" key={i} style={{ textAlign: "center" }}>
                <div className="qsd8-card-title" style={{ fontSize: 20, marginBottom: 8 }}>{s.num}</div>
                <div className="qsd8-card-desc" style={{ fontSize: 15, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Win>

        {/* ══ DROPS / O QUE GANHA ══════════════════════════════════ */}
        <Win name="DROPS-DA-PARCERIA.EXE">
          <h2 className="qsd8-h2">O que você <span>ganha</span></h2>
          <div className="qsd8-loot">
            {BENEFICIOS.map((b, i) => (
              <div className="qsd8-card" key={i}>
                <img className="qsd8-card-ico qsd8-duo" src={`${ICON}/${b.img}`} alt="" />
                <div className="qsd8-card-title">{b.title}</div>
                <div className="qsd8-card-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </Win>

        {/* ══ ERRO brincalhão ══════════════════════════════════════ */}
        <Win name="ERROR" className="qsd8-error-win">
          <div className="qsd8-error-body">
            <img className="qsd8-duo" src={`${ICON}/angry.png`} alt="" />
            <p>
              <strong>POTE_VAZIO.ERR</strong>
              Seu pet merece proteína de verdade. Vire parceiro antes que ele descubra. [OK]
            </p>
          </div>
        </Win>

        {/* ══ REQUISITOS ═══════════════════════════════════════════ */}
        <Win name="REQUISITOS-DO-PLAYER.SYS" inverted>
          <h2 className="qsd8-h2">Pré-<span>requisitos</span></h2>
          <div className="qsd8-reqs">
            {REQUISITOS.map((r, i) => (
              <div className="qsd8-req" key={i}>
                <div className="qsd8-req-check">✓</div>
                <div className="qsd8-req-body">
                  <strong>{r.title}</strong>
                  <span>{r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Win>

        {/* ══ REGRAS ═══════════════════════════════════════════════ */}
        <Win name="REGRAS-DA-QUEST.BAT">
          <h2 className="qsd8-h2">Principais <span>regras</span></h2>
          <div className="qsd8-rules">
            {REGRAS.map((r, i) => (
              <div className="qsd8-rule" key={i}>
                <div className="qsd8-rule-num">{r.num}</div>
                <div className="qsd8-rule-title">{r.title}</div>
                <div className="qsd8-rule-desc">{r.desc}</div>
              </div>
            ))}
          </div>
        </Win>

        {/* ══ REELS ════════════════════════════════════════════════ */}
        <Win name="MATILHA-ONLINE.MOV" inverted className="qsd8-reels-win">
          <div className="portal-page skin-2 qsd8-reels-host">
            <ReelsSection
              title="Matilha online"
              subtitle="Conteúdo real dos criadores que já toparam. Toca pra ver."
              seeAllUrl="https://www.instagram.com/comidadedragao"
              seeAllLabel="Mais no @comidadedragao →"
            />
          </div>
        </Win>

        {/* ══ CTA — DOWNLOADING 99% ════════════════════════════════ */}
        <Win name="DOWNLOADING — VAGAS-MATILHA.EXE" inverted className="qsd8-cta-win">
          <h2 className="qsd8-cta-title">Bora <span>fazer junto?</span></h2>
          <p className="qsd8-cta-sub">
            Se chegou até aqui e fez sentido, o próximo passo é simples —
            se cadastra no Inflowz e a gente entra em contato.
          </p>
          <div className="qsd8-eta" style={{ textAlign: "center" }}>VAGAS-MATILHA.EXE … 99% — FALTA SÓ VOCÊ</div>
          <ProgressBar total={16} cta />
          <div className="qsd8-btnrow" style={{ justifyContent: "center", marginTop: 22 }}>
            <a href={INFLOWZ_URL} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero ser parceiro ↗</a>
          </div>
          <p className="qsd8-cta-note">Dúvidas? Fala com a Luana: (24) 98163-4847</p>
        </Win>

        {/* ══ FOOTER ═══════════════════════════════════════════════ */}
        <footer className="qsd8-footer">
          <DragonLogo className="qsd8-footer-logo" />
          <nav className="qsd8-footer-nav">
            <Link to="/portal">Portal</Link>
            <Link to="/produtos">Produtos</Link>
            <Link to="/biblioteca">Biblioteca</Link>
            <Link to="/imprensa">Imprensa</Link>
            <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.youtube.com/@comidadedragao" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
            <a href="mailto:somos@letsfly.com.br">Contato</a>
          </nav>
          <div className="qsd8-footer-tag">Nojento é o desperdício.</div>
        </footer>
      </div>
    </div>
  );
};

export default QueroSerDragao;
