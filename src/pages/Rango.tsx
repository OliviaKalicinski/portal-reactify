import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { formatPhoneBR, isValidPhoneBR } from "@/lib/phone";
import { submitLpLead } from "@/lib/lpLeads";
import { trackLead } from "@/lib/pixel";
import VideosVencedores, { VIDEOS } from "@/components/VideosVencedores";
import LeadPopup from "@/components/LeadPopup";
import "./Portal.css";
import "./Rango.css";

/* ──────────────────────────────────────────────────────────────
   RANGO DO DRAGÃO — LISTA DE ESPERA DO DROP (07/10/2026: a Olivia tirou a data; era 07/10, antes 05/10.
   A página segue chamando para a lista, sem dia marcado)

   Clonada da /webinar (28/09): mesma forma — inscrição na primeira dobra,
   data no topo, tela de "você está na lista" no lugar do formulário.
   O contato cai em `lp_leads` (dash-lets-fly), origem `espera_rango`, e é
   dessa lista que sai a pré-venda por tag do DROP (plano, Fase 5).

   NÃO VENDE NADA AINDA. Sem preço, sem cupom, sem link de checkout: o produto
   não existe na Shopify e o preço não está fechado. No dia do drop esta página
   vira a de venda (CTA → token Yampi via buildCheckoutUrl).

   COPY: só as frases aprovadas pela Olivia em 25/09
   (PROJETOS/Lançamento - Rango do Dragão/copy/2026-09-25-frases-aprovadas.md),
   sempre com a linha de apoio embaixo — "frase sozinha não se explica".

   ⚠️ NÃO ESCREVER AQUI, e o motivo:
   · "sem descongelar", "fica no armário", validade, tempo depois de aberto —
     dependem da ficha (trava de 25/09).
   · autoclavado / "sem conservante" — redação final passa pela Marcelle.
   · pele, pelo, intestino, alergia, digestão — claim de saúde, Camada B.
   · "lista curta de ingredientes" — o rótulo tem ~37 itens.
   · "hipoalergênico" — eixo é "Proteína Nova".
   · nome de concorrente.
   ────────────────────────────────────────────────────────────── */

/* 07/10 — sem data (Olivia: "vamos colocar sem data e continuar chamando gente pro pré-lançamento").
   Quando a data voltar, ela volta aqui e nos textos marcados com "sem data". */
const DROP_DATA = "sem data";

/* ══ A CHAVE DA VENDA (07/10) ══════════════════════════════════════
   Olivia, 07/10: "vamos deixar pronta a LP do rango, para amanhã ativar".
   Enquanto MODO for "espera", a página é a lista de espera de sempre.
   PARA ATIVAR A VENDA, são três trocas e um deploy:
     1. MODO = "venda"
     2. VENDA.checkoutUrl = o link do carrinho da Yampi do Rango (seguro.comidadedragao.com.br/r/<TOKEN>)
     3. a descrição do link em vite.config.ts (METAS_POR_ROTA, rota /rango): trocar "Vem aí..." pela de venda
   Sem o link do carrinho a página NÃO vira venda, mesmo com MODO = "venda" (trava abaixo).
   Preço: o da Shopify em 07/10 (produto "Rango do Dragão - Alimento Completo", SKU 501). Mudou lá, muda aqui.
   Foto (08/10): a arte do pacote que a Olivia trouxe, servida daqui em webp, como o hero da /original. */
const MODO: "espera" | "venda" = "venda";
const VENDA = {
  checkoutUrl: "https://seguro.comidadedragao.com.br/r/NZZ48AIGFF",
  preco: "30,90",
  /* 08/10 — dois preços (Olivia): o pacote e o kit "compre 6 e ganhe 1".
     Preço do kit lido no checkout da Yampi em 08/10: R$ 185,40 por 7 pacotes (6 × 30,90). */
  kitUrl: "https://seguro.comidadedragao.com.br/r/MJ9H9ZNKPG",
  kitPreco: "185,40",
  kitPorPacote: "26,49",
  /* 08/10 (auditoria mobile, A1 e M1): a foto é a mesma arte cortada na frente do pacote.
     A arte inteira mostrava uma tabela de dose diferente da do FAQ e ocupava meia tela. */
  foto: "/assets/images/rango/rango-pacote-frente.webp",
};
const VENDENDO = MODO === "venda" && VENDA.checkoutUrl.startsWith("https://seguro.comidadedragao.com.br/r/");

