import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms } from "@/lib/utm";
import "./Portal.css";
import "./Produtos.css";
import "./QueroSerDragao.css";
import "./Fofo.css";
import "./PortalJanelas.css";
import "./ProdutosJanelas.css";

const MARQUEE_TOP = [
  "PRODUTOS COMIDA DE DRAGÃO",
  "LINHA COMPLETA",
  "88,9% DIGESTIBILIDADE",
  "BIOFÁBRICA RJ",
  "DO RESÍDUO À PROTEÍNA",
  "PROTEÍNA DE VERDADE",
];

const MARQUEE_BOTTOM = [
  "// CÃES · GATOS · RÉPTEIS · ANFÍBIOS",
  "// SNACK · SUPLEMENTO · COMIDA NATURAL · GEL",
  "NOJENTO É O DESPERDÍCIO",
  "MAIS QUE UM ALIMENTO, UMA REVOLUÇÃO",
];

const MarqueeBar = ({ items, bottom = false }: { items: string[]; bottom?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-bar${bottom ? " bottom" : ""}`}>
      <div
        className="marquee-track"
        style={bottom ? { animationDirection: "reverse" } : undefined}
      >
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
};

/* janela OS, a mesma da home e da /parceiros (15/10/26: a página entra no estilo das janelas) */
const Win = ({ name, children, className, inverted, mac }: {
  name: string; children: React.ReactNode; className?: string; inverted?: boolean; mac?: boolean;
}) => (
  <section className={`qsd8-win${inverted ? " inverted" : ""}${className ? " " + className : ""}`}>
    <div className="qsd8-titlebar">
      {mac && <span className="qsd8-mac-dots" aria-hidden="true"><i /><i /></span>}
      <span className="qsd8-tb-name">{name}</span>
      <span className="qsd8-tb-stripes" aria-hidden="true" />
      <span className="qsd8-tb-x" aria-hidden="true">×</span>
    </div>
    <div className="qsd8-win-body">{children}</div>
  </section>
);

// ================ PRODUTOS ================
type PetType = "caes" | "gatos" | "repteis";

interface Produto {
  id: string;
  nome: string;
  variante?: string;
  tamanho: string;
  tag: string;
  pets: PetType[];
  corTag: string;
  corCard: string;             // cor de fundo do card (hex)
  corTexto?: string;           // cor do texto — padrão #0A0A0A, use #ffffff para fundos escuros
  fotos: string[];
  destaques: string[];         // 3 bullets curtos no card
  proteina: string;
  gordura: string;
  energia: string;
  composicao: string[];
  quandoUsar: string[];
  dosagem?: Array<{ porte: string; qtd: string }>;
  dosagemTitulo?: string;      // título da tabela (padrão "Quanto dar")
  diferenciais: string[];
  alerta?: string;             // ⚠️ caso tenha
  ficha?: string;              // PDF da ficha técnica
  loja: string;                // página do produto na loja oficial (Shopify)
  ml?: string;                 // anúncio ativo no Mercado Livre (ml_items do dash); sem ele, só a loja
}

const PRODUTOS: Produto[] = [
  {
    id: "original",
    loja: "https://www.comidadedragao.com.br/products/comida-de-dragao-original",
    ml: "https://produto.mercadolivre.com.br/MLB-4729016795-petisco-natural-proteina-bsf-para-ces-e-gatos-_JM",
    nome: "Original",
    variante: "Larvas inteiras desidratadas",
    tamanho: "90g",
    tag: "TODOS OS PETS",
    pets: ["caes", "gatos", "repteis"],
    corTag: "var(--dragon-orange)",
    corCard: "#FF6600",
    corTexto: "#ffffff",
    fotos: [
      "/assets/images/produtos/original-frente.webp",
      "/assets/images/produtos/original-02.webp",
      "/assets/images/produtos/original-03.webp",
      "/assets/images/produtos/original-04.webp",
      "/assets/images/produtos/original-05.webp",
      "/assets/images/produtos/original-06.webp",
      "/assets/images/produtos/original-07.webp",
      "/assets/images/produtos/original-08.webp",
      "/assets/images/produtos/original-09.webp",
    ],
    destaques: ["Mín. 40% proteína", "3.507 kcal/kg", "Hipoalergênico"],
    proteina: "40% (mín. 400 g/kg)",
    gordura: "30% (mín. 300 g/kg)",
    energia: "3.507 kcal/kg",
    /* 15/10/26: textos reescritos pela ficha do cofre (Produtos - decisões e claims, Original).
       Saiu "(anti-inflamatório natural)": a ficha do Original lista só "alto ácido láurico". */
    composicao: [
      "Larva inteira de mosca soldado negra (Hermetia illucens), desidratada. Só isso.",
      "Ácido láurico: no mínimo 130 g/kg",
    ],
    quandoUsar: [
      "Agrado do dia a dia, prêmio e recompensa",
      "Treino: o sabor prende a atenção",
      "Pet com alergia alimentar: um ingrediente só, fácil de controlar",
      "Pet enjoado, que recusa outros agrados",
      "Primeiro contato com a proteína de inseto",
      "Enriquecimento ambiental",
      "Viagem e passeio: seco, não suja, fácil de levar",
    ],
    diferenciais: [
      "Um ingrediente só: você sabe exatamente o que ele come",
      "100% natural e hipoalergênico",
      "Com ômega 6 e 9",
      "Alto teor de ácido láurico",
    ],
    alerta: "É agrado, não refeição: no máximo 10% do que o pet come no dia",
    ficha: "/assets/pdfs/fichas/ficha-original.pdf",
  },
  {
    /* MORDIDA V2 — substitui as duas V1 (Legumes e Spirulina), que saíram do
       catálogo em 27/07/26. Um SKU só. Todos os números conferidos na ficha
       técnica oficial (Ficha Técnica - Mordida, 27/07/26).
       ⚠️ CLAIM: a PROTEÍNA (BSF) é hipoalergênica; o PRODUTO não é — tem OVO. */
    id: "mordida",
    loja: "https://www.comidadedragao.com.br/products/mordida-de-dragao",
    ml: "https://produto.mercadolivre.com.br/MLB-7447551170-petisco-para-ces-mordida-de-drago-180g-_JM",
    nome: "Mordida",
    variante: "Snack sem grão e sem glúten",
    tamanho: "180g",
    tag: "SÓ CÃES",
    pets: ["caes"],
    corTag: "var(--dragon-green)",
    corCard: "#B9FF33",
    fotos: [
      "/assets/images/produtos/mordida-v2-frente.webp",
    ],
    destaques: ["24% proteína", "43g de proteína por pacote", "Sem grão, sem glúten"],
    proteina: "24% (mín. 240 g/kg)",
    gordura: "15% (mín. 150 g/kg)",
    energia: "4.010 kcal/kg",
    composicao: [
      "Farinha de larva de mosca soldado negra desidratada",
      "Fécula de mandioca e farinha de batata-doce",
      "Ovo em pó",
      "Inulina (mín. 15 g/kg)",
      "Cúrcuma (Curcuma longa)",
      "Biomassa de microalgas desidratada (Spirulina spp.)",
      "Goma xantana e extrato de alecrim",
    ],
    quandoUsar: [
      "Agrado do dia a dia, prêmio e treino",
      "Cão que estranha as proteínas de sempre: a de inseto é nova para ele (atenção: tem ovo)",
      "Cão pequeno: quebra na mão, um vira uns quatro",
      "Pet enjoado, que recusa outros agrados",
      "Intestino: tem inulina, uma fibra prebiótica",
    ],
    dosagem: [
      { porte: "Mini (até 5kg)", qtd: "7g/dia (3 unidades)" },
      { porte: "Pequeno (5–10kg)", qtd: "13g/dia (6 unidades)" },
      { porte: "Médio (10–25kg)", qtd: "26g/dia (11 unidades)" },
      { porte: "Grande (>25kg)", qtd: "38g/dia (16 unidades)" },
    ],
    diferenciais: [
      "Proteína de inseto hipoalergênica, com 88,9% de digestibilidade",
      "Sem grão e sem glúten: mandioca e batata-doce no lugar do trigo",
      "Cúrcuma e spirulina na fórmula",
      "Conservado com extrato de alecrim, sem conservante artificial",
      "Mais proteína que a versão anterior",
    ],
    alerta: "Contém ovo: não serve para pet com alergia a ovo. É agrado, não refeição: no máximo 10% do que ele come no dia",
    ficha: "/assets/pdfs/fichas/ficha-mordida.pdf",
  },
  {
    id: "suplemento-integral",
    loja: "https://www.comidadedragao.com.br/products/suplemento-integral-para-caes",
    ml: "https://produto.mercadolivre.com.br/MLB-6881958918-comida-de-drago-suplemento-proteico-para-ces-_JM",
    nome: "Suplemento Integral",
    variante: "Pó / farinha — mistura na ração",
    tamanho: "180g",
    tag: "SÓ CÃES",
    pets: ["caes"],
    corTag: "var(--dragon-orange)",
    corCard: "#FFCC00",
    fotos: [
      "/assets/images/produtos/suplemento-integral-frente.webp",
      "/assets/images/produtos/integral-02.webp",
      "/assets/images/produtos/integral-03.webp",
      "/assets/images/produtos/integral-04.webp",
      "/assets/images/produtos/integral-05.webp",
      "/assets/images/produtos/integral-06.webp",
      "/assets/images/produtos/integral-07.webp",
      "/assets/images/produtos/integral-08.webp",
    ],
    destaques: ["Mín. 40% proteína", "4.350 kcal/kg", "Hipoalergênico"],
    proteina: "41,5% (mín. 415 g/kg)",
    gordura: "26,1% (mín. 261 g/kg)",
    energia: "4.350 kcal/kg",
    composicao: [
      "Farinha de Larva BSF Desidratada",
      "Cúrcuma",
      "Spirulina",
    ],
    quandoUsar: [
      "Reforço de proteína no dia a dia, misturado na ração",
      "Cão muito ativo, esportista ou de trabalho",
      "Filhote em crescimento",
      "Gestação e amamentação",
      "Pet com pouco apetite: dá mais sabor à ração",
      "Para fazer petisco caseiro",
    ],
    dosagem: [
      { porte: "Mini (até 5kg)", qtd: "1 medida (5g/dia)" },
      { porte: "Pequeno (5–10kg)", qtd: "2 medidas (10g/dia)" },
      { porte: "Médio (10–25kg)", qtd: "3 medidas (15g/dia)" },
      { porte: "Grande (>25kg)", qtd: "4 medidas (20g/dia)" },
    ],
    diferenciais: [
      "No mínimo 40% de proteína, podendo chegar a 45%",
      "Todos os aminoácidos essenciais",
      "Proteína hipoalergênica",
      "Vem com dosador",
    ],
    ficha: "/assets/pdfs/fichas/ficha-suplemento-integral.pdf",
  },
  {
    /* RANGO DO DRAGÃO — entra em 15/10/26 (pedido da Olivia), no lugar do Suplemento
       Concentrado, que saiu de linha. Dados do produto_nodes do dash (produto_id "rango"),
       conferidos na ficha do fabricante (Sensitive BSF, Drive) em 13/10/26.
       ⚠️ CLAIMS: é alimento completo, NÃO é petisco. Não citar % de proteína (os níveis vêm
       no pacote) e nada de hipoalergênico, alergia, pele ou intestino: a regra da proteína
       da larva não se estende a este produto. Não serve para gatos nem filhotes. */
    id: "rango",
    loja: "https://www.comidadedragao.com.br/products/rango-do-dragao-comida-natural-completa-para-caes-adultos-500g",
    nome: "Rango do Dragão",
    variante: "Comida natural úmida — refeição completa",
    tamanho: "500g",
    tag: "CÃES ADULTOS",
    pets: ["caes"],
    corTag: "var(--dragon-lime)",
    corCard: "#2E7BD6",          // azul da LP do Rango (RangoJogo.css)
    corTexto: "#ffffff",
    fotos: [
      // a foto do produto da loja (Shopify, 1ª imagem do Rango), só o pacote, 15/10/26
      "/assets/images/produtos/rango-frente.webp",
    ],
    destaques: ["Alimento completo", "Até 75,6% de água", "Só para cães adultos"],
    proteina: "— níveis no pacote",
    gordura: "— níveis no pacote",
    energia: "— níveis no pacote",
    composicao: [
      "Filé mignon suíno",
      "Batata-doce",
      "Abóbora",
      "Chuchu",
      "Farinha de larva de mosca soldado negra (8%: entra como farinha, não aparece)",
      "A composição completa vem no rótulo",
    ],
    quandoUsar: [
      "Refeição completa do dia, não é agrado nem complemento",
      "Trocar para comida natural, introduzindo aos poucos",
      "Cão que estranha comida nova: comece misturando ao que ele já come",
    ],
    dosagem: [
      { porte: "1 a 5 kg", qtd: "80 a 270 g por dia" },
      { porte: "6 a 10 kg", qtd: "310 a 460 g por dia" },
      { porte: "11 a 25 kg", qtd: "490 a 910 g por dia" },
      { porte: "26 a 30 kg", qtd: "940 a 1.050 g por dia" },
    ],
    diferenciais: [
      "Alimento completo para cães adultos",
      "Filé mignon suíno e proteína de inseto: proteínas pouco comuns na dieta da maioria dos cães",
      "Até 75,6% de água: ele bebe comendo",
      "Contém ácido láurico, naturalmente presente na proteína de inseto",
    ],
    alerta: "Não serve para gatos nem para filhotes. Acima de 30 kg a tabela não cobre: fale com o atendimento",
  },
  {
    id: "suplemento-felino",
    loja: "https://www.comidadedragao.com.br/products/suplemento-para-gatos",
    nome: "Suplemento Felino",
    variante: "Rico em taurina",
    tamanho: "180g",
    tag: "SÓ GATOS",
    pets: ["gatos"],
    corTag: "var(--dragon-violet)",
    corCard: "#925AED",
    corTexto: "#ffffff",
    fotos: [
      "/assets/images/produtos/suplemento-felino-frente.webp",
      "/assets/images/produtos/felino-02.webp",
      "/assets/images/produtos/felino-03.webp",
      "/assets/images/produtos/felino-04.webp",
      "/assets/images/produtos/felino-05.webp",
      "/assets/images/produtos/felino-06.webp",
      "/assets/images/produtos/felino-07.webp",
    ],
    destaques: ["40% proteína", "Taurina 1.520 mg/kg", "Formulação felina"],
    proteina: "40% (mín. 400 g/kg)",
    gordura: "—",
    energia: "4.350 kcal/kg",
    composicao: [
      "Farinha de Larva BSF",
      "Cúrcuma",
      "Spirulina",
      "Taurina adicionada (mín. 1.520 mg/kg)",
    ],
    quandoUsar: [
      "Reforço de proteína no dia a dia, misturado na ração",
      "Para garantir taurina: gato não produz o suficiente sozinho",
      "Gato que come ração vegetal ou comida caseira",
      "Gestação e amamentação",
    ],
    dosagem: [
      { porte: "Dose geral", qtd: "1–2 medidas/dia (5–10g)" },
    ],
    diferenciais: [
      "Feito para gato, não adaptado do de cão",
      "Com taurina adicionada, importante para o coração e a visão do gato",
      "Proteína hipoalergênica",
      "Para todas as fases da vida",
    ],
    ficha: "/assets/pdfs/fichas/ficha-suplemento-felino.pdf",
  },
  {
    id: "grub",
    loja: "https://www.comidadedragao.com.br/products/grub",
    ml: "https://produto.mercadolivre.com.br/MLB-4729004663-grub-raco-para-repteis-_JM",
    nome: "GRUB Gel",
    variante: "Alimento em gel para répteis e anfíbios",
    tamanho: "120g",
    tag: "RÉPTEIS · ANFÍBIOS",
    pets: ["repteis"],
    corTag: "var(--dragon-lime)",
    corCard: "#3FFF33",
    fotos: [
      "/assets/images/produtos/grub-frente.webp",
      "/assets/images/produtos/grub-02.webp",
      "/assets/images/produtos/grub-03.webp",
      "/assets/images/produtos/grub-04.webp",
      "/assets/images/produtos/grub-05.webp",
    ],
    destaques: ["3 fontes de inseto", "Gel ou papinha", "Sem inseto vivo"],
    proteina: "— níveis no pacote",
    gordura: "— níveis no pacote",
    energia: "— níveis no pacote",
    composicao: [
      "Farinha de larva de mosca soldado negra (Hermetia illucens)",
      "Farinha de grilo preto (Gryllus assimilis)",
      "Farinha de tenébrio (Tenebrio molitor)",
      "Cúrcuma, spirulina e levedura nutricional",
      "Gelatina e fécula de mandioca modificada",
    ],
    quandoUsar: [
      "Leopard gecko e teiús: em todas as fases",
      "Dragão-barbudo filhote e jovem (adulto: uma vez por semana, com vegetais)",
      "Gekko tokay, phelsumas, tiliquas, varanus e jacarerana: como complemento",
      "Iguana-verde, crested gecko e quelônios: de vez em quando",
      "Anfíbios: sapo-pacman, sapo-pipa, sapo-boi, rãs arborícolas e salamandras",
    ],
    diferenciais: [
      "Proteína de 3 insetos diferentes",
      "Cálcio e fósforo na proporção pensada para répteis",
      "Mesma nutrição em todo pacote, sem a variação do inseto vivo",
      "Sem cheiro e sem criar inseto vivo em casa",
      "Você controla o tamanho da porção",
    ],
    alerta: "Não serve para tarântulas. Uso proibido na alimentação de ruminantes. Na dúvida sobre a sua espécie, consulte um veterinário de exóticos",
    /* 16/10/26: a ficha do GRUB está em correção no cofre (o PDF traz números do Original):
       sem números de garantia e sem o PDF até a corrigida chegar. O preparo vem da ficha do cofre. */
    dosagemTitulo: "Como preparar",
    dosagem: [
      { porte: "Gel firme", qtd: "2 partes de água quente + 1 de GRUB. Na geladeira, até 5 dias" },
      { porte: "Papinha", qtd: "3 partes de água morna + 1 de GRUB. Na geladeira, até 3 dias" },
    ],
  },
];

const PET_FILTERS: Array<{ key: "todos" | PetType; label: string }> = [
  { key: "todos", label: "Todos" },
  { key: "caes", label: "Cães" },
  { key: "gatos", label: "Gatos" },
  { key: "repteis", label: "Répteis & Anfíbios" },
];

// Helper: extract leading number/percentage for big display
const parseStat = (val: string): { num: string; rest: string } => {
  if (!val || val === '—') return { num: '—', rest: '' };
  const m = val.match(/^([\d,.]+%?)/);
  if (m) return { num: m[1], rest: val.slice(m[1].length).trim() };
  const sp = val.indexOf(' ');
  if (sp !== -1) return { num: val.slice(0, sp), rest: val.slice(sp + 1) };
  return { num: val, rest: '' };
};

const Produtos = () => {
  const [filtro, setFiltro] = useState<"todos" | PetType>("todos");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [fotoIdx, setFotoIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const abriuDe = useRef<HTMLElement | null>(null);
  const fecharRef = useRef<HTMLButtonElement | null>(null);

  // 15/10/26: grava a origem forte (anúncio, rptn, creator) no cookie que a loja lê, como as LPs;
  // os botões levam à loja sem UTM, e é esse cookie que leva a origem até o checkout
  useEffect(() => { captureEntryUtms(); }, []);

  const filtrados = useMemo(() => {
    if (filtro === "todos") return PRODUTOS;
    return PRODUTOS.filter((p) => p.pets.includes(filtro));
  }, [filtro]);

  const activeProduto = useMemo(
    () => PRODUTOS.find((p) => p.id === activeId) ?? null,
    [activeId]
  );

  const openProduto = useCallback((id: string) => {
    abriuDe.current = document.activeElement as HTMLElement | null;
    setActiveId(id);
    setFotoIdx(0);
    setImgLoaded(false);
  }, []);
  const closeProduto = useCallback(() => {
    setActiveId(null);
    // devolve o foco ao cartão que abriu a ficha
    setTimeout(() => abriuDe.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (activeProduto) {
      document.body.style.overflow = "hidden";
      const h = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeProduto();
      };
      document.addEventListener("keydown", h);
      fecharRef.current?.focus();
      return () => {
        document.removeEventListener("keydown", h);
        document.body.style.overflow = "";
      };
    }
  }, [activeProduto, closeProduto]);

  return (
    <div className="qsd8 fofo fofo-verde hj">
      <PageMeta
        title="Produtos · Comida de Dragão"
        description="A linha de proteína de inseto BSF pra pets: Original, Mordida, Suplementos, Rango do Dragão e GRUB — pra cães, gatos, répteis e anfíbios. Ficha técnica e compra em um clique."
        image="/assets/images/nossos-produtos.webp"
      />
      <img className="qsd8-bg" src="/assets/bg-clouds.jpg" alt="" aria-hidden="true" />

      <div className="qsd8-wrap hj-wrap">
        <Link to="/" className="pj-voltar">← voltar pra caverna</Link>

        {/* HERO */}
        <Win name="DESPENSA.EXE" mac className="qsd8-hero-win pj-hero">
          <DragonLogo className="qsd8-hero-logo" />
          <div className="qsd8-eyebrow">Comida de Dragão — Produtos</div>
          <h1 className="qsd8-title">O que tem na <span>despensa?</span></h1>
          <p className="qsd8-sub">
            {PRODUTOS.length} produtos feitos com a mosca soldado negro. Do snack à comida natural,
            do cachorro ao lagarto, com proteína rastreável da nossa biofábrica em Cachoeiras de Macacu.
          </p>
        </Win>

        {/* PRODUTOS: filtros e grade da página de antes, dentro da janela */}
        <Win name="PRODUTOS.DIR" className="pj-produtos">
          <div className="portal-page produtos-page skin-2 qsd8-reels-host hj-host">
      {/* FILTROS */}
      <div className="produtos-filtros">
        {PET_FILTERS.map((f) => {
          const count =
            f.key === "todos"
              ? PRODUTOS.length
              : PRODUTOS.filter((p) => p.pets.includes(f.key as PetType)).length;
          return (
            <button
              type="button"
              key={f.key}
              className={`produtos-filtro${filtro === f.key ? " active" : ""}`}
              onClick={() => setFiltro(f.key)}
            >
              {f.label} <span className="produtos-filtro-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* GRID */}
      <div className="produtos-grid">
        {filtrados.map((p, i) => (
          <button
            type="button"
            key={p.id}
            className="produto-card"
            onClick={() => openProduto(p.id)}
            style={{ background: p.corCard, color: p.corTexto ?? "#0A0A0A" }}
          >
            <div className="produto-card-top">
              <span className="produto-card-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="produto-card-tag">{p.tag}</span>
            </div>
            <div className="produto-card-photo">
              {p.fotos[0] ? (
                <img
                  src={p.fotos[0]}
                  alt={p.nome}
                  className="produto-card-img"
                  loading="lazy"
                />
              ) : (
                <div className="produto-card-placeholder">
                  <span className="produto-placeholder-emoji">[ sem imagem ]</span>
                </div>
              )}
            </div>
            <div className="produto-card-footer">
              <div className="produto-card-title">
                {/* uma palavra por linha; "do", "de" vão junto da seguinte ("Rango / do Dragão"),
                    para o título do Rango não cobrir a foto */}
                {p.nome.split(' ').reduce<string[]>((acc, w) => {
                  if (acc.length && acc[acc.length - 1].length <= 2) acc[acc.length - 1] += ` ${w}`;
                  else acc.push(w);
                  return acc;
                }, []).map((word, i) => (
                  <span key={i} className="produto-card-title-word">{word}</span>
                ))}
              </div>
              <div className="produto-card-meta">
                {p.tamanho}
                {p.variante && <> · {p.variante}</>}
              </div>
            </div>
          </button>
        ))}
      </div>

          </div>
        </Win>

        {/* CTA FINAL */}
        <Win name="LOJA.EXE" inverted className="qsd8-cta-win">
          <h2 className="qsd8-cta-title">Bora pra <span>loja oficial?</span></h2>
          <p className="qsd8-cta-sub">O catálogo completo e entrega direto da biofábrica.</p>
          <div className="qsd8-btnrow" style={{ justifyContent: "center", marginTop: 22 }}>
            <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="qsd8-btn">
              Ir pra loja oficial ↗
            </a>
          </div>
        </Win>

        <footer className="qsd8-footer">
          <DragonLogo className="qsd8-footer-logo" />
          <nav className="qsd8-footer-nav">
            <Link to="/">Caverna</Link>
            <Link to="/parceiros">Parceiros</Link>
            <Link to="/biblioteca">Biblioteca</Link>
            <Link to="/imprensa">Imprensa</Link>
            <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.youtube.com/@comidadedragao" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
            <a href="mailto:somos@letsfly.com.br">Contato</a>
          </nav>
          <div className="qsd8-footer-tag">Nojento é o desperdício.</div>
        </footer>
      </div>

      {/* FICHA DO PRODUTO — janela no estilo da página (15/10/26; antes era a "blueprint" escura).
          Mesmo conteúdo; saíram o selo "Em estoque" (texto fixo, ninguém conferia) e a tabela
          "Ficha técnica", que repetia os três números de cima. */}
      {activeProduto && (() => {
        const prodIdx = PRODUTOS.findIndex((p) => p.id === activeProduto.id);
        const numeros = [
          { rotulo: "Proteína bruta", valor: activeProduto.proteina },
          { rotulo: "Gordura bruta", valor: activeProduto.gordura },
          { rotulo: "Energia metabolizável", valor: activeProduto.energia },
        ].filter((n) => n.valor && !n.valor.startsWith("—"));
        return (
          <div
            className="pj-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) closeProduto(); }}
          >
            <section className="qsd8-win pj-ficha" role="dialog" aria-modal="true" aria-label={activeProduto.nome}>
              <div className="qsd8-titlebar">
                <span className="qsd8-mac-dots" aria-hidden="true"><i /><i /></span>
                <span className="qsd8-tb-name">{activeProduto.id.toUpperCase()}.TXT</span>
                <span className="qsd8-tb-stripes" aria-hidden="true" />
                <button type="button" ref={fecharRef} className="pj-fechar" onClick={closeProduto} aria-label="Fechar">×</button>
              </div>
              <div className="qsd8-win-body">
                <div className="qsd8-eyebrow">Ficha de produto · {String(prodIdx + 1).padStart(2, "0")}</div>
                <h2 className="qsd8-h2 pj-nome">{activeProduto.nome}</h2>
                <p className="pj-variante">
                  <strong className="pj-para">{activeProduto.tag.toLowerCase()}</strong>
                  {" · "}{activeProduto.variante && `${activeProduto.variante} · `}{activeProduto.tamanho}
                </p>

                <div className="pj-topo">
                  <div className="pj-foto-col">
                    <div className="pj-foto" style={{ background: activeProduto.corCard }}>
                      {activeProduto.fotos[fotoIdx] ? (
                        <img
                          key={`${activeProduto.id}-${fotoIdx}`}
                          src={activeProduto.fotos[fotoIdx]}
                          alt={activeProduto.nome}
                          loading="eager"
                          onLoad={() => setImgLoaded(true)}
                          style={{ opacity: imgLoaded ? 1 : 0 }}
                        />
                      ) : null}
                    </div>
                    {activeProduto.fotos.length > 1 && (
                      <div className="pj-thumbs">
                        {activeProduto.fotos.map((f, i) => (
                          <button
                            type="button"
                            key={i}
                            className={`pj-thumb${i === fotoIdx ? " ativo" : ""}`}
                            onClick={() => { setFotoIdx(i); setImgLoaded(false); }}
                            aria-label={`Foto ${i + 1}`}
                          >
                            <img loading="lazy" src={f} alt="" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pj-numeros">
                    {numeros.length > 0 ? numeros.map((n) => {
                      const st = parseStat(n.valor);
                      return (
                        <div className="qsd8-card pj-numero" key={n.rotulo}>
                          <div className="pj-numero-rotulo">{n.rotulo}</div>
                          <div className="qsd8-card-title pj-numero-valor">{st.num}</div>
                          {st.rest && <div className="pj-numero-resto">{st.rest}</div>}
                        </div>
                      );
                    }) : (
                      <div className="qsd8-card pj-numero">
                        <div className="pj-numero-rotulo">Níveis de garantia</div>
                        <div className="pj-numero-resto">Vêm impressos no pacote.</div>
                      </div>
                    )}
                    {activeProduto.ficha && (
                      <a href={activeProduto.ficha} target="_blank" rel="noopener noreferrer" className="qsd8-btn ghost pj-pdf">
                        Ficha técnica em PDF ↗
                      </a>
                    )}
                  </div>
                </div>

                {activeProduto.alerta && (
                  <div className="pj-alerta"><strong>Atenção:</strong> {activeProduto.alerta}</div>
                )}

                <div className="pj-secoes">
                  <div className="pj-secao">
                    <h3 className="pj-secao-titulo">Quando usar</h3>
                    <ul>{activeProduto.quandoUsar.map((q, i) => <li key={i}>{q}</li>)}</ul>
                  </div>
                  <div className="pj-secao">
                    <h3 className="pj-secao-titulo">Composição</h3>
                    <ul>{activeProduto.composicao.map((c, i) => <li key={i}>{c}</li>)}</ul>
                  </div>
                  <div className="pj-secao">
                    <h3 className="pj-secao-titulo">Diferenciais</h3>
                    <ul>{activeProduto.diferenciais.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                  {activeProduto.dosagem && (
                    <div className="pj-secao">
                      <h3 className="pj-secao-titulo">{activeProduto.dosagemTitulo ?? "Quanto dar"}</h3>
                      <table className="pj-dose">
                        <tbody>
                          {activeProduto.dosagem.map((d, i) => (
                            <tr key={i}><th scope="row">{d.porte}</th><td>{d.qtd}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <h3 className="pj-secao-titulo">Onde comprar</h3>
                {/* 15/10/26: a Loja oficial leva à página do produto; o Mercado Livre, ao anúncio ativo
                    dele (ml_items do dash). Amazon fora: a loja lá está em construção (Olivia, 15/10). */}
                <div className="qsd8-btnrow pj-lojas">
                  <a href={activeProduto.loja} target="_blank" rel="noopener noreferrer" className="qsd8-btn pj-loja-btn">
                    Comprar na loja oficial ↗
                  </a>
                  {activeProduto.ml && (
                    <a href={activeProduto.ml} target="_blank" rel="noopener noreferrer" className="qsd8-btn ghost pj-loja-btn">
                      Mercado Livre ↗
                    </a>
                  )}
                </div>
              </div>
            </section>
          </div>
        );
      })()}
    </div>
  );
};

export default Produtos;
