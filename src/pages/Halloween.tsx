import { useEffect } from "react";
import PageMeta from "@/components/PageMeta";
import { captureEntryUtms, buildCheckoutUrl } from "@/lib/utm";
import { trackViewContent } from "@/lib/pixel";
import "./Halloween.css";

/* ──────────────────────────────────────────────────────────────
   /halloween · "Larvas e Travessuras" (19 a 31/10/2026)
   Página de VENDA da promoção de Halloween: compre um kit e ganhe um suplemento.
   Visual do cartão-postal da campanha (Canva), peças em /assets/halloween/.

   RASCUNHO (16/10/2026), não está no ar:
   - Promoção SÓ PARA CÃO (Olivia, 18/10): saiu o kit de gatos. Ficam os 7 kits
     ativos de cão na Shopify (preços lidos em 16/10).
   - BOTÃO ÚNICO (Olivia, 18/10): todos os botões levam à loja, não a um carrinho por kit.
     Os cards são só vitrine. O brinde vai ser configurado nos produtos depois:
     ANTES DE IR AO AR, conferir que o suplemento entra sozinho no carrinho ao pôr um kit.
   - Qual suplemento vai de brinde e a validade do lote: a confirmar (ficha da campanha).
   ────────────────────────────────────────────────────────────── */

const UTM_FALLBACK = { utm_source: "lp-halloween", utm_medium: "lp", utm_campaign: "halloween-2026" };

/* `vem`: o que vem na caixa, lido na descrição da Shopify em 18/10. `sku` vira content_id no pixel.
   `frete`: frete grátis automático dos kits; o Original + Mordida não tem (regra da casa). */
type Kit = { nome: string; img: string; preco: string; sku: string; vem: string; frete: boolean };

/* Destino do botão único. A coleção "kits" tem 8 produtos, incluindo o Kit para Gatos (fora da
   promoção). Trocar pela coleção só com os 7 kits de cão quando ela existir. */
const LOJA = "https://www.comidadedragao.com.br/collections/kits";

const CDN = "https://cdn.shopify.com/s/files/1/0895/4311/5055/files/";
const KITS: Kit[] = [
  { nome: "Kit Comida de Dragão para Cães", img: CDN + "Anuncios_Multiplataforma_Mordida_Suplemento_030f2ec7-353e-45e0-ae37-979a624c15ec.png?v=1785160455", preco: "144,50", sku: "1302", vem: "Original 90g + Suplemento Integral 180g", frete: true },
  { nome: "Kit Completo para Cães", img: CDN + "kit-dog-supremo.png?v=1785150064", preco: "184,60", sku: "1306", vem: "Original 90g + Mordida 180g + Suplemento Integral 180g", frete: true },
  { nome: "Kit Comida de Dragão Original", img: CDN + "Anuncios_Multiplataforma_Original_3x_4804eede-2fc5-41aa-b9a6-3ca0a3c2c776.png?v=1785160614", preco: "120,20", sku: "1101", vem: "3 Original", frete: true },
  { nome: "Kit 3 Mordidas", img: CDN + "kit-mordidas.png?v=1785150064", preco: "120,20", sku: "1304", vem: "3 Mordida de 180g", frete: true },
  { nome: "Kit Mordida + Suplemento", img: CDN + "kit-dog-mordida-suplemento.png?v=1785150064", preco: "144,50", sku: "1305", vem: "Mordida 180g + Suplemento Integral 180g", frete: true },
  { nome: "Kit Original + Mordida", img: CDN + "kit-petiscos.png?v=1785150064", preco: "80,10", sku: "1303", vem: "Original 90g + Mordida 180g", frete: false },
  { nome: "Kit Rango do Dragão (compre 6, ganhe 1)", img: CDN + "Copia_de_Anuncios_Multiplataforma_Rango_do_Dragao_1.png?v=1791472229", preco: "185,40", sku: "1501", vem: "7 pacotes de Rango, refeição completa para cão adulto", frete: true },
];

/* Suplemento de brinde: a confirmar qual (ficha da campanha). Integral, preço lido na Shopify em 18/10. */
const SUPLEMENTO = { img: CDN + "Anuncios_Multiplataforma_Suplemento_Integral.png?v=1785161368", preco: "110,00" };

const FAQ = [
  { q: "Como eu ganho o suplemento?", a: "É só comprar um dos 7 kits para cães da loja. O suplemento já vai junto no mesmo pedido, sem cupom." },
  { q: "Até quando vale?", a: "Até 31 de outubro, ou enquanto durar o estoque do suplemento." },
  { q: "É larva mesmo?", a: "É. Larva de mosca soldado negro, criada para isso e desidratada. Proteína que o seu pet reconhece como comida." },
  { q: "O suplemento vem no mesmo pacote?", a: "Vem. Ele entra no mesmo pedido do kit, sem custo, e chega junto." },
  /* Garantia: a mesma da /original (14 dias). Olivia, 18/10: "a gente sempre devolve se a pessoa não gostar".
     A política de troca na Shopify (só arrependimento em 7 dias, lacrado) está atrás da prática. */
  { q: "E se o meu pet não gostar?", a: "Se ele não topar em 14 dias da entrega, a gente devolve o seu dinheiro." },
  { q: "Ficou alguma dúvida?", a: "Chama a gente no WhatsApp: (21) 3950-0576." },
];

