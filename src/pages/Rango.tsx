import { useEffect, useState } from "react";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import ReelsSection from "@/components/ReelsSection";
import { VIDEOS_RANGO } from "@/components/VideosVencedores";
import "./Portal.css";
import "./Rango.css";
import "./RangoJogo.css";
import "./RangoFofo.css";

/* versão fofa (azul e verde do pacote): desde 15/10 é a /rango de todo mundo (Olivia: "vamos colocar o Rango Fofo
   no ar com o mesmo URL da Rango"). A versão anterior, de janelinhas retas, ainda abre com ?visual=jogo. */
const VISUAL_FOFO = (() => { try { return new URLSearchParams(window.location.search).get("visual") !== "jogo"; } catch { return true; } })();

/* ──────────────────────────────────────────────────────────────
   RANGO DO DRAGÃO — VERSÃO DE TESTE EM JANELINHAS (10/10/2026)

   Olivia, 10/10: "podemos testar alguma coisa diferente" e, sobre a
   referência (um painel de janelinhas com o produto saltando para a
   frente): "ela encontra uma solução para vários quadrados, vários
   botões. O jeito que ele apresenta o produto grandão, eu acho bem
   legal. Dá para a gente fazer uma coisa interativa assim, como teste
   para a landing page. Não precisa mexer e sempre mobile first."

   O QUE É: a mesma oferta e os mesmos textos da /rango (nada de claim
   novo), em outro formato: o pacote grande no topo, que abre no toque,
   o texto e o preço logo abaixo, e seis janelinhas que são botões.
   10/10, Olivia: "a rango morre e vira a rango jogo com a url rango". Esta página É a /rango.
   A anterior (lista de espera e venda no desenho da /webinar) saiu do site; está no histórico
   do git, até o commit fa01799. O estilo dela (Rango.css) segue em uso aqui.
   Olivia, 10/10, sobre a primeira versão: título sem "tem coragem" ("as pessoas
   têm coragem, vamos partir daí"); brincar com a praticidade; no topo, a animação
   do saco rasgando; "embaixo é um textinho e o preço já direto".
   MEDIÇÃO: origem de reserva lp-rango, a mesma da página anterior (a série não quebra).
   O que separa os cliques desta versão é o cta_pos: jogo, jogo-kit, jogo-fim, jogo-fim-kit.
   Preço, carrinhos e dose: os mesmos da Rango.tsx. Mudou lá, muda aqui.
   ────────────────────────────────────────────────────────────── */

const VENDA = {
  checkoutUrl: "https://seguro.comidadedragao.com.br/r/NZZ48AIGFF",
  preco: "30,90",
  kitUrl: "https://seguro.comidadedragao.com.br/r/MJ9H9ZNKPG",
  kitPreco: "185,40",
  kitPorPacote: "26,49",
  foto: "/assets/images/rango/rango-pacote-frente.webp",
};
const UTM_FALLBACK = { utm_source: "lp-rango", utm_medium: "lp", utm_campaign: "lp-rango" };
type Pos = "jogo" | "jogo-fim";
const ctaUrl = (kit: boolean, pos: Pos) =>
  buildCheckoutUrl(kit ? VENDA.kitUrl : VENDA.checkoutUrl, UTM_FALLBACK, kit ? `${pos}-kit` : pos);

/* Dose do rótulo (confirmada pela Olivia em 19/08; a mesma do FAQ da /rango). */
const DOSES = [
  { peso: "até 5 kg", dose: "de 80 a 270 g por dia" },
  { peso: "6 a 10 kg", dose: "de 310 a 460 g por dia" },
  { peso: "11 a 25 kg", dose: "de 490 a 910 g por dia" },
  { peso: "26 a 30 kg", dose: "de 940 a 1.050 g por dia" },
];

/* as três frases da arte do Rango (catálogo, págs. 10 e 15), cada uma na sua janelinha */
const FRASES = [
  { arquivo: "natural.png", cor: "lima", src: "/assets/images/rango/frase-alimento-natural.webp", alt: "Alimento natural" },
  { arquivo: "congelar.png", cor: "aqua", src: "/assets/images/rango/frase-nao-precisa-congelar.webp", alt: "Não precisa congelar" },
  { arquivo: "bsf.png", cor: "rosa", src: "/assets/images/rango/frase-com-farinha-de-bsf.webp", alt: "Com farinha de BSF" },
];

