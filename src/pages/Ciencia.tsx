import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import "./Ciencia.css";

/* ──────────────────────────────────────────────────────────────
   LP /ciencia — B-side magazine editorial (estilo Fyrre)
   Comida de Dragão · 10 motivos científicos

   Layout 2 colunas: sidebar TOC sticky + main artigo.
   Pull quote inline estilo Fyrre (aspas + texto + atribuição).
   Halftone sutil de fundo (toque tech). Sem cards pretos.
   Número de capítulo opcional — template reusável.
────────────────────────────────────────────────────────────── */

const PRODUTOS_URL = "https://www.comidadedragao.com.br/collections/produtos";

const UTM_FALLBACK = {
  utm_source: "lp-ciencia",
  utm_medium: "lp",
  utm_campaign: "10-motivos",
};

const ctaUrl = (cta: string) =>
  buildCheckoutUrl(PRODUTOS_URL, UTM_FALLBACK, cta);

type Motivo = {
  num: string;
  tocLabel: string;
  titulo: string;
  paragrafos: string[];
  quote: string;
  quoteFonte: string;
  evidencias: string[];
};

const MOTIVOS: Motivo[] = [
  {
    num: "01",
    tocLabel: "Alergia alimentar",
    titulo: "Alergia alimentar tem solução.",
    paragrafos: [
      "Coceira constante, lambida de pata, dermatite, problema digestivo. Já tentou várias rações e nenhuma resolveu? A maioria dos casos não é culpa do pet — é repetição. Frango, boi, soja, sempre. O sistema imune cansa, sensibiliza, reage.",
      "A larva de Mosca Soldado Negra é proteína nova pro organismo de praticamente qualquer pet — porque ele nunca comeu inseto antes. Sem histórico, sem sensibilização, sem reação cruzada. Hipoalergênica por natureza, não por marketing.",
    ],
    quote: "88,9% de digestibilidade — superior à carne bovina.",
    quoteFonte: "Estudo MAPA / Embrapa, 2024.",
    evidencias: [
      "Zero reações alérgicas em estudos com cães",
      "Recomendada por veterinários nutrólogos",
      "Melhora visível em 14 a 30 dias",
    ],
  },
  {
    num: "02",
    tocLabel: "Sustentabilidade",
    titulo: "A proteína mais sustentável do planeta.",
    paragrafos: [
      "Cada quilo de proteína de larva BSF economiza 15 mil litros de água em comparação com proteína bovina convencional. Transformamos resíduo orgânico em nutrição de alta qualidade — economia circular comprovada, não slogan.",
      "Produção 100% nacional, na biofábrica em Cachoeiras de Macacu/RJ. Menos transporte, menos emissão, menos terra. A escolha mais responsável que existe no mercado pet hoje.",
    ],
    quote: "83% menos carbono. 142× menos terra utilizada.",
    quoteFonte: "Comparativo FAO · BSF vs. bovino, 2023.",
    evidencias: [
      "100% produção nacional — menos transporte",
      "Resíduo orgânico vira proteína em escala",
      "Biofábrica em Cachoeiras de Macacu, RJ",
    ],
  },
  {
    num: "03",
    tocLabel: "Superalimento",
    titulo: "Superalimento, não suplemento qualquer.",
    paragrafos: [
      "Larva BSF concentra de 40% a 55% de proteína pura — quase o dobro de uma ração premium convencional. Todos os aminoácidos essenciais em proporção ideal. Ácido láurico com ação antimicrobiana natural. Ômegas 3, 6 e 9 pra pelagem brilhante e pele saudável.",
      "Energia concentrada, sem aditivo químico, sem corante, sem conservante. O perfil nutricional é o que faltava no mercado de petisco brasileiro.",
    ],
    quote: "40-55% de proteína pura — vs. 25-30% das rações comuns.",
    quoteFonte: "Tabela nutricional Comida de Dragão.",
    evidencias: [
      "Aminoácidos essenciais em proporção ideal",
      "Ácido láurico antimicrobiano natural",
      "Ômegas 3, 6 e 9 pra pele e pelo",
      "3.500+ kcal/kg de energia",
    ],
  },
  {
    num: "04",
    tocLabel: "Gato exigente",
    titulo: "Até gato exigente aprova.",
    paragrafos: [
      "Felinos são naturalmente seletivos — e a maioria dos petiscos não atende o paladar deles. A proteína da larva BSF tem sabor umami pronunciado, exatamente o que felinos buscam.",
      "Em testes de palatabilidade, 98% dos gatos aceitaram de primeira. Rico em taurina natural, fundamental pra saúde cardíaca do felino.",
    ],
    quote: "98% de aceitação felina nos testes de palatabilidade.",
    quoteFonte: "Painel sensorial Comida de Dragão · n=124 gatos.",
    evidencias: [
      "Rico em taurina natural — saúde cardíaca",
      "Ideal pra gato com sensibilidade alimentar",
      "Textura variada: larva crocante ou petisco macio",
    ],
  },
  {
    num: "05",
    tocLabel: "Aprovação MAPA",
    titulo: "Tecnologia brasileira aprovada pelo MAPA.",
    paragrafos: [
      "A Comida de Dragão é produzida na primeira biofábrica de insetos pra pet aprovada pelo Ministério da Agricultura no Brasil. Cada lote é rastreável. Cada embalagem tem análise garantida.",
      "Tecnologia desenvolvida em parceria com a Embrapa. Controle de qualidade farmacêutico. Indústria brasileira de verdade — não rótulo importado revendido.",
    ],
    quote: "Registro MAPA RJ 001924-0 — primeira biofábrica do estado.",
    quoteFonte: "Cadastro oficial · Ministério da Agricultura.",
    evidencias: [
      "Controle de qualidade farmacêutico",
      "Rastreabilidade completa da produção",
      "Parceria técnica com a Embrapa",
    ],
  },
  {
    num: "06",
    tocLabel: "Multi-espécies",
    titulo: "Único petisco multi-espécies do mercado.",
    paragrafos: [
      "Você tem pets de espécies diferentes e precisa comprar produto separado pra cada um? É caro, é trabalhoso, é desperdício.",
      "Um único produto serve pra cão, gato, ave, réptil, peixe, anfíbio e pequeno mamífero. A larva BSF é alimento natural na cadeia de mais de 50 espécies — superior aos grilos e tenébrios que dominam o mercado de exóticos.",
    ],
    quote: "Aprovado pra 50+ espécies diferentes.",
    quoteFonte: "Estudo multi-species · FAO, 2022.",
    evidencias: [
      "Substituto superior aos grilos e tenébrios",
      "Rico em cálcio pra quelônios",
      "Ideal pra ave ornamental e psitacídeos",
    ],
  },
  {
    num: "07",
    tocLabel: "Digestão leve",
    titulo: "Sem inchaço, sem gás, sem mau cheiro.",
    paragrafos: [
      "Gás constante, inchaço abdominal, fezes com odor forte ou volume excessivo — sinais clássicos de baixa digestibilidade. Acontece quando o que entra não é absorvido direito e vira lixo fermentando no intestino.",
      "Proteína leve, altamente digestível, com quitina prebiótica natural que alimenta a microbiota saudável. Menos resto, menos gás, menos cheiro.",
    ],
    quote: "Digestibilidade 30% superior à carne bovina.",
    quoteFonte: "Estudo digestibilidade aparente · UFRRJ, 2023.",
    evidencias: [
      "Quitina prebiótica natural pra microbiota",
      "Reduz odor das fezes em até 40%",
      "Menor volume fecal — menos desperdício",
    ],
  },
  {
    num: "08",
    tocLabel: "Suplemento proteico",
    titulo: "Funciona como suplemento proteico natural.",
    paragrafos: [
      "Seu pet tá em recuperação, é muito ativo, acima do peso ou precisa ganhar massa muscular? Suplementos comerciais são caros e nem sempre confiáveis.",
      "Larva BSF é proteína concentrada — funciona como suplemento nutricional sem precisar trocar a ração base. A linha Suplemento tem duas versões: Integral (45% proteína, uso diário) e Concentrado (55% proteína, máxima densidade).",
    ],
    quote: "Duas versões: Integral 45% e Concentrado 55%.",
    quoteFonte: "Linha Suplemento Comida de Dragão.",
    evidencias: [
      "Ideal pra ganho de massa muscular",
      "Pet atleta, de trabalho, sênior ou pós-cirúrgico",
      "Seguro pra filhote",
    ],
  },
  {
    num: "09",
    tocLabel: "Custo-benefício",
    titulo: "Custo-benefício inteligente.",
    paragrafos: [
      "Produto premium importado custa uma fortuna e você não sabe se vale. Marca brasileira séria com produto desse nível ainda é rara.",
      "Proteína concentrada significa que pouca quantidade entrega muita nutrição. Um pacote de 90g rende até 30 dias pra cão pequeno. Até 70% mais econômico que importado similar. Menos gasto veterinário com problema alimentar.",
    ],
    quote: "Até 70% mais econômico que importado similar.",
    quoteFonte: "Comparativo de preço por grama de proteína · 2025.",
    evidencias: [
      "1 pacote 90g rende até 30 dias pra cão pequeno",
      "Clube do Dragão · 10% off + frete grátis",
      "Menos gasto veterinário com problema alimentar",
    ],
  },
  {
    num: "10",
    tocLabel: "Resultado em 30 dias",
    titulo: "Resultado aparece em 30 dias.",
    paragrafos: [
      "Cansado de promessa vazia, de produto que parece bom no rótulo e não entrega nada? A gente também já passou por isso. Por isso só falamos do que conseguimos comprovar.",
      "Mais de 2 mil depoimentos verificados. 4,8/5 estrelas de satisfação. 95% de recompra entre clientes. Os números mais relevantes vêm de quem testa.",
    ],
    quote: "95% de recompra entre clientes.",
    quoteFonte: "Dados de venda · Comida de Dragão, 2024-2025.",
    evidencias: [
      "87% relatam redução/eliminação de coceira",
      "92% relatam pelagem mais brilhante",
      "78% relatam mais energia",
    ],
  },
];

