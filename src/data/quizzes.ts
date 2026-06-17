// ─────────────────────────────────────────────────────────────────────────────
// COMIDA DE DRAGÃO — QUIZ DATA
// 5 quizzes ativos + 3 em breve = 8 slots.
// Cada quiz ativo preenche uma "dimensão" do perfil do tutor.
// ─────────────────────────────────────────────────────────────────────────────

// ── TIPOS ─────────────────────────────────────────────────────────────────────

export type ProfileDimension =
  | 'personality'
  | 'nojo'
  | 'knowledge'
  | 'eco'
  | 'pet'
  | 'revolucao'
  | 'tipo_tutor'
  | 'alimentacao';

export interface ProfileDimensionDef {
  key: ProfileDimension;
  title: string;
  icon: string;
  quizId: string;
}

export interface QuizOption {
  text: string;
  value: string;
}

export interface QuizQuestion {
  question: string;
  emoji?: string;
  options: QuizOption[];
}

export interface StatEntry {
  label: string;
  value: number; // 0–100
}

export interface QuizResult {
  label: string;
  category: string;
  description: string;
  emoji: string;
  /** Rótulo curto p/ o card compartilhável — sem mencionar produto */
  profileLabel: string;
  /**
   * Versão autossuficiente do profileLabel usada na MANCHETE e no CARD COMPARTILHÁVEL.
   * Necessária quando o label curto é ambíguo fora do contexto do quiz
   * (ex: "Tô me convencendo aos poucos" → "Tô me convencendo a comer inseto").
   * Fallback: profileLabel.
   */
  manifestoLine?: string;
  coupon?: string;
  ctaText?: string;
  ctaLink?: string;
  /** Stats estilo Super Trunfo exibidas no card compartilhável */
  stats?: StatEntry[];
}

export interface QuizDef {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  emoji: string;
  accent: string;
  hoverImage?: string;
  cardRatio: string;
  cardFlex: number;
  dimension?: ProfileDimension;
  questions: QuizQuestion[];
  results: Record<string, QuizResult>;
  computeResult: (answers: string[]) => string;
  comingSoon?: boolean;
}

// ── DIMENSÕES DO PERFIL ────────────────────────────────────────────────────────

export const PROFILE_DIMENSIONS: ProfileDimensionDef[] = [
  { key: 'personality', title: 'Tipo de Tutor',         icon: '🐲', quizId: 'que-dragao-voce-e'             },
  { key: 'nojo',        title: 'Relação com Inseto',    icon: '🤢', quizId: 'nivel-de-nojo'                 },
  { key: 'knowledge',   title: 'Conhecimento Pet Food', icon: '🎓', quizId: 'quanto-voce-sabe'              },
  { key: 'eco',         title: 'Consciência Ambiental', icon: '🌿', quizId: 'consciencia-ambiental'         },
  { key: 'pet',         title: 'Perfil do Pet',         icon: '🐾', quizId: 'qual-produto'                  },
  { key: 'revolucao',   title: 'Grau de Revolução',     icon: '🔥', quizId: 'convencional-ou-revolucionario'},
  { key: 'tipo_tutor',  title: 'Estilo de Cuidado',     icon: '🧭', quizId: 'tipo-de-tutor'                 },
  { key: 'alimentacao', title: 'Prato vs Prato',        icon: '🍽️', quizId: 'voce-ou-seu-pet'              },
];

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ 1 — QUE DRAGÃO FAMOSO VOCÊ É COMO TUTOR?
// Tipo: Personalidade. Dimensão: personality.
// ─────────────────────────────────────────────────────────────────────────────

