import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import LeadPopup from "@/components/LeadPopup";

/**
 * O gatilho do popup é a parte que falha em silêncio: se abrir cedo demais,
 * cobre a oferta nas LPs de dor (4–13s de atenção medida no GA4); se não
 * abrir, ninguém percebe — só o lead que não vem.
 */
vi.mock("@/lib/lpLeads", () => ({ submitLpLead: vi.fn(async () => ({ ok: true })) }));

/** jsdom compartilha o mesmo document entre testes: sem zerar, o scroll de um
 *  teste vaza pro seguinte e o popup abre no piso de 5s sem ninguém rolar. */
const zerarScroll = () => {
  const h = document.documentElement;
  Object.defineProperty(h, "scrollHeight", { value: 0, configurable: true });
  Object.defineProperty(h, "clientHeight", { value: 0, configurable: true });
  h.scrollTop = 0;
};

const scrollarAte = (ratio: number) => {
  const h = document.documentElement;
  Object.defineProperty(h, "scrollHeight", { value: 2000, configurable: true });
  Object.defineProperty(h, "clientHeight", { value: 1000, configurable: true });
  h.scrollTop = (2000 - 1000) * ratio;
  window.dispatchEvent(new Event("scroll"));
};

describe("LeadPopup — gatilho", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    zerarScroll();
  });
  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = "";
  });

  const aberto = () => screen.queryByRole("dialog") !== null;

  it("não aparece na largada — respeita o piso de 5s", () => {
    render(<LeadPopup slug="alergia" />);
    act(() => { vi.advanceTimersByTime(4000); });
    expect(aberto()).toBe(false);
  });

  it("não abre por scroll antes do piso, mesmo com a pessoa rolando", () => {
    render(<LeadPopup slug="alergia" />);
    act(() => { scrollarAte(0.9); });
    expect(aberto()).toBe(false);
  });

  it("abre por scroll de 50% depois do piso", () => {
    render(<LeadPopup slug="alergia" />);
    act(() => { vi.advanceTimersByTime(5000); });
    act(() => { scrollarAte(0.5); });
    expect(aberto()).toBe(true);
  });

  it("abre por tempo aos 15s mesmo sem scroll", () => {
    render(<LeadPopup slug="idoso" />);
    act(() => { vi.advanceTimersByTime(14000); });
    expect(aberto()).toBe(false);
    act(() => { vi.advanceTimersByTime(1500); });
    expect(aberto()).toBe(true);
  });

  it("abre no exit-intent (cursor saindo pelo topo) depois do piso", () => {
    render(<LeadPopup slug="curiosidade" />);
    act(() => { vi.advanceTimersByTime(5000); });
    act(() => {
      const ev = new MouseEvent("mouseout", { bubbles: true });
      Object.defineProperty(ev, "clientY", { value: 0 });
      document.dispatchEvent(ev);
    });
    expect(aberto()).toBe(true);
  });

  it("não reaparece para quem já deixou o telefone", () => {
    localStorage.setItem("cdd_leadpopup_done", "1");
    render(<LeadPopup slug="alergia" />);
    act(() => { vi.advanceTimersByTime(20000); });
    expect(aberto()).toBe(false);
  });

  it("não reaparece dentro de 30 dias para quem fechou", () => {
    localStorage.setItem("cdd_leadpopup_dismissed_at", String(Date.now() - 5 * 24 * 60 * 60 * 1000));
    render(<LeadPopup slug="alergia" />);
    act(() => { vi.advanceTimersByTime(20000); });
    expect(aberto()).toBe(false);
  });

  it("volta a aparecer depois de 30 dias", () => {
    localStorage.setItem("cdd_leadpopup_dismissed_at", String(Date.now() - 31 * 24 * 60 * 60 * 1000));
    render(<LeadPopup slug="alergia" />);
    act(() => { vi.advanceTimersByTime(15500); });
    expect(aberto()).toBe(true);
  });
});

describe("LeadPopup — formulário", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    zerarScroll();
  });
  afterEach(() => vi.useRealTimers());

  const abrir = (slug = "alergia") => {
    render(<LeadPopup slug={slug} />);
    act(() => { vi.advanceTimersByTime(15500); });
  };

  it("mantém o botão desabilitado enquanto o telefone não é válido", () => {
    abrir();
    const btn = screen.getByRole("button", { name: /\[ entrar \]/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it("trava o scroll do fundo enquanto está aberto", () => {
    abrir();
    expect(document.body.style.overflow).toBe("hidden");
  });
});
