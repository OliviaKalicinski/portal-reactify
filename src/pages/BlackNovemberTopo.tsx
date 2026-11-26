import { useEffect, useRef, useState } from "react";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent } from "@/lib/pixel";
import VideosVencedores, { VIDEOS } from "@/components/VideosVencedores";
import { FIM_CURTO, FIM_POR_EXTENSO } from "@/lib/blackNovember";
import "./BlackNovemberTopoSite.css";

/* ──────────────────────────────────────────────────────────────
   /black-november-topo · Black November (09 a 30/11/2026)
   Página de VENDA para PÚBLICO FRIO, uma oferta só: Kit Completo de R$ 184,60 por R$ 92,30
   (50%), carrinho PDYJH8ZOQU (produto oculto 1306-BN na Shopify e 46529699 na Yampi).
   SEM frete grátis (abaixo do piso de R$ 108) e SEM brinde.

   🔴 17/11/2026 — REFEITA NO FORMATO DA PÁGINA DE PRODUTO DO SITE (Olivia: "deixar ela mais
   parecida com a de produtos da black no site" / "sinto falta de informação"). Plano e crítica em
   `PROJETOS/Lançamentos & Campanhas/2026-11-17 - LP black-november-topo - crítica e plano`.
   Molde: comidadedragao.com.br/products/kit-completo-para-caes, lido em 17/11 (cores, fontes,
   selos, galeria, textos da descrição e do FAQ). A versão anterior, no visual 8-bit da
   /black-november-gato, está no histórico do git (commit 1fcec9e e antes).

   O que NÃO mudou: preço, carrinho, UTM de reserva, evento ViewContent, fim em 30/11, a página
   sem review (regra da casa: página com vídeo de creator fica sem review, Olivia 02/10), os cinco
   blocos de ciência e o tom do FAQ (o cheiro fica).

   Textos tirados do site e mudados aqui de propósito:
   - os selos do site dizem "+ suplemento de presente" e "frete grátis": ESTE kit não tem
     nenhum dos dois, então saíram;
   - a resposta de entrega do site termina em "os kits com o selo Frete grátis não pagam frete":
     saiu pelo mesmo motivo;
   - a resposta de sustentabilidade do site traz "8 vezes menos terra" e "80% menos gases":
     números sem fonte conferida no cofre, então saíram (regra 1 da casa).
   ────────────────────────────────────────────────────────────── */

const UTM_FALLBACK = { utm_source: "lp-black-november-topo", utm_medium: "lp", utm_campaign: "black-november-2026" };

const CHECKOUT = "https://seguro.comidadedragao.com.br/r/";
const CDN = "https://cdn.shopify.com/s/files/1/0895/4311/5055/files/";
// mesmo número e mesma mensagem do botão flutuante das LPs (components/FaleConosco.tsx)
const WHATSAPP = "https://wa.me/552139500576?text=" + encodeURIComponent("Oi! Vim pelo site e tenho uma dúvida.");

const KIT = {
  nome: "Kit Completo para Cães",
  token: "PDYJH8ZOQU",
  sku: "1306-BN",
  cheio: "184,60",
  agora: "92,30", // 06/11 (Olivia): "coloca com 50%" — metade exata de R$ 184,60
};

/* As fotos da galeria são as mesmas da página do kit no site (Shopify, lidas em 17/11). */
const FOTOS = [
  { src: CDN + "kit-dog-supremo.png?v=1785150064", alt: "Kit Completo para cães: o pacote Original, a Mordida e o pote do Suplemento Integral" },
  { src: CDN + "d2.png", alt: "Kit Completo para cães, foto 2" },
  { src: CDN + "d3.png", alt: "Kit Completo para cães, foto 3" },
  { src: CDN + "d4.png", alt: "Kit Completo para cães, foto 4" },
  { src: CDN + "d5.png", alt: "Kit Completo para cães, foto 5" },
  { src: CDN + "d6.png", alt: "Kit Completo para cães, foto 6" },
];