/** Fallback usado só quando a pessoa não trouxe utm_ de anúncio ou campanha (mesma regra das outras LPs). */
const UTM_FALLBACK = { utm_source: "lp-rango", utm_medium: "lp", utm_campaign: "lp-rango" };
type CtaPos = "hero" | "hero-kit" | "oferta" | "oferta-kit";
const ctaUrl = (cta: CtaPos) =>
  buildCheckoutUrl(cta.endsWith("-kit") ? VENDA.kitUrl : VENDA.checkoutUrl, UTM_FALLBACK, cta);

/* 08/10 — blocos que a /original tem e a /rango não tinha (Olivia: "bora").
   Só aparecem com a venda ligada. Textos sem claim de saúde (trava de 25/09). */
const CONFIANCA = ["🚚 Entrega Brasil", "🛡️ Compra segura", "💚 Garantia 14 dias"];
const PROBLEMAS = [
  { dor: "Ele cheira a ração e vira a cara", causa: "o pote amanhece do jeito que você deixou." },
  { dor: "Ele quase não bebe água", causa: "e a comida de todo dia é seca." },
  { dor: "Você quer dar comida de verdade", causa: "mas cozinhar toda semana não cabe na rotina." },
];
/* Prova social emprestada: o Rango ainda não tem vídeo de creator, então entram os
   vencedores dos outros produtos (os mesmos da /original), com o aviso em cima. */
const REELS_PROVA = [VIDEOS.sushijullie, VIDEOS.mytribesete, VIDEOS.pipo, VIDEOS.carla, VIDEOS.gabi];

const MARQUEE = [
  "RANGO DO DRAGÃO",
  ...(VENDENDO ? [] : ["VEM AÍ"]),
  "ALIMENTO COMPLETO ÚMIDO",
  "COMIDA NATURAL",
  "PROTEÍNA NOVA",
  "TEM LARVA. TEM 8%",
  ...(VENDENDO ? ["COMPRE 6, GANHE 1"] : ["LOTE LIMITADO"]),
];

/* Duas perguntas opcionais. Não são enfeite: respondem as duas decisões em
   aberto do lançamento (gamestorming 22/09) — de onde vem o público (ração ou
   outra AN) e se precisa de kit para vários cães. */
type ComeHoje = "racao" | "natural" | "mistura";
type Caes = "1" | "2" | "3+";
const COME_HOJE: { id: ComeHoje; label: string }[] = [
  { id: "racao", label: "Ração" },
  { id: "natural", label: "Alimentação natural" },
  { id: "mistura", label: "Um pouco de cada" },
];
const CAES: Caes[] = ["1", "2", "3+"];

