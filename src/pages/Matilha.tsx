import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./QueroSerDragao.css";
import "./Matilha.css";

const INFLOWZ_URL = "https://app.inflowz.io";
const ICON = "/assets/pixel-icons";

const MARQUEE_TOP = [
  "BEM-VINDO A MATILHA", "COMIDA DE DRAGAO", "VOCE E DA REVOLUCAO",
  "PROTEINA DE INSETO", "NOJENTO E O DESPERDICIO", "CRIA DO SEU JEITO",
];

/* ── ícones de desktop (laterais) ── */
type DeskItem = { img: string; label: string; href?: string; ext?: boolean; egg?: boolean };
/* mesmo conjunto das 3 LPs (esquerda, 2 colunas) */
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

/* easter egg da lixeira (igual às outras LPs) */
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

const Marquee = () => {
  const doubled = [...MARQUEE_TOP, ...MARQUEE_TOP];
  return (
    <div className="qsd8-marquee">
      <div className="qsd8-marquee-track">{doubled.map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
};

/* ── passo a passo Inflowz ── */
const PASSOS = [
  {
    num: "01",
    title: "Faça login pela primeira vez",
    desc: (
      <>
        Acesse <strong>app.inflowz.io</strong> (no celular ou no navegador). Na tela de
        login, toque em <strong>"Primeiro acesso ou esqueceu a senha?"</strong> e crie
        sua senha com o e-mail cadastrado.
      </>
    ),
  },
  {
    num: "02",
    title: "Escolha sua campanha e crie o cupom",
    desc: (
      <>
        No menu (<img src={`${ICON}/menu.png`} alt="menu" style={{ width: 16, height: 16, objectFit: "contain", verticalAlign: "middle", imageRendering: "pixelated" }} /> no app / lateral no navegador) vá em <strong>Campanhas</strong>.
        Escolha <strong>apenas uma</strong> campanha que combina com o seu perfil
        (Influenciadores, Veterinários ou Canis) e toque em <strong>Criar cupom</strong>.
        O cupom é o código que você vai divulgar — é por ele que suas vendas são
        registradas e você recebe. Não precisa se cadastrar em todas as campanhas.
      </>
    ),
  },
  {
    num: "03",
    title: "Solicite seu produto",
    desc: (
      <>
        Menu → <strong>Amostras</strong> → <strong>Solicitar amostra</strong>. Você pode
        pedir <strong>1 produto por mês</strong>. Escolha o que mais combina com o pet do
        seu canal.
      </>
    ),
  },
  {
    num: "04",
    title: "Acompanhe suas vendas",
    desc: (
      <>
        Toque em <strong>Vendas</strong> (barra inferior no app / menu lateral no
        navegador). Você vê o <strong>GMV</strong> do mês atual, mês anterior e o ranking
        de criadores. Atualizado diariamente às 2h.
      </>
    ),
  },
];

/* ── produtos ── */
const PRODUTOS = [
  {
    nome: "Original — Comida de Dragão",
    pet: [{ ico: "dog", label: "Cães" }, { ico: "cat", label: "Gatos" }, { ico: "reptile", label: "Répteis" }, { ico: "bird", label: "Aves" }],
    specs: ["Proteína: no mínimo 45%", "Digestibilidade: 88,9%", "1 ingrediente único · 90g"],
    ideal: "Petisco diário, treino, pets com alergias, pets seletivos, viagens e enriquecimento ambiental.",
  },
  {
    nome: "Suplemento Proteico Integral",
    pet: [{ ico: "dog", label: "Cães" }],
    specs: ["Proteína: no mínimo 45%", "4.350 kcal/kg · 180g em pó", "Farinha BSF + cúrcuma + spirulina"],
    ideal: "Boost proteico diário, cães ativos, filhotes e gestação/lactação. Acompanha dosador.",
  },
  {
    nome: "Suplemento Felino — Rico em Taurina",
    pet: [{ ico: "cat", label: "Só gatos" }],
    specs: ["Proteína: no mínimo 40%", "1.520 mg/kg de taurina · 180g", "Farinha BSF + cúrcuma + spirulina + taurina"],
    ideal: "Boost proteico diário, gatos cardiopatas, ração vegetal/caseira e gestação/lactação felina.",
  },
  {
    nome: "GRUB — Répteis e Anfíbios",
    pet: [{ ico: "reptile", label: "Répteis" }, { ico: "frog", label: "Anfíbios" }],
    specs: ["Proteína: no mínimo 47%", "Cálcio:Fósforo 2,5:1 · 120g", "Pó pra gel (BSF + grilo + tenébrio)"],
    ideal: "Leopard gecko, dragão-barbudo, sapo-pacman e mais. Prepara como gel (mais firme) ou papinha (mais cremosa).",
  },
];

/* ── reels ── */
const REELS = [
  { url: "https://www.instagram.com/reel/DY-iMx4Bgmr/", label: "Primeira reação" },
  { url: "https://www.instagram.com/reel/DYu1WrNMDmZ/", label: "O antes e depois" },
  { url: "https://www.instagram.com/reel/DZGQlfoyo-i/", label: "Unboxing do kit" },
  { url: "https://www.instagram.com/reel/DZNcpmRgex5/", label: "Proteína de inseto" },
  { url: "https://www.instagram.com/reel/DZOIi2jPJ2l/", label: "Cão aceita larva?" },
  { url: "https://www.instagram.com/reel/DZfiLevxvuZ/", label: "Por que faz sentido?" },
  { url: "https://www.instagram.com/reel/DZvo1s8swvY/", label: "O que é a larva BSF?" },
];

const Matilha = () => {
  const [egg, setEgg] = useState(false);
  return (
    <div className="qsd8 cf-amber">
      {egg && <TrashEgg onClose={() => setEgg(false)} />}
      <PageMeta
        title="Bem-vindo à Matilha — Comida de Dragão"
        description="Onboarding de criadores Comida de Dragão. Do primeiro acesso ao Inflowz até a ideia do primeiro post. Você é da matilha agora."
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
        {/* ══ HERO — boas-vindas ═══════════════════════════════════ */}
        <Win name="BEM-VINDO-A-MATILHA.EXE" mac className="qsd8-hero-win">
          <DragonLogo className="qsd8-hero-logo" />
          <div className="qsd8-eyebrow">// você é da matilha agora</div>
          <h1 className="qsd8-title">Bem-vindo à matilha, <span>criador</span></h1>
          <p className="qsd8-sub">
            Aqui está tudo que você precisa pra começar — do primeiro acesso à
            plataforma até a ideia do primeiro post. Você é da revolução da proteína
            de inseto agora.
          </p>
          <div className="qsd8-btnrow">
            <a href={INFLOWZ_URL} target="_blank" rel="noopener noreferrer" className="qsd8-btn">
              <span className="qsd8-blink">▶</span> Acessar Inflowz
            </a>
            <Link to="/portal" className="qsd8-btn ghost">Voltar</Link>
          </div>
          <p className="qsd8-note">Cria do seu jeito · Sem script · Nojento é o desperdício</p>
        </Win>

        {/* ══ ENVIO / KIT ══════════════════════════════════════════ */}
        <Win name="COMO-FUNCIONA-O-ENVIO.SYS" inverted>
          <div className="qsd8-eyebrow" style={{ color: "var(--lime)" }}>// como funciona o envio</div>
          <h2 className="qsd8-h2">Seu primeiro kit <span>já está a caminho</span></h2>
          <p className="qsd8-sub" style={{ color: "var(--paper)" }}>
            O primeiro envio é por nossa conta — você não precisa fazer nada agora. A
            partir do <strong>mês seguinte</strong>, o produto não chega automaticamente:
            entre no Inflowz, vá em <strong>Amostras → Solicitar amostra</strong> e escolha
            o que quer receber. É rápido, mas precisa ser feito <strong>todo mês</strong>.
          </p>
          <div className="qsd8-btnrow">
            <a href={INFLOWZ_URL} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Acessar Inflowz →</a>
          </div>
        </Win>

        {/* ══ PASSO A PASSO INFLOWZ ════════════════════════════════ */}
        <Win name="COMECANDO-NO-INFLOWZ.BAT">
          <div className="qsd8-eyebrow">// passo a passo</div>
          <h2 className="qsd8-h2">Começando no <span>Inflowz</span></h2>
          <div className="qsd8-rules">
            {PASSOS.map((p, i) => (
              <div className="qsd8-rule" key={i}>
                <div className="qsd8-rule-num">{p.num}</div>
                <div className="qsd8-rule-title">{p.title}</div>
                <div className="qsd8-rule-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </Win>

        {/* ══ POR QUE O CUPOM IMPORTA ══════════════════════════════ */}
        <Win name="POR-QUE-O-CUPOM-IMPORTA.ERR" className="qsd8-error-win">
          <div className="qsd8-error-body">
            <img className="qsd8-duo" src={`${ICON}/love.png`} alt="" />
            <p>
              <strong>CUPOM_OBRIGATORIO.MSG</strong>
              Quando alguém compra usando o seu código, a venda é registrada no seu nome e
              você recebe a comissão. Sem o cupom criado, não tem como rastrear — a venda
              some e você não recebe nada. Depois de criar, coloque seu cupom em todo
              conteúdo que fizer sobre a Comida de Dragão. [OK]
            </p>
          </div>
        </Win>

        {/* ══ PRODUTOS ═════════════════════════════════════════════ */}
        <Win name="OS-PRODUTOS.EXE" inverted>
          <div className="qsd8-eyebrow" style={{ color: "var(--lime)" }}>// o que você vai divulgar</div>
          <h2 className="qsd8-h2">Os <span>produtos</span></h2>
          <div className="qsd8-loot">
            {PRODUTOS.map((p, i) => (
              <div className="qsd8-card" key={i}>
                <div className="qsd8-card-title">{p.nome}</div>
                <div className="qsd8-card-desc" style={{ marginBottom: 8, fontSize: 13, textTransform: "uppercase", letterSpacing: ".04em", display: "flex", flexWrap: "wrap", gap: "4px 14px", alignItems: "center" }}>
                  {p.pet.map((x, k) => (
                    <span key={k} style={{ display: "inline-flex", alignItems: "center" }}>
                      <img className="qsd8-pet-ico" src={`${ICON}/${x.ico}.png`} alt="" />{x.label}
                    </span>
                  ))}
                </div>
                <div className="qsd8-card-desc" style={{ marginBottom: 8 }}>
                  {p.specs.map((s, j) => (
                    <div key={j} style={{ marginBottom: 3 }}>▸ {s}</div>
                  ))}
                </div>
                <div className="qsd8-card-desc" style={{ fontSize: 13.5 }}><strong>Ideal para:</strong> {p.ideal}</div>
              </div>
            ))}
          </div>
        </Win>

        {/* ══ REELS / IDEIAS DE VÍDEO ══════════════════════════════ */}
        <Win name="VIDEOS-DE-EXEMPLO.MOV">
          <div className="qsd8-eyebrow">// inspire-se</div>
          <h2 className="qsd8-h2">Ideias de <span>vídeo</span></h2>
          <div className="qsd8-loot qsd8-reels-grid">
            {REELS.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="qsd8-card qsd8-reel-card"
              >
                <div className="qsd8-reel-play" aria-hidden="true"><img src={`${ICON}/play.png`} alt="" style={{ width: 20, height: 20, objectFit: "contain", imageRendering: "pixelated" }} /></div>
                <div className="qsd8-card-title" style={{ fontSize: 10, marginBottom: 6 }}>{r.label}</div>
                <div className="qsd8-card-desc" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em" }}>Ver no Instagram ↗</div>
              </a>
            ))}
          </div>
        </Win>

        {/* ══ MATERIAIS / LINKS ════════════════════════════════════ */}
        <Win name="MATERIAIS.ZIP">
          <div className="qsd8-eyebrow">// tudo pra criar</div>
          <h2 className="qsd8-h2">Seus <span>materiais</span></h2>
          <div className="qsd8-loot">
            <a href="https://www.canva.com/design/DAG6dSqYXRQ/sP8AFE4kewSeztzNm7hbPg/edit" target="_blank" rel="noopener noreferrer" className="qsd8-card qsd8-reel-card">
              <img className="qsd8-card-ico" src={`${ICON}/star8.png`} alt="" />
              <div className="qsd8-card-title">Templates do Canva</div>
              <div className="qsd8-card-desc">Modelos prontos pra editar do seu jeito. Abrir ↗</div>
            </a>
            <a href="https://drive.google.com/drive/u/0/folders/1kDnH3JYqgpU9l7nHhRgLybFnN58NBhyY" target="_blank" rel="noopener noreferrer" className="qsd8-card qsd8-reel-card">
              <img className="qsd8-card-ico" src={`${ICON}/check.png`} alt="" />
              <div className="qsd8-card-title">Manual do Criador</div>
              <div className="qsd8-card-desc">Templates, capas oficiais, dados nutricionais e tudo que precisa pra criar conteúdo incrível. Abrir ↗</div>
            </a>
            <a href="https://drive.google.com/drive/u/0/folders/1DiTxfcg8ybCkv-1zhwaiThR8pfnijCpJ" target="_blank" rel="noopener noreferrer" className="qsd8-card qsd8-reel-card">
              <img className="qsd8-card-ico" src={`${ICON}/gift.png`} alt="" />
              <div className="qsd8-card-title">Material de marketing</div>
              <div className="qsd8-card-desc">Logo, fotos dos produtos e muito mais. Abrir ↗</div>
            </a>
          </div>
        </Win>

        {/* ══ CTA FINAL ════════════════════════════════════════════ */}
        <Win name="AGORA-E-SO-CRIAR.EXE" inverted className="qsd8-cta-win">
          <h2 className="qsd8-cta-title">Agora é só <span>criar</span></h2>
          <p className="qsd8-cta-sub">
            O Dragão cuida do resto. Entra no Inflowz, cria seu cupom, pede seu produto
            e posta do seu jeito.
          </p>
          <div className="qsd8-btnrow" style={{ justifyContent: "center", marginTop: 22 }}>
            <a href={INFLOWZ_URL} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Acessar Inflowz ↗</a>
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
            <a href="mailto:comidadedragao@letsfly.com.br">Contato</a>
          </nav>
          <div className="qsd8-footer-tag">Nojento é o desperdício.</div>
        </footer>
      </div>
    </div>
  );
};

export default Matilha;