/* Os outros kits da Black (Olivia, 17/11: "eu queria colocar os outros kits também").
   Preço e foto lidos na loja (products/<handle>.json) em 17/11; carrinhos de
   `_MIGRAR-PAGINAS/links-checkout-yampi-tokens.md`. Os 4 passam do piso de R$ 100 da regra de
   brinde da Black na Yampi (8402, 09 a 30/11): ganham o Suplemento Integral (R$ 110) de presente.
   Frete grátis: só os kits têm, automático (regra da casa). O Kit Completo de R$ 92,30 lá em cima
   NÃO ganha nenhum dos dois: cada cartão diz o que inclui. */
const KITS = [
  {
    nome: "Kit Original 3x", preco: "120,20", token: "DZCHG52YG4",
    img: CDN + "Anuncios_Multiplataforma_Original_3x_4804eede-2fc5-41aa-b9a6-3ca0a3c2c776.png",
    txt: "Três pacotes de Original: só larva, um ingrediente só. Para quem quer parar de comprar de pacote em pacote.",
  },
  {
    nome: "Kit 3 Mordidas", preco: "120,20", token: "AMX9A1HEPD",
    img: CDN + "kit-mordidas.png",
    txt: "Três Mordidas de 180 g: o biscoito crocante de larva, no lugar do biscoito de frango e boi. Leva ovo.",
  },
  {
    nome: "Kit para Cães", preco: "144,50", token: "KQXZ5J7LWK",
    img: CDN + "Anuncios_Multiplataforma_Mordida_Suplemento_030f2ec7-353e-45e0-ae37-979a624c15ec.png",
    txt: "Original como agrado e Suplemento Integral por cima da ração, sem trocar a comida dele.",
  },
  {
    nome: "Kit Mordida + Suplemento", preco: "144,50", token: "ZWOQZDQBW1",
    img: CDN + "kit-dog-mordida-suplemento.png",
    txt: "O petisco do dia a dia e o reforço por cima da ração, na mesma caixa. A Mordida leva ovo.",
  },
];

/* O que vem na caixa, com como dar. Uso e proteína: `00_CONTEXTO_BASE/Produtos - decisões e claims`
   (Original e Mordida: no máximo 10% do consumo diário; Suplemento: acompanha dosador; proteína na
   forma de 25/09). A Mordida leva ovo: o KIT nunca é chamado de hipoalergênico. */
const CAIXA = [
  { nome: "Comida de Dragão Original", peso: "90 g", txt: "Só larva desidratada, nada mais. Como agrado ou recompensa, até 10% do que ele come no dia." },
  { nome: "Mordida de Dragão", peso: "180 g", txt: "O petisco assado que quebra na mão, bom para cão pequeno e para pet seletivo. Leva ovo em pó. Como agrado, até 10% do que ele come no dia." },
  { nome: "Suplemento Integral para cães", peso: "180 g", txt: "O pó que vai por cima da ração que ele já come, na medida do dosador que vem junto. No mínimo 40% de proteína, podendo chegar a 45%." },
];

/* Os cinco blocos de ciência (sem mudança desde 28/10). Cada um conferido no Catálogo - Biblioteca
   BSF do cofre. O que os estudos mediram é a PROTEÍNA DE LARVA como ingrediente, não o produto pronto. */
const CIENCIA = [
  {
    titulo: "O corpo dele aproveita quase tudo",
    texto: "A proteína da larva tem alta digestibilidade — 88,9% da proteína. Em cães, trocar parte da farinha de frango por larva manteve peso, saúde e exames dentro do normal.",
    fonte: "Freel, McComb e Koutsos (2021); Jian et al. (2022)",
  },
  {
    titulo: "Menos cocô, e melhor",
    texto: "Num ensaio com Beagles, a dieta com farinha de larva reduziu o volume das fezes e teve maior digestibilidade da matéria seca que a de cordeiro.",
    fonte: "ensaio em Beagles, cross-over",
  },
  {
    titulo: "A larva alimenta o intestino dele também",
    texto: "O que não é digerido vira comida para as bactérias boas do intestino, que produzem acetato, propionato e butirato. A microbiota muda, e muda para melhor.",
    fonte: "Bosch, Vervoort e Hendriks (2016); Jian et al. (2022)",
  },
  {
    titulo: "Proteína completa, não pela metade",
    texto: "Perfil completo de aminoácidos essenciais, e de alta qualidade. É proteína inteira, não um complemento que falta alguma coisa.",
    fonte: "Bosch, Vervoort e Hendriks (2016)",
  },
  {
    titulo: "Antioxidante e anti-inflamatório, medido",
    texto: "Em cães que receberam farinha de larva por 42 dias, os marcadores de inflamação (TNF-α) caíram e as enzimas antioxidantes (GPx e SOD) subiram.",
    fonte: "ensaio em Beagles, 42 dias, 1% a 2% de farinha desengordurada",
  },
];

