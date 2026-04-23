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
  subtitle: 'O Dragão vê tudo — inclusive o tipo de tutor que você é.',
  intro: 'O Dragão vê tudo. Inclusive o tipo de tutor que você é.\n6 perguntas. Sem julgamento. Só a verdade — e ela vai te surpreender.',
  emoji: '🐲',
  accent: '#925AED',
  hoverImage: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXBhc29odzI5aHNkODdhZWRncTIyNmR1YTJ6a3RnbGQ5cmluZWdtMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gs7b2ByVWk68F32/giphy.gif',
  cardRatio: 'ratio-5-4',
  cardFlex: 5 / 4,
  dimension: 'personality',
  questions: [
    {
      question: 'SEU PET ACABOU DE FAZER UMA BAGUNÇA ÉPICA. QUAL É SUA REAÇÃO?',
      emoji: '💥',
      options: [
        { text: '🔥 Olho fulminante. Silêncio total. Funciona melhor que gritar.', value: 'smaug' },
        { text: '🥺 Suspiro, limpo, e termino com abraço. Como ficar bravo com essa carinha?', value: 'banguela' },
        { text: '😂 Tiro foto antes de repreender. Isso vale um story.', value: 'mushu' },
        { text: '😤 Já começo a rever as regras da casa. Território é território.', value: 'drogon' },
        { text: '😄 Rio junto. A bagunça faz parte da aventura!', value: 'falkor' },
        { text: '🌀 Sento do lado dele em silêncio. Às vezes não precisa de palavras.', value: 'haku' },
      ],
    },
    {
      question: 'O QUE PASSA PELA SUA CABEÇA NA HORA DE ESCOLHER O ALIMENTO DO SEU PET?',
      emoji: '🛒',
      options: [
        { text: '🔍 Leio cada ingrediente. Duas vezes. Pesquiso antes de comprar.', value: 'smaug' },
        { text: '🌱 Procuro algo bom pra ele e pro planeta. Os dois importam.', value: 'banguela' },
        { text: '😅 Já testei umas 7 marcas diferentes "em busca da melhor".', value: 'mushu' },
        { text: '🛒 O que o veterinário mandou. Sem mimimi.', value: 'drogon' },
        { text: '🎲 Gosto de experimentar coisas novas. Rotina não é pra ele.', value: 'falkor' },
        { text: '🤍 Sigo o instinto. Quando ele come bem, eu sinto.', value: 'haku' },
      ],
    },
    {
      question: 'COMO SEU PET TE RECEBE QUANDO VOCÊ CHEGA EM CASA?',
      emoji: '🏠',
      options: [
        { text: '👑 Me observa do alto do sofá e decide se vale se mexer.', value: 'smaug' },
        { text: '🤝 Vem com calma, encosta e fica do meu lado. Cumplicidade silenciosa.', value: 'banguela' },
        { text: '🌪️ Carnaval total. Latido, pulo, volta. Todo dia como se eu tivesse voltado da guerra.', value: 'mushu' },
        { text: '⚡ Depende do dia dele. Às vezes é festa, às vezes sou invisível.', value: 'drogon' },
        { text: '🏃 Corre, rodopia, some e volta. Energia que não acaba.', value: 'falkor' },
        { text: '👁️ Me olha fundo nos olhos por alguns segundos antes de qualquer coisa.', value: 'haku' },
      ],
    },
    {
      question: 'QUAL FRASE TE REPRESENTA MELHOR COMO TUTOR?',
      emoji: '💬',
      options: [
        { text: '"Pesquiso mais sobre a saúde do meu pet do que sobre a minha própria."', value: 'smaug' },
        { text: '"Ele é meu melhor amigo. Sem exagero nenhum."', value: 'banguela' },
        { text: '"Eu exagero, eu sei. Mas ele merece tudo isso e mais."', value: 'mushu' },
        { text: '"Respeito é a base. Ele sabe os limites e eu sei os dele."', value: 'drogon' },
        { text: '"A vida com pet é melhor quando a gente não leva tão a sério."', value: 'falkor' },
        { text: '"Às vezes sinto que ele entende coisas que eu nem consigo explicar."', value: 'haku' },
      ],
    },
    {
      question: 'SEU PET ESTÁ DOENTE. O QUE VOCÊ FAZ?',
      emoji: '🩺',
      options: [
        { text: '🔬 Veterinário + pesquisa + grupo de WhatsApp de tutores + mais pesquisa.', value: 'smaug' },
        { text: '🫂 Fico do lado, embalo e fico de olho a noite toda se precisar.', value: 'banguela' },
        { text: '😭 Entro em desespero total — mas resolvo tudo, claro.', value: 'mushu' },
        { text: '🏥 Veterinário no mesmo dia. Não espero piorar.', value: 'drogon' },
        { text: '🌟 Respiro fundo. Vai ficar bem. Sempre fica.', value: 'falkor' },
        { text: '🕯️ Fico quieto do lado dele. Minha presença já é o remédio.', value: 'haku' },
      ],
    },
    {
      question: 'O QUE VOCÊ QUER DE VERDADE PRA VIDA DO SEU PET?',
      emoji: '💭',
      options: [
        { text: '"Que ele tenha tudo do melhor — e que eu nunca me arrependa de uma escolha."', value: 'smaug' },
        { text: '"Que ele viva muito, com saúde, sem sofrimento."', value: 'banguela' },
        { text: '"Uma vida longa, feliz, cheia de aventura e bagunça."', value: 'mushu' },
        { text: '"Equilíbrio. Saúde, rotina e muito amor — na medida certa."', value: 'drogon' },
        { text: '"Liberdade pra ser ele mesmo, do jeito que ele é."', value: 'falkor' },
        { text: '"Que ele sinta, todos os dias, que está seguro comigo."', value: 'haku' },
      ],
    },
  ],
  results: {
    smaug: {
      label: 'SMAUG',
      category: 'O Tutor Guardião',
      description: 'Você lê rótulo, questiona ingrediente, compara marca. Seu pet é seu tesouro — e você cuida dele com a mesma seriedade que Smaug cuida do ouro de Erebor. Só que com muito mais carinho, e a gente sabe disso.\n\nO Dragão te vê: você está no lugar certo. A Comida de Dragão foi feita pra tutores que não aceitam menos que o melhor.',
      emoji: '🐲',
      profileLabel: 'Eu pesquiso tudo antes de comprar',
      stats: [
        { label: 'PESQUISA',    value: 98 },
        { label: 'VÍNCULO',     value: 72 },
        { label: 'INTENSIDADE', value: 65 },
        { label: 'EQUILÍBRIO',  value: 85 },
      ],
      ctaText: 'CONHECER A LINHA COMPLETA →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    banguela: {
      label: 'BANGUELA',
      category: 'O Tutor Alma Gêmea',
      description: 'Você e seu pet se entendem sem precisar falar. A conexão é real, profunda, e guia cada escolha que você faz por ele. Você não cuida por obrigação — cuida porque ele é parte de você.\n\nO Dragão te vê: quem ama de verdade escolhe com consciência.',
      emoji: '🖤',
      profileLabel: 'Meu pet é minha alma gêmea',
      stats: [
        { label: 'PESQUISA',    value: 65 },
        { label: 'VÍNCULO',     value: 99 },
        { label: 'INTENSIDADE', value: 78 },
        { label: 'EQUILÍBRIO',  value: 80 },
      ],
      ctaText: 'ESCOLHER COM CONSCIÊNCIA →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    mushu: {
      label: 'MUSHU',
      category: 'O Tutor de Coração Enorme',
      description: 'Você faz aniversário pro pet, manda foto do prato montado e chora no veterinário. E tá tudo bem. Na verdade, tá mais que bem — porque esse nível de amor merece o melhor alimento do mundo.\n\nO Dragão te vê: tanta intensidade merece uma nutrição à altura.',
      emoji: '🔴',
      profileLabel: 'Eu exagero — e não me arrependo',
      stats: [
        { label: 'PESQUISA',    value: 55 },
        { label: 'VÍNCULO',     value: 92 },
        { label: 'INTENSIDADE', value: 99 },
        { label: 'EQUILÍBRIO',  value: 28 },
      ],
      ctaText: 'VER O QUE ELE MERECE →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    drogon: {
      label: 'DROGON',
      category: 'O Tutor de Respeito Mútuo',
      description: 'Você sabe que amor não é superproteção. Seu pet tem rotina, limites e liberdade — e é mais feliz por isso. Você escolhe com critério, age com consistência e não cai em modinha.\n\nO Dragão te vê: quem pensa com clareza, escolhe com qualidade.',
      emoji: '⚡',
      profileLabel: 'Amor com limites. Equilíbrio real.',
      stats: [
        { label: 'PESQUISA',    value: 82 },
        { label: 'VÍNCULO',     value: 78 },
        { label: 'INTENSIDADE', value: 68 },
        { label: 'EQUILÍBRIO',  value: 98 },
      ],
      ctaText: 'ESCOLHER COM CRITÉRIO →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    falkor: {
      label: 'FALKOR',
      category: 'O Tutor Aventureiro',
      description: 'Você não se perde em ansiedade. Topa testar o que é novo, adora ver seu pet explorar o mundo, e transforma até a rotina em diversão. Seu pet é seu parceiro de aventura, não um projeto a ser gerenciado.\n\nO Dragão te vê: quem não tem medo de experimentar vai longe.',
      emoji: '🌟',
      profileLabel: 'Nós vivemos na aventura',
      stats: [
        { label: 'PESQUISA',    value: 52 },
        { label: 'VÍNCULO',     value: 86 },
        { label: 'INTENSIDADE', value: 72 },
        { label: 'EQUILÍBRIO',  value: 68 },
      ],
      ctaText: 'EXPLORAR A LINHA →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    haku: {
      label: 'HAKU',
      category: 'O Tutor Intuitivo',
      description: 'Você e seu pet têm uma linguagem própria. Você percebe antes de todo mundo quando algo está errado, age pelo instinto e raramente erra. Não precisa de validação — você sabe quando está fazendo a coisa certa.\n\nO Dragão te vê: intuição poderosa merece um alimento à sua altura.',
      emoji: '🌊',
      profileLabel: 'Nos entendemos sem palavras',
      stats: [
        { label: 'PESQUISA',    value: 70 },
        { label: 'VÍNCULO',     value: 97 },
        { label: 'INTENSIDADE', value: 48 },
        { label: 'EQUILÍBRIO',  value: 90 },
      ],
      ctaText: 'SENTIR ANTES DE PENSAR →',
      ctaLink: 'https://comidadedragao.com.br',
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
  subtitle: '6 situações. Seja honesto. A gente não julga — muito.',
  intro: 'O Dragão tem uma pergunta importante.\nNão sobre o seu pet. Sobre você.\n6 situações. Seja honesto. A gente não julga — muito. 🐉',
  emoji: '🤢',
  accent: '#FF7A00',
  hoverImage: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWpnam4wZDRibDB2b2xsY3g1ZXg3aGFtNmhzMms0dWt0M2UyMG1uYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/10FHR5A4cXqVrO/giphy.gif',
  cardRatio: 'ratio-3-4',
  cardFlex: 3 / 4,
  dimension: 'nojo',
  questions: [
    {
      question: 'VOCÊ ESTÁ NA COZINHA E VÊ UM INSETO PASSANDO PELO CHÃO. O QUE VOCÊ FAZ?',
      emoji: '🪳',
      options: [
        { text: '🫣 Subo na cadeira e chamo alguém imediatamente', value: '4' },
        { text: '😤 Pego um sapato e resolvo o problema com firmeza', value: '3' },
        { text: '🤔 Observo por alguns segundos antes de decidir', value: '2' },
        { text: '😄 Verifico a espécie — pode ser interessante', value: '1' },
      ],
    },
    {
      question: 'UM AMIGO TE CONTA QUE COMEU SNACK DE GRILO NUMA FEIRA. SUA REAÇÃO?',
      emoji: '🦗',
      options: [
        { text: '🫣 "Nunca na minha vida. Jamais. Nem me fala."', value: '4' },
        { text: '😬 Faz uma cara, muda de assunto rapidamente', value: '3' },
        { text: '🤨 "E aí… como foi?" — curiosidade misturada com horror', value: '2' },
        { text: '😏 "Onde fica essa feira?"', value: '1' },
      ],
    },
    {
      question: 'APARECE UMA FOTO DE LARVAS NUMA TELA BEM DE FRENTE PRA VOCÊ. SEM AVISO.',
      emoji: '🐛',
      options: [
        { text: '🫣 Joga o celular longe', value: '4' },
        { text: '😬 Fecha os olhos, respira fundo, reabre devagar', value: '3' },
        { text: '🤔 Olha por dois segundos e vira a tela de lado', value: '2' },
        { text: '🔬 Dá zoom pra ver melhor', value: '1' },
      ],
    },
    {
      question: 'SEU PET ACHA UM INSETO NO QUINTAL E COME ANTES DE VOCÊ REAGIR.',
      emoji: '🐾',
      options: [
        { text: '🫣 Entra em pânico e liga pro veterinário na hora', value: '4' },
        { text: '😬 Fica observando os próximos 20 minutos esperando algo acontecer', value: '3' },
        { text: '🙄 "Lá vamos nós outra vez" — e segue o passeio', value: '2' },
        { text: '😄 Fotografa e manda pro grupo de tutores com orgulho', value: '1' },
      ],
    },
    {
      question: 'ALGUÉM TE OFERECE SEGURAR UMA LARVA BSF VIVA NA MÃO. PEQUENA, INOFENSIVA.',
      emoji: '🤏',
      options: [
        { text: '🫣 Não. Não. Mil vezes não.', value: '4' },
        { text: '😬 Fica olhando por 3 minutos tentando se convencer', value: '3' },
        { text: '🤏 Segura com dois dedos por exatamente 1,5 segundo', value: '2' },
        { text: '✋ Segura com a mão aberta e até acha graça', value: '1' },
      ],
    },
    {
      question: 'SEU PET ADOROU UM PETISCO DE LARVA BSF: 40% PROTEÍNA, HIPOALERGÊNICO. VOCÊ:',
      emoji: '🐉',
      options: [
        { text: '🫣 Compra de olhos fechados — literalmente, pra não ver o que tá dando', value: '4' },
        { text: '😬 Compra, mas pede pra outra pessoa servir', value: '3' },
        { text: '🤔 Compra, serve, e até lê os ingredientes dessa vez', value: '2' },
        { text: '🐉 Compra, serve, manda foto e ainda converte os amigos', value: '1' },
      ],
    },
  ],
  results: {
    nojentissimo: {
      label: 'NOJENTÍSSIMO PREMIUM',
      category: 'Grita com a sombra de um inseto',
      description: 'Tudo bem. Você está em boa companhia — a maioria das pessoas começa aqui. O nojo é uma resposta evolutiva legítima. Mas aqui vai uma informação que o Dragão precisa que você saiba: seu pet não tem esse problema. Ele comeu inseto hoje. Provavelmente ontem também.\n\nA ciência já provou. A biofábrica já produziu. Seu pet já aprovou. Agora é a sua vez de respirar fundo.',
      emoji: '😱',
      profileLabel: 'Eu tenho nojo — e meu pet não liga',
      stats: [
        { label: 'CORAGEM',    value: 8  },
        { label: 'CURIOSIDADE', value: 22 },
        { label: 'ADAPTAÇÃO',  value: 15 },
        { label: 'CONVICÇÃO',  value: 62 },
      ],
      ctaText: 'VER O QUE SEU PET JÁ SABE →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    funcional: {
      label: 'NOJENTO FUNCIONAL',
      category: 'Faz, mas sofre',
      description: 'Você consegue. Não gosta, mas consegue. E isso já é muito — porque a maioria das grandes mudanças na história da alimentação começou exatamente assim: com alguém fazendo uma careta e experimentando mesmo assim.\n\nO Dragão respeita a coragem disfarçada de nojo.',
      emoji: '😬',
      profileLabel: 'Eu faço, mas sofro um pouco',
      stats: [
        { label: 'CORAGEM',    value: 42 },
        { label: 'CURIOSIDADE', value: 55 },
        { label: 'ADAPTAÇÃO',  value: 40 },
        { label: 'CONVICÇÃO',  value: 68 },
      ],
      ctaText: 'DAR O PRIMEIRO PASSO →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    transicao: {
      label: 'EM TRANSIÇÃO',
      category: 'Curioso, mas cauteloso',
      description: 'Você está no lugar mais interessante de todos: na fronteira entre o velho e o novo. Faz perguntas, lê ingredientes, pesa o nojo contra a lógica. Esse é exatamente o perfil de tutor que muda de ideia com um dado bom.\n\nAqui vai um: 83% menos emissões de carbono. 15.000 litros a menos de água por kg.',
      emoji: '🤔',
      profileLabel: 'Tô me convencendo aos poucos',
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
      description: 'Inseto não te assusta. Você provavelmente já leu sobre BSF antes, ou pelo menos não fechou o artigo no primeiro parágrafo. O que falta é só dar o passo — e seu pet está esperando faz tempo.\n\nO Dragão vê você hesitando. E ele não entende por quê.',
      emoji: '😏',
      profileLabel: 'O nojo já foi embora',
      stats: [
        { label: 'CORAGEM',    value: 82 },
        { label: 'CURIOSIDADE', value: 88 },
        { label: 'ADAPTAÇÃO',  value: 80 },
        { label: 'CONVICÇÃO',  value: 82 },
      ],
      ctaText: 'TÁ ESPERANDO O QUÊ? →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    dragao: {
      label: 'DRAGÃO DE VERDADE',
      category: 'Leva inseto pra jantar',
      description: 'Você é a pessoa que explica BSF pra todo mundo na mesa e ainda converte dois amigos por semestre. Não tem nojo, tem curiosidade. Não tem medo, tem critério. E já sabe que o futuro da nutrição pet passa por aqui.\n\nO Dragão te reconhece. Você é da família.',
      emoji: '🐉',
      profileLabel: 'Inseto? Já convenci meia turma.',
      stats: [
        { label: 'CORAGEM',    value: 99 },
        { label: 'CURIOSIDADE', value: 97 },
        { label: 'ADAPTAÇÃO',  value: 98 },
        { label: 'CONVICÇÃO',  value: 99 },
      ],
      coupon: 'DRAGAOVERDADE',
      ctaText: 'VER A LINHA COMPLETA →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
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
  hoverImage: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTU2eWR3dWFmYmc5NzFuaTk5a3IxbWY1aWY1dTlkaGVzOHMyd21uNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1X8XxTMDxh1xanPVGX/giphy.gif',
  cardRatio: 'ratio-16-9',
  cardFlex: 16 / 9,
  dimension: 'knowledge',
  questions: [
    {
      question: 'VOCÊ VÊ "FARINHA DE SUBPRODUTOS" NA RAÇÃO. O QUE É ISSO?',
      emoji: '🔍',
      options: [
        { text: '🅐 Cortes nobres de carne processados em pó', value: 'wrong' },
        { text: '🅑 Restos de abatedouro: penas, bicos, patas, vísceras', value: 'right' },
        { text: '🅒 Uma fonte proteica vegetal enriquecida', value: 'wrong' },
        { text: '🅓 Suplemento vitamínico de origem animal', value: 'wrong' },
      ],
    },
    {
      question: 'POR QUE TANTOS CÃES DESENVOLVEM ALERGIA A FRANGO OU BOVINA?',
      emoji: '🤧',
      options: [
        { text: '🅐 Raças menores têm sistema imunológico mais fraco', value: 'wrong' },
        { text: '🅑 Alergia alimentar em pets geralmente é hereditária', value: 'wrong' },
        { text: '🅒 Exposição repetida à mesma proteína pode sensibilizar o organismo', value: 'right' },
        { text: '🅓 É causada por aditivos e corantes, não pela proteína', value: 'wrong' },
      ],
    },
    {
      question: 'O QUE SIGNIFICA "PROTEÍNA HIDROLISADA" NA LISTA DE INGREDIENTES?',
      emoji: '🧪',
      options: [
        { text: '🅐 Proteína de alta qualidade processada para melhorar o sabor', value: 'wrong' },
        { text: '🅑 Proteína quebrada quimicamente para reduzir reação alérgica', value: 'right' },
        { text: '🅒 Proteína vegetal combinada com proteína animal', value: 'wrong' },
        { text: '🅓 Proteína com adição de água para facilitar a digestão', value: 'wrong' },
      ],
    },
    {
      question: 'QUAL A DIGESTIBILIDADE MÉDIA DE PROTEÍNA NAS RAÇÕES PREMIUM?',
      emoji: '📊',
      options: [
        { text: '🅐 Entre 95% e 99%', value: 'wrong' },
        { text: '🅑 Entre 85% e 90%', value: 'wrong' },
        { text: '🅒 Entre 70% e 80%', value: 'right' },
        { text: '🅓 Depende do pet — não existe média confiável', value: 'wrong' },
      ],
    },
    {
      question: 'QUANTOS LITROS DE ÁGUA PRA PRODUZIR 1KG DE PROTEÍNA BOVINA?',
      emoji: '💧',
      options: [
        { text: '🅐 Cerca de 500 litros', value: 'wrong' },
        { text: '🅑 Cerca de 3.000 litros', value: 'wrong' },
        { text: '🅒 Cerca de 8.000 litros', value: 'wrong' },
        { text: '🅓 Mais de 15.000 litros', value: 'right' },
      ],
    },
    {
      question: 'O QUE A LEGISLAÇÃO EXIGE OBRIGATORIAMENTE NO RÓTULO DE UMA RAÇÃO?',
      emoji: '📋',
      options: [
        { text: '🅐 A origem de cada ingrediente proteico', value: 'wrong' },
        { text: '🅑 A lista de ingredientes em ordem decrescente de quantidade', value: 'right' },
        { text: '🅒 O percentual exato de cada ingrediente', value: 'wrong' },
        { text: '🅓 O nome do fornecedor de cada matéria-prima', value: 'wrong' },
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
      stats: [
        { label: 'CONHECIMENTO', value: 22 },
        { label: 'CRITÉRIO',     value: 38 },
        { label: 'CETICISMO',    value: 32 },
        { label: 'CONSCIÊNCIA',  value: 42 },
      ],
      ctaText: 'CONHECER A COMIDA DE DRAGÃO →',
      ctaLink: 'https://comidadedragao.com.br',
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
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
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
  title: 'QUAL É A DO SEU PET?',
  subtitle: 'O Dragão te diz exatamente o que o seu pet precisa.',
  intro: 'O Dragão conhece cada produto da linha de cor e salteado.\nResponde aí — e ele te diz exatamente o que o seu pet precisa.',
  emoji: '🐾',
  accent: '#FF2D78',
  hoverImage: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjZtdHhuMmxrd3ZkaW1pdHFkMmZyNGg0MXZ5YWg2cmVwdHAzbzJreCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Cdkk6wFFqisTe/giphy.gif',
  cardRatio: 'ratio-1-1',
  cardFlex: 1,
  dimension: 'pet',
  questions: [
    {
      question: 'QUAL É O SEU PET?',
      emoji: '🐾',
      options: [
        { text: '🐶 Cachorro', value: 'cao' },
        { text: '🐱 Gato', value: 'gato' },
        { text: '🦎 Réptil ou anfíbio', value: 'reptil' },
        { text: '🐾 Mais de um tipo', value: 'multi' },
      ],
    },
    {
      question: 'O QUE VOCÊ ESTÁ BUSCANDO PRA ELE AGORA?',
      emoji: '🎯',
      options: [
        { text: '🍖 Um petisco gostoso pra recompensar e treinar', value: 'petisco' },
        { text: '💪 Um suplemento proteico pra potencializar a ração', value: 'suplemento' },
        { text: '🌿 Algo que faça diferença na saúde a longo prazo', value: 'saude' },
        { text: '🧩 Ainda não sei — quero entender o que faz sentido', value: 'nao-sei' },
      ],
    },
    {
      question: 'QUAL É O PERFIL DO SEU PET NO DIA A DIA?',
      emoji: '⚡',
      options: [
        { text: '⚡ Super ativo, cheio de energia, não para um segundo', value: 'ativo' },
        { text: '😴 Tranquilo, caladinho, mais filósofo que atleta', value: 'tranquilo' },
        { text: '🤧 Tem sensibilidade alimentar, alergia ou pele irritada', value: 'sensivel' },
        { text: '🏥 Está em recuperação, cirurgia recente ou gestação', value: 'recuperacao' },
      ],
    },
    {
      question: 'TEM ALGUMA RESTRIÇÃO DE SAÚDE QUE VOCÊ JÁ SABE?',
      emoji: '🩺',
      options: [
        { text: '🫀 Problema cardíaco, renal ou restrição de gordura', value: 'cardiaco' },
        { text: '🐱 É gato e precisa de taurina na dieta', value: 'taurina' },
        { text: '🌾 Intolerância ou alergia a proteína animal comum', value: 'alergia' },
        { text: '✅ Sem restrições — ele é saudável', value: 'saudavel' },
      ],
    },
    {
      question: 'COMO SEU PET SE COMPORTA NA HORA DE COMER?',
      emoji: '😋',
      options: [
        { text: '😋 Come tudo, qualquer hora, qualquer coisa', value: 'tudo' },
        { text: '🤔 Seletivo. Precisa de incentivo pra aceitar algo novo', value: 'seletivo' },
        { text: '🐾 Come bem a ração, mas poderia estar mais nutrido', value: 'boost' },
        { text: '🦎 Come insetos e precisava de algo prático pra substituir', value: 'reptil' },
      ],
    },
    {
      question: 'O QUE MAIS TE PREOCUPA NA SAÚDE DO SEU PET HOJE?',
      emoji: '💊',
      options: [
        { text: '✨ Pelagem opaca, pele ressecada ou baixa vitalidade', value: 'pelagem' },
        { text: '🥦 Quero incluir mais nutrientes naturais, tipo vegetais', value: 'vegetais' },
        { text: '🔬 Proteína de qualidade, pura, sem enrolação', value: 'proteina' },
        { text: '🎯 Quero o básico bem feito — um petisco que já vale como nutrição', value: 'basico' },
      ],
    },
  ],
  results: {
    original: {
      label: 'COMIDA DE DRAGÃO ORIGINAL',
      category: 'O clássico. O começo de tudo.',
      description: 'Larvas BSF inteiras, 40% de proteína no mínimo, e serve pra cão, gato, ave, réptil e anfíbio. Funciona como petisco, ferramenta de treino e introdução ao mundo BSF. É o produto que converte céticos — porque quando o pet come, a conversa acaba.',
      emoji: '🐛',
      profileLabel: 'Meu pet come tudo e ama tudo',
      stats: [
        { label: 'PROTEÍNA',       value: 82 },
        { label: 'NUTRIÇÃO',       value: 78 },
        { label: 'ESPECIFICIDADE', value: 62 },
        { label: 'VITALIDADE',     value: 88 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR ORIGINAL →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    legumes: {
      label: 'MORDIDA — LEGUMES',
      category: 'Nutrição + sabor + vegetais.',
      description: 'Snack assado com BSF, cenoura, cúrcuma e betacaroteno. Rico em nutrientes naturais, ótima palatabilidade e zero frescura pra aceitar. Pra tutores que querem petisco com substância — não só crocância.',
      emoji: '🥦',
      profileLabel: 'Só nutrição de verdade pra ele',
      stats: [
        { label: 'PROTEÍNA',       value: 75 },
        { label: 'NUTRIÇÃO',       value: 92 },
        { label: 'ESPECIFICIDADE', value: 76 },
        { label: 'VITALIDADE',     value: 85 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR MORDIDA LEGUMES →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    spirulina: {
      label: 'MORDIDA — SPIRULINA',
      category: 'Pra ver a diferença na pelagem e na energia.',
      description: 'Spirulina, coco, espinafre e BSF num snack que age por dentro. Antioxidantes, ficocianina e triglicerídeos de cadeia média — palavras difíceis pra um resultado simples: pelo mais bonito, imunidade melhor, mais disposição.',
      emoji: '✨',
      profileLabel: 'Pelagem bonita começa por dentro',
      stats: [
        { label: 'PROTEÍNA',       value: 75 },
        { label: 'NUTRIÇÃO',       value: 90 },
        { label: 'ESPECIFICIDADE', value: 86 },
        { label: 'VITALIDADE',     value: 92 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR MORDIDA SPIRULINA →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    integral: {
      label: 'SUPLEMENTO INTEGRAL',
      category: 'O boost diário. Mistura na ração e pronto.',
      description: '45% de proteína no mínimo, cúrcuma e spirulina em pó. Fácil de incluir na rotina, aumenta a palatabilidade da ração e serve pra cães em crescimento, muito ativos ou com baixo apetite.',
      emoji: '💪',
      profileLabel: 'Meu pet treina como atleta',
      stats: [
        { label: 'PROTEÍNA',       value: 92 },
        { label: 'NUTRIÇÃO',       value: 88 },
        { label: 'ESPECIFICIDADE', value: 82 },
        { label: 'VITALIDADE',     value: 96 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR SUPLEMENTO INTEGRAL →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    concentrado: {
      label: 'SUPLEMENTO CONCENTRADO',
      category: 'Máxima proteína. Mínima gordura.',
      description: '55% de proteína no mínimo — a maior concentração da linha. Com apenas 9,45% de gordura, é o produto certo pra cães em recuperação, com pancreatite, restrição de gordura ou que precisam de reconstrução muscular real.',
      emoji: '🔬',
      profileLabel: 'Proteína máxima, gordura mínima',
      stats: [
        { label: 'PROTEÍNA',       value: 99 },
        { label: 'NUTRIÇÃO',       value: 84 },
        { label: 'ESPECIFICIDADE', value: 99 },
        { label: 'VITALIDADE',     value: 86 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR SUPLEMENTO CONCENTRADO →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    felino: {
      label: 'SUPLEMENTO FELINO',
      category: 'Feito pra gato. Do jeito que gato precisa.',
      description: '40% de proteína no mínimo com taurina — o aminoácido essencial que gato não produz sozinho. Cuida do coração, da visão e da saúde geral. Porque gato não é cão pequeno, e o Dragão sabe disso.',
      emoji: '🐱',
      profileLabel: 'Gato não é cão pequeno. Sei disso.',
      stats: [
        { label: 'PROTEÍNA',       value: 85 },
        { label: 'NUTRIÇÃO',       value: 90 },
        { label: 'ESPECIFICIDADE', value: 99 },
        { label: 'VITALIDADE',     value: 88 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR SUPLEMENTO FELINO →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    grub: {
      label: 'GRUB — ALIMENTO EM GEL',
      category: 'Pra quem tem um dragão de verdade em casa.',
      description: 'Pó que vira gel com água quente — proteína de 3 fontes de insetos, 47% no mínimo, relação Ca:P perfeita pra répteis. Sem inseto vivo, sem odor, sem complicação. Nutrição consistente de verdade pro seu animal exótico.',
      emoji: '🦎',
      profileLabel: 'Tenho um dragão de verdade em casa',
      stats: [
        { label: 'PROTEÍNA',       value: 92 },
        { label: 'NUTRIÇÃO',       value: 82 },
        { label: 'ESPECIFICIDADE', value: 99 },
        { label: 'VITALIDADE',     value: 86 },
      ],
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR GRUB →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
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
  title: 'QUAL SEU NÍVEL DE CONSCIÊNCIA AMBIENTAL?',
  subtitle: 'Todo mundo acha que é mais consciente que a média. O Dragão resolveu testar.',
  intro: 'Todo mundo acha que é mais consciente que a média.\nO Dragão vê tudo — e resolveu testar.\n6 perguntas. Sem julgamento. Só a verdade. 🐉',
  emoji: '🌿',
  accent: '#7BFF00',
  hoverImage: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGx6NTY4bWw1ZXN4aW8wdjh1bzA4ZW8wZmNubDFhM2ZlaDN6cHR5ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cObIzBCAkFxW60ORYj/giphy.gif',
  cardRatio: 'ratio-3-4',
  cardFlex: 3 / 4,
  dimension: 'eco',
  questions: [
    {
      question: 'COMO VOCÊ FAZ SEUS DESLOCAMENTOS DO DIA A DIA?',
      emoji: '🚗',
      options: [
        { text: '🚗 Carro solo, sempre. Praticidade em primeiro lugar.', value: '4' },
        { text: '🚗 Carro, mas faço carona com alguém quando dá.', value: '3' },
        { text: '🚌 Transporte público na maior parte do tempo.', value: '2' },
        { text: '🚲 A pé, bike ou transporte público quase sempre.', value: '1' },
      ],
    },
    {
      question: 'O QUE VOCÊ FAZ COM O LIXO EM CASA?',
      emoji: '♻️',
      options: [
        { text: '🗑️ Jogo tudo junto — não tenho tempo pra separar.', value: '4' },
        { text: '♻️ Separo recicláveis quando lembro.', value: '3' },
        { text: '♻️ Separo sempre, e sei o que vai em cada lixeira.', value: '2' },
        { text: '🌱 Separo, composto orgânico incluso — e ainda reduzi o que gero.', value: '1' },
      ],
    },
    {
      question: 'QUANDO VOCÊ VAI AO MERCADO, O QUE ACONTECE COM AS EMBALAGENS?',
      emoji: '🛍️',
      options: [
        { text: '🛍️ Levo sacola plástica do próprio mercado, sempre.', value: '4' },
        { text: '🛍️ Às vezes lembro a ecobag, às vezes não.', value: '3' },
        { text: '👜 Levo ecobag com frequência.', value: '2' },
        { text: '🧺 Ecobag, potes reutilizáveis e evito embalagem quando posso.', value: '1' },
      ],
    },
    {
      question: 'COMO É SUA RELAÇÃO COM CARNE NO DIA A DIA?',
      emoji: '🥩',
      options: [
        { text: '🥩 Como carne em todas as refeições, sem pensar muito nisso.', value: '4' },
        { text: '🥩 Como bastante, mas já reduzi um pouco nos últimos tempos.', value: '3' },
        { text: '🌿 Reduzi conscientemente — pelo menos alguns dias sem carne por semana.', value: '2' },
        { text: '🌱 Como pouco ou nada — já entendi o impacto ambiental.', value: '1' },
      ],
    },
    {
      question: 'QUANDO VOCÊ COMPRA UM PRODUTO, O QUE PASSA PELA SUA CABEÇA?',
      emoji: '🛒',
      options: [
        { text: '🛒 Preço e praticidade. Origem não é algo que eu pesquise.', value: '4' },
        { text: '🤔 Às vezes leio o rótulo, mas raramente muda minha decisão.', value: '3' },
        { text: '🔍 Procuro marcas com compromisso ambiental quando tenho opção.', value: '2' },
        { text: '🌍 Origem, impacto, embalagem e cadeia produtiva entram na conta.', value: '1' },
      ],
    },
    {
      question: 'UMA PROTEÍNA QUE USA 142X MENOS TERRA E 83% MENOS CARBONO. SUA REAÇÃO:',
      emoji: '🌍',
      options: [
        { text: '😒 Interessante, mas não muda meus hábitos na prática.', value: '4' },
        { text: '🤔 Faz sentido — mas ainda preciso entender melhor antes de adotar.', value: '3' },
        { text: '👀 Quero saber mais. Esses números são reais?', value: '2' },
        { text: '🐉 Já conhecia. Já uso. Já convenci pelo menos uma pessoa.', value: '1' },
      ],
    },
  ],
  results: {
    considerable: {
      label: 'PEGADA CARBÔNICA CONSIDERÁVEL',
      category: 'O planeta sente, mas ainda dá tempo',
      description: 'Sem julgamento — a maioria das pessoas está aqui. O sistema foi construído pra facilitar escolhas de alto impacto e dificultar as outras. Mas o primeiro passo é sempre o mesmo: saber onde você está.\n\nVocê acabou de dar esse passo. O Dragão sugere começar pequeno.',
      emoji: '🌋',
      profileLabel: 'Sei que dá pra mudar. Começo aqui.',
      stats: [
        { label: 'IMPACTO',      value: 22 },
        { label: 'CONSISTÊNCIA', value: 16 },
        { label: 'INFLUÊNCIA',   value: 12 },
        { label: 'CONVICÇÃO',    value: 28 },
      ],
      ctaText: 'VER COMO COMEÇAR →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    building: {
      label: 'CONSCIENTE EM CONSTRUÇÃO',
      category: 'Quer fazer melhor, mas a rotina complica',
      description: 'Você já pensa. Já questiona. Já fez algumas mudanças — mas sabe que ainda tem espaço pra evoluir. Esse é o perfil mais comum entre pessoas que realmente chegam a mudar: não é perfeição, é processo.\n\nO Dragão não pede perfeição. Só escolhas melhores, uma de cada vez.',
      emoji: '🌥️',
      profileLabel: 'Tô melhorando, um passo de cada vez',
      stats: [
        { label: 'IMPACTO',      value: 55 },
        { label: 'CONSISTÊNCIA', value: 50 },
        { label: 'INFLUÊNCIA',   value: 42 },
        { label: 'CONVICÇÃO',    value: 58 },
      ],
      ctaText: 'UMA ESCOLHA QUE FAZ DIFERENÇA →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    almostConsistent: {
      label: 'QUASE CONSISTENTE',
      category: 'Já entendeu, agora é fechar os gaps',
      description: 'Você tem consciência, tem intenção e já colocou bastante em prática. O que falta é consistência nos pontos cegos — aquelas áreas onde o hábito ainda fala mais alto que o valor.\n\nO Dragão vê os gaps. E tem uma sugestão pra cada um deles.',
      emoji: '⛅',
      profileLabel: 'Já entendi — agora fecho os gaps',
      stats: [
        { label: 'IMPACTO',      value: 76 },
        { label: 'CONSISTÊNCIA', value: 68 },
        { label: 'INFLUÊNCIA',   value: 60 },
        { label: 'CONVICÇÃO',    value: 74 },
      ],
      ctaText: 'FECHAR OS GAPS →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    almostThere: {
      label: 'QUASE LÁ',
      category: 'Já virou estilo de vida, falta só compartilhar',
      description: 'Você já internalizou. Separa lixo, pensa na origem, reduziu carne, e faz perguntas que a maioria nem sabe que existem. O próximo nível não é consumir melhor — é influenciar as pessoas ao redor.\n\nO Dragão precisa de pessoas como você.',
      emoji: '🌤️',
      profileLabel: 'Já virou estilo de vida pra mim',
      stats: [
        { label: 'IMPACTO',      value: 88 },
        { label: 'CONSISTÊNCIA', value: 85 },
        { label: 'INFLUÊNCIA',   value: 78 },
        { label: 'CONVICÇÃO',    value: 88 },
      ],
      ctaText: 'FAZER PARTE DO MOVIMENTO →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    greenDragon: {
      label: 'DRAGÃO VERDE',
      category: 'Vive o que prega',
      description: 'Você é a referência no grupo. A pessoa que as outras mandam mensagem quando têm dúvida sobre reciclagem, origem de alimento ou impacto ambiental. Não é postura — é convicção.\n\nO Dragão te reconhece. E já sabia que você chegaria até aqui.',
      emoji: '🌿',
      profileLabel: 'Eu vivo tudo que eu prego',
      stats: [
        { label: 'IMPACTO',      value: 99 },
        { label: 'CONSISTÊNCIA', value: 97 },
        { label: 'INFLUÊNCIA',   value: 95 },
        { label: 'CONVICÇÃO',    value: 99 },
      ],
      coupon: 'DRAGAOVERDE',
      ctaText: 'A PROTEÍNA QUE PENSA IGUAL A VOCÊ →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
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
  subtitle: 'A maioria acha que questiona. Poucos realmente questionam.',
  intro: 'O Dragão tem uma teoria.\nA maioria dos tutores acha que questiona o mercado.\nPoucos realmente questionam.\nVerdadeiro ou falso — e descobre em qual lado você está. 🐉',
  emoji: '🔥',
  accent: '#00D96F',
  hoverImage: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmMzczJyY2V0YjRhdG16NXdlMzJxcXNneHpuYTR5aWY1M3hwOHk4NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DZ1NZce3T5Q3e/giphy.gif',
  cardRatio: 'ratio-5-4',
  cardFlex: 5 / 4,
  dimension: 'revolucao',
  questions: [
    {
      question: '"EU COMPRO A MESMA RAÇÃO HÁ ANOS PORQUE MEU PET ACEITA BEM E NUNCA DEU PROBLEMA."',
      emoji: '🔁',
      options: [
        { text: '✅ Verdadeiro — se tá funcionando, não mexo', value: '0' },
        { text: '❌ Falso — revejo as escolhas periodicamente', value: '1' },
      ],
    },
    {
      question: '"EU JÁ LI A LISTA DE INGREDIENTES COMPLETA DE PELO MENOS UM PRODUTO QUE DOU PRO MEU PET."',
      emoji: '🔍',
      options: [
        { text: '✅ Verdadeiro — leio com frequência', value: '1' },
        { text: '❌ Falso — confio na embalagem e na indicação', value: '0' },
      ],
    },
    {
      question: '"SE MEU VETERINÁRIO NÃO INDICOU, EU NÃO EXPERIMENTO."',
      emoji: '🩺',
      options: [
        { text: '✅ Verdadeiro — vet é minha única referência', value: '0' },
        { text: '❌ Falso — pesquiso e levo novas informações pra ele', value: '1' },
      ],
    },
    {
      question: '"JÁ OFERECI ALGO DIFERENTE PRO MEU PET SÓ PORQUE A CIÊNCIA OU OUTROS TUTORES MOSTRARAM QUE FUNCIONA."',
      emoji: '🧪',
      options: [
        { text: '✅ Verdadeiro — testo com critério e observo o resultado', value: '1' },
        { text: '❌ Falso — prefiro esperar validação oficial', value: '0' },
      ],
    },
    {
      question: '"SUSTENTABILIDADE INFLUENCIA MINHAS ESCOLHAS DE CONSUMO — INCLUSIVE AS DO MEU PET."',
      emoji: '🌍',
      options: [
        { text: '✅ Verdadeiro — impacto ambiental entra na conta', value: '1' },
        { text: '❌ Falso — foco em qualidade e preço, sustentabilidade é bônus', value: '0' },
      ],
    },
    {
      question: '"JÁ CONVERTI PELO MENOS UMA PESSOA DO MEU CÍRCULO PRA UMA ESCOLHA MAIS CONSCIENTE PRO PET DELA."',
      emoji: '📣',
      options: [
        { text: '✅ Verdadeiro — compartilho o que descubro', value: '1' },
        { text: '❌ Falso — cuido do meu pet e deixo os outros decidirem', value: '0' },
      ],
    },
  ],
  results: {
    convencional: {
      label: 'CONVENCIONAL DE CARTEIRINHA',
      category: 'O sistema foi feito pra você',
      description: 'Você segue o fluxo. Compra o que sempre comprou, confia em quem sempre confiou e não perde tempo questionando o que parece funcionar.\n\nMas o Dragão tem uma pergunta incômoda: funcionar pra quem? Pro pet, pro planeta, ou pra indústria que prefere que você não leia o rótulo?\n\nUma leitura de ingrediente pode mudar tudo.',
      emoji: '🔁',
      profileLabel: 'Sigo o que funciona. Por enquanto.',
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
      description: 'Você questiona algumas coisas, pesquisa quando tem tempo e já mudou pelo menos uma escolha por convicção. O problema é a inconsistência — algumas áreas ainda funcionam no automático enquanto outras já estão no manual.\n\nO Dragão vê o movimento. E sabe que quem começa a questionar raramente para.',
      emoji: '⚡',
      profileLabel: 'Tô saindo do piloto automático',
      stats: [
        { label: 'AUTONOMIA',       value: 55 },
        { label: 'CURIOSIDADE',     value: 62 },
        { label: 'SUSTENTABILIDADE', value: 58 },
        { label: 'INFLUÊNCIA',      value: 48 },
      ],
      ctaText: 'O PRÓXIMO PASSO →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    revolucionario: {
      label: 'TUTOR REVOLUCIONÁRIO',
      category: 'Você empurra o mercado',
      description: 'Lê ingrediente, pesquisa origem, considera impacto ambiental, compartilha o que aprende e já testou pelo menos uma coisa que o mainstream ainda não chegou. Seu pet é mais bem nutrido por causa disso — e pelo menos uma pessoa no seu círculo também.\n\nO Dragão te reconhece. Você chegou antes da maioria.',
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
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
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
  subtitle: 'O Dragão observou milhares de tutores. Todo mundo se encaixa em um tipo.',
  intro: 'O Dragão observou milhares de tutores.\nE descobriu que todo mundo se encaixa em um tipo.\n6 perguntas. Um diagnóstico honesto. Você vai se reconhecer. 🐉',
  emoji: '🧭',
  accent: '#925AED',
  hoverImage: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXBhc29odzI5aHNkODdhZWRncTIyNmR1YTJ6a3RnbGQ5cmluZWdtMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gs7b2ByVWk68F32/giphy.gif',
  cardRatio: 'ratio-3-4',
  cardFlex: 3 / 4,
  dimension: 'tipo_tutor',
  questions: [
    {
      question: 'SEU PET FICA DOENTE. QUAL É O SEU PRIMEIRO MOVIMENTO?',
      emoji: '🩺',
      options: [
        { text: '🔬 Pesquiso os sintomas em 4 fontes diferentes antes de ligar pro vet', value: 'pesquisador' },
        { text: '🏥 Veterinário no mesmo dia, sem hesitar', value: 'protocolar' },
        { text: '💬 Pergunto no grupo de WhatsApp de tutores primeiro', value: 'comunidade' },
        { text: '🫂 Fico do lado, monitoro e confio no instinto', value: 'intuitivo' },
      ],
    },
    {
      question: 'COMO VOCÊ DESCREVERIA SUA RELAÇÃO COM O RÓTULO DOS PRODUTOS DO SEU PET?',
      emoji: '🏷️',
      options: [
        { text: '🔍 Leio tudo — ingredientes, origem, percentuais. Duas vezes.', value: 'pesquisador' },
        { text: '🛒 Confio na indicação do vet ou da pet shop', value: 'protocolar' },
        { text: '👥 Sigo o que outros tutores recomendam nos grupos', value: 'comunidade' },
        { text: '🤍 Confio no instinto — se ele come bem e está feliz, tá ótimo', value: 'intuitivo' },
      ],
    },
    {
      question: 'SEU PET FAZ ANIVERSÁRIO. O QUE ACONTECE?',
      emoji: '🎂',
      options: [
        { text: '📊 Aproveito pra avaliar saúde, peso e rotina do ano', value: 'pesquisador' },
        { text: '🎂 Bolo pet-friendly comprado em fornecedor certificado', value: 'protocolar' },
        { text: '🎉 Festinha com os pets amigos dele e foto pra postar', value: 'comunidade' },
        { text: '🥺 Um momento especial entre nós dois, sem alarde', value: 'intuitivo' },
      ],
    },
    {
      question: 'UM CONHECIDO MUDOU A ALIMENTAÇÃO DO PET E O RESULTADO FOI INCRÍVEL. VOCÊ:',
      emoji: '📢',
      options: [
        { text: '📚 Pesquisa o ingrediente, os estudos e a biofábrica antes de qualquer coisa', value: 'pesquisador' },
        { text: '👨‍⚕️ Anota pra perguntar pro veterinário na próxima consulta', value: 'protocolar' },
        { text: '💬 Leva pro grupo pra ver o que os outros acham', value: 'comunidade' },
        { text: '👀 Observa o pet do conhecido por algumas semanas antes de decidir', value: 'intuitivo' },
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
        { text: '🔬 Pesquisa digestibilidade, origem, registro MAPA e estudos científicos', value: 'pesquisador' },
        { text: '📋 Espera a próxima consulta pra perguntar pro vet', value: 'protocolar' },
        { text: '💬 Posta no grupo pra ver se alguém já testou', value: 'comunidade' },
        { text: '🐾 Observa a reação do pet na primeira mordida e decide ali', value: 'intuitivo' },
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
      stats: [
        { label: 'PESQUISA',     value: 58 },
        { label: 'CONSISTÊNCIA', value: 68 },
        { label: 'EMPATIA',      value: 96 },
        { label: 'INTUIÇÃO',     value: 72 },
      ],
      ctaText: 'VER O QUE OUTROS TUTORES FALAM →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    intuitivo: {
      label: 'TUTOR INTUITIVO',
      category: 'Linguagem própria com o pet — e ela raramente mente',
      description: 'Você não precisa de dado pra saber quando algo está errado. Percebe antes de todo mundo, age pelo instinto e raramente erra na escolha. Sua relação com o pet vai além do que qualquer protocolo consegue medir.\n\nO Dragão respeita esse tipo de vínculo. E sabe que quando seu pet provar, o instinto vai confirmar.',
      emoji: '🤍',
      profileLabel: 'Meu pet me diz o que ele precisa',
      stats: [
        { label: 'PESQUISA',     value: 52 },
        { label: 'CONSISTÊNCIA', value: 72 },
        { label: 'EMPATIA',      value: 88 },
        { label: 'INTUIÇÃO',     value: 99 },
      ],
      ctaText: 'DEIXA O PET DECIDIR →',
      ctaLink: 'https://comidadedragao.com.br',
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
  title: 'VOCÊ OU SEU PET: QUEM COME MELHOR?',
  subtitle: '6 rodadas. Escolha honestamente. Seu pet pode estar ganhando.',
  intro: 'O Dragão passou a analisar o que entra no prato de tutores e pets no Brasil.\nO resultado foi... constrangedor.\n6 rodadas. Escolha honestamente. Seu pet pode estar ganhando. 🐉',
  emoji: '🍽️',
  accent: '#FF2D78',
  hoverImage: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjZtdHhuMmxrd3ZkaW1pdHFkMmZyNGg0MXZ5YWg2cmVwdHAzbzJreCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Cdkk6wFFqisTe/giphy.gif',
  cardRatio: 'ratio-16-9',
  cardFlex: 16 / 9,
  dimension: 'alimentacao',
  questions: [
    {
      question: 'RODADA 1 — O CAFÉ DA MANHÃ. VOCÊ: CAFÉ COM LEITE + BISCOITO RECHEADO. SEU PET: RAÇÃO BALANCEADA COM PROTEÍNA E VITAMINAS.',
      emoji: '☕',
      options: [
        { text: '🧑 Sou eu — café com biscoito é sagrado', value: 'pet' },
        { text: '🐾 É o pet — ele come mais equilibrado de manhã', value: 'pet' },
        { text: '🍳 Eu como melhor (ovo, fruta, coisa de gente)', value: 'voce' },
      ],
    },
    {
      question: 'RODADA 2 — O LANCHE DA TARDE. VOCÊ: SALGADINHO DE PACOTE + REFRI. SEU PET: PETISCO COM 40% PROTEÍNA, ÔMEGAS E 88,9% DIGESTIBILIDADE.',
      emoji: '🥤',
      options: [
        { text: '🧑 Sou eu — salgadinho não tem hora', value: 'pet' },
        { text: '🐾 É o pet — o petisco dele tem mais nutriente que meu lanche', value: 'pet' },
        { text: '🍎 Eu lancho fruta ou castanha', value: 'voce' },
      ],
    },
    {
      question: 'RODADA 3 — A PROTEÍNA DO DIA. VOCÊ: FRANGO DE PRAÇA DE ALIMENTAÇÃO. SEU PET: LARVA BSF, HIPOALERGÊNICA, RASTREÁVEL.',
      emoji: '🍗',
      options: [
        { text: '🧑 Sou eu — praça conta como almoço', value: 'pet' },
        { text: '🐾 É o pet — a proteína dele tem origem mais clara que a minha', value: 'pet' },
        { text: '🥗 Eu como proteína de origem conhecida', value: 'voce' },
      ],
    },
    {
      question: 'RODADA 4 — O FIM DE SEMANA. VOCÊ: PIZZA, CERVEJA, ARREPENDIMENTO NO DOMINGO. SEU PET: MESMA ROTINA, SEM EXCEÇÃO.',
      emoji: '🍕',
      options: [
        { text: '🧑 Sou eu — fim de semana não tem regra', value: 'pet' },
        { text: '🐾 É o pet — ele mantém a dieta melhor do que eu', value: 'pet' },
        { text: '🥦 Eu mantenho dieta no fim de semana também', value: 'voce' },
      ],
    },
    {
      question: 'RODADA 5 — O QUE VOCÊS DOIS BEBEM. VOCÊ: CAFÉ, ENERGÉTICO, "VOU BEBER ÁGUA AMANHÃ". SEU PET: ÁGUA FILTRADA. SEMPRE.',
      emoji: '💧',
      options: [
        { text: '🧑 Sou eu — hidratação é complicada', value: 'pet' },
        { text: '🐾 É o pet — ele bebe mais água do que eu', value: 'pet' },
        { text: '💦 Eu também bebo 2L de água por dia', value: 'voce' },
      ],
    },
    {
      question: 'RODADA 6 — A CONSCIÊNCIA NA HORA DE ESCOLHER. VOCÊ: COMPRA O QUE TÁ EM PROMOÇÃO. SEU PET: TEM TUTOR QUE PESQUISA CADA INGREDIENTE.',
      emoji: '🧠',
      options: [
        { text: '🧑 Sou eu — promoção decide', value: 'pet' },
        { text: '🐾 É o pet — alguém aqui se importa mais com o que ele come', value: 'pet' },
        { text: '🔍 Eu também pesquiso antes de comprar', value: 'voce' },
      ],
    },
  ],
  results: {
    voce_ganhou: {
      label: 'VOCÊ GANHOU',
      category: 'Você come melhor que seu pet',
      description: 'Isso é raro. De verdade. Significa que você cuida bem da sua alimentação — e provavelmente já pensa na do pet também. Ou você mentiu em pelo menos duas rodadas. O Dragão vê tudo. 👀\n\nDe qualquer forma: seu pet merece chegar no seu nível.',
      emoji: '🏆',
      profileLabel: 'Pra variar, eu como melhor que meu pet',
      stats: [
        { label: 'CONSCIÊNCIA',    value: 72 },
        { label: 'CRITÉRIO',       value: 68 },
        { label: 'COMPROMETIMENTO', value: 75 },
        { label: 'HUMOR',          value: 65 },
      ],
      ctaText: 'ELEVAR O PET AO SEU NÍVEL →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
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
      ctaLink: 'https://comidadedragao.com.br',
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
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
  },
  computeResult: (answers) => {
    const petVotes = answers.filter((a) => a === 'pet').length;
    if (petVotes >= 6) return 'pet_muito_melhor';
    if (petVotes >= 4) return 'pet_ganhando';
    if (petVotes === 3) return 'empate';
    return 'voce_ganhou';
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
