import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import ArchiveList, { ArchiveItem } from "@/components/ArchiveList";
import "./Portal.css";

const PDF_BASE = "/assets/pdfs/artigos%20cientificos/";

const CATEGORY_COLORS: Record<string, string> = {
  "Digestibilidade & Nutrição": "var(--dragon-orange)",
  "Saúde & Microbiota": "var(--dragon-lime)",
  "Alergia & Dermatite": "var(--dragon-pink)",
  "Reviews Gerais": "var(--dragon-yellow)",
  "Aceitação de Consumidor": "var(--dragon-violet)",
  "Saúde Sênior": "var(--dragon-green)",
};

const MARQUEE_TOP = [
  "BIBLIOTECA CIENTÍFICA",
  "17 PAPERS SOBRE BSF",
  "A CIÊNCIA POR TRÁS DO DRAGÃO",
  "HERMETIA ILLUCENS",
  "88,9% DE DIGESTIBILIDADE",
  "PEER-REVIEWED",
];

const MARQUEE_BOTTOM = [
  "// NUTRIÇÃO · MICROBIOTA · ALERGIA",
  "// REVIEWS · ACEITAÇÃO · SENIOR",
  "🐉 O DRAGÃO LEU TUDO",
  "CIÊNCIA DE VERDADE",
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

// ================ ARTIGOS ================
const ARTIGOS: ArchiveItem[] = [
  {
    id: 1,
    title:
      "Efeitos da Larva da Mosca Soldado Negro como Fonte de Proteína ou Gordura sobre Digestibilidade de Nutrientes, Microbiota Fecal e Perfil Metabólico em Cães Beagle",
    category: "Digestibilidade & Nutrição",
    summary:
      "Substituir 20% da farinha de frango por proteína de BSF ou 8% do óleo por gordura de BSF manteve parâmetros de saúde, peso e capacidade antioxidante dentro do normal em cães. A gordura de BSF preservou os níveis de ácidos graxos de cadeia curta no intestino. A proteína de BSF alterou positivamente a microbiota, enriquecendo gêneros associados a vitaminas do complexo B. O estudo confirma BSF como fonte segura e viável em alimentos para cães.",
    href: `${PDF_BASE}bsf-protein-fat-digestibility-microbiota-beagle.pdf`,
  },
  {
    id: 2,
    title:
      "Digestibilidade e Segurança da Farinha e do Óleo Secos de Larva da Mosca Soldado Negro em Cães",
    category: "Digestibilidade & Nutrição",
    summary:
      "Dois ensaios com cães adultos avaliaram dietas com farinha de BSF (5%, 10%, 20%) e óleo de BSF (1%, 2,5%, 5%) durante 28 dias. Todas as dietas foram bem aceitas, sem alterações em peso, consumo, hematologia ou bioquímica sanguínea. A digestibilidade aparente total de matéria seca, proteína, gordura e energia foi alta em todos os grupos. Conclusão: farinha e óleo de BSF são seguros e podem ser incluídos sem restrições na dieta de cães.",
    href: `${PDF_BASE}bsf-digestibility-safety-meal-oil-dogs.pdf`,
  },
  {
    id: 3,
    title:
      "Digestibilidade In Vitro e Fermentabilidade de Insetos Selecionados para Alimentos de Cães",
    category: "Digestibilidade & Nutrição",
    summary:
      "O estudo comparou larvas de BSF, mosca doméstica e tenébrio quanto à digestibilidade in vitro e fermentação pela microbiota canina. A BSF apresentou digestibilidade de nitrogênio de 87,7% e perfil de aminoácidos de alta qualidade. Os resíduos não digeridos foram fermentados pela microbiota, gerando acetato, propionato e butirato. Conclusão: insetos, incluindo BSF, oferecem proteína de boa qualidade e apoiam fermentação intestinal benéfica.",
    href: `${PDF_BASE}bsf-in-vivo-vitro-digestibility-dog-food.pdf`,
  },
  {
    id: 4,
    title:
      "Avaliação de Dieta Extrusada para Cães Adultos Contendo Farinha de Larva da Mosca Soldado Negro",
    category: "Digestibilidade & Nutrição",
    summary:
      "Doze Beagles foram alimentados em cross-over com dieta extrusada contendo 200 g/kg de farinha de BSF versus dieta controle com farinha de cordeiro. A dieta com BSF reduziu o volume fecal e apresentou maior digestibilidade da matéria seca. Parâmetros imunológicos, hematológicos e de proliferação linfocitária não foram afetados. Conclusão: a farinha de BSF pode ser considerada fonte proteica alternativa segura e eficaz para cães adultos.",
    href: `${PDF_BASE}bsf-extruded-diet-adult-dogs.pdf`,
  },
  {
    id: 5,
    title:
      "Avaliação da Suplementação de Farinha Desengordurada de Larva da Mosca Soldado Negro em Cães Beagle",
    category: "Digestibilidade & Nutrição",
    summary:
      "Cães Beagle receberam dietas com 0%, 1% ou 2% de farinha desengordurada de BSF por 42 dias, com desafio imunológico ao final. A suplementação aumentou linearmente a digestibilidade da matéria seca e proteína bruta. Também reduziu marcadores inflamatórios (TNF-α) e elevou enzimas antioxidantes (GPx, SOD). Conclusão: a farinha de BSF traz benefícios anti-inflamatórios, antioxidantes e digestivos a cães.",
    href: `${PDF_BASE}bsf-defatted-meal-supplementation-beagle.pdf`,
  },
  {
    id: 6,
    title:
      "Farinha de Larva da Mosca Soldado Negro em Alimento Extrusado: Efeitos na Qualidade Nutricional e Parâmetros de Saúde em Gatos Adultos Saudáveis",
    category: "Saúde & Microbiota",
    summary:
      "Oito gatos adultos receberam dieta extrusada com 37,5% de farinha de BSF versus controle com farinha de frango por 28 dias. A dieta foi bem aceita, com fezes bem formadas e digestibilidade considerada alta. A BSF impactou positivamente a microbiota intestinal, aumentando ácidos graxos de cadeia curta e o gênero Bifidobacterium. Conclusão: alimento extrusado à base de BSF é seguro, nutritivo e pode favorecer a saúde intestinal felina.",
    href: `${PDF_BASE}bsf-extruded-food-health-parameters-cats.pdf`,
  },
  {
    id: 7,
    title:
      "Avaliação Nutricional da Mosca Soldado Negro Criada em Diferentes Substratos em Dietas para Gatos e Efeitos na Microbiota Fecal",
    category: "Saúde & Microbiota",
    summary:
      "Trinta gatos foram testados com dietas substituindo 3% ou 6% da farinha de frango por BSF criada em substrato animal ou vegetal. A substituição aumentou significativamente a digestibilidade da proteína bruta, gordura e aminoácidos essenciais. A microbiota fecal foi modulada positivamente, com aumento de Bacteroidota. Conclusão: é seguro e benéfico substituir até 6% da proteína de gatos por larvas de BSF.",
    href: `${PDF_BASE}bsf-substrates-cat-diets-fecal-microbiota.pdf`,
  },
  {
    id: 8,
    title:
      "Derivados Proteicos da Larva da Mosca Soldado Negro: Potencial para Promover a Saúde Animal",
    category: "Saúde & Microbiota",
    summary:
      "Avaliou o potencial antioxidante in vitro de proteínas e hidrolisados de BSF em cinco modelos, comparando com farinhas de frango e peixe. Os derivados de BSF demonstraram forte capacidade de proteger células contra danos oxidativos provocados pela resposta imune. Farinhas de frango e peixe tiveram efeito neutro ou até pró-oxidante. Conclusão: BSF pode atuar como ingrediente funcional, promovendo saúde em formulações de pet food.",
    href: `${PDF_BASE}bsf-protein-derivatives-animal-health.pdf`,
  },
  {
    id: 9,
    title:
      "Avaliação do Impacto da Farinha de Inseto em Alimento Seco para Cão com Alergia Alimentar: Relato de Caso",
    category: "Alergia & Dermatite",
    summary:
      "Beagle fêmea de 5 anos com alergia alimentar e sintomas gastrointestinais foi testada em dieta com farinha de BSF versus controle com farinha de frango. Com a dieta BSF, a cadela manteve escore fecal adequado e ficou sem sintomas. O desafio com a dieta controle reinduziu os sintomas, revertidos em 2 dias ao retornar à BSF. Conclusão: a farinha de BSF é alternativa viável, acessível e eficaz para cães com alergia alimentar.",
    href: `${PDF_BASE}insect-meal-dog-food-allergy-case-report.pdf`,
  },
  {
    id: 10,
    title:
      "Larva da Mosca Soldado Negro como Substituto Proteico em Reações Alimentares Adversas para Dermatite Canina: Resultados Preliminares",
    category: "Alergia & Dermatite",
    summary:
      "Dezesseis cães (8 saudáveis e 8 com reações alimentares adversas) receberam dieta à base de BSF por 4 semanas. Não houve efeitos gastrointestinais adversos, e os pesos e consistência fecal permaneceram estáveis. A dieta com BSF não agravou o prurido e não alterou parâmetros sanguíneos. Conclusão: BSF é proteína alternativa sustentável e bem tolerada, promissora para dietas hipoalergênicas.",
    href: `${PDF_BASE}bsf-protein-substitute-canine-dermatitis.pdf`,
  },
  {
    id: 11,
    title:
      "Larva da Mosca Soldado Negro como Fonte Alternativa de Proteína para Dietas de Cães e Gatos",
    category: "Reviews Gerais",
    summary:
      "Tese de doutorado que avaliou composição, digestibilidade de aminoácidos e efeitos da BSF em gatos adultos. Os resultados mostraram alto valor biológico da proteína, DIAAS compatível com fontes tradicionais e boa palatabilidade. As dietas com farinha, larva inteira ou óleo de BSF mantiveram saúde, pele e pelagem dos gatos. Conclusão: BSF é ingrediente seguro, nutritivo e viável para substituir proteínas tradicionais.",
    href: `${PDF_BASE}bsf-alternative-protein-canine-feline-diets.pdf`,
  },
  {
    id: 12,
    title:
      "Valor Nutricional da Mosca Soldado Negro (Hermetia illucens L.) e sua Adequação como Alimento Animal — Revisão",
    category: "Reviews Gerais",
    summary:
      "Revisão dos níveis nutricionais da BSF, mostrando 37-63% de proteína e 7-39% de gordura na matéria seca. A BSF apresenta aminoácidos essenciais, minerais e ácidos graxos relevantes, mas processamento e alto teor de gordura podem limitar substituição total. A biologia do inseto permite criação sustentável em resíduos. Conclusão: BSF é fonte proteica promissora, mas requer mais pesquisa sobre processamento.",
    href: `${PDF_BASE}bsf-nutritional-value-animal-feed-review.pdf`,
  },
  {
    id: 13,
    title:
      "Revisão da Mosca Soldado Negro (Hermetia illucens) como Alimento Animal e Humano",
    category: "Reviews Gerais",
    summary:
      "Revisão abrangente sobre a capacidade da BSF de converter resíduos orgânicos em biomassa com 42% de proteína e 29% de gordura. A espécie não concentra pesticidas nem micotoxinas e já é recomendada como ração animal. Para consumo humano, a larva pode ser moída em proteína texturizada. Conclusão: a maior vantagem da BSF é fechar ciclos de nutrientes convertendo resíduos em alimento.",
    href: `${PDF_BASE}bsf-animal-feed-human-food-review.pdf`,
  },
  {
    id: 14,
    title:
      "Desvendando o Real Potencial dos Derivados Proteicos da Mosca Soldado Negro em Dietas Pet",
    category: "Reviews Gerais",
    summary:
      "Estudo avaliou o potencial antiartrítico de derivados proteicos de BSF em ensaios de inibição de proteinase, estabilidade de membrana e produção de ROS. Os derivados demonstraram forte capacidade de prevenir e potencialmente combater artrite, auxiliados pela presença natural de glucosamina. A farinha de frango mostrou contribuir para produção de ROS por monócitos. Conclusão: BSF tem ingredientes funcionais valiosos para proteção articular.",
    href: `${PDF_BASE}insects-protein-quality-dog-cat-foods.pdf`,
  },
  {
    id: 15,
    title:
      "Aceitação da Larva da Mosca Soldado Negro como Alimento pelos Americanos",
    category: "Aceitação de Consumidor",
    summary:
      "Dois estudos avaliaram a disposição de adultos americanos em consumir BSF diretamente, em animais alimentados com ela, ou em dar para seus cães. Os participantes aceitaram muito mais alimentos com farinha de inseto do que com insetos inteiros, padrão que também se repetiu em pet food. Rotas indiretas foram mais aceitas do que consumo direto. Conclusão: BSF é alternativa viável e bem aceita para pet food.",
    href: `${PDF_BASE}americans-acceptance-bsf-as-food.pdf`,
  },
  {
    id: 16,
    title:
      "Percepção dos Consumidores sobre Produtos de Panificação com Gordura de Inseto como Substituto Parcial da Manteiga",
    category: "Aceitação de Consumidor",
    summary:
      "344 consumidores avaliaram bolos, biscoitos e waffles com 0%, 25% ou 50% de gordura de BSF substituindo manteiga. A substituição de 25% foi bem aceita sem alterar a experiência sensorial; em waffles, até 50% foi aceito. Textura e cor pouco mudaram. Conclusão: a gordura de BSF é ingrediente viável em panificação, e pesquisas futuras devem refinar o ingrediente.",
    href: `${PDF_BASE}consumers-perception-bakery-insect-fat.pdf`,
  },
  {
    id: 17,
    title: "Declaração do Conselho Científico da FEDIAF — Nutrição de Cães Sênior",
    category: "Saúde Sênior",
    summary:
      "Declaração oficial do comitê científico da FEDIAF sobre necessidades nutricionais de cães idosos. Reconhece que envelhecimento varia por raça e tamanho, com cães grandes envelhecendo mais cedo (5-8 anos) que pequenos (10+). Destaca declínio cognitivo, doenças articulares e alterações metabólicas. Conclusão: cães sênior precisam de dietas específicas e acompanhamento veterinário regular.",
    href: `${PDF_BASE}fediaf-sab-statement-nutrition-of-senior-dogs.pdf`,
  },
];

const Biblioteca = () => {
  return (
    <div className="portal-page skin-2">
      <MarqueeBar items={MARQUEE_TOP} />

      {/* HERO — padrão Comida de Dragão (igual Parceiros) */}
      <section className="archive-hero">
        <div className="archive-hero-bg" />
        <div className="dragon-silhouette">🐉</div>
        <div className="archive-hero-content">
          <Link to="/portal" className="archive-backlink">← voltar pro portal</Link>
          <div className="hero-eyebrow">Comida de Dragão — Biblioteca Científica</div>
          <DragonLogo className="hero-logo" />
          <h1 className="archive-hero-title">
            A ciência por trás do
            <span>Dragão</span>
          </h1>
          <p className="archive-hero-sub">
            {ARTIGOS.length} papers peer-reviewed sobre a larva da mosca soldado negro
            na alimentação de cães e gatos. Tudo que embasa o que a gente faz.
          </p>
        </div>
      </section>

      {/* ARCHIVE LIST */}
      <ArchiveList
        items={ARTIGOS}
        categoryColors={CATEGORY_COLORS}
        searchPlaceholder="Busque por palavra-chave, categoria, tema..."
        openLabel="Abrir PDF →"
        emptyMessage="Nenhum paper encontrado. Tenta outra busca."
        stats={[
          { num: String(ARTIGOS.length), label: "Papers" },
          { num: String(Object.keys(CATEGORY_COLORS).length), label: "Temas" },
          { num: "100%", label: "Peer-reviewed" },
          { num: "Grátis", label: "Pra sempre" },
        ]}
      />

      {/* BOTTOM MARQUEE */}
      <div style={{ marginTop: 24 }}>
        <MarqueeBar items={MARQUEE_BOTTOM} bottom />
      </div>

      {/* FOOTER */}
      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <nav className="footer-links">
          <Link to="/portal">Portal</Link>
          <Link to="/imprensa">Imprensa</Link>
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">🐉 O Dragão leu. O Dragão aprovou. Agora é sua vez.</div>
      </footer>
    </div>
  );
};

export default Biblioteca;
