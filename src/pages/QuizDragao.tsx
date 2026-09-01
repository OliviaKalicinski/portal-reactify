import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms } from "@/lib/utm";
import { submitLead } from "@/lib/leads";
import { formatPhoneBR, isValidPhoneBR } from "@/lib/phone";
import { uploadProfilePhoto } from "@/lib/uploads";
import { gerarCarteira } from "@/lib/carteira";
import { DRAGOES, PERGUNTAS, calcular, type Resultado, type Dragao } from "@/data/dragoes";
import "./QueroSerDragao.css"; /* sistema visual retrô-OS (.qsd8) */
import "./OqueFalam.css";      /* tema cf-pink 8-bit (creme + acento) */
import "./QuizDragao.css";     /* skin por dragão + telas do quiz */

/* ──────────────────────────────────────────────────────────────
   QUIZ "QUE DRAGÃO MORA NA SUA CASA?" · /qual-dragao

   CLONE do shell qsd8/cf-pink da /oquefalam — mesma janela de OS,
   mesmo creme, mesmos ícones de desktop. O que muda: a cor de acento
   passa a ser a do DRAGÃO do resultado (skin por arquétipo).

   Fluxo (fechado no brief de 30/06):
     intro → 6 perguntas → veredito (teaser) → foto → telefone+consentimento → carteira

   🔴 Régua de humor (manual de comédia §0, Efeito Jon Stewart):
     perguntas e veredito = humor ALTO · gate e CTA de produto = humor ZERO.
     Onde o objetivo é AÇÃO, a peça roda seca. Não "melhorar" o gate com piada.

   Conteúdo (copy, perguntas, scoring) mora em @/data/dragoes.
   Desenho da carteira mora em @/lib/carteira — é o que se troca quando os
   templates da Bianca chegarem.
   ────────────────────────────────────────────────────────────── */

const ICON = "/assets/pixel-icons";

/* 🔴 A MESMA URL QUE ESTÁ IMPRESSA NOS 6 CARDS (Canva "Card Quizzes").
   Só passa a funcionar quando existir na loja o caminho /dragao apontando pra cá.
   Se mudar aqui, mudar lá — e vice-versa. */
const QUIZ_URL = "https://comidadedragao.com.br/dragao";

/* A CAIXA dos cards: creme, borda preta grossa, sombra dura — e, quando tem
   nome, a FAIXA preta com o texto em pixel e os quadradinhos amarelos nas
   pontas (é o "É O DEVORADOR" do card da Bianca, virado em componente). */
const Card = ({ faixa, children, className }: {
  faixa?: string; children: ReactNode; className?: string;
}) => (
  <section className={`qd-card${className ? " " + className : ""}`}>
    {faixa && (
      <div className="qd-faixa">
        <i aria-hidden="true" />
        <b>{faixa}</b>
        <i aria-hidden="true" />
      </div>
    )}
    <div className="qd-card-body">{children}</div>
  </section>
);

/* STICKERS — as pecas recortadas das paginas do Canva, espalhadas em volta do
   quadro como na colagem dos cards. Posicoes FIXAS (nao aleatorias): o layout
   nao pode dancar entre um render e outro, e a peca tem que poder ser conferida
   sempre igual. `aria-hidden` porque e ornamento, nao conteudo. */
const POSES = [
  { top: "-26px", left: "-22px", rot: -14, w: 92 },
  { top: "-34px", right: "-18px", rot: 12, w: 78 },
  { bottom: "-28px", left: "-16px", rot: 9, w: 74 },
  { bottom: "-22px", right: "-24px", rot: -11, w: 86 },
];

const Stickers = ({ dragao }: { dragao: Dragao }) => (
  <>
    {dragao.stickersUsar.slice(0, 4).map((n, i) => (
      <img
        key={n}
        className="qd-sticker"
        src={`/assets/quiz-stickers/${dragao.id}/${String(n).padStart(2, "0")}.png`}
        alt=""
        aria-hidden="true"
        style={{ ...POSES[i], width: POSES[i].w, transform: `rotate(${POSES[i].rot}deg)` }}
      />
    ))}
  </>
);