/* FAQ: o da página (voz da casa, 28/10) somado ao do site (17/11). Garantia: vale a lei,
   7 dias com produto lacrado (Olivia, 30/10); a resposta segue sem prazo, de propósito. */
const FAQ = [
  { q: "Larva? Sério?", a: "Sério, e sem drama: larva de mosca soldado negro, criada em biofábrica para virar alimento e desidratada. Não é a mosca da sua cozinha, e o seu cão não vê larva — vê petisco." },
  { q: "O que é BSF? Por que inseto em vez de carne?", a: "BSF é a sigla em inglês da mosca soldado negra. A larva dela come resíduo orgânico e vira uma proteína completa, com todos os aminoácidos essenciais. Seu pet aproveita 88,9% dessa proteína, que ainda traz ômegas 6 e 9 e ácido láurico. A gente cria as larvas na nossa biofábrica, registrada no MAPA: do resíduo à proteína, tudo rastreável." },
  { q: "O meu vai querer comer?", a: "Nos estudos com cães, as dietas com larva foram bem aceitas. E os vídeos desta página são de tutores de verdade: um deles escreveu que teve de guardar o pacote na geladeira porque o cachorro procurava pela casa." },
  { q: "É seguro? Não vai fazer mal para ele?", a: "Sim, é seguro. A gente cria as larvas na nossa biofábrica em Cachoeiras de Macacu (RJ), registrada no MAPA, e controla tudo do início ao fim. Nos estudos com cães e gatos, quem comeu larva por semanas manteve os exames de sangue, de rim e de fígado normais." },
  { q: "Meu cão tem alergia alimentar. Pode usar?", a: "A maior parte das alergias vem das proteínas de sempre: frango, boi e soja. A larva é uma proteína que o corpo dele nunca viu, por isso costuma não provocar reação. Comece pela Original: ela só tem larva. A Mordida, que vem neste kit, leva ovo; se a alergia é a ovo, fique na Original e no Suplemento. Se a alergia é forte, faça a troca junto com o veterinário." },
  { q: "Quanto eu dou?", a: "A Original e a Mordida são agrado: até 10% do que ele come no dia. O Suplemento vai por cima da ração, na medida do dosador que vem junto." },
  { q: "Vou ser sincera: cheira bem?", a: "Não. É meio fedidinho, e a sua mão vai querer sabão depois. O seu cão discorda de nós dois." },
  { q: "Quanto custa o frete e quando chega?", a: "Entregamos para o Brasil inteiro. O prazo e o valor do frete aparecem pelo CEP no checkout, e você acompanha o pedido pelo WhatsApp ou pelo e-mail." },
  { q: "É sustentável mesmo?", a: "É. A larva come resíduo orgânico que iria para o lixo e vira proteína. Seu pet come bem, e o desperdício vira comida. Nojento é o desperdício." },
  { q: "E se não rolar?", a: "Chama a gente no WhatsApp (21) 3950-0576 que a gente resolve com você." },
];

