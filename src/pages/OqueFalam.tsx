import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import LeadPopup from "@/components/LeadPopup";
import "./QueroSerDragao.css"; // sistema visual retrô-OS / duotone (.qsd8)
import "./OqueFalam.css";      // tema cf-pink 8-bit (cópia do antigo Conheca.css — Conheca virou verde)

/* ──────────────────────────────────────────────────────────────
   LP PROVA SOCIAL — O QUE FALAM · /oquefalam
   CLONE do shell da /curiosidade (qsd8 · cf-pink).
   Página de prova pura: MURAL de reviews REAIS (export Judge.me, 177
   publicadas, média 4,91★). Texto VERBATIM — com os erros, o nojo e o
   humor deles. Não reescrever: o erro de português é a prova de que é gente.
   Abaixo do hero, SÓ os comentários — cada um na sua própria janela (qsd8-win).
   CTA suave fica só na barra sticky pro Kit para Cães (token KQXZ5J7LWK · frete grátis).
   ────────────────────────────────────────────────────────────── */

/* Kit para Cães · SKU 1302 · token KQXZ5J7LWK · sem promocode (frete grátis) */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK`;
const UTM_FALLBACK = { utm_source: "lp-oquefalam", utm_medium: "lp", utm_campaign: "lp-oquefalam-provas" };
const buy = (cta: string) => buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

const withUtm = (url: string, content: string) => {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "lp-oquefalam");
    u.searchParams.set("utm_medium", "lp");
    u.searchParams.set("utm_campaign", "lp-oquefalam");
    u.searchParams.set("utm_content", content);
    return u.href;
  } catch { return url; }
};

const ICON = "/assets/pixel-icons";
const PETS = ["pet1.jpg", "pet2.jpg", "pet3.jpg", "pet4.jpg"];

/* inclinação leve e VARIADA por janela — determinística (não pula no re-render) */
const TILTS = [-2.4, 1.6, -1.1, 2.3, -0.7, 1.9, -2.1, 0.8, 1.4, -1.8, 2.5, -1.3, 0.6, -2.2];

/* só os 2 KITS no hero (mesmo formato → alinham bonito) — imagens reais do repo */
const HERO_PRODS = [
  { img: "kit-caes.png", label: "Kit para Cães" },
  { img: "kit-gatos.png", label: "Kit para Gatos" },
];

type DeskItem = { img: string; label: string; href?: string; ext?: boolean; big?: boolean };
const DESK: DeskItem[] = [
  { img: "bsf.png", label: "LARVA.BSF", href: "/ciencia" },
  { img: "original-real.png", label: "ORIGINAL", href: "/original" },
  { img: "paw2.png", label: "MATILHA", href: "/quero-ser-dragao" },
  { img: "dog.png", label: "MEU-PET", href: "https://www.comidadedragao.com.br/blogs/news", ext: true },
  { img: "star8.png", label: "4.91★", href: "#mural" },
  { img: "shield.png", label: "ALERGIA", href: "/alergia" },
  { img: "earth.png", label: "PLANETA", href: "https://www.comidadedragao.com.br/blogs/news", ext: true },
  { img: "crown.png", label: "PRODUTOS", href: "/produtos" },
];

/* janela OS */
const Win = ({ name, children, className, inverted, mac }: {
  name: string; children: ReactNode; className?: string; inverted?: boolean; mac?: boolean;
}) => (
  <section className={`qsd8-win${inverted ? " inverted" : ""}${className ? " " + className : ""}`}>
    <div className="qsd8-titlebar">
      {mac && <span className="qsd8-mac-dots" aria-hidden="true"><i /><i /></span>}
      <span className="qsd8-tb-name">{name}</span>
      <span className="qsd8-tb-stripes" aria-hidden="true" />
    </div>
    <div className="qsd8-win-body">{children}</div>
  </section>
);

const DeskCol = ({ items, side }: { items: DeskItem[]; side: "left" | "right" }) => (
  <div className={`qsd8-desk-icons ${side}`}>
    {items.map((it, i) => {
      const cls = `qsd8-icon${it.big ? " big" : ""}`;
      const inner = <><img src={`${ICON}/${it.img}`} alt="" /><span>{it.label}</span></>;
      if (it.ext) return <a className={cls} key={i} href={withUtm(it.href!, `icon-${it.label.toLowerCase()}`)} target="_blank" rel="noopener noreferrer">{inner}</a>;
      if (it.href?.startsWith("#")) return <a className={cls} key={i} href={it.href}>{inner}</a>;
      return <Link className={cls} key={i} to={it.href!}>{inner}</Link>;
    })}
  </div>
);

/* ── MURAL — reviews REAIS, verbatim (Judge.me). r = estrelas ─────────
   Selecionadas por força/variedade: aceitação, gato, idoso, alergia/coceira,
   digestão, sustentável, o vet, e as SINCERAS (nojo + humor) que provam que é gente. */
type Review = { r: number; t: string; by: string };
const REVIEWS: Review[] = [
  { r: 5, t: "Meus cachorros ficaram alucinadas tanto pela Original quanto pelas Mordidas!! Nunca vi eles ficarem assim.", by: "Djair Santana" },
  { r: 5, t: "Incrível! A minha cachorra ficou MALUCA hahaha. Nunca tinha visto ela gostar tanto de um petisco como gostou das larvinhas. Indicando pra todo mundo e indo comprar mais!", by: "Cíntia Suzuki Ramos" },
  { r: 5, t: "Aqui em casa o gato e o cachorro amaram os petiscos, em especial as larvas desidratadas. Ficam de plantão na frente do armário onde armazeno esperando ganhar, agora fará parte da alimentação diária deles.", by: "Daliana D Agostin" },
  { r: 5, t: "Minha cachorrinha ficou obcecada! Eu honestamente achei que ela não iria gostar, mas ela amou! Com certeza comprarei novamente!", by: "Chayanne Rech" },
  { r: 5, t: "Minha cachorra amou, mas confesso que fiquei com nojo das larvas kkkk", by: "Ana Paula Scalioni" },
  { r: 5, t: "O Otto amou todos os produtos, especialmente as larvas! Confesso que ficamos curiosos e acabei provando também kkk (e parece um salgadinho)", by: "Katia Maier dos Santos" },
  { r: 5, t: "Excelente!! Meu cachorro amou! Eu fiquei com um pouco de nojo obviamente haahahah mas o importante é o dog gostar né!!", by: "Maria Julia Mattos" },
  { r: 5, t: "Nossa apesar de dar agonia em olhar, porque é mesmo uma larva, o Max meu Golden amou muito. Fiz um vídeo e marquei a empresa no IG dele comendo… recomendo!", by: "Valdirene Eça Sales" },
  { r: 5, t: "Minha doguinha simplesmente amou! É doida pelas larvinhas! Ela está com sensibilidade a carne bovina e frango, além de alergia a peixe e suínos. As reações que tinha desapareceram, intestino funcionando bem! Até a nutri dela se empolgou com as larvas e indicará para os pacientes alergicos dela.", by: "Adriana de Oliveira Corrêa" },
  { r: 5, t: "Maravilha pois minha pug atópica melhorou muito a coceira e ela não está abrindo mais feridas", by: "Kátia Chamon" },
  { r: 5, t: "Meu cão é alérgico a proteina de frango então o suplemento ajuda bastante na alimentação. Ele tem se coçado bem menos.", by: "Carolina Caballero" },
  { r: 5, t: "ótimo! meu cachorro é alérgico a proteína animal e atópico, então é super complicado conseguir petiscos pra ele. Não só ele amou, como não causou nenhuma irritabilidade nem na pele nem no intestino.", by: "Carolina" },
  { r: 5, t: "Eu sou médica veterinária fisiatra e trabalho com longevidade animal, então a qualidade dos petiscos importa muito durante as sessões de fisio. Os pacientes adoraram e eu consigo realizar sem restrições, além de ser uma proteína nova para pacientes com sensibilidade.", by: "Brenda Euzebio" },
  { r: 5, t: "Estou impressionadaaa!! tenho duas, uma golden idosa e uma srd de 3 anos. A primeira experiência delas foi com as larvinhas. Elas amaram. A golden pula e late desesperada querendo comer. Filhas felizes, mamãe feliz :)", by: "Déborah Morato" },
  { r: 5, t: "Minhas meninas amaram, eu coloco junto da comida delas, o prato fica limpo num piscar de olhos - e olha que Melissa, aos 16 anos, é um tico chata pra comer, mas se deu super bem com tudo!", by: "Fabíola Ciuti" },
  { r: 5, t: "aqui em casa foi sucesso, o Paçoca e o Rag amam comida de dragão, eu pedi uma amostra grátis primeiro, pra ver se eles iriam gostar, e logo de cara eles gostaram, por isso já viramos compradores!", by: "Daniela Cavalcanti" },
  { r: 5, t: "É a segunda vez que compro e os meus cachorros são completamente alucinados nos produtos Comida de Dragão! Nós somos clientes já fidelizados.", by: "Marina Cichowicz" },
  { r: 5, t: "Otto e a Olívia amaram!!! O pacote tem que ficar escondido, pq se ñ eles pedem o tempo todo.", by: "Flávia Ribeiro" },
  { r: 5, t: "Tenho 7 cães TODOS amaram!!! já comprei mais para eles!", by: "Gisella Valverde" },
  { r: 5, t: "Tirando a aflição de olhar os casulos! Meus cães amaram. Tem um cheirinho muito bom! Já fiz novo pedido!", by: "Cleide Arruda" },
  { r: 5, t: "A Anastácia amou demais! No começo achei estranha a proposta, porém ela tá aceitando bem melhor a ração por misturar com o petisco", by: "Raquel Jacob Pereira" },
  { r: 5, t: "Amei muito!! Aqui em casa ninguém dispensou nem mesmo os 5 gatos, auxilia em caso de necessidade de fezes mais firmes e também notei uma diferença na queda dos pelos", by: "Yasa" },
  { r: 5, t: "Meus cães só comem crua com ossos, e passei a usar o suplemento junto e as fezes já eram pequenas e acabou que diminuiu ainda mais… isso me mostra que ajudou no processo de melhor absorção!", by: "Luciana Lourenço Paton" },
  { r: 5, t: "Meu cão está apaixonado por este snack. Estou ensinando ele a fazer xixi no local certo, usando a mordida de dragão como agrado. Está sendo um sucesso.", by: "Marcelle Alcoforado" },
  { r: 5, t: "Não acreditei quando o meu cachorro devorou! Sempre que pego o pacote ele fica doido!", by: "Olivia" },
  { r: 5, t: "Confesso que não estava acreditando não, que era só mkt mesmo. Mas a Kate amou os petiscos, ficava enlouquecida cada vez q eu pegava o pacote… E sendo natural com benefícios p ela, está aprovado!", by: "Michelle Klemar" },
  { r: 5, t: "Meu dragãozinho é do tipo felino e amou as larvas.", by: "Lucila" },
  { r: 5, t: "Meus gatinhos gostaram demais. obrigada!", by: "Ana Elise" },
  { r: 5, t: "Já conhecia esta fonte de proteínas (larvas). Meu pai cultivava em casa para alimentar pássaros. Mas nunca imaginava ser fonte para 'quatro patinhas'. Comprei, fiz uso, e minhas cachorrinhas amaram. Ficam estonteantes, só em pegar o pacote. Já encomendei mais.", by: "Joilson Hermsdorff Vellozo" },
  { r: 5, t: "Aqui em casa todo mundo ama ama ama! É incrível a palatabilidade", by: "Marcela Silveira" },
  { r: 5, t: "A Bella disse que amou muito e que quer mais!!! Kkkkk excelente!! Inclusive para adestrar positivamente, maravilhoso!", by: "Márcia Araújo" },
  { r: 3, t: "Meu cachorro amou! Mas confesso que por mais ecológica e sustentável que eu seja... achei um pouquinho nojento. Achei que seria um petisco feito de larvas e não as larvas mesmo.... kkkk. Acho a ideia incrível, mas preciso me adaptar aos bichos secos.", by: "Renata Feres" },
];

/* mural = comentários + FOTOS intercaladas (as mesmas que estavam no hero) — feedback como imagem.
   ar = aspecto VARIADO por foto: umas mais altas ("grandes"), outras mais quadradas/menores. */
const PHOTO_AR = ["3 / 4", "1 / 1", "4 / 5", "5 / 4"];
type WallItem = { kind: "text"; r: Review } | { kind: "photo"; src: string; by: string; ar: string };
const WALL: WallItem[] = (() => {
  const out: WallItem[] = [];
  let p = 0;
  const pushPhoto = () => { out.push({ kind: "photo", src: PETS[p], by: "foto.da.matilha", ar: PHOTO_AR[p % PHOTO_AR.length] }); p++; };
  REVIEWS.forEach((r, i) => {
    out.push({ kind: "text", r });
    if ((i + 1) % 6 === 0 && p < PETS.length) pushPhoto();
  });
  while (p < PETS.length) pushPhoto();
  return out;
})();

const Stars = ({ n }: { n: number }) => (
  <div style={{ color: "#FFB020", fontSize: 13, letterSpacing: 2, marginBottom: 8 }} aria-label={`${n} de 5 estrelas`}>
    {"★".repeat(n)}<span style={{ opacity: .22 }}>{"★".repeat(5 - n)}</span>
  </div>
);

const OqueFalam = () => {
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => { captureEntryUtms(); }, []);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="qsd8 cf-pink">
      <PageMeta
        title="O que falam da Comida de Dragão — 177 avaliações reais, 4,91★"
        description="Avaliações reais de clientes da Comida de Dragão (larva BSF pra pets): 177 publicadas, média 4,91★. Sem filtro, sem roteiro — o que a matilha escreveu de verdade."
        image="/assets/images/produtos/kit-caes.png"
      />

      {/* filtro duotone dos assets */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="qsd8-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.086 1.0" />
            <feFuncG type="table" tableValues="0.027 0.0" />
            <feFuncB type="table" tableValues="0.274 0.4" />
          </feComponentTransfer>
        </filter>
      </svg>

      <img className="qsd8-bg" src="/assets/bg-clouds.jpg" alt="" aria-hidden="true" />
      <DeskCol items={DESK} side="left" />

      {/* sticky mobile — CTA suave, aparece só depois de rolar */}
      <div className={`cf-sticky${showSticky ? " show" : ""}`}>
        <div className="cf-sticky-info"><strong>4,91★</strong><span>177 avaliações reais · 🚚 frete grátis</span></div>
        <a href={buy("sticky")} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero o kit →</a>
      </div>

      <div className="qsd8-wrap">
        {/* ══ HERO — A PROVA ════════════════════════════════════════ */}
        <Win name="O-QUE-FALAM.EXE" mac className="qsd8-hero-win">
          <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            {/* ESQUERDA — logo GRANDE + caixa (frame) com os 3 produtinhos, tipo card */}
            <div style={{ flex: "1 1 300px", minWidth: 280 }}>
              <DragonLogo style={{ height: 116, width: "auto", maxWidth: "100%", display: "block", marginBottom: 16 }} />
              <Win name="OS.KITS">
                <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "flex-end" }}>
                  {HERO_PRODS.map((p, i) => (
                    <figure key={i} style={{ flex: "1 1 0", maxWidth: 200, margin: 0, textAlign: "center" }}>
                      <img src={`/assets/images/produtos/${p.img}`} alt={p.label} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
                      <figcaption style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".5px", textTransform: "uppercase", opacity: .65, marginTop: 8 }}>{p.label}</figcaption>
                    </figure>
                  ))}
                </div>
              </Win>
            </div>
            {/* DIREITA — frase + título "o que falam da gente" + copy + selos */}
            <div style={{ flex: "1 1 340px", minWidth: 300 }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", opacity: .7, marginBottom: 10 }}>Alimento pra pet · feito de inseto</div>
              <h1 className="qsd8-title" style={{ margin: 0 }}>O que a <span>matilha</span> fala.<br />A gente não escreveu nenhuma.</h1>
              <p className="qsd8-sub" style={{ marginTop: 10 }}>
                Avaliações <strong>reais</strong> de quem já deu Comida de Dragão pro bicho — do jeitinho que os
                tutores escreveram, com o nojo, o "kkkk" e o cachorro pirando na frente do armário. A gente só copiou e colou.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                <span className="cf-tag t1">⭐ 4,91 de média</span>
                <span className="cf-tag t2">177 avaliações</span>
                <span className="cf-tag t3">0 escritas por nós</span>
              </div>
            </div>
          </div>
        </Win>

      </div>

      {/* ══ MURAL — FULL-CANVAS, fora do wrap: ocupa a tela toda, irregular (masonry) ══
          columnWidth espalha em N colunas conforme a largura → some o vão ao lado das
          fotos verticais e reviews preenchem sozinhas. Cada janela com inclinação leve. */}
      <span id="mural" />
      <div className="of-mural" style={{ position: "relative", zIndex: 1, columnWidth: "290px", columnGap: "20px", padding: "6px 24px 44px" }}>
        {WALL.map((item, i) => (
          <div key={i} style={{ breakInside: "avoid", WebkitColumnBreakInside: "avoid", marginBottom: 20, transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}>
            {item.kind === "text" ? (
              <Win name={item.r.by}>
                <Stars n={item.r.r} />
                <div className="cf-review-t">“{item.r.t}”</div>
              </Win>
            ) : (
              <Win name={item.by}>
                <img src={`/assets/conheca/${item.src}`} alt="Pet da matilha — feedback em foto" loading="lazy" style={{ width: "100%", aspectRatio: item.ar, objectFit: "cover", borderRadius: 4, display: "block" }} />
              </Win>
            )}
          </div>
        ))}
      </div>

      <div className="qsd8-wrap">

        {/* ══ FOOTER ════════════════════════════════════════════════ */}
        <footer className="qsd8-footer">
          <DragonLogo className="qsd8-footer-logo" />
          <nav className="qsd8-footer-nav">
            <Link to="/portal">Portal</Link>
            <Link to="/produtos">Produtos</Link>
            <Link to="/ciencia">Ciência</Link>
            <Link to="/curiosidade">Curiosidade</Link>
            <a href={withUtm("https://www.instagram.com/comidadedragao", "footer-ig")} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={withUtm("https://www.comidadedragao.com.br", "footer-loja")} target="_blank" rel="noopener noreferrer">Comprar</a>
          </nav>
          <div className="qsd8-footer-tag">Nojento é o desperdício.</div>
        </footer>
      </div>

      <LeadPopup slug="oquefalam" />
    </div>
  );
};

export default OqueFalam;