const MarqueeBar = ({ bottom = false }: { bottom?: boolean }) => {
  const doubled = [...MARQUEE, ...MARQUEE];
  return (
    <div className={`marquee-bar${bottom ? " bottom" : ""}`} aria-hidden="true">
      <div className="marquee-track" style={bottom ? { animationDirection: "reverse" } : undefined}>
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
};

/* Frase aprovada + linha de apoio, par a par (25/09). */
const NO_POTE = [
  {
    tag: "o que tem",
    nome: "Tem larva. Tem 8%.",
    desc: "Farinha de larva de mosca soldado negra, declarada na composição. Junto dela: filé mignon suíno, batata-doce, abóbora e chuchu.",
    dado: "8%",
    dadoLabel: "de farinha de larva",
  },
  {
    tag: "o que ele sente",
    nome: "Boa para cachorro que não bebe água.",
    desc: "É alimento úmido: até 75,6% de umidade pela ficha. Ele bebe comendo.",
    dado: "75,6%",
    dadoLabel: "de umidade",
  },
];

const FAQ = [
  {
    q: "O que é o Rango do Dragão?",
    a: "Comida natural úmida e completa para cães adultos, em pouch de 500 g. Natural quer dizer ingrediente que você reconhece: filé mignon suíno, batata-doce, abóbora e chuchu. Completo quer dizer que pode ser a refeição inteira: carne, legumes, vitaminas e minerais na conta certa.",
  },
  {
    q: "Por que tem larva?",
    a: "Porque é uma proteína que quase nenhum alimento de cachorro usa — é esse o eixo do Rango. E ele não liga que é larva: o nojo é humano; o apetite dele é que decide.",
  },
  {
    q: "Quanto ele come por dia?",
    // 05/10 — números do rótulo (dose confirmada pela Olivia em 19/08). A frase antiga,
    // "meio pacote para cão pequeno e um para cão médio", ficava abaixo da dose real.
    a: "Depende do peso, e a tabela vem no rótulo. Por dia: até 5 kg, de 80 a 270 g; de 6 a 10 kg, de 310 a 460 g; de 11 a 25 kg, de 490 a 910 g; de 26 a 30 kg, de 940 a 1.050 g. O pacote tem 500 g.",
  },
  {
    q: "Quanto custa?",
    a: VENDENDO
      ? `R$ ${VENDA.preco} o pacote de 500 g. No kit, você compra 6 e ganha 1: 7 pacotes por R$ ${VENDA.kitPreco}, R$ ${VENDA.kitPorPacote} cada. Frete calculado no fim do pedido pelo seu CEP.`
      : "O preço sai no dia do drop. Quem está na lista recebe primeiro.",
  },
];

const Rango = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [comeHoje, setComeHoje] = useState<ComeHoje | "">("");
  const [caes, setCaes] = useState<Caes | "">("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [telTocado, setTelTocado] = useState(false);
  const [listaVisivel, setListaVisivel] = useState(false);
  const leadDisparado = useRef(false);

  useEffect(() => { captureEntryUtms(); }, []);

  /* A barra fixa do mobile some enquanto o formulário está na tela: dois
     "Entrar na lista" juntos, um que rola e um que envia, confundem (05/10). */
  useEffect(() => {
    const el = document.getElementById("lista");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setListaVisivel(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const nomeOk = nome.trim().length >= 2;
  const telOk = isValidPhoneBR(telefone);
  const valid = nomeOk && telOk;
  const telErro = telTocado && telefone.length > 0 && !telOk;
  // o botão apagado diz o que falta, depois que a pessoa começou a preencher
  const falta = !nome && !telefone ? "" : !nomeOk ? "Falta seu nome." : !telOk ? "Falta um WhatsApp válido." : "";

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    const res = await submitLpLead({
      name: nome,
      phone: telefone,
      slug: "rango",
      origem: "espera_rango",
      extra: { come_hoje: comeHoje || null, caes: caes || null, drop: DROP_DATA },
    });
    /* 05/10 — aqui a confirmação só aparece se o contato foi gravado. Numa lista
       de espera, "tá salvo" sem estar salvo é a pessoa esperando um aviso que
       não vem. Contato repetido conta como salvo. */
    if (!res.ok && !/duplicate/i.test(res.error ?? "")) {
      setStatus("error");
      return;
    }
    if (!leadDisparado.current) {
      trackLead("espera-rango", comeHoje || "nao-respondeu");
      leadDisparado.current = true;
    }
    setStatus("done");
  };

  /* 08/10 — com duas ofertas, os botões de fora do card levam até ele, onde a pessoa escolhe. */
  /* Auditoria mobile (M2): vai para o bloco de compra mais perto de onde a pessoa está
     (o card do hero ou o bloco de oferta), em vez de sempre voltar ao topo. */
  const irPraOfertas = () => {
    const alvos = ["lista", "oferta"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!alvos.length) return;
    const meio = window.innerHeight / 2;
    const dist = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return Math.abs(r.top + r.height / 2 - meio);
    };
    alvos.sort((a, b) => dist(a) - dist(b))[0].scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const irPraLista = () => {
    document.getElementById("lista")?.scrollIntoView({ behavior: "smooth", block: "center" });
    // com mouse e teclado, o cursor já cai no Nome; no toque não, para o teclado
    // do celular não cobrir o formulário antes de a pessoa ver onde chegou.
    if (window.matchMedia?.("(hover: hover)").matches) {
      document.querySelector<HTMLInputElement>("#lista input")?.focus({ preventScroll: true });
    }
  };

  const CardLista = (
    <div className="rg-card" id="lista">
      {status === "done" ? (
        <div className="rg-done">
          <div className="rg-done-mark">Você está na lista 🐉</div>
          <p className="rg-done-sub">
            Tá salvo, {nome.trim().split(" ")[0]}. Quando o Rango sair, o aviso
            chega no WhatsApp <strong>{telefone}</strong>, antes de abrir para todo mundo.
          </p>
          <button type="button" className="rg-done-corrigir" onClick={() => setStatus("idle")}>
            Número errado? Corrigir
          </button>
          <p className="rg-done-nota">Tem alguém com cachorro que ia gostar? Manda esta página.</p>
          <Link to="/produtos" className="rg-btn rg-btn-ghost">
            Enquanto isso, conheça os outros produtos
          </Link>
        </div>
      ) : (
        <>
          <div className="rg-card-topo">
            <span className="rg-card-tag">lista de espera</span>
            <strong className="rg-card-titulo">Quero o Rango</strong>
            <span className="rg-card-sub">
              O aviso do drop chega no seu WhatsApp, antes de abrir para todo mundo.
            </span>
          </div>

          <form className="rg-form" onSubmit={entrar} noValidate>
            <label className="rg-campo">
              <span className="rg-campo-label">Nome</span>
              <input
                className="rg-input"
                type="text"
                placeholder="Como a gente te chama"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="rg-campo">
              <span className="rg-campo-label">WhatsApp</span>
              <input
                className="rg-input"
                type="tel"
                inputMode="numeric"
                placeholder="(21) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
                onBlur={() => setTelTocado(true)}
                autoComplete="tel"
                aria-invalid={telErro}
              />
              {telErro && (
                <span className="rg-campo-erro" role="alert">
                  Confere o número: DDD + 9 dígitos.
                </span>
              )}
            </label>

            <div className="rg-campo">
              <span className="rg-campo-label">
                O que ele come hoje? <em>opcional</em>
              </span>
              <div className="rg-temas">
                {COME_HOJE.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    className={`rg-tema${comeHoje === c.id ? " ativo" : ""}`}
                    onClick={() => setComeHoje(comeHoje === c.id ? "" : c.id)}
                    aria-pressed={comeHoje === c.id}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rg-campo">
              <span className="rg-campo-label">
                Quantos cachorros em casa? <em>opcional</em>
              </span>
              <div className="rg-temas">
                {CAES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`rg-tema${caes === c ? " ativo" : ""}`}
                    onClick={() => setCaes(caes === c ? "" : c)}
                    aria-pressed={caes === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button className="rg-btn rg-btn-full" type="submit" disabled={!valid || status === "sending"}>
              {status === "sending" ? "Entrando…" : "Entrar na lista"}
            </button>
            {status === "error" ? (
              <p className="rg-campo-erro rg-form-aviso" role="alert">
                Não deu para salvar seu contato. Tenta de novo?
              </p>
            ) : falta ? (
              <p className="rg-campo-ajuda rg-form-aviso">{falta}</p>
            ) : null}

            <p className="rg-form-legal">
              A gente usa seu contato pra avisar do drop e falar do que a Comida de Dragão faz.
              É só pedir e a gente para.
            </p>
          </form>
        </>
      )}
    </div>
  );

  /* 08/10 — duas ofertas (Olivia): o kit em destaque, o pacote embaixo. Aparecem no card
     do hero e no bloco de oferta; `pos` marca de onde veio o clique (cta_pos). */
  const ofertas = (pos: "hero" | "oferta") => (
    <>
      {/* 08/10 — card simplificado (Olivia: "tá feio e enorme"): cada oferta é uma linha,
          com nome e preço à esquerda e o botão à direita. */}
      <div className="rg-oferta rg-oferta-kit">
        <div className="rg-oferta-info">
          <span className="rg-oferta-selo">compre 6, ganhe 1</span>
          <strong className="rg-oferta-nome">Kit com 7 pacotes</strong>
          <div className="rg-preco">
            <small>R$</small>{VENDA.kitPreco}
          </div>
          <span className="rg-oferta-apoio">R$ {VENDA.kitPorPacote} por pacote</span>
        </div>
        <a className="rg-btn rg-btn-link" href={VENDENDO ? ctaUrl(`${pos}-kit`) : undefined}>
          Quero o kit
        </a>
      </div>
      <div className="rg-oferta">
        <div className="rg-oferta-info">
          <strong className="rg-oferta-nome">1 pacote</strong>
          <div className="rg-preco">
            <small>R$</small>{VENDA.preco}
          </div>
        </div>
        <a className="rg-btn rg-btn-link rg-btn-sec" href={VENDENDO ? ctaUrl(pos) : undefined}>
          Comprar
        </a>
      </div>
    </>
  );

  /* Card de compra: ocupa o lugar do formulário quando a venda está ligada.
     Preço e botão vêm depois do pacote (regra da casa nas LPs). */
  const CardCompra = (
    <div className="rg-card" id="lista">
      <div className="rg-card-topo">
        <strong className="rg-card-titulo">Rango do Dragão · 500 g</strong>
        <span className="rg-card-sub">Alimento completo úmido para cães adultos.</span>
      </div>
      {ofertas("hero")}
      <p className="rg-form-legal">
        Frete calculado no fim do pedido pelo seu CEP. Compra segura pela Yampi, com cartão, Pix ou boleto.
      </p>
    </div>
  );

  return (
    <div className={`portal-page theme-light skin-2 rango-page${VENDENDO ? " rango-venda" : ""}`}>
      <PageMeta
        title="Rango do Dragão — o alimento completo da Comida de Dragão, feito com inseto"
        description={VENDENDO
          ? "Comida natural úmida e completa para cães adultos, com proteína de inseto. Pouch de 500 g."
          : "Comida natural úmida e completa para cães adultos, com proteína de inseto. Vem aí, em lote limitado. Entre na lista e receba o aviso primeiro."}
        /* desde 10/10/2026 esta versão mora em /rango-antiga (a /rango é a RangoJogo): fora da busca */
        noindex={typeof window !== "undefined" && window.location.pathname !== "/rango"}
      />

      <MarqueeBar />

      {/* ══ HERO + LISTA — tudo na primeira dobra ═══════════════════ */}
      <section className="rg-hero">
        <div className="rg-hero-grid">
          <div className="rg-hero-pitch">
            {/* 05/10 — a marca no topo (Olivia: "tá faltando a logo"). Mesmo lugar e
                mesma classe da /webinar, de onde esta página foi clonada. */}
            {/* 07/10 — a marca leva para a home da loja, com o "← comida de dragão" ao lado,
                como na /original, /mordida e /curiosidade (Olivia: "para ela voltar, como
                nas outras LPs"). Aqui o destino é a home, não a coleção. */}
            <div className="rg-marcas">
              <a href="https://www.comidadedragao.com.br" className="rg-backlink">← comida de dragão</a>
              <a href="https://www.comidadedragao.com.br" aria-label="Comida de Dragão: ir para a home da loja">
                <DragonLogo className="rg-marca-cdd" />
              </a>
            </div>
            <div className="rg-eyebrow">{VENDENDO ? "Rango do Dragão" : "Rango do Dragão · vem aí"}</div>
            {/* 28/09 — a Olivia pediu título CLARO: diz o que é e de quem é. A frase
                de conceito ("Ele come inseto desde sempre") saiu do H1. */}
            <h1 className="rg-titulo">
              O alimento completo da Comida de Dragão.<br /><span>Feito com inseto.</span>
            </h1>
            {/* 02/10 — foto misteriosa do lançamento (arte da Bianca, "Vem aí"): o pacote
                segue pixelado até o drop. Fica logo abaixo do título (Olivia, 02/10). */}
            <img
              className="rg-misterio"
              src={VENDENDO ? VENDA.foto : "/assets/images/rango/rango-vem-ai.webp"}
              alt={VENDENDO ? "Pacote do Rango do Dragão, 500 g" : "Pacote do Rango do Dragão pixelado, segurado na mão, com o selo Vem aí"}
              width={864}
              height={VENDENDO ? 636 : 1080}
              loading="eager"
              decoding="async"
            />
            {/* 08/10 — preço na primeira dobra, logo abaixo da foto, como na /original. */}
            {VENDENDO && (
              <div className="rg-hero-preco">
                <span>a partir de</span>
                <strong><small>R$</small>{VENDA.preco}</strong>
                <em>compre 6, ganhe 1</em>
              </div>
            )}
            <p className="rg-sub">
              <strong>Comida natural</strong>, úmida, para cães adultos: filé mignon suíno, batata-doce, abóbora, chuchu e farinha
              de larva, no pouch de 500 g.{VENDENDO ? "" : <> Vem aí, em <strong>lote limitado</strong>.</>}
            </p>
          </div>

          <div className="rg-hero-form">{VENDENDO ? CardCompra : CardLista}</div>

          <div className="rg-hero-detalhes">
            <p className="rg-sub">
              <strong>Levou menos tempo que ler isto.</strong> Abrir e servir é a receita inteira.
            </p>
            {/* 08/10 — eram duas fileiras e oito selos (Olivia: "bem confuso"). Na venda fica
                uma fileira só, com os três de confiança; os de produto repetiam o parágrafo
                de cima e seguem só na lista de espera. */}
            {VENDENDO ? (
              <div className="rg-selos">
                {CONFIANCA.map((c) => <span className="rg-selo rg-selo-conf" key={c}>{c}</span>)}
              </div>
            ) : (
              <div className="rg-selos">
                <span className="rg-selo">Comida natural</span>
                <span className="rg-selo">Alimento completo</span>
                <span className="rg-selo">Úmido · 500 g</span>
                <span className="rg-selo">Cães adultos</span>
                <span className="rg-selo">Proteína nova</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ PROBLEMA (08/10, só na venda) ═════════════════════════════ */}
      {VENDENDO && (
        <>
          <section className="rg-secao">
            <div className="rg-tag tag-alt2">se isso te soa familiar</div>
            <h2 className="rg-secao-titulo">A mudança <span>começa no pote</span></h2>
            <p className="rg-sub">Trocar a base da alimentação, não só a marca.</p>
            <ul className="rg-lista">
              {PROBLEMAS.map((p) => (
                <li key={p.dor}><b>{p.dor}</b>: {p.causa}</li>
              ))}
            </ul>
          </section>
          <div className="rg-divider" />
        </>
      )}

      {/* ══ O QUE TEM NO POTE ════════════════════════════════════════ */}
      <section className="rg-secao">
        <div className="rg-tag">no pote</div>
        <h2 className="rg-secao-titulo">Ele merece um prato, <span>não um punhado</span></h2>
        {/* 08/10 — a frase ganhou a linha de apoio aprovada em 25/09 ("frase sozinha não se
            explica"), os cards passaram a mostrar o número grande, como os benefícios da
            /original, e a seção fecha com botão quando a venda está ligada. */}
        <p className="rg-sub">Alimento completo úmido, servido no pote. É a refeição inteira, não o petisco.</p>
        <div className="rg-novidades">
          {NO_POTE.map((n) => (
            <div className="rg-nov-card" key={n.nome}>
              <div className="rg-nov-tag">{n.tag}</div>
              <div className="rg-nov-nome">{n.nome}</div>
              <div className="rg-nov-desc">{n.desc}</div>
              <div className="rg-nov-dado"><strong>{n.dado}</strong><span>{n.dadoLabel}</span></div>
            </div>
          ))}
        </div>
        <p className="rg-nota">
          Não é ingrediente exótico. É ingrediente honesto: criado para isso, rastreado e declarado.
        </p>
        {VENDENDO && (
          <div className="rg-cta-final">
            <strong>Bora encher o pote?</strong>
            <button className="rg-btn" onClick={irPraOfertas}>Ver as ofertas</button>
          </div>
        )}
      </section>

      <div className="rg-divider" />

      {VENDENDO && (
        <>
          {/* ══ É LARVA MESMO (anti-rejeição, como na /original) ═════════ */}
          <section className="rg-secao">
            <div className="rg-tag tag-alt2">é larva mesmo</div>
            <h2 className="rg-secao-titulo">Ele não liga que é larva. <span>Só sabe que quer mais.</span></h2>
            <p className="rg-sub">O nojo é humano; o apetite dele é que decide. Se o seu for do tipo desconfiado:</p>
            <ul className="rg-lista">
              <li><b>Comece misturando</b>: uma colher por cima do que ele já come, e vá aumentando.</li>
              <li><b>Sirva como refeição</b>: a dose por peso vem no rótulo.</li>
              <li><b>Não colou mesmo?</b> <strong>A gente devolve seu dinheiro em 14 dias.</strong> Sem letrinha miúda.</li>
            </ul>
          </section>

          {/* ══ PROVA SOCIAL emprestada dos outros produtos ══════════════ */}
          <section className="rg-secao rg-secao-colada">
            <div className="rg-tag">quem já serve comida de dragão</div>
            <h2 className="rg-secao-titulo">O Rango acabou de chegar. <span>Os petiscos já têm fã.</span></h2>
            <p className="rg-sub">Vídeos de tutores com os outros produtos da marca.</p>
          </section>
          <VideosVencedores reels={REELS_PROVA} />

          {/* ══ OFERTA ═══════════════════════════════════════════════════ */}
          <section className="rg-secao rg-secao-oferta" id="oferta">
            <div className="rg-tag">pronto pra levar</div>
            <h2 className="rg-secao-titulo">Rango do Dragão <span>· 500 g</span></h2>
            <div className="rg-ofertas-grade">{ofertas("oferta")}</div>
            <p className="rg-form-legal">
              Frete calculado no fim do pedido pelo seu CEP. Compra segura pela Yampi, com cartão, Pix ou boleto.
            </p>
          </section>

          <div className="rg-divider" />
        </>
      )}

      {/* ══ FAQ ═════════════════════════════════════════════════════ */}
      <section className="rg-secao">
        <div className="rg-tag tag-alt">perguntas rápidas</div>
        {/* 08/10 — na venda o FAQ ganha título e abre e fecha, como na /original;
            a garantia fecha a seção. Na lista de espera segue aberto, como estava. */}
        {VENDENDO && <h2 className="rg-secao-titulo">Antes de comprar, <span>tudo o que importa</span></h2>}
        <div className="rg-faq">
          {FAQ.map((f, i) => VENDENDO ? (
            <details className="rg-faq-item" key={f.q} open={i === 0}>
              <summary className="rg-faq-q">{f.q}</summary>
              <div className="rg-faq-a">{f.a}</div>
            </details>
          ) : (
            <div className="rg-faq-item" key={f.q}>
              <div className="rg-faq-q">{f.q}</div>
              <div className="rg-faq-a">{f.a}</div>
            </div>
          ))}
        </div>
        {VENDENDO && (
          <div className="rg-garantia">
            <div className="rg-garantia-icone">💚</div>
            <div>
              <strong>Garantia da matilha</strong>
              <span>Se ele não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</span>
            </div>
          </div>
        )}

        {status !== "done" && (
          <div className="rg-cta-final">
            <strong>Ele já sabe. Falta você.</strong>
            {VENDENDO
              ? <button className="rg-btn" onClick={irPraOfertas}>Ver as ofertas</button>
              : <button className="rg-btn" onClick={irPraLista}>Entrar na lista</button>}
          </div>
        )}
      </section>

      <MarqueeBar bottom />

      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <nav className="footer-links">
          <Link to="/portal">Portal</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/biblioteca">Biblioteca</Link>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:comidadedragao@letsfly.com.br">Contato</a>
        </nav>
        <div className="footer-tagline">Nojento é o desperdício.</div>
      </footer>

      {status !== "done" && !listaVisivel && (
        <div className="rg-sticky">
          <div className="rg-sticky-info">
            <strong>{VENDENDO ? `A partir de R$ ${VENDA.preco}` : "Vem aí"}</strong>
            <span>{VENDENDO ? "Compre 6, ganhe 1" : "Lote limitado"}</span>
          </div>
          {VENDENDO ? (
            <button className="rg-btn rg-btn-sticky" onClick={irPraOfertas}>Ver as ofertas</button>
          ) : (
            <button className="rg-btn rg-btn-sticky" onClick={irPraLista}>
              Entrar na lista
            </button>
          )}
        </div>
      )}

      {/* 08/10 — pop-up de lead só na venda (na espera a própria página é o formulário). */}
      {VENDENDO && <LeadPopup slug="rango" />}
    </div>
  );
};

export default Rango;
