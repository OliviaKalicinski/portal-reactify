/* ──────────────────────────────────────────────────────────────
   QUIZ "QUE DRAGÃO MORA NA SUA CASA?" — conteúdo (fonte única)

   Copy v2.1, revisada contra o "Comédia — manual da casa (24-08-26)".
   Doc: PROJETOS/Quiz - Qual Dragão/copy/copy-v2-passada-no-manual-de-comedia-2026-09-01.md

   Regras que moram nesta estrutura e não podem se perder:
   - A ordem das opções é SEMPRE a mesma dos 6 dragões (índice = dragão).
   - Cada opção vale +1 para o dragão do mesmo índice.
   - A carteira mostra o TOP-4: 2 dragões sempre ficam de fora (carta única por pet).
   - Empate no 1º lugar → decide a resposta da pergunta 6 (auto-declarada).
   - Título da carteira vai SEM ACENTO (Press Start 2P não tem glifo acentuado).
   ────────────────────────────────────────────────────────────── */

export type DragaoId = "devorador" | "destruidor" | "soberano" | "adormecido" | "guardiao" | "grudento";

export interface Dragao {
  id: DragaoId;
  nome: string;          /* "O DEVORADOR" — com acento, para HTML */
  nomePix: string;       /* "O DEVORADOR" — SEM acento, para canvas/pixel */
  epiteto: string;
  /* corpo da carta, 2 versões (a Bianca escolhe qual entra no template) */
  completa: string;
  curta: string;
  confissao: string;     /* a frase grande do topo do card */
  marca: string;         /* gancho de compartilhamento */
  conector: string;      /* a única piada da carta — não empilhar outra em cima */
  cor: string;           /* fundo do card — LIDO DO CANVA, nao inventar */
  corSlot: string;       /* cor do quadro da foto naquele card */
  corEscura: string;     /* bevel/sombra */
  textoClaro?: boolean;  /* Soberano: texto branco sobre o acento */
  icone: string;         /* /assets/quiz-dragoes/<arquivo> — o DRAGAO daquele
                            arquetipo, recortado da colagem que a Bianca fez no Canva.
                            Nao usar pixel-icon generico: cada dragao tem o seu. */
  /* Stickers em /assets/quiz-stickers/<id>/, RECORTADOS das páginas do Canva
     (o plano Free não exporta PNG transparente; o fundo era branco puro, então o
     alpha foi feito por código).
     `stickers` = quantos existem · `stickersUsar` = quais entram na tela, na ordem.
     A escolha é a dedo e tem motivo: cada kit traz um GATO e a LOGO recortada, que
     são universais da colagem — o gato confunde num quiz de cachorro e a logo
     cortada fica suja. Ficam os temáticos. */
  stickers: number;
  stickersUsar: number[];
}