export default function Halloween() {
  useEffect(() => {
    captureEntryUtms();
    trackViewContent({ content_name: "LP Halloween — kit + suplemento", content_id: "lp-halloween", value: 0 });
  }, []);
  const loja = (pos: string) => buildCheckoutUrl(LOJA, UTM_FALLBACK, pos);

  return (
    <div className="hw">
      <PageMeta
        title="Larvas e Travessuras — Comida de Dragão"
        description="Halloween da Comida de Dragão: compre um kit e ganhe um suplemento. Só até 31/10."
      />

      {/* Topo no molde da /original (Olivia, 18/10): logo à esquerda, promoção de cara,
          "Larvas e Travessuras" em cima da foto, barra fixa de compra no pé. */}
      <header className="hw-hero">
        <div className="hw-topo">
          <a href="https://www.comidadedragao.com.br/collections/produtos">
            <img className="hw-logo" src="/assets/halloween/logo-comida-de-dragao-escorrendo.webp" alt="Comida de Dragão" />
          </a>
        </div>

        <span className="hw-eyebrow">promoção sinistra de Halloween</span>
        <h1 className="hw-h1">Compre um kit e<br /><span>ganhe um suplemento.</span></h1>
        <p className="hw-sub">Escolha qualquer kit para cães e o suplemento vai junto, de presente. Sem cupom. Só até 31/10.</p>
        <p className="hw-oque">Comida de Dragão é alimento de larva de mosca soldado negra para cães: uma proteína que ele provavelmente nunca comeu.</p>

        <div className="hw-foto">
          <div className="hw-cta-foto">
            <a className="hw-botao hw-botao--foto" href={loja("foto")} data-cta="foto">Escolher meu kit →</a>
            {/* suplemento "voando" com um + na frente, à direita do botão (Olivia, 18/10: trocou de lado) */}
            <span className="hw-cta-mais" aria-hidden>
              <b>+</b>
              <img src={SUPLEMENTO.img} alt="" />
            </span>
          </div>
          <img className="hw-cao" src="/assets/halloween/cena-chihuahua-po-caindo.webp" alt="Cachorro hipnotizado olhando o pote do suplemento flutuar e despejar o pó na tigela de ração" />
          <img className="hw-titulo" src="/assets/halloween/titulo-larvas-e-travessuras.webp" alt="Larvas e Travessuras" />
        </div>
      </header>

      <a className="hw-barra" href={loja("barra")} data-cta="barra">
        <span className="hw-barra-txt">Kit + suplemento<small>de presente até 31/10</small></span>
        <strong className="hw-barra-btn">Escolher →</strong>
      </a>

      <section className="hw-bloco hw-papel" id="kits">
        <img className="hw-selo hw-selo--esq" src="/assets/halloween/selo-halloween-gato-preto.webp" alt="" aria-hidden />
        <h2 className="hw-h2">Escolha o kit.<br />O suplemento vem junto.</h2>
        {/* Grade dos 7 kits retirada (Olivia, 18/10: "ficou muita coisa"); a lista KITS fica no
            arquivo para voltar fácil. Os kits aparecem na loja, para onde o botão leva. */}
        <p className="hw-texto">Vale para qualquer um dos 7 kits para cães da loja. Você escolhe lá, e o suplemento entra no pedido.</p>
        <a className="hw-botao" href={loja("kits")} data-cta="kits">Escolher meu kit →</a>
      </section>

      <section className="hw-bloco">
        <img className="hw-selo hw-selo--dir" src="/assets/halloween/selo-halloween-original.webp" alt="" aria-hidden />
        <h2 className="hw-h2 hw-h2--claro">Por que tem larva<br />no pote do seu pet?</h2>
        <p className="hw-texto">Porque é a proteína que ele reconhece como comida de verdade. Larva de mosca soldado negro, criada para isso e desidratada, sem nojinho para o seu pet.</p>
      </section>

      <section className="hw-bloco hw-papel">
        <h2 className="hw-h2">Antes de comprar</h2>
        <div className="hw-faq">
          {FAQ.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>

      <footer className="hw-fim">
        <img className="hw-titulo hw-titulo--pequeno" src="/assets/halloween/titulo-larvas-e-travessuras.webp" alt="Larvas e Travessuras" />
        <p className="hw-oferta-chamada">Compre um kit e <strong>ganhe um suplemento</strong>. Só até 31/10.</p>
        <a className="hw-botao" href={loja("final")} data-cta="final">Escolher meu kit</a>
        <img className="hw-dragao" src="/assets/halloween/silhueta-dragao.webp" alt="" aria-hidden />
      </footer>
    </div>
  );
}