/* barra de progresso pixelada — 6 blocos, um por pergunta */
const Progresso = ({ passo }: { passo: number }) => (
  <div className="qd-prog" aria-label={`Pergunta ${passo + 1} de 6`}>
    {PERGUNTAS.map((_, i) => <i key={i} className={i <= passo ? "on" : ""} />)}
  </div>
);

type Fase = "intro" | "quiz" | "lendo" | "veredito" | "foto" | "gate" | "carteira";

/* A tela de LENDO existe por dois motivos, os dois de fonte:
   - Thomas & Johnston, princípio 2 (ANTICIPATION): o recuo antes do gesto prepara o
     olho. Resultado que aparece seco não tem momento — e o momento é o que se posta.
   - Berger (Contágio, cap. Emoção): o que prevê compartilhamento é ATIVAÇÃO, não
     valência. Humor a peça já tem; o que faltava era ASSOMBRO, a outra emoção de alta
     ativação. Uma espera curta com o Dragão trabalhando fabrica isso de graça.
   Tela de loading de jogo é, ainda por cima, nativa do 8-bit. */
const LENDO = [
  "LENDO A CASA...",
  "CONFERINDO O SOFA...",
  "CRUZANDO AS PROVAS...",
  "O DRAGAO DECIDIU.",
];

