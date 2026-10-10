import { useEffect, useRef, useState } from "react";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import VideosVencedores, { VIDEOS } from "@/components/VideosVencedores";
import "./Portal.css";
import "./Rango.css";
import "./RangoJogo.css";

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
   10/10, Olivia: "não vamos subir ao lado, vamos substituir". Esta página passa a ser a /rango;
   a anterior (Rango.tsx) fica guardada em /rango-antiga, sem aparecer em busca.
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

type JanelaId = "pote" | "larva" | "quanto" | "agua" | "garantia" | "matilha";
const JANELAS: { id: JanelaId; arquivo: string; titulo: string; cor: string }[] = [
  { id: "pote", arquivo: "o_pote.exe", titulo: "O que tem dentro", cor: "lima" },
  { id: "larva", arquivo: "inseto.exe", titulo: "É inseto mesmo?", cor: "amarelo" },
  { id: "quanto", arquivo: "quanto.exe", titulo: "Quanto ele come", cor: "aqua" },
  { id: "agua", arquivo: "agua.exe", titulo: "Ele não bebe água?", cor: "violeta" },
  { id: "garantia", arquivo: "garantia.exe", titulo: "Não topou? A gente devolve", cor: "rosa" },
  { id: "matilha", arquivo: "matilha.exe", titulo: "Vídeos da matilha", cor: "laranja" },
];
const REELS_PROVA = [VIDEOS.sushijullie, VIDEOS.mytribesete, VIDEOS.pipo, VIDEOS.carla, VIDEOS.gabi];

