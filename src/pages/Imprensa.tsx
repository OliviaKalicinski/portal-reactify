import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import StripeList, { StripeItem } from "@/components/StripeList";
import PageMeta from "@/components/PageMeta";
import "./Portal.css";
import "./Parceiros.css";
import "./Imprensa.css";

// Cores dos dots dos destaques
const CATEGORY_COLORS: Record<string, string> = {
  "Comida de Dragão": "var(--dragon-orange)",
  "Na Mídia": "var(--dragon-lime)",
  "Vídeos & Pitches": "var(--dragon-pink)",
  "Ecossistema BSF": "var(--dragon-yellow)",
};

// Cores das faixas da lista principal (hex — contraste com texto preto)
const STRIPE_COLORS: Record<string, string> = {
  "Comida de Dragão": "#FF6600",
  "Na Mídia": "#3FFF33",
  "Vídeos & Pitches": "#FF0066",
  "Ecossistema BSF": "#FFCC00",
};

// Cores das faixas dos DESTAQUES (por label do destaque)
const DESTAQUE_STRIPE_COLORS: Record<string, string> = {
  "TV aberta nacional": "#FF0066",
  "Alcance nacional": "#3FFF33",
  "Negócios": "#FF6600",
  "Design & Arquitetura": "#FFCC00",
};

// Extrai veículo de "Veículo · Tipo" → usado como shortTitle da faixa
const getVeiculo = (meta?: string) => {
  if (!meta) return "";
  const parts = meta.split(" · ");
  return parts[0].trim();
};

const MARQUEE_TOP = [
  "IMPRENSA & COBERTURA",
  "O QUE FALAM SOBRE O DRAGÃO",
  "NA MÍDIA · VÍDEOS · ECOSSISTEMA BSF",
  "BBC · G1 · EXAME · ARCHDAILY",
  "A REVOLUÇÃO DO INSETO",
];

