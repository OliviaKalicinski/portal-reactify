import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms } from "@/lib/utm";
import { formatPhoneBR, isValidPhoneBR } from "@/lib/phone";
import { submitLpLead } from "@/lib/lpLeads";
import { trackLead } from "@/lib/pixel";
import "./Portal.css";
import "./Rango.css";

/* ──────────────────────────────────────────────────────────────
   RANGO DO DRAGÃO — LISTA DE ESPERA DO DROP (07/10/2026; era 05/10, adiado pela Olivia em 05/10)

   Clonada da /webinar (28/09): mesma forma — inscrição na primeira dobra,
   data no topo, tela de "você está na lista" no lugar do formulário.
   O contato cai em `lp_leads` (dash-lets-fly), origem `espera_rango`, e é
   dessa lista que sai a pré-venda por tag do DROP (plano, Fase 5).

   NÃO VENDE NADA AINDA. Sem preço, sem cupom, sem link de checkout: o produto
   não existe na Shopify e o preço não está fechado. No dia do drop esta página
   vira a de venda (CTA → token Yampi via buildCheckoutUrl).

   COPY: só as frases aprovadas pela Olivia em 25/09
   (PROJETOS/Lançamento - Rango do Dragão/copy/2026-09-25-frases-aprovadas.md),
   sempre com a linha de apoio embaixo — "frase sozinha não se explica".

   ⚠️ NÃO ESCREVER AQUI, e o motivo:
   · "sem descongelar", "fica no armário", validade, tempo depois de aberto —
     dependem da ficha (trava de 25/09).
   · autoclavado / "sem conservante" — redação final passa pela Marcelle.
   · pele, pelo, intestino, alergia, digestão — claim de saúde, Camada B.
   · "lista curta de ingredientes" — o rótulo tem ~37 itens.
   · "hipoalergênico" — eixo é "Proteína Nova".
   · nome de concorrente.
   ────────────────────────────────────────────────────────────── */

const DROP_DATA = "07/10";
const DROP_EXTENSO = "Quarta, 7 de outubro";

const MARQUEE = [
  "RANGO DO DRAGÃO",
  `DROP ${DROP_DATA}`,
  "ALIMENTO COMPLETO ÚMIDO",
  "COMIDA NATURAL",
  "PROTEÍNA NOVA",
  "TEM LARVA. TEM 8%",
  "LOTE LIMITADO",
];

/* Duas perguntas opcionais. Não são enfeite: respondem as duas decisões em
   aberto do lançamento (gamestorming 22/09) — de onde vem o público (ração ou
   outra AN) e se precisa de kit para vários cães. */
type ComeHoje = "racao" | "natural" | "mistura";
type Caes = "1" | "2" | "3+";
const COME_HOJE: { id: ComeHoje; label: string }[] = [
  { id: "racao", label: "Ração" },
  { id: "natural", label: "Alimentação natural" },
  { id: "mistura", label: "Um pouco de cada" },
];
const CAES: Caes[] = ["1", "2", "3+"];

