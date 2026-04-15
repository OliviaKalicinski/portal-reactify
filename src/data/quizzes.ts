// ─────────────────────────────────────────────────────────────────────────────
// COMIDA DE DRAGÃO — QUIZ DATA
// 5 quizzes ativos + 3 em breve = 8 slots.
// Cada quiz ativo preenche uma "dimensão" do perfil do tutor.
// ─────────────────────────────────────────────────────────────────────────────

// ── TIPOS ─────────────────────────────────────────────────────────────────────

export type ProfileDimension = 'personality' | 'nojo' | 'knowledge' | 'eco' | 'pet';

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
  { key: 'personality', title: 'Tipo de Tutor',         icon: '🐲', quizId: 'que-dragao-voce-e'      },
  { key: 'nojo',        title: 'Relação com Inseto',    icon: '🤢', quizId: 'nivel-de-nojo'           },
  { key: 'knowledge',   title: 'Conhecimento Pet Food', icon: '🎓', quizId: 'quanto-voce-sabe'        },
  { key: 'eco',         title: 'Consciência Ambiental', icon: '🌿', quizId: 'consciencia-ambiental'   },
  { key: 'pet',         title: 'Perfil do Pet',         icon: '🐾', quizId: 'qual-produto'            },
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
      profileLabel: 'Smaug — Tutor Guardião',
      ctaText: 'CONHECER A LINHA COMPLETA →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    banguela: {
      label: 'BANGUELA',
      category: 'O Tutor Alma Gêmea',
      description: 'Você e seu pet se entendem sem precisar falar. A conexão é real, profunda, e guia cada escolha que você faz por ele. Você não cuida por obrigação — cuida porque ele é parte de você.\n\nO Dragão te vê: quem ama de verdade escolhe com consciência.',
      emoji: '🖤',
      profileLabel: 'Banguela — Alma Gêmea',
      ctaText: 'ESCOLHER COM CONSCIÊNCIA →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    mushu: {
      label: 'MUSHU',
      category: 'O Tutor de Coração Enorme',
      description: 'Você faz aniversário pro pet, manda foto do prato montado e chora no veterinário. E tá tudo bem. Na verdade, tá mais que bem — porque esse nível de amor merece o melhor alimento do mundo.\n\nO Dragão te vê: tanta intensidade merece uma nutrição à altura.',
      emoji: '🔴',
      profileLabel: 'Mushu — Coração Enorme',
      ctaText: 'VER O QUE ELE MERECE →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    drogon: {
      label: 'DROGON',
      category: 'O Tutor de Respeito Mútuo',
      description: 'Você sabe que amor não é superproteção. Seu pet tem rotina, limites e liberdade — e é mais feliz por isso. Você escolhe com critério, age com consistência e não cai em modinha.\n\nO Dragão te vê: quem pensa com clareza, escolhe com qualidade.',
      emoji: '⚡',
      profileLabel: 'Drogon — Respeito Mútuo',
      ctaText: 'ESCOLHER COM CRITÉRIO →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    falkor: {
      label: 'FALKOR',
      category: 'O Tutor Aventureiro',
      description: 'Você não se perde em ansiedade. Topa testar o que é novo, adora ver seu pet explorar o mundo, e transforma até a rotina em diversão. Seu pet é seu parceiro de aventura, não um projeto a ser gerenciado.\n\nO Dragão te vê: quem não tem medo de experimentar vai longe.',
      emoji: '🌟',
      profileLabel: 'Falkor — Tutor Aventureiro',
      ctaText: 'EXPLORAR A LINHA →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    haku: {
      label: 'HAKU',
      category: 'O Tutor Intuitivo',
      description: 'Você e seu pet têm uma linguagem própria. Você percebe antes de todo mundo quando algo está errado, age pelo instinto e raramente erra. Não precisa de validação — você sabe quando está fazendo a coisa certa.\n\nO Dragão te vê: intuição poderosa merece um alimento à sua altura.',
      emoji: '🌊',
      profileLabel: 'Haku — Tutor Intuitivo',
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
      profileLabel: 'Nojentíssimo Premium',
      ctaText: 'VER O QUE SEU PET JÁ SABE →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    funcional: {
      label: 'NOJENTO FUNCIONAL',
      category: 'Faz, mas sofre',
      description: 'Você consegue. Não gosta, mas consegue. E isso já é muito — porque a maioria das grandes mudanças na história da alimentação começou exatamente assim: com alguém fazendo uma careta e experimentando mesmo assim.\n\nO Dragão respeita a coragem disfarçada de nojo.',
      emoji: '😬',
      profileLabel: 'Nojento Funcional',
      ctaText: 'DAR O PRIMEIRO PASSO →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    transicao: {
      label: 'EM TRANSIÇÃO',
      category: 'Curioso, mas cauteloso',
      description: 'Você está no lugar mais interessante de todos: na fronteira entre o velho e o novo. Faz perguntas, lê ingredientes, pesa o nojo contra a lógica. Esse é exatamente o perfil de tutor que muda de ideia com um dado bom.\n\nAqui vai um: 83% menos emissões de carbono. 15.000 litros a menos de água por kg.',
      emoji: '🤔',
      profileLabel: 'Em Transição',
      ctaText: 'OS DADOS QUE VÃO TE CONVENCER →',
      ctaLink: '/biblioteca',
    },
    quase: {
      label: 'QUASE LÁ',
      category: 'O nojo já foi embora, só falta o hábito',
      description: 'Inseto não te assusta. Você provavelmente já leu sobre BSF antes, ou pelo menos não fechou o artigo no primeiro parágrafo. O que falta é só dar o passo — e seu pet está esperando faz tempo.\n\nO Dragão vê você hesitando. E ele não entende por quê.',
      emoji: '😏',
      profileLabel: 'Quase Lá',
      ctaText: 'TÁ ESPERANDO O QUÊ? →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    dragao: {
      label: 'DRAGÃO DE VERDADE',
      category: 'Leva inseto pra jantar',
      description: 'Você é a pessoa que explica BSF pra todo mundo na mesa e ainda converte dois amigos por semestre. Não tem nojo, tem curiosidade. Não tem medo, tem critério. E já sabe que o futuro da nutrição pet passa por aqui.\n\nO Dragão te reconhece. Você é da família.',
      emoji: '🐉',
      profileLabel: 'Dragão de Verdade',
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
      profileLabel: 'Tutor em Descoberta',
      ctaText: 'CONHECER A COMIDA DE DRAGÃO →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    consciente: {
      label: 'TUTOR CONSCIENTE',
      category: '3–4 acertos',
      description: 'Você pesquisa mais que a média. Sabe que rótulo bonito não é garantia de qualidade, e já questionou pelo menos uma vez o que tem na ração do seu pet. Esse tipo de tutor é raro — e exatamente quem a Comida de Dragão foi feita pra atender.\n\nUm ingrediente. Uma origem. Tudo rastreável da biofábrica até o prato.',
      emoji: '🔍',
      profileLabel: 'Tutor Consciente',
      ctaText: 'POR QUE BSF É DIFERENTE →',
      ctaLink: '/biblioteca',
    },
    dragao: {
      label: 'TUTOR DRAGÃO',
      category: '5–6 acertos',
      description: 'Você já deveria fazer parte do nosso time. Conhece os bastidores do mercado, entende de digestibilidade, sabe o que "farinha de subprodutos" realmente significa e não aceita resposta vaga de fabricante.\n\nO Dragão te reconhece. E tem muito orgulho.',
      emoji: '🐉',
      profileLabel: 'Tutor Dragão',
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
  hoverImage: '/assets/images/larva-pets-amam.jpg',
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
      profileLabel: 'Tutor Versátil',
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR ORIGINAL →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    legumes: {
      label: 'MORDIDA — LEGUMES',
      category: 'Nutrição + sabor + vegetais.',
      description: 'Snack assado com BSF, cenoura, cúrcuma e betacaroteno. Rico em nutrientes naturais, ótima palatabilidade e zero frescura pra aceitar. Pra tutores que querem petisco com substância — não só crocância.',
      emoji: '🥦',
      profileLabel: 'Tutor Natureba',
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR MORDIDA LEGUMES →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    spirulina: {
      label: 'MORDIDA — SPIRULINA',
      category: 'Pra ver a diferença na pelagem e na energia.',
      description: 'Spirulina, coco, espinafre e BSF num snack que age por dentro. Antioxidantes, ficocianina e triglicerídeos de cadeia média — palavras difíceis pra um resultado simples: pelo mais bonito, imunidade melhor, mais disposição.',
      emoji: '✨',
      profileLabel: 'Tutor Vitalidade',
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR MORDIDA SPIRULINA →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    integral: {
      label: 'SUPLEMENTO INTEGRAL',
      category: 'O boost diário. Mistura na ração e pronto.',
      description: '45% de proteína no mínimo, cúrcuma e spirulina em pó. Fácil de incluir na rotina, aumenta a palatabilidade da ração e serve pra cães em crescimento, muito ativos ou com baixo apetite.',
      emoji: '💪',
      profileLabel: 'Tutor de Atleta',
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR SUPLEMENTO INTEGRAL →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    concentrado: {
      label: 'SUPLEMENTO CONCENTRADO',
      category: 'Máxima proteína. Mínima gordura.',
      description: '55% de proteína no mínimo — a maior concentração da linha. Com apenas 9,45% de gordura, é o produto certo pra cães em recuperação, com pancreatite, restrição de gordura ou que precisam de reconstrução muscular real.',
      emoji: '🔬',
      profileLabel: 'Tutor Precision',
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR SUPLEMENTO CONCENTRADO →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    felino: {
      label: 'SUPLEMENTO FELINO',
      category: 'Feito pra gato. Do jeito que gato precisa.',
      description: '40% de proteína no mínimo com taurina — o aminoácido essencial que gato não produz sozinho. Cuida do coração, da visão e da saúde geral. Porque gato não é cão pequeno, e o Dragão sabe disso.',
      emoji: '🐱',
      profileLabel: 'Tutor de Felino',
      coupon: 'PRIMEIRODRAGO',
      ctaText: 'COMPRAR SUPLEMENTO FELINO →',
      ctaLink: 'https://comidadedragao.com.br/collections/produtos',
    },
    grub: {
      label: 'GRUB — ALIMENTO EM GEL',
      category: 'Pra quem tem um dragão de verdade em casa.',
      description: 'Pó que vira gel com água quente — proteína de 3 fontes de insetos, 47% no mínimo, relação Ca:P perfeita pra répteis. Sem inseto vivo, sem odor, sem complicação. Nutrição consistente de verdade pro seu animal exótico.',
      emoji: '🦎',
      profileLabel: 'Tutor de Exótico',
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
  hoverImage: '/assets/images/biofabrica-exterior.jpeg',
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
      profileLabel: 'Pegada Considerável',
      ctaText: 'VER COMO COMEÇAR →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    building: {
      label: 'CONSCIENTE EM CONSTRUÇÃO',
      category: 'Quer fazer melhor, mas a rotina complica',
      description: 'Você já pensa. Já questiona. Já fez algumas mudanças — mas sabe que ainda tem espaço pra evoluir. Esse é o perfil mais comum entre pessoas que realmente chegam a mudar: não é perfeição, é processo.\n\nO Dragão não pede perfeição. Só escolhas melhores, uma de cada vez.',
      emoji: '🌥️',
      profileLabel: 'Consciente em Construção',
      ctaText: 'UMA ESCOLHA QUE FAZ DIFERENÇA →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    almostConsistent: {
      label: 'QUASE CONSISTENTE',
      category: 'Já entendeu, agora é fechar os gaps',
      description: 'Você tem consciência, tem intenção e já colocou bastante em prática. O que falta é consistência nos pontos cegos — aquelas áreas onde o hábito ainda fala mais alto que o valor.\n\nO Dragão vê os gaps. E tem uma sugestão pra cada um deles.',
      emoji: '⛅',
      profileLabel: 'Quase Consistente',
      ctaText: 'FECHAR OS GAPS →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    almostThere: {
      label: 'QUASE LÁ',
      category: 'Já virou estilo de vida, falta só compartilhar',
      description: 'Você já internalizou. Separa lixo, pensa na origem, reduziu carne, e faz perguntas que a maioria nem sabe que existem. O próximo nível não é consumir melhor — é influenciar as pessoas ao redor.\n\nO Dragão precisa de pessoas como você.',
      emoji: '🌤️',
      profileLabel: 'Quase Lá — Eco',
      ctaText: 'FAZER PARTE DO MOVIMENTO →',
      ctaLink: 'https://comidadedragao.com.br',
    },
    greenDragon: {
      label: 'DRAGÃO VERDE',
      category: 'Vive o que prega',
      description: 'Você é a referência no grupo. A pessoa que as outras mandam mensagem quando têm dúvida sobre reciclagem, origem de alimento ou impacto ambiental. Não é postura — é convicção.\n\nO Dragão te reconhece. E já sabia que você chegaria até aqui.',
      emoji: '🌿',
      profileLabel: 'Dragão Verde',
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
// QUIZZES 6–8 — EM BREVE
// ─────────────────────────────────────────────────────────────────────────────

const comingSoon = (
  id: string,
  title: string,
  subtitle: string,
  emoji: string,
  accent: string,
  cardRatio: string,
  cardFlex: number,
): QuizDef => ({
  id,
  title,
  subtitle,
  intro: '',
  emoji,
  accent,
  cardRatio,
  cardFlex,
  comingSoon: true,
  questions: [],
  results: {},
  computeResult: () => '',
});

const quizCS1 = comingSoon('cs-this-or-that', 'ISTO OU AQUILO?', 'Formato em breve', '🔀', '#FF7A00', 'ratio-5-4', 5 / 4);
const quizCS2 = comingSoon('cs-erros-tutor',  'QUAL ERRO VOCÊ COMETE?', 'Formato em breve', '😬', '#925AED', 'ratio-3-4', 3 / 4);
const quizCS3 = comingSoon('cs-pet-stories',  'A VIDA DO SEU PET EM 6 CENAS', 'Formato em breve', '🎬', '#00D96F', 'ratio-16-9', 16 / 9);

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT FINAL
// ─────────────────────────────────────────────────────────────────────────────

export const QUIZZES: QuizDef[] = [
  quizPersonality,
  quizNojo,
  quizKnowledge,
  quizProduto,
  quizEco,
  quizCS1,
  quizCS2,
  quizCS3,
];

// Layout do grid: cada array = uma linha de cards
export const GRID_LAYOUT: number[][] = [
  [0, 1, 2],
  [3, 4],
  [5, 6, 7],
];
