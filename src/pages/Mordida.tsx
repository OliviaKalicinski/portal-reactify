import { useEffect, useRef, useState } from "react";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Mordida.css";

/* ──────────────────────────────────────────────────────────────
   LP DE LANÇAMENTO — MORDIDA V2 · /mordida
   Página satélite · tráfego pago/orgânico · público FRIO
   Objetivo: VENDA. Em 27/07/26 a lista de espera saiu e a oferta entrou
   no lugar dela — o form de captura e o popup foram removidos.

   OFERTA (virada em 28/07 a pedido da Olivia): a Mordida de Dragão sozinha,
   R$42,20. O destino é a PÁGINA DO PRODUTO na loja (não o checkout
   Yampi direto, como fazem /alergia e /idoso) — foi o pedido dela.

   Direção (validada com a Olivia, 20/07):
   - Cold-first: hero entra pelo PRODUTO, não pelo mistério.
   - Ancorada na VOZ DOS CLIENTES (reviews reais, verbatim) — palatabilidade
     + cético convertido + natural/sustentável.
   - CLAIM DE HIPOALERGÊNICO (regra fina, validada com a Olivia 20/07):
     pode-se dizer que a PROTEÍNA (a de inseto/BSF) é hipoalergênica; NÃO se
     pode chamar o PRODUTO de hipoalergênico — a Mordida V2 tem OVO (alérgeno).
     Sempre "proteína ... hipoalergênica", nunca um selo solto "hipoalergênico".
   - Números batem com a ficha oficial V2.2: 24% proteína · 43g/pacote.
   - Molde verde /alergia (prefixo mdp-). Prova social em TEXTO (Índice de
     Qualidade do Google não conta imagem).
   - "100% natural" evitado de propósito (trava de claims 09/07) → "natural
     de verdade". Se Diego/Marcelle liberarem, é só trocar.
────────────────────────────────────────────────────────────── */

/* "Para cães" e "Lançamento" NÃO estão aqui: a Olivia pediu em 30/07 que
   fossem tags SOBRE A FOTO (ver SELOS_FOTO). Ficam lá e só lá — repetir os
   dois logo abaixo, na fileira de chips, seria dizer a mesma coisa duas vezes
   em 200px de distância. */
const CHIPS = [
  "Sem grãos",
  "Sem glúten",
  "Proteína de inseto",
  "Proteína hipoalergênica", // claim atribuído à PROTEÍNA, nunca ao produto (tem ovo)
];

/* Selos sobre a foto do pack (pedido da Olivia, 30/07): PRA QUEM é e que é
   novidade. Ficam na imagem, não na fileira de chips — quem bate o olho na
   foto lê os dois antes de ler qualquer atributo técnico. */
const SELOS_FOTO = ["Para cães", "Lançamento"];

/* Faixa passante de lançamento (marquee no topo). Mesmo idioma do MarqueeBar
   de /parceiros e /quero-ser-dragao: itens duplicados + scroll translateX(-50%).
   Voz: hook do briefing ("a Mordida evoluiu: sem grão, mais proteína") + teaser. */
const MARQUEE = [
  "A Mordida evoluiu",
  "Sem grão · mais proteína",
  "Lançamento · Mordida nova",
  "A gente aprontou uma",
];

/* ── OFERTA ────────────────────────────────────────────────────
   Mordida de Dragão p/ Cães. Preço e disponibilidade conferidos na loja
   em 28/07/26 (produto ACTIVE, SKU 203, R$42,20).
   Se o preço mudar na Shopify, ele muda aqui — não há sincronia.

   Destino = link de carrinho da Yampi (produto já no carrinho). As UTMs
   seguem a convenção das outras LPs (lp-<nome> / lp / lp-<nome>-<oferta>),
   e buildCheckoutUrl repassa fielmente a UTM de ENTRADA quando o anúncio
   trouxe uma — o fallback abaixo só vale pra quem chegou sem UTM nenhuma. */