const RangoJogo = () => {
  const [aberta, setAberta] = useState<JanelaId | null>(null);
  const [peso, setPeso] = useState(1);
  const [comprarVisivel, setComprarVisivel] = useState(true);
  const conteudoRef = useRef<HTMLDivElement>(null);

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

  const abrir = (id: JanelaId) => {
    setAberta((atual) => (atual === id ? null : id));
    // espera a janela montar e traz ela para a tela, sem animação longa
    requestAnimationFrame(() => conteudoRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };
  const irPraCompra = () => document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth", block: "center" });

  const caixinhas = (pos: Pos) => (
    <div className="rj-caixas" id={pos === "jogo" ? "comprar" : undefined}>
      <a className="rj-caixa rj-caixa-kit" href={ctaUrl(true, pos)}>
        {/* o selo é um adesivo e os pacotes aparecem dentro; as barras kit.exe e pacote.exe saíram (Olivia, 10/10) */}
        <span className="rj-caixa-adesivo">compre 6, ganhe 1</span>
        <img className="rj-caixa-foto rj-caixa-foto-kit" src="/assets/images/rango/caixa-kit-7-pacotes.webp" alt="" aria-hidden="true" width={330} height={210} decoding="async" />
        <span className="rj-caixa-nome">Kit com 7 pacotes</span>
        <span className="rj-caixa-preco"><small>R$</small>{VENDA.kitPreco}</span>
        <span className="rj-caixa-apoio">R$ {VENDA.kitPorPacote} por pacote</span>
        <span className="rj-caixa-acao">Quero o kit</span>
      </a>
      <a className="rj-caixa" href={ctaUrl(false, pos)}>
        <span className="rj-caixa-adesivo rj-caixa-adesivo-claro">para provar</span>
        <img className="rj-caixa-foto" src="/assets/images/rango/caixa-1-pacote.webp" alt="" aria-hidden="true" width={135} height={200} decoding="async" />
        <span className="rj-caixa-nome">1 pacote</span>
        <span className="rj-caixa-preco"><small>R$</small>{VENDA.preco}</span>
        <span className="rj-caixa-apoio">500 g</span>
        <span className="rj-caixa-acao">Comprar</span>
      </a>
    </div>
  );

  const janela = JANELAS.find((j) => j.id === aberta);

  return (
    <div className="portal-page theme-light skin-2 rango-page rango-venda rj-page">
      <PageMeta
        title="Rango do Dragão — o alimento completo da Comida de Dragão, feito com inseto"
        description="Comida natural úmida e completa para cães adultos, com proteína de inseto. Pouch de 500 g."
        noindex={typeof window !== "undefined" && window.location.pathname !== "/rango"}
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

        <button
          type="button"
          className="rj-pacote"
          onClick={() => abrir("pote")}
          aria-label="Ver o que tem dentro do pacote do Rango do Dragão"
        >
          {/* STOP MOTION do saco rasgando, em looping, abrindo e fechando (Olivia, 10/10: "pega o vídeo do
              criar anúncios que tem esse efeito e tira quatro fotos desse processo"; "ele precisa ser um
              stop motion, fica em looping, e o pacote tem que fechar e abrir, não só abrir").
              Olivia, depois: "a parte verde consegue ficar céu? e o rasgo ser só no pacote?". Os quatro
              quadros vieram limpos da conversa "Criar anúncios" (composição parada com as mesmas peças do
              vídeo rango-oferta: céu, pacote, faixa de ingredientes, rolo e o cão), com a câmera parada.
              Olivia, em seguida: "o rasgo começa antes do pacote. Não pode, tem que ser junto ou um
              milímetro depois": a arte do pacote tem margem transparente, e a faixa ia de 3% a 97% da caixa;
              passou a ir de 9% a 91,5%, dentro da borda de verdade (48 a 611 de 660), e o rolo para em cima dela.
              Depois: "ele pode rasgar mais para mostrar o conteúdo todo": a foto dos ingredientes entra inteira
              na faixa (carne, batata-doce e abóbora, chuchu e farinha) e o rolo ficou mais fino.
              Ordem: 1, 2, 3, 4, 3, 2 e volta ao 1. */}
          <span className="rj-foto">
            {/* as quatro fotos moram numa tira só (rango-rasgo-tira.webp); o estilo mostra uma de cada vez */}
            <span className="rj-tira" role="img" aria-label="O pacote do Rango do Dragão rasga no meio, mostra os ingredientes e fecha de novo (ilustração)" />
            <img className="rj-frase" src="/assets/images/rango/frase-alimento-natural.webp" alt="Alimento natural" width={444} height={234} decoding="async" />
            {/* mais duas frases do catálogo do Rango (pág. 10), embaixo de "alimento natural"; a rosa veio em pé e foi deitada (Olivia, 10/10) */}
            <img className="rj-frase rj-frase-2" src="/assets/images/rango/frase-nao-precisa-congelar.webp" alt="Não precisa congelar" decoding="async" />
            <img className="rj-frase rj-frase-3" src="/assets/images/rango/frase-com-farinha-de-bsf.webp" alt="Com farinha de BSF" decoding="async" />
          </span>
          {/* a frase "alimento natural" (peça do Rango, pág. 15) fica dentro da foto, sempre no azul do céu (Olivia, 10/10) */}
          {/* A figurinha do cão fica POR FORA do quadro, colada no canto (Olivia, 10/10); é o mesmo adesivo do vídeo. */}
          <img className="rj-cao" src="/assets/images/rango/rango-cao-adesivo.webp" alt="" aria-hidden="true" width={423} height={460} loading="eager" decoding="async" />
        </button>

        {/* AS DUAS CAIXINHAS (Olivia, 10/10: "eu não queria que o botão fosse assim. Eu queria que fossem
            duas caixinhas"). Cada caixa inteira é o botão. Preço depois do pacote (regra da casa). */}
        {caixinhas("jogo")}
        {/* o texto de apoio e o do frete moram numa janelinha, como o resto (Olivia, 10/10) */}
        <div className="rj-aberta rj-nota-caixa">
          <div className="rj-nota-corpo">
        <p className="rg-sub rj-sub">
          <strong>Comida natural</strong>, úmida e completa para cães adultos. Vem pronta, no pouch de 500 g.
        </p>
        <p className="rg-form-legal rj-legal">
          Frete calculado no fim do pedido pelo seu CEP. Compra segura pela Yampi, com cartão, Pix ou boleto.
        </p>
          </div>
        </div>

        {/* AS JANELINHAS — cada uma é um botão e responde uma dúvida. */}
        <div className="rj-grade" role="group" aria-label="O que você quer saber sobre o Rango">
          {JANELAS.map((j) => (
            <button
              key={j.id}
              type="button"
              className={`rj-janela rj-${j.cor}${aberta === j.id ? " ativa" : ""}`}
              aria-expanded={aberta === j.id}
              aria-controls="rj-conteudo"
              onClick={() => abrir(j.id)}
            >
              <span className="rj-barra"><i aria-hidden="true" />{j.arquivo}</span>
              <span className="rj-janela-titulo">{j.titulo}</span>
            </button>
          ))}
        </div>

        <div id="rj-conteudo" ref={conteudoRef} aria-live="polite">
          {janela && (
            <section className={`rj-aberta rj-${janela.cor}`}>
              <div className="rj-barra rj-barra-aberta">
                <span><i aria-hidden="true" />{janela.arquivo}</span>
                <button type="button" className="rj-fechar" onClick={() => setAberta(null)} aria-label="Fechar esta janela">×</button>
              </div>
              <div className="rj-corpo">
                {janela.id === "pote" && (
                  <>
                    {/* Olivia, 10/10: "fala normal aqui, só a lista dos ingredientes" e "larva = inseto". */}
                    <h2 className="rj-h2">O que tem dentro</h2>
                    <ul className="rj-ingredientes">
                      <li>Filé mignon suíno</li>
                      <li>Batata-doce</li>
                      <li>Abóbora</li>
                      <li>Chuchu</li>
                      <li>Farinha de inseto (8%)</li>
                    </ul>
                    <p className="rj-nota">A composição completa vem no rótulo.</p>
                  </>
                )}
                {janela.id === "larva" && (
                  <>
                    <h2 className="rj-h2">Ele não liga que é inseto. Só sabe que quer mais.</h2>
                    <p>O nojo é humano; o apetite dele é que decide. Se o seu for do tipo desconfiado:</p>
                    <ul className="rg-lista">
                      <li><b>Comece misturando</b>: uma colher por cima do que ele já come, e vá aumentando.</li>
                      <li><b>Sirva como refeição</b>: a dose por peso vem no rótulo.</li>
                    </ul>
                  </>
                )}
                {janela.id === "quanto" && (
                  <>
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
                  </>
                )}
                {janela.id === "agua" && (
                  <>
                    <h2 className="rj-h2">Boa para cachorro que não bebe água.</h2>
                    <p>É alimento úmido: até 75,6% de umidade pela ficha. Ele bebe comendo.</p>
                    <div className="rj-dado"><strong>75,6%</strong><span>de umidade</span></div>
                  </>
                )}
                {janela.id === "garantia" && (
                  <>
                    <h2 className="rj-h2">Não topou? A gente devolve.</h2>
                    <p>Se ele não topar em 14 dias da entrega, a gente devolve seu dinheiro. Sem letrinha miúda.</p>
                    <div className="rj-dado"><strong>14 dias</strong><span>para ele decidir</span></div>
                  </>
                )}
                {janela.id === "matilha" && (
                  <>
                    <h2 className="rj-h2">O Rango acabou de chegar. Os petiscos já têm fã.</h2>
                    <p>Vídeos de tutores com os outros produtos da marca.</p>
                  </>
                )}
              </div>
              {janela.id === "matilha" && <VideosVencedores reels={REELS_PROVA} />}
            </section>
          )}
        </div>

        <h2 className="rj-h2 rj-fim-titulo">Bora encher o pote?</h2>
        {caixinhas("jogo-fim")}
      </main>

      <footer className="portal-footer">
        <DragonLogo className="footer-logo-svg" />
        <div className="footer-tagline">Nojento é o desperdício.</div>
      </footer>

      {!comprarVisivel && (
        <div className="rg-sticky">
          <div className="rg-sticky-info">
            <strong>A partir de R$ {VENDA.preco}</strong>
            <span>Compre 6, ganhe 1</span>
          </div>
          <button className="rg-btn rg-btn-sticky" onClick={irPraCompra}>Ver as ofertas</button>
        </div>
      )}
    </div>
  );
};

export default RangoJogo;