const MARQUEE_BOTTOM = [
  "// COMIDA DE DRAGÃO",
  "// NA MÍDIA",
  "// VÍDEOS & PITCHES",
  "// ECOSSISTEMA BSF",
  "🐉 O DRAGÃO É NOTÍCIA",
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

// ========== DADOS ==========

interface Destaque {
  id: number;
  veiculo: string;
  label: string;
  titulo: string;
  resumo: string;
  url: string;
  cor: string;
}

const DESTAQUES: Destaque[] = [
  {
    id: 24,
    veiculo: "Globo",
    label: "TV aberta nacional",
    titulo: "Comida de Dragão na Globo",
    resumo:
      "Matéria da Globo sobre a marca brasileira de proteína BSF para pets — do estúdio pro país inteiro.",
    url: "https://globoplay.globo.com/v/14061746/",
    cor: "var(--dragon-pink)",
  },
  {
    id: 12,
    veiculo: "G1 Globo",
    label: "Alcance nacional",
    titulo: "O pequeno inseto que transforma resíduos em fertilizante sustentável",
    resumo:
      "A maior mídia brasileira publicou a versão em português da BBC — a pauta ganhou tração no país inteiro.",
    url: "https://g1.globo.com/meio-ambiente/noticia/2025/02/13/o-pequeno-inseto-com-grande-apetite-que-transforma-residuos-organicos-em-fertilizante-sustentavel.ghtml",
    cor: "var(--dragon-lime)",
  },
  {
    id: 9,
    veiculo: "Exame",
    label: "Negócios",
    titulo: "O negócio que transforma moscas em comida de pet e atraiu 37 investidores",
    resumo:
      "A Exame reconheceu o modelo de negócio — 37 investidores acompanhando a jornada da Lets Fly.",
    url: "https://exame.com/negocios/o-negocio-dele-transforma-moscas-em-comida-de-pet-e-atraiu-37-investidores/",
    cor: "var(--dragon-orange)",
  },
  {
    id: 10,
    veiculo: "ArchDaily Brasil",
    label: "Design & Arquitetura",
    titulo: "Biofábrica Lets Fly — Projeto arquitetônico",
    resumo:
      "O projeto arquitetônico da biofábrica virou pauta em uma das maiores revistas de design do mundo.",
    url: "https://www.archdaily.com.br/br/1027734/biofabrica-lets-fly-grua",
    cor: "var(--dragon-violet)",
  },
];

// ========== LINKS (arquivo completo) ==========
const LINKS: StripeItem[] = [
  // NA MÍDIA — em destaque no topo da lista (Globo)
  {
    id: 24,
    title: "Comida de Dragão na Globo",
    category: "Na Mídia",
    meta: "Globo · Vídeo",
    summary:
      "Matéria da Globo sobre a Comida de Dragão e a revolução da proteína de inseto BSF pra pets no Brasil. Cobertura na TV aberta nacional.",
    href: "https://globoplay.globo.com/v/14061746/",
  },
  {
    id: 7,
    title: "Empresa brasileira investe em proteína à base de inseto para pets",
    category: "Na Mídia",
    meta: "IstoÉ Pets · Matéria",
    summary:
      "Reportagem sobre a Lets Fly e a marca Comida de Dragão, com fala do fundador sobre uso de resíduos orgânicos como substrato e visão de soluções sustentáveis para pets e, futuramente, humanos.",
    href:
      "https://pet.istoe.com.br/empresa-brasileira-investe-em-proteina-a-base-de-inseto-para-pets",
  },
  {
    id: 8,
    title: "Startup Lets Fly apoiada pelo Finep Inovacred",
    category: "Na Mídia",
    meta: "Finep · Matéria",
    summary:
      "Matéria institucional detalhando o modelo de negócio da Lets Fly, o uso de BSF como matéria-prima, o perfil dos fundadores e o apoio via linha Inovacred do Finep.",
    href:
      "http://www.finep.gov.br/noticias/todas-noticias/6582-startup-lets-fly-apoiada-pelo-finep-inovacred-vai-produzir-alimento-sustentavel-para-pets-e-peixes-a-partir-de-larvas-de-inseto",
  },
  {
    id: 9,
    title: "O negócio que transforma moscas em comida de pet e atraiu 37 investidores",
    category: "Na Mídia",
    meta: "Exame · Matéria",
    summary:
      "Reportagem da Exame sobre a jornada empreendedora da Lets Fly, o modelo de negócio circular e a captação com 37 investidores.",
    href:
      "https://exame.com/negocios/o-negocio-dele-transforma-moscas-em-comida-de-pet-e-atraiu-37-investidores/",
  },
  {
    id: 10,
    title: "Biofábrica Lets Fly — Projeto arquitetônico",
    category: "Na Mídia",
    meta: "ArchDaily Brasil · Matéria",
    summary:
      "Apresentação do projeto arquitetônico da biofábrica Lets Fly assinado pelo escritório Grua, com fotos, plantas e conceito de integração da produção de BSF à paisagem.",
    href: "https://www.archdaily.com.br/br/1027734/biofabrica-lets-fly-grua",
  },
  {
    id: 11,
    title: "The little bug turning organic waste into sustainable fertiliser",
    category: "Na Mídia",
    meta: "BBC Future · Matéria",
    summary:
      "Reportagem da BBC Future sobre o potencial da mosca soldado negra em transformar resíduos orgânicos em fertilizante e proteína sustentável, com alcance internacional.",
    href:
      "https://www.bbc.com/future/article/20250130-the-little-bug-with-a-big-appetite-turning-organic-waste-into-sustainable-fertiliser",
  },
  {
    id: 12,
    title: "O pequeno inseto que transforma resíduos em fertilizante sustentável",
    category: "Na Mídia",
    meta: "G1 Globo · Matéria",
    summary:
      "Versão em português da matéria da BBC publicada no G1, ampliando o alcance nacional da pauta sobre BSF e economia circular.",
    href:
      "https://g1.globo.com/meio-ambiente/noticia/2025/02/13/o-pequeno-inseto-com-grande-apetite-que-transforma-residuos-organicos-em-fertilizante-sustentavel.ghtml",
  },
  {
    id: 13,
    title: "Linha de alimentos funcionais para pets utiliza proteínas de BSF desidratadas",
    category: "Na Mídia",
    meta: "Revista Clínica Veterinária · Matéria",
    summary:
      "Matéria especializada apresentando a Lets Fly e o lançamento da Comida de Dragão na Pet South America, explicando o modelo circular, métricas de eficiência e economia de água.",
    href:
      "https://www.revistaclinicaveterinaria.com.br/noticias/mercado/pet-vet/linha-de-alimentos-funcionais-para-pets-utiliza-proteinas-de-bsf-desidratadas",
  },

  // COMIDA DE DRAGÃO (produtos)
  {
    id: 3,
    title: "Comida de Dragão Original — Proteína BSF",
    category: "Comida de Dragão",
    meta: "Aufaro · Produto",
    summary:
      "Ficha completa no varejista Aufaro com composição 100% larvas de BSF, benefícios nutricionais, métricas ambientais (redução de emissões, água e uso de terra).",
    href: "https://www.aufaro.com.br/produtos/comida-de-dragao-original-proteina-bsf/",
  },
  {
    id: 4,
    title: "Petisco Natural Comida de Dragão Original",
    category: "Comida de Dragão",
    meta: "Petlove · Produto",
    summary:
      "Página do produto na maior rede pet do Brasil, destacando a composição 100% natural de larvas BSF desidratadas.",
    href: "https://www.petlove.com.br/petisco-natural-comida-de-dragao-original/p",
  },
  {
    id: 5,
    title: "Comida de Dragão",
    category: "Comida de Dragão",
    meta: "A Loja do Ollie · Produto",
    summary:
      "Página da marca no varejista especializado A Loja do Ollie, com foco em petisco natural de larvas BSF desidratadas.",
    href: "https://www.alojadoollie.com.br/marcas/comidadedragao/",
  },

  // VÍDEOS & PITCHES
  {
    id: 15,
    title: "Lets Fly | Alimento que regenera",
    category: "Vídeos & Pitches",
    meta: "YouTube · Vídeo",
    summary:
      "Vídeo institucional da Lets Fly apresentando o conceito de alimento que regenera: como a BSF transforma resíduos orgânicos em proteína sustentável para pets.",
    href: "https://www.youtube.com/watch?v=4E4JumQS8GE&t=1s",
  },
  {
    id: 16,
    title: "Web Summit Pitch Lets Fly 2024",
    category: "Vídeos & Pitches",
    meta: "YouTube · Vídeo",
    summary:
      "Apresentação oficial da Lets Fly no Web Summit 2024, um dos maiores palcos de tecnologia do mundo. Pitch sobre modelo de negócio, impacto e tração.",
    href: "https://www.youtube.com/watch?v=dzvkxZGgEJs&t=1s",
  },
  {
    id: 17,
    title: "Biofábrica Lets Fly transforma resíduos em proteína sustentável",
    category: "Vídeos & Pitches",
    meta: "Dailymotion · Vídeo",
    summary:
      "Vídeo institucional mostrando a biofábrica Lets Fly em operação, com bastidores do processo produtivo da BSF e da transformação de resíduos em proteína.",
    href: "https://www.dailymotion.com/video/x9kmjks",
  },
  {
    id: 18,
    title: "Who knew flies could be this useful?",
    category: "Vídeos & Pitches",
    meta: "BBC Africa · Vídeo",
    summary:
      "Reportagem em vídeo da BBC Africa sobre o potencial da BSF em resolver problemas de resíduos e alimentação, com alcance internacional e abordagem jornalística.",
    href: "https://www.youtube.com/watch?v=l0SQLI7ouaA",
  },
  {
    id: 19,
    title: "BSF — Black Soldier Fly — Falando apenas em ciência",
    category: "Vídeos & Pitches",
    meta: "YouTube · Vídeo",
    summary:
      "Conteúdo técnico sobre BSF com referências científicas. Abordagem didática sobre biologia, nutrição e potencial produtivo do inseto, com comentários sobre o cenário brasileiro.",
    href: "https://www.youtube.com/watch?v=IWR5DxjjTEk",
  },

  // ECOSSISTEMA BSF
  {
    id: 20,
    title: "Larvas desidratadas de BSF: nova tendência na aquicultura brasileira",
    category: "Ecossistema BSF",
    meta: "Seafood Brasil · Matéria",
    summary:
      "Reportagem sobre o uso de larvas desidratadas de BSF na ração de peixes. Cobre benefícios nutricionais, sustentabilidade e economia circular, destacando produtores já regulamentados no Brasil.",
    href:
      "https://www.seafoodbrasil.com.br/larvas-desidratadas-de-bsf-nova-tendencia-na-aquicultura-brasileira",
  },
  {
    id: 21,
    title: "Produção de BSF no Brasil, realidade ou utopia?",
    category: "Ecossistema BSF",
    meta: "LinkedIn · Artigo",
    summary:
      "Artigo analítico sobre o estágio atual da produção de BSF no Brasil, desafios de escala, regulação e perspectivas de mercado. Útil para entender o debate técnico-profissional em curso.",
    href: "https://pt.linkedin.com/pulse/produ%C3%A7%C3%A3o-de-bsf-brasil-realidade-ou-cwqif",
  },
  {
    id: 22,
    title: "A 'mosca' que captou R$ 6 milhões — Buzz Fly",
    category: "Ecossistema BSF",
    meta: "AgFeed · Matéria",
    summary:
      "Reportagem sobre a Buzz Fly, outra startup brasileira de BSF. Mostra o ciclo de vida da mosca, as vantagens do clima brasileiro para produção e o modelo de negócio circular do setor.",
    href:
      "https://agfeed.com.br/agtech/a-mosca-que-captou-r-6-milhoes-com-olavo-setubal-jr-marcos-molina-andre-lara-resende-e-agroven/",
  },
  {
    id: 23,
    title: "BSF: inovação e sustentabilidade no mercado pet",
    category: "Ecossistema BSF",
    meta: "MBA USP / FMVZ · Artigo",
    summary:
      "Post do blog do MBA da USP (Faculdade de Medicina Veterinária) explicando como a mosca soldado negra está revolucionando o mercado pet como alternativa proteica sustentável.",
    href:
      "https://mbauspfmvz.com/blog/bsf-inovacao-sustentavel-mercado-pet-nury-garcia",
  },
];

const Imprensa = () => {
  return (
    <div className="portal-page parceiros-page skin-2">
      <PageMeta
        title="Imprensa & Cobertura · Comida de Dragão"
        description="20+ links curados — Globo, G1, BBC, Exame, ArchDaily. O que falam sobre a Comida de Dragão, a Lets Fly e o inseto que tá mudando o jogo."
      />
      <MarqueeBar items={MARQUEE_TOP} />

      {/* HERO — padrão */}
      <section className="archive-hero">
        <div className="archive-hero-bg" />
        <div className="dragon-silhouette">🐉</div>
        <div className="archive-hero-content">
          <Link to="/portal" className="archive-backlink">← voltar pro portal</Link>
          <div className="hero-eyebrow">Comida de Dragão — Imprensa & Cobertura</div>
          <DragonLogo className="hero-logo" />
          <h1 className="archive-hero-title">
            O que falam sobre o
            <span>Dragão</span>
          </h1>
          <p className="archive-hero-sub">
            {LINKS.length} links curados — matérias, vídeos, produtos e referências
            do ecossistema BSF. Do G1 à BBC, passando por ArchDaily e Exame.
          </p>
        </div>
      </section>

      {/* DESTAQUES — 4 veículos principais em faixas coloridas */}
      <section className="parceiros-secao">
        <div className="parceiros-tag tag-pink">destaques</div>
        <h2 className="parceiros-secao-titulo titulo-pink">
          Na mídia, <span>a pauta bateu</span>
        </h2>
      </section>

      <StripeList
        items={DESTAQUES.map((d) => ({
          id: `d${d.id}`,
          category: d.label,
          shortTitle: d.veiculo.toUpperCase(),
          title: d.titulo,
          summary: d.resumo,
          href: d.url,
        }))}
        stripeColors={DESTAQUE_STRIPE_COLORS}
        openLabel="Abrir matéria →"
      />

      <div className="parceiros-divider" />

      {/* ARQUIVO COMPLETO — faixas coloridas editorial */}
      <div className="impr-archive-header">
        <div className="parceiros-tag tag-violet">arquivo completo</div>
        <h2 className="parceiros-secao-titulo titulo-violet">
          Todos os <span>{LINKS.length} links</span>
        </h2>
      </div>

      <StripeList
        items={LINKS.map((l) => ({
          ...l,
          shortTitle: getVeiculo(l.meta),
        }))}
        stripeColors={STRIPE_COLORS}
        openLabel="Abrir link →"
        emptyMessage="Nenhum link encontrado."
      />

      {/* CTA FINAL — pra jornalistas */}
      <section className="parceiros-cta-final">
        <h2 className="parceiros-cta-final-titulo">
          Tá fazendo <span>matéria?</span>
        </h2>
        <p className="parceiros-cta-final-sub">
          A gente topa entrevista, visita guiada à biofábrica e pauta exclusiva.
          Tem material fotográfico, dados técnicos e contato direto com os fundadores.
        </p>
        <a
          href="mailto:somos@letsfly.com.br?subject=Imprensa%20%E2%80%94%20Pauta%20Comida%20de%20Drag%C3%A3o"
          className="parceiros-btn-primary"
        >
          somos@letsfly.com.br ↗
        </a>
        <p className="parceiros-cta-final-note">Respondemos em até 48h úteis</p>
      </section>

      <MarqueeBar items={MARQUEE_BOTTOM} bottom />

      {/* FOOTER */}
      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <nav className="footer-links">
          <Link to="/portal">Portal</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/parceiros">Parceiros</Link>
          <Link to="/biblioteca">Biblioteca</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@comidadedragao" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="https://comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Comprar</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">🐉 O Dragão é notícia. O Dragão é ciência. O Dragão é agora.</div>
      </footer>
    </div>
  );
};

export default Imprensa;
