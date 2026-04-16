import { useMemo, useState } from "react";
import DragonLogo from "@/components/DragonLogo";
import { Link } from "react-router-dom";
import "./Portal.css";
import "./Biblioteca.css";
import "./Imprensa.css";

type Categoria =
  | "Comida de Dragão"
  | "Na Mídia"
  | "Vídeos & Pitches"
  | "Ecossistema BSF";

type Tipo = "Matéria" | "Vídeo" | "Artigo" | "Produto";

type LinkItem = {
  id: number;
  titulo: string;
  categoria: Categoria;
  tipo: Tipo;
  veiculo: string;
  resumo: string;
  url: string;
};

const CATEGORIAS: Categoria[] = [
  "Comida de Dragão",
  "Na Mídia",
  "Vídeos & Pitches",
  "Ecossistema BSF",
];

const COR_CATEGORIA: Record<Categoria, string> = {
  "Comida de Dragão": "var(--dragon-orange)",
  "Na Mídia": "var(--dragon-lime)",
  "Vídeos & Pitches": "var(--dragon-pink)",
  "Ecossistema BSF": "var(--dragon-yellow)",
};

const MARQUEE_TOP = [
  "IMPRENSA & COBERTURA",
  "O QUE FALAM SOBRE O DRAGÃO",
  "MÍDIA · VÍDEOS · ECOSSISTEMA",
  "BSF BRASIL",
  "LETS FLY NA MÍDIA",
  "COMIDA DE DRAGÃO COBERTA",
  "A REVOLUÇÃO DO INSETO",
];

const MARQUEE_BOTTOM = [
  "// COMIDA DE DRAGÃO",
  "// NA MÍDIA",
  "// VÍDEOS & PITCHES",
  "// ECOSSISTEMA BSF",
  "🐉 O DRAGÃO É NOTÍCIA",
  "IMPRENSA BRASILEIRA · INTERNACIONAL",
];

