import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms } from "@/lib/utm";
import { formatPhoneBR, isValidPhoneBR } from "@/lib/phone";
import { submitWebinarLead, type PerfilInscrito, type TemaWebinar } from "@/lib/webinarLead";
import "./Portal.css";
import "./Webinar.css";

/* ──────────────────────────────────────────────────────────────
   WEBINAR — Comida de Dragão × Cogumelos Pet · 08/09/2026, 18h30

   Esta página É a inscrição (decisão da Olivia, 25/08). Não é ponte pra
   Sympla nem pro Zoom: o contato cai no nosso banco (`lp_leads`, origem
   `webinar_mv_cogumelos`) e o link de acesso sai por WhatsApp.

   É o `{LINK}` que o convite de WhatsApp e o link da bio já esperam —
   ver `PROJETOS/Webinar MV - Cogumelos Pet (08-09-26)/`.

   ☀️ TEMA CLARO (Olivia, 25/08). Usa o `theme-light` que já existe no
   `Portal.css` — a mesma paleta de Biblioteca, Imprensa e Parceiros, com as
   cores da marca já rebaixadas pra contraste sobre creme. Não é paleta nova.

   🔴 O EIXO (Olivia, 25/08): NÃO é a dor, é a INOVAÇÃO. O assunto da página é
   o que a proteína de inseto e o extrato de cogumelo mudam na vida do bicho —
   duas casas trazendo ingrediente que o Brasil ainda estranha. A coceira é UM
   dos temas, não a manchete.
   E os temas **quem escolhe é o público**: a inscrição pede o voto, e a pauta
   do dia sai da contagem. Por isso o formulário tem os chips — eles não são
   enfeite de engajamento, são o insumo do roteiro.
   ⚠️ Sem a migration de `lp_leads` a votação NÃO é gravada (ver webinarLead.ts).

   🔴 MAIS DUAS CORREÇÕES DELA NO MESMO DIA:

   1. "NINGUÉM SABE O QUE É DISBIOSE." As peças de convite usam o vocabulário
      técnico — "disbiose, alergia e modulação imunológica". Aqui não. A página
      fala de comida, imunidade e coceira, e diz de saída que a conversa tem
      parte técnica pra quem quiser ir fundo. O rigor é de vet; a linguagem
      não pode ser só de vet (eixo fechado em 24/08).
      ⚠️ Se a palavra técnica for necessária, ela vem DEPOIS da explicação,
      entre parênteses — nunca antes.

   2. "O FORMULÁRIO DEMORA MUITO PRA CHEGAR." A inscrição agora está na
      primeira dobra, ao lado do hero no desktop e logo abaixo dele no mobile.
      A página perdeu um terço do comprimento no mesmo movimento: o bloco de
      público virou uma linha e a nota técnica saiu do corpo.
      *(A regra da casa — botão depois do pacote — vale pra LP de venda, onde
      o preço precisa do argumento antes. Aqui não há oferta a montar: é vaga
      gratuita, e o que a pessoa "compra" é a data.)*

   NÃO VENDE NADA. Sem preço, sem cupom, sem kit. É convite, e convite que
   vira oferta no primeiro toque queima a lista.

   ⚠️ NÃO ESCREVER AQUI, e o motivo:
   · "BSF + cogumelo juntos funcionam melhor" — não existe estudo cruzando os
     dois no nosso acervo (17 papers, zero menções a cordyceps).
   · "snacks hipoalergênicos" no coletivo — a Mordida tem ovo em pó. Só
     "proteína hipoalergênica".
   · promessa de cura, e nome de concorrente.
   ────────────────────────────────────────────────────────────── */

const MARQUEE = [
  "WEBINAR GRATUITO",
  "08 · 09 · 2026",
  "18H30",
  "COMIDA DE DRAGÃO",
  "COGUMELOS PET",
  "A PAUTA É SUA",
];

/* Os temas que a pessoa vota na inscrição. `id` casa com `TemaWebinar` na lib —
   as duas listas têm que andar juntas. A ordem aqui não é a ordem da pauta: a
   pauta é a contagem dos votos, e ela só se sabe depois. */