/* ORDEM CANÔNICA — não reordenar: o índice é o scoring. */
export const DRAGOES: Dragao[] = [
  {
    id: "devorador",
    nome: "O DEVORADOR",
    nomePix: "O DEVORADOR",
    epiteto: "Localizador de esconderijos · nível lendário",
    completa:
      "Você já trocou o esconderijo três vezes. Ele achou nas três. Hoje o pacote mora na geladeira, atrás da caixa de ovos — e ele senta de frente pra porta esperando você errar uma vez. A casa é sua. A cozinha não é mais.",
    curta:
      "Trocou o esconderijo três vezes. Ele achou nas três. Hoje o pacote mora na geladeira e ele senta de frente pra porta, esperando você errar.",
    confissao: "ESCONDO COMIDA DENTRO DA MINHA PRÓPRIA CASA",
    marca: "Marca quem esconde comida dentro da própria casa.",
    conector: "o esconderijo (você guarda comida na geladeira → você se escondeu dele)",
    cor: "#FFCC00",
    corEscura: "#B38F00",
    corSlot: "#37EB2C",
    icone: "devorador.webp",
    stickers: 6,
    stickersUsar: [1, 5, 6, 3],
  },
  {
    id: "destruidor",
    nome: "O DESTRUIDOR",
    nomePix: "O DESTRUIDOR",
    epiteto: "Demolição com curadoria",
    completa:
      "O brinquedo indestrutível está inteiro até hoje, num canto, sem uma marca. Quem não sobreviveu foi o chinelo esquerdo, o controle da TV e um pedaço do rodapé. Não é bagunça: é curadoria. Ele destrói exatamente o que você ama.",
    curta:
      "O brinquedo indestrutível está intocado. O chinelo esquerdo, o controle e o rodapé não tiveram a mesma sorte. Não é bagunça: é curadoria.",
    confissao: "COMPREI O INDESTRUTÍVEL. ELE ESCOLHEU O RODAPÉ",
    marca: "Marca quem ainda acredita em brinquedo indestrutível.",
    conector: "o brinquedo indestrutível (comprado pra ele destruir → é o único sobrevivente)",
    cor: "#F45F14",
    corEscura: "#A83D08",
    corSlot: "#6A9DFF",
    icone: "destruidor.webp",
    stickers: 6,
    stickersUsar: [1, 4, 6, 3],
  },
  {
    id: "soberano",
    nome: "O SOBERANO",
    nomePix: "O SOBERANO",
    epiteto: "Dono da casa · você é o inquilino",
    completa:
      "Ele tem o melhor lugar do sofá — aquele com a marca do corpo dele afundada na almofada. Você senta na ponta. Já pediu licença duas vezes hoje pra pegar o controle. A escritura está no seu nome; a casa, não.",
    curta:
      "O melhor lugar do sofá é dele, com a marca do corpo afundada na almofada. Você senta na ponta e já pediu licença duas vezes hoje.",
    confissao: "PEÇO LICENÇA PRA SENTAR NO MEU SOFÁ",
    marca: "Marca quem senta na ponta do próprio sofá.",
    conector: "a escritura (a casa é sua no papel → no papel só)",
    cor: "#FF0066",
    corEscura: "#B0004A",
    corSlot: "#37EB2C",
    textoClaro: true,
    icone: "soberano.webp",
    stickers: 6,
    stickersUsar: [1, 5, 6, 3],
  },
  {
    id: "adormecido",
    nome: "O ADORMECIDO",
    nomePix: "O ADORMECIDO",
    epiteto: "Vinte horas por dia · a casa anda na ponta do pé",
    completa:
      "Vinte horas por dia: acorda pra comer, dorme pra digerir. Você já ficou uma hora com o braço dormente e com fome, sem levantar, porque ele estava confortável. A casa inteira anda na ponta do pé. Ele nunca pediu isso.",
    curta:
      "Vinte horas por dia. Você já ficou uma hora com o braço dormente, com fome, sem levantar — porque ele estava confortável. Ele nunca pediu isso.",
    confissao: "FIQUEI UMA HORA SEM LEVANTAR PRA NÃO ACORDAR ELE",
    marca: "Marca quem já ficou uma hora sem levantar.",
    conector: "o incômodo que ninguém pediu (ele é o preguiçoso → quem não descansa é você)",
    cor: "#0044C5",
    corEscura: "#002E85",
    corSlot: "#FFCC00",
    icone: "adormecido.webp",
    stickers: 8,
    stickersUsar: [1, 3, 4, 7],
  },
  {
    id: "guardiao",
    nome: "O GUARDIÃO",
    nomePix: "O GUARDIAO",
    epiteto: "Cem por cento de eficácia contra o que não existe",
    completa:
      "Late pro entregador, pro vento e pra folha que caiu lá fora. Nunca entrou um ladrão nesta casa — ele considera isso currículo. Quem pediu desculpa pro entregador três vezes esta semana foi você.",
    curta:
      "Late pro entregador, pro vento, pra folha que caiu. Nunca entrou um ladrão — ele considera isso currículo.",
    confissao: "JÁ PEDI DESCULPA PRO ENTREGADOR TRÊS VEZES ESTA SEMANA",
    marca: "Marca quem pede desculpa pro entregador.",
    conector: "\"nunca entrou um ladrão\" (coincidência → currículo)",
    cor: "#37EB2C",
    corEscura: "#1F9E18",
    corSlot: "#0044C5",
    icone: "guardiao.webp",
    stickers: 7,
    stickersUsar: [1, 3, 4, 7],
  },
  {
    id: "grudento",
    nome: "O GRUDENTO",
    nomePix: "O GRUDENTO",
    epiteto: "Escolta particular · não reconhece porta fechada",
    completa:
      "Você não fecha a porta do banheiro há dois anos. Não porque ele chora — porque é mais rápido assim. Ele te segue do sofá pra cozinha e da cozinha pro sofá, todo dia, no mesmo trajeto. Você chama isso de amor. Ele chama de escolta.",
    curta:
      "Você não fecha a porta do banheiro há dois anos. Não porque ele chora — porque é mais rápido assim. Você chama isso de amor; ele chama de escolta.",
    confissao: "NÃO FECHO A PORTA DO BANHEIRO HÁ DOIS ANOS",
    marca: "Marca quem não fecha mais a porta do banheiro.",
    conector: "a porta do banheiro (amor → escolta)",
    cor: "#FF3C2F",
    corEscura: "#B02218",
    corSlot: "#0044C5",
    icone: "grudento.webp",
    stickers: 8,
    stickersUsar: [2, 5, 3, 6],
  },
];

