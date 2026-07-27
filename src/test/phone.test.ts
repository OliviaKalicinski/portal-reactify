import { describe, it, expect } from "vitest";
import { normalizePhoneDigits, formatPhoneBR, isValidPhoneBR } from "@/lib/phone";

/**
 * Os casos abaixo NÃO são inventados: saíram da lista de espera da Mordida V2
 * (84 inscritos, 21–27/07/26), onde 10 telefones chegaram inutilizáveis.
 */

describe("normalizePhoneDigits — o +55 não pode comer o final do número", () => {
  it("tira o código do país de um celular completo", () => {
    expect(normalizePhoneDigits("+55 21 98259-7136")).toBe("21982597136");
    expect(normalizePhoneDigits("5521982597136")).toBe("21982597136");
  });

  it("tira o código do país de um fixo completo", () => {
    expect(normalizePhoneDigits("552122674893")).toBe("2122674893");
  });

  it("preserva o DDD 55 de verdade (Santa Maria/RS)", () => {
    expect(normalizePhoneDigits("55984587927")).toBe("55984587927");
    expect(normalizePhoneDigits("+55 55 98458-7927")).toBe("55984587927");
  });

  it("tira o zero de DDD", () => {
    expect(normalizePhoneDigits("021982597136")).toBe("21982597136");
  });

  it("não mexe num número nacional já correto", () => {
    expect(normalizePhoneDigits("(11) 98966-4655")).toBe("11989664655");
  });
});

describe("isValidPhoneBR — barrar o toco, não só contar dígitos", () => {
  // Estes 9 entraram no banco como válidos e ninguém consegue mais falar
  // com essas pessoas. Cada um tem 11 dígitos — a regra antiga (>= 10) passou.
  const tocos = [
    "55119809920", // Laryssa
    "55319965112", // Maria Clara
    "55199936794", // Marcia Protti
    "55219825971", // Claudia Groposo (a mesma pessoa acertou noutra inscrição)
    "55839966804", // Bruna Gabriela
    "55559960694", // Carolina
    "55489995452", // Teresinha
    "55119403997", // Vicentina
    "55199930412", // Silvana Morais
  ];

  it.each(tocos)("rejeita o número truncado %s", (toco) => {
    expect(isValidPhoneBR(toco)).toBe(false);
  });

  it("rejeita número com dígitos faltando", () => {
    expect(isValidPhoneBR("1199907333")).toBe(false); // Alessandro, 10 dígitos com cara de celular
  });

  it("aceita celular e fixo de verdade", () => {
    expect(isValidPhoneBR("11989664655")).toBe(true);
    expect(isValidPhoneBR("2122674893")).toBe(true);
    expect(isValidPhoneBR("55984587927")).toBe(true); // DDD 55 legítimo
  });

  it("aceita o número digitado com +55", () => {
    expect(isValidPhoneBR("+55 21 98259-7136")).toBe(true);
  });

  it("rejeita DDD impossível", () => {
    expect(isValidPhoneBR("0912345678")).toBe(false); // DDD não começa com 0
    expect(isValidPhoneBR("1012345678")).toBe(false); // DDD 10 não existe
  });

  it("aceita o discado antigo com 0 na frente do DDD", () => {
    expect(isValidPhoneBR("09932345678")).toBe(true); // 0 + DDD 99 + fixo 3234-5678
  });

  it("rejeita celular sem o nono dígito disfarçado de fixo", () => {
    // 10 dígitos, mas o assinante começa em 9 — fixo começa em 2–5.
    expect(isValidPhoneBR("1198765432")).toBe(false);
  });
});

describe("formatPhoneBR", () => {
  it("formata progressivamente enquanto digita", () => {
    expect(formatPhoneBR("1")).toBe("(1");
    expect(formatPhoneBR("11")).toBe("(11");
    expect(formatPhoneBR("119")).toBe("(11) 9");
    expect(formatPhoneBR("11989664655")).toBe("(11) 98966-4655");
  });

  it("se a pessoa digita o +55, o final aparece — não some", () => {
    expect(formatPhoneBR("5511989664655")).toBe("(11) 98966-4655");
  });
});
