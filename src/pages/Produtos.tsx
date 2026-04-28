import { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Portal.css";
import "./Produtos.css";

const MARQUEE_TOP = [
  "PRODUTOS COMIDA DE DRAGÃO",
  "7 SKUS · LINHA COMPLETA",
  "88,9% DIGESTIBILIDADE",
  "BIOFÁBRICA RJ",
  "DO RESÍDUO À PROTEÍNA",
  "PROTEÍNA DE VERDADE",
];

const MARQUEE_BOTTOM = [
  "// CÃES · GATOS · RÉPTEIS · ANFÍBIOS",
  "// PETISCO · SUPLEMENTO · GEL",
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

// ================ RETAILERS ================
const RETAILERS = [
  { name: "Loja Oficial", url: "https://comidadedragao.com.br", tag: "Melhor preço", color: "var(--dragon-lime)" },
  { name: "Amazon", url: "https://www.amazon.com.br/s?k=comida+de+dragao", tag: "Prime", color: "var(--dragon-violet)" },
  { name: "Petlove", url: "https://www.petlove.com.br", tag: "Especialista pet", color: "var(--dragon-pink)" },
  { name: "Mercado Livre", url: "https://www.mercadolivre.com.br", tag: "Frete grátis", color: "var(--dragon-yellow)" },
];

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
  corCard: string;             // cor de fundo do card (hex) — contraste com texto preto
  fotos: string[];
  destaques: string[];         // 3 bullets curtos no card
  proteina: string;
  gordura: string;
  energia: string;
  composicao: string[];
  quandoUsar: string[];
  dosagem?: Array<{ porte: string; qtd: string }>;
  diferenciais: string[];
  alerta?: string;             // ⚠️ caso tenha
  ficha?: string;              // PDF da ficha técnica
}

const PRODUTOS: Produto[] = [
  {
    id: "original",
    nome: "Original",
    variante: "Larvas inteiras desidratadas",
    tamanho: "90g",
    tag: "TODOS OS PETS",
    pets: ["caes", "gatos", "repteis"],
    corTag: "var(--dragon-orange)",
    corCard: "#FF6600",
    fotos: [
      "/assets/images/produtos/original-frente.png",
      "/assets/images/produtos/original-02.jpg",
      "/assets/images/produtos/original-03.jpg",
      "/assets/images/produtos/original-04.jpg",
      "/assets/images/produtos/original-05.jpg",
      "/assets/images/produtos/original-06.jpg",
      "/assets/images/produtos/original-07.jpg",
      "/assets/images/produtos/original-08.jpg",
      "/assets/images/produtos/original-09.jpg",
    ],
    destaques: ["40% proteína", "3.507 kcal/kg", "Hipoalergênico"],
    proteina: "40% (mín. 400 g/kg)",
    gordura: "30% (mín. 300 g/kg)",
    energia: "3.507 kcal/kg",
    composicao: [
      "100% Larva de Mosca Soldado Negra (Hermetia illucens)",
      "Ácido Láurico mín. 130 g/kg",
    ],
    quandoUsar: [
      "Petisco diário — recompensa, agrado, carinho",
      "Treinamento (alta palatabilidade)",
      "Enriquecimento ambiental",
      "Pets com alergias alimentares (ingrediente único)",
      "Transição para proteína de inseto",
      "Viagens e passeios (não suja, fácil de carregar)",
    ],
    diferenciais: [
      "Ingrediente único — máxima rastreabilidade",
      "100% natural, hipoalergênico",
      "Rico em Ômega 6 e 9",
      "Alto teor de ácido láurico (anti-inflamatório natural)",
    ],
    ficha: "/assets/pdfs/fichas/ficha-original.pdf",
  },
  {
    id: "mordida-legumes",
    nome: "Mordida Legumes",
    variante: "Beterraba, cenoura e cúrcuma",
    tamanho: "180g",
    tag: "CÃES + PEQ. MAMÍFEROS",
    pets: ["caes"],
    corTag: "var(--dragon-green)",
    corCard: "#B9FF33",
    fotos: [
      "/assets/images/produtos/legumes-frente.png",
    ],
    destaques: ["16,7% proteína", "Rico em betacaroteno", "Cúrcuma anti-inflamatória"],
    proteina: "16,7% (mín. 167 g/kg)",
    gordura: "—",
    energia: "3.587 kcal/kg",
    composicao: [
      "Larva BSF",
      "Farinha de trigo e aveia",
      "Beterraba desidratada (mín. 0,2%)",
      "Cenoura desidratada (mín. 0,5%)",
      "Cúrcuma (mín. 0,8%)",
    ],
    quandoUsar: [
      "Petisco diário com vegetais — nutrição + sabor",
      "Pets que precisam de betacaroteno (olhos, pele)",
      "Cães com inflamações leves (cúrcuma)",
      "Snack entre refeições",
      "Pelagem opaca (betacaroteno melhora brilho)",
    ],
    dosagem: [
      { porte: "Mini (até 5kg)", qtd: "2–3 unidades/dia" },
      { porte: "Pequeno (5–10kg)", qtd: "3–4 unidades/dia" },
      { porte: "Médio (10–25kg)", qtd: "5–6 unidades/dia" },
      { porte: "Grande (>25kg)", qtd: "7–8 unidades/dia" },
    ],
    diferenciais: [
      "Rico em betacaroteno (cenoura + beterraba)",
      "Fonte de curcuminoides (cúrcuma 0,8%)",
      "Palatabilidade superior",
      "Pequenos mamíferos (coelhos, porquinhos-da-índia) também curtem",
    ],
    alerta: "Gatos normalmente recusam pelo tamanho da mordida — pra felinos prefira o Original ou o Suplemento Felino",
    ficha: "/assets/pdfs/fichas/ficha-mordidas.pdf",
  },
  {
    id: "mordida-spirulina",
    nome: "Mordida Spirulina",
    variante: "Spirulina, flocos de coco e espinafre",
    tamanho: "180g",
    tag: "CÃES + PEQ. MAMÍFEROS",
    pets: ["caes"],
    corTag: "var(--dragon-green)",
    corCard: "#33FF99",
    fotos: [
      "/assets/images/produtos/spirulina-frente.png",
    ],
    destaques: ["16,5% proteína", "Rica em ficocianina", "Triglicerídeos de cadeia média"],
    proteina: "16,5% (mín. 165 g/kg)",
    gordura: "—",
    energia: "3.494 kcal/kg",
    composicao: [
      "Larva BSF",
      "Farinha de trigo e aveia",
      "Spirulina (mín. 0,16%)",
      "Espinafre desidratado (mín. 0,16%)",
      "Coco em flocos (mín. 1,6%)",
    ],
    quandoUsar: [
      "Petisco nutritivo com superalimento",
      "Cães que precisam de antioxidantes (imunidade)",
      "Pelagem opaca/sem brilho",
      "Snack pós-exercício (recuperação muscular)",
      "Cães idosos (antioxidantes)",
      "Baixa energia (spirulina = vitalidade)",
    ],
    dosagem: [
      { porte: "Mini (até 5kg)", qtd: "2–3 unidades/dia" },
      { porte: "Pequeno (5–10kg)", qtd: "3–4 unidades/dia" },
      { porte: "Médio (10–25kg)", qtd: "5–6 unidades/dia" },
      { porte: "Grande (>25kg)", qtd: "7–8 unidades/dia" },
    ],
    diferenciais: [
      "Rica em ficocianina (spirulina)",
      "Fonte de clorofila",
      "Triglicerídeos de cadeia média (coco)",
      "Pequenos mamíferos (coelhos, porquinhos-da-índia) também curtem",
    ],
    alerta: "Gatos normalmente recusam pelo tamanho da mordida — pra felinos prefira o Original ou o Suplemento Felino",
    ficha: "/assets/pdfs/fichas/ficha-mordidas.pdf",
  },
  {
    id: "suplemento-integral",
    nome: "Suplemento Integral",
    variante: "Pó / farinha — mistura na ração",
    tamanho: "180g",
    tag: "SÓ CÃES",
    pets: ["caes"],
    corTag: "var(--dragon-orange)",
    corCard: "#FFCC00",
    fotos: [
      "/assets/images/produtos/suplemento-integral-frente.png",
    ],
    destaques: ["45% proteína", "4.350 kcal/kg", "Hipoalergênico"],
    proteina: "45% (mín. 415 g/kg)",
    gordura: "26,1% (mín. 261 g/kg)",
    energia: "4.350 kcal/kg",
    composicao: [
      "Farinha de Larva BSF Desidratada",
      "Cúrcuma",
      "Spirulina",
    ],
    quandoUsar: [
      "Boost proteico diário (complementar ração)",
      "Cães muito ativos ou esportistas",
      "Filhotes em crescimento",
      "Gestação/lactação (alta demanda nutricional)",
      "Pets com baixo apetite (concentração proteica)",
      "Cães de trabalho (pastoreio, busca e resgate)",
    ],
    dosagem: [
      { porte: "Mini (até 5kg)", qtd: "1 medida (5g/dia)" },
      { porte: "Pequeno (5–10kg)", qtd: "2 medidas (10g/dia)" },
      { porte: "Médio (10–25kg)", qtd: "3 medidas (15g/dia)" },
      { porte: "Grande (>25kg)", qtd: "4 medidas (20g/dia)" },
    ],
    diferenciais: [
      "No mínimo 45% de proteína",
      "Perfil completo de aminoácidos essenciais",
      "Hipoalergênico",
      "Acompanha dosador",
    ],
    ficha: "/assets/pdfs/fichas/ficha-suplemento-integral.pdf",
  },
  {
    id: "suplemento-concentrado",
    nome: "Suplemento Concentrado",
    variante: "Pó desengordurado — máxima proteína",
    tamanho: "200g",
    tag: "SÓ CÃES",
    pets: ["caes"],
    corTag: "var(--dragon-pink)",
    corCard: "#FF0066",
    fotos: [
      "/assets/images/produtos/suplemento-concentrado-frente.png",
    ],
    destaques: ["55% proteína", "Baixa gordura (9,45%)", "Máxima concentração"],
    proteina: "55% (505 g/kg) — MÁXIMA DA LINHA",
    gordura: "9,45% (mín. 94,5 g/kg) — BAIXO TEOR",
    energia: "3.320 kcal/kg",
    composicao: [
      "Farinha de Larva BSF Desengordurada",
      "Cúrcuma",
      "Spirulina",
    ],
    quandoUsar: [
      "Máxima concentração proteica (55%)",
      "Crescimento acelerado (filhotes grandes)",
      "Gestação/lactação (pico de demanda)",
      "Recuperação pós-operatória",
      "Pets com restrição de gordura (pancreatite, obesidade)",
      "Perda de massa muscular (idosos, doenças)",
      "Atletas caninos",
    ],
    dosagem: [
      { porte: "Mini (até 5kg)", qtd: "1 medida (5g/dia)" },
      { porte: "Pequeno (5–10kg)", qtd: "2 medidas (10g/dia)" },
      { porte: "Médio (10–25kg)", qtd: "3 medidas (15g/dia)" },
      { porte: "Grande (>25kg)", qtd: "4 medidas (20g/dia)" },
    ],
    diferenciais: [
      "55% de proteína — maior concentração da linha",
      "Baixíssimo teor de gordura — ideal para restrições",
      "Hipoalergênico",
      "Livre de gorduras trans",
    ],
    alerta: "Alta concentração — usar em quantidades menores que o Integral",
    ficha: "/assets/pdfs/fichas/ficha-suplemento-concentrado.pdf",
  },
  {
    id: "suplemento-felino",
    nome: "Suplemento Felino",
    variante: "Rico em taurina",
    tamanho: "180g",
    tag: "SÓ GATOS",
    pets: ["gatos"],
    corTag: "var(--dragon-violet)",
    corCard: "#FCBA97",
    fotos: [
      "/assets/images/produtos/suplemento-felino-frente.png",
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
      "Boost proteico diário",
      "Suplementação de taurina (essencial pro coração felino)",
      "Gatos cardiopatas ou com problemas oculares",
      "Gatos que comem ração vegetal ou caseira",
      "Gestação/lactação felina",
    ],
    dosagem: [
      { porte: "Dose geral", qtd: "1–2 medidas/dia (5–10g)" },
    ],
    diferenciais: [
      "Formulação específica felina",
      "Taurina adicionada — essencial pro coração",
      "Hipoalergênico",
      "Todas as fases da vida",
    ],
    ficha: "/assets/pdfs/fichas/ficha-suplemento-felino.pdf",
  },
  {
    id: "grub",
    nome: "GRUB Gel",
    variante: "Alimento em gel para répteis e anfíbios",
    tamanho: "120g",
    tag: "RÉPTEIS · ANFÍBIOS",
    pets: ["repteis"],
    corTag: "var(--dragon-lime)",
    corCard: "#3FFF33",
    fotos: [
      "/assets/images/produtos/grub-frente.png",
    ],
    destaques: ["47% proteína", "Ca:P 2,5:1", "3 fontes de inseto"],
    proteina: "47% (mín. 470 g/kg)",
    gordura: "5,5% (mín. 55 g/kg)",
    energia: "3.450 kcal/kg",
    composicao: [
      "Farinha de Larva BSF (Hermetia illucens)",
      "Farinha de grilo preto (Gryllus assimilis)",
      "Farinha de tenébrio (Tenebrio molitor)",
      "Cúrcuma, Spirulina, Levedura nutricional",
      "Gelatina e fécula de mandioca modificada",
      "Relação Ca:P 2,5:1 — ideal para répteis",
    ],
    quandoUsar: [
      "Leopard gecko, teiú, dragão-barbudo (filhotes)",
      "Iguana-verde (preparações hidratadas)",
      "Crested gecko, tiliquas, varanus",
      "Sapo-pacman, pipa, rãs arborícolas",
      "Salamandras variadas",
    ],
    diferenciais: [
      "Proteína de 3 fontes de insetos (aminoácidos completos)",
      "Relação Ca:P otimizada para répteis (2,5:1)",
      "Nutrição consistente — sem variação de lote",
      "Zero odor, sem manejo de insetos vivos",
      "Porções controláveis",
    ],
    alerta: "Não indicado para tarântulas · USO PROIBIDO PARA RUMINANTES",
    ficha: "/assets/pdfs/fichas/ficha-grub.pdf",
  },
];

const PET_FILTERS: Array<{ key: "todos" | PetType; label: string }> = [
  { key: "todos", label: "Todos" },
  { key: "caes", label: "Cães" },
  { key: "gatos", label: "Gatos" },
  { key: "repteis", label: "Répteis & Anfíbios" },
];

const Produtos = () => {
  const [filtro, setFiltro] = useState<"todos" | PetType>("todos");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [fotoIdx, setFotoIdx] = useState(0);

  const filtrados = useMemo(() => {
    if (filtro === "todos") return PRODUTOS;
    return PRODUTOS.filter((p) => p.pets.includes(filtro));
  }, [filtro]);

  const activeProduto = useMemo(
    () => PRODUTOS.find((p) => p.id === activeId) ?? null,
    [activeId]
  );

  const openProduto = useCallback((id: string) => {
    setActiveId(id);
    setFotoIdx(0);
  }, []);
  const closeProduto = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (activeProduto) {
      document.body.style.overflow = "hidden";
      const h = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeProduto();
      };
      document.addEventListener("keydown", h);
      return () => {
        document.removeEventListener("keydown", h);
        document.body.style.overflow = "";
      };
    }
  }, [activeProduto, closeProduto]);

  return (
    <div className="portal-page produtos-page skin-2">
      <PageMeta
        title="Produtos · Comida de Dragão"
        description="7 SKUs de proteína de inseto BSF pra pets. Original, Mordidas, Suplementos e GRUB — pra cães, gatos, répteis e anfíbios. Ficha técnica e compra em um clique."
        image="/assets/images/produtos/kit-completo.png"
      />
      <MarqueeBar items={MARQUEE_TOP} />

      {/* HERO (padrão) */}
      <section className="archive-hero">
        <div className="archive-hero-bg" />
        <div className="dragon-silhouette" aria-hidden="true" />
        <div className="archive-hero-content">
          <Link to="/portal" className="archive-backlink">← voltar pro portal</Link>
          <div className="hero-eyebrow">Comida de Dragão — Produtos</div>
          <DragonLogo className="hero-logo" />
          <h1 className="archive-hero-title">
            O que tem na
            <span>despensa?</span>
          </h1>
          <p className="archive-hero-sub">
            {PRODUTOS.length} produtos formulados a partir da mosca soldado negro.
            Do petisco pro suplemento, do cachorro ao lagarto — proteína de verdade,
            rastreável, feita na nossa biofábrica em Cachoeiras de Macacu.
          </p>
        </div>
      </section>

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
            style={{ background: p.corCard }}
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
              <div className="produto-card-title">{p.nome}</div>
              <div className="produto-card-meta">
                {p.tamanho}
                {p.variante && <> · {p.variante}</>}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* CTA FINAL */}
      <section className="produtos-cta-final">
        <h2 className="produtos-cta-titulo">
          Bora pra <span>loja oficial?</span>
        </h2>
        <p className="produtos-cta-sub">
          O menor preço, o catálogo completo e entrega direto da biofábrica.
        </p>
        <a
          href="https://comidadedragao.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="produtos-btn-primary"
        >
          Ir pra loja oficial ↗
        </a>
      </section>

      <MarqueeBar items={MARQUEE_BOTTOM} bottom />

      {/* FOOTER */}
      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <nav className="footer-links">
          <Link to="/portal">Portal</Link>
          <Link to="/parceiros">Parceiros</Link>
          <Link to="/biblioteca">Biblioteca</Link>
          <Link to="/imprensa">Imprensa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@comidadedragao" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">Nojento é o desperdício.</div>
      </footer>

      {/* MODAL DE PRODUTO */}
      {activeProduto && (
        <div
          className="produto-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeProduto();
          }}
        >
          <div className="produto-modal">
            <button
              type="button"
              className="produto-modal-close"
              onClick={closeProduto}
              aria-label="Fechar"
            >
              ✕
            </button>

            <div className="produto-modal-grid">
              {/* GALERIA */}
              <div className="produto-modal-galeria">
                <div className="produto-modal-foto-principal">
                  {activeProduto.fotos[fotoIdx] ? (
                    <img
                      src={activeProduto.fotos[fotoIdx]}
                      alt={activeProduto.nome}
                    />
                  ) : (
                    <div className="produto-modal-placeholder">
                      <span>[ ]</span>
                      <span>foto em breve</span>
                    </div>
                  )}
                </div>
                {activeProduto.fotos.length > 1 && (
                  <div className="produto-modal-thumbs">
                    {activeProduto.fotos.map((f, i) => (
                      <button
                        type="button"
                        key={i}
                        className={`produto-modal-thumb${i === fotoIdx ? " active" : ""}`}
                        onClick={() => setFotoIdx(i)}
                      >
                        <img src={f} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="produto-modal-info">
                <span
                  className="produto-modal-tag"
                  style={{ background: activeProduto.corTag }}
                >
                  {activeProduto.tag}
                </span>
                <h2 className="produto-modal-nome">{activeProduto.nome}</h2>
                {activeProduto.variante && (
                  <div className="produto-modal-variante">{activeProduto.variante}</div>
                )}
                <div className="produto-modal-tamanho">{activeProduto.tamanho}</div>

                {/* DADOS TÉCNICOS */}
                <div className="produto-modal-section">
                  <h3 className="produto-modal-section-titulo">Ficha técnica</h3>
                  <dl className="produto-modal-dados">
                    <div>
                      <dt>Proteína bruta</dt>
                      <dd>{activeProduto.proteina}</dd>
                    </div>
                    <div>
                      <dt>Gordura</dt>
                      <dd>{activeProduto.gordura}</dd>
                    </div>
                    <div>
                      <dt>Energia</dt>
                      <dd>{activeProduto.energia}</dd>
                    </div>
                  </dl>
                </div>

                {/* COMPOSIÇÃO */}
                <div className="produto-modal-section">
                  <h3 className="produto-modal-section-titulo">Composição</h3>
                  <ul className="produto-modal-lista">
                    {activeProduto.composicao.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* QUANDO USAR */}
                <div className="produto-modal-section">
                  <h3 className="produto-modal-section-titulo">Quando usar</h3>
                  <ul className="produto-modal-lista check">
                    {activeProduto.quandoUsar.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                {/* DOSAGEM */}
                {activeProduto.dosagem && (
                  <div className="produto-modal-section">
                    <h3 className="produto-modal-section-titulo">Dosagem por porte</h3>
                    <table className="produto-modal-dosagem">
                      <tbody>
                        {activeProduto.dosagem.map((d, i) => (
                          <tr key={i}>
                            <td>{d.porte}</td>
                            <td>{d.qtd}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* DIFERENCIAIS */}
                <div className="produto-modal-section">
                  <h3 className="produto-modal-section-titulo">Diferenciais</h3>
                  <ul className="produto-modal-lista dragon">
                    {activeProduto.diferenciais.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                {activeProduto.alerta && (
                  <div className="produto-modal-alerta">// ATENÇÃO · {activeProduto.alerta}</div>
                )}

                {activeProduto.ficha && (
                  <a
                    href={activeProduto.ficha}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="produto-modal-ficha-btn"
                  >
                    📄 Baixar ficha técnica (PDF)
                  </a>
                )}

                {/* ONDE COMPRAR */}
                <div className="produto-modal-section">
                  <h3 className="produto-modal-section-titulo">Onde comprar</h3>
                  <div className="produto-modal-retailers">
                    {RETAILERS.map((r) => (
                      <a
                        key={r.name}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="produto-retailer"
                        style={{ borderColor: r.color }}
                      >
                        <span
                          className="produto-retailer-name"
                          style={{ color: r.color }}
                        >
                          {r.name}
                        </span>
                        <span className="produto-retailer-tag">{r.tag}</span>
                        <span className="produto-retailer-arrow">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;