export default function BlackNovemberTopo() {
  const [foto, setFoto] = useState(0);
  const trilho = useRef<HTMLDivElement>(null);

  useEffect(() => {
    captureEntryUtms();
    trackViewContent({ content_name: "LP Black November topo — Kit Completo 50%", content_id: "lp-black-november-topo", value: 0 });
  }, []);

  const comprar = (pos: string) => buildCheckoutUrl(CHECKOUT + KIT.token, UTM_FALLBACK, pos);
  const comprarKit = (token: string) => buildCheckoutUrl(CHECKOUT + token, UTM_FALLBACK, "kit-" + token);

  const irPara = (i: number) => {
    const t = trilho.current;
    if (!t) return;
    const n = (i + FOTOS.length) % FOTOS.length;
    t.scrollTo({ left: n * t.clientWidth, behavior: "smooth" });
    setFoto(n);
  };
  const aoRolar = () => {
    const t = trilho.current;
    if (t) setFoto(Math.round(t.scrollLeft / t.clientWidth));
  };

  return (
    <div className="bnts">
      <PageMeta
        title="Kit Completo para Cães por R$ 92,30 — Black Flyday — Comida de Dragão"
        description={`Black Flyday: o Kit Completo de proteína de larva para cães (Original, Mordida e Suplemento) de R$ ${KIT.cheio} por R$ ${KIT.agora}. Até ${FIM_POR_EXTENSO}.`}
      />

      <header className="bnts-cabeca">
        <a href="https://www.comidadedragao.com.br/collections/produtos" aria-label="Comida de Dragão: ver a loja">
          <img className="bnts-logo" src="/assets/images/logo-preto.png" alt="Comida de Dragão" />
        </a>
        <a className="bnts-loja" href="https://www.comidadedragao.com.br/collections/produtos">ver a loja</a>
      </header>

      {/* Banner da Black (Olivia, 17/11: "algum banner, alguma indicação da Black Friday"),
          com o céu 8-bit e o cachorro das peças da campanha. */}
      <section className="bnts-banner" aria-label={`Black Flyday até ${FIM_CURTO}`}>
        <img className="bnts-banner-cao" src="/assets/black-november/cao-pixel.png" alt="" aria-hidden />
        <p className="bnts-banner-sobre">a Black da Comida de Dragão</p>
        <p className="bnts-banner-titulo">Black Flyday</p>
        <p className="bnts-banner-linha">50% no Kit Completo · kits com presente · até {FIM_CURTO}</p>
      </section>

      <main className="bnts-produto">
        <div className="bnts-midia">

        <div className="bnts-galeria">
          <span className="bnts-kit-selo bnts-capa-selo bnts-capa-selo--off">50% off</span>
          <span className="bnts-kit-selo bnts-capa-selo bnts-capa-selo--black">Black Flyday</span>
          <div className="bnts-trilho" ref={trilho} onScroll={aoRolar}>
            {FOTOS.map((f, i) => (
              <a key={f.src} className="bnts-foto" href={comprar("foto")} data-cta="foto" aria-label={`Comprar o ${KIT.nome} por R$ ${KIT.agora}`}>
                <img src={f.src} alt={f.alt} loading={i === 0 ? "eager" : "lazy"} />
              </a>
            ))}
          </div>
          <button type="button" className="bnts-seta bnts-seta--esq" onClick={() => irPara(foto - 1)} aria-label="Foto anterior">‹</button>
          <button type="button" className="bnts-seta bnts-seta--dir" onClick={() => irPara(foto + 1)} aria-label="Próxima foto">›</button>
          <div className="bnts-pontos" aria-hidden>
            {FOTOS.map((f, i) => <span key={f.src} className={i === foto ? "on" : ""} />)}
          </div>
        </div>
        </div>

        <div className="bnts-info">
        <h1 className="bnts-titulo">{KIT.nome}</h1>
        <p className="bnts-preco">
          <s>R$ {KIT.cheio}</s> <strong>R$ {KIT.agora}</strong> <span className="bnts-off">50% off</span>
        </p>

        {/* 18/11 (Olivia: "os dois botões tinham que ficar mais visíveis, tipo comprar agora e ver
            outras promoções"): o segundo desce até a vitrine dos kits, com presente e frete grátis. */}
        <div className="bnts-botoes">
          <a className="bnts-botao" href={comprar("titulo")} data-cta="titulo">Comprar agora</a>
          <a className="bnts-botao bnts-botao--promo" href="#kits" data-cta="ver-promocoes">Ver outras promoções ↓</a>
        </div>
        <p className="bnts-frete">🚚 Entrega para todo o Brasil. O frete deste kit aparece pelo CEP no checkout.</p>

        <p className="bnts-confianca">Biofábrica registrada no MAPA · Sem conservantes artificiais · Original, Mordida e Suplemento</p>

        <section className="bnts-kits" id="kits" aria-label="Mais kits na Black Flyday">
          <h2>Mais kits na Black Flyday</h2>
          <p className="bnts-kits-sub">Estes ganham o Suplemento Integral de R$ 110 de presente e têm frete grátis. Até {FIM_CURTO}.</p>
          <div className="bnts-kits-grade">
            {KITS.map((k) => (
              <article key={k.token} className="bnts-kit">
              <span className="bnts-kit-selo bnts-kit-selo--frete">Frete grátis</span>
              <a href={comprarKit(k.token)} data-cta={"kit-" + k.token} className="bnts-kit-foto" aria-label={`Comprar o ${k.nome} por R$ ${k.preco}`}>
                <img src={k.img} alt={k.nome} loading="lazy" />
              </a>
              <span className="bnts-kit-selo bnts-kit-selo--brinde">Ganhe suplemento</span>
              <h3>{k.nome}</h3>
              <p className="bnts-kit-preco">R$ {k.preco}</p>
              <p className="bnts-kit-txt">{k.txt}</p>
              <a className="bnts-kit-btn" href={comprarKit(k.token)} data-cta={"kit-" + k.token}>Comprar agora</a>
            </article>
            ))}
          </div>
        </section>

        <p className="bnts-resumo">
          Cão que coça ou está com o pelo sem brilho? Este kit leva a proteína de larva para o dia dele:
          a Original e a Mordida como agrado, e o Suplemento na ração.
        </p>

        <div className="bnts-abas">
          <details open>
            <summary>Descrição</summary>
            <div className="bnts-aba">
              <p>
                Se o seu cão coça, lambe a pata ou está com o pelo sem brilho, a proteína pode ser a causa.
                Frango, boi e soja se repetem em quase tudo que existe no mercado.
              </p>
              <p>
                Este kit traz outra proteína para a rotina dele, a larva de mosca soldado negra, criada na
                nossa biofábrica no Rio: a Original e a Mordida como agrado ou recompensa, de vez em quando,
                e o Suplemento Integral por cima da ração.
              </p>
              <h3>O que vem na caixa</h3>
              <ul className="bnts-caixa">
                {CAIXA.map((c) => (
                  <li key={c.nome}><strong>✓ {c.nome} — {c.peso}</strong><span>{c.txt}</span></li>
                ))}
              </ul>
              <p className="bnts-nota">A Mordida leva ovo. Sem conservantes artificiais. Registro no MAPA/RJ.</p>
            </div>
          </details>

          <details>
            <summary>Por que larva, e não frango?</summary>
            <div className="bnts-aba">
              <p>
                Cinco coisas que os estudos mediram sobre a proteína de larva em cães. Nenhuma delas é
                promessa do nosso produto pronto: é o que a pesquisa viu no ingrediente.
              </p>
              <div className="bnts-ciencia">
                {CIENCIA.map((c, i) => (
                  <article key={c.titulo}>
                    <span aria-hidden>{i + 1}</span>
                    <h4>{c.titulo}</h4>
                    <p>{c.texto}</p>
                    <small>{c.fonte}</small>
                  </article>
                ))}
              </div>
              <p className="bnts-nota">Os estudos inteiros ficam na <a href="/biblioteca">biblioteca científica</a> da casa.</p>
            </div>
          </details>
        </div>
        </div>
      </main>



      <section className="bnts-faixa-titulo"><h2>Por que funciona</h2></section>
      <div className="bnts-videos">
        <VideosVencedores reels={[VIDEOS.vitydalmata, VIDEOS.omeninomerlin, VIDEOS.pitanga, VIDEOS.sushijullie, VIDEOS.mytribesete, VIDEOS.pipo, VIDEOS.carla, VIDEOS.gabi]} />
      </div>

      <section className="bnts-faq">
        <h2>Perguntas frequentes</h2>
        {FAQ.map((f) => (
          <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
        ))}
      </section>

      <footer className="bnts-fim">
        <p>Black Flyday: o kit inteiro de <s>R$ {KIT.cheio}</s> por <strong>R$ {KIT.agora}</strong>. Até {FIM_CURTO}.</p>
        <a className="bnts-botao" href={comprar("final")} data-cta="final">Comprar agora</a>
      </footer>

      {/* Barra fixa como a do site: compra + WhatsApp */}
      <div className="bnts-barra">
        <a className="bnts-barra-btn" href={comprar("barra")} data-cta="barra">Comprar agora · R$ {KIT.agora}</a>
        <a className="bnts-whats" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
          <svg viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.4.4 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z"/></svg>
        </a>
      </div>
    </div>
  );
}