const QuizDragao = () => {
  const [fase, setFase] = useState<Fase>("intro");
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const [nomePet, setNomePet] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [telefone, setTelefone] = useState("");
  const [okContato, setOkContato] = useState(false);
  const [okImagem, setOkImagem] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroGate, setErroGate] = useState<string | null>(null);

  const [cartaUrl, setCartaUrl] = useState<string | null>(null);
  const [cartaBlob, setCartaBlob] = useState<Blob | null>(null);
  const [gerando, setGerando] = useState(false);
  const inputFoto = useRef<HTMLInputElement>(null);
  const [lendoPasso, setLendoPasso] = useState(0);

  useEffect(() => { captureEntryUtms(); }, []);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [fase, passo]);

  /* a espera é curta de propósito: o suficiente pra criar o momento, não pra irritar */
  useEffect(() => {
    if (fase !== "lendo") return;
    setLendoPasso(0);
    const t = LENDO.map((_, i) =>
      setTimeout(() => {
        setLendoPasso(i);
        if (i === LENDO.length - 1) setTimeout(() => setFase("veredito"), 620);
      }, i * 460)
    );
    return () => t.forEach(clearTimeout);
  }, [fase]);

  /* skin: antes do veredito, o tema neutro da casa; depois, a cor do dragão */
  const skin = resultado ? ` qd-${resultado.vencedor.id}` : "";
  const dragao = resultado?.vencedor ?? null;

  const numeroCarta = useMemo(
    () => (respostas.reduce((a, b) => a + b, 0) % 999) + 1,
    [respostas]
  );

  const responder = (opcao: number) => {
    const novas = [...respostas];
    novas[passo] = opcao;
    setRespostas(novas);

    if (passo < PERGUNTAS.length - 1) {
      setPasso(passo + 1);
    } else {
      setResultado(calcular(novas));
      setFase("lendo");
    }
  };

  const voltar = () => {
    if (passo > 0) setPasso(passo - 1);
    else setFase("intro");
  };

  const escolherFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFotoFile(f);
    setFotoPreview(URL.createObjectURL(f));
  };

  /* GATE — grava o lead e monta a carteira. Não bloqueia a revelação:
     se o Supabase falhar, a pessoa vê a carteira do mesmo jeito (padrão da casa
     em lib/leads.ts — UX vem antes da captura). */
  const enviarGate = async () => {
    if (!isValidPhoneBR(telefone)) { setErroGate("Confere o número, ele parece incompleto."); return; }
    if (!okContato) { setErroGate("Precisamos do seu aceite para enviar a carteira."); return; }
    if (!resultado) return;

    setErroGate(null);
    setEnviando(true);
    setGerando(true);
    setFase("carteira");

    /* upload da foto (não bloqueia o card — o card usa o File local) */
    let photoUrl: string | null = null;
    if (fotoFile) {
      try { photoUrl = (await uploadProfilePhoto(fotoFile)).url; } catch { photoUrl = null; }
    }

    void submitLead({
      phone: telefone,
      /* o gate pede só o telefone (decisão do brief) — o nome que temos é o do pet */
      name: nomePet || "Tutor",
      firstQuizId: "quiz-qual-dragao",
      firstQuizResultKey: resultado.vencedor.id,
      firstQuizResultLabel: resultado.vencedor.nome,
      allResults: {
        placar: resultado.placar,
        top4: resultado.top4.map((t) => ({ id: t.dragao.id, pontos: t.pontos })),
        respostas,
        nome_pet: nomePet || null,
        especie: "cao",
        consentimento_contato: okContato,
        consentimento_imagem: okImagem,
      },
      photoUrl,
    });

    try {
      const blob = await gerarCarteira({
        dragao: resultado.vencedor,
        top4: resultado.top4,
        fotoFile,
        nomePet,
        numero: numeroCarta,
      });
      setCartaBlob(blob);
      setCartaUrl(URL.createObjectURL(blob));
    } catch {
      setCartaUrl(null);
    } finally {
      setGerando(false);
      setEnviando(false);
    }
  };

  const compartilhar = async () => {
    if (!cartaBlob || !dragao) return;
    const file = new File([cartaBlob], `carteira-${dragao.id}.png`, { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      try {
        /* O LINK VAI JUNTO com a imagem, e não é detalhe: no WhatsApp — que é o
           canal da casa — quem recebe ganha um link clicável e não precisa digitar
           a URL do card. No Story a URL impressa segue sendo o único caminho.
           (Berger, cap. Público: o resíduo tem que dizer sozinho onde ir.) */
        await navigator.share({
          files: [file],
          text: `${dragao.marca}\n\nDescubra o dragão do seu: ${QUIZ_URL}`,
        });
        return;
      } catch { /* cancelou */ }
    }
    baixar();
  };

  const baixar = () => {
    if (!cartaUrl || !dragao) return;
    const a = document.createElement("a");
    a.href = cartaUrl;
    a.download = `carteira-${dragao.id}.png`;
    a.click();
  };

  return (
    <div className={`qsd8 cf-pink qd${skin}`}>
      <PageMeta
        title="Que dragão mora na sua casa? — Comida de Dragão"
        description="Seis perguntas sobre o seu cachorro. No fim, o veredito do Dragão e a carteira dele, com a foto, pra você guardar."
        image="/assets/images/produtos/kit-caes.png"
      />

      <img className="qsd8-bg" src="/assets/bg-clouds.jpg" alt="" aria-hidden="true" />

      <div className="qsd8-wrap qd-wrap">
        {/* ══ INTRO ═══════════════════════════════════════════════ */}
        {fase === "intro" && (
          <>
            {/* o topo repete a gramática do card: pílula, título com sombra dura,
                sparkles nos lados. A caixa creme entra só com o texto. */}
            <div className="qd-pill-wrap">
              <span className="qd-pill">comidadedragao.com.br/dragao</span>
            </div>
            <div className="qd-sparks">
              <h1 className="qd-display">Que dragão mora na sua casa?</h1>
            </div>

            <Card>
            <p className="qsd8-sub" style={{ marginTop: 14 }}>
              O Dragão vê tudo. Inclusive o que acontece na sua casa quando ninguém está olhando.
            </p>
            <p className="qsd8-sub">
              Seis perguntas sobre o seu cachorro. No fim, o veredito — e a <strong>carteira dele</strong>,
              com a foto, pra você guardar.
            </p>
            <div className="qd-icons" aria-hidden="true">
              {DRAGOES.map((d) => (
                <img key={d.id} src={`${ICON}/${d.icone}`} alt="" />
              ))}
            </div>
              <button className="qsd8-btn" onClick={() => setFase("quiz")}>Começar →</button>
              <div className="qd-eta">leva 1 minuto</div>
            </Card>
          </>
        )}

        {/* ══ AS 6 PERGUNTAS ══════════════════════════════════════ */}
        {fase === "quiz" && (
          <Card faixa={`PERGUNTA ${passo + 1} DE ${PERGUNTAS.length}`}>
            <Progresso passo={passo} />
            <h2 className="qd-pergunta">{PERGUNTAS[passo].titulo}</h2>
            <div className="qd-opcoes">
              {PERGUNTAS[passo].opcoes.map((op, i) => (
                <button
                  key={i}
                  className={`qd-opcao${respostas[passo] === i ? " on" : ""}`}
                  /* stagger: as opções não assentam todas no mesmo frame
                     (Thomas & Johnston, princípio 5 — follow-through) */
                  style={{ ["--i" as string]: i }}
                  onClick={() => responder(i)}
                >
                  <span className="qd-opcao-key">{String.fromCharCode(65 + i)}</span>
                  <span className="qd-opcao-txt">
                    {/* duas alturas: a 1ª linha é o que se escaneia pra decidir,
                        a 2ª é a piada — recompensa de quem lê, nunca obstáculo */}
                    <b>{op.escolha}</b>
                    {op.eco && <em>{op.eco}</em>}
                  </span>
                </button>
              ))}
            </div>
            <button className="qd-voltar" onClick={voltar}>← voltar</button>
          </Card>
        )}

        {/* ══ LENDO — a antecipação ═══════════════════════════════ */}
        {fase === "lendo" && (
          <Card faixa="O DRAGAO ESTA LENDO">
            <div className="qd-lendo">
              <div className="qd-lendo-txt">{LENDO[lendoPasso]}</div>
              <div className="qd-lendo-barra"><i /></div>
            </div>
          </Card>
        )}

        {/* ══ VEREDITO (teaser — ainda sem a carteira) ═════════════ */}
        {fase === "veredito" && dragao && (
          <Card faixa={`E ${dragao.nomePix}`}>
            {/* sem acento de proposito: a Press Start 2P nao tem glifo de maiuscula acentuada */}
            <div className="qd-eyebrow">O DRAGAO JA DECIDIU.</div>
            <div className="qd-reveal">
              <Stickers dragao={dragao} />
              <img src={`${ICON}/${dragao.icone}`} alt="" className="qd-reveal-ico" />
              <h2 className="qd-nome">{dragao.nomePix}</h2>
              <div className="qd-epiteto">{dragao.epiteto}</div>
            </div>
            <p className="qd-carta">{dragao.completa}</p>
            <p className="qsd8-sub" style={{ marginTop: 18 }}>
              Ele só não solta a carteira antes de ver a cara dele.
            </p>
            <button className="qsd8-btn" onClick={() => setFase("foto")}>Subir a foto →</button>
          </Card>
        )}

        {/* ══ FOTO + NOME DO PET ══════════════════════════════════ */}
        {fase === "foto" && dragao && (
          <Card faixa="A FOTO DA CARTEIRA">
            <h2 className="qd-pergunta">A foto que vai na carteira</h2>
            <p className="qsd8-sub">
              Escolhe uma em pé, com ele bem visível. A carteira é vertical.
            </p>

            <label className="qd-label" htmlFor="qd-nome-pet">Como ele se chama?</label>
            <input
              id="qd-nome-pet"
              className="qd-input"
              value={nomePet}
              onChange={(e) => setNomePet(e.target.value)}
              placeholder="Nome do seu cachorro"
              maxLength={24}
            />

            <button className="qsd8-btn ghost qd-upload" onClick={() => inputFoto.current?.click()}>
              {fotoPreview ? "Trocar a foto" : "Escolher a foto"}
            </button>
            <input
              ref={inputFoto}
              type="file"
              accept="image/*"
              onChange={escolherFoto}
              style={{ display: "none" }}
            />

            {fotoPreview && (
              <div className="qd-preview">
                <img src={fotoPreview} alt="Prévia da foto do pet" />
              </div>
            )}

            <button
              className="qsd8-btn"
              disabled={!fotoFile || !nomePet.trim()}
              onClick={() => setFase("gate")}
            >
              Continuar →
            </button>
          </Card>
        )}

        {/* ══ 🔴 GATE — HUMOR ZERO. Objetivo é ação. ══════════════ */}
        {fase === "gate" && dragao && (
          <Card faixa="PRA ONDE MANDAMOS">
            <h2 className="qd-pergunta">
              {/* "de <nome>" e nao "do/da": nome de pet nao tem genero confiavel pela terminacao */}
              Pra onde a gente manda a carteira {nomePet ? `de ${nomePet}` : "do seu cachorro"}?
            </h2>

            <label className="qd-label" htmlFor="qd-tel">WhatsApp com DDD</label>
            <input
              id="qd-tel"
              className="qd-input"
              inputMode="numeric"
              value={telefone}
              onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
              placeholder="(11) 91234-5678"
            />

            <label className="qd-check">
              <input type="checkbox" checked={okContato} onChange={(e) => setOkContato(e.target.checked)} />
              <span>Aceito receber mensagens da Comida de Dragão no WhatsApp.</span>
            </label>
            <label className="qd-check">
              <input type="checkbox" checked={okImagem} onChange={(e) => setOkImagem(e.target.checked)} />
              <span>Autorizo o uso da foto do meu pet nas redes da Comida de Dragão.</span>
            </label>

            {erroGate && <div className="qd-erro">{erroGate}</div>}

            <button className="qsd8-btn" onClick={enviarGate} disabled={enviando}>
              {enviando ? "Enviando…" : "Ver a carteira"}
            </button>
            <div className="qd-mini">Você pode pedir pra sair quando quiser.</div>
          </Card>
        )}

        {/* ══ A CARTEIRA ══════════════════════════════════════════ */}
        {fase === "carteira" && dragao && (
          <>
            <Card faixa={`A CARTEIRA DE ${(nomePet || "SEU DRAGAO").toUpperCase()}`}>
              {gerando && <div className="qd-gerando">Montando a carteira…</div>}
              {cartaUrl && (
                <>
                  <img className="qd-carta-img" src={cartaUrl} alt={`Carteira do ${nomePet}: ${dragao.nome}`} />
                  <div className="qd-acoes">
                    <button className="qsd8-btn" onClick={compartilhar}>Compartilhar</button>
                    <button className="qsd8-btn ghost" onClick={baixar}>Salvar</button>
                  </div>
                  <p className="qd-marca">{dragao.marca}</p>

                  {/* COLEÇÃO — Berger (moeda social): status só vira conversa se for
                      LEGÍVEL na hora. Aqui a raridade é estrutural e verdadeira: a
                      carteira mostra 4 dos 6, então dois dragões ficam de fora da SUA.
                      Nada de porcentagem inventada — o que se diz aqui é o que é. */}
                  <div className="qd-colecao">
                    <div className="qd-colecao-tit">OS 6 DRAGOES</div>
                    <div className="qd-colecao-linha">
                      {DRAGOES.map((d) => {
                        const naSua = resultado?.top4.some((t) => t.dragao.id === d.id);
                        return (
                          <span
                            key={d.id}
                            className={`qd-colecao-ico${d.id === dragao.id ? " eu" : naSua ? " tem" : ""}`}
                            title={d.nome}
                          >
                            <img src={`${ICON}/${d.icone}`} alt={d.nome} />
                          </span>
                        );
                      })}
                    </div>
                    <div className="qd-colecao-nota">
                      Dois ficaram de fora da sua carteira. Cada casa tem a sua.
                    </div>
                  </div>
                </>
              )}
              {!gerando && !cartaUrl && (
                <p className="qsd8-sub">
                  Não deu pra montar a imagem agora. Recarrega a página e tenta de novo.
                </p>
              )}
            </Card>

            {/* 🔴 CTA de produto — SECO (§0). Não colocar piada aqui. */}
            <Card faixa="A COMIDA DE DRAGAO">
              <p className="qsd8-sub" style={{ margin: 0 }}>
                A Comida de Dragão faz alimento e petisco de proteína de inseto para cães e gatos.
              </p>
              <Link className="qsd8-btn" to="/produtos" style={{ marginTop: 16, display: "inline-block" }}>
                Conhecer os produtos
              </Link>
            </Card>
          </>
        )}

        <footer className="qsd8-footer">
          <DragonLogo className="qsd8-footer-logo" />
          <nav className="qsd8-footer-nav">
            <Link to="/">Portal</Link>
            <Link to="/produtos">Produtos</Link>
            <Link to="/ciencia">Ciência</Link>
            <Link to="/oquefalam">O que falam</Link>
          </nav>
          <div className="qsd8-footer-tag">Nojento é o desperdício.</div>
        </footer>
      </div>
    </div>
  );
};

export default QuizDragao;