export const byId = (id: DragaoId) => DRAGOES.find((d) => d.id === id)!;

/* ── AS 6 PERGUNTAS ────────────────────────────────────────────
   6 opções cada, na ordem canônica dos dragões. A 6ª é a confissão:
   além de desempatar, é onde o tutor faz a piada contra si mesmo — o que
   autoriza a confissão no topo do card (manual §2, a regra das três pessoas). */
export interface Pergunta {
  titulo: string;
  janela: string;   /* nome na barra de título da janela */
  /* 6 opções na ordem dos DRAGOES. `escolha` é o que se escaneia; `eco` é a piada.
     A separação é de HIERARQUIA, não de conteúdo (Krug, cap. 3): quem decide lê a
     primeira linha; quem lê a segunda ganha o riso. Cortar o eco devolveria a
     opção à descrição seca do pet — que é o defeito que a revisão de comédia tirou. */
  opcoes: Array<{ escolha: string; eco?: string }>;
}

export const PERGUNTAS: Pergunta[] = [
  {
    titulo: "Você chega em casa. O que acontece nos primeiros dez segundos?",
    janela: "CHEGADA.EXE",
    opcoes: [
      { escolha: "O bolo que você trouxe não chegou na mesa.", eco: "Você ainda está com a chave na mão." },
      { escolha: "Alguma coisa que você gostava muito foi desintegrada.", eco: "Você ainda não sabe o quê." },
      { escolha: "Ele levanta a cabeça e espera você ir até lá.", eco: "A realeza não se desloca." },
      { escolha: "Ele nem levanta.", eco: "Você confere se está respirando." },
      { escolha: "Late antes de reconhecer você.", eco: "Depois finge que sabia." },
      { escolha: "Chora como se você tivesse sumido.", eco: "Você foi ao mercado." },
    ],
  },
  {
    titulo: "Chegou comida nova. Qual é a cena?",
    janela: "COMIDA.EXE",
    opcoes: [
      { escolha: "Ele comeu antes de você abrir.", eco: "Você ainda está com a tesoura na mão." },
      { escolha: "O pacote foi rasgado. A comida, não.", eco: "O plástico era o alvo." },
      { escolha: "Cheirou, olhou pra você e foi embora.", eco: "Você se sentiu julgado." },
      { escolha: "Só levantou quando ouviu o pote.", eco: "Foi o mais rápido que ele foi hoje." },
      { escolha: "Latiu pro pacote.", eco: "Até ter certeza de que era seguro." },
      { escolha: "Só come se você ficar do lado.", eco: "Você fica." },
    ],
  },
  {
    titulo: "O que você já teve que comprar de novo por causa dele?",
    janela: "PREJUIZO.EXE",
    opcoes: [
      { escolha: "O seu almoço.", eco: "Você pediu de novo pelo aplicativo." },
      { escolha: "O controle da TV.", eco: "Este é o terceiro." },
      { escolha: "Um puff, pra você sentar.", eco: "O sofá já tem dono." },
      { escolha: "Uma caminha. Depois uma maior. Depois outra.", eco: "Ele dorme na sua." },
      { escolha: "A cortina.", eco: "Ele precisa ver a rua." },
      { escolha: "A maçaneta do banheiro.", eco: "Ele aprendeu a abrir." },
    ],
  },
  {
    titulo: "Você senta no sofá pra comer. Cadê ele?",
    janela: "SOFA.EXE",
    opcoes: [
      { escolha: "Sentado na sua frente, sem piscar.", eco: "Ele sabe esperar." },
      { escolha: "Passou correndo e derrubou o seu copo.", eco: "Ele nem viu." },
      { escolha: "No lugar que era o seu.", eco: "Você está na ponta." },
      { escolha: "Do outro lado, apagado.", eco: "Nem registrou que você sentou." },
      { escolha: "Na janela, de costas pra você.", eco: "Trabalhando." },
      { escolha: "Encostado em você.", eco: "Com o sofá inteiro vazio do lado." },
    ],
  },
  {
    titulo: "A campainha toca.",
    janela: "CAMPAINHA.EXE",
    opcoes: [
      { escolha: "Só vai se a sacola cheirar a comida.", eco: "Aí ele chega na porta antes de você." },
      { escolha: "Derruba alguma coisa no caminho.", eco: "Sempre derruba." },
      { escolha: "Nem vira a cabeça.", eco: "Você que atenda." },
      { escolha: "Abriu um olho.", eco: "E reconsiderou." },
      { escolha: "ALERTA MÁXIMO.", eco: "Você já pede desculpa antes de abrir." },
      { escolha: "Corre pra você.", eco: "Não pra porta." },
    ],
  },
  {
    titulo: "Pra fechar: o que você já fez por causa dele?",
    janela: "CONFISSAO.EXE",
    /* a confissao agora tem eco como as outras — a quebra de ritmo custava mais
       do que marcava, e o eco e' onde a piada mora (decisao da Olivia, 02-09) */
    opcoes: [
      { escolha: "Escondi comida dentro da minha própria casa.", eco: "Na geladeira. Atrás dos ovos." },
      { escolha: "Escondi um estrago da visita.", eco: "Tem uma almofada virada até hoje." },
      { escolha: "Pedi licença pra sentar no meu sofá.", eco: "Ele não respondeu." },
      { escolha: "Fiquei uma hora sem levantar pra não acordar ele.", eco: "Com fome." },
      { escolha: "Pedi desculpa pro entregador.", eco: "De novo." },
      { escolha: "Parei de fechar a porta do banheiro.", eco: "Foi mais fácil." },
    ],
  },
];

