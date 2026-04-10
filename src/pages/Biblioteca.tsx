import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Portal.css";
import "./Biblioteca.css";

type Categoria =
  | "Digestibilidade & Nutrição"
  | "Saúde & Microbiota"
  | "Alergia & Dermatite"
  | "Reviews Gerais"
  | "Aceitação de Consumidor"
  | "Saúde Sênior";

type Artigo = {
  id: number;
  titulo: string;
  categoria: Categoria;
  resumo: string;
  arquivo: string;
};

const CATEGORIAS: Categoria[] = [
  "Digestibilidade & Nutrição",
  "Saúde & Microbiota",
  "Alergia & Dermatite",
  "Reviews Gerais",
  "Aceitação de Consumidor",
  "Saúde Sênior",
];

// Cor por categoria usando as variáveis do Portal
const COR_CATEGORIA: Record<Categoria, string> = {
  "Digestibilidade & Nutrição": "var(--dragon-orange)",
  "Saúde & Microbiota": "var(--dragon-lime)",
  "Alergia & Dermatite": "var(--dragon-pink)",
  "Reviews Gerais": "var(--dragon-yellow)",
  "Aceitação de Consumidor": "var(--dragon-violet)",
  "Saúde Sênior": "var(--dragon-green)",
};

const PDF_BASE = "/assets/pdfs/artigos%20cientificos/";

const MARQUEE_TOP = [
  "BIBLIOTECA CIENTÍFICA",
  "17 ARTIGOS SOBRE BSF",
  "A CIÊNCIA POR TRÁS DO DRAGÃO",
  "HERMETIA ILLUCENS",
  "NUTRIÇÃO · SAÚDE · ALERGIA",
  "88,9% DE DIGESTIBILIDADE",
  "O DRAGÃO LEU TUDO",
];

const MARQUEE_BOTTOM = [
  "// DIGESTIBILIDADE & NUTRIÇÃO",
  "// SAÚDE & MICROBIOTA",
  "// ALERGIA & DERMATITE",
  "// REVIEWS GERAIS",
  "// ACEITAÇÃO DE CONSUMIDOR",
  "// SAÚDE SÊNIOR",
  "🐉 CIÊNCIA DE VERDADE",
];