const quizPersonality: QuizDef = {
  id: 'que-dragao-voce-e',
  title: 'QUE DRAGÃO VOCÊ É?',
  subtitle: 'O Dragão vê o tipo de tutor que você é.',
  intro: 'O Dragão vê tudo. Inclusive o tipo de tutor que você é.\n6 perguntas. Sem julgamento. Só a verdade — e ela vai te surpreender.',
  emoji: '🐲',
  accent: '#925AED',
  hoverImage: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXBhc29odzI5aHNkODdhZWRncTIyNmR1YTJ6a3RnbGQ5cmluZWdtMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gs7b2ByVWk68F32/giphy.gif',
  cardRatio: 'ratio-5-4',
  cardFlex: 5 / 4,
  dimension: 'personality',
  questions: [
    {
      question: 'TEU PET FEZ UMA BAGUNÇA ÉPICA: PAPEL HIGIÊNICO EM TIRA, TRAVESSEIRO EXPLODIDO, DOIS SAPATOS MASTIGADOS. SUA PRIMEIRA REAÇÃO:',
      emoji: '💥',
      options: [
        { text: 'Encaro o pet nos olhos tipo duelo. Quem dá mais medo?', value: 'charizard' },
        { text: 'Protocolo: fotografo o dano, investigo o motivo, ajusto as regras', value: 'smaug' },
        { text: 'Olho a carinha dele e desisto de ficar bravo. Limpo em silêncio.', value: 'banguela' },
        { text: '"MEU AMOOOOR, COMO VOCÊ PODE FAZER ISSO COM A MAMÃE?" (te amo mesmo assim)', value: 'shrek' },
        { text: 'Escorrego, xingo, grito, peço desculpa pro pet, limpo, faço story', value: 'mushu' },
        { text: 'Sento no chão do lado dele. A gente entende o que rolou sem falar', value: 'haku' },
      ],
    },
    {
      question: 'NA HORA DE ESCOLHER A COMIDA DO TEU PET, O QUE PASSA NA TUA CABEÇA?',
      emoji: '🛒',
      options: [
        { text: 'O melhor do mercado — meu pet não vai comer ração de boi comum', value: 'charizard' },
        { text: 'Planilha comparando 6 marcas: proteína, digestibilidade, preço, origem', value: 'smaug' },
        { text: 'O que ele gosta e não passa mal. A gente já sabe o que funciona.', value: 'banguela' },
        { text: 'Peço indicação pra amiga que também AMA o pet dela. Amor reconhece amor.', value: 'shrek' },
        { text: 'Troco de marca a cada 3 meses "procurando a melhor". Nunca é.', value: 'mushu' },
        { text: 'Observo a reação dele. Quando come com vontade, é o certo.', value: 'haku' },
      ],
    },
    {
      question: 'COMO TEU PET TE RECEBE QUANDO VOCÊ CHEGA EM CASA?',
      emoji: '🏠',
      options: [
        { text: 'Breve teste: encara, decide se você merece afeto hoje', value: 'charizard' },
        { text: 'Verifica se tudo em você está exatamente onde deveria estar', value: 'smaug' },
        { text: 'Chega devagar, encosta a cabeça, fica do lado. Paz.', value: 'banguela' },
        { text: 'PULA, GRITA, BABA, COMEMORA COMO SE VOCÊ TIVESSE VOLTADO DA GUERRA (foi 15min no mercado)', value: 'shrek' },
        { text: 'Coreografia inteira: pulo, giro, late, traz brinquedo, derruba copo', value: 'mushu' },
        { text: 'Te olha nos olhos 3 segundos. Escaneia. Sabe como foi teu dia.', value: 'haku' },
      ],
    },
    {
      question: 'QUAL FRASE SAI MAIS DA TUA BOCA SOBRE TEU PET?',
      emoji: '💬',
      options: [
        { text: '"Meu pet é o melhor. Briguem com isso."', value: 'charizard' },
        { text: '"Pesquisei bastante antes de decidir essa marca."', value: 'smaug' },
        { text: '"Ele é parte de mim. Sem exagero."', value: 'banguela' },
        { text: '"OLHA ESSA CARINHA GENTE, EU AMO DEMAIS." (repete 17x por dia)', value: 'shrek' },
        { text: '"A gente é um desastre ambulante. Um desastre feliz."', value: 'mushu' },
        { text: '"Ele sente quando eu tô mal. Já virou reflexo."', value: 'haku' },
      ],
    },
    {
      question: 'TEU PET TÁ MOLE, SEM APETITE, TRISTE. VOCÊ:',
      emoji: '🩺',
      options: [
        { text: 'Vou pro MELHOR vet da cidade. Se não tem bom, eu abro um.', value: 'charizard' },
        { text: 'Pesquiso sintomas em 3 fontes, chego no vet com dossiê pronto', value: 'smaug' },
        { text: 'Fico do lado, embalo, vigília 24h até ele melhorar', value: 'banguela' },
        { text: 'Choro ANTES do diagnóstico. Ligo pra 5 pessoas. Posto nos stories.', value: 'shrek' },
        { text: 'Entro em pânico GIGANTE. Resolvo tudo no fim, mas com show.', value: 'mushu' },
        { text: 'Sinto antes dele mostrar. Já tô com o vet na linha.', value: 'haku' },
      ],
    },
    {
      question: 'O QUE VOCÊ QUER DE VERDADE PRA VIDA DO TEU PET?',
      emoji: '💭',
      options: [
        { text: 'Uma vida DE CAMPEÃO — saúde forte, músculo, atitude', value: 'charizard' },
        { text: 'Tudo meticulosamente planejado pra durar o máximo, sem erro', value: 'smaug' },
        { text: 'Que a gente envelheça junto, quieto. Só nós dois, sem pressa.', value: 'banguela' },
        { text: 'Que ele nunca se sinta sozinho um SEGUNDO. Amor total, sem pausa.', value: 'shrek' },
        { text: 'Aventura todo dia. Se a vida for chata, a culpa é nossa.', value: 'mushu' },
        { text: 'Que ele confie em mim. Total. Sem precisar de palavra.', value: 'haku' },
      ],
    },
  ],
  results: {
    charizard: {
      label: 'CHARIZARD',
      category: 'O Tutor Campeão',
      description: 'Você não tá aqui pra brincar. Teu pet é o melhor do parquinho, e você faz questão de que ele saiba. Pesquisa marca, investe no melhor petisco, compara com os outros — e orgulho de tutor escorre de cada escolha.\n\nO Dragão te vê: quem vai atrás do melhor merece o melhor.',
      emoji: '🔥',
      profileLabel: 'Meu pet é campeão — e eu faço questão',
      manifestoLine: 'Meu pet é o melhor do parquinho — e eu faço questão',
      stats: [
        { label: 'ORGULHO',     value: 99 },
        { label: 'INVESTIMENTO', value: 92 },
        { label: 'COMPARAÇÃO',  value: 88 },
        { label: 'EQUILÍBRIO',  value: 48 },
      ],
      ctaText: 'VER O TOPO DA LINHA →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
    smaug: {
      label: 'SMAUG',
      category: 'O Tutor Guardião',
      description: 'Você lê rótulo, questiona ingrediente, compara marca. Teu pet é teu tesouro — e você defende com a mesma obsessão que Smaug defende o ouro de Erebor. Só que com muito mais carinho.\n\nO Dragão te vê: quem pesquisa não aceita menos que o essencial.',
      emoji: '🐲',
      profileLabel: 'Eu pesquiso tudo antes de comprar',
      manifestoLine: 'Pesquiso cada escolha antes de tomar — é como eu cuido',
      stats: [
        { label: 'PESQUISA',    value: 98 },
        { label: 'OBSESSÃO',    value: 88 },
        { label: 'CONTROLE',    value: 82 },
        { label: 'CONFIANÇA',   value: 32 },
      ],
      ctaText: 'VER A FICHA TÉCNICA →',
      ctaLink: '/biblioteca',
    },
    banguela: {
      label: 'BANGUELA',
      category: 'O Tutor Alma Gêmea',
      description: 'Vocês se entendem em silêncio. Você não precisa explicar nada, ele já sabe. Amor é profundo, calmo, sem espetáculo. Teu pet é parte de você e ponto.\n\nO Dragão te vê: quem ama em silêncio escolhe com consciência.',
      emoji: '🖤',
      profileLabel: 'Meu pet é minha alma gêmea',
      manifestoLine: 'Meu pet é minha alma gêmea — a gente se entende em silêncio',
      stats: [
        { label: 'VÍNCULO',     value: 99 },
        { label: 'CALMA',       value: 88 },
        { label: 'PROFUNDIDADE', value: 92 },
        { label: 'ESPETÁCULO',  value: 12 },
      ],
      ctaText: 'ESCOLHER COM CONSCIÊNCIA →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    shrek: {
      label: 'DRAGOA DO SHREK',
      category: 'A Tutora Declaradamente Apaixonada',
      description: 'Amor cringe, declaração pública, apelido infantil, stories sem fim. Você não tem o menor pudor — e não deveria ter. Teu pet é O AMOR DA TUA VIDA, e todo mundo tem que saber disso.\n\nO Dragão te vê: quem fala escandalosamente de amor é quem ama de verdade.',
      emoji: '💖',
      profileLabel: 'Amo meu pet sem pudor — e você lida',
      manifestoLine: 'Amo meu pet sem pudor nenhum — e quem não gostar, lida',
      stats: [
        { label: 'AMOR',        value: 99 },
        { label: 'EXPRESSÃO',   value: 98 },
        { label: 'PUDOR',       value: 2  },
        { label: 'DECLARAÇÃO',  value: 96 },
      ],
      ctaText: 'VER O QUE ELE MERECE →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    mushu: {
      label: 'MUSHU',
      category: 'O Tutor Comédia Pastelão',
      description: 'Tudo com você e teu pet vira cena. Você tenta fazer certo — mas a vida insiste em te dar material pros stories. E tá tudo bem. Teu pet adora o show.\n\nO Dragão te vê: quem faz do caos uma comédia tem mais amor do que pensa.',
      emoji: '🎭',
      profileLabel: 'Eu e meu pet: caos organizado',
      manifestoLine: 'Eu e meu pet somos caos organizado — e a gente ama assim',
      stats: [
        { label: 'CAOS',        value: 95 },
        { label: 'HUMOR',       value: 99 },
        { label: 'PLANO',       value: 18 },
        { label: 'RESILIÊNCIA', value: 85 },
      ],
      ctaText: 'DAR UM UPGRADE NO SHOW →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    haku: {
      label: 'HAKU',
      category: 'O Tutor Intuitivo',
      description: 'Você percebe antes dele mostrar. Age pelo instinto e raramente erra. Que conexão. Não precisa de grupo, de pesquisa ou de opinião — tem régua interna, e ela não falha.\n\nO Dragão te vê: intuição poderosa é superpoder raro.',
      emoji: '🌊',
      profileLabel: 'Nos entendemos sem palavras',
      manifestoLine: 'Meu pet me fala sem palavras — e eu aprendi a ouvir',
      stats: [
        { label: 'INTUIÇÃO',    value: 99 },
        { label: 'SINCRONIA',   value: 92 },
        { label: 'ANTECIPAÇÃO', value: 88 },
        { label: 'DEPENDÊNCIA', value: 15 },
      ],
      ctaText: 'SENTIR ANTES DE PENSAR →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
  },
  computeResult: (answers) => {
    const count: Record<string, number> = {};
    for (const a of answers) count[a] = (count[a] || 0) + 1;
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'banguela';
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ 2 — QUAL O SEU NÍVEL DE NOJO?
// Tipo: Diagnóstico. Dimensão: nojo.
// ─────────────────────────────────────────────────────────────────────────────

const quizNojo: QuizDef = {
  id: 'nivel-de-nojo',
  title: 'QUAL O SEU NÍVEL DE NOJO?',
  subtitle: '6 situações. Seja honesto. A gente não julga.',
  intro: 'O Dragão tem uma pergunta importante.\nNão sobre o seu pet. Sobre você.\n6 situações. Seja honesto. A gente não julga — muito. 🐉',
  emoji: '🤢',
  accent: '#FF7A00',
  hoverImage: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWpnam4wZDRibDB2b2xsY3g1ZXg3aGFtNmhzMms0dWt0M2UyMG1uYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/10FHR5A4cXqVrO/giphy.gif',
  cardRatio: 'ratio-3-4',
  cardFlex: 3 / 4,
  dimension: 'nojo',
  questions: [
    {
      question: 'O BRIGADEIRO CAIU NO CHÃO DA SUA CASA. VOCÊ:',
      emoji: '🍫',
      options: [
        { text: 'Chão é chão. Lixo na hora, sem olhar de novo.', value: '4' },
        { text: 'Analiso o ambiente — cozinha limpa passa, banheiro não', value: '3' },
        { text: 'Pego, sopro, como. Tempo é relativo.', value: '2' },
        { text: 'Regra dos 5 segundos é conservadora. 30 é o novo 5.', value: '1' },
      ],
    },
    {
      question: 'TEU PET (OU O DE UM AMIGO) PULA NO TEU ROSTO E LAMBE A TUA BOCA. PRIMEIRA REAÇÃO:',
      emoji: '👅',
      options: [
        { text: 'Corro pro banheiro. Enxaguante. Escovação. Três vezes.', value: '4' },
        { text: 'Rio nervosamente e finjo que tá tudo normal', value: '3' },
        { text: 'Dou um selinho de volta na testa dele. Justiça.', value: '2' },
        { text: 'Beijo na boca sem pensar. A gente já compartilha sofá mesmo.', value: '1' },
      ],
    },
    {
      question: 'UM AMIGO TE CONTA QUE COMEU SNACK DE GRILO NUMA FEIRA. SUA REAÇÃO HONESTA?',
      emoji: '🦗',
      options: [
        { text: '"Nunca na minha vida. Jamais. Nem me fala disso."', value: '4' },
        { text: 'Faz uma cara discreta e muda de assunto na hora', value: '3' },
        { text: '"E aí… como foi?" — curiosidade misturada com nojo', value: '2' },
        { text: '"Onde fica essa feira? Quero ir."', value: '1' },
      ],
    },
    {
      question: 'VOCÊ TÁ COMENDO NO RESTAURANTE E ACHA UM CABELO NO PRATO. AÇÃO IMEDIATA:',
      emoji: '🍝',
      options: [
        { text: 'Empurro o prato, perco a fome, nunca mais volto nesse lugar', value: '4' },
        { text: 'Chamo a garçonete, peço outro prato, sem drama', value: '3' },
        { text: 'Tiro com o garfo e sigo comendo. Fome é fome.', value: '2' },
        { text: 'Nem aviso. Proteína é proteína.', value: '1' },
      ],
    },
    {
      question: 'UMA BARATA VOA POR CIMA DA SUA CABEÇA NA SALA. AÇÃO IMEDIATA:',
      emoji: '🪳',
      options: [
        { text: 'Grito. Fujo. Evacuo o cômodo. Só volto com reforços.', value: '4' },
        { text: 'Paraliso, calculo rota de fuga, pego um sapato', value: '3' },
        { text: 'Vassoura na mão, resolvo, sigo a vida', value: '2' },
        { text: 'Observo o padrão de voo por curiosidade antes de agir', value: '1' },
      ],
    },
    {
      question: 'PETISCO DE LARVA BSF: 40% PROTEÍNA, HIPOALERGÊNICO, RASTREÁVEL. O TEU PET TÁ AMANDO. VOCÊ:',
      emoji: '🐉',
      options: [
        { text: 'Compra de olhos fechados — literalmente, pra não ver o que tá dando', value: '4' },
        { text: 'Compra, mas pede pra outra pessoa servir', value: '3' },
        { text: 'Compra, serve, e até lê a embalagem dessa vez', value: '2' },
        { text: 'Compra, serve, posta no story e ainda converte amigos', value: '1' },
      ],
    },
  ],
  results: {
    nojentissimo: {
      label: 'NOJENTÍSSIMO PREMIUM',
      category: 'Grita com a sombra de um inseto',
      description: 'Você está em boa companhia — a maioria das pessoas começa aqui. Nojo é resposta evolutiva, não é defeito.\n\nMas vale lembrar: você engole mais nojo do que reconhece (sofá que ninguém limpa, geladeira do mês passado, aquele parente que respira perto demais). O Dragão quer te ajudar a ser mais seletivo sobre o que merece susto de verdade.',
      emoji: '😱',
      profileLabel: 'Eu tenho nojo — e meu pet não liga',
      manifestoLine: 'Meu nojo é campeonato — o mundo me irrita um pouco',
      stats: [
        { label: 'CORAGEM',    value: 8  },
        { label: 'CURIOSIDADE', value: 22 },
        { label: 'ADAPTAÇÃO',  value: 15 },
        { label: 'CONVICÇÃO',  value: 62 },
      ],
      ctaText: 'VER O QUE SEU PET JÁ SABE →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    funcional: {
      label: 'NOJENTO FUNCIONAL',
      category: 'Faz, mas sofre',
      description: 'Você consegue. Não gosta, mas consegue. Engolir nojo em silêncio é uma habilidade urbana — você desenvolveu bem.\n\nA maioria das grandes mudanças (na alimentação, na higiene, em relacionamentos) começa exatamente assim: alguém fazendo careta e experimentando mesmo assim. O Dragão respeita essa coragem disfarçada.',
      emoji: '😬',
      profileLabel: 'Eu faço, mas sofro um pouco',
      manifestoLine: 'Engulo o nojo do dia a dia — mas com cara feia',
      stats: [
        { label: 'CORAGEM',    value: 42 },
        { label: 'CURIOSIDADE', value: 55 },
        { label: 'ADAPTAÇÃO',  value: 40 },
        { label: 'CONVICÇÃO',  value: 68 },
      ],
      ctaText: 'DAR O PRIMEIRO PASSO →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
    transicao: {
      label: 'EM TRANSIÇÃO',
      category: 'Curioso, mas cauteloso',
      description: 'Você está no lugar mais interessante: na fronteira entre o instinto e a razão. Pesa o nojo contra a lógica, faz perguntas, muda de ideia com um bom argumento.\n\nEsse é o perfil que mais mexe com o mundo — quem começa a questionar o próprio nojo raramente para por aí.',
      emoji: '🤔',
      profileLabel: 'Tô me convencendo aos poucos',
      manifestoLine: 'Tô me convencendo que nojo é decisão, não natureza',
      stats: [
        { label: 'CORAGEM',    value: 65 },
        { label: 'CURIOSIDADE', value: 78 },
        { label: 'ADAPTAÇÃO',  value: 62 },
        { label: 'CONVICÇÃO',  value: 72 },
      ],
      ctaText: 'OS DADOS QUE VÃO TE CONVENCER →',
      ctaLink: '/biblioteca',
    },
    quase: {
      label: 'QUASE LÁ',
      category: 'O nojo já foi embora, só falta o hábito',
      description: 'Nojo já não decide por você. Cabelo no prato, barata voando, grilo na feira — você passa por tudo sem drama, no máximo com uma piada.\n\nO Dragão vê você de olho em coisas que a maioria recusa na primeira vista. Falta só o empurrão pra virar Dragão de verdade.',
      emoji: '😏',
      profileLabel: 'O nojo já foi embora',
      manifestoLine: 'Meu nojo já foi embora — sou quase um Dragão',
      stats: [
        { label: 'CORAGEM',    value: 82 },
        { label: 'CURIOSIDADE', value: 88 },
        { label: 'ADAPTAÇÃO',  value: 80 },
        { label: 'CONVICÇÃO',  value: 82 },
      ],
      ctaText: 'TÁ ESPERANDO O QUÊ? →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
    dragao: {
      label: 'DRAGÃO DE VERDADE',
      category: 'Leva inseto pra jantar',
      description: 'Você é a pessoa que experimenta antes, explica depois e ainda converte dois amigos por semestre. Nojo virou curiosidade há muito tempo. Medo virou critério.\n\nO Dragão te reconhece. Você é da família.',
      emoji: '🐉',
      profileLabel: 'Inseto? Já convenci meia turma.',
      manifestoLine: 'Nojo não me atinge — eu ainda ensino os outros',
      stats: [
        { label: 'CORAGEM',    value: 99 },
        { label: 'CURIOSIDADE', value: 97 },
        { label: 'ADAPTAÇÃO',  value: 98 },
        { label: 'CONVICÇÃO',  value: 99 },
      ],
      coupon: 'DRAGAOVERDADE',
      ctaText: 'VER A LINHA COMPLETA →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
  },
  computeResult: (answers) => {
    const score = answers.reduce((sum, v) => sum + parseInt(v || '0'), 0);
    if (score >= 21) return 'nojentissimo';
    if (score >= 15) return 'funcional';
    if (score >= 11) return 'transicao';
    if (score >= 8)  return 'quase';
    return 'dragao';
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ 3 — QUANTO VOCÊ SABE SOBRE O QUE SEU PET COME?
// Tipo: Trivia/Conhecimento. Dimensão: knowledge.
// ─────────────────────────────────────────────────────────────────────────────

const quizKnowledge: QuizDef = {
  id: 'quanto-voce-sabe',
  title: 'VOCÊ SABE O QUE SEU PET COME?',
  subtitle: 'O que eles não te contam na embalagem.',
  intro: 'O Dragão passou a vida inteira estudando o que entra no prato dos pets.\nE o que ele descobriu… não é bonito.\nTesta seu conhecimento — e descobre o que eles não te contam na embalagem.',
  emoji: '🎓',
  accent: '#FFE600',
  hoverImage: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXBkOThlaTJrd2gzemthdWR6OGp6YWJ0aHpkMDVsZHBleDhkNm5obiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WLbtNNR5TKJBS/giphy.gif',
  cardRatio: 'ratio-16-9',
  cardFlex: 16 / 9,
  dimension: 'knowledge',
  questions: [
    {
      question: 'FARINHA DE SUBPRODUTOS. O QUE VAI NA REAL DENTRO DA EMBALAGEM?',
      emoji: '🔍',
      options: [
        { text: 'Cortes nobres de carne que sobraram do açougue', value: 'wrong' },
        { text: 'Penas, bicos, patas, vísceras — tudo moído junto', value: 'right' },
        { text: 'Proteína vegetal vestida de proteína animal', value: 'wrong' },
        { text: 'Suplemento vitamínico com nome difícil', value: 'wrong' },
      ],
    },
    {
      question: 'NO RÓTULO: "BHT, BHA". QUE NEGÓCIO É ESSE NA RAÇÃO DO TEU PET?',
      emoji: '🧴',
      options: [
        { text: 'Nomes técnicos de proteína animal de alta qualidade', value: 'wrong' },
        { text: 'Hidroxitolueno e Hidroxianisol Butilados — conservantes que aumentam validade', value: 'right' },
        { text: 'Aminoácidos adicionados pra completar a nutrição', value: 'wrong' },
        { text: 'Classificação oficial de ração premium (tipo selo)', value: 'wrong' },
      ],
    },
    {
      question: '"FRUCTOOLIGOSSACARÍDEOS" NA EMBALAGEM. NA REAL, ISSO É:',
      emoji: '🧬',
      options: [
        { text: 'Açúcar disfarçado com nome chique', value: 'wrong' },
        { text: 'Fibra prebiótica que alimenta as bactérias boas do intestino', value: 'right' },
        { text: 'Aromatizante pra ração ficar mais saborosa', value: 'wrong' },
        { text: 'Conservante industrial com nome pra intimidar', value: 'wrong' },
      ],
    },
    {
      question: 'DIGESTIBILIDADE MÉDIA DE UMA RAÇÃO PREMIUM. CHUTA:',
      emoji: '📊',
      options: [
        { text: '95–99% — basicamente tudo vira nutriente', value: 'wrong' },
        { text: '85–90% — parece razoável, né?', value: 'wrong' },
        { text: '70–80% — sim, o resto vira cocô', value: 'right' },
        { text: 'Depende muito do pet, não tem média confiável', value: 'wrong' },
      ],
    },
    {
      question: 'VOCÊ LÊ "BACILLUS LICHENIFORMIS" NA EMBALAGEM. QUAL SUA REAÇÃO HONESTA?',
      emoji: '🦠',
      options: [
        { text: 'Jogo a ração fora agora — bactéria na comida?!', value: 'wrong' },
        { text: 'Comemoro discretamente — é probiótico que ajuda a digestão', value: 'right' },
        { text: 'Devolvo na loja, com certeza é contaminação', value: 'wrong' },
        { text: 'Mando foto pro vet antes de dar pro pet', value: 'wrong' },
      ],
    },
    {
      question: 'PRA PRODUZIR 1KG DE PROTEÍNA BOVINA, QUANTA ÁGUA VAI EMBORA?',
      emoji: '💧',
      options: [
        { text: '500 litros, exagero chamar de muito', value: 'wrong' },
        { text: 'Uns 3.000 litros, deve ser por aí', value: 'wrong' },
        { text: 'Cerca de 8.000 litros', value: 'wrong' },
        { text: 'Mais de 15.000 litros — sim, quinze mil', value: 'right' },
      ],
    },
  ],
  results: {
    descoberta: {
      label: 'TUTOR EM DESCOBERTA',
      category: '0–2 acertos',
      description: 'Não se preocupa — a maioria dos tutores está exatamente aqui. A indústria de ração não foi construída pra ser fácil de entender. Embalagem bonita, palavras difíceis, e o essencial fica escondido na lista de ingredientes.\n\nAgora que você sabe um pouco mais, o próximo passo é simples: escolha com mais informação.',
      emoji: '🐣',
      profileLabel: 'Aprendi mais hoje do que esperava',
      manifestoLine: 'Aprendi mais sobre pet food hoje do que esperava',
      stats: [
        { label: 'CONHECIMENTO', value: 22 },
        { label: 'CRITÉRIO',     value: 38 },
        { label: 'CETICISMO',    value: 32 },
        { label: 'CONSCIÊNCIA',  value: 42 },
      ],
      ctaText: 'CONHECER A COMIDA DE DRAGÃO →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    consciente: {
      label: 'TUTOR CONSCIENTE',
      category: '3–4 acertos',
      description: 'Você pesquisa mais que a média. Sabe que rótulo bonito não é garantia de qualidade, e já questionou pelo menos uma vez o que tem na ração do seu pet. Esse tipo de tutor é raro — e exatamente quem a Comida de Dragão foi feita pra atender.\n\nUm ingrediente. Uma origem. Tudo rastreável da biofábrica até o prato.',
      emoji: '🔍',
      profileLabel: 'Eu leio cada rótulo. Todo rótulo.',
      stats: [
        { label: 'CONHECIMENTO', value: 68 },
        { label: 'CRITÉRIO',     value: 75 },
        { label: 'CETICISMO',    value: 72 },
        { label: 'CONSCIÊNCIA',  value: 78 },
      ],
      ctaText: 'POR QUE BSF É DIFERENTE →',
      ctaLink: '/biblioteca',
    },
    dragao: {
      label: 'TUTOR DRAGÃO',
      category: '5–6 acertos',
      description: 'Você já deveria fazer parte do nosso time. Conhece os bastidores do mercado, entende de digestibilidade, sabe o que "farinha de subprodutos" realmente significa e não aceita resposta vaga de fabricante.\n\nO Dragão te reconhece. E tem muito orgulho.',
      emoji: '🐉',
      profileLabel: 'Sei o que tem na ração — e mudei',
      stats: [
        { label: 'CONHECIMENTO', value: 97 },
        { label: 'CRITÉRIO',     value: 99 },
        { label: 'CETICISMO',    value: 95 },
        { label: 'CONSCIÊNCIA',  value: 98 },
      ],
      coupon: 'TUTORDRAGAO',
      ctaText: 'VER A LINHA COMPLETA →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
  },
  computeResult: (answers) => {
    const score = answers.filter((a) => a === 'right').length;
    if (score >= 5) return 'dragao';
    if (score >= 3) return 'consciente';
    return 'descoberta';
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ 4 — QUAL COMIDA DE DRAGÃO FOI FEITA PRO SEU PET?
// Tipo: Recomendação. Dimensão: pet.
// ─────────────────────────────────────────────────────────────────────────────

const quizProduto: QuizDef = {
  id: 'qual-produto',
  title: 'QUEM É TEU PET, NA REAL?',
  subtitle: 'O Dragão diagnostica e aponta o produto certo.',
  intro: 'O Dragão já viu todo tipo de bicho.\n6 perguntas rápidas — e ele aponta exatamente o que teu pet precisa. 🐉',
  emoji: '🐾',
  accent: '#FF2D78',
  hoverImage: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExODVqZWM0Y2lydzJlNmdjdGUwYzRpenp2dTNjOTJjb3BpemkwMWdjbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Fn0ysbG90HX0uj5shv/giphy.gif',
  cardRatio: 'ratio-1-1',
  cardFlex: 1,
  dimension: 'pet',
  questions: [
    {
      question: 'QUE BICHO É O TEU PET?',
      emoji: '🐾',
      options: [
        { text: 'Cachorro', value: 'cao' },
        { text: 'Gato (aka o chefe da casa)', value: 'gato' },
        { text: 'Lagarto, rã, ou outro bicho de pele estranha', value: 'reptil' },
        { text: 'Mais de um tipo — minha casa é um zoológico', value: 'multi' },
      ],
    },
    {
      question: 'O QUE VOCÊ TÁ CAÇANDO AGORA?',
      emoji: '🎯',
      options: [
        { text: 'Um petisco pra subornar o pet em treino', value: 'petisco' },
        { text: 'Um suplemento pra turbinar a ração atual', value: 'suplemento' },
        { text: 'Algo que faça diferença de verdade na saúde a longo prazo', value: 'saude' },
        { text: 'Ainda não sei — me guia, Dragão', value: 'nao-sei' },
      ],
    },
    {
      question: 'O PERFIL DO TEU PET NO DIA A DIA:',
      emoji: '⚡',
      options: [
        { text: 'Atleta. Cheio de energia. Não para um segundo.', value: 'ativo' },
        { text: 'Filósofo. Dorme 19 horas por dia e não se arrepende.', value: 'tranquilo' },
        { text: 'Sensível. Coça, alergia, barriga virada, pele irritada.', value: 'sensivel' },
        { text: 'Em recuperação — pós-cirurgia, gestação, quadro delicado', value: 'recuperacao' },
      ],
    },
    {
      question: 'ALGUMA RESTRIÇÃO DE SAÚDE QUE VOCÊ JÁ CONHECE?',
      emoji: '🩺',
      options: [
        { text: 'Cardíaco, renal ou precisa de menos gordura', value: 'cardiaco' },
        { text: 'É gato e precisa de taurina (sem ela, o coração sofre)', value: 'taurina' },
        { text: 'Alergia a frango ou bovino — o clássico', value: 'alergia' },
        { text: 'Nenhuma. Ele é um tanque.', value: 'saudavel' },
      ],
    },
    {
      question: 'COMO ELE SE COMPORTA NA HORA DE COMER?',
      emoji: '😋',
      options: [
        { text: 'Come tudo, qualquer coisa, qualquer hora. É uma máquina.', value: 'tudo' },
        { text: 'Seletivo. Recusa com elegância e te deixa na mão.', value: 'seletivo' },
        { text: 'Come a ração, mas dá pra ver que tá faltando algo', value: 'boost' },
        { text: 'É réptil — e eu quero parar de comprar grilo vivo', value: 'reptil' },
      ],
    },
    {
      question: 'O QUE MAIS TE PREOCUPA NA SAÚDE DELE HOJE?',
      emoji: '💊',
      options: [
        { text: 'Pelagem opaca, pele ressecada, baixa vitalidade', value: 'pelagem' },
        { text: 'Incluir mais nutriente natural — tipo vegetal', value: 'vegetais' },
        { text: 'Proteína de verdade, pura, sem enrolação', value: 'proteina' },
        { text: 'Um petisco que já conte como nutrição', value: 'basico' },
      ],
    },
  ],
  results: {
    original: {
      label: 'COMIDA DE DRAGÃO ORIGINAL',
      category: 'O clássico. Onde tudo começa.',
      description: 'Larvas BSF inteiras, 40% de proteína no mínimo. Serve pra cão, gato, ave, réptil, anfíbio — basicamente qualquer bicho. Petisco, ferramenta de treino E introdução ao universo Dragão.\n\nQuando o pet come, o cético do bairro cala a boca.',
      emoji: '🐛',
      profileLabel: 'Meu pet come tudo e ama tudo',
      manifestoLine: 'Meu pet come de tudo — e eu finalmente achei a marca certa',
      stats: [
        { label: 'PROTEÍNA',       value: 82 },
        { label: 'NUTRIÇÃO',       value: 78 },
        { label: 'ESPECIFICIDADE', value: 62 },
        { label: 'VITALIDADE',     value: 88 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR ORIGINAL →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
    legumes: {
      label: 'MORDIDA — LEGUMES',
      category: 'Petisco com substância, não só crocância',
      description: 'Snack assado com BSF, cenoura, cúrcuma e betacaroteno. Rico em nutriente natural, palatabilidade alta, zero frescura na hora de aceitar.\n\nPra tutor que não quer só "crocante colorido" — quer alimento que atravessa a embalagem.',
      emoji: '🥦',
      profileLabel: 'Só nutrição de verdade pra ele',
      manifestoLine: 'Pet merece nutrição de verdade — não só crocância colorida',
      stats: [
        { label: 'PROTEÍNA',       value: 75 },
        { label: 'NUTRIÇÃO',       value: 92 },
        { label: 'ESPECIFICIDADE', value: 76 },
        { label: 'VITALIDADE',     value: 85 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR MORDIDA LEGUMES →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
    spirulina: {
      label: 'MORDIDA — SPIRULINA',
      category: 'Quando a pelagem tá pedindo socorro',
      description: 'Spirulina + coco + espinafre + BSF num snack que age por dentro. Antioxidante, ficocianina, triglicerídeos de cadeia média — jargão técnico pra resultado simples: pelo bonito, imunidade firme, pet mais disposto.',
      emoji: '✨',
      profileLabel: 'Pelagem bonita começa por dentro',
      manifestoLine: 'O pelo bonito do meu pet começa por dentro',
      stats: [
        { label: 'PROTEÍNA',       value: 75 },
        { label: 'NUTRIÇÃO',       value: 90 },
        { label: 'ESPECIFICIDADE', value: 86 },
        { label: 'VITALIDADE',     value: 92 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR MORDIDA SPIRULINA →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
    integral: {
      label: 'SUPLEMENTO INTEGRAL',
      category: 'O boost diário: mistura na ração e acabou',
      description: '45% de proteína, cúrcuma e spirulina em pó. Entra na rotina sem briga. Pra cão em crescimento, muito ativo, ou pet com apetite meio assim-assim.\n\nIngrediente adicional sobe a palatabilidade — o seletivo volta a atacar o prato.',
      emoji: '💪',
      profileLabel: 'Meu pet treina como atleta',
      manifestoLine: 'Meu pet treina como atleta — e eu alimento como tal',
      stats: [
        { label: 'PROTEÍNA',       value: 92 },
        { label: 'NUTRIÇÃO',       value: 88 },
        { label: 'ESPECIFICIDADE', value: 82 },
        { label: 'VITALIDADE',     value: 96 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR SUPLEMENTO INTEGRAL →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
    concentrado: {
      label: 'SUPLEMENTO CONCENTRADO',
      category: 'Quando proteína é tudo',
      description: '55% de proteína — a maior concentração da linha — com só 9,45% de gordura. Pra recuperação, pancreatite, restrição de gordura, reconstrução muscular real.\n\nQuando o vet pede "proteína alta, gordura baixa", o produto tá aqui.',
      emoji: '🔬',
      profileLabel: 'Proteína máxima, gordura mínima',
      manifestoLine: 'Meu pet precisa de proteína máxima e gordura mínima',
      stats: [
        { label: 'PROTEÍNA',       value: 99 },
        { label: 'NUTRIÇÃO',       value: 84 },
        { label: 'ESPECIFICIDADE', value: 99 },
        { label: 'VITALIDADE',     value: 86 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR SUPLEMENTO CONCENTRADO →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
    felino: {
      label: 'SUPLEMENTO FELINO',
      category: 'Gato não é cão pequeno. Pronto.',
      description: '40% de proteína + taurina — o aminoácido que gato não fabrica sozinho. Sem ela, coração e visão do gato sofrem. Com ela, ele reina como sempre fez.\n\nPorque gato tem exigência própria — e o Dragão respeita.',
      emoji: '🐱',
      profileLabel: 'Gato não é cão pequeno. Sei disso.',
      manifestoLine: 'Meu gato não é cão pequeno — e eu sei disso',
      stats: [
        { label: 'PROTEÍNA',       value: 85 },
        { label: 'NUTRIÇÃO',       value: 90 },
        { label: 'ESPECIFICIDADE', value: 99 },
        { label: 'VITALIDADE',     value: 88 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR SUPLEMENTO FELINO →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
    grub: {
      label: 'GRUB — ALIMENTO EM GEL',
      category: 'Pra quem tem um dragão de verdade em casa',
      description: 'Pó que vira gel com água quente. 47% proteína de 3 fontes de insetos, relação Ca:P perfeita pra réptil. Zero inseto vivo, zero odor de grilo em pote de vidro.\n\nCivilização finalmente chegou no terrário.',
      emoji: '🦎',
      profileLabel: 'Tenho um dragão de verdade em casa',
      manifestoLine: 'Eu tenho um dragão de verdade em casa',
      stats: [
        { label: 'PROTEÍNA',       value: 92 },
        { label: 'NUTRIÇÃO',       value: 82 },
        { label: 'ESPECIFICIDADE', value: 99 },
        { label: 'VITALIDADE',     value: 86 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR GRUB →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
  },
  computeResult: (answers) => {
    const [pet, , perfil, restricao, comportamento, preocupacao] = answers;
    if (pet === 'gato' || restricao === 'taurina') return 'felino';
    if (pet === 'reptil' || comportamento === 'reptil') return 'grub';
    if (restricao === 'cardiaco' || perfil === 'recuperacao') return 'concentrado';
    if (perfil === 'ativo' || comportamento === 'boost') return 'integral';
    if (preocupacao === 'proteina') return 'concentrado';
    if (preocupacao === 'pelagem' || comportamento === 'seletivo') return 'spirulina';
    if (preocupacao === 'vegetais') return 'legumes';
    if (pet === 'multi') return 'original';
    return 'original';
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ 5 — QUAL O SEU NÍVEL DE CONSCIÊNCIA AMBIENTAL?
// Tipo: Diagnóstico de hábito. Dimensão: eco.
// ─────────────────────────────────────────────────────────────────────────────

const quizEco: QuizDef = {
  id: 'consciencia-ambiental',
  title: 'SUA CONSCIÊNCIA AMBIENTAL?',
  subtitle: 'Todo mundo acha que é consciente. O Dragão testa.',
  intro: 'Todo mundo acha que é mais consciente que a média.\nO Dragão vê tudo — e resolveu testar.\n6 perguntas. Sem julgamento. Só a verdade. 🐉',
  emoji: '🌿',
  accent: '#7BFF00',
  hoverImage: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGx6NTY4bWw1ZXN4aW8wdjh1bzA4ZW8wZmNubDFhM2ZlaDN6cHR5ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cObIzBCAkFxW60ORYj/giphy.gif',
  cardRatio: 'ratio-3-4',
  cardFlex: 3 / 4,
  dimension: 'eco',
  questions: [
    {
      question: 'PRECISA IR DO TRABALHO NA PADARIA A 3 QUADRAS. COMO VOCÊ VAI?',
      emoji: '🚗',
      options: [
        { text: 'Carro. Óbvio. E ainda estaciono em vaga dupla.', value: '4' },
        { text: 'Carro, mas me sinto meio culpado a volta inteira', value: '3' },
        { text: 'A pé ou bike se o tempo ajudar', value: '2' },
        { text: 'A pé sempre. Quem vai de carro a 3 quadras?', value: '1' },
      ],
    },
    {
      question: 'COMO VOCÊ TRATA O LIXO DA SUA CASA, NA REAL?',
      emoji: '♻️',
      options: [
        { text: 'Tudo num saco só. A vida é curta demais pra separar papelão.', value: '4' },
        { text: 'Separo quando lembro. Tem semanas que sim, tem semanas que sumiu.', value: '3' },
        { text: 'Separo reciclável sempre. Composto eu tentei e desisti.', value: '2' },
        { text: 'Separo, composto, e já convenci 2 vizinhos a fazer igual', value: '1' },
      ],
    },
    {
      question: 'CHEGOU A HORA DO MERCADO. O QUE VOCÊ LEVA?',
      emoji: '🛍️',
      options: [
        { text: 'Nada. Uso as sacolinhas plásticas do próprio mercado.', value: '4' },
        { text: 'Ecobag quando lembro (raramente). Fica na casa da minha mãe.', value: '3' },
        { text: 'Ecobag sempre no carro. Mas ainda esqueço às vezes.', value: '2' },
        { text: 'Ecobag, potes reutilizáveis e ainda recuso embalagem extra', value: '1' },
      ],
    },
    {
      question: 'COMO É A CARNE NA SUA ROTINA?',
      emoji: '🥩',
      options: [
        { text: 'Toda refeição. Se pudesse, no café da manhã também.', value: '4' },
        { text: 'Como bastante. Já ouvi que deveria reduzir — e realmente ouvi.', value: '3' },
        { text: 'Reduzi: 2-3 dias sem carne por semana', value: '2' },
        { text: 'Flexitariano, vegetariano ou vegano — já entendi a conta', value: '1' },
      ],
    },
    {
      question: 'COMPROU ALGO NOVO. O QUE ENTROU NA DECISÃO?',
      emoji: '🛒',
      options: [
        { text: 'Preço e praticidade. Origem é pra quem tem tempo.', value: '4' },
        { text: 'Leio o rótulo às vezes, mas raramente muda o que eu compro', value: '3' },
        { text: 'Prefiro marcas com compromisso ambiental quando dá pra escolher', value: '2' },
        { text: 'Origem, cadeia, embalagem, trabalho — tudo entra na conta', value: '1' },
      ],
    },
    {
      question: 'PAINEL SOLAR RESIDENCIAL CORTA 80% DA CONTA DE LUZ E 60% DA PEGADA DE CARBONO. SUA REAÇÃO:',
      emoji: '☀️',
      options: [
        { text: 'Interessante, mas investimento inicial não cabe pra mim agora', value: '4' },
        { text: 'Faz sentido — tô estudando pra entender se vale a pena', value: '3' },
        { text: 'Quero saber mais. Esses números se sustentam em escala?', value: '2' },
        { text: 'Já instalei, tenho no prédio, ou já convenci alguém a trocar', value: '1' },
      ],
    },
  ],
  results: {
    considerable: {
      label: 'O TURBO POLUIDOR',
      category: 'Não é vilão, só ainda não assinou a carta',
      description: 'Você não é o problema — o sistema foi construído exatamente pra facilitar essas escolhas. Carro fácil, plástico fácil, carne todo dia, lixo num saco só. A fricção pra escolher diferente é real.\n\nMas agora você SABE. O Dragão sugere: escolha uma coisa. Só uma. E segura por 30 dias.',
      emoji: '🏭',
      profileLabel: 'Sei que dá pra mudar. Começo aqui.',
      manifestoLine: 'Minha pegada é alta — mas já comecei a reparar',
      stats: [
        { label: 'PEGADA',       value: 88 },
        { label: 'INTENÇÃO',     value: 28 },
        { label: 'AÇÃO',         value: 18 },
        { label: 'CULPA',        value: 42 },
      ],
      ctaText: 'UMA MUDANÇA PRA COMEÇAR →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    building: {
      label: 'ECOLOGISTA DE FIM DE SEMANA',
      category: 'Sabe que deveria, a rotina vence',
      description: 'Você SEPARA o lixo (quando lembra). LEVA a ecobag (quando não esquece). REDUZIU a carne (até a churrascaria do sábado). A intenção é boa, a consistência é outra conversa.\n\nTá tudo bem — quem começa inconsistente geralmente termina no hábito. O Dragão só pede: menos "quando dá", mais "porque decidi".',
      emoji: '🌥️',
      profileLabel: 'Tô melhorando, um passo de cada vez',
      manifestoLine: 'Minha consciência ambiental tá em construção',
      stats: [
        { label: 'INTENÇÃO',     value: 72 },
        { label: 'CONSISTÊNCIA', value: 42 },
        { label: 'CULPA',        value: 65 },
        { label: 'AÇÃO',         value: 48 },
      ],
      ctaText: 'UMA ESCOLHA QUE VIRA HÁBITO →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    almostConsistent: {
      label: 'BOAS INTENÇÕES COM GAPS',
      category: 'Quase lá. Só que quase é "ainda não"',
      description: 'Você faz MUITA coisa certo. Mas tem um ponto cego — às vezes é o carro solo diário, às vezes o delivery de plástico 3x por semana, às vezes o churrasco inegociável. A gente sabe.\n\nO Dragão vê os gaps. E sabe que quem entende o problema raramente para de fechar as brechas.',
      emoji: '⛅',
      profileLabel: 'Já entendi — agora fecho os gaps',
      manifestoLine: 'Entendi a urgência e fecho os gaps do meu consumo',
      stats: [
        { label: 'CONSISTÊNCIA', value: 68 },
        { label: 'AÇÃO',         value: 72 },
        { label: 'PONTOS CEGOS', value: 45 },
        { label: 'CONVICÇÃO',    value: 78 },
      ],
      ctaText: 'FECHAR OS GAPS →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    almostThere: {
      label: 'DRAGÃO DISCRETO',
      category: 'Faz muito, sem fazer barulho',
      description: 'Você já mudou de verdade: rotina, consumo, prato. Mas não virou influencer ambiental, e isso é saudável. Faz porque acredita, não porque tá postando.\n\nO Dragão respeita quem anda na prática sem precisar anunciar. Mas também: já considerou puxar mais gente junto?',
      emoji: '🌤️',
      profileLabel: 'Já virou estilo de vida pra mim',
      manifestoLine: 'Consciência ambiental já virou meu estilo de vida',
      stats: [
        { label: 'AÇÃO',         value: 88 },
        { label: 'CONSISTÊNCIA', value: 85 },
        { label: 'DISCRIÇÃO',    value: 92 },
        { label: 'INFLUÊNCIA',   value: 55 },
      ],
      ctaText: 'MOSTRAR O QUE VOCÊ FAZ →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    greenDragon: {
      label: 'DRAGÃO VERDE',
      category: 'A pessoa que o grupo consulta quando tem dúvida',
      description: 'Você é a pessoa que o grupo manda mensagem quando tem dúvida sobre reciclagem, origem de alimento, pegada de carbono. Vive o que prega, e puxa os outros junto. Não é postura — é convicção testada.\n\nO Dragão te reconhece. Já sabia que você chegaria.',
      emoji: '🌿',
      profileLabel: 'Eu vivo tudo que eu prego',
      manifestoLine: 'Vivo tudo que prego sobre consumo consciente',
      stats: [
        { label: 'AÇÃO',         value: 99 },
        { label: 'CONSISTÊNCIA', value: 97 },
        { label: 'INFLUÊNCIA',   value: 95 },
        { label: 'CONVICÇÃO',    value: 99 },
      ],
      coupon: 'DRAGAOVERDE',
      ctaText: 'A PROTEÍNA QUE PENSA IGUAL A VOCÊ →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
  },
  computeResult: (answers) => {
    const score = answers.reduce((sum, v) => sum + parseInt(v || '0'), 0);
    if (score >= 21) return 'considerable';
    if (score >= 15) return 'building';
    if (score >= 11) return 'almostConsistent';
    if (score >= 8)  return 'almostThere';
    return 'greenDragon';
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ 6 — CONVENCIONAL OU REVOLUCIONÁRIO?
// Tipo: V/F. Dimensão: revolucao.
// ─────────────────────────────────────────────────────────────────────────────

const quizRevolucao: QuizDef = {
  id: 'convencional-ou-revolucionario',
  title: 'CONVENCIONAL OU REVOLUCIONÁRIO?',
  subtitle: 'Quem segue o fluxo, quem quebra o padrão. De verdade.',
  intro: 'O Dragão tem uma teoria.\nTodo mundo acha que questiona. Poucos realmente questionam.\n6 afirmações, verdadeiro ou falso — e o Dragão te situa no lado honesto da régua. 🐉',
  emoji: '🔥',
  accent: '#00D96F',
  hoverImage: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGFoazFxOWRoc3FtM3d2NDVwcGRjMzg5a3M1OGo3dzE4a2cwOTVneCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mokQK7oyiR8Sk/giphy.gif',
  cardRatio: 'ratio-5-4',
  cardFlex: 5 / 4,
  dimension: 'revolucao',
  questions: [
    {
      question: '"QUANDO UMA SÉRIE OU FILME VIRA ASSUNTO, EU ASSISTO PORQUE TODO MUNDO TÁ VENDO."',
      emoji: '📺',
      options: [
        { text: 'Verdadeiro — gosto de participar da conversa', value: '0' },
        { text: 'Falso — escolho pelo que me interessa, não pelo buzz', value: '1' },
      ],
    },
    {
      question: '"PREFIRO COMER NUMA FRANQUIA CONHECIDA DO QUE NUM LUGAR INDEPENDENTE QUE NUNCA OUVI FALAR."',
      emoji: '🍔',
      options: [
        { text: 'Verdadeiro — previsibilidade vale muito', value: '0' },
        { text: 'Falso — gosto de descobrir lugar novo, pequeno', value: '1' },
      ],
    },
    {
      question: '"JÁ MUDEI DE OPINIÃO SOBRE ALGUM TEMA IMPORTANTE NOS ÚLTIMOS 2 ANOS."',
      emoji: '🔄',
      options: [
        { text: 'Verdadeiro — atualizo o que penso quando vejo dado novo', value: '1' },
        { text: 'Falso — minhas posições se mantêm firmes', value: '0' },
      ],
    },
    {
      question: '"TOMO DECISÕES GRANDES (CARREIRA, CIDADE, RELAÇÃO) SEGUINDO O MODELO DO QUE SE ESPERA DE ALGUÉM DA MINHA IDADE."',
      emoji: '🗺️',
      options: [
        { text: 'Verdadeiro — o roteiro que funciona pra maioria guia as minhas', value: '0' },
        { text: 'Falso — decido pela minha régua, mesmo que destoe', value: '1' },
      ],
    },
    {
      question: '"JÁ PAGUEI MAIS CARO (OU TIVE MAIS TRABALHO) POR UMA MARCA PEQUENA/INDIE EM VEZ DE COMPRAR DA REDE ESTABELECIDA."',
      emoji: '🏷️',
      options: [
        { text: 'Verdadeiro — o que tá por trás da marca me importa', value: '1' },
        { text: 'Falso — preço e facilidade decidem', value: '0' },
      ],
    },
    {
      question: '"QUANDO O QUE A MAIORIA FAZ DIVERGE DO QUE ME PARECE CERTO, EU TENDO A IR COM A MAIORIA."',
      emoji: '👥',
      options: [
        { text: 'Verdadeiro — se muita gente faz assim, tem motivo', value: '0' },
        { text: 'Falso — sigo minha leitura, mesmo sozinho', value: '1' },
      ],
    },
  ],
  results: {
    convencional: {
      label: 'CONVENCIONAL DE CARTEIRINHA',
      category: 'O sistema foi feito pra você',
      description: 'Você prefere a estabilidade do que já funciona. É eficiente — economiza energia mental, evita frustração, previne surpresa.\n\nO Dragão só deixa uma pergunta no ar: se ninguém questiona, como as coisas mudam?',
      emoji: '🔁',
      profileLabel: 'Sigo o que funciona. Por enquanto.',
      manifestoLine: 'Sigo o que já funciona — por enquanto',
      stats: [
        { label: 'AUTONOMIA',       value: 18 },
        { label: 'CURIOSIDADE',     value: 28 },
        { label: 'SUSTENTABILIDADE', value: 22 },
        { label: 'INFLUÊNCIA',      value: 15 },
      ],
      ctaText: 'COMEÇAR PELA LISTA DE INGREDIENTES →',
      ctaLink: '/biblioteca',
    },
    transicao: {
      label: 'EM TRANSIÇÃO',
      category: 'Saiu do piloto automático',
      description: 'Você começou a questionar algumas coisas. Pesquisa quando tem tempo, já mudou alguma escolha por convicção. Em outras áreas ainda funciona no automático — é natural.\n\nO Dragão vê o movimento. E sabe que quem começa a questionar raramente para.',
      emoji: '⚡',
      profileLabel: 'Tô saindo do piloto automático',
      manifestoLine: 'Tô saindo do piloto automático das minhas escolhas',
      stats: [
        { label: 'AUTONOMIA',       value: 55 },
        { label: 'CURIOSIDADE',     value: 62 },
        { label: 'SUSTENTABILIDADE', value: 58 },
        { label: 'INFLUÊNCIA',      value: 48 },
      ],
      ctaText: 'O PRÓXIMO PASSO →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    revolucionario: {
      label: 'REVOLUCIONÁRIO',
      category: 'Você empurra o mundo um passo à frente',
      description: 'Você questiona em tudo: marca, origem, impacto, lógica. Já testou coisa antes da maioria e já influenciou pelo menos uma pessoa perto de você.\n\nO mundo muda por causa de gente como você. O Dragão te reconhece.',
      emoji: '🔥',
      profileLabel: 'Eu empurro o mercado, não sigo ele',
      coupon: 'REVOLUCAO',
      stats: [
        { label: 'AUTONOMIA',       value: 94 },
        { label: 'CURIOSIDADE',     value: 98 },
        { label: 'SUSTENTABILIDADE', value: 96 },
        { label: 'INFLUÊNCIA',      value: 92 },
      ],
      ctaText: 'VER A LINHA COMPLETA →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
  },
  computeResult: (answers) => {
    const score = answers.reduce((sum, v) => sum + parseInt(v || '0'), 0);
    if (score >= 5) return 'revolucionario';
    if (score >= 3) return 'transicao';
    return 'convencional';
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ 7 — QUE TIPO DE TUTOR VOCÊ É?
// Tipo: Personalidade. Dimensão: tipo_tutor.
// ─────────────────────────────────────────────────────────────────────────────

const quizTipoTutor: QuizDef = {
  id: 'tipo-de-tutor',
  title: 'QUE TIPO DE TUTOR VOCÊ É?',
  subtitle: 'Todo tutor se encaixa num tipo. Descobre o seu.',
  intro: 'O Dragão observou milhares de tutores.\nE descobriu que todo mundo se encaixa em um tipo.\n6 perguntas. Um diagnóstico honesto. Você vai se reconhecer. 🐉',
  emoji: '🧭',
  accent: '#925AED',
  hoverImage: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnB5aWQ5YWFmOXpmbjVlcGNpNTU5cjFjcWdybGQxbXl0MXRhbzY5NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yLZQKurQvmIAo/giphy.gif',
  cardRatio: 'ratio-3-4',
  cardFlex: 3 / 4,
  dimension: 'tipo_tutor',
  questions: [
    {
      question: 'SEU PET FICA DOENTE. QUAL É O SEU PRIMEIRO MOVIMENTO?',
      emoji: '🩺',
      options: [
        { text: 'Pesquiso os sintomas em 4 fontes diferentes antes de ligar pro vet', value: 'pesquisador' },
        { text: 'Veterinário no mesmo dia, sem hesitar', value: 'protocolar' },
        { text: 'Pergunto no grupo de WhatsApp de tutores primeiro', value: 'comunidade' },
        { text: 'Fico do lado, monitoro e confio no instinto', value: 'intuitivo' },
      ],
    },
    {
      question: 'O PET APRONTA ALGO (DESTRÓI SAPATO, ROUBA COMIDA, FUGIU). SUA REAÇÃO:',
      emoji: '🙃',
      options: [
        { text: 'Pesquiso no Google "comportamento canino + [coisa que ele fez]"', value: 'pesquisador' },
        { text: 'Marco uma sessão com adestrador profissional', value: 'protocolar' },
        { text: 'Posto no grupo pra ouvir o que funcionou pros outros', value: 'comunidade' },
        { text: 'Respiro fundo, entendo o que disparou e ajusto com ele', value: 'intuitivo' },
      ],
    },
    {
      question: 'SEU PET FAZ ANIVERSÁRIO. O QUE ACONTECE?',
      emoji: '🎂',
      options: [
        { text: 'Aproveito pra fazer check-up: peso, rotina, plano do próximo ano', value: 'pesquisador' },
        { text: 'Bolo pet-friendly, fornecedor certificado, tudo planejado com antecedência', value: 'protocolar' },
        { text: 'Festa com os amigos peludos dele e stories no Insta', value: 'comunidade' },
        { text: 'Aniversário? A gente comemora todo dia. (Tá, talvez nem sei o dia exato)', value: 'intuitivo' },
      ],
    },
    {
      question: 'UM CONHECIDO MUDOU A ALIMENTAÇÃO DO PET E O RESULTADO FOI INCRÍVEL. VOCÊ:',
      emoji: '📢',
      options: [
        { text: 'Já abriu 5 abas do navegador atrás dos estudos que embasam', value: 'pesquisador' },
        { text: 'Anota pra levar pro vet na próxima consulta e segue a recomendação dele', value: 'protocolar' },
        { text: 'Printa e manda pro grupo: "alguém já testou?"', value: 'comunidade' },
        { text: 'Compra na semana, testa no pet e deixa ele decidir', value: 'intuitivo' },
      ],
    },
    {
      question: 'QUAL FRASE REPRESENTA MELHOR SUA FILOSOFIA COMO TUTOR?',
      emoji: '💭',
      options: [
        { text: '"Decisão boa é decisão informada. Sempre."', value: 'pesquisador' },
        { text: '"Veterinário é referência. Eu sigo o que funciona."', value: 'protocolar' },
        { text: '"A gente aprende junto — comunidade é tudo."', value: 'comunidade' },
        { text: '"Meu pet me diz o que precisa. Eu aprendi a ouvir."', value: 'intuitivo' },
      ],
    },
    {
      question: 'VOCÊ DESCOBRE A COMIDA DE DRAGÃO. QUAL É A SUA REAÇÃO?',
      emoji: '🐉',
      options: [
        { text: 'Pesquisa digestibilidade, origem, registro MAPA e estudos científicos', value: 'pesquisador' },
        { text: 'Espera a próxima consulta pra perguntar pro vet', value: 'protocolar' },
        { text: 'Posta no grupo pra ver se alguém já testou', value: 'comunidade' },
        { text: 'Observa a reação do pet na primeira mordida e decide ali', value: 'intuitivo' },
      ],
    },
  ],
  results: {
    pesquisador: {
      label: 'TUTOR PESQUISADOR',
      category: 'Sabe mais que muitos veterinários esperam',
      description: 'Você lê ingrediente, questiona origem, compara digestibilidade e não aceita "é bom porque todo mundo usa" como argumento. Sua tomada de decisão é lenta — mas raramente errada.\n\nO Dragão ama tutores assim. E tem tudo que você precisa pra fechar sua pesquisa com a resposta certa.',
      emoji: '🔬',
      profileLabel: 'Pesquiso antes de qualquer decisão',
      manifestoLine: 'Pesquiso cada decisão antes de tomar — é como eu cuido',
      stats: [
        { label: 'PESQUISA',     value: 98 },
        { label: 'CONSISTÊNCIA', value: 75 },
        { label: 'EMPATIA',      value: 62 },
        { label: 'INTUIÇÃO',     value: 55 },
      ],
      ctaText: 'VER TODOS OS DADOS TÉCNICOS →',
      ctaLink: '/biblioteca',
    },
    protocolar: {
      label: 'TUTOR PROTOCOLAR',
      category: 'Faz tudo certo. E com consistência.',
      description: 'Veterinário é sua referência, rotina é sua força e você não toma decisão por impulso. Seu pet tem sorte — porque consistência é um dos maiores presentes que um tutor pode dar.\n\nCada vez mais veterinários brasileiros estão recomendando proteína de inseto. Quando o seu perguntar, você já vai saber do que se trata.',
      emoji: '📋',
      profileLabel: 'Faço tudo certo. E com consistência.',
      manifestoLine: 'Cuido com protocolo e consistência — essa é minha força',
      stats: [
        { label: 'PESQUISA',     value: 65 },
        { label: 'CONSISTÊNCIA', value: 98 },
        { label: 'EMPATIA',      value: 72 },
        { label: 'INTUIÇÃO',     value: 60 },
      ],
      ctaText: 'O QUE OS VETS ESTÃO DIZENDO →',
      ctaLink: '/biblioteca',
    },
    comunidade: {
      label: 'TUTOR COMUNIDADE',
      category: 'Não anda sozinho — e o pet se beneficia',
      description: 'Você aprende com os outros, compartilha o que descobre e constrói conhecimento coletivo. Grupos de tutores, fóruns, recomendações de quem já testou — esse é o seu ecossistema.\n\nCentenas de tutores como você já testaram e aprovaram. A comunidade já decidiu.',
      emoji: '👥',
      profileLabel: 'A matilha aprende junta',
      manifestoLine: 'Eu e a matilha aprendemos juntos — a gente não anda sozinho',
      stats: [
        { label: 'PESQUISA',     value: 58 },
        { label: 'CONSISTÊNCIA', value: 68 },
        { label: 'EMPATIA',      value: 96 },
        { label: 'INTUIÇÃO',     value: 72 },
      ],
      ctaText: 'VER O QUE OUTROS TUTORES FALAM →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    intuitivo: {
      label: 'TUTOR INTUITIVO',
      category: 'Linguagem própria com o pet — e ela raramente mente',
      description: 'Você não precisa de dado pra saber quando algo está errado. Percebe antes de todo mundo, age pelo instinto e raramente erra na escolha. Sua relação com o pet vai além do que qualquer protocolo consegue medir.\n\nO Dragão respeita esse tipo de vínculo. E sabe que quando seu pet provar, o instinto vai confirmar.',
      emoji: '🤍',
      profileLabel: 'Meu pet me diz o que ele precisa',
      manifestoLine: 'Meu pet me fala o que precisa — e eu aprendi a ouvir',
      stats: [
        { label: 'PESQUISA',     value: 52 },
        { label: 'CONSISTÊNCIA', value: 72 },
        { label: 'EMPATIA',      value: 88 },
        { label: 'INTUIÇÃO',     value: 99 },
      ],
      ctaText: 'DEIXA O PET DECIDIR →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
  },
  computeResult: (answers) => {
    const count: Record<string, number> = {};
    for (const a of answers) count[a] = (count[a] || 0) + 1;
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'protocolar';
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ 8 — VOCÊ OU SEU PET: QUEM COME MELHOR?
// Tipo: Comparação binária. Dimensão: alimentacao.
// ─────────────────────────────────────────────────────────────────────────────

const quizVoceOuPet: QuizDef = {
  id: 'voce-ou-seu-pet',
  title: 'VOCÊ OU SEU PET?',
  subtitle: '6 rodadas. Escolha honesta. Quem come melhor?',
  intro: 'O Dragão passou a analisar o que entra no prato de tutores e pets no Brasil.\nO resultado foi... constrangedor.\n6 rodadas. Escolha honestamente. Seu pet pode estar ganhando. 🐉',
  emoji: '🍽️',
  accent: '#FF2D78',
  hoverImage: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjZtdHhuMmxrd3ZkaW1pdHFkMmZyNGg0MXZ5YWg2cmVwdHAzbzJreCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Cdkk6wFFqisTe/giphy.gif',
  cardRatio: 'ratio-16-9',
  cardFlex: 16 / 9,
  dimension: 'alimentacao',
  questions: [
    {
      question: 'CAFÉ DA MANHÃ. Quem comeu mais equilibrado hoje?',
      emoji: '☕',
      options: [
        { text: 'O pet — a ração dele tem proteína, vitamina e mineral', value: 'pet' },
        { text: 'Empate — a gente come parecido', value: 'empate' },
        { text: 'Eu — ovo, fruta, refeição de gente', value: 'voce' },
      ],
    },
    {
      question: 'LANCHE DA TARDE. Seu salgadinho vs o petisco funcional do pet. Quem ganha?',
      emoji: '🥤',
      options: [
        { text: 'O pet — petisco com proteína e ômega vence fácil', value: 'pet' },
        { text: 'Empate — a gente lancha na mesma vibe', value: 'empate' },
        { text: 'Eu — lancho fruta, castanha, coisa boa', value: 'voce' },
      ],
    },
    {
      question: 'PROTEÍNA DO DIA. Quem tem a origem mais clara no que come?',
      emoji: '🍗',
      options: [
        { text: 'O pet — rastreabilidade total, certificação', value: 'pet' },
        { text: 'Os dois — a gente come sem saber a origem', value: 'empate' },
        { text: 'Eu — só compro de produtor que conheço', value: 'voce' },
      ],
    },
    {
      question: 'FIM DE SEMANA chegou. Quem mantém melhor a rotina alimentar?',
      emoji: '🍕',
      options: [
        { text: 'O pet — mesma ração, mesma hora, sem exceção', value: 'pet' },
        { text: 'Os dois desandam juntos', value: 'empate' },
        { text: 'Eu — fim de semana não mexe na minha dieta', value: 'voce' },
      ],
    },
    {
      question: 'HIDRATAÇÃO. Quem bebe mais água ao longo do dia?',
      emoji: '💧',
      options: [
        { text: 'O pet — ele tá sempre no pote', value: 'pet' },
        { text: 'Igual — a gente bebe parecido', value: 'empate' },
        { text: 'Eu — 2L ou mais, sem falhar', value: 'voce' },
      ],
    },
    {
      question: 'CRITÉRIO DE COMPRA. Quem escolhe a comida com mais atenção?',
      emoji: '🧠',
      options: [
        { text: 'O pet tem quem pesquise cada ingrediente por ele', value: 'pet' },
        { text: 'Os dois na base do "tá na promoção"', value: 'empate' },
        { text: 'Eu — leio rótulo, pesquiso marca, testo', value: 'voce' },
      ],
    },
  ],
  results: {
    voce_ganhou: {
      label: 'VOCÊ GANHOU',
      category: 'Você come melhor que seu pet',
      description: 'Isso é raro. Significa que você cuida bem da sua alimentação — e provavelmente já pensa na do pet também.\n\nSeu pet merece chegar no seu nível. O Dragão aprova.',
      emoji: '🏆',
      profileLabel: 'Pra variar, eu como melhor que meu pet',
      stats: [
        { label: 'CONSCIÊNCIA',    value: 72 },
        { label: 'CRITÉRIO',       value: 68 },
        { label: 'COMPROMETIMENTO', value: 75 },
        { label: 'HUMOR',          value: 65 },
      ],
      ctaText: 'ELEVAR O PET AO SEU NÍVEL →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
    empate: {
      label: 'EMPATE TÉCNICO',
      category: 'Mesmo nível. Preocupante.',
      description: 'A boa notícia: você não está sozinho. A menos boa: seu pet e você disputam o mesmo nível nutricional médio. Alguém aqui precisa evoluir — e o pet tem vantagem porque ele não escolhe o próprio prato.\n\nVocê escolhe pelos dois. Que tal elevar os dois juntos?',
      emoji: '🤝',
      profileLabel: 'Eu e meu pet no mesmo nível. Preocupante.',
      stats: [
        { label: 'CONSCIÊNCIA',    value: 58 },
        { label: 'CRITÉRIO',       value: 55 },
        { label: 'COMPROMETIMENTO', value: 60 },
        { label: 'HUMOR',          value: 82 },
      ],
      ctaText: 'COMEÇAR PELO PRATO DO PET →',
      ctaLink: 'https://www.comidadedragao.com.br',
    },
    pet_ganhando: {
      label: 'SEU PET ESTÁ GANHANDO',
      category: 'Ele come melhor que você — e nem sabe',
      description: 'Você pesquisa ingrediente, lê rótulo e escolhe com cuidado — mas só pro pet. Na sua própria alimentação, o biscoito recheado ainda vence. O Dragão não te julga. Mas seu pet, em silêncio, provavelmente sim.\n\nA boa notícia: pelo menos um dos dois está bem nutrido.',
      emoji: '🐾',
      profileLabel: 'Meu pet come melhor que eu. Sem julgamento.',
      stats: [
        { label: 'CONSCIÊNCIA',    value: 85 },
        { label: 'CRITÉRIO',       value: 88 },
        { label: 'COMPROMETIMENTO', value: 92 },
        { label: 'HUMOR',          value: 88 },
      ],
      ctaText: 'VER O QUE FAZ DIFERENÇA →',
      ctaLink: '/biblioteca',
    },
    pet_muito_melhor: {
      label: 'TUTOR NOTA 10',
      category: 'Ser humano em desenvolvimento nutricional',
      description: 'Seu pet tem proteína rastreável, digestibilidade comprovada, ômega balanceado e consistência diária. Você tem salgadinho, café e boas intenções.\n\nNenhum julgamento. Mas talvez seja hora de pelo menos empatar. O Dragão sugere começar pelo lanche — o do pet é bem melhor.',
      emoji: '🏆',
      profileLabel: 'Tutor nota 10. Ser humano em desenvolvimento.',
      coupon: 'TUTORNOTA10',
      stats: [
        { label: 'CONSCIÊNCIA',    value: 96 },
        { label: 'CRITÉRIO',       value: 98 },
        { label: 'COMPROMETIMENTO', value: 99 },
        { label: 'HUMOR',          value: 95 },
      ],
      ctaText: 'O PETISCO QUE FAZ DIFERENÇA →',
      ctaLink: 'https://www.comidadedragao.com.br/collections/produtos',
    },
  },
  computeResult: (answers) => {
    const pet   = answers.filter((a) => a === 'pet').length;
    const voce  = answers.filter((a) => a === 'voce').length;
    // 5-6 pet:  pet come muito melhor (TUTOR NOTA 10)
    // 3-4 pet:  pet tá ganhando
    // 3+ voce:  voce ganhou
    // resto:    empate técnico
    if (pet >= 5) return 'pet_muito_melhor';
    if (pet >= 3) return 'pet_ganhando';
    if (voce >= 3) return 'voce_ganhou';
    return 'empate';
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT FINAL
// ─────────────────────────────────────────────────────────────────────────────

export const QUIZZES: QuizDef[] = [
  quizPersonality,
  quizNojo,
  quizKnowledge,
  quizProduto,
  quizEco,
  quizRevolucao,
  quizTipoTutor,
  quizVoceOuPet,
];

// Layout do grid: cada array = uma linha de cards
export const GRID_LAYOUT: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7],
];