/* ── SCORING ───────────────────────────────────────────────────
   respostas[i] = índice do dragão escolhido na pergunta i (0..5).
   Empate no 1º lugar → decide a resposta da pergunta 6. */
export interface Resultado {
  vencedor: Dragao;
  /* top-4 em ordem decrescente: [{ dragao, pontos }] — 2 sempre ficam de fora */
  top4: Array<{ dragao: Dragao; pontos: number }>;
  placar: Record<DragaoId, number>;
}

export function calcular(respostas: number[]): Resultado {
  const pontos = DRAGOES.map(() => 0);
  respostas.forEach((escolha) => {
    if (escolha >= 0 && escolha < DRAGOES.length) pontos[escolha] += 1;
  });

  const desempate = respostas[5]; /* a confissão */
  const ranking = DRAGOES.map((dragao, i) => ({ dragao, pontos: pontos[i], i }))
    .sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      /* empate: quem foi confessado na pergunta 6 sobe */
      if (a.i === desempate) return -1;
      if (b.i === desempate) return 1;
      return a.i - b.i;
    });

  const placar = {} as Record<DragaoId, number>;
  DRAGOES.forEach((d, i) => { placar[d.id] = pontos[i]; });

  /* TOP-4, mas nunca com barra zerada: quem não pontuou não aparece na carteira.
     Descoberto testando — respostas consistentes produziam "6, 0, 0, 0", que é
     feio e não diz nada. Mostrar só o que a casa tem torna a carta mais legível
     e mais verdadeira; o mínimo de 2 garante que sempre haja comparação. */
  const comPonto = ranking.filter((r) => r.pontos > 0);
  const top4 = (comPonto.length >= 2 ? comPonto : ranking).slice(0, 4);

  return {
    vencedor: ranking[0].dragao,
    top4: top4.map(({ dragao, pontos }) => ({ dragao, pontos })),
    placar,
  };
}
