import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import "./QueroSerDragao.css"; // sistema visual retrô-OS / duotone (.qsd8)
import "./Conheca.css";        // MESMO tema da /conheca (.cf-pink) — clone; Bianca reveste depois

/* ──────────────────────────────────────────────────────────────
   LP CAMPANHA — CURIOSIDADE (LARVA) · /curiosidade
   CLONE da /conheca. Público frio dos ads de curiosidade ("olha, larva!").
   Produto-foco: KIT COMIDA DE DRAGÃO PARA CÃES.
   = Original (petisco de larva 90g) + Suplemento Integral (180g).
   SKU 1302 · token Yampi KQXZ5J7LWK · R$ 145,00 no checkout Yampi · FRETE GRÁTIS.

   PREÇO/FRETE/DESCONTO = MESMO PADRÃO das LPs de Kit (Alergia · Idoso ·
   GatoCoceira): exibe R$ 145,00 (é o que o Yampi cobra; o R$116 é vitrine
   Shopify, outro canal) + FRETE GRÁTIS no Kit. Checkout SEM promocode; o
   desconto é o cupom do AFILIADO (−10%) que vem na copy do ANÚNCIO e o
   cliente digita no checkout ("conhece um afiliado? usa o cupom dele").
   ────────────────────────────────────────────────────────────── */

