import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
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
     intro → 6 perguntas → lendo → foto → A FICHA (resultado + imagem juntos)
     → telefone+consentimento so ao salvar/compartilhar

   🔴 Régua de humor (manual de comédia §0, Efeito Jon Stewart):
     perguntas e ficha = humor ALTO · gate e CTA de produto = humor ZERO.
     Onde o objetivo é AÇÃO, a peça roda seca. Não "melhorar" o gate com piada.

   Conteúdo (copy, perguntas, scoring) mora em @/data/dragoes.
   Desenho da carteira mora em @/lib/carteira — é o que se troca quando os
   templates da Bianca chegarem.
   ────────────────────────────────────────────────────────────── */

const ICON = "/assets/quiz-dragoes";

/* 🔴 A MESMA URL QUE ESTÁ IMPRESSA NOS 6 CARDS (Canva "Card Quizzes").
   Só passa a funcionar quando existir na loja o caminho /dragao apontando pra cá.
   Se mudar aqui, mudar lá — e vice-versa. */
/* SAIDA PRA LOJA — a colecao "produtos" da Shopify (handle `produtos`, 25 itens,
   conferido na loja em 02/09). Antes o CTA final era um <Link to="/produtos">, que
   ia pra vitrine do PORTAL — e ela manda pra loja SEM utm nenhuma. A atribuicao do
   quiz morria ali. Agora sai daqui direto, com a UTM da casa.
   Vocabulario do canonico (UTM — o manual da casa, ago-26): LP interna do portal =
   utm_source `lp-<slug>` + utm_medium `lp`. Campanha e' slug escrito a mao. */
const LOJA_PRODUTOS = "https://www.comidadedragao.com.br/collections/produtos";
const UTM_FALLBACK = {
  utm_source: "lp-qual-dragao",
  utm_medium: "lp",
  utm_campaign: "quiz-qual-dragao",
};
/* buildCheckoutUrl respeita o first-touch: se a pessoa chegou por um anuncio, a UTM
   do anuncio e' que viaja, e a marca da LP entra no utm_content. So' quando nao ha
   nada e' que o fallback acima assume. */
const lojaUrl = (cta: string) => buildCheckoutUrl(LOJA_PRODUTOS, UTM_FALLBACK, cta);

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


/* barra de progresso pixelada — 6 blocos, um por pergunta */
const Progresso = ({ passo }: { passo: number }) => (
  <div className="qd-prog" aria-label={`Pergunta ${passo + 1} de 6`}>
    {PERGUNTAS.map((_, i) => <i key={i} className={i <= passo ? "on" : ""} />)}
  </div>
);

type Fase = "intro" | "quiz" | "lendo" | "foto" | "gate" | "carteira";

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

/* Fisher-Yates. A ordem das opcoes e' embaralhada uma vez por sessao: as seis
   sempre nascem na ordem canonica dos dragoes (indice = dragao), e sem embaralhar
   o mesmo dragao ficaria eternamente na letra A. Viés de posicao e' real — a
   primeira e a ultima opcao levam clique a mais so' por estarem ali. O indice
   ORIGINAL viaja junto, entao o placar nao muda: quem decide o ponto e' o indice,
   nunca a posicao na tela. */
