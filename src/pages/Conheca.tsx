import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import "./QueroSerDragao.css"; // sistema visual retrô-OS / duotone (.qsd8)
import "./Conheca.css";        // override tema PINK & claro (.cf-pink)

/* checkout: mesma promoção da /original (BORALA 10%), utm próprio p/ medir */
const COUPON = "BEMZAO";
const PRODUCT_URL = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?promocode=${COUPON}`;
const UTM_FALLBACK = { utm_source: "lp-conheca", utm_medium: "lp", utm_campaign: "lp-conheca-bemzao" };
const buy = (cta: string) => buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

/* easter egg: cupom de FRETE GRÁTIS */
const EGG_COUPON = "VOOLIVRE";
const EGG_URL = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?promocode=${EGG_COUPON}`;
const buyEgg = (cta: string) => buildCheckoutUrl(EGG_URL, UTM_FALLBACK, cta);

/* easter egg: Dragão que acorda → 15% off */
const DRAGON_COUPON = "DRAGAOACORDOU";
const DRAGON_URL = `https://seguro.comidadedragao.com.br/r/KQXZ5J7LWK?promocode=${DRAGON_COUPON}`;
const buyDragon = (cta: string) => buildCheckoutUrl(DRAGON_URL, UTM_FALLBACK, cta);

/* UTM em links externos (loja/IG são cross-domain) */
const withUtm = (url: string, content: string) => {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "lp-conheca");
    u.searchParams.set("utm_medium", "lp");
    u.searchParams.set("utm_campaign", "lp-conheca");
    u.searchParams.set("utm_content", content);
    return u.href;
  } catch { return url; }
};

const ICON = "/assets/pixel-icons";
const PACK = "/assets/images/produtos/kit-caes.png";
const PETS = ["pet1.jpg", "pet2.jpg", "pet3.jpg", "pet4.jpg"];