/* ⚠️ CORREÇÃO 05/08/26: o destino era a PÁGINA DE PRODUTO da Shopify
   (/products/mordida-de-dragao). Era a única LP das 13 assim — todas as
   outras vão direto pro /r/<TOKEN> da Yampi. Isso punha dois passos a mais
   no funil (produto → carrinho → checkout) e contraria a regra escrita no
   _AGENTE.md: "link de compra = link de carrinho da Yampi, não link de
   página de produto". Tokens conferidos em links-checkout-yampi-tokens.md
   (lidos na Yampi em 28/07): Mordida SKU 203 = AK5VFR5RLO. */
/* ⚠️ VIRADA 28/07/26 (pedido da Olivia): a LP do Mordida passa a vender o
   MORDIDA, não o kit. "Coloque o valor do mordida e tudo será voltado para
   o mordida apenas."
   Mordida de Dragão p/ Cães · handle mordida-de-dragao · SKU 203 · R$42,20
   · ACTIVE (verificado na Shopify em 28/07).
   ⚠️ CONSEQUÊNCIA CRÍTICA: a Mordida sozinha NÃO TEM a tag `frete-gratis` e
   custa R$42,20, muito abaixo do piso de R$150. TODA promessa de frete
   grátis saiu da página — ela existia porque o produto era o kit (SKU 1305,
   que tem a tag). Prometer frete aqui seria mentira no checkout. */
const PRODUCT_URL = "https://seguro.comidadedragao.com.br/r/AK5VFR5RLO";
const PRICE = "42,20"; // Shopify, verificado 28/07/26 — SKU 203

/* (comentário de 27/07/26, quando o kit era o principal) O kit era o CTA porque a
   margem bruta dele é ~3,6x a da Mordida sozinha (R$124,50 vs R$34,70) — é o
   que sustenta CPA em canal pago. Mas a página argumenta o PETISCO, e até aqui
   não existia nenhum caminho pra comprá-lo: quem chegava querendo a Mordida de
   R$42,20 só tinha "pagar R$145" ou sair. Este link recupera essa intenção.
   UTM na mesma convenção, com cta_pos=avulso, pra dar pra medir a divisão. */
/* Saída secundária INVERTIDA em 28/07: antes era "só quero a Mordida"
   (escape do kit de R$145). Agora que a Mordida é o principal, o link
   secundário vira UPSELL do kit — que é onde mora o frete grátis e a
   margem maior. Quem quiser só o petisco já está no lugar certo. */
/* Kit Mordida + Suplemento · SKU 1305 · R$145,00 · token ZWOQZDQBW1
   (links-checkout-yampi-tokens.md, lido na Yampi em 28/07). É o kit que
   TEM a tag frete-gratis — por isso o upsell continua fazendo sentido. */
const PRODUCT_URL_KIT = "https://seguro.comidadedragao.com.br/r/ZWOQZDQBW1";
const PRICE_KIT = "145,00";

const UTM_FALLBACK = {
  utm_source: "lp-mordida",
  utm_medium: "lp",
  utm_campaign: "lp-mordida-mordida",
};

const ctaUrl = (
  cta: "hero" | "beneficios" | "reviews" | "oferta" | "banner" | "sticky" | "final" | "kit"
) => buildCheckoutUrl(PRODUCT_URL, UTM_FALLBACK, cta);

const kitUrl = () =>
  buildCheckoutUrl(
    PRODUCT_URL_KIT,
    { ...UTM_FALLBACK, utm_campaign: "lp-mordida-upsell-kit" },
    "kit"
  );

/* Reviews REAIS, transcritos exatamente como o cliente escreveu (gírias e
   erros preservados = a prova de que é gente). Fonte: Catálogo de Argumentos
   - Vozes dos Clientes / Melhores Argumentos por Dor (Reviews). */
const REVIEWS = [
  {
    quote: "O PETISCO QUE LEVA MEUS CÃES A LOUCURA E O MELHOR SEEEEEM DAR DOR DE BARRIGA! EU AMEI!",
    who: "@patascubo",
  },
  {
    quote: "Ela simplesmente viciou nas larvinhas.. fica me olhando qdo não coloco na comida 🤣 Cliente e afiliada fiel já",
    who: "Arya",
  },
  {
    quote: "Pedi amostra grátis pra testar. Tenho 7 cães, TODOS AMARAM!!!! Volto agora pro site e, podem ter certeza, terão uma cliente fiel!",
    who: "@gisa_valverde",
  },
  {
    quote: "Confesso que não estava acreditando não, que era só mkt mesmo. Mas a Kate amou os petiscos, ficava enlouquecida cada vez q eu pegava o pacote…",
    who: "cliente verificado · Judge.me · 5★",
  },
];