/* Kit para Cães · SKU 1302 · token KQXZ5J7LWK · sem promocode (frete grátis) */
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK`;
const PRICE = "145,00"; // preço-cheio exibido, igual Alergia/Idoso/GatoCoceira (Yampi)
const UTM_FALLBACK = { utm_source: "lp-curiosidade", utm_medium: "lp", utm_campaign: "lp-curiosidade-kit-caes" };
const buy = (cta: string) => buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

/* UTM em links externos (loja/IG são cross-domain) */
const withUtm = (url: string, content: string) => {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "lp-curiosidade");
    u.searchParams.set("utm_medium", "lp");
    u.searchParams.set("utm_campaign", "lp-curiosidade");
    u.searchParams.set("utm_content", content);
    return u.href;
  } catch { return url; }
};

const ICON = "/assets/pixel-icons";
const PACK = "/assets/images/produtos/kit-caes.png"; // imagem real do Kit para Cães
const PETS = ["pet1.jpg", "pet2.jpg", "pet3.jpg", "pet4.jpg"];

type DeskItem = { img: string; label: string; href?: string; ext?: boolean; big?: boolean };
/* mesmo conjunto das LPs (esquerda) — sem o ícone-egg da LIXEIRA */
const DESK: DeskItem[] = [
  { img: "bsf.png", label: "LARVA.BSF", href: "/ciencia" },
  { img: "original-real.png", label: "ORIGINAL", href: "/original" },
  { img: "paw2.png", label: "MATILHA", href: "/quero-ser-dragao" },
  { img: "dog.png", label: "MEU-PET", href: "https://www.comidadedragao.com.br/blogs/news", ext: true },
  { img: "stomach.png", label: "88.9%", href: "/assets/pdfs/artigos-cientificos/bsf-in-vivo-vitro-digestibility-dog-food.pdf", ext: true },
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

const PDF_DIGEST = "/assets/pdfs/artigos-cientificos/bsf-in-vivo-vitro-digestibility-dog-food.pdf";
const WHY = [
  { img: "shield.png", title: "Pro pet alérgico", desc: "Proteína inédita que o corpo nunca viu — a queridinha de quem tem alergia ou pet atópico. 100% hipoalergênico, 1 ingrediente só.", href: "/alergia" },
  { img: "stomach.png", title: "88,9% digestível", desc: "Estudos indicam digestibilidade altíssima: o corpo absorve quase tudo. Mais nutrição, menos cocô.", href: PDF_DIGEST, ext: true },
  { img: "star8.png", title: "Pele e pelo", desc: "Rica em ácido láurico e ômegas 6 e 9. Estudos associam a pelo brilhante e pele saudável.", href: "/ciencia" },
  { img: "earth.png", title: "Bom pro planeta", desc: "Sustentável e natural — uma proteína que resolve um problema real: 83% menos carbono e 142× menos terra que o boi.", href: "https://www.comidadedragao.com.br/blogs/news", ext: true },
];

/* reviews REAIS (export Judge.me — nome + cidade) — já falam "larvas", maioria cão */
const REVIEWS = [
  { t: "Meu cachorro amou! E olha que ele costuma ser enjoado com petiscos. Está super aprovado!", by: "Mirian, São João del Rei-MG" },
  { t: "Meu dragãozinho é do tipo felino e amou as larvas.", by: "Lucila, Mogi das Cruzes-SP" },
  { t: "Chegou super rápido e meu chihuahua amou! Principalmente as larvinhas.", by: "Tayná, São Paulo-SP" },
  { t: "As cachorrinhas ficaram simplesmente loucas, não podem nem sentir o cheiro da embalagem :)", by: "Ana Beatriz, Rio de Janeiro-RJ" },
  { t: "Fredinho adorou. Come as larvas como se fossem petiscos 👏", by: "Cristiane, Campinas-SP" },
  { t: "Meus cães amaram! Estão viciados rsrs", by: "Fernanda, Rio de Janeiro-RJ" },
];

/* ficha do KIT PARA CÃES (Original + Suplemento Integral) */
const FICHA = [
  "Vem no kit: o Original (petisco de larva, 90g) + o Suplemento Integral (180g)",
  "Suplemento Integral — 45% de proteína, 88,9% de aproveitamento, aminoácidos completos",
  "Original — 1 ingrediente, 100% larva de BSF desidratada, hipoalergênico",
  "Frete grátis no Kit — pra todo o Brasil, por nossa conta",
  "Pro dia a dia — filhote, adulto ou sênior",
  "Feito no Rio · registro MAPA",
];

const FAQ = [
  { num: "01", title: "Por que o kit, e não só o petisco?", desc: "Porque cão precisa dos dois: o Original é o petisco/topper de larva e o Suplemento Integral é o pó que completa a nutrição do dia a dia. Num kit só, com frete grátis pra todo o Brasil." },
  { num: "02", title: "O que vem no Kit para Cães?", desc: "O Original (larvinhas inteiras, pra petisco ou por cima da comida) + o Suplemento Integral (pó pra misturar na ração). O frete é por nossa conta." },
  { num: "03", title: "É seguro?", desc: "Faz bem, não mal. Biofábrica registrada no MAPA, tudo rastreável. Lá fora já virou tendência." },
  { num: "04", title: "E se ele não comer?", desc: "Na maioria das vezes o bloqueio é do tutor 😅. Mistura na ração e deixa ele decidir. Garantia da matilha: 14 dias." },
  { num: "05", title: "Meu vet não conhece", desc: "Tem estudo peer-reviewed desde 2015. Mostra pro seu vet — a gente adora essa conversa." },
];

const Curiosidade = () => {
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => { captureEntryUtms(); }, []);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="qsd8 cf-pink">
      <PageMeta
        title="Kit Comida de Dragão para Cães — leva o combo, frete grátis"
        description="Kit para Cães: o petisco de larva BSF (Original) + o Suplemento Integral do dia a dia. Hipoalergênico, no mínimo 40% de proteína, 88,9% de digestibilidade. Frete grátis."
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

      {/* sticky mobile — aparece só depois de rolar */}
      <div className={`cf-sticky${showSticky ? " show" : ""}`}>
        <div className="cf-sticky-info"><strong>R$ {PRICE}</strong><span>Kit para Cães · 🚚 frete grátis</span></div>
        <a href={buy("sticky")} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero meu kit →</a>
      </div>

      <div className="qsd8-wrap">
        {/* ══ HERO — PROVOCA (curiosidade, espelhando os ads de larva) ══ */}
        <Win name="BOAS-VINDAS.EXE" mac className="qsd8-hero-win">
          <div className="cf-hero2 cf-hero-main">
            <div className="cf-hero-copy">
              <h1 className="qsd8-title">Já imaginou dar <span>larva</span> pro seu cão? Leva o <span>kit completo</span>.</h1>
              <p className="qsd8-sub">
                O Kit para Cães junta os dois: o <strong>petisco de larva BSF</strong> (Original) +
                o <strong>Suplemento Integral</strong> do dia a dia. Estranho? Só no começo —
                9 em 10 tutores se surpreendem. O cão? Já sabia desde sempre.
              </p>
            </div>
            <div className="cf-hero-pack">
              <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
                <span className="cf-tag t1" style={{ position: "absolute", top: 8, right: -4, zIndex: 3, whiteSpace: "nowrap" }}>🚚 Kit com frete grátis</span>
                <img src={PACK} alt="Kit Comida de Dragão para Cães — Original + Suplemento Integral" />
              </div>
              <div className="cf-offer-price" style={{ marginTop: 10, marginBottom: 0 }}>R$ {PRICE}</div>
              <div style={{ fontSize: 13, fontWeight: 700, opacity: .75, marginTop: 2 }}>🚚 Frete grátis no Kit · 4× sem juros</div>
            </div>
            <div className="cf-hero-cta qsd8-btnrow">
              <a href={buy("hero")} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero meu kit</a>
              <a href="#porque" className="qsd8-btn ghost">Por quê?</a>
            </div>
          </div>
        </Win>

        {/* ══ VIRA — POR QUE É MELHOR ═══════════════════════════════ */}
        <span id="porque" />
        <Win name="SCAN: LARVA.BSF">
          <h2 className="qsd8-h2">Por que faz <span>bemzão</span> pro seu cão?</h2>
          <div className="qsd8-loot">
            {WHY.map((w, i) => {
              const body = (
                <>
                  <img className="qsd8-card-ico" src={`${ICON}/${w.img}`} alt="" />
                  <div className="qsd8-card-title">{w.title}</div>
                  <div className="qsd8-card-desc">{w.desc}</div>
                  <span className="cf-card-link">saiba mais →</span>
                </>
              );
              return w.ext
                ? <a className="qsd8-card cf-card-a" key={i} href={w.href} target="_blank" rel="noopener noreferrer">{body}</a>
                : <Link className="qsd8-card cf-card-a" key={i} to={w.href}>{body}</Link>;
            })}
          </div>
          <p className="qsd8-note" style={{ marginTop: 18 }}>
            Não é achismo, é ciência. <Link to="/biblioteca" style={{ color: "var(--lime)", fontWeight: 700 }}>estudos na biblioteca →</Link>
          </p>
        </Win>

        {/* ══ PERTENCE — MATILHA ════════════════════════════════════ */}
        <Win name="MATILHA-ONLINE.MOV">
          <h2 className="qsd8-h2">Quem cruzou a ponte <span>não volta</span></h2>
          <div className="qsd8-loot">
            {REVIEWS.map((r, i) => (
              <div className="cf-review" key={i}>
                <div className="cf-review-t">“{r.t}”</div>
                <div className="cf-review-by">— {r.by}</div>
              </div>
            ))}
          </div>
          <div className="cf-pet-row">
            {PETS.map((p, i) => (
              <img className="cf-review-pet" key={i} src={`/assets/conheca/${p}`} alt="Pet da matilha" loading="lazy" />
            ))}
          </div>
        </Win>

        {/* ══ O CHOQUE (agora que já criou relação) ════════════════ */}
        <Win name="ERROR: RAÇÃO.SYS">
          <div className="cf-larva">
            <div className="cf-larva-media">
              <img className="cf-larva-img" src="/assets/conheca/larvas.png" alt="Larvas de BSF desidratadas no pote" />
            </div>
            <div>
              <h2 className="qsd8-h2">É larva. <span>Pronto, falei.</span></h2>
              <p className="qsd8-sub">
                9 em 10 pessoas se surpreendem no começo — e é aí que a ficha cai: a larva de BSF é
                uma das proteínas mais completas e inteligentes que a natureza inventou. O seu cão?
                Já sabia disso desde sempre. O que parecia estranho vira o melhor do pote.
              </p>
            </div>
          </div>
        </Win>

        {/* ══ FICHA DO KIT ══════════════════════════════════════════ */}
        <Win name="ARQUIVO: KIT.250G">
          <h2 className="qsd8-h2">O <span>Kit para Cães</span>, sem susto</h2>
          <p className="qsd8-sub" style={{ maxWidth: 620 }}>Dois produtos, uma caixa: o Original (petisco de larva) + o Suplemento Integral pro dia a dia. E o frete é por nossa conta.</p>
          <div className="qsd8-reqs" style={{ marginTop: 8 }}>
            {FICHA.map((f, i) => (
              <div className="qsd8-req" key={i}>
                <img className="cf-check" src={`${ICON}/check.png`} alt="" />
                <div className="qsd8-req-body"><strong>{f}</strong></div>
              </div>
            ))}
          </div>
          <p className="qsd8-note" style={{ marginTop: 16 }}>Feito na nossa biofábrica registrada no MAPA, em Cachoeiras de Macacu (RJ).</p>
        </Win>

        {/* ══ FAQ ═══════════════════════════════════════════════════ */}
        <Win name="FAQ.EXE">
          <h2 className="qsd8-h2">A gente já <span>ouviu de tudo.</span></h2>
          <p className="qsd8-sub" style={{ marginBottom: 22 }}>
            É estranho de propósito — e seus pets vão amar assim mesmo. Já respondemos o que todo mundo pergunta:
          </p>
          <div className="qsd8-rules">
            {FAQ.map((f, i) => (
              <div className="qsd8-rule" key={i}>
                <div className="qsd8-rule-num">{f.num}</div>
                <div className="qsd8-rule-title">{f.title}</div>
                <div className="qsd8-rule-desc">{f.desc}</div>
              </div>
            ))}
          </div>
          <p className="qsd8-note" style={{ marginTop: 18 }}>
            A gente adora informação. Toda a ciência tá aberta na <Link to="/biblioteca" style={{ color: "var(--lime)", fontWeight: 700 }}>nossa biblioteca científica →</Link>
          </p>
        </Win>

        {/* ══ AGE — OFERTA (kit + frete grátis, cupom só do afiliado) ══ */}
        <span id="oferta" />
        <Win name="DOWNLOADING: SEU-KIT.EXE" className="qsd8-cta-win">
          <div className="cf-hero2">
            <div className="cf-hero-pack">
              <img src={PACK} alt="Kit Comida de Dragão para Cães — Original + Suplemento Integral" />
            </div>
            <div style={{ textAlign: "left" }}>
              <h2 className="qsd8-cta-title" style={{ textAlign: "left" }}>Bora fazer <span>bemzão?</span> Leva o kit do cão.</h2>
              <p className="qsd8-cta-sub" style={{ margin: "0 0 4px" }}>O petisco de larva + o suplemento do dia a dia, numa caixa só. Faz bem duas vezes: pro seu cão e pro planeta. E o frete é por nossa conta.</p>
              <div className="cf-offer-price">R$ {PRICE}</div>
              <p className="qsd8-cta-sub" style={{ margin: "0 0 16px" }}>🚚 <strong>Frete grátis no Kit</strong> · 4× sem juros · conhece um afiliado? usa o cupom dele no checkout</p>
              <a href={buy("oferta")} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero meu kit →</a>
              <p className="qsd8-cta-note" style={{ textAlign: "left" }}>
                Garantia da matilha: 14 dias. Ainda na dúvida?{" "}
                <a href={withUtm("https://www.instagram.com/comidadedragao", "offer-ig")} target="_blank" rel="noopener noreferrer" style={{ color: "var(--lime)" }}>segue o Dragão →</a>
              </p>
            </div>
          </div>
        </Win>

        {/* ══ FOOTER ════════════════════════════════════════════════ */}
        <footer className="qsd8-footer">
          <DragonLogo className="qsd8-footer-logo" />
          <nav className="qsd8-footer-nav">
            <Link to="/portal">Portal</Link>
            <Link to="/produtos">Produtos</Link>
            <Link to="/ciencia">Ciência</Link>
            <Link to="/original">Original</Link>
            <a href={withUtm("https://www.instagram.com/comidadedragao", "footer-ig")} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={withUtm("https://www.comidadedragao.com.br", "footer-loja")} target="_blank" rel="noopener noreferrer">Comprar</a>
          </nav>
          <div className="qsd8-footer-tag">Nojento é o desperdício.</div>
        </footer>
      </div>
    </div>
  );
};

export default Curiosidade;
