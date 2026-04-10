import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Biblioteca.css";

type Artigo = {
  id: number;
  titulo: string;
  categoria: Categoria;
  resumo: string;
  arquivo: string;
};

type Categoria =
  | "Digestibilidade & Nutrição"
  | "Saúde & Microbiota"
  | "Alergia & Dermatite"
  | "Reviews Gerais"
  | "Aceitação de Consumidor"
  | "Saúde Sênior";

const CATEGORIAS: Categoria[] = [
  "Digestibilidade & Nutrição",
  "Saúde & Microbiota",
  "Alergia & Dermatite",
  "Reviews Gerais",
  "Aceitação de Consumidor",
  "Saúde Sênior",
];

const PDF_BASE = "/assets/pdfs/artigos/";

const ARTIGOS: Artigo[] = [
  {
    id: 1,
    titulo:
      "Efeitos da Larva da Mosca Soldado Negro como Fonte de Proteína ou Gordura sobre Digestibilidade de Nutrientes, Microbiota Fecal e Perfil Metabólico em Cães Beagle",
    categoria: "Digestibilidade & Nutrição",
    resumo:
      "Substituir 20% da farinha de frango por proteína de BSF ou 8% do óleo por gordura de BSF manteve parâmetros de saúde, peso e capacidade antioxidante dentro do normal em cães. A gordura de BSF preservou os níveis de ácidos graxos de cadeia curta no intestino. A proteína de BSF alterou positivamente a microbiota, enriquecendo gêneros associados a vitaminas do complexo B e metabólitos benéficos. O estudo confirma BSF como fonte segura e viável em alimentos para cães.",
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
      "O estudo comparou larvas de BSF, mosca doméstica e tenébrio quanto à digestibilidade in vitro e fermentação pela microbiota canina. A BSF apresentou digestibilidade de nitrogênio de 87,7% e perfil de aminoácidos de alta qualidade, ainda que ligeiramente inferior às outras duas espécies. Os resíduos não digeridos foram fermentados pela microbiota, gerando acetato, propionato e butirato. Conclusão: insetos, incluindo BSF, oferecem proteína de boa qualidade e apoiam fermentação intestinal benéfica em cães.",
    arquivo: "bsf-in-vivo-vitro-digestibility-dog-food.pdf",
  },
  {
    id: 4,
    titulo:
      "Avaliação de Dieta Extrusada para Cães Adultos Contendo Farinha de Larva da Mosca Soldado Negro",
    categoria: "Digestibilidade & Nutrição",
    resumo:
      "Doze Beagles foram alimentados em cross-over com dieta extrusada contendo 200 g/kg de farinha de BSF versus dieta controle com farinha de cordeiro. A dieta com BSF reduziu o volume fecal e apresentou maior digestibilidade da matéria seca. Parâmetros imunológicos, hematológicos e de proliferação linfocitária não foram afetados, indicando boa tolerância. Conclusão: a farinha de BSF pode ser considerada fonte proteica alternativa segura e eficaz para cães adultos.",
    arquivo: "bsf-extruded-diet-adult-dogs.pdf",
  },
  {
    id: 5,
    titulo:
      "Avaliação da Suplementação de Farinha Desengordurada de Larva da Mosca Soldado Negro em Cães Beagle",
    categoria: "Digestibilidade & Nutrição",
    resumo:
      "Cães Beagle receberam dietas com 0%, 1% ou 2% de farinha desengordurada de BSF por 42 dias, com desafio imunológico ao final. A suplementação aumentou linearmente a digestibilidade da matéria seca e proteína bruta. Também reduziu marcadores inflamatórios (TNF-α) e elevou enzimas antioxidantes (GPx, SOD) após o desafio. Conclusão: a farinha de BSF traz benefícios anti-inflamatórios, antioxidantes e digestivos a cães.",
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
      "Trinta gatos foram testados com dietas substituindo 3% ou 6% da farinha de frango por BSF criada em substrato animal ou vegetal. A substituição aumentou significativamente a digestibilidade da proteína bruta, gordura e aminoácidos essenciais. A microbiota fecal foi modulada positivamente, com aumento de Bacteroidota no grupo com substrato vegetal. Conclusão: é seguro e benéfico substituir até 6% da proteína de gatos por larvas de BSF.",
    arquivo: "bsf-substrates-cat-diets-fecal-microbiota.pdf",
  },
  {
    id: 8,
    titulo:
      "Derivados Proteicos da Larva da Mosca Soldado Negro: Potencial para Promover a Saúde Animal",
    categoria: "Saúde & Microbiota",
    resumo:
      "Avaliou o potencial antioxidante in vitro de proteínas e hidrolisados de BSF em cinco modelos, comparando com farinhas de frango e peixe. Os derivados de BSF demonstraram forte capacidade de proteger células contra danos oxidativos provocados pela resposta imune. Farinhas de frango e peixe, ao contrário, tiveram efeito neutro ou até pró-oxidante. Conclusão: BSF pode atuar como ingrediente funcional, promovendo saúde em formulações de pet food e aquicultura.",
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
      "Larva da Mosca Soldado Negro como Substituto Proteico em Reações Alimentares Adversas para Dermatite Canina: Resultados Preliminares em Pacientes",
    categoria: "Alergia & Dermatite",
    resumo:
      "Dezesseis cães (8 saudáveis e 8 com reações alimentares adversas) receberam dieta à base de BSF por 4 semanas. Não houve efeitos gastrointestinais adversos, e os pesos e consistência fecal permaneceram estáveis. A dieta com BSF não agravou o prurido e não alterou parâmetros sanguíneos. Conclusão: BSF é proteína alternativa sustentável e bem tolerada, promissora para dietas hipoalergênicas em cães com alergia alimentar.",
    arquivo: "bsf-protein-substitute-canine-dermatitis.pdf",
  },
  {
    id: 11,
    titulo:
      "Larva da Mosca Soldado Negro como Fonte Alternativa de Proteína para Dietas de Cães e Gatos",
    categoria: "Reviews Gerais",
    resumo:
      "Tese de doutorado que avaliou composição, digestibilidade de aminoácidos e efeitos da BSF em gatos adultos. Os resultados mostraram alto valor biológico da proteína, DIAAS compatível com fontes tradicionais e boa palatabilidade das dietas formuladas com BSF. As dietas com farinha, larva inteira ou óleo de BSF mantiveram saúde, pele e pelagem dos gatos. Conclusão: BSF é ingrediente seguro, nutritivo e viável para substituir proteínas tradicionais em dietas de cães e gatos.",
    arquivo: "bsf-alternative-protein-canine-feline-diets.pdf",
  },
  {
    id: 12,
    titulo:
      "Valor Nutricional da Mosca Soldado Negro (Hermetia illucens L.) e sua Adequação como Alimento Animal — Revisão",
    categoria: "Reviews Gerais",
    resumo:
      "Revisão dos níveis nutricionais da BSF, mostrando 37-63% de proteína e 7-39% de gordura na matéria seca. A BSF apresenta aminoácidos essenciais, minerais e ácidos graxos relevantes, mas processamento e alto teor de gordura podem limitar substituição total. A biologia do inseto permite criação sustentável em resíduos orgânicos. Conclusão: BSF é fonte proteica promissora, mas requer mais pesquisa sobre processamento e digestibilidade por espécie.",
    arquivo: "bsf-nutritional-value-animal-feed-review.pdf",
  },
  {
    id: 13,
    titulo:
      "Revisão da Mosca Soldado Negro (Hermetia illucens) como Alimento Animal e Humano",
    categoria: "Reviews Gerais",
    resumo:
      "Revisão abrangente sobre a capacidade da BSF de converter resíduos orgânicos em biomassa com 42% de proteína e 29% de gordura. A espécie não concentra pesticidas nem micotoxinas e já é recomendada como ração animal em várias regiões, com restrições legais. Para consumo humano, a larva pode ser moída em proteína texturizada. Conclusão: a maior vantagem da BSF é fechar ciclos de nutrientes convertendo resíduos em alimento, embora enfrente tabus sociais e legais.",
    arquivo: "bsf-animal-feed-human-food-review.pdf",
  },
  {
    id: 14,
    titulo:
      "Desvendando o Real Potencial dos Derivados Proteicos da Mosca Soldado Negro em Dietas Pet",
    categoria: "Reviews Gerais",
    resumo:
      "Estudo avaliou o potencial antiartrítico de derivados proteicos de BSF em ensaios de inibição de proteinase, estabilidade de membrana e produção de ROS. Os derivados de BSF demonstraram forte capacidade de prevenir e potencialmente combater artrite, auxiliados pela presença natural de glucosamina. A farinha de frango, por outro lado, mostrou contribuir para produção de ROS por monócitos. Conclusão: BSF tem ingredientes funcionais valiosos para proteção articular em dietas pet.",
    arquivo: "insects-protein-quality-dog-cat-foods.pdf",
  },
  {
    id: 15,
    titulo:
      "Aceitação da Larva da Mosca Soldado Negro como Alimento pelos Americanos",
    categoria: "Aceitação de Consumidor",
    resumo:
      "Dois estudos avaliaram a disposição de adultos americanos em consumir BSF diretamente, em animais alimentados com ela, ou em dar para seus cães. Os participantes aceitaram muito mais alimentos com farinha de inseto do que com insetos inteiros, padrão que também se repetiu em pet food. Rotas indiretas (como ração para pets ou animais alimentados com insetos) foram mais aceitas do que consumo direto. Conclusão: BSF é alternativa viável e bem aceita para pet food frente a proteínas animais tradicionais.",
    arquivo: "americans-acceptance-bsf-as-food.pdf",
  },
  {
    id: 16,
    titulo:
      "Percepção dos Consumidores sobre Produtos de Panificação com Gordura de Inseto como Substituto Parcial da Manteiga",
    categoria: "Aceitação de Consumidor",
    resumo:
      "344 consumidores avaliaram bolos, biscoitos e waffles com 0%, 25% ou 50% de gordura de BSF substituindo manteiga. A substituição de 25% foi bem aceita sem alterar a experiência sensorial; em waffles, até 50% foi aceito. Textura e cor pouco mudaram, indicando funcionalidade similar à da manteiga. Conclusão: a gordura de BSF é ingrediente viável em panificação, e pesquisas futuras devem refinar o ingrediente para reduzir off-flavors em maiores concentrações.",
    arquivo: "consumers-perception-bakery-insect-fat.pdf",
  },
  {
    id: 17,
    titulo:
      "Declaração do Conselho Científico da FEDIAF — Nutrição de Cães Sênior",
    categoria: "Saúde Sênior",
    resumo:
      "Declaração oficial do comitê científico da FEDIAF sobre necessidades nutricionais específicas de cães idosos. Reconhece que envelhecimento varia por raça e tamanho, com cães grandes envelhecendo mais cedo (5-8 anos) que pequenos (10+). Destaca declínio cognitivo, doenças articulares e alterações metabólicas como fatores que exigem dietas adaptadas em energia, proteína e nutrientes funcionais. Conclusão: cães sênior precisam de dietas específicas e acompanhamento veterinário regular para manter qualidade de vida.",
    arquivo: "fediaf-sab-statement-nutrition-of-senior-dogs.pdf",
  },
];