const ARTIGOS: Artigo[] = [
  {
    id: 1,
    titulo:
      "Efeitos da Larva da Mosca Soldado Negro como Fonte de Proteína ou Gordura sobre Digestibilidade de Nutrientes, Microbiota Fecal e Perfil Metabólico em Cães Beagle",
    categoria: "Digestibilidade & Nutrição",
    resumo:
      "Substituir 20% da farinha de frango por proteína de BSF ou 8% do óleo por gordura de BSF manteve parâmetros de saúde, peso e capacidade antioxidante dentro do normal em cães. A gordura de BSF preservou os níveis de ácidos graxos de cadeia curta no intestino. A proteína de BSF alterou positivamente a microbiota, enriquecendo gêneros associados a vitaminas do complexo B. O estudo confirma BSF como fonte segura e viável em alimentos para cães.",
    arquivo: "bsf-protein-fat-digestibility-microbiota-beagle.pdf",
  },
  {
    id: 2,
    titulo:
      "Digestibilidade e Segurança da Farinha e do Óleo Secos de Larva da Mosca Soldado Negro em Cães",
    categoria: "Digestibilidade & Nutrição",
    resumo:
      "Dois ensaios com cães adultos avaliaram dietas com farinha de BSF (5%, 10%, 20%) e óleo de BSF (1%, 2,5%, 5%) durante 28 dias. Todas as dietas foram bem aceitas, sem alterações em peso, consumo, hematologia ou bioquímica sanguínea. A digestibilidade aparente total de matéria seca, proteína, gordura e energia foi alta em todos os grupos. Conclusão: farinha e óleo de BSF são seguros e podem ser incluídos sem restrições na dieta de cães.",
    arquivo: "bsf-digestibility-safety-meal-oil-dogs.pdf",
  },
  {
    id: 3,
    titulo:
      "Digestibilidade In Vitro e Fermentabilidade de Insetos Selecionados para Alimentos de Cães",
    categoria: "Digestibilidade & Nutrição",
    resumo:
      "O estudo comparou larvas de BSF, mosca doméstica e tenébrio quanto à digestibilidade in vitro e fermentação pela microbiota canina. A BSF apresentou digestibilidade de nitrogênio de 87,7% e perfil de aminoácidos de alta qualidade. Os resíduos não digeridos foram fermentados pela microbiota, gerando acetato, propionato e butirato. Conclusão: insetos, incluindo BSF, oferecem proteína de boa qualidade e apoiam fermentação intestinal benéfica.",
    arquivo: "bsf-in-vivo-vitro-digestibility-dog-food.pdf",
  },
  {
    id: 4,
    titulo:
      "Avaliação de Dieta Extrusada para Cães Adultos Contendo Farinha de Larva da Mosca Soldado Negro",
    categoria: "Digestibilidade & Nutrição",
    resumo:
      "Doze Beagles foram alimentados em cross-over com dieta extrusada contendo 200 g/kg de farinha de BSF versus dieta controle com farinha de cordeiro. A dieta com BSF reduziu o volume fecal e apresentou maior digestibilidade da matéria seca. Parâmetros imunológicos, hematológicos e de proliferação linfocitária não foram afetados. Conclusão: a farinha de BSF pode ser considerada fonte proteica alternativa segura e eficaz para cães adultos.",
    arquivo: "bsf-extruded-diet-adult-dogs.pdf",
  },
  {
    id: 5,
    titulo:
      "Avaliação da Suplementação de Farinha Desengordurada de Larva da Mosca Soldado Negro em Cães Beagle",
    categoria: "Digestibilidade & Nutrição",
    resumo:
      "Cães Beagle receberam dietas com 0%, 1% ou 2% de farinha desengordurada de BSF por 42 dias, com desafio imunológico ao final. A suplementação aumentou linearmente a digestibilidade da matéria seca e proteína bruta. Também reduziu marcadores inflamatórios (TNF-α) e elevou enzimas antioxidantes (GPx, SOD). Conclusão: a farinha de BSF traz benefícios anti-inflamatórios, antioxidantes e digestivos a cães.",
    arquivo: "bsf-defatted-meal-supplementation-beagle.pdf",
  },
  {
    id: 6,
    titulo:
      "Farinha de Larva da Mosca Soldado Negro em Alimento Extrusado: Efeitos na Qualidade Nutricional e Parâmetros de Saúde em Gatos Adultos Saudáveis",
    categoria: "Saúde & Microbiota",
    resumo:
      "Oito gatos adultos receberam dieta extrusada com 37,5% de farinha de BSF versus controle com farinha de frango por 28 dias. A dieta foi bem aceita, com fezes bem formadas e digestibilidade considerada alta. A BSF impactou positivamente a microbiota intestinal, aumentando ácidos graxos de cadeia curta e o gênero Bifidobacterium. Conclusão: alimento extrusado à base de BSF é seguro, nutritivo e pode favorecer a saúde intestinal felina.",
    arquivo: "bsf-extruded-food-health-parameters-cats.pdf",
  },
  {
    id: 7,
    titulo:
      "Avaliação Nutricional da Mosca Soldado Negro Criada em Diferentes Substratos em Dietas para Gatos e Efeitos na Microbiota Fecal",
    categoria: "Saúde & Microbiota",
    resumo:
      "Trinta gatos foram testados com dietas substituindo 3% ou 6% da farinha de frango por BSF criada em substrato animal ou vegetal. A substituição aumentou significativamente a digestibilidade da proteína bruta, gordura e aminoácidos essenciais. A microbiota fecal foi modulada positivamente, com aumento de Bacteroidota. Conclusão: é seguro e benéfico substituir até 6% da proteína de gatos por larvas de BSF.",
    arquivo: "bsf-substrates-cat-diets-fecal-microbiota.pdf",
  },
  {
    id: 8,
    titulo:
      "Derivados Proteicos da Larva da Mosca Soldado Negro: Potencial para Promover a Saúde Animal",
    categoria: "Saúde & Microbiota",
    resumo:
      "Avaliou o potencial antioxidante in vitro de proteínas e hidrolisados de BSF em cinco modelos, comparando com farinhas de frango e peixe. Os derivados de BSF demonstraram forte capacidade de proteger células contra danos oxidativos provocados pela resposta imune. Farinhas de frango e peixe tiveram efeito neutro ou até pró-oxidante. Conclusão: BSF pode atuar como ingrediente funcional, promovendo saúde em formulações de pet food.",
    arquivo: "bsf-protein-derivatives-animal-health.pdf",
  },
  {
    id: 9,
    titulo:
      "Avaliação do Impacto da Farinha de Inseto em Alimento Seco para Cão com Alergia Alimentar: Relato de Caso",
    categoria: "Alergia & Dermatite",
    resumo:
      "Beagle fêmea de 5 anos com alergia alimentar e sintomas gastrointestinais foi testada em dieta com farinha de BSF versus controle com farinha de frango. Com a dieta BSF, a cadela manteve escore fecal adequado e ficou sem sintomas. O desafio com a dieta controle reinduziu os sintomas, revertidos em 2 dias ao retornar à BSF. Conclusão: a farinha de BSF é alternativa viável, acessível e eficaz para cães com alergia alimentar.",
    arquivo: "insect-meal-dog-food-allergy-case-report.pdf",
  },
  {
    id: 10,
    titulo:
      "Larva da Mosca Soldado Negro como Substituto Proteico em Reações Alimentares Adversas para Dermatite Canina: Resultados Preliminares",
    categoria: "Alergia & Dermatite",
    resumo:
      "Dezesseis cães (8 saudáveis e 8 com reações alimentares adversas) receberam dieta à base de BSF por 4 semanas. Não houve efeitos gastrointestinais adversos, e os pesos e consistência fecal permaneceram estáveis. A dieta com BSF não agravou o prurido e não alterou parâmetros sanguíneos. Conclusão: BSF é proteína alternativa sustentável e bem tolerada, promissora para dietas hipoalergênicas.",
    arquivo: "bsf-protein-substitute-canine-dermatitis.pdf",
  },
  {
    id: 11,
    titulo:
      "Larva da Mosca Soldado Negro como Fonte Alternativa de Proteína para Dietas de Cães e Gatos",
    categoria: "Reviews Gerais",
    resumo:
      "Tese de doutorado que avaliou composição, digestibilidade de aminoácidos e efeitos da BSF em gatos adultos. Os resultados mostraram alto valor biológico da proteína, DIAAS compatível com fontes tradicionais e boa palatabilidade. As dietas com farinha, larva inteira ou óleo de BSF mantiveram saúde, pele e pelagem dos gatos. Conclusão: BSF é ingrediente seguro, nutritivo e viável para substituir proteínas tradicionais.",
    arquivo: "bsf-alternative-protein-canine-feline-diets.pdf",
  },
  {
    id: 12,
    titulo:
      "Valor Nutricional da Mosca Soldado Negro (Hermetia illucens L.) e sua Adequação como Alimento Animal — Revisão",
    categoria: "Reviews Gerais",
    resumo:
      "Revisão dos níveis nutricionais da BSF, mostrando 37-63% de proteína e 7-39% de gordura na matéria seca. A BSF apresenta aminoácidos essenciais, minerais e ácidos graxos relevantes, mas processamento e alto teor de gordura podem limitar substituição total. A biologia do inseto permite criação sustentável em resíduos. Conclusão: BSF é fonte proteica promissora, mas requer mais pesquisa sobre processamento.",
    arquivo: "bsf-nutritional-value-animal-feed-review.pdf",
  },
  {
    id: 13,
    titulo:
      "Revisão da Mosca Soldado Negro (Hermetia illucens) como Alimento Animal e Humano",
    categoria: "Reviews Gerais",
    resumo:
      "Revisão abrangente sobre a capacidade da BSF de converter resíduos orgânicos em biomassa com 42% de proteína e 29% de gordura. A espécie não concentra pesticidas nem micotoxinas e já é recomendada como ração animal. Para consumo humano, a larva pode ser moída em proteína texturizada. Conclusão: a maior vantagem da BSF é fechar ciclos de nutrientes convertendo resíduos em alimento.",
    arquivo: "bsf-animal-feed-human-food-review.pdf",
  },
  {
    id: 14,
    titulo:
      "Desvendando o Real Potencial dos Derivados Proteicos da Mosca Soldado Negro em Dietas Pet",
    categoria: "Reviews Gerais",
    resumo:
      "Estudo avaliou o potencial antiartrítico de derivados proteicos de BSF em ensaios de inibição de proteinase, estabilidade de membrana e produção de ROS. Os derivados demonstraram forte capacidade de prevenir e potencialmente combater artrite, auxiliados pela presença natural de glucosamina. A farinha de frango mostrou contribuir para produção de ROS por monócitos. Conclusão: BSF tem ingredientes funcionais valiosos para proteção articular.",
    arquivo: "insects-protein-quality-dog-cat-foods.pdf",
  },
  {
    id: 15,
    titulo:
      "Aceitação da Larva da Mosca Soldado Negro como Alimento pelos Americanos",
    categoria: "Aceitação de Consumidor",
    resumo:
      "Dois estudos avaliaram a disposição de adultos americanos em consumir BSF diretamente, em animais alimentados com ela, ou em dar para seus cães. Os participantes aceitaram muito mais alimentos com farinha de inseto do que com insetos inteiros, padrão que também se repetiu em pet food. Rotas indiretas foram mais aceitas do que consumo direto. Conclusão: BSF é alternativa viável e bem aceita para pet food.",
    arquivo: "americans-acceptance-bsf-as-food.pdf",
  },
  {
    id: 16,
    titulo:
      "Percepção dos Consumidores sobre Produtos de Panificação com Gordura de Inseto como Substituto Parcial da Manteiga",
    categoria: "Aceitação de Consumidor",
    resumo:
      "344 consumidores avaliaram bolos, biscoitos e waffles com 0%, 25% ou 50% de gordura de BSF substituindo manteiga. A substituição de 25% foi bem aceita sem alterar a experiência sensorial; em waffles, até 50% foi aceito. Textura e cor pouco mudaram. Conclusão: a gordura de BSF é ingrediente viável em panificação, e pesquisas futuras devem refinar o ingrediente.",
    arquivo: "consumers-perception-bakery-insect-fat.pdf",
  },
  {
    id: 17,
    titulo:
      "Declaração do Conselho Científico da FEDIAF — Nutrição de Cães Sênior",
    categoria: "Saúde Sênior",
    resumo:
      "Declaração oficial do comitê científico da FEDIAF sobre necessidades nutricionais de cães idosos. Reconhece que envelhecimento varia por raça e tamanho, com cães grandes envelhecendo mais cedo (5-8 anos) que pequenos (10+). Destaca declínio cognitivo, doenças articulares e alterações metabólicas. Conclusão: cães sênior precisam de dietas específicas e acompanhamento veterinário regular.",
    arquivo: "fediaf-sab-statement-nutrition-of-senior-dogs.pdf",
  },
];

