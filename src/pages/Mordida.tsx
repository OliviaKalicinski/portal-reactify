import { useEffect, useState } from "react";
import { captureEntryUtms } from "@/lib/utm";
import { submitPrelaunch } from "@/lib/leads";
import { submitMordidaSignup } from "@/lib/mordidaSignup";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Mordida.css";

/* ──────────────────────────────────────────────────────────────
   LP PRÉ-LANÇAMENTO — MORDIDA V2 (DROP) · /mordida
   Página satélite · tráfego pago/orgânico · público FRIO
   Objetivo: CAPTURA DE LEAD (lista de espera) — NÃO vende ainda.
   Depois do drop, vira híbrida (troca o form por checkout Yampi).

   Direção (validada com a Olivia, 20/07):
   - Cold-first: hero entra pelo PRODUTO, não pelo mistério.
   - Ancorada na VOZ DOS CLIENTES (reviews reais, verbatim) — palatabilidade
     + cético convertido + natural/sustentável.
   - CLAIM DE HIPOALERGÊNICO (regra fina, validada com a Olivia 20/07):
     pode-se dizer que a PROTEÍNA (a de inseto/BSF) é hipoalergênica; NÃO se
     pode chamar o PRODUTO de hipoalergênico — a Mordida V2 tem OVO (alérgeno).
     Sempre "proteína ... hipoalergênica", nunca um selo solto "hipoalergênico".
   - Números batem com a ficha oficial V2.2: 24% proteína · 43g/pacote.
   - Molde verde /alergia (prefixo mdp-). Prova social em TEXTO (Índice de
     Qualidade do Google não conta imagem).
   - "100% natural" evitado de propósito (trava de claims 09/07) → "natural
     de verdade". Se Diego/Marcelle liberarem, é só trocar.
────────────────────────────────────────────────────────────── */

const CHIPS = [
  "Sem grãos",
  "Sem glúten",
  "Proteína de inseto",
  "Proteína hipoalergênica", // claim atribuído à PROTEÍNA, nunca ao produto (tem ovo)
];

/* Faixa passante de lançamento (marquee no topo). Mesmo idioma do MarqueeBar
   de /parceiros e /quero-ser-dragao: itens duplicados + scroll translateX(-50%).
   Voz: hook do briefing ("a Mordida evoluiu: sem grão, mais proteína") + teaser. */
const MARQUEE = [
  "A Mordida evoluiu",
  "Sem grão · mais proteína",
  "Pré-lançamento · entre na lista",
  "A gente aprontou uma",
];

/* Reviews REAIS, transcritos exatamente como o cliente escreveu (gírias e
   erros preservados = a prova de que é gente). Fonte: Catálogo de Argumentos
   - Vozes dos Clientes / Melhores Argumentos por Dor (Reviews). */
const REVIEWS = [
  {
    quote: "O PETISCO QUE LEVA MEUS CÃES A LOUCURA E O MELHOR SEEEEEM DAR DOR DE BARRIGA! EU AMEI!",
    who: "@patascubo",
  },
  {
    quote: "Ela simplesmente viciou nas larvinhas.. fica me olhando qdo não coloco na comida 🤣 Cliente e afiliada fiel já",
    who: "Arya",
  },
  {
    quote: "Pedi amostra grátis pra testar. Tenho 7 cães, TODOS AMARAM!!!! Volto agora pro site e, podem ter certeza, terão uma cliente fiel!",
    who: "@gisa_valverde",
  },
  {
    quote: "Confesso que não estava acreditando não, que era só mkt mesmo. Mas a Kate amou os petiscos, ficava enlouquecida cada vez q eu pegava o pacote…",
    who: "cliente verificado · Judge.me · 5★",
  },
];

const BENEFICIOS = [
  {
    stat: "88,9%",
    statLbl: "digestível",
    title: "Proteína de inseto hipoalergênica",
    desc: "Uma proteína que o corpo dele <strong>absorve de verdade</strong> — leve e diferente de tudo.",
  },
  {
    stat: "24%",
    statLbl: "proteína",
    title: "43g por pacote",
    desc: "Parrudo pro tamanho — e <strong>mais forte que a versão antiga</strong>.",
  },
  {
    stat: "ZERO",
    statLbl: "grão · glúten",
    title: "Leve pro intestino",
    desc: "Saiu o trigo, saiu a aveia. Ficou fácil de digerir.",
  },
  {
    stat: "NATURAL",
    statLbl: "de verdade",
    title: "Comida, não química",
    desc: "Você reconhece cada ingrediente que vai pro pacote.",
  },
  {
    stat: "NOVA",
    statLbl: "proteína",
    title: "Diferente de tudo",
    desc: "Uma proteína que ele nunca provou — pro cão que precisa de algo <strong>diferente</strong>.",
  },
];

