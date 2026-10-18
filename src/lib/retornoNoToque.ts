import { useEffect } from "react";

/* Retorno no toque dos botões de compra (18/10/2026).
   No Clarity (30 dias), 21% dos toques em "Bora experimentar" na /original ficaram
   marcados como toque sem resposta: o carrinho da Yampi demora a abrir dentro do
   navegador do Instagram (68% das sessões) e nada muda na tela enquanto isso.
   Aqui, no toque, o botão fica "apertado" e ganha um anel girando até a página
   seguinte abrir (CSS em index.css, classe .cta-abrindo). O texto não muda.
   Tocar na foto do produto (data-cta="foto") também acende o botão do topo. */

const CLASSE = "cta-abrindo";

function limpar() {
  document.querySelectorAll(`.${CLASSE}`).forEach((el) => {
    el.classList.remove(CLASSE);
    el.removeAttribute("aria-busy");
  });
}

function acender(el: Element) {
  el.classList.add(CLASSE);
  el.setAttribute("aria-busy", "true");
}

export function useRetornoNoToque() {
  useEffect(() => {
    let relogio: number | undefined;
    const aoTocar = (ev: MouseEvent) => {
      const alvo = (ev.target as Element | null)?.closest?.("a[data-cta]");
      if (!alvo) return;
      // Ctrl/Cmd+clique abre em outra aba: a página atual não sai, então não acende.
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
      acender(alvo);
      if (alvo.getAttribute("data-cta") === "foto") {
        const topo = document.querySelector('a[data-cta="hero"]');
        if (topo) acender(topo);
      }
      window.clearTimeout(relogio);
      // Se a página seguinte não abrir (rede caiu), o botão volta ao normal.
      relogio = window.setTimeout(limpar, 8000);
    };
    // Voltar do carrinho pelo "voltar" do navegador restaura a página da memória:
    // sem isto o botão continuaria girando.
    const aoVoltar = () => limpar();
    document.addEventListener("click", aoTocar);
    window.addEventListener("pageshow", aoVoltar);
    return () => {
      document.removeEventListener("click", aoTocar);
      window.removeEventListener("pageshow", aoVoltar);
      window.clearTimeout(relogio);
      limpar();
    };
  }, []);
}
