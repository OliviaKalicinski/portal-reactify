import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import ReelsSection from "@/components/ReelsSection";
import { VIDEOS } from "@/components/VideosVencedores";
import PageMeta from "@/components/PageMeta";
import "./QueroSerDragao.css";
import "./Fofo.css";
import "./Veterinarios.css";
import { captureEntryUtms } from "@/lib/utm";
import { formatPhoneBR, isValidPhoneBR } from "@/lib/phone";
import { submitVetLead, type AtendimentoVet } from "@/lib/vetLead";

/* ──────────────────────────────────────────────────────────────
   VETERINÁRIOS — 22/10/2026: mesmo layout da /quero-ser-dragao
   (janelas retrô-OS, visual fofo verde), clonado dela.
   O cadastro é próprio (formulário abaixo, lib/vetLead.ts), não vai
   para a Inflowz: no dash, o gatilho R683/R685 cria o cadastro de vet.
────────────────────────────────────────────────────────────── */
const ICON = "/assets/pixel-icons";

const MARQUEE_TOP = [
  "VETERINARIO PARCEIRO", "COMISSAO POR INDICACAO", "AMOSTRAS PRA PACIENTES", "CUPOM EXCLUSIVO",
  "TREINAMENTO TECNICO", "SEM EXCLUSIVIDADE", "BIOFABRICA REGISTRADA NO MAPA",
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
        <p style={{ fontSize: 16, margin: "0 0 14px" }}>A gente transforma resíduo orgânico em proteína de alta qualidade. Olho de Dragão, o seu 🐉. Toma um presente: <strong>10% de desconto</strong> na loja, uma vez por pessoa:</p>
        <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 15, border: "3px dashed var(--lime)", padding: 12, margin: "0 0 16px", letterSpacing: ".1em" }}>LIXODEOURO</div>
        <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="qsd8-btn">Ir à loja →</a>
      </div>
    </section>
  </div>
);

/* vídeos de creator vencedores (planilha "Originais de creator"), do maior lucro por venda ao menor */
const VENCEDORES = [
  VIDEOS.sushijullie, VIDEOS.carla, VIDEOS.pipo, VIDEOS.mytribesete,
  VIDEOS.gabi, VIDEOS.omeninomerlin, VIDEOS.vitydalmata, VIDEOS.pitanga,
];

// 22/10/2026: sem "83% menos carbono" (só existia em doc arquivado) e sem
// "100% feito no RJ" (o Rango é fabricado em SP). 88,9% = digestibilidade da
// proteína em cães (Produtos - decisões e claims).
const STATS = [
  { num: "88,9%", label: "Digestibilidade" },
  { num: "6",     label: "Produtos na linha" },
  { num: "MAPA",  label: "Biofábrica registrada" },
];

const BENEFICIOS = [
  { img: "games.png",      title: "Amostras pra pacientes", desc: "A gente manda kits de amostras pra você entregar aos tutores na consulta. O paciente testa em casa, você acompanha o resultado." },
  { img: "love.png",       title: "Cupom exclusivo",        desc: "Você recebe um cupom personalizado pra repassar aos tutores. Desconto real, fácil de indicar dentro do atendimento." },
  { img: "crown.png",      title: "Comissão por indicação", desc: "Cada compra feita com seu cupom gera comissão direto pra você. Recomendação que faz sentido e ainda vira retorno." },
  { img: "stomach.png",    title: "Treinamento técnico",    desc: "Treinamentos sobre proteína de inseto BSF, fichas técnicas e a biblioteca científica pra embasar a sua recomendação." },
  { img: "heart-eyes.png", title: "Suporte direto",         desc: "Você fala com a gente pelo WhatsApp, sem chatbot e sem demora. Dúvida técnica ou logística, a gente resolve." },
];

const REQUISITOS = [
  { title: "CRMV ativo e em situação regular", desc: "A parceria é com profissionais habilitados: clínico geral ou especialista, todos são bem-vindos." },
  { title: "Atendimento a cães, gatos, répteis ou exóticos", desc: "Clínica, consultório, atendimento domiciliar ou hospital veterinário, todos contam." },
  { title: "Abertura pra nutrição diferente", desc: "Proteína de inseto ainda é novidade no Brasil. A gente precisa de vets que topam estudar o que foge do óbvio." },
  { title: "Recomendação honesta", desc: "Você só indica se fizer sentido pro paciente. Endosso de verdade vale mais que recomendação forçada." },
];