const Mordida = () => {
  useEffect(() => { captureEntryUtms(); }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  // POPUP de inscrição (nome + telefone) — grava em `prelancamento_mordida`.
  const [showPopup, setShowPopup] = useState(false);
  const [puName, setPuName] = useState("");
  const [puPhone, setPuPhone] = useState("");
  const [puStatus, setPuStatus] = useState<"idle" | "sending" | "done">("idle");
  const puValid = puName.trim().length >= 2 && puPhone.replace(/\D/g, "").length >= 10;

  useEffect(() => {
    const t = setTimeout(() => setShowPopup(true), 3000); // aparece 3s depois
    return () => clearTimeout(t);
  }, []);

  // trava o scroll do fundo enquanto o popup está aberto
  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showPopup]);

  const handlePopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!puValid || puStatus === "sending") return;
    setPuStatus("sending");
    await submitMordidaSignup({ name: puName, phone: puPhone });
    setPuStatus("done"); // sucesso mesmo se o insert falhar (erro fica no console)
  };

  // Máscara leve de telefone BR: (11) 91234-5678
  const maskPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  const digits = phone.replace(/\D/g, "");
  const valid = name.trim().length >= 2 && digits.length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    const res = await submitPrelaunch({
      name,
      phone: digits,
      slug: "mordida",
      label: "Lista de espera Mordida V2",
    });
    setStatus(res.ok ? "done" : "error");
    // Fallback: mesmo se o insert falhar, a pessoa vê sucesso (UX antes da
    // captura, igual ao fluxo do quiz). O erro fica logado no console.
    if (!res.ok) setStatus("done");
  };

  return (
    <div className="mordida-lp">
      <PageMeta
        title="Tá chegando o petisco mais forte e mais leve — Comida de Dragão"
        description="Pré-lançamento da Mordida V2: larva de inseto hipoalergênica, 24% de proteína, sem grão e sem glúten. Entre na lista e seja o primeiro a provar."
      />

      {/* ════ FAIXA PASSANTE DE LANÇAMENTO ════
          Decorativa: a mesma informação já vive no eyebrow + sub + chips da
          hero, então aria-hidden evita o leitor de tela repetir o loop. */}
      <div className="mdp-marquee" aria-hidden="true">
        <div className="mdp-marquee-track">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* ════ BANNER (responsivo, igual ao site: mobile × desktop) ════ */}
      <a href="#lista" className="mdp-banner" aria-label="Pré-lançamento Mordida V2">
        <picture>
          <source media="(min-width: 768px)" srcSet="/assets/images/mordida/banner-desktop.png" />
          <img
            className="mdp-banner-img"
            src="/assets/images/mordida/banner-mobile.png"
            alt="Mordida V2 — Level Up: pré-lançamento"
            loading="eager"
            decoding="async"
          />
        </picture>
      </a>

      {/* ════ HERO ════ */}
      <section className="mdp-hero">
        <div className="mdp-hero-inner">
          <div className="mdp-hero-top">
            <Link to="/portal" className="mdp-backlink">← comida de dragão</Link>
          </div>

          {/* Desktop = 2 colunas: título+texto à esquerda, foto grande + botão à direita.
              Mobile = empilha na mesma ordem (esquerda depois direita). */}
          {/* Dobra vertical e limpa: logo → título → texto → BOTÃO → imagem grande → selos.
              Sem badge de pré-lançamento (duplicava a faixa do topo). Botão ANTES da imagem
              pra ficar acima da dobra — a imagem (tamanho de tela) vem logo depois. */}
          {/* Desktop = 2 colunas (texto+CTA à esquerda, foto do produto à direita)
              pra não deixar o conteúdo numa ilha estreita na tela larga.
              Mobile = empilha; a foto some (o BANNER do topo já é o visual). */}
          <div className="mdp-hero-grid">
            <div className="mdp-hero-main">
              <div className="mdp-hero-text">
                <DragonLogo className="mdp-hero-logo" />

                <h1 className="mdp-hero-title">
                  Tá chegando o petisco<br />
                  <span>mais forte e mais leve.</span>
                </h1>

                <p className="mdp-hero-sub">
                  Larva de inseto <strong>hipoalergênica</strong> que ele absorve como nenhuma
                  outra — agora com <strong>24% de proteína</strong>, <strong>sem grão e sem glúten</strong>.
                </p>
              </div>

              <div className="mdp-hero-chips">
                {CHIPS.map((c, i) => <span className="mdp-chip" key={i}>{c}</span>)}
              </div>

              <div className="mdp-hero-cta-wrap">
                <a href="#lista" className="mdp-btn-primary mdp-btn-sm" data-cta="hero">
                  Quero ser o primeiro a provar
                </a>
              </div>
            </div>

            {/* Foto real do produto — só no desktop (no mobile o banner já mostra). */}
            <div className="mdp-hero-visual">
              <img
                className="mdp-hero-prod"
                src="/assets/images/produtos/mordida-v2.png"
                alt="Mordida V2 — embalagem"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════ POR QUE É BOM DEMAIS ════ (vem ANTES da prova: o frio precisa da substância cedo) */}
      <section className="mdp-section">
        <div className="mdp-section-inner">
          <span className="mdp-tag">o petisco</span>
          <h2 className="mdp-section-title">
            Por que ele é<br /><span>bom demais?</span>
          </h2>

          <div className="mdp-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="mdp-beneficio" key={i}>
                <div className="mdp-beneficio-stat">
                  {b.stat}{b.statLbl && <small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>}
                </div>
                <div className="mdp-beneficio-title">{b.title}</div>
                <div className="mdp-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>

          {/* CTA de seção (só desktop → botão a cada etapa pro retardatário) */}
          <div className="mdp-section-cta">
            <a href="#lista" className="mdp-btn-primary" data-cta="secao-beneficios">
              Quero ser o primeiro a provar
            </a>
          </div>
        </div>
      </section>

      {/* ════ PROVA — nível MARCA (é lançamento: ninguém provou ESTE ainda) ════ */}
      <section className="mdp-section">
        <div className="mdp-section-inner">
          <span className="mdp-tag">quem já é de casa</span>
          <h2 className="mdp-section-title">
            Veja o que já falam<br /><span>da Comida de Dragão.</span>
          </h2>

          <div className="mdp-reviews">
            {REVIEWS.map((r, i) => (
              <figure className="mdp-review" key={i}>
                <blockquote>"{r.quote}"</blockquote>
                <figcaption>— {r.who}</figcaption>
              </figure>
            ))}
          </div>

          <div className="mdp-section-cta">
            <a href="#lista" className="mdp-btn-primary" data-cta="secao-reviews">
              Quero ser o primeiro a provar
            </a>
          </div>
        </div>
      </section>

      {/* ════ PRA QUEM TEM CORAGEM ════ */}
      <section className="mdp-section">
        <div className="mdp-section-inner">
          <span className="mdp-tag tag-pink">não é pra todo mundo</span>
          <h2 className="mdp-section-title title-pink">
            Pra quem<br /><span>tem coragem.</span>
          </h2>
          <p className="mdp-section-lead">
            A Comida de Dragão é pra quem tem coragem de fazer diferente — dar o melhor
            pro pet e ainda ajudar a mudar o mundo. Cada mordida transforma
            <strong> desperdício em proteína</strong>.
          </p>
          <figure className="mdp-review mdp-review-solo">
            <blockquote>"Esse AUmigão sabe oque é bom pra nós e pro planeta 🌎"</blockquote>
            <figcaption>— cliente · Instagram</figcaption>
          </figure>
        </div>
      </section>

      {/* ════ A GENTE OUVIU (wink pra base) ════ */}
      <section className="mdp-section mdp-wink">
        <div className="mdp-section-inner">
          <p className="mdp-wink-text">
            📞 <strong>Já é de casa?</strong> Essa é pra você: a gente ouviu cada comentário,
            cada sugestão, cada mensagem. <strong>A Mordida evoluiu por causa de vocês.</strong> 🐉
          </p>
        </div>
      </section>

      {/* ════ FORM — CAPTURA ════ */}
      <section className="mdp-oferta" id="lista">
        <div className="mdp-oferta-inner">
          <span className="mdp-tag tag-lime">lista do pré-lançamento</span>
          <h2 className="mdp-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Entre na lista<br /><span>do drop</span>
          </h2>

          {status === "done" ? (
            <div className="mdp-form-done">
              <div className="mdp-form-done-icon">🐉</div>
              <strong>Anotado! Você tá na lista.</strong>
              <span>Quando o Dragão soltar, você é um dos primeiros a saber.</span>
              <a
                className="mdp-btn-secondary"
                href="https://www.instagram.com/comidadedragao"
                target="_blank"
                rel="noopener noreferrer"
              >
                Seguir no Instagram enquanto isso →
              </a>
            </div>
          ) : (
            <>
              <p className="mdp-oferta-sub">
                A lista fecha quando o Dragão soltar. Quem tá dentro descobre
                <strong> primeiro</strong> — e sai na frente.
              </p>

              <form className="mdp-form" onSubmit={handleSubmit} noValidate>
                <input
                  className="mdp-input"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  aria-label="Seu nome"
                />
                <input
                  className="mdp-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Seu WhatsApp"
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  autoComplete="tel"
                  aria-label="Seu WhatsApp"
                />
                <button
                  className="mdp-btn-primary"
                  type="submit"
                  disabled={!valid || status === "sending"}
                >
                  {status === "sending" ? "Entrando…" : "Quero ser o primeiro"}
                </button>
              </form>

              <p className="mdp-form-micro">
                Sem spam. Só o aviso do lançamento e a vantagem de quem chegou antes.
              </p>
            </>
          )}
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="mdp-footer">
        <DragonLogo className="mdp-footer-logo-svg" />
        <nav className="mdp-footer-links">
          <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
          <Link to="/produtos">Linha completa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="mdp-footer-tagline">Nojento é o desperdício.</div>
        <div className="mdp-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ POPUP DE INSCRIÇÃO (nome + email → tabela `leads`) ════ */}
      {showPopup && (
        <div
          className="mdp-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Pré-lançamento Mordida"
          onClick={() => setShowPopup(false)}
        >
          <div className="mdp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="mdp-modal-close"
              onClick={() => setShowPopup(false)}
              aria-label="Fechar"
            >
              ✕
            </button>

            <img
              className="mdp-modal-img"
              src="/assets/images/mordida/popup-mordida.png"
              alt="Mordida V2 — Level Up"
              loading="eager"
              decoding="async"
            />

            {puStatus === "done" ? (
              <div className="mdp-modal-body mdp-modal-done">
                <strong>🔓 Item desbloqueado!</strong>
                <span>Você tá na lista. Quando o Dragão soltar, você é o primeiro a saber.</span>
                <button className="mdp-btn-primary" onClick={() => setShowPopup(false)}>
                  Fechar
                </button>
              </div>
            ) : (
              <div className="mdp-modal-body">
                <h3 className="mdp-modal-title">🔓 Desbloqueie o pré-lançamento</h3>
                <p className="mdp-modal-sub">
                  Deixa teu nome e WhatsApp — você entra na lista e é o <strong>primeiro</strong> a
                  saber quando a Mordida soltar.
                </p>
                <form className="mdp-form" onSubmit={handlePopupSubmit} noValidate>
                  <input
                    className="mdp-input"
                    type="text"
                    placeholder="Seu nome"
                    value={puName}
                    onChange={(e) => setPuName(e.target.value)}
                    autoComplete="name"
                    aria-label="Seu nome"
                  />
                  <input
                    className="mdp-input"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Seu WhatsApp"
                    value={puPhone}
                    onChange={(e) => setPuPhone(maskPhone(e.target.value))}
                    autoComplete="tel"
                    aria-label="Seu WhatsApp"
                  />
                  <button
                    className="mdp-btn-primary"
                    type="submit"
                    disabled={!puValid || puStatus === "sending"}
                  >
                    {puStatus === "sending" ? "Desbloqueando…" : "DESBLOQUEAR 🐉"}
                  </button>
                </form>
                <button className="mdp-modal-skip" onClick={() => setShowPopup(false)}>
                  agora não
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Mordida;