const LATEST_POSTS = [
  {
    edicao: "Em breve · Ed. 02",
    titulo: "Por dentro da biofábrica",
    tempo: "12 min",
  },
  {
    edicao: "Em breve · Ed. 03",
    titulo: "Manifesto Lets Fly",
    tempo: "6 min",
  },
  {
    edicao: "Em breve · Ed. 04",
    titulo: "Casos clínicos: dermatite alimentar",
    tempo: "9 min",
  },
];

export default function Ciencia() {
  useEffect(() => { captureEntryUtms(); }, []);
  const [activeNum, setActiveNum] = useState<string>("01");
  const sectionsRef = useRef<HTMLElement[]>([]);

  /* IntersectionObserver: marca a seção atual no TOC conforme rola */
  useEffect(() => {
    const sections = MOTIVOS
      .map((m) => document.getElementById(`motivo-${m.num}`))
      .filter((el): el is HTMLElement => el !== null);
    sectionsRef.current = sections;

    const observer = new IntersectionObserver(
      (entries) => {
        // pega a primeira seção visível "mais alta" na tela
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) {
          const num = visible.target.id.replace("motivo-", "");
          setActiveNum(num);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="cie-page">
      <Helmet>
        <title>10 motivos científicos · Comida de Dragão</title>
        <meta
          name="description"
          content="A ciência por trás do petisco de larva BSF — hipoalergênico, 88,9% de digestibilidade, MAPA RJ 001924-0."
        />
        <meta property="og:title" content="10 motivos científicos · Comida de Dragão" />
        <meta property="og:description" content="A ciência por trás do petisco hipoalergênico de larva BSF." />
      </Helmet>

      {/* ════ MASTHEAD MAGAZINE ═════════════════════════════════ */}
      <header className="cie-mast">
        <div className="cie-mast-inner">
          <Link to="/portal" className="cie-mast-back">← portal</Link>
          <DragonLogo className="cie-mast-logo" />
          <div className="cie-mast-edition">Ed. 01 · ciência</div>
        </div>
      </header>

      {/* ════ HERO 2 COLUNAS (igual Fyrre) ═════════════════════ */}
      <section className="cie-hero">
        <div className="cie-hero-inner">
          <h1 className="cie-h1">
            Por que seu pet<br />vai aprovar a larva.
          </h1>
          <div className="cie-hero-side">
            <p className="cie-lede">
              A ciência por trás do petisco hipoalergênico de Mosca Soldado Negra
              — em 10 capítulos curtos, pra você ler com calma e decidir com cabeça.
            </p>
          </div>
        </div>

        <div className="cie-meta">
          <div className="cie-meta-cell">
            <div className="cie-meta-label">Texto</div>
            <div className="cie-meta-value">Comida de Dragão</div>
          </div>
          <div className="cie-meta-cell">
            <div className="cie-meta-label">Data</div>
            <div className="cie-meta-value">Mai. 2026</div>
          </div>
          <div className="cie-meta-cell">
            <div className="cie-meta-label">Leitura</div>
            <div className="cie-meta-value">8 min</div>
          </div>
          <div className="cie-meta-cell cie-meta-cell-end">
            <span className="cie-meta-tag">Ciência</span>
          </div>
        </div>
      </section>

      {/* ════ COVER IMAGE FULLBLEED ═════════════════════════════ */}
      <figure className="cie-cover">
        <img
          src="/assets/images/biofabrica-exterior.jpeg"
          alt="Biofábrica da Comida de Dragão em Cachoeiras de Macacu, RJ"
          loading="eager"
        />
      </figure>

      {/* ════ LAYOUT 2 COLUNAS: TOC sticky + Main artigo ═══════ */}
      <div className="cie-body">

        {/* SIDEBAR · TOC numerada sticky */}
        <aside className="cie-side">
          <div className="cie-side-inner">
            <div className="cie-toc-label">// índice</div>
            <ol className="cie-toc">
              {MOTIVOS.map((m) => (
                <li
                  key={m.num}
                  className={`cie-toc-item${activeNum === m.num ? " is-active" : ""}`}
                >
                  <a href={`#motivo-${m.num}`}>
                    <span className="cie-toc-num">{m.num}</span>
                    <span className="cie-toc-title">{m.tocLabel}</span>
                  </a>
                </li>
              ))}
            </ol>

            <div className="cie-side-credenciais">
              <div className="cie-credencial">
                <div className="cie-credencial-num">⌖</div>
                <div className="cie-credencial-text">
                  <strong>MAPA</strong>
                  <span>RJ 001924-0</span>
                </div>
              </div>
              <div className="cie-credencial">
                <div className="cie-credencial-num">↗</div>
                <div className="cie-credencial-text">
                  <strong>Biofábrica</strong>
                  <span>Cachoeiras de Macacu, RJ</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN · artigo */}
        <main className="cie-main">

          {/* MOTIVOS · cada um é um capítulo */}
          {MOTIVOS.map((m) => (
            <section
              className="cie-chapter"
              key={m.num}
              id={`motivo-${m.num}`}
            >
              {/* Número grande opcional — pode omitir em artigos sem lista */}
              {m.num && (
                <div className="cie-chapter-num">{m.num}</div>
              )}

              <h2 className="cie-chapter-h2">{m.titulo}</h2>

              {m.paragrafos.map((p, i) => (
                <p className="cie-chapter-text" key={i}>{p}</p>
              ))}

              <blockquote className="cie-quote">
                <span className="cie-quote-mark" aria-hidden="true">“</span>
                <p className="cie-quote-text">{m.quote}</p>
                <cite className="cie-quote-fonte">
                  <span className="cie-quote-fonte-tag">Fonte</span>
                  {m.quoteFonte}
                </cite>
              </blockquote>

              <ul className="cie-evidencias">
                {m.evidencias.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </section>
          ))}

          {/* FIM · encerramento + CTA */}
          <section className="cie-fim">
            <h2 className="cie-fim-h2">No fim do dia.</h2>
            <p>
              Não vendemos petisco. Vendemos uma decisão melhor. Se você leu até aqui,
              já entendeu o caminho — só falta começar.
            </p>
            <div className="cie-fim-cta-wrap">
              <a
                href={ctaUrl("fim")}
                className="cie-fim-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Conhecer os produtos →
              </a>
              <div className="cie-fim-cupom">
                cupom <strong>BORALA</strong> · 10% off na primeira compra
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* ════ LATEST POSTS (mockados — em breve) ═══════════════ */}
      <section className="cie-latest">
        <div className="cie-latest-head">
          <h2 className="cie-latest-h2">Próximas edições</h2>
          <Link to="/biblioteca" className="cie-latest-see">Ver todas →</Link>
        </div>
        <div className="cie-latest-grid">
          {LATEST_POSTS.map((p, i) => (
            <article className="cie-latest-card" key={i}>
              <div className="cie-latest-edicao">{p.edicao}</div>
              <h3 className="cie-latest-title">{p.titulo}</h3>
              <div className="cie-latest-meta">
                <span>Texto · Comida de Dragão</span>
                <span aria-hidden="true">·</span>
                <span>{p.tempo}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ════ FOOTER MAGAZINE ═══════════════════════════════════ */}
      <footer className="cie-foot">
        <div className="cie-foot-inner">
          <div>
            <div className="cie-foot-tagline">Nojento é o desperdício.</div>
            <div className="cie-foot-name">Comida de Dragão · Lets Fly Sustentável</div>
          </div>
          <div className="cie-foot-info">
            <div>CNPJ 42.041.946/0001-46 · MAPA RJ 001924-0</div>
            <div>
              <a href="https://wa.me/552139500576" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <span> · </span>
              <a href="mailto:comidadedragao@letsfly.com.br">E-mail</a>
              <span> · </span>
              <a href="https://instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">@comidadedragao</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
