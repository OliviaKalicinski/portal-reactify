import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/*
 * Bolinha fixa de WhatsApp ("Fale conosco") nas LPs de venda — igual à da loja Shopify
 * (snippets/fale-conosco.liquid do tema, 23–24/09/2026): círculo 48px violeta #925AED do Brand Guide,
 * ícone branco 26px, canto inferior esquerdo, borda e sombra #0f2626, foco rosa #ff0066.
 * Número: SAC (21) 3950-0576 (Persona de atendimento; rodapé da loja; 10h–17h).
 *
 * Só aparece depois que a pessoa rola um pouco (60% da altura da tela): na primeira tela ela cobria a tag de
 * desconto e o produto (Olivia, 24/09).
 *
 * Diferença da loja: lá a bolinha some quando aparece a barra "Comprar agora" (que já tem WhatsApp).
 * Nas LPs a barra fixa de compra não tem WhatsApp, então a bolinha sobe e fica logo acima dela.
 * A barra de cada LP é achada pela classe (todas terminam em "-sticky", "-sticky-cta" ou "-sticky-info"):
 * se uma LP nova usar outro nome, a bolinha pode ficar por cima da barra — conferir no celular.
 */

const WHATSAPP = "552139500576";
const MENSAGEM = "Oi! Vim pelo site e tenho uma dúvida.";

// Rotas das LPs de venda (inventário: _LANDING-PAGES.md no vault).
const ROTAS = new Set([
  "/alergia",
  "/idoso",
  "/gato-coceira",
  "/curiosidade",
  "/oquefalam",
  "/conheca",
  "/mordida",
  "/dupla",
  "/original",
  "/suplemento",
  "/grub",
  "/g/alergia",
  "/g/idoso",
  "/g/gato-coceira",
  "/g/grub",
  "/g/inseto",
]);

const ROLAGEM_MINIMA = 0.6; // fração da altura da tela que precisa ser rolada para a bolinha aparecer
const ESPACO = 12; // distância da bolinha até a borda da tela ou até a barra de compra, no celular

// Maior altura ocupada no pé da tela por uma barra fixa visível (a barra de compra da LP).
function alturaDaBarraFixa(): number {
  let maior = 0;
  const vh = window.innerHeight;
  document.querySelectorAll<HTMLElement>('[class*="sticky"]').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return;
    const r = el.getBoundingClientRect();
    if (r.height === 0 || r.width < window.innerWidth / 2) return; // só barras de largura de tela
    // precisa estar no quarto de baixo da tela e à vista (algumas barras flutuam a alguns px do pé, como a da /oquefalam)
    if (r.top < vh * 0.75 || r.top >= vh) return;
    maior = Math.max(maior, vh - r.top);
  });
  return maior;
}

const FaleConosco = () => {
  const { pathname } = useLocation();
  const ref = useRef<HTMLAnchorElement>(null);
  const ativa = ROTAS.has(pathname.replace(/\/+$/, "") || "/");

  useEffect(() => {
    if (!ativa) return;
    let quadro = 0;
    const posicionar = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const barra = alturaDaBarraFixa();
        // sobe por transform (não por `bottom`, que refaz o layout a cada quadro — auditoria UX M2, 24/09)
        el.style.setProperty("--sobe", barra > 0 ? `${barra}px` : "0px");
        el.classList.toggle("is-visivel", window.scrollY > window.innerHeight * ROLAGEM_MINIMA);
      });
    };
    posicionar();
    window.addEventListener("scroll", posicionar, { passive: true });
    window.addEventListener("resize", posicionar);
    // a barra de compra costuma aparecer (ou mudar de altura) depois da rolagem e do carregamento
    const obs = new MutationObserver(posicionar);
    obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class", "style"], childList: true });
    const t = window.setInterval(posicionar, 1000);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", posicionar);
      window.removeEventListener("resize", posicionar);
      obs.disconnect();
      window.clearInterval(t);
    };
  }, [ativa, pathname]);

  if (!ativa) return null;

  return (
    <>
      <style>{`
        .cdd-fale-conosco {
          position: fixed;
          left: 16px;
          bottom: 16px;
          z-index: 40;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #925AED;
          color: #FAFAFA;
          text-decoration: none;
          border: 2px solid #0f2626;
          box-shadow: 3px 3px 0 #0f2626;
          opacity: 0;
          visibility: hidden;
          transform: translateY(calc(8px - var(--sobe, 0px)));
          transition: opacity .25s ease, transform .25s ease, visibility 0s linear .25s;
        }
        .cdd-fale-conosco.is-visivel {
          opacity: 1;
          visibility: visible;
          transform: translateY(calc(-1 * var(--sobe, 0px)));
          transition: opacity .25s ease, transform .25s ease, visibility 0s;
        }
        .cdd-fale-conosco.is-visivel:hover { transform: translate(-1px, calc(-1px - var(--sobe, 0px))); box-shadow: 4px 4px 0 #0f2626; }
        .cdd-fale-conosco:focus-visible { outline: 3px solid #ff0066; outline-offset: 3px; }
        @media (max-width: 749px) {
          .cdd-fale-conosco { left: ${ESPACO}px; bottom: ${ESPACO}px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cdd-fale-conosco, .cdd-fale-conosco.is-visivel { transition: none; }
          .cdd-fale-conosco.is-visivel:hover { transform: translateY(calc(-1 * var(--sobe, 0px))); }
        }
      `}</style>
      <a
        ref={ref}
        className="cdd-fale-conosco"
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MENSAGEM)}`}
        target="_blank"
        rel="noopener"
        aria-label="Fale conosco pelo WhatsApp (abre em nova aba)"
        title="Fale conosco pelo WhatsApp"
      >
        <svg aria-hidden="true" focusable="false" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
        </svg>
      </a>
    </>
  );
};

export default FaleConosco;
