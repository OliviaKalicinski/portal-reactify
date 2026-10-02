import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import ReelsSection from "@/components/ReelsSection";
import { VIDEOS } from "@/components/VideosVencedores";
import PageMeta from "@/components/PageMeta";
import "./QueroSerDragao.css";
import "./Matilha.css";
import "./ParceirosJanelas.css";

const INFLOWZ_URL = "https://app.inflowz.io/signup/comida-de-dragao";
const ICON = "/assets/pixel-icons";

const MARQUEE_TOP = [
  "COMISSAO DE ATE 18%", "PRODUTO A CADA VIDEO", "CUPOM EXCLUSIVO", "SEM EXCLUSIVIDADE",
  "VOCE POSTA DO SEU JEITO", "DO RESIDUO A PROTEINA", "BIOFABRICA REGISTRADA NO MAPA",
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

const MANUAL_DRIVE_URL = "https://drive.google.com/drive/u/0/folders/1kDnH3JYqgpU9l7nHhRgLybFnN58NBhyY";
const MARKETING_DRIVE_URL = "https://drive.google.com/drive/u/0/folders/1DiTxfcg8ybCkv-1zhwaiThR8pfnijCpJ";

const STATS = [
  { num: "83%",   label: "Menos carbono" },
  { num: "88,9%", label: "Digestibilidade" },
  { num: "40%",   label: "Proteína, no mínimo" },
];

/* vídeos de creator vencedores (planilha "Originais de creator"), do maior lucro por venda ao menor */
const VENCEDORES = [
  VIDEOS.sushijullie, VIDEOS.carla, VIDEOS.pipo, VIDEOS.mytribesete,
  VIDEOS.gabi, VIDEOS.omeninomerlin, VIDEOS.vitydalmata, VIDEOS.pitanga,
];

const STEPS = [
  { num: "01", title: "Faça seu cadastro", desc: "Conta gratuita no Inflowz, campanha \"Influenciadores\", e crie seu cupom. Menos de 5 minutos." },
  { num: "02", title: "Receba o kit", desc: "O produto é presente. No primeiro envio você adianta só o frete (R$ 12), que volta com a sua comissão na primeira venda." },
  { num: "03", title: "Poste do seu jeito", desc: "Sem script. Seu cupom dá 10% de desconto e você ganha de 10% a 18% por venda, conforme a sua faixa." },
  { num: "04", title: "Gravou, ganhou o próximo", desc: "Cada vídeo que conta libera um novo envio. Comissão em tempo real, pagamento automático." },
];

const FAIXAS = [
  { nome: "Bronze", comissao: "10%",   vendas: "sem mínimo", videos: "sem mínimo", frete: "você adianta R$ 12" },
  { nome: "Prata",  comissao: "12,5%", vendas: "R$ 50",      videos: "3",          frete: "por nossa conta" },
  { nome: "Ouro",   comissao: "18%",   vendas: "R$ 250",     videos: "2",          frete: "por nossa conta" },
];

const REQUISITOS = [
  { title: "5.000 seguidores ou mais", desc: "No Instagram ou TikTok. Engajamento real vale mais que número grande." },
  { title: "Ter e amar um pet", desc: "Cão, gato, réptil ou exótico." },
  { title: "Conteúdo autêntico", desc: "A reação real do seu pet, sem script." },
  { title: "Colab com @comidadedragao", desc: "Feed e reels em colab, para aparecerem também no nosso perfil." },
];

const REGRAS = [
  { ok: true,  title: "Dois stories: orgânico + cupom", desc: "O orgânico a gente reposta; o do cupom converte seus seguidores." },
  { ok: true,  title: "Feed e reels em colab", desc: "Com @comidadedragao, para ampliarmos seu alcance." },
  { ok: true,  title: "Capa oficial no feed", desc: "Está nos templates do Manual do Criador." },
  { ok: false, title: "Story com cupom não é repostado", desc: "Evita competição entre parceiros. Mas poste: é ele que converte." },
  { ok: false, title: "Sem promessas de saúde", desc: "Nada de \"cura\", \"trata\" ou \"resolve\". Fale da experiência real." },
];

const Marquee = () => {
  const doubled = [...MARQUEE_TOP, ...MARQUEE_TOP];
  return (
    <div className="qsd8-marquee">
      <div className="qsd8-marquee-track">{doubled.map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
};

const Parceiros = () => {
  const [egg, setEgg] = useState(false);
  return (
    <div className="qsd8 cf-pink">
      {egg && <TrashEgg onClose={() => setEgg(false)} />}
      <PageMeta
        title="Parceiros · Comida de Dragão"
        description="Seja creator da Comida de Dragão. Comissão de até 18%, produto a cada vídeo, cupom exclusivo e liberdade criativa. Entra na matilha."
        image="/assets/images/poster-punk-converte.webp"
      />

      {/* filtro duotone (ink -> rosa) aplicado aos PNGs de pixel */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="qsd8-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.055 1.0" />
            <feFuncG type="table" tableValues="0.055 0.176" />
            <feFuncB type="table" tableValues="0.055 0.47" />
          </feComponentTransfer>
        </filter>
      </svg>

      <img className="qsd8-bg" src="/assets/bg-clouds.jpg" alt="" aria-hidden="true" />

      <DeskCol items={DESK} side="left" onEgg={() => setEgg(true)} />

      <div className="qsd8-wrap">
        {/* ══ HERO ═════════════════════════════════════════════════ */}
        <Win name="ENTRA-NA-MATILHA.EXE" mac className="qsd8-hero-win">
          <DragonLogo className="qsd8-hero-logo" />
          <div className="qsd8-eyebrow">Comida de Dragão — Parceiros</div>
          <h1 className="qsd8-title">Entra na <span>matilha</span></h1>
          <p className="qsd8-sub">
            Produto a cada vídeo, cupom exclusivo e comissão por venda — com a marca brasileira de
            proteína de inseto BSF para pets, produzida aqui no RJ.
          </p>
          <div className="qsd8-btnrow">
            <a href={INFLOWZ_URL} target="_blank" rel="noopener noreferrer" className="qsd8-btn">
              <span className="qsd8-blink">▶</span> Quero ser parceiro
            </a>
            <Link to="/portal" className="qsd8-btn ghost">Voltar</Link>
          </div>
          <p className="qsd8-note">Cadastro gratuito · Sem exclusividade · Você posta do seu jeito</p>
        </Win>

        {/* ══ REELS — prova viva logo no começo ════════════════════ */}
        <Win name="MATILHA-ONLINE.MOV" inverted className="qsd8-reels-win">
          <div className="portal-page skin-2 qsd8-reels-host">
            <ReelsSection
              reels={VENCEDORES}
              title="Creators na matilha"
              subtitle="Os vídeos de creator que mais venderam. Toca pra ver."
              seeAllUrl="https://www.instagram.com/comidadedragao"
              seeAllLabel="Mais no @comidadedragao →"
            />
          </div>
        </Win>

        {/* ══ QUEM É A MARCA ═══════════════════════════════════════ */}
        <Win name="ANTES-DE-TUDO.TXT">
          <div className="qsd8-eyebrow">// antes de tudo</div>
          <h2 className="qsd8-h2">Queremos fazer <span>barulho</span></h2>
          <p className="qsd8-sub">
            A <strong>Comida de Dragão</strong> transforma inseto BSF em nutrição pra pets, com
            produção própria no RJ. Pets são o começo da revolução do inseto no Brasil.{" "}
            <strong>É aqui que você entra.</strong>
          </p>
          <div className="qsd8-loot pj-stats">
            {STATS.map((s, i) => (
              <div className="qsd8-card" key={i} style={{ textAlign: "center" }}>
                <div className="qsd8-card-title" style={{ fontSize: 20, marginBottom: 8 }}>{s.num}</div>
                <div className="qsd8-card-desc" style={{ fontSize: 15, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Win>

        {/* ══ COMO FUNCIONA ════════════════════════════════════════ */}
        <Win name="COMO-FUNCIONA.BAT" inverted>
          <div className="qsd8-eyebrow" style={{ color: "var(--lime)" }}>// como funciona</div>
          <h2 className="qsd8-h2">É simples <span>assim</span></h2>
          <div className="qsd8-rules">
            {STEPS.map((s, i) => (
              <div className="qsd8-rule" key={i}>
                <div className="qsd8-rule-num">{s.num}</div>
                <div className="qsd8-rule-title">{s.title}</div>
                <div className="qsd8-rule-desc">{s.desc}</div>
              </div>
            ))}
          </div>
          <p className="qsd8-note" style={{ color: "var(--paper)" }}>
            A gente reposta seu conteúdo orgânico · Suporte direto com a Luana
          </p>
        </Win>

        {/* ══ FAIXAS DA MATILHA ════════════════════════════════════ */}
        <Win name="AS-FAIXAS.TXT">
          <div className="qsd8-eyebrow">// quanto mais grava e vende, mais ganha</div>
          <h2 className="qsd8-h2">Gravou e vendeu, <span>subiu</span></h2>
          <table className="mat-faixas">
            <thead>
              <tr>
                <th scope="col">Faixa</th>
                <th scope="col">Vendas no mês</th>
                <th scope="col">Vídeos em 3 meses</th>
                <th scope="col">Frete do produto</th>
              </tr>
            </thead>
            <tbody>
              {FAIXAS.map((f) => (
                <tr key={f.nome}>
                  <th scope="row">
                    <span className="mat-faixas-nome">{f.nome}</span>
                    <span className="mat-faixas-pct">{f.comissao}</span>
                  </th>
                  <td>{f.vendas}</td>
                  <td>{f.videos}</td>
                  <td>{f.frete}</td>
                </tr>
              ))}
            </tbody>
          </table>
<ul className="mat-faixas-notas">
            <li>Quem entra agora começa na <strong>Prata</strong>. Bateu a meta do mês, sobe; só desce uma faixa por vez.</li>
            <li><strong>Vídeo que conta:</strong> o que tem o @comidadedragao marcado ou em colab.</li>
            <li>O frete que você adianta volta junto com a comissão.</li>
          </ul>
          <div className="qsd8-btnrow" style={{ marginTop: 20 }}>
            <a href={INFLOWZ_URL} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero ser parceiro ↗</a>
          </div>
        </Win>

        {/* ══ PRÉ-REQUISITOS ═══════════════════════════════════════ */}
        <Win name="PRE-REQUISITOS.SYS">
          <div className="qsd8-eyebrow">// pré-requisitos</div>
          <h2 className="qsd8-h2">O que precisamos <span>de você</span></h2>
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

        {/* ══ PRAZO + REGRAS ═══════════════════════════════════════ */}
        <Win name="COMO-PUBLICAR.BAT" inverted>
          <div className="qsd8-eyebrow" style={{ color: "var(--lime)" }}>// regras</div>
          <h2 className="qsd8-h2">Como <span>publicar</span></h2>
          <p className="qsd8-sub" style={{ color: "var(--paper)" }}>
            <strong>14 dias para a primeira publicação</strong>, a partir da entrega. Imprevisto? É só avisar.
          </p>
          <div className="qsd8-rules">
            {REGRAS.map((r, i) => (
              <div className="qsd8-rule" key={i}>
                <div className={`qsd8-rule-num pj-simnao${r.ok ? "" : " pj-nao"}`}>{r.ok ? "SIM" : "NÃO"}</div>
                <div className="qsd8-rule-title">{r.title}</div>
                <div className="qsd8-rule-desc">{r.desc}</div>
              </div>
            ))}
          </div>
        </Win>

        {/* ══ MATERIAIS ════════════════════════════════════════════ */}
        <Win name="MATERIAIS.ZIP">
          <div className="qsd8-eyebrow">// materiais</div>
          <h2 className="qsd8-h2">Tudo pronto pra <span>criar</span></h2>
          <div className="qsd8-loot">
            <a href={MANUAL_DRIVE_URL} target="_blank" rel="noopener noreferrer" className="qsd8-card qsd8-reel-card">
              <img className="qsd8-card-ico qsd8-duo" src={`${ICON}/check.png`} alt="" />
              <div className="qsd8-card-title">Manual do Criador</div>
              <div className="qsd8-card-desc">Templates, capas oficiais, fotos dos produtos e tabela nutricional. Abrir ↗</div>
            </a>
            <a href={MARKETING_DRIVE_URL} target="_blank" rel="noopener noreferrer" className="qsd8-card qsd8-reel-card">
              <img className="qsd8-card-ico qsd8-duo" src={`${ICON}/gift.png`} alt="" />
              <div className="qsd8-card-title">Material de marketing</div>
              <div className="qsd8-card-desc">Logo, fotos dos produtos e muito mais. Abrir ↗</div>
            </a>
          </div>
        </Win>

        {/* ══ CTA FINAL ════════════════════════════════════════════ */}
        <Win name="FALTA-SO-VOCE.EXE" inverted className="qsd8-cta-win">
          <h2 className="qsd8-cta-title">Pronto para <span>fazer parte?</span></h2>
          <p className="qsd8-cta-sub">
            Cadastro gratuito. Sem exclusividade. Você posta do seu jeito e ganha por cada venda.
          </p>
          <div className="qsd8-btnrow" style={{ justifyContent: "center", marginTop: 22 }}>
            <a href={INFLOWZ_URL} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Fazer meu cadastro ↗</a>
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

export default Parceiros;