const LINKS: LinkItem[] = [
  // ============ NA MÍDIA ============
  {
    id: 7,
    titulo: "Empresa brasileira investe em proteína à base de inseto para pets",
    categoria: "Na Mídia",
    tipo: "Matéria",
    veiculo: "IstoÉ Pets",
    resumo:
      "Reportagem sobre a Lets Fly e a marca Comida de Dragão, com fala do fundador sobre uso de resíduos orgânicos como substrato e visão de soluções sustentáveis para pets e, futuramente, humanos.",
    url: "https://pet.istoe.com.br/empresa-brasileira-investe-em-proteina-a-base-de-inseto-para-pets",
  },
  {
    id: 8,
    titulo: "Startup Lets Fly apoiada pelo Finep Inovacred",
    categoria: "Na Mídia",
    tipo: "Matéria",
    veiculo: "Finep",
    resumo:
      "Matéria institucional detalhando o modelo de negócio da Lets Fly, o uso de BSF como matéria-prima, o perfil dos fundadores e o apoio via linha Inovacred do Finep.",
    url: "http://www.finep.gov.br/noticias/todas-noticias/6582-startup-lets-fly-apoiada-pelo-finep-inovacred-vai-produzir-alimento-sustentavel-para-pets-e-peixes-a-partir-de-larvas-de-inseto",
  },
  {
    id: 9,
    titulo: "O negócio que transforma moscas em comida de pet e atraiu 37 investidores",
    categoria: "Na Mídia",
    tipo: "Matéria",
    veiculo: "Exame",
    resumo:
      "Reportagem da Exame sobre a jornada empreendedora da Lets Fly, o modelo de negócio circular e a captação com 37 investidores.",
    url: "https://exame.com/negocios/o-negocio-dele-transforma-moscas-em-comida-de-pet-e-atraiu-37-investidores/",
  },
  {
    id: 10,
    titulo: "Biofábrica Lets Fly — Projeto arquitetônico",
    categoria: "Na Mídia",
    tipo: "Matéria",
    veiculo: "ArchDaily Brasil",
    resumo:
      "Apresentação do projeto arquitetônico da biofábrica Lets Fly assinado pelo escritório Grua, com fotos, plantas e conceito de integração da produção de BSF à paisagem.",
    url: "https://www.archdaily.com.br/br/1027734/biofabrica-lets-fly-grua",
  },
  {
    id: 11,
    titulo: "The little bug turning organic waste into sustainable fertiliser",
    categoria: "Na Mídia",
    tipo: "Matéria",
    veiculo: "BBC Future",
    resumo:
      "Reportagem da BBC Future sobre o potencial da mosca soldado negra em transformar resíduos orgânicos em fertilizante e proteína sustentável, com alcance internacional.",
    url: "https://www.bbc.com/future/article/20250130-the-little-bug-with-a-big-appetite-turning-organic-waste-into-sustainable-fertiliser",
  },
  {
    id: 12,
    titulo: "O pequeno inseto que transforma resíduos em fertilizante sustentável",
    categoria: "Na Mídia",
    tipo: "Matéria",
    veiculo: "G1 Globo",
    resumo:
      "Versão em português da matéria da BBC publicada no G1, ampliando o alcance nacional da pauta sobre BSF e economia circular.",
    url: "https://g1.globo.com/meio-ambiente/noticia/2025/02/13/o-pequeno-inseto-com-grande-apetite-que-transforma-residuos-organicos-em-fertilizante-sustentavel.ghtml",
  },
  {
    id: 13,
    titulo: "Linha de alimentos funcionais para pets utiliza proteínas de BSF desidratadas",
    categoria: "Na Mídia",
    tipo: "Matéria",
    veiculo: "Revista Clínica Veterinária",
    resumo:
      "Matéria especializada apresentando a Lets Fly e o lançamento da Comida de Dragão na Pet South America, explicando o modelo circular, métricas de eficiência e economia de água.",
    url: "https://www.revistaclinicaveterinaria.com.br/noticias/mercado/pet-vet/linha-de-alimentos-funcionais-para-pets-utiliza-proteinas-de-bsf-desidratadas",
  },

  // ============ COMIDA DE DRAGÃO ============
  {
    id: 3,
    titulo: "Comida de Dragão Original — Proteína BSF",
    categoria: "Comida de Dragão",
    tipo: "Produto",
    veiculo: "Aufaro",
    resumo:
      "Ficha completa no varejista Aufaro com composição 100% larvas de BSF, benefícios nutricionais, métricas ambientais (redução de emissões, água e uso de terra).",
    url: "https://www.aufaro.com.br/produtos/comida-de-dragao-original-proteina-bsf/",
  },
  {
    id: 4,
    titulo: "Petisco Natural Comida de Dragão Original",
    categoria: "Comida de Dragão",
    tipo: "Produto",
    veiculo: "Petlove",
    resumo:
      "Página do produto na maior rede pet do Brasil, destacando a composição 100% natural de larvas BSF desidratadas.",
    url: "https://www.petlove.com.br/petisco-natural-comida-de-dragao-original/p",
  },
  {
    id: 5,
    titulo: "Comida de Dragão",
    categoria: "Comida de Dragão",
    tipo: "Produto",
    veiculo: "A Loja do Ollie",
    resumo:
      "Página da marca no varejista especializado A Loja do Ollie, com foco em petisco natural de larvas BSF desidratadas.",
    url: "https://www.alojadoollie.com.br/marcas/comidadedragao/",
  },

  // ============ VÍDEOS & PITCHES ============
  {
    id: 15,
    titulo: "Lets Fly | Alimento que regenera",
    categoria: "Vídeos & Pitches",
    tipo: "Vídeo",
    veiculo: "YouTube",
    resumo:
      "Vídeo institucional da Lets Fly apresentando o conceito de alimento que regenera: como a BSF transforma resíduos orgânicos em proteína sustentável para pets.",
    url: "https://www.youtube.com/watch?v=4E4JumQS8GE&t=1s",
  },
  {
    id: 16,
    titulo: "Web Summit Pitch Lets Fly 2024",
    categoria: "Vídeos & Pitches",
    tipo: "Vídeo",
    veiculo: "YouTube",
    resumo:
      "Apresentação oficial da Lets Fly no Web Summit 2024, um dos maiores palcos de tecnologia do mundo. Pitch sobre modelo de negócio, impacto e tração.",
    url: "https://www.youtube.com/watch?v=dzvkxZGgEJs&t=1s",
  },
  {
    id: 17,
    titulo: "Biofábrica Lets Fly transforma resíduos em proteína sustentável",
    categoria: "Vídeos & Pitches",
    tipo: "Vídeo",
    veiculo: "Dailymotion",
    resumo:
      "Vídeo institucional mostrando a biofábrica Lets Fly em operação, com bastidores do processo produtivo da BSF e da transformação de resíduos em proteína.",
    url: "https://www.dailymotion.com/video/x9kmjks",
  },
  {
    id: 18,
    titulo: "Who knew flies could be this useful?",
    categoria: "Vídeos & Pitches",
    tipo: "Vídeo",
    veiculo: "BBC Africa",
    resumo:
      "Reportagem em vídeo da BBC Africa sobre o potencial da BSF em resolver problemas de resíduos e alimentação, com alcance internacional e abordagem jornalística.",
    url: "https://www.youtube.com/watch?v=l0SQLI7ouaA",
  },
  {
    id: 19,
    titulo: "BSF — Black Soldier Fly — Falando apenas em ciência",
    categoria: "Vídeos & Pitches",
    tipo: "Vídeo",
    veiculo: "YouTube",
    resumo:
      "Conteúdo técnico sobre BSF com referências científicas. Abordagem didática sobre biologia, nutrição e potencial produtivo do inseto, com comentários sobre o cenário brasileiro.",
    url: "https://www.youtube.com/watch?v=IWR5DxjjTEk",
  },

  // ============ ECOSSISTEMA BSF BRASIL ============
  {
    id: 20,
    titulo: "Larvas desidratadas de BSF: nova tendência na aquicultura brasileira",
    categoria: "Ecossistema BSF",
    tipo: "Matéria",
    veiculo: "Seafood Brasil",
    resumo:
      "Reportagem sobre o uso de larvas desidratadas de BSF na ração de peixes. Cobre benefícios nutricionais, sustentabilidade e economia circular, destacando produtores já regulamentados no Brasil.",
    url: "https://www.seafoodbrasil.com.br/larvas-desidratadas-de-bsf-nova-tendencia-na-aquicultura-brasileira",
  },
  {
    id: 21,
    titulo: "Produção de BSF no Brasil, realidade ou utopia?",
    categoria: "Ecossistema BSF",
    tipo: "Artigo",
    veiculo: "LinkedIn",
    resumo:
      "Artigo analítico sobre o estágio atual da produção de BSF no Brasil, desafios de escala, regulação e perspectivas de mercado. Útil para entender o debate técnico-profissional em curso.",
    url: "https://pt.linkedin.com/pulse/produ%C3%A7%C3%A3o-de-bsf-brasil-realidade-ou-cwqif",
  },
  {
    id: 22,
    titulo: "A 'mosca' que captou R$ 6 milhões — Buzz Fly",
    categoria: "Ecossistema BSF",
    tipo: "Matéria",
    veiculo: "AgFeed",
    resumo:
      "Reportagem sobre a Buzz Fly, outra startup brasileira de BSF. Mostra o ciclo de vida da mosca, as vantagens do clima brasileiro para produção e o modelo de negócio circular do setor.",
    url: "https://agfeed.com.br/agtech/a-mosca-que-captou-r-6-milhoes-com-olavo-setubal-jr-marcos-molina-andre-lara-resende-e-agroven/",
  },
  {
    id: 23,
    titulo: "BSF: inovação e sustentabilidade no mercado pet",
    categoria: "Ecossistema BSF",
    tipo: "Artigo",
    veiculo: "MBA USP / FMVZ",
    resumo:
      "Post do blog do MBA da USP (Faculdade de Medicina Veterinária) explicando como a mosca soldado negra está revolucionando o mercado pet como alternativa proteica sustentável.",
    url: "https://mbauspfmvz.com/blog/bsf-inovacao-sustentavel-mercado-pet-nury-garcia",
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

const Imprensa = () => {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | "Todas">("Todas");
  const [skin, setSkin] = useState(1);

  const linksFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return LINKS.filter((l) => {
      const matchCategoria = categoriaAtiva === "Todas" || l.categoria === categoriaAtiva;
      const matchBusca =
        termo.length === 0 ||
        l.titulo.toLowerCase().includes(termo) ||
        l.resumo.toLowerCase().includes(termo) ||
        l.veiculo.toLowerCase().includes(termo);
      return matchCategoria && matchBusca;
    });
  }, [busca, categoriaAtiva]);

  return (
    <div className={`portal-page biblio-page impr-page skin-${skin}`}>
      {/* TOP MARQUEE */}
      <MarqueeBar items={MARQUEE_TOP} />

      {/* HERO */}
      <section className="hero biblio-hero">
        <div className="hero-bg" />
        <div className="dragon-silhouette">🐉</div>
        <div className="hero-content">
          <div className="hero-eyebrow">Comida de Dragão — Imprensa & Cobertura</div>
          <h1 className="biblio-title">
            O QUE<br />
            FALAM SOBRE<br />
            <span className="biblio-title-accent">O DRAGÃO.</span>
          </h1>
          <p className="biblio-hero-sub">
            {LINKS.length} links curados — matérias, vídeos, produtos e referências
            do ecossistema BSF. Tudo sobre a Comida de Dragão, a Lets Fly e o inseto que
            está mudando o jogo.
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
      <div className="biblio-controles">
        <input
          type="text"
          className="biblio-busca"
          placeholder="Busque por título, veículo ou palavra-chave..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="biblio-filtros impr-filtros">
          <button
            className={`biblio-filtro ${categoriaAtiva === "Todas" ? "ativo" : ""}`}
            onClick={() => setCategoriaAtiva("Todas")}
          >
            Todas · {LINKS.length}
          </button>
          {CATEGORIAS.map((cat) => {
            const count = LINKS.filter((l) => l.categoria === cat).length;
            const ativo = categoriaAtiva === cat;
            return (
              <button
                key={cat}
                className={`biblio-filtro ${ativo ? "ativo" : ""}`}
                style={ativo
                  ? { background: "rgba(255, 255, 255, 0.08)", borderColor: COR_CATEGORIA[cat], color: "#fff", boxShadow: `inset 0 0 0 1px ${COR_CATEGORIA[cat]}` }
                  : { borderColor: COR_CATEGORIA[cat], color: COR_CATEGORIA[cat] }}
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
        {linksFiltrados.length} link{linksFiltrados.length !== 1 ? "s" : ""}
      </div>
      <div className="biblio-grid impr-grid">
        {linksFiltrados.map((link) => {
          const cor = COR_CATEGORIA[link.categoria];
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="biblio-card impr-card"
              style={{ borderTopColor: cor }}
            >
              <div className="impr-card-header">
                <span className="impr-tipo-badge">
                  {link.tipo}
                </span>
                <span className="biblio-card-cat" style={{ color: cor }}>
                  // {link.categoria}
                </span>
              </div>
              <h2 className="biblio-card-titulo">{link.titulo}</h2>
              <div className="impr-veiculo">{link.veiculo}</div>
              <p className="biblio-card-resumo">{link.resumo}</p>
              <span className="biblio-card-cta" style={{ color: cor }}>
                ABRIR LINK →
              </span>
            </a>
          );
        })}
      </div>

      {linksFiltrados.length === 0 && (
        <div className="biblio-vazio">
          Nenhum link encontrado. Tente outra busca.
        </div>
      )}

      {/* BOTTOM MARQUEE */}
      <div style={{ marginTop: 48 }}>
        <MarqueeBar items={MARQUEE_BOTTOM} bottom />
      </div>

      {/* FOOTER */}
      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <nav className="footer-links">
          <Link to="/portal">Portal</Link>
          <Link to="/biblioteca">Biblioteca</Link>
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">🐉 O Dragão é notícia. O Dragão é ciência. O Dragão é agora.</div>
      </footer>
    </div>
  );
};

export default Imprensa;
