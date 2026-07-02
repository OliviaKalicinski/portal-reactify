import { useState, type ReactNode } from "react";
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
type DeskItem = { img: string; label: string; href?: string; ext?: boolean; egg?: boolean };
/* mesmo conjunto de ícones nas 3 LPs (esquerda, 2 colunas) */
const DESK: DeskItem[] = [
  { img: "bsf.png", label: "LARVA.BSF", href: "/ciencia" },
  { img: "original-real.png", label: "ORIGINAL", href: "/original" },
  { img: "paw2.png", label: "MATILHA", href: "/quero-ser-dragao" },
  { img: "dog.png", label: "MEU-PET", href: "https://www.comidadedragao.com.br/blogs/news", ext: true },
  { img: "stomach.png", label: "88.9%", href: "/assets/pdfs/artigos-cientificos/bsf-in-vivo-vitro-digestibility-dog-food.pdf", ext: true },
  { img: "shield.png", label: "ALERGIA", href: "/alergia" },
  { img: "earth.png", label: "PLANETA", href: "https://www.comidadedragao.com.br/blogs/news", ext: true },
  { img: "crown.png", label: "PRODUTOS", href: "/produtos" },
  { img: "trash.png", label: "LIXEIRA", egg: true },
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

const DeskCol = ({ items, side, onEgg }: { items: DeskItem[]; side: "left" | "right"; onEgg: () => void }) => (
  <div className={`qsd8-desk-icons ${side}`}>
    {items.map((it, i) => {
      const inner = <><img src={`${ICON}/${it.img}`} alt="" /><span>{it.label}</span></>;
      if (it.egg) return <button type="button" className="qsd8-icon" key={i} onClick={onEgg} title="???" style={{ background: "none", border: "none", padding: 0, font: "inherit" }}>{inner}</button>;
      return it.ext
        ? <a className="qsd8-icon" key={i} href={it.href} target="_blank" rel="noopener noreferrer">{inner}</a>
        : <Link className="qsd8-icon" key={i} to={it.href!}>{inner}</Link>;
    })}
  </div>
);

/* easter egg da lixeira — reaproveitado nas 3 LPs */
const TrashEgg = ({ onClose }: { onClose: () => void }) => (
  <div className="qsd8-egg-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="qsd8-win" style={{ maxWidth: 400, position: "relative" }}>
      <div className="qsd8-titlebar">
        <span className="qsd8-tb-name">PRESENTE.EXE</span>
        <span className="qsd8-tb-stripes" aria-hidden="true" />
      </div>
      <button onClick={onClose} aria-label="Fechar" style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, border: "2px solid var(--ink)", background: "var(--lime)", color: "var(--ink)", cursor: "pointer", fontFamily: '"Press Start 2P", monospace', fontSize: 11 }}>×</button>
      <div className="qsd8-win-body" style={{ textAlign: "center" }}>
        <img src={`${ICON}/gift.png`} alt="" style={{ width: 72, margin: "0 auto 12px", display: "block", imageRendering: "pixelated" }} />
        <h3 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 11, color: "var(--lime)", margin: "0 0 12px", lineHeight: 1.5 }}>🗑️ VOCÊ VIU OURO NO LIXO</h3>
        <p style={{ fontSize: 16, margin: "0 0 14px" }}>A gente transforma resíduo orgânico em proteína de alta qualidade. Olho de Dragão, o seu 🐉. Toma um presente — <strong>frete grátis</strong> na loja:</p>
        <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 15, border: "3px dashed var(--lime)", padding: 12, margin: "0 0 16px", letterSpacing: ".1em" }}>VOOLIVRE</div>
        <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="qsd8-btn">Ir à loja →</a>
      </div>
    </section>
  </div>
);

const STATS = [
  { num: "88,9%", label: "Digestibilidade" },
  { num: "83%",   label: "Menos carbono" },
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
  const [egg, setEgg] = useState(false);
  return (
    <div className="qsd8">
      {egg && <TrashEgg onClose={() => setEgg(false)} />}
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

      <DeskCol items={DESK} side="left" onEgg={() => setEgg(true)} />

      <div className="qsd8-wrap">
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
                <img className="cf-check" src={`${ICON}/check.png`} alt="" />
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