const TEMAS: { id: TemaWebinar; label: string }[] = [
  { id: "alergia", label: "Alergia e coceira" },
  { id: "imunidade", label: "Imunidade" },
  { id: "idoso", label: "Pet idoso" },
  { id: "digestao", label: "Digestão e intestino" },
  { id: "tratamento", label: "Pet em tratamento" },
  { id: "pele-pelo", label: "Pele e pelo" },
];

const MarqueeBar = ({ bottom = false }: { bottom?: boolean }) => {
  const doubled = [...MARQUEE, ...MARQUEE];
  return (
    <div className={`marquee-bar${bottom ? " bottom" : ""}`}>
      <div className="marquee-track" style={bottom ? { animationDirection: "reverse" } : undefined}>
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
};

/* As duas novidades, lado a lado. É o coração da página: a pessoa está aqui
   porque nunca deu inseto nem cogumelo pro bicho dela.

   ⚠️ VOCABULÁRIO (Olivia, 25/08): na MANCHETE é "inseto" — "larva" impacta
   demais e a página é o primeiro contato de quem vem do convite frio. Dentro
   do card, onde já é informação e não chamada, "larva de mosca soldado negra"
   fica: é o nome real, e o vet precisa dele. A regra é de altura, não de
   censura — quanto mais fundo na página, mais preciso o termo pode ser.
   ⚠️ Cada card fala SÓ do seu ingrediente. Não existe estudo cruzando os dois
   no nosso acervo (17 papers, zero menções a cordyceps) — sinergia não se
   sugere nem por diagramação. */
const NOVIDADES = [
  {
    tag: "Comida de Dragão",
    nome: "Proteína de inseto",
    desc: "Feita de larva de mosca soldado negra, criada aqui no Rio, em biofábrica registrada no MAPA. É proteína que o bicho nunca comeu antes — e é por isso que ela entra na conversa de alergia alimentar.",
    dado: "88,9%",
    dadoLabel: "de digestibilidade",
  },
  {
    tag: "Cogumelos Pet",
    nome: "Extrato de cogumelo",
    desc: "Extrato de Cordyceps militaris, grau farmacêutico, registrado no MAPA como suplemento. É o que eles estudam para imunidade — principalmente no animal idoso e no que está em tratamento.",
    dado: "100%",
    dadoLabel: "extrato, não cultivo",
  },
];

const APRESENTAM = [
  {
    nome: "Diego",
    papel: "Time técnico da Comida de Dragão",
    desc: "Fala da proteína de inseto: o que os estudos já mostraram sobre a mosca soldado negra, e onde eles ainda não chegaram.",
  },
  {
    nome: "Dra. Sylvia",
    papel: "Veterinária · Cogumelos Pet",
    desc: "Fala do extrato de cogumelo e de imunidade — principalmente no bicho idoso e no que está em tratamento.",
  },
];

const FAQ = [
  {
    q: "Como vocês escolhem o que vai ser falado?",
    a: "Você escolhe. Na inscrição a gente pergunta quais assuntos te interessam, e a ordem do dia sai da contagem — o que mais gente marcou entra primeiro e ganha mais tempo.",
  },
  {
    q: "Vou entender alguma coisa?",
    a: "Vai. A conversa tem parte técnica — estudo citado com nome e número, porque tem muito veterinário na sala. Mas nada é dito só em jargão: se aparecer palavra difícil, ela vem explicada.",
  },
  {
    q: "É gratuito mesmo?",
    a: "É. Não tem taxa e não tem venda no meio. Você se inscreve, recebe o link e assiste.",
  },
  {
    q: "Não vou poder assistir ao vivo.",
    a: "Se inscreve do mesmo jeito. A gravação vai pra quem se inscreveu — é o mesmo cadastro.",
  },
  {
    q: "Como recebo o link?",
    a: "No WhatsApp que você deixar aqui. A gente manda um lembrete antes e o link na hora de entrar.",
  },
];

const Webinar = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState<PerfilInscrito | "">("");
  const [crmv, setCrmv] = useState("");
  const [temas, setTemas] = useState<TemaWebinar[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => { captureEntryUtms(); }, []);

  // E-mail é opcional — mas se a pessoa digitou, tem que ser um endereço
  // possível. Campo opcional com lixo dentro é pior que campo vazio: entra na
  // base como contato e nunca entrega.
  const emailOk = email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const valid =
    nome.trim().length >= 2 && isValidPhoneBR(telefone) && perfil !== "" && emailOk;

  const alternarTema = (id: TemaWebinar) =>
    setTemas((atual) => (atual.includes(id) ? atual.filter((t) => t !== id) : [...atual, id]));

  const inscrever = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    await submitWebinarLead({
      name: nome,
      phone: telefone,
      email,
      perfil: perfil as PerfilInscrito,
      crmv,
      temas,
    });
    // sucesso pra pessoa mesmo se o insert falhar; o erro fica no console.
    // Mesma disciplina do popup das LPs: UX antes da captura.
    setStatus("done");
  };

  const irPraInscricao = () => {
    document.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  /* O card de inscrição. Mora dentro do hero — mesmo bloco, primeira dobra. */
  const CardInscricao = (
    <div className="wb-card" id="inscricao">
      {status === "done" ? (
        <div className="wb-done">
          <div className="wb-done-mark">Vaga garantida 🐉</div>
          <p className="wb-done-sub">
            Tá salvo, {nome.trim().split(" ")[0]}. O lembrete e o link chegam no seu WhatsApp
            antes do dia <strong>08/09</strong>.
          </p>
          <p className="wb-done-nota">
            {temas.length > 0
              ? "Seu voto entrou na pauta. Não vai poder assistir? A gravação vai pra quem se inscreveu."
              : "Não vai poder assistir? Não precisa fazer nada — a gravação vai pra quem se inscreveu."}
          </p>
          <Link to="/biblioteca" className="wb-btn wb-btn-ghost">
            Enquanto isso, dá uma olhada nos estudos
          </Link>
        </div>
      ) : (
        <>
          <div className="wb-card-topo">
            <span className="wb-card-tag">inscrição gratuita</span>
            <strong className="wb-card-titulo">Quero assistir</strong>
            <span className="wb-card-sub">
              O link chega no seu WhatsApp — e você já diz o que quer ver na conversa.
            </span>
          </div>

          <form className="wb-form" onSubmit={inscrever} noValidate>
            <label className="wb-campo">
              <span className="wb-campo-label">Nome</span>
              <input
                className="wb-input"
                type="text"
                placeholder="Como a gente te chama"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="wb-campo">
              <span className="wb-campo-label">WhatsApp</span>
              <input
                className="wb-input"
                type="tel"
                inputMode="numeric"
                placeholder="(21) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
                autoComplete="tel"
              />
            </label>

            <label className="wb-campo">
              <span className="wb-campo-label">
                E-mail <em>opcional</em>
              </span>
              <input
                className="wb-input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {!emailOk && <span className="wb-campo-erro">Esse e-mail parece incompleto.</span>}
            </label>

            {/* A pergunta que a captura da feira não fez. É ela que separa
                tutor de profissional na lista — e o que decide qual régua a
                pessoa recebe depois do evento. */}
            <div className="wb-campo">
              <span className="wb-campo-label">Você é veterinário?</span>
              <div className="wb-escolha">
                <button
                  type="button"
                  className={`wb-escolha-btn${perfil === "vet" ? " ativo" : ""}`}
                  onClick={() => setPerfil("vet")}
                >
                  Sou veterinário
                </button>
                <button
                  type="button"
                  className={`wb-escolha-btn${perfil === "tutor" ? " ativo" : ""}`}
                  onClick={() => setPerfil("tutor")}
                >
                  Sou tutor
                </button>
              </div>
            </div>

            {perfil === "vet" && (
              <label className="wb-campo">
                <span className="wb-campo-label">
                  CRMV <em>opcional</em>
                </span>
                <input
                  className="wb-input"
                  type="text"
                  placeholder="CRMV-RJ 00000"
                  value={crmv}
                  onChange={(e) => setCrmv(e.target.value)}
                />
              </label>
            )}

            {/* A VOTAÇÃO. Opcional de propósito: exigir marcação aqui trocaria
                pauta melhor por menos inscrito, e o que a página existe pra
                fazer é encher a sala. Quem não marcar simplesmente não vota. */}
            <div className="wb-campo">
              <span className="wb-campo-label">
                O que você quer ouvir? <em>marque quantos quiser</em>
              </span>
              <div className="wb-temas">
                {TEMAS.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    className={`wb-tema${temas.includes(t.id) ? " ativo" : ""}`}
                    onClick={() => alternarTema(t.id)}
                    aria-pressed={temas.includes(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="wb-campo-ajuda">
                A ordem do dia sai da contagem — o mais votado abre a conversa.
              </span>
            </div>

            <button className="wb-btn wb-btn-full" type="submit" disabled={!valid || status === "sending"}>
              {status === "sending" ? "Inscrevendo…" : "Garantir minha vaga"}
            </button>
            <p className="wb-form-legal">
              A gente usa seu contato pra falar do webinar e do que a Comida de Dragão faz.
              É só pedir e a gente para.
            </p>
          </form>
        </>
      )}
    </div>
  );

  return (
    <div className="portal-page theme-light skin-2 webinar-page">
      <PageMeta
        title="Inseto e cogumelo: o que muda no seu pet — webinar grátis 08/09"
        description="Comida de Dragão e Cogumelos Pet se encontram pra falar de inovação no mercado pet: como inseto e cogumelo beneficiam cão e gato. Grátis, 8/09, 18h30."
      />

      <MarqueeBar />

      {/* ══ HERO + INSCRIÇÃO — tudo na primeira dobra ══════════════ */}
      <section className="wb-hero">
        <div className="wb-hero-grid">
          {/* O pitch: só o necessário pra pessoa saber se é pra ela. No mobile
              é isto e nada mais antes do formulário. */}
          <div className="wb-hero-pitch">
            <div className="wb-eyebrow">webinar gratuito · 8 de setembro</div>
            <h1 className="wb-titulo">
              Inseto e cogumelo.<br /><span>E o que isso muda</span> no seu pet.
            </h1>
            {/* 25/08 — a versão anterior ("duas casas que fazem comida de bicho com
                ingrediente que o Brasil ainda estranha") não dizia QUEM nem O QUÊ.
                A Olivia pediu explicação de verdade: nomeia as duas marcas, nomeia
                a inovação e diz o que ela faz pelo bicho.
                ⚠️ Segue valendo: cada ingrediente com o seu papel, sem sugerir que
                os dois juntos funcionam melhor — não existe estudo cruzando os dois
                no acervo. */}
            <p className="wb-sub">
              A <strong>Comida de Dragão</strong> e a <strong>Cogumelos Pet</strong> se encontram
              pra falar de <strong>inovação no mercado pet</strong>: o que a proteína de inseto e o
              extrato de cogumelo fazem pela alergia, pela imunidade e pela digestão do seu bicho —
              e o que já dá pra ver na prática.
              <strong> Dia 8 de setembro, 18h30.</strong>
            </p>
          </div>

          <div className="wb-hero-form">{CardInscricao}</div>

          {/* Os detalhes ficam DEPOIS do formulário no mobile (grid-area). No
              desktop sobem pra coluna da esquerda, embaixo do pitch. */}
          <div className="wb-hero-detalhes">
            <p className="wb-sub">
              <strong>Quem escolhe os assuntos é você.</strong> Na inscrição a gente pergunta o que
              te interessa — alergia, imunidade, pet idoso, digestão — e a ordem do dia sai da
              contagem dos votos.
            </p>
            <p className="wb-sub">
              Tudo em português. Tem parte técnica, com estudo citado, pra quem quiser ir fundo —
              mas dá pra acompanhar sem ser da área.
            </p>

            <div className="wb-quando">
              <div className="wb-quando-bloco">
                <span className="wb-quando-label">quando</span>
                <strong className="wb-quando-valor">Terça, 8 de setembro · 18h30</strong>
              </div>
              <div className="wb-quando-bloco">
                <span className="wb-quando-label">onde</span>
                <strong className="wb-quando-valor">Online — o link chega no seu WhatsApp</strong>
              </div>
            </div>

            <div className="wb-selos">
              <span className="wb-selo">Grátis</span>
              <span className="wb-selo">1h30 ao vivo</span>
              <span className="wb-selo">Dá pra perguntar</span>
              <span className="wb-selo">Fica gravado</span>
            </div>

            <p className="wb-hero-nota">
              Pra tutor curioso — e pra veterinário que quer ver a evidência antes de indicar.
            </p>
          </div>
        </div>
      </section>

      {/* ══ AS DUAS NOVIDADES ═════════════════════════════════════ */}
      <section className="wb-secao">
        <div className="wb-tag">o que tem de novo</div>
        <h2 className="wb-secao-titulo">Dois ingredientes que <span>o seu pet nunca comeu</span></h2>
        <div className="wb-novidades">
          {NOVIDADES.map((n) => (
            <div className="wb-nov-card" key={n.nome}>
              <div className="wb-nov-tag">{n.tag}</div>
              <div className="wb-nov-nome">{n.nome}</div>
              <div className="wb-nov-desc">{n.desc}</div>
              <div className="wb-nov-dado">
                <strong>{n.dado}</strong>
                <span>{n.dadoLabel}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="wb-nota">
          Cada casa fala do próprio ingrediente. Ninguém vai dizer que os dois juntos fazem mágica —
          isso não está estudado, e a gente não inventa.
        </p>
      </section>

      <div className="wb-divider" />

      {/* ══ QUEM APRESENTA ════════════════════════════════════════
          Vet decide assistir por causa de quem fala, não da marca que
          convida — e tutor também quer saber quem está do outro lado. */}
      <section className="wb-secao">
        <div className="wb-tag tag-alt2">quem vai falar</div>
        <h2 className="wb-secao-titulo">Duas pessoas, <span>uma conversa</span></h2>
        <div className="wb-quem">
          {APRESENTAM.map((a) => (
            <div className="wb-quem-card" key={a.nome}>
              <div className="wb-quem-nome">{a.nome}</div>
              <div className="wb-quem-papel">{a.papel}</div>
              <div className="wb-quem-desc">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="wb-divider" />

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section className="wb-secao">
        <div className="wb-tag tag-alt">perguntas rápidas</div>
        <div className="wb-faq">
          {FAQ.map((f) => (
            <div className="wb-faq-item" key={f.q}>
              <div className="wb-faq-q">{f.q}</div>
              <div className="wb-faq-a">{f.a}</div>
            </div>
          ))}
        </div>
        {status !== "done" && (
          <div className="wb-cta-final">
            <strong>Terça, 8 de setembro, 18h30.</strong>
            <button className="wb-btn" onClick={irPraInscricao}>Garantir minha vaga</button>
          </div>
        )}
      </section>

      <MarqueeBar bottom />

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <nav className="footer-links">
          <Link to="/portal">Portal</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/biblioteca">Biblioteca</Link>
          <Link to="/veterinarios">Veterinários</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:comidadedragao@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">Nojento é o desperdício.</div>
      </footer>

      {/* ══ STICKY MOBILE ═════════════════════════════════════════
          Some quando a inscrição já foi feita — barra pedindo o que a
          pessoa já deu é o jeito mais rápido de queimar a página. */}
      {status !== "done" && (
        <div className="wb-sticky">
          <div className="wb-sticky-info">
            <strong>08/09 · 18h30</strong>
            <span>Grátis e online</span>
          </div>
          <button className="wb-btn wb-btn-sticky" onClick={irPraInscricao}>
            Quero assistir
          </button>
        </div>
      )}
    </div>
  );
};

export default Webinar;