const MarqueeBar = ({ bottom = false }: { bottom?: boolean }) => {
  const doubled = [...MARQUEE, ...MARQUEE];
  return (
    <div className={`marquee-bar${bottom ? " bottom" : ""}`} aria-hidden="true">
      <div className="marquee-track" style={bottom ? { animationDirection: "reverse" } : undefined}>
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
};

/* Frase aprovada + linha de apoio, par a par (25/09). */
const NO_POTE = [
  {
    tag: "o que tem",
    nome: "Tem larva. Tem 8%.",
    desc: "Farinha de larva de mosca soldado negra, declarada na composição. Junto dela: filé mignon suíno, batata-doce, abóbora e chuchu.",
    dado: "8%",
    dadoLabel: "de farinha de larva",
  },
  {
    tag: "o que ele sente",
    nome: "Boa para cachorro que não bebe água.",
    desc: "É alimento úmido: até 75,6% de umidade pela ficha. Ele bebe comendo.",
    dado: "75,6%",
    dadoLabel: "de umidade",
  },
];

const FAQ = [
  {
    q: "O que é o Rango do Dragão?",
    a: "Comida natural úmida e completa para cães adultos, em pouch de 500 g. Natural quer dizer ingrediente que você reconhece: filé mignon suíno, batata-doce, abóbora e chuchu. Completo quer dizer que pode ser a refeição inteira: carne, legumes, vitaminas e minerais na conta certa.",
  },
  {
    q: "Por que tem larva?",
    a: "Porque é uma proteína que quase nenhum alimento de cachorro usa — é esse o eixo do Rango. E ele não liga que é larva: o nojo é humano; o apetite dele é que decide.",
  },
  {
    q: "Quanto ele come por dia?",
    a: "Depende do porte, e a tabela vem no rótulo. Em geral, meio pacote para cão pequeno e um para cão médio.",
  },
  {
    q: "Quanto custa?",
    a: "O preço sai no dia do drop. Quem está na lista recebe primeiro.",
  },
];

const Rango = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [comeHoje, setComeHoje] = useState<ComeHoje | "">("");
  const [caes, setCaes] = useState<Caes | "">("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [telTocado, setTelTocado] = useState(false);
  const [listaVisivel, setListaVisivel] = useState(false);
  const leadDisparado = useRef(false);

  useEffect(() => { captureEntryUtms(); }, []);

  /* A barra fixa do mobile some enquanto o formulário está na tela: dois
     "Entrar na lista" juntos, um que rola e um que envia, confundem (05/10). */
  useEffect(() => {
    const el = document.getElementById("lista");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setListaVisivel(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const nomeOk = nome.trim().length >= 2;
  const telOk = isValidPhoneBR(telefone);
  const valid = nomeOk && telOk;
  const telErro = telTocado && telefone.length > 0 && !telOk;
  // o botão apagado diz o que falta, depois que a pessoa começou a preencher
  const falta = !nome && !telefone ? "" : !nomeOk ? "Falta seu nome." : !telOk ? "Falta um WhatsApp válido." : "";

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    const res = await submitLpLead({
      name: nome,
      phone: telefone,
      slug: "rango",
      origem: "espera_rango",
      extra: { come_hoje: comeHoje || null, caes: caes || null, drop: DROP_DATA },
    });
    /* 05/10 — aqui a confirmação só aparece se o contato foi gravado. Numa lista
       de espera, "tá salvo" sem estar salvo é a pessoa esperando um aviso que
       não vem. Contato repetido conta como salvo. */
    if (!res.ok && !/duplicate/i.test(res.error ?? "")) {
      setStatus("error");
      return;
    }
    if (!leadDisparado.current) {
      trackLead("espera-rango", comeHoje || "nao-respondeu");
      leadDisparado.current = true;
    }
    setStatus("done");
  };

  const irPraLista = () => {
    document.getElementById("lista")?.scrollIntoView({ behavior: "smooth", block: "center" });
    // com mouse e teclado, o cursor já cai no Nome; no toque não, para o teclado
    // do celular não cobrir o formulário antes de a pessoa ver onde chegou.
    if (window.matchMedia?.("(hover: hover)").matches) {
      document.querySelector<HTMLInputElement>("#lista input")?.focus({ preventScroll: true });
    }
  };

  const CardLista = (
    <div className="rg-card" id="lista">
      {status === "done" ? (
        <div className="rg-done">
          <div className="rg-done-mark">Você está na lista 🐉</div>
          <p className="rg-done-sub">
            Tá salvo, {nome.trim().split(" ")[0]}. No dia <strong>{DROP_DATA}</strong> o aviso
            chega no WhatsApp <strong>{telefone}</strong>, antes de abrir para todo mundo.
          </p>
          <button type="button" className="rg-done-corrigir" onClick={() => setStatus("idle")}>
            Número errado? Corrigir
          </button>
          <p className="rg-done-nota">Tem alguém com cachorro que ia gostar? Manda esta página.</p>
          <Link to="/produtos" className="rg-btn rg-btn-ghost">
            Enquanto isso, conheça os outros produtos
          </Link>
        </div>
      ) : (
        <>
          <div className="rg-card-topo">
            <span className="rg-card-tag">lista de espera</span>
            <strong className="rg-card-titulo">Quero o Rango</strong>
            <span className="rg-card-sub">
              O aviso do drop chega no seu WhatsApp, antes de abrir para todo mundo.
            </span>
          </div>

          <form className="rg-form" onSubmit={entrar} noValidate>
            <label className="rg-campo">
              <span className="rg-campo-label">Nome</span>
              <input
                className="rg-input"
                type="text"
                placeholder="Como a gente te chama"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="rg-campo">
              <span className="rg-campo-label">WhatsApp</span>
              <input
                className="rg-input"
                type="tel"
                inputMode="numeric"
                placeholder="(21) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
                onBlur={() => setTelTocado(true)}
                autoComplete="tel"
                aria-invalid={telErro}
              />
              {telErro && (
                <span className="rg-campo-erro" role="alert">
                  Confere o número: DDD + 9 dígitos.
                </span>
              )}
            </label>

            <div className="rg-campo">
              <span className="rg-campo-label">
                O que ele come hoje? <em>opcional</em>
              </span>
              <div className="rg-temas">
                {COME_HOJE.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    className={`rg-tema${comeHoje === c.id ? " ativo" : ""}`}
                    onClick={() => setComeHoje(comeHoje === c.id ? "" : c.id)}
                    aria-pressed={comeHoje === c.id}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rg-campo">
              <span className="rg-campo-label">
                Quantos cachorros em casa? <em>opcional</em>
              </span>
              <div className="rg-temas">
                {CAES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`rg-tema${caes === c ? " ativo" : ""}`}
                    onClick={() => setCaes(caes === c ? "" : c)}
                    aria-pressed={caes === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button className="rg-btn rg-btn-full" type="submit" disabled={!valid || status === "sending"}>
              {status === "sending" ? "Entrando…" : "Entrar na lista"}
            </button>
            {status === "error" ? (
              <p className="rg-campo-erro rg-form-aviso" role="alert">
                Não deu para salvar seu contato. Tenta de novo?
              </p>
            ) : falta ? (
              <p className="rg-campo-ajuda rg-form-aviso">{falta}</p>
            ) : null}

            <p className="rg-form-legal">
              A gente usa seu contato pra avisar do drop e falar do que a Comida de Dragão faz.
              É só pedir e a gente para.
            </p>
          </form>
        </>
      )}
    </div>
  );

  return (
    <div className="portal-page theme-light skin-2 rango-page">
      <PageMeta
        title="Rango do Dragão — o alimento completo da Comida de Dragão, feito com inseto"
        description="Comida natural úmida e completa para cães adultos, com proteína de inseto. Drop em 7 de outubro, lote limitado. Entre na lista e receba o aviso primeiro."
      />

      <MarqueeBar />

      {/* ══ HERO + LISTA — tudo na primeira dobra ═══════════════════ */}
      <section className="rg-hero">
        <div className="rg-hero-grid">
          <div className="rg-hero-pitch">
            {/* 05/10 — a marca no topo (Olivia: "tá faltando a logo"). Mesmo lugar e
                mesma classe da /webinar, de onde esta página foi clonada. */}
            <div className="rg-marcas">
              <DragonLogo className="rg-marca-cdd" />
            </div>
            <div className="rg-eyebrow">Rango do Dragão · drop em 7 de outubro</div>
            {/* 28/09 — a Olivia pediu título CLARO: diz o que é e de quem é. A frase
                de conceito ("Ele come inseto desde sempre") saiu do H1. */}
            <h1 className="rg-titulo">
              O alimento completo da Comida de Dragão.<br /><span>Feito com inseto.</span>
            </h1>
            {/* 02/10 — foto misteriosa do lançamento (arte da Bianca, "Vem aí"): o pacote
                segue pixelado até o drop. Fica logo abaixo do título (Olivia, 02/10). */}
            <img
              className="rg-misterio"
              src="/assets/images/rango/rango-vem-ai.webp"
              alt="Pacote do Rango do Dragão pixelado, segurado na mão, com o selo Vem aí"
              width={864}
              height={1080}
              loading="eager"
              decoding="async"
            />
            <p className="rg-sub">
              <strong>Comida natural</strong>, úmida, para cães adultos: filé mignon suíno, batata-doce, abóbora, chuchu e farinha
              de larva, no pouch de 500 g. <strong>Lote limitado</strong> em 7 de outubro.
            </p>
          </div>

          <div className="rg-hero-form">{CardLista}</div>

          <div className="rg-hero-detalhes">
            <p className="rg-sub">
              <strong>Levou menos tempo que ler isto.</strong> Abrir e servir é a receita inteira.
            </p>
            <div className="rg-selos">
              <span className="rg-selo">Comida natural</span>
              <span className="rg-selo">Alimento completo</span>
              <span className="rg-selo">Úmido · 500 g</span>
              <span className="rg-selo">Cães adultos</span>
              <span className="rg-selo">Proteína nova</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ O QUE TEM NO POTE ════════════════════════════════════════ */}
      <section className="rg-secao">
        <div className="rg-tag">no pote</div>
        <h2 className="rg-secao-titulo">Ele merece um prato, <span>não um punhado</span></h2>
        <div className="rg-novidades">
          {NO_POTE.map((n) => (
            <div className="rg-nov-card" key={n.nome}>
              <div className="rg-nov-tag">{n.tag}</div>
              <div className="rg-nov-nome">{n.nome}</div>
              <div className="rg-nov-desc">{n.desc}</div>
            </div>
          ))}
        </div>
        <p className="rg-nota">
          Não é ingrediente exótico. É ingrediente honesto: criado para isso, rastreado e declarado.
        </p>
      </section>

      <div className="rg-divider" />

      {/* ══ FAQ ═════════════════════════════════════════════════════ */}
      <section className="rg-secao">
        <div className="rg-tag tag-alt">perguntas rápidas</div>
        <div className="rg-faq">
          {FAQ.map((f) => (
            <div className="rg-faq-item" key={f.q}>
              <div className="rg-faq-q">{f.q}</div>
              <div className="rg-faq-a">{f.a}</div>
            </div>
          ))}
        </div>

        {status !== "done" && (
          <div className="rg-cta-final">
            <strong>Ele já sabe. Falta você.</strong>
            <button className="rg-btn" onClick={irPraLista}>Entrar na lista</button>
          </div>
        )}
      </section>

      <MarqueeBar bottom />

      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <nav className="footer-links">
          <Link to="/portal">Portal</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/biblioteca">Biblioteca</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:comidadedragao@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">Nojento é o desperdício.</div>
      </footer>

      {status !== "done" && !listaVisivel && (
        <div className="rg-sticky">
          <div className="rg-sticky-info">
            <strong>Drop {DROP_DATA}</strong>
            <span>Lote limitado</span>
          </div>
          <button className="rg-btn rg-btn-sticky" onClick={irPraLista}>
            Entrar na lista
          </button>
        </div>
      )}
    </div>
  );
};

export default Rango;