const BENEFICIOS = [
  {
    stat: "88,9%",
    statLbl: "digestível",
    title: "Proteína de inseto hipoalergênica",
    desc: "Uma proteína que o corpo dele <strong>absorve de verdade</strong> — leve e diferente de tudo.",
  },
  {
    stat: "24%",
    statLbl: "proteína",
    title: "43g por pacote",
    desc: "Parrudo pro tamanho — e <strong>mais forte que a versão antiga</strong>.",
  },
  {
    stat: "ZERO",
    statLbl: "grão · glúten",
    title: "Leve pro intestino",
    desc: "Saiu o trigo, saiu a aveia. Ficou fácil de digerir.",
  },
  {
    stat: "NATURAL",
    statLbl: "de verdade",
    title: "Comida, não química",
    desc: "Você reconhece cada ingrediente que vai pro pacote.",
  },
  {
    stat: "NOVA",
    statLbl: "proteína",
    title: "Diferente de tudo",
    desc: "Uma proteína que ele nunca provou — pro cão que precisa de algo <strong>diferente</strong>.",
  },
];

/* FAQ — entrou em 28/07 na paridade de venda com as LPs de dor, que
   todas têm bloco de objeção e esta não tinha nenhum.
   ⚠️ CLAIM: o produto NÃO é hipoalergênico — a MORDIDA LEVA OVO. Só a
   proteína de inseto é hipoalergênica. A pergunta sobre alergia é a mais
   importante da lista justamente por isso, e responde com a ressalva na
   frente. Mesma regra que reescreveu os RSAs de Alergia e Gato em 13/07. */
const FAQ = [
  {
    q: "O que vem no pacote?",
    a: `Um pacote de <strong>Mordida de Dragão de 180g</strong> por R$ ${PRICE}. Se quiser levar junto o <strong>Suplemento Integral</strong> — o que mistura na ração todo dia —, o kit com os dois sai por R$ ${PRICE_KIT} e vai com <strong>frete grátis</strong>; o link está embaixo da oferta.`,
  },
  {
    q: "Meu cão tem alergia. Pode dar?",
    a: "Atenção aqui: <strong>a Mordida leva ovo</strong>. Quem é <strong>hipoalergênica é a proteína de inseto</strong>, não o produto inteiro. Se o seu cão tem alergia diagnosticada, confira a lista de ingredientes com o veterinário antes — e, se a restrição for a ovo, esse não é o produto certo pra ele.",
  },
  {
    q: "O que mudou da versão antiga pra essa?",
    a: "Subiu pra <strong>24% de proteína</strong> e saíram o trigo e a aveia — agora é <strong>sem grão e sem glúten</strong>. Ficou mais parruda e mais leve pro intestino ao mesmo tempo.",
  },
  {
    q: "Isso substitui a ração dele?",
    a: "Não. É <strong>petisco</strong>: entra como agrado ou recompensa, somando à alimentação que ele já tem. Não troca a ração nem substitui o acompanhamento do veterinário.",
  },
  {
    q: "E se ele não gostar?",
    a: "<strong>A gente devolve seu dinheiro em 14 dias.</strong> Sem letrinha miúda. É o mesmo acordo de todos os nossos produtos.",
  },
  {
    q: "Como funciona a entrega?",
    a: "Despachamos em até 1 dia útil pra todo o Brasil. O frete aparece no checkout — e é <strong>por nossa conta acima de R$ 150</strong>. A compra é 100% segura: cartão, Pix ou boleto.",
  },
];