type DeskItem = { img: string; label: string; href?: string; ext?: boolean; egg?: boolean; big?: boolean };
/* mesmo conjunto das 3 LPs (esquerda, 2 colunas) */
const DESK: DeskItem[] = [
  { img: "bsf.png", label: "LARVA.BSF", href: "/ciencia" },
  { img: "original-real.png", label: "ORIGINAL", href: "/original" },
  { img: "paw2.png", label: "MATILHA", href: "/quero-ser-dragao" },
  { img: "dog.png", label: "MEU-PET", href: "https://www.comidadedragao.com.br/blogs/news", ext: true },
  { img: "stomach.png", label: "88.9%", href: "/assets/pdfs/artigos-cientificos/bsf-in-vivo-vitro-digestibility-dog-food.pdf", ext: true },
  { img: "shield.png", label: "ALERGIA", href: "/alergia" },
  { img: "earth.png", label: "PLANETA", href: "https://www.comidadedragao.com.br/blogs/news", ext: true },
  { img: "crown.png", label: "PRODUTOS", href: "/produtos" },
  { img: "trash.png", label: "LIXEIRA", egg: true },
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

const DeskCol = ({ items, side, onEgg }: { items: DeskItem[]; side: "left" | "right"; onEgg: () => void }) => (
  <div className={`qsd8-desk-icons ${side}`}>
    {items.map((it, i) => {
      const cls = `qsd8-icon${it.big ? " big" : ""}`;
      const inner = <><img src={`${ICON}/${it.img}`} alt="" /><span>{it.label}</span></>;
      if (it.egg) return <button type="button" className={`${cls} egg`} key={i} onClick={onEgg} title="???">{inner}</button>;
      if (it.ext) return <a className={cls} key={i} href={withUtm(it.href!, `icon-${it.label.toLowerCase()}`)} target="_blank" rel="noopener noreferrer">{inner}</a>;
      if (it.href?.startsWith("#")) return <a className={cls} key={i} href={it.href}>{inner}</a>;
      return <Link className={cls} key={i} to={it.href!}>{inner}</Link>;
    })}
  </div>
);

const ProgressBar = ({ total = 16 }: { total?: number }) => (
  <div className="qsd8-prog" aria-hidden="true">
    {Array.from({ length: total }).map((_, i) => <i key={i} />)}
  </div>
);

const PDF_DIGEST = "/assets/pdfs/artigos-cientificos/bsf-in-vivo-vitro-digestibility-dog-food.pdf";
const WHY = [
  { img: "shield.png", title: "Pro pet alérgico", desc: "Proteína inédita que o corpo nunca viu — a queridinha de quem tem alergia ou pet atópico. 100% hipoalergênico, 1 ingrediente só.", href: "/alergia" },
  { img: "stomach.png", title: "88,9% digestível", desc: "Estudos indicam digestibilidade altíssima: o corpo absorve quase tudo. Mais nutrição, menos cocô.", href: PDF_DIGEST, ext: true },
  { img: "star8.png", title: "Pele e pelo", desc: "Rica em ácido láurico e ômegas 6 e 9. Estudos associam a pelo brilhante e pele saudável.", href: "/ciencia" },
  { img: "earth.png", title: "Bom pro planeta", desc: "Sustentável e natural — uma proteína que resolve um problema real: 83% menos carbono e 142× menos terra que o boi.", href: "https://www.comidadedragao.com.br/blogs/news", ext: true },
];

/* reviews REAIS (export Judge.me — nome + cidade) */
const REVIEWS = [
  { t: "Meu cachorro amou! E olha que ele costuma ser enjoado com petiscos. Está super aprovado!", by: "Mirian, São João del Rei-MG" },
  { t: "Meu dragãozinho é do tipo felino e amou as larvas.", by: "Lucila, Mogi das Cruzes-SP" },
  { t: "Chegou super rápido e meu chihuahua amou! Principalmente as larvinhas.", by: "Tayná, São Paulo-SP" },
  { t: "As cachorrinhas ficaram simplesmente loucas, não podem nem sentir o cheiro da embalagem :)", by: "Ana Beatriz, Rio de Janeiro-RJ" },
  { t: "Fredinho adorou. Come as larvas como se fossem petiscos 👏", by: "Cristiane, Campinas-SP" },
  { t: "Meus cães amaram! Estão viciados rsrs", by: "Fernanda, Rio de Janeiro-RJ" },
];

const FICHA = [
  "No kit: o Original (petisco de larva, 90g) + o Suplemento Integral (180g)",
  "🚚 Frete grátis no Kit — pra todo o Brasil, por nossa conta",
  "No mínimo 40% de proteína · 88,9% de digestibilidade",
  "Hipoalergênico — pra pet sensível ou alérgico",
  "Ácido láurico + ômegas 6 e 9 — pele e pelo",
  "1 ingrediente no petisco: 100% larva de BSF desidratada",
];

const FAQ = [
  { num: "01", title: "É seguro?", desc: "Faz bem, não mal. Biofábrica registrada no MAPA, tudo rastreável. Lá fora já virou tendência." },
  { num: "02", title: "Meu vet não conhece", desc: "Tem estudo peer-reviewed desde 2015. Mostra pro seu vet — a gente adora essa conversa." },
  { num: "03", title: "E se ele não comer?", desc: "Na maioria das vezes o bloqueio é do tutor 😅. Mistura na ração e deixa ele decidir. Garantia da matilha: 14 dias." },
  { num: "04", title: "É caro?", desc: "É investimento: mín. 40% de proteína e 88,9% de digestibilidade num ingrediente só. E a estreia tem 10% off." },
];

const Conheca = () => {
  const [egg, setEgg] = useState(false);
  const [dragonAwake, setDragonAwake] = useState(false);
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
        title="Conheça a Comida de Dragão — feito de inseto, o melhor pro seu pet"
        description="Kit para Cães: o petisco de larva BSF (Original) + o Suplemento Integral. Hipoalergênico, 40% de proteína, 88,9% de digestibilidade. Frete grátis, 10% off na estreia."
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
      <DeskCol items={DESK} side="left" onEgg={() => setEgg(true)} />

      {egg && (
        <div className="cf-egg-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEgg(false); }}>
          <section className="qsd8-win cf-egg" style={{ position: "relative" }}>
            <div className="qsd8-titlebar">
              <span className="qsd8-tb-name">PRESENTE.EXE</span>
              <span className="qsd8-tb-stripes" aria-hidden="true" />
              <span className="qsd8-tb-x" aria-hidden="true">×</span>
            </div>
            <button className="cf-egg-close" onClick={() => setEgg(false)} aria-label="Fechar">×</button>
            <div className="qsd8-win-body">
              <img src={`${ICON}/gift.png`} alt="" style={{ width: 84, margin: "0 auto 12px", display: "block", imageRendering: "pixelated" }} />
              <h3>🗑️ VOCÊ VIU OURO NO LIXO</h3>
              <p>É literalmente o que a gente faz: transforma resíduo orgânico em proteína de alta qualidade pro seu pet. Olho de Dragão, o seu 🐉. Toma um presente — <strong>frete grátis</strong> na estreia:</p>
              <div className="cf-egg-code">{EGG_COUPON}</div>
              <a href={buyEgg("easteregg")} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero aproveitar →</a>
            </div>
          </section>
        </div>
      )}

      {dragonAwake && (
        <div className="cf-egg-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDragonAwake(false); }}>
          <section className="qsd8-win cf-egg" style={{ position: "relative" }}>
            <div className="qsd8-titlebar">
              <span className="qsd8-tb-name">DRAGAO.EXE</span>
              <span className="qsd8-tb-stripes" aria-hidden="true" />
              <span className="qsd8-tb-x" aria-hidden="true">×</span>
            </div>
            <button className="cf-egg-close" onClick={() => setDragonAwake(false)} aria-label="Fechar">×</button>
            <div className="qsd8-win-body">
              <img src={`${ICON}/dragon.png`} alt="" style={{ width: 84, margin: "0 auto 12px", display: "block", imageRendering: "pixelated" }} />
              <h3>🐉 VOCÊ ACORDOU O DRAGÃO</h3>
              <p>“Curioso, né? Gostei de você.” Ele acordou de bom humor e deixou <strong>15% de desconto</strong> na sua estreia:</p>
              <div className="cf-egg-code">{DRAGON_COUPON}</div>
              <a href={buyDragon("dragao-acorda")} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero aproveitar →</a>
            </div>
          </section>
        </div>
      )}

      {/* sticky mobile — aparece só depois de rolar */}
      <div className={`cf-sticky${showSticky ? " show" : ""}`}>
        <div className="cf-sticky-info"><strong>R$ 130,50</strong><span>com {COUPON} · 10% off · 🚚 frete grátis</span></div>
        <a href={buy("sticky")} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero →</a>
      </div>

      <div className="qsd8-wrap">
        {/* ══ HERO — PROVOCA ════════════════════════════════════════ */}
        <Win name="BOAS-VINDAS.EXE" mac className="qsd8-hero-win">
          <div className="cf-hero2 cf-hero-main">
            <div className="cf-hero-copy">
              <h1 className="qsd8-title">Alimento pra <span>pet</span> diferentão e <span>nutritivo</span>.</h1>
              <p className="qsd8-sub">
                No mínimo 40% de proteína, 88,9% de digestibilidade, hipoalergênico e 1 ingrediente
                só — nutrição de verdade pra pet alérgico ou sensível. Estranho? Só no começo.
              </p>
            </div>
            <div className="cf-hero-pack">
              <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
                <span className="cf-tag t1" style={{ position: "absolute", top: 8, right: -4, zIndex: 3, whiteSpace: "nowrap" }}>🚚 Kit com frete grátis</span>
                <img src={PACK} alt="Kit Comida de Dragão para Cães — Original + Suplemento Integral" />
              </div>
              <div className="cf-offer-price" style={{ marginTop: 10, marginBottom: 0 }}>R$ 145,00</div>
              <div style={{ fontSize: 13, fontWeight: 700, opacity: .75, marginTop: 2 }}>🚚 Frete grátis no Kit · 4× sem juros</div>
            </div>
            <div className="cf-hero-cta qsd8-btnrow">
              <a href={buy("hero")} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero experimentar</a>
              <a href="#porque" className="qsd8-btn ghost">Por quê?</a>
            </div>
          </div>
        </Win>

        {/* ══ VIRA — POR QUE É MELHOR ═══════════════════════════════ */}
        <span id="porque" />
        <Win name="SCAN: LARVA.BSF">
          <h2 className="qsd8-h2">Por que faz <span>bemzão</span> pro seu pet?</h2>
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
              <button type="button" className="cf-dragon cf-dragon-over" onClick={() => setDragonAwake(true)} aria-label="cutuca o Dragão">
                <img src={`${ICON}/dragon.png`} alt="" />
              </button>
            </div>
            <div>
              <h2 className="qsd8-h2">É larva. <span>Pronto, falei.</span></h2>
              <p className="qsd8-sub">
                9 em 10 pessoas se surpreendem no começo — e é aí que a ficha cai: a larva de BSF é
                uma das proteínas mais completas e inteligentes que a natureza inventou. O seu pet?
                Já sabia disso desde sempre. O que parecia estranho vira o melhor do pote.
              </p>
            </div>
          </div>
        </Win>

        {/* ══ FICHA ═════════════════════════════════════════════════ */}
        <Win name="ARQUIVO: KIT.CAES">
          <h2 className="qsd8-h2">O <span>Kit para Cães</span>, sem susto</h2>
          <p className="qsd8-sub" style={{ maxWidth: 620 }}>O petisco de larva (Original, 90g) + o Suplemento Integral (180g), numa caixa só. E o frete do Kit é por nossa conta — pra todo o Brasil.</p>
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

        {/* ══ AGE — OFERTA ══════════════════════════════════════════ */}
        <span id="oferta" />
        <Win name="DOWNLOADING: SEU-1o-KIT.EXE" className="qsd8-cta-win">
          <div className="cf-hero2">
            <div className="cf-hero-pack">
              <img src={PACK} alt="Kit Comida de Dragão para Cães — Original + Suplemento Integral" />
            </div>
            <div style={{ textAlign: "left" }}>
              <h2 className="qsd8-cta-title" style={{ textAlign: "left" }}>Bora fazer <span>bemzão?</span></h2>
              <p className="qsd8-cta-sub" style={{ margin: "0 0 4px" }}>O kit que faz bem duas vezes: pro seu pet e pro planeta. Petisco de larva + Suplemento Integral, numa caixa só. Frete grátis, 10% off na estreia.</p>
              <div className="cf-offer-price">R$ 130,50 <s>R$ 145,00</s></div>
              <p className="qsd8-cta-sub" style={{ margin: "0 0 16px" }}>com o cupom <strong>{COUPON}</strong> · 🚚 frete grátis · 4× sem juros · aplica sozinho no checkout</p>
              <a href={buy("oferta")} target="_blank" rel="noopener noreferrer" className="qsd8-btn">Quero meu {COUPON} →</a>
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

export default Conheca;