export default function Biblioteca() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | "Todas">(
    "Todas"
  );

  const artigosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return ARTIGOS.filter((a) => {
      const matchCategoria =
        categoriaAtiva === "Todas" || a.categoria === categoriaAtiva;
      const matchBusca =
        termo.length === 0 ||
        a.titulo.toLowerCase().includes(termo) ||
        a.resumo.toLowerCase().includes(termo);
      return matchCategoria && matchBusca;
    });
  }, [busca, categoriaAtiva]);

  return (
    <div className="biblioteca-page">
      <header className="biblioteca-header">
        <Link to="/" className="biblioteca-voltar">
          ← voltar ao portal
        </Link>
        <h1 className="biblioteca-titulo">Biblioteca Científica</h1>
        <p className="biblioteca-subtitulo">
          17 artigos científicos sobre a larva da mosca soldado negro
          (Hermetia illucens) na alimentação de cães e gatos. Tudo que embasa o
          que a gente faz.
        </p>
      </header>

      <div className="biblioteca-controles">
        <input
          type="text"
          className="biblioteca-busca"
          placeholder="Buscar por palavra-chave..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="biblioteca-filtros">
          <button
            className={`biblioteca-filtro ${
              categoriaAtiva === "Todas" ? "ativo" : ""
            }`}
            onClick={() => setCategoriaAtiva("Todas")}
          >
            Todas ({ARTIGOS.length})
          </button>
          {CATEGORIAS.map((cat) => {
            const count = ARTIGOS.filter((a) => a.categoria === cat).length;
            return (
              <button
                key={cat}
                className={`biblioteca-filtro ${
                  categoriaAtiva === cat ? "ativo" : ""
                }`}
                onClick={() => setCategoriaAtiva(cat)}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="biblioteca-resultado-info">
        {artigosFiltrados.length} artigo
        {artigosFiltrados.length !== 1 ? "s" : ""} encontrado
        {artigosFiltrados.length !== 1 ? "s" : ""}
      </div>

      <div className="biblioteca-grid">
        {artigosFiltrados.map((artigo) => (
          <article key={artigo.id} className="biblioteca-card">
            <span className="biblioteca-card-categoria">
              {artigo.categoria}
            </span>
            <h2 className="biblioteca-card-titulo">{artigo.titulo}</h2>
            <p className="biblioteca-card-resumo">{artigo.resumo}</p>
            <a
              href={`${PDF_BASE}${artigo.arquivo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="biblioteca-card-link"
            >
              Ler PDF →
            </a>
          </article>
        ))}
      </div>

      {artigosFiltrados.length === 0 && (
        <div className="biblioteca-vazio">
          Nenhum artigo encontrado. Tente outra busca.
        </div>
      )}
    </div>
  );
}
