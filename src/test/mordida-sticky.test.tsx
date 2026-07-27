import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Mordida from "@/pages/Mordida";

/**
 * STICKY DA LP /mordida — a barra só pode aparecer DEPOIS que o CTA da hero
 * sai da tela.
 *
 * POR QUE ESTE TESTE EXISTE (27/07/26): a alternância nunca pôde ser conferida
 * no navegador — o pane de teste não entrega callbacks de IntersectionObserver
 * nem aplica scroll programático. Três tentativas deram três resultados
 * contraditórios do MESMO código. Aqui a IO é dublada, então o disparo é
 * determinístico: se alguém inverter a condição, o teste cai.
 */

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

let disparar: IOCallback | null = null;
let observados: Element[] = [];
let desconectou = false;

class IOFake {
  constructor(cb: IOCallback) {
    disparar = cb;
  }
  observe(el: Element) {
    observados.push(el);
  }
  disconnect() {
    desconectou = true;
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

const renderizar = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <Mordida />
      </MemoryRouter>
    </HelmetProvider>
  );

const barra = () => document.querySelector(".mdp-sticky-cta")!;
const visivel = () => barra().className.includes("is-visivel");

beforeEach(() => {
  disparar = null;
  observados = [];
  desconectou = false;
  vi.stubGlobal("IntersectionObserver", IOFake);
});

describe("sticky da LP /mordida", () => {
  it("nasce escondido e fora do alcance de leitor de tela", () => {
    renderizar();
    expect(visivel()).toBe(false);
    expect(barra().getAttribute("aria-hidden")).toBe("true");
  });

  it("observa o CTA da hero — não o banner, que não existe mais", () => {
    renderizar();
    expect(observados).toHaveLength(1);
    expect(observados[0]).toHaveClass("mdp-hero-cta-wrap");
  });

  it("APARECE quando o CTA da hero sai da tela", () => {
    renderizar();
    act(() => disparar!([{ isIntersecting: false }]));
    expect(visivel()).toBe(true);
    expect(barra().getAttribute("aria-hidden")).toBe("false");
  });

  it("SOME quando volta pro topo e o CTA reaparece", () => {
    renderizar();
    act(() => disparar!([{ isIntersecting: false }])); // rolou
    expect(visivel()).toBe(true);
    act(() => disparar!([{ isIntersecting: true }])); // voltou
    expect(visivel()).toBe(false);
  });

  it("desconecta o observer ao desmontar (sem vazamento)", () => {
    const { unmount } = renderizar();
    unmount();
    expect(desconectou).toBe(true);
  });

  it("sem IntersectionObserver, mostra a barra em vez de esconder pra sempre", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    renderizar();
    expect(visivel()).toBe(true);
  });

  it("o botão do sticky leva pro kit, com cta_pos=sticky", () => {
    renderizar();
    const link = barra().querySelector("a")!;
    const url = new URL(link.getAttribute("href")!);
    expect(url.pathname).toContain("kit-mordida-suplemento");
    expect(url.searchParams.get("cta_pos")).toBe("sticky");
  });
});

describe("bloco da oferta", () => {
  it("mostra o preço e o CTA de compra", () => {
    renderizar();
    // O preço aparece 2x de propósito: no bloco da oferta e na barra sticky.
    expect(screen.getAllByText(/R\$ 145,00/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Compre o kit com frete grátis/).length).toBeGreaterThan(0);
  });

  it("não chama o PRODUTO de hipoalergênico em lugar nenhum", () => {
    renderizar();
    const texto = document.body.textContent ?? "";
    // O claim válido é sempre sobre a PROTEÍNA. Se aparecer "produto
    // hipoalergênico" ou um selo solto, é regressão de claim.
    expect(texto).not.toMatch(/produto\s+hipoalerg/i);
  });
});
