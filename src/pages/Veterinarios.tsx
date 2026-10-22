import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import ReelsSection from "@/components/ReelsSection";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms } from "@/lib/utm";
import { formatPhoneBR, isValidPhoneBR } from "@/lib/phone";
import { submitVetLead, type AtendimentoVet } from "@/lib/vetLead";
import "./Portal.css";
import "./Parceiros.css";

/* ──────────────────────────────────────────────────────────────
   VETERINÁRIOS — espelho da /quero-ser-dragao com olhar de vet.
   22/10/2026: o vet ganhou porta própria. O cadastro deixou de ir
   pra Inflowz (onde era avaliado como creator e reprovado) e cai no
   dash pelo formulário desta página (lib/vetLead.ts). Benefícios
   seguem os mesmos (amostras, cupom, comissão, treinamento).
────────────────────────────────────────────────────────────── */

const MARQUEE_TOP = [
  "VETERINÁRIO PARCEIRO",
  "COMISSÃO POR INDICAÇÃO",
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

// 22/10/2026: saíram "83% menos carbono" (só existia em doc arquivado) e
// "100% feito no RJ" (o Rango é fabricado em SP). 88,9% = digestibilidade da
// proteína em cães (Produtos - decisões e claims).
const STATS = [
  { num: "88,9%", label: "Digestibilidade" },
  { num: "6",     label: "Produtos na linha" },
  { num: "MAPA",  label: "Biofábrica registrada" },
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
    title: "Cadastro e análise",
    desc: "Você se cadastra aqui embaixo, a gente analisa e fala com você pelo WhatsApp pra combinar amostras, cupom e comissão.",
  },
  {
    num: "04",
    title: "Comunicação aberta",
    desc: "Dúvida técnica, problema com um paciente ou logística? Nos avise antes. A gente prefere resolver junto.",
  },
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
      <button type="submit" className="parceiros-btn-primary vet-form-botao" disabled={status === "sending"}>
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

const Veterinarios = () => {
  useEffect(() => { captureEntryUtms(); }, []);
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
                A gente faz <strong>alimento e suplemento pra pet com proteína de inseto BSF</strong> —
                nutritivo, com proteína hipoalergênica e sustentável. Se você acredita em nutrição diferente e quer
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
            <button type="button" onClick={irProCadastro} className="parceiros-btn-primary">
              Quero ser vet parceiro ↓
            </button>
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
          deixa seu cadastro e a gente entra em contato.
        </p>
        <div id="cadastro-vet">
          <CadastroVet />
        </div>
        <p className="parceiros-cta-final-note">Dúvidas? Escreve pra somos@letsfly.com.br</p>
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