const embaralhar = (n: number): number[] => {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const QuizDragao = () => {
  const [fase, setFase] = useState<Fase>("intro");
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  /* uma ordem por pergunta, sorteada na montagem e estavel ate' o fim do quiz —
     se re-sorteasse a cada render, as opcoes dancariam sob o dedo da pessoa */
  const [ordens] = useState<number[][]>(() => PERGUNTAS.map((q) => embaralhar(q.opcoes.length)));
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const [nomePet, setNomePet] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [telefone, setTelefone] = useState("");
  const [okContato, setOkContato] = useState(false);
  const [okImagem, setOkImagem] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroGate, setErroGate] = useState<string | null>(null);
  /* o telefone deixou de ser pedagio da revelacao: a carteira aparece pronta e o
     gate so' abre quando a pessoa QUER levar a imagem embora. Quem ja' viu o que
     ganha tem motivo pra dar o numero; quem paga antes de ver, nao. */
  const [leadOk, setLeadOk] = useState(false);
  const [acaoPendente, setAcaoPendente] = useState<null | "baixar" | "compartilhar">(null);

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
        /* 🔴 VAI DIRETO PRA FOTO. A tela de veredito existia entre "lendo" e a foto e
             era uma armadilha: ela ja' entregava o resultado, entao a pessoa se dava
             por satisfeita e saia antes de subir a foto — sem ficha, sem lead, sem
             peca pra compartilhar. Agora o resultado so' aparece JUNTO com a ficha
             pronta: a foto e' o preco de ver, e a revelacao vale a pena porque ja'
             vem com a cara dele dentro. */
            if (i === LENDO.length - 1) setTimeout(() => setFase("foto"), 620);
      }, i * 460)
    );
    return () => t.forEach(clearTimeout);
  }, [fase]);

  const dragao = resultado?.vencedor ?? null;

  /* quem está na frente AGORA — a leitura acontecendo, não só no fim.
     Só a partir da 2ª resposta: com uma só, o "líder" é ruído. */
  const lider = useMemo(() => {
    if (respostas.filter((r) => r !== undefined).length < 2) return null;
    return calcular(respostas).vencedor;
  }, [respostas]);

  /* SKIN — a cor da tela segue QUEM ESTA GANHANDO, a partir da 2a resposta.
     Nao e' decoracao: seis telas iguais nao dao progresso nenhum, e cor que muda
     sem motivo e' ruido. Aqui a cor E' a leitura acontecendo — a mesma promessa da
     home ("O Dragao ve tudo"). E no veredito ela ja' e' a cor certa, entao a
     revelacao vira confirmacao, e nao susto.
     Antes da 2a resposta: tinta, o neutro da casa. */
  const skin = resultado
    ? ` qd-${resultado.vencedor.id}`
    : lider
      ? ` qd-${lider.id}`
      : "";

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

  /* MONTA A CARTEIRA — sem pedir nada. Roda assim que a foto está escolhida. */
  const montarCarteira = async () => {
    if (!resultado) return;
    setFase("carteira");
    setGerando(true);
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
    }
  };

  /* pedido de saída: se já demos o número, executa; se não, abre o gate guardando
     a intenção, pra retomá-la assim que o lead entrar. */
  const pedirSaida = (acao: "baixar" | "compartilhar") => {
    if (leadOk) { acao === "baixar" ? baixar() : compartilhar(); return; }
    setAcaoPendente(acao);
    setFase("gate");
  };

  /* GATE — grava o lead e devolve a pessoa pra carteira, executando o que ela
     pediu. Não bloqueia nada: se o Supabase falhar, ela leva a imagem do mesmo
     jeito (padrão da casa em lib/leads.ts — UX vem antes da captura). */
  const enviarGate = async () => {
    if (!isValidPhoneBR(telefone)) { setErroGate("Confere o número, ele parece incompleto."); return; }
    if (!okContato) { setErroGate("Precisamos do seu aceite para liberar o download."); return; }
    if (!resultado) return;

    setErroGate(null);
    setEnviando(true);

    /* Upload da foto pro bucket dragon-photos. Não bloqueia a pessoa — o card já
       está montado com o File local — mas o resultado tem que ser AUDITÁVEL.
       🔴 O try/catch que estava aqui era morto: uploadProfilePhoto não lança, ela
       devolve { url, error }. Um upload que falhava virava photoUrl null em
       silêncio e ninguém no mundo ficava sabendo. Agora o erro vai pro console E
       viaja junto do lead, pra dar pra contar no banco quantas fotos se perderam
       e por quê. */
    let photoUrl: string | null = null;
    let fotoErro: string | null = null;
    if (fotoFile) {
      const up = await uploadProfilePhoto(fotoFile);
      photoUrl = up.url;
      fotoErro = up.error;
      if (up.error) console.error("[quiz-dragao] a foto NAO subiu:", up.error);
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
        foto_enviada: !!photoUrl,
        foto_erro: fotoErro,
      },
      photoUrl,
    });

    setLeadOk(true);
    setEnviando(false);
    setFase("carteira");
    const acao = acaoPendente;
    setAcaoPendente(null);
    /* deixa o React pintar a carteira antes de disparar o download/share */
    setTimeout(() => { acao === "compartilhar" ? void compartilhar() : baixar(); }, 60);
  };

  const compartilhar = async () => {
    if (!cartaBlob || !dragao) return;
    const file = new File([cartaBlob], `meu-dragao-${dragao.id}.png`, { type: "image/png" });
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
    a.download = `meu-dragao-${dragao.id}.png`;
    a.click();
  };

  return (
    <div className={`qsd8 cf-pink qd${skin}`}>
      <PageMeta
        title="Que dragão mora na sua casa? — Comida de Dragão"
        description="Seis perguntas sobre o seu cachorro. No fim, o veredito do Dragão, com a foto dele dentro, pra você guardar."
        image="/assets/images/produtos/kit-caes.png"
      />

      {/* rabiscos dos cards, nas bordas — os cards têm; as telas estavam em cor
          chapada. Puro acabamento: z-index baixo, sem clique, sem leitura. */}
      <img className="qd-rabisco topo" src="/assets/quiz-deco/rabisco.webp" alt="" aria-hidden="true" />
      <img className="qd-rabisco base" src="/assets/quiz-deco/rabisco.webp" alt="" aria-hidden="true" />

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
            {/* 🔴 A ABERTURA SEGUE A REGRA DE UM (Great Leads, Masterson & Forde):
                UMA ideia (quem manda na casa não é você), UMA emoção (o riso de se
                reconhecer), UMA cena, UM benefício, UMA ação. A versão anterior
                empilhava quatro promessas — seis perguntas, veredito, a cara dele,
                guardar — e o livro chama isso de "tossed salad": cada ponto a mais
                enfraquece os outros.
                É Story Lead, não Offer: quem chega aqui não quer comprar nada, e
                lead indireto é o que funciona com quem ainda não nomeou o próprio
                caso. A lista de três com virada no fim é a régua de comédia da casa. */}
            <p className="qsd8-sub" style={{ marginTop: 14 }}>
              Ele escolhe onde você senta, a que horas você acorda e onde você
              esconde a sua própria comida.
            </p>
            <p className="qsd8-sub">
              Responda <strong>seis perguntas</strong> e o Dragão diz quem mora aí.
              No fim, um presente — com a cara dele dentro.
            </p>
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
              {ordens[passo].map((orig, pos) => {
                const op = PERGUNTAS[passo].opcoes[orig];
                return (
                <button
                  key={orig}
                  className={`qd-opcao${respostas[passo] === orig ? " on" : ""}`}
                  /* stagger: as opções não assentam todas no mesmo frame
                     (Thomas & Johnston, princípio 5 — follow-through) */
                  style={{ ["--i" as string]: pos }}
                  /* a letra segue a POSICAO (A..F de cima pra baixo), o ponto segue
                     o indice ORIGINAL — e' o que mantem o placar intacto */
                  onClick={() => responder(orig)}
                >
                  <span className="qd-opcao-key">{String.fromCharCode(65 + pos)}</span>
                  <span className="qd-opcao-txt">
                    {/* duas alturas: a 1ª linha é o que se escaneia pra decidir,
                        a 2ª é a piada — recompensa de quem lê, nunca obstáculo */}
                    <b>{op.escolha}</b>
                    {op.eco && <em>{op.eco}</em>}
                  </span>
                </button>
                );
              })}
            </div>
            {/* a leitura em curso, na MESMA LINHA do voltar. Ficava solta no canto
                e cobria o texto da última opção — movimento e imagem na periferia
                de quem está lendo seis opções é exatamente o que a régua proíbe.
                Aqui ela ocupa espaço próprio e não disputa com nada. */}
            <div className="qd-rodape-pergunta">
              <button className="qd-voltar" onClick={voltar}>← voltar</button>
              {lider && (
                <img
                  key={lider.id}
                  className="qd-lider"
                  src={`/assets/quiz-colagem/${lider.id}.webp`}
                  alt=""
                  aria-hidden="true"
                />
              )}
            </div>
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

        {/* ══ A FOTO — e a revelacao vem junto, na tela seguinte ══ */}
        {/* ══ FOTO + NOME DO PET ══════════════════════════════════ */}
        {fase === "foto" && dragao && (
          <Card faixa="O DRAGAO DECIDIU">
            <h2 className="qd-pergunta">Sobe a cara dele pra ver o resultado.</h2>
            <p className="qsd8-sub">
              Escolhe uma em pé, com ele bem visível. A imagem é vertical.
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
              onClick={montarCarteira}
            >
              Ver o resultado →
            </button>
          </Card>
        )}

        {/* ══ 🔴 GATE — HUMOR ZERO. Objetivo é ação. ══════════════ */}
        {fase === "gate" && dragao && (
          <Card faixa="SO FALTA ISSO">
            <h2 className="qd-pergunta">
              {/* "de <nome>" e nao "do/da": nome de pet nao tem genero confiavel pela terminacao */}
              Falta só o seu WhatsApp.
            </h2>
            <p className="qsd8-sub">
              {/* 🔴 NÃO PROMETER ENVIO POR WHATSAPP — a gente não manda a imagem por lá.
                  O pedágio é o pedágio; dizer o que ele é custa menos que a mentira. */}
              Já está pronto. O download é liberado com o seu WhatsApp — é assim
              que a gente sabe quem passou por aqui.
            </p>

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
              {enviando ? "Enviando…" : acaoPendente === "compartilhar" ? "Compartilhar" : "Baixar pro story"}
            </button>
            <button className="qd-voltar" onClick={() => { setAcaoPendente(null); setFase("carteira"); }}>
              ← voltar
            </button>
            <div className="qd-mini">Você pode pedir pra sair quando quiser.</div>
          </Card>
        )}

        {/* ══ A CARTEIRA ══════════════════════════════════════════ */}
        {fase === "carteira" && dragao && (
          <>
            <Card faixa={`E ${dragao.nomePix}`}>
              {gerando && <div className="qd-gerando">Montando a carteira…</div>}
              {cartaUrl && (
                <>
                  {/* A CARTEIRA MONTA NA FRENTE DA PESSOA, em três tempos:
                      o card entra vazio > a foto encaixa no slot > a colagem cola.
                      É o momento que ela vai postar, e era o único da peça sem
                      movimento nenhum. As camadas são as mesmas do gerador, na
                      mesma ordem — o que ela vê é o que vai baixar.
                      A imagem final (cartaUrl) segue existindo pro Compartilhar
                      e pro Salvar; aqui é só a encenação. */}
                  <div className="qd-montagem" role="img"
                       aria-label={`${dragao.nome}, com a foto de ${nomePet}`}>
                    <img className="qd-m-card" src={`/assets/quiz-cards/${dragao.id}.webp`} alt="" />
                    {fotoPreview && <img className="qd-m-foto" src={fotoPreview} alt="" />}
                    <img className="qd-m-colagem" src={`/assets/quiz-overlay/${dragao.id}.webp`} alt="" />
                  </div>
                  <div className="qd-acoes">
                    <button className="qsd8-btn" onClick={() => pedirSaida("compartilhar")}>Compartilhar</button>
                    {/* o rotulo diz o FORMATO, e nao a acao: o print de celular pega a tela
                        inteira (barra do navegador, fundo, botoes) e o arquivo sai em
                        1080x1920 limpo — o tamanho exato do story. O incentivo pra baixar
                        ja' existia; so' nao estava dito em lugar nenhum. */}
                    <button className="qsd8-btn ghost" onClick={() => pedirSaida("baixar")}>Baixar pro story</button>
                  </div>
                  <p className="qd-marca">{dragao.marca}</p>

                  {/* o retrato inteiro, agora que ela ja' tem a imagem na mao.
                      O epiteto vem junto: era a unica coisa que morria com o fim da
                      tela de veredito (o nome do dragao a propria imagem ja' diz). */}
                  <div className="qd-carta-fim">
                    <div className="qd-epiteto">{dragao.epiteto}</div>
                    <p className="qd-carta">{dragao.completa}</p>
                  </div>

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
                    {/* sem frase aqui: a linha dos seis fala sozinha */}
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
              <a
                className="qsd8-btn"
                href={lojaUrl("cta-final")}
                style={{ marginTop: 16, display: "inline-block" }}
              >
                Conhecer os produtos
              </a>
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