const MarqueeBar = ({ items, bottom = false }: { items: string[]; bottom?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-bar${bottom ? " bottom" : ""}`}>
      <div className="marquee-track" style={bottom ? { animationDirection: "reverse" } : undefined}>
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
};

const Biblioteca = () => {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | "Todas">("Todas");
  const [skin, setSkin] = useState(1);

  const artigosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return ARTIGOS.filter((a) => {
      const matchCategoria = categoriaAtiva === "Todas" || a.categoria === categoriaAtiva;
      const matchBusca =
        termo.length === 0 ||
        a.titulo.toLowerCase().includes(termo) ||
        a.resumo.toLowerCase().includes(termo);
      return matchCategoria && matchBusca;
    });
  }, [busca, categoriaAtiva]);

  return (
    <div className={`portal-page biblio-page skin-${skin}`}>
      {/* TOP MARQUEE */}
      <MarqueeBar items={MARQUEE_TOP} />

      {/* HERO */}
      <section className="hero biblio-hero">
        <div className="hero-bg" />
        <div className="dragon-silhouette">🐉</div>
        <div className="hero-content">
          <div className="hero-eyebrow">Comida de Dragão — Biblioteca Científica</div>
          <h1 className="biblio-title">
            A CIÊNCIA<br />
            POR TRÁS DO<br />
            <span className="biblio-title-accent">DRAGÃO.</span>
          </h1>
          <p className="biblio-hero-sub">
            {ARTIGOS.length} artigos peer-reviewed sobre a larva da mosca soldado negro
            na alimentação de cães e gatos. Tudo que embasa o que a gente faz.
          </p>
        </div>
      </section>

      {/* CONTROLS BAR */}
      <nav className="controls-bar">
        <Link to="/portal" className="btn btn-dragon">← Voltar ao Portal</Link>
        <span className="label">Modo</span>
        <div className="skin-dots">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`skin-dot s${n}${skin === n ? " active" : ""}`}
              title={["Curioso", "Nojentinho", "Estudado"][n - 1]}
              onClick={() => setSkin(n)}
            />
          ))}
        </div>
        <span className="skin-active-name">{["Curioso", "Nojentinho", "Estudado"][skin - 1]}</span>
        <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer" className="btn btn-buy">Comprar Agora →</a>
      </nav>

      {/* BUSCA + FILTROS */}
      <div className="section-label">Buscar</div>
      <div className="biblio-controles">
        <input
          type="text"
          className="biblio-busca"
          placeholder="Busque por palavra-chave..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="biblio-filtros">
          <button
            className={`biblio-filtro ${categoriaAtiva === "Todas" ? "ativo" : ""}`}
            onClick={() => setCategoriaAtiva("Todas")}
          >
            Todas · {ARTIGOS.length}
          </button>
          {CATEGORIAS.map((cat) => {
            const count = ARTIGOS.filter((a) => a.categoria === cat).length;
            const ativo = categoriaAtiva === cat;
            return (
              <button
                key={cat}
                className={`biblio-filtro ${ativo ? "ativo" : ""}`}
                style={ativo ? { background: COR_CATEGORIA[cat], borderColor: COR_CATEGORIA[cat], color: "var(--dragon-black)" } : { borderColor: COR_CATEGORIA[cat], color: COR_CATEGORIA[cat] }}
                onClick={() => setCategoriaAtiva(cat)}
              >
                {cat} · {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTADO */}
      <div className="section-label" style={{ marginTop: 24 }}>
        {artigosFiltrados.length} artigo{artigosFiltrados.length !== 1 ? "s" : ""}
      </div>
      <div className="biblio-grid">
        {artigosFiltrados.map((artigo) => {
          const cor = COR_CATEGORIA[artigo.categoria];
          return (
            <a
              key={artigo.id}
              href={`${PDF_BASE}${artigo.arquivo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="biblio-card"
              style={{ borderTopColor: cor }}
            >
              <span className="biblio-card-cat" style={{ color: cor }}>
                // {artigo.categoria}
              </span>
              <h2 className="biblio-card-titulo">{artigo.titulo}</h2>
              <p className="biblio-card-resumo">{artigo.resumo}</p>
              <span className="biblio-card-cta" style={{ color: cor }}>
                LER PDF →
              </span>
            </a>
          );
        })}
      </div>

      {artigosFiltrados.length === 0 && (
        <div className="biblio-vazio">
          Nenhum artigo encontrado. Tente outra busca.
        </div>
      )}

      {/* BOTTOM MARQUEE */}
      <div style={{ marginTop: 48 }}>
        <MarqueeBar items={MARQUEE_BOTTOM} bottom />
      </div>

      {/* FOOTER */}
      <footer className="portal-footer">
        <div className="footer-logo">COMIDA <span>DE DRAGÃO</span></div>
        <nav className="footer-links">
          <Link to="/portal">Portal</Link>
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">🐉 O Dragão leu. O Dragão aprovou. Agora é sua vez.</div>
      </footer>
    </div>
  );
};

export default Biblioteca;