const REGRAS = [
  { num: "01", title: "Recomendação técnica", desc: "Indicação baseada no caso clínico, sem roteiro fixo. Você recomenda porque faz sentido, não por obrigação." },
  { num: "02", title: "Uso das amostras", desc: "As amostras são pra entregar aos tutores em consulta, sempre com orientação de uso. Sem revenda." },
  { num: "03", title: "Cadastro e análise", desc: "Você se cadastra aqui embaixo, a gente analisa e fala com você pelo WhatsApp pra combinar amostras, cupom e comissão." },
  { num: "04", title: "Comunicação aberta", desc: "Dúvida técnica, problema com um paciente ou logística? Nos avise antes. A gente prefere resolver junto." },
];

const ATENDIMENTOS: { id: AtendimentoVet; label: string }[] = [
  { id: "clinica", label: "Clínica ou consultório" },
  { id: "domiciliar", label: "Atendimento domiciliar" },
  { id: "hospital", label: "Hospital veterinário" },
  { id: "exoticos", label: "Exóticos e silvestres" },
  { id: "outro", label: "Outro" },
];

const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const irProCadastro = () =>
  document.getElementById("cadastro-vet")?.scrollIntoView({ behavior: "smooth", block: "start" });

const CadastroVet = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [crmv, setCrmv] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [atendimento, setAtendimento] = useState<AtendimentoVet[]>([]);
  const [instagram, setInstagram] = useState("");
  const [tentou, setTentou] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "erro">("idle");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const erros = {
    nome: nome.trim().length < 2,
    telefone: !isValidPhoneBR(telefone),
    email: !emailOk,
    crmv: crmv.trim().length < 3,
    uf: uf === "",
    cidade: cidade.trim().length < 2,
    atendimento: atendimento.length === 0,
  };
  const valido = !Object.values(erros).some(Boolean);

  const alternar = (id: AtendimentoVet) =>
    setAtendimento((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setTentou(true);
    if (!valido || status === "sending") return;
    setStatus("sending");
    const r = await submitVetLead({ name: nome, phone: telefone, email, crmv, uf, cidade, atendimento, instagram });
    // Revisão do Codex (22/10/2026): aqui o cadastro é o objetivo da página, então
    // "recebido" só aparece quando gravou. Se falhar, os campos ficam e a pessoa tenta de novo.
    setStatus(r.ok ? "done" : "erro");
  };

  if (status === "done") {
    return (
      <div className="vet-form-ok">
        <div className="vet-form-ok-titulo">Cadastro recebido 🐉</div>
        <p>
          Valeu, {nome.trim().split(" ")[0]}. A gente analisa e fala com você pelo WhatsApp
          pra combinar amostras, cupom e comissão.
        </p>
      </div>
    );
  }

  const erro = (campo: keyof typeof erros, texto: string) =>
    tentou && erros[campo] ? <span className="vet-form-erro">{texto}</span> : null;

  return (
    <form className="vet-form" onSubmit={enviar} noValidate>
      <label className="vet-campo">
        <span>Nome completo</span>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
        {erro("nome", "Escreve seu nome.")}
      </label>
      <label className="vet-campo">
        <span>WhatsApp</span>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="(21) 98765-4321"
          value={telefone}
          onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
          autoComplete="tel"
        />
        {erro("telefone", "Confere o número com DDD.")}
      </label>
      <label className="vet-campo">
        <span>E-mail</span>
        <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        {erro("email", "Esse e-mail parece incompleto.")}
      </label>
      <div className="vet-linha">
        <label className="vet-campo">
          <span>CRMV</span>
          <input type="text" placeholder="00000" value={crmv} onChange={(e) => setCrmv(e.target.value)} />
          {erro("crmv", "Informa o número do CRMV.")}
        </label>
        <label className="vet-campo vet-campo-uf">
          <span>UF</span>
          <select value={uf} onChange={(e) => setUf(e.target.value)}>
            <option value="">—</option>
            {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          {erro("uf", "Escolhe a UF.")}
        </label>
      </div>
      <label className="vet-campo">
        <span>Cidade onde atende</span>
        <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} autoComplete="address-level2" />
        {erro("cidade", "Escreve a cidade.")}
      </label>
      <div className="vet-campo">
        <span>Como você atende? <em>marque quantos quiser</em></span>
        <div className="vet-opcoes">
          {ATENDIMENTOS.map((a) => (
            <button
              type="button"
              key={a.id}
              className={`vet-opcao${atendimento.includes(a.id) ? " ativo" : ""}`}
              onClick={() => alternar(a.id)}
              aria-pressed={atendimento.includes(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
        {erro("atendimento", "Marca pelo menos um.")}
      </div>
      <label className="vet-campo">
        <span>Instagram <em>opcional</em></span>
        <input type="text" placeholder="@seuperfil" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
      </label>
      <button type="submit" className="qsd8-btn vet-form-botao" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Quero ser vet parceiro"}
      </button>
      {status === "erro" && (
        <p className="vet-form-erro-envio">
          Não conseguimos enviar agora. Tenta de novo em instantes ou escreve pra somos@letsfly.com.br.
        </p>
      )}
      <p className="vet-form-nota">Seus dados ficam só com a Comida de Dragão, pra gente falar com você sobre a parceria.</p>
    </form>
  );
};

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

const irProCadastroVet = () =>
  document.getElementById("cadastro-vet")?.scrollIntoView({ behavior: "smooth", block: "start" });

const Veterinarios = () => {
  const [egg, setEgg] = useState(false);
  useEffect(() => { captureEntryUtms(); }, []);
  return (
    <div className="qsd8 fofo fofo-verde">
      {egg && <TrashEgg onClose={() => setEgg(false)} />}
      <PageMeta
        title="Quero ser Vet Parceiro — Comida de Dragão"
        description="Seja veterinário parceiro da Comida de Dragão. Amostras pra pacientes, cupom exclusivo, comissão por indicação e treinamento técnico."
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
        <Win name="VET-PARCEIRO.EXE" mac className="qsd8-hero-win">
          <DragonLogo className="qsd8-hero-logo" />
          <div className="qsd8-eyebrow">Comida de Dragão — Parcerias com Veterinários</div>
          <h1 className="qsd8-title">Quero virar vet parceiro do <span>dragão</span></h1>
          <p className="qsd8-sub">
            Alimento e suplemento pra pet com proteína de inseto BSF: nutritivo, com proteína
            hipoalergênica e sustentável. Se você acredita em nutrição diferente e quer embasar
            isso no seu atendimento, bora fazer junto.
          </p>
          <div className="qsd8-btnrow">
            <button type="button" onClick={irProCadastroVet} className="qsd8-btn">
              <span className="qsd8-blink">▶</span> Quero ser vet parceiro
            </button>
            <Link to="/portal" className="qsd8-btn ghost">Voltar</Link>
          </div>
          <p className="qsd8-note">Cadastro gratuito · Sem exclusividade · Você recomenda do seu jeito</p>
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
              <strong>PACIENTE_ALERGICO.ERR</strong>
              Proteína nova, de inseto, pra quem não aguenta mais trocar de ração. Vire parceiro e mostre pros tutores. [OK]
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
              reels={VENCEDORES}
              title="Matilha online"
              subtitle="Conteúdo real de quem já está com a gente nessa. Toca pra ver."
              seeAllUrl="https://www.instagram.com/comidadedragao"
              seeAllLabel="Mais no @comidadedragao →"
            />
          </div>
        </Win>

        {/* ══ CTA — DOWNLOADING 99% ════════════════════════════════ */}
        <Win name="CADASTRO-VET.EXE" inverted className="qsd8-cta-win">
          <div id="cadastro-vet" />
          <h2 className="qsd8-cta-title">Bora <span>fazer junto?</span></h2>
          <p className="qsd8-cta-sub">
            Se chegou até aqui e fez sentido, o próximo passo é simples:
            deixa seu cadastro e a gente entra em contato.
          </p>
          <div className="qsd8-eta" style={{ textAlign: "center" }}>CADASTRO-VET.EXE … 99% — FALTA SÓ VOCÊ</div>
          <ProgressBar total={16} cta />
          <CadastroVet />
          <p className="qsd8-cta-note">Dúvidas? Escreve pra somos@letsfly.com.br</p>
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

export default Veterinarios;