const Rango = () => {
  const [peso, setPeso] = useState(1);
  const [comprarVisivel, setComprarVisivel] = useState(true);

  useEffect(() => { captureEntryUtms(); }, []);

  /* a barra fixa do celular some enquanto qualquer par de caixinhas de compra está na tela
     (auditoria de UX de 10/10: antes só olhava as de cima e cobria as do fim da página) */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".rj-caixas"));
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const visiveis = new Set<Element>();
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => (e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target)));
      setComprarVisivel(visiveis.size > 0);
    }, { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const irPraCompra = () => document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth", block: "center" });

  const caixinhas = (pos: Pos) => (
    <div className="rj-caixas" id={pos === "jogo" ? "comprar" : undefined}>
      <a className="rj-caixa rj-caixa-kit" href={ctaUrl(true, pos)}>
        {/* o selo é um adesivo; as barras kit.exe e pacote.exe e os pacotinhos saíram (Olivia, 10/10: "tem muita info, tira o pacote") */}
        <span className="rj-caixa-adesivo">compre 6, ganhe 1</span>
        <span className="rj-caixa-nome">Kit com 7 pacotes</span>
        <span className="rj-caixa-preco"><small>R$</small>{VENDA.kitPreco}</span>
        <span className="rj-caixa-apoio">R$ {VENDA.kitPorPacote} por pacote</span>
        {/* Olivia, 15/10: "vamos avisar do frete grátis no rango" (o kit passa da regra de frete grátis da Yampi) */}
        <span className="rj-caixa-frete">Frete grátis</span>
        <span className="rj-caixa-acao">Quero o kit</span>
      </a>
      <a className="rj-caixa" href={ctaUrl(false, pos)}>
        <span className="rj-caixa-adesivo rj-caixa-adesivo-claro">para provar</span>
        <span className="rj-caixa-nome">1 pacote</span>
        <span className="rj-caixa-preco"><small>R$</small>{VENDA.preco}</span>
        <span className="rj-caixa-apoio">500 g</span>
        <span className="rj-caixa-acao">Comprar</span>
      </a>
    </div>
  );

  return (
    <div className={`portal-page theme-light skin-2 rango-page rango-venda rj-page${VISUAL_FOFO ? " rj-fofo" : ""}`}>
      <PageMeta
        title="Rango do Dragão — o alimento completo da Comida de Dragão, feito com inseto"
        description="Comida natural úmida e completa para cães adultos, com proteína de inseto. Pouch de 500 g."
      />

      {/* sem a faixa rolante do topo (Olivia, 10/10: "tira a faixa"): os botões sobem para a primeira tela */}
      <main className="rj-painel">
        {/* TOPO COMPACTO (Olivia, 10/10: "os botões precisam aparecer na primeira tela. A gente tem bastante
            espaço em cima para aproveitar a comida de dragão, o rango do dragão, alimento completo. A gente
            pode repensar isso."). Marca, nome do produto e o que ele é numa linha só; título em seguida. */}
        {/* TOPO NO DESENHO DA /original (Olivia, 10/10: "em cima está muito ruim, veja a pág do original e
            como podemos trazer o hero dela para essa ideia"): volta e logo na mesma linha, a etiqueta de
            três palavras, o título grande no meio com a segunda linha em sombra verde, e o fundo pontilhado.
            A logo é a do adesivo que ela escolheu; a frase "alimento natural" virou figurinha colada na foto. */}
        <div className="rj-topo">
          <a href="https://www.comidadedragao.com.br" className="rj-backlink">← comida de dragão</a>
          <a href="https://www.comidadedragao.com.br" className="rj-logo" aria-label="Comida de Dragão: ir para a home da loja">
            <img className="rj-logo-img" src="/assets/images/rango/logo-adesivo-pb.webp" alt="Comida de Dragão" width={420} height={194} decoding="async" />
          </a>
        </div>
        {/* a faixa "alimento completo · úmido · com inseto" saiu (Olivia, 10/10: "pode tirar essa faixa") */}
        <h1 className="rj-titulo">
          Abrir e servir.<span>É a receita inteira.</span>
        </h1>

        {/* Olivia, 10/10 (tarde): "tira as três frases laterais, coloca o produto retangular retrato maior
            com os botões embaixo como estão"; as frases viraram três janelinhas mais abaixo e o resto
            da página passou a ser "uma LP normal", com tudo aberto. A foto deixou de ser botão.
            STOP MOTION: quatro fotos numa tira (rango-rasgo-tira.webp), ordem 1, 2, 3, 4, 3, 2, em looping;
            o rasgo fica dentro da borda do pacote e mostra a faixa inteira dos ingredientes. */}
        <div className="rj-pacote">
          <span className="rj-foto">
            {/* as quatro fotos moram numa tira só (rango-rasgo-tira.webp); o estilo mostra uma de cada vez */}
            <span className="rj-tira" role="img" aria-label="O pacote do Rango do Dragão rasga no meio, mostra os ingredientes e fecha de novo (ilustração)" />
          </span>
          {/* A figurinha do cão fica POR FORA do quadro, colada no canto (Olivia, 10/10); é o mesmo adesivo do vídeo. */}
          <img className="rj-cao" src="/assets/images/rango/rango-cao-adesivo.webp" alt="" aria-hidden="true" width={423} height={460} loading="eager" decoding="async" />
        </div>

        {/* AS DUAS CAIXINHAS (Olivia, 10/10: "eu não queria que o botão fosse assim. Eu queria que fossem
            duas caixinhas"). Cada caixa inteira é o botão. Preço depois do pacote (regra da casa). */}
        {/* DUAS COLUNAS (Olivia, 15/10): "comida natural" numa primeira coluna e os preços numa segunda. */}
        <div className="rj-compra">
          {/* o texto de apoio e o do frete moram numa janelinha, como o resto (Olivia, 10/10) */}
          <div className="rj-aberta rj-nota-caixa">
            <div className="rj-nota-corpo">
              <p className="rg-sub rj-sub">
                <strong>Comida natural</strong>, úmida e completa para cães adultos. Vem pronta, no pouch de 500 g.
              </p>
              <p className="rg-form-legal rj-legal">
                <strong>No kit, o frete é grátis.</strong> No pacote avulso, o frete é calculado no fim do pedido pelo seu CEP. Compra segura pela Yampi, com cartão, Pix ou boleto.
              </p>
            </div>
          </div>
          {caixinhas("jogo")}
        </div>

        {/* AS TRÊS FRASES, cada uma numa janelinha (Olivia, 10/10: "cria 3 janelinhas para as frases e coloca lá embaixo") */}
        <div className="rj-frases" aria-label="O Rango em três frases">
          {FRASES.map((f) => (
            <div key={f.arquivo} className={`rj-frase-janela rj-${f.cor}`}>
              <span className="rj-barra"><i aria-hidden="true" />{f.arquivo}</span>
              <span className="rj-frase-ceu"><img src={f.src} alt={f.alt} loading="lazy" decoding="async" /></span>
            </div>
          ))}
        </div>

        {/* O RESTO (Olivia, 15/10): tudo o que ensina vem antes dos vídeos, "para a pessoa aprender", e cada
            assunto dentro de uma caixinha. */}
        {/* Olivia, 15/10: "isso vira outro card" — a lista dos ingredientes numa janelinha, como as outras. */}
        <section className="rj-aberta rj-card rj-card-ingredientes">
          <div className="rj-barra rj-barra-aberta"><span><i aria-hidden="true" />ingredientes.txt</span></div>
          <div className="rj-card-corpo">
          {/* Olivia, 10/10: "fala normal aqui, só a lista dos ingredientes" e "larva = inseto". */}
          {/* Olivia, 15/10: "escreve alimento completo e natural no título da primeira caixinha de explicação" */}
          <h2 className="rj-h2">Alimento completo e natural</h2>
          <ul className="rj-ingredientes">
            <li>Filé mignon suíno</li>
            <li>Batata-doce</li>
            <li>Abóbora</li>
            <li>Chuchu</li>
            <li>Farinha de inseto (8%)</li>
          </ul>
          <p className="rj-nota">A composição completa vem no rótulo.</p>
          </div>
        </section>

        <section className="rj-aberta rj-card rj-aqua">
          <div className="rj-barra rj-barra-aberta"><span><i aria-hidden="true" />inseto.txt</span></div>
          <div className="rj-card-corpo">
          <h2 className="rj-h2">Ele não liga que é inseto. Só sabe que quer mais.</h2>
          <p>O nojo é humano; o apetite dele é que decide. Se o seu for do tipo desconfiado:</p>
          <ul className="rg-lista">
            <li><b>Comece misturando</b>: uma colher por cima do que ele já come, e vá aumentando.</li>
            <li><b>Sirva como refeição</b>: a dose por peso vem no rótulo.</li>
          </ul>
          </div>
        </section>

        <section className="rj-aberta rj-card rj-amarelo">
          <div className="rj-barra rj-barra-aberta"><span><i aria-hidden="true" />dose.txt</span></div>
          <div className="rj-card-corpo">
          <h2 className="rj-h2">Quanto pesa o seu cachorro?</h2>
          <div className="rj-pesos" role="group" aria-label="Peso do cachorro">
            {DOSES.map((d, i) => (
              <button key={d.peso} type="button" className={`rj-peso${peso === i ? " ativo" : ""}`} aria-pressed={peso === i} onClick={() => setPeso(i)}>
                {d.peso}
              </button>
            ))}
          </div>
          <div className="rj-dado"><strong>{DOSES[peso].dose.replace(" por dia", "")}</strong><span>por dia, pela tabela do rótulo</span></div>
          <p className="rj-nota">O pacote tem 500 g. A tabela completa vem no rótulo.</p>
          </div>
        </section>

        <section className="rj-aberta rj-card rj-violeta">
          <div className="rj-barra rj-barra-aberta"><span><i aria-hidden="true" />agua.txt</span></div>
          <div className="rj-card-corpo">
          <h2 className="rj-h2">Boa para cachorro que não bebe água.</h2>
          <p>É alimento úmido: até 75,6% de umidade pela ficha. Ele bebe comendo.</p>
          <div className="rj-dado"><strong>75,6%</strong><span>de umidade</span></div>
          </div>
        </section>

        <section className="rj-aberta rj-card rj-rosa">
          <div className="rj-barra rj-barra-aberta"><span><i aria-hidden="true" />garantia.txt</span></div>
          <div className="rj-card-corpo">
          <h2 className="rj-h2">Não topou? A gente devolve.</h2>
          <p>Se ele não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</p>
          <div className="rj-dado"><strong>14 dias</strong><span>para ele decidir</span></div>
          </div>
        </section>

        {/* VÍDEOS, depois de tudo o que ensina (Olivia, 15/10: "os vídeos vão para baixo"): numa janelinha "REELS.MOV", igual aos reels da home em janelinhas, e só com
            vídeo do próprio Rango ("no rango, já temos vídeos sobre ele"; "coloca só o da amora"). Sem o
            "ver tudo no Instagram": numa LP de venda, é uma saída da página. */}
        <section className="rj-aberta rj-reels-janela" aria-label="Vídeo de quem já provou o Rango">
          <div className="rj-barra rj-barra-aberta"><span><i aria-hidden="true" />REELS.MOV</span></div>
          <div className="portal-page rj-reels-host">
            <ReelsSection reels={VIDEOS_RANGO} title="Quem já provou o Rango" seeAllUrl="" />
          </div>
        </section>

        <h2 className="rj-h2 rj-fim-titulo">Bora encher o pote?</h2>
        {caixinhas("jogo-fim")}
      </main>

      {/* RODAPÉ igual ao das outras LPs (/original, /alergia), a pedido da Olivia (15/10) */}
      <footer className="rj-footer">
        <DragonLogo className="rj-footer-logo-svg" />
        <nav className="rj-footer-links">
          <a href="https://www.comidadedragao.com.br" target="_blank" rel="noopener noreferrer">Loja</a>
          <a href="/produtos">Linha completa</a>
          <a href="https://www.instagram.com/comidadedragao" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:somos@letsfly.com.br">Contato</a>
        </nav>
        <div className="rj-footer-tagline">Nojento é o desperdício.</div>
        <div className="rj-footer-legal">Comida de Dragão · Lets Fly · Biofábrica RJ · Reg. MAPA</div>
      </footer>

      {!comprarVisivel && (
        <div className="rg-sticky">
          <div className="rg-sticky-info">
            <strong>A partir de R$ {VENDA.preco}</strong>
            <span>Compre 6, ganhe 1 · frete grátis</span>
          </div>
          <button className="rg-btn rg-btn-sticky" onClick={irPraCompra}>Ver as ofertas</button>
        </div>
      )}
    </div>
  );
};

export default Rango;