const Mordida = () => {
  useEffect(() => { captureEntryUtms(); }, []);

  /* O sticky só entra depois que o CTA da hero sai da tela. Enquanto o botão
     principal está à vista, a barra seria redundante e ainda comeria tela na
     dobra. (Até 27/07 a referência era o banner do topo; ele saiu, e o CTA da
     hero passou a ser a régua.) */
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const [stickyVisivel, setStickyVisivel] = useState(false);

  useEffect(() => {
    const alvo = heroCtaRef.current;
    if (!alvo) return;

    // Sem IntersectionObserver (browser antigo), mostra sempre — melhor a
    // barra aparecer cedo demais do que o CTA nunca aparecer.
    if (typeof IntersectionObserver === "undefined") {
      setStickyVisivel(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisivel(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="mordida-lp">
      <PageMeta
        title="Novo Mordida de Dragão — snack natural de verdade | Comida de Dragão"
        description="O novo Mordida de Dragão chegou: petisco natural com 24% de proteína de inseto, sem grão e sem glúten. 180g por R$ 42,20, com garantia de 14 dias."
      />

      {/* ════ FAIXA PASSANTE DE LANÇAMENTO ════
          Decorativa: a mesma informação já vive no eyebrow + sub + chips da
          hero, então aria-hidden evita o leitor de tela repetir o loop. */}

      {/* O banner do topo saiu em 27/07/26 (decisão da Olivia): a página abre
          direto na hero. Os arquivos seguem em assets/images/mordida/ — a arte
          continua servindo pra anúncio. */}

      {/* ════ HERO ════ */}
      <section className="mdp-hero">
        <div className="mdp-hero-inner">
          {/* 17/08 — topo igual ao da /original: backlink a esquerda,
              logo a direita, na mesma linha. */}
          <div className="mdp-hero-top">
            <Link to="/portal" className="mdp-backlink">← comida de dragão</Link>
            <DragonLogo className="mdp-hero-logo" />
          </div>

          {/* Desktop = 2 colunas: título+texto à esquerda, foto grande + botão à direita.
              Mobile = empilha na mesma ordem (esquerda depois direita). */}
          {/* Dobra vertical e limpa: logo → título → texto → BOTÃO → imagem grande → selos.
              Sem badge de pré-lançamento (duplicava a faixa do topo). Botão ANTES da imagem
              pra ficar acima da dobra — a imagem (tamanho de tela) vem logo depois. */}
          {/* Desktop = 2 colunas (texto+CTA à esquerda, foto do produto à direita)
              pra não deixar o conteúdo numa ilha estreita na tela larga.
              Mobile = empilha; a foto some (o BANNER do topo já é o visual). */}
          {/* Três blocos irmãos, e não texto+foto: a Olivia pediu em 28/07 que a
              FOTO DO PACK viesse ANTES dos selos (sem grão / sem glúten / …).
              No mobile o grid empilha na ordem do DOM — texto, foto, oferta —
              que é exatamente o que ela pediu. No desktop o grid recoloca:
              texto e oferta empilhados na coluna 1, a foto ocupando a coluna 2
              inteira. Por isso a foto é irmã dos outros dois, e não filha. */}
          <div className="mdp-hero-grid">
            <div className="mdp-hero-text">

              {/* 17/08 — estrutura igual a da /original a pedido da Olivia:
                  sobrancelha -> titulo -> texto. "Novo Mordida de Dragao" virou
                  sobrancelha; o titulo principal e "Snack natural de verdade",
                  com o efeito off-register (sombra lima) do .olp-hero-title span. */}
              <span className="mdp-hero-eyebrow">novo mordida de dragão</span>

              <h1 className="mdp-hero-title">
                <span>snack natural de verdade</span>
              </h1>

              <p className="mdp-hero-sub">
                Milhares de cães já viraram fãs da gente — e foram eles que pediram essa versão:
                <strong> 24% de proteína de inseto</strong> (hipoalergênica), <strong>sem grão e
                sem glúten</strong>, que faz um benzão pra saúde.
              </p>
            </div>

            {/* Foto real do produto. Passou a aparecer no mobile também em
                27/07: antes ficava escondida porque o banner do topo já era o
                visual — sem ele, o mobile abriria sem imagem nenhuma. */}
            <div className="mdp-hero-visual">
              {/* o frame existe pra ancorar os selos NA IMAGEM. Sem ele, o
                  absolute se prende ao container full-width e os selos vão
                  parar na borda da tela, longe do pack. */}
              <div className="mdp-hero-visual-frame">
                <img
                  className="mdp-hero-prod"
                  src="/assets/images/produtos/mordida-v2-frente.webp"
                  alt="Mordida V2 — embalagem"
                  loading="eager"
                  decoding="async"
                />
                <div className="mdp-hero-selos">
                  {SELOS_FOTO.map((s, i) => (
                    <span className={`mdp-selo${i === 1 ? " mdp-selo-novo" : ""}`} key={i}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mdp-hero-oferta">
              <div className="mdp-hero-chips">
                {CHIPS.map((c, i) => <span className="mdp-chip" key={i}>{c}</span>)}
              </div>

              {/* PREÇO NA DOBRA — o buraco mais caro da página antes de 28/07:
                  as 3 LPs de dor entregam o preço na primeira tela e esta
                  fazia a pessoa rolar até o fim pra descobrir quanto custa. */}
              <div className="mdp-hero-price">
                <span className="mdp-hero-price-from">Mordida de Dragão · 180g</span>
                <span className="mdp-hero-price-now"><small>R$</small>{PRICE}</span>
                {/* 17/08 — sem promessa de frete: _LANDING-PAGES.md diz que Mordida e Dupla
                    tiraram isso de proposito (produto abaixo do piso; prometer aqui
                    seria mentira no checkout). */}
                <span className="mdp-hero-price-note">à vista · 4× sem juros</span>
              </div>

              <div className="mdp-hero-vantagem">
                💚 Garantia de 14 dias · não topou, a gente devolve
              </div>

              <div className="mdp-hero-cta-wrap" ref={heroCtaRef}>
                <a href={ctaUrl("hero")} className="mdp-btn-primary" data-cta="hero">
                  Quero a Mordida nova
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ POR QUE É BOM DEMAIS ════ (vem ANTES da prova: o frio precisa da substância cedo) */}
      <section className="mdp-section">
        <div className="mdp-section-inner">
          <span className="mdp-tag">o petisco</span>
          <h2 className="mdp-section-title">
            Por que ele é<br /><span>bom demais?</span>
          </h2>

          <div className="mdp-beneficios">
            {BENEFICIOS.map((b, i) => (
              <div className="mdp-beneficio" key={i}>
                <div className="mdp-beneficio-stat">
                  {b.stat}{b.statLbl && <small style={{ fontSize: 14, opacity: 0.6, marginLeft: 6 }}>{b.statLbl}</small>}
                </div>
                <div className="mdp-beneficio-title">{b.title}</div>
                <div className="mdp-beneficio-desc" dangerouslySetInnerHTML={{ __html: b.desc }} />
              </div>
            ))}
          </div>

          {/* CTA de seção (só desktop → botão a cada etapa pro retardatário) */}
          <div className="mdp-section-cta">
            <a href={ctaUrl("beneficios")} className="mdp-btn-primary" data-cta="secao-beneficios">
              Quero a Mordida nova
            </a>
          </div>
        </div>
      </section>

      {/* ════ V1 → V2: o que mudou (falando com quem já é cliente) ════ */}
      <section className="mdp-section mdp-sec-verde">
        <div className="mdp-section-inner">
          <span className="mdp-tag">a mordida evoluiu</span>
          <h2 className="mdp-section-title">
            O que mudou<br /><span>da antiga pra essa.</span>
          </h2>
          <p className="mdp-section-lead">
            Quem já é de casa merece saber: a gente não mexeu por mexer. Ouvimos cada mensagem
            e refizemos a Mordida do zero. O que melhorou:
          </p>

          <div className="mdp-evolui">
            <div className="mdp-evolui-row">
              <span className="mdp-evolui-de">Com trigo e aveia</span>
              <span className="mdp-evolui-seta">→</span>
              <span className="mdp-evolui-pra">
                <strong>Sem grão, sem glúten</strong> — mandioca e batata-doce no lugar. Mais leve pro intestino.
              </span>
            </div>
            <div className="mdp-evolui-row">
              <span className="mdp-evolui-de">Menos proteína</span>
              <span className="mdp-evolui-seta">→</span>
              <span className="mdp-evolui-pra">
                <strong>43g de proteína</strong> (24%) por pacote. Bem mais parruda que a anterior.
              </span>
            </div>
            <div className="mdp-evolui-row">
              <span className="mdp-evolui-de">Conservante artificial</span>
              <span className="mdp-evolui-seta">→</span>
              <span className="mdp-evolui-pra">
                <strong>Alecrim natural</strong> pra conservar + <strong>inulina</strong> (fibra prebiótica) que faz bem por dentro.
              </span>
            </div>
          </div>

          <p className="mdp-evolui-fecho">
            Mesma larvinha que seu cão ama. Só que <strong>a melhor versão dela.</strong> 🐉
          </p>
        </div>
      </section>

      {/* ════ PROVA — nível MARCA (é lançamento: ninguém provou ESTE ainda) ════ */}
      <section className="mdp-section">
        <div className="mdp-section-inner">
          <span className="mdp-tag">quem já é de casa</span>
          <h2 className="mdp-section-title">
            Veja o que já falam<br /><span>da Comida de Dragão.</span>
          </h2>

          <div className="mdp-reviews">
            {REVIEWS.map((r, i) => (
              <figure className="mdp-review" key={i}>
                <blockquote>"{r.quote}"</blockquote>
                <figcaption>— {r.who}</figcaption>
              </figure>
            ))}
          </div>

          <div className="mdp-section-cta">
            <a href={ctaUrl("reviews")} className="mdp-btn-primary" data-cta="secao-reviews">
              Quero a Mordida nova
            </a>
          </div>
        </div>
      </section>

      {/* ════ PRA QUEM TEM CORAGEM ════ */}

      {/* ════ A GENTE OUVIU (wink pra base) ════ */}

      {/* ════ OFERTA ════
          Substituiu o form de lista de espera em 27/07/26. Os benefícios
          vêm dos mesmos fatos da ficha usados no resto da página — nada
          novo foi afirmado aqui. */}
      <section className="mdp-oferta" id="oferta">
        <div className="mdp-oferta-inner">
          <span className="mdp-tag tag-lime">lançamento · 180g</span>
          <h2 className="mdp-section-title title-lime" style={{ textAlign: "center", marginTop: 12 }}>
            Chegou a Mordida nova.<br /><span>R$ {PRICE} o pacote.</span>
          </h2>

          <p className="mdp-oferta-sub">
            A Mordida foi <strong>refeita do zero</strong>: sem grão, sem glúten,
            <strong> 24% de proteína</strong> de inseto — e o corpo dele aproveita
            <strong> 88,9%</strong> dela. É o petisco que você dá sem ficar
            pensando no que tem dentro.
          </p>

          {/* Foto do que chega na casa da pessoa. Trocada em 28/07: era a do
              kit, porque o kit era o produto vendido. Agora que a página vende
              a Mordida sozinha, a foto tem que ser a dela. */}
          <img
            className="mdp-oferta-img"
            src="/assets/images/produtos/mordida-v2-frente.webp"
            alt="Pacote da Mordida de Dragão de 180g"
            loading="lazy"
            decoding="async"
          />

          <ul className="mdp-oferta-itens">
            <li><strong>Mordida de Dragão · 180g</strong> — <strong>a nova</strong>: sem grão, sem glúten, 24% de proteína</li>
            <li><strong>Proteína de inseto</strong> — 88,9% de aproveitamento pelo organismo do cão</li>
            <li><strong>Garantia de 14 dias</strong> — não topou, a gente devolve</li>
          </ul>

          <div className="mdp-oferta-preco">
            <span className="mdp-oferta-preco-valor">R$ {PRICE}</span>
            <span className="mdp-oferta-preco-nota">à vista · 180g</span>
          </div>

          {/* 18/08 — box do cupom do afiliado, o mesmo padrao da /original.
              A /mordida nao tem cupom embutido no link: o desconto e o do
              AFILIADO, que a pessoa digita no checkout. A pagina so avisa
              que ele existe (_LANDING-PAGES.md, coluna "Cupom no link"). */}
          <div className="mdp-oferta-coupon-box">
            <div className="mdp-oferta-coupon-label">tem cupom de afiliado?</div>
            <div className="mdp-oferta-coupon-desc">Mordida por R$ {PRICE} · conhece um afiliado? usa o cupom dele no checkout</div>
          </div>

          <a href={ctaUrl("oferta")} className="mdp-btn-primary" data-cta="oferta">
            Quero a Mordida nova
          </a>

          {/* Upsell secundário (invertido em 28/07): quem quer mais que o
              petisco vai pro kit, onde mora o frete grátis. */}
          <p className="mdp-oferta-avulso">
            <a href={kitUrl()} data-cta="kit">
              Levar junto o Suplemento — kit por R$ {PRICE_KIT}, com frete grátis
            </a>
          </p>

          {/* O aviso de alérgeno ("contém ovo") saiu daqui em 27/07/26 a pedido
              da Olivia. Fica no rótulo físico e na ficha técnica. Se algum dia
              voltar a um texto de venda, a regra do claim continua a mesma: a
              PROTEÍNA é hipoalergênica, o PRODUTO não. */}
        </div>
      </section>

      {/* ════ FAQ + GARANTIA ════
          Paridade de venda com as LPs de dor (28/07). Elas todas têm um
          bloco de objeção + garantia antes do fechamento; esta não tinha
          nenhum dos dois. Usa .mdp-sec-verde pra sair no chartreuse em vez
          do magenta — direção "verde" pedida pela Olivia. */}
      <section className="mdp-section mdp-sec-verde">
        <div className="mdp-section-inner">
          <span className="mdp-tag">antes de comprar</span>
          <h2 className="mdp-section-title">
            Tudo o que<br /><span>importa saber.</span>
          </h2>

          <div className="mdp-faq">
            {FAQ.map((f, i) => (
              <details className="mdp-faq-item" key={i}>
                <summary className="mdp-faq-q">{f.q}</summary>
                <div className="mdp-faq-a" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>

          <div className="mdp-garantia">
            <div className="mdp-garantia-icon">💚</div>
            <div>
              <div className="mdp-garantia-title">Garantia da matilha</div>
              <div className="mdp-garantia-text">
                Se ele não topar em 14 dias da entrega, a gente devolve seu dinheiro.
                Sem letrinha miúda.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════
          As 3 LPs de dor fecham com um CTA dedicado depois do FAQ; esta
          terminava na oferta e ia direto pro rodapé. */}
      <section className="mdp-cta-final">
        <h2>Bora dar<br /><span>a Mordida nova?</span></h2>
        <p>
          24% de proteína, sem grão e sem glúten. R$ {PRICE} o pacote de 180g,
          com garantia de 14 dias.
          Não topou em 14 dias? A gente devolve.
        </p>
        <a href={ctaUrl("final")} className="mdp-btn-primary" data-cta="final">
          Quero a Mordida · R$ {PRICE}
        </a>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="mdp-footer">
        <DragonLogo className="mdp-footer-logo-svg" />
        <nav className="mdp-footer-links">
          <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
          <Link to="/produtos">Linha completa</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="mdp-footer-tagline">Nojento é o desperdício.</div>
        <div className="mdp-footer-legal">
          Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA
        </div>
      </footer>

      {/* ════ STICKY CTA (mobile) ════
          Mesmo padrão de /alergia e /idoso. Só mobile: no desktop os CTAs de
          seção já acompanham a rolagem do olho. A página ganha padding-bottom
          pra barra não cobrir o rodapé.
          Entra só depois do banner (ver o IntersectionObserver acima) —
          aria-hidden + inert enquanto escondido, pra leitor de tela e Tab
          não pegarem um botão que ninguém vê. */}
      <div
        className={`mdp-sticky-cta${stickyVisivel ? " is-visivel" : ""}`}
        aria-hidden={!stickyVisivel}
        inert={!stickyVisivel ? "" : undefined}
      >
        <div className="mdp-sticky-info">
          <span className="mdp-sticky-name">Mordida de Dragão · 180g</span>
          <span className="mdp-sticky-price">R$ {PRICE} · garantia 14 dias</span>
        </div>
        <a href={ctaUrl("sticky")} data-cta="sticky">Comprar →</a>
      </div>

      {/* SEM LeadPopup — e é de propósito. Ele já tinha sido removido daqui no
          5246c1e "quando a LP virou venda", e voltou junto com o rollout do
          popup em todas as LPs (28/07). Medido em 30/07: o tráfego que compra
          nesta página fica 78,5s lendo e converte a 13,2% (reportana/mensagem,
          38 sessões → 5 compras). O popup dispara aos 15s, no meio dessa
          leitura, pra pedir telefone de quem está prestes a gastar R$42.
          Removido de novo a pedido da Olivia em 30/07. */}
    </div>
  );
};

export default Mordida;
