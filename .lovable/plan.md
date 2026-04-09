

## Mudanças no Hero Tagline

Duas alterações cirúrgicas: texto no TSX e estilo no CSS. Nada mais é tocado.

### 1. Portal.tsx — Trocar `heroTaglineContent` (linhas 182-192)

```tsx
const heroTaglineContent = nameUpper ? (
  <>
    {nameUpper}, SE VOCÊ CHEGOU AQUI, JÁ FAZ PARTE DA REVOLUÇÃO.
    <span className="hero-tagline-sub">segue o fio...</span>
  </>
) : (
  <>
    ALIMENTO PARA PETS À BASE DE INSETO.
    <span className="hero-tagline-sub">segue o fio...</span>
  </>
);
```

- Remove `<strong>` e `<br />` anteriores
- Texto já em maiúsculas no JSX (CSS `text-transform: uppercase` reforça)
- Adiciona `<span className="hero-tagline-sub">` como subtexto

### 2. Portal.css — Alterar APENAS `.hero-tagline` (linhas 160-165)

Substituir as regras existentes por:

```css
.portal-page .hero-tagline {
  font-size: 28px;
  font-weight: 300;
  color: rgba(250,250,250,0.65);
  margin-top: 20px;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.4;
  text-transform: uppercase;
  text-align: center;
}

.portal-page .hero-tagline-sub {
  display: block;
  font-size: 14px;
  text-transform: lowercase;
  color: rgba(255,255,255,0.4);
  margin-top: 8px;
}
```

No `@media (max-width: 768px)` existente, adicionar:

```css
.portal-page .hero-tagline {
  font-size: 20px;
}
```

### O que NÃO muda

- Logo SVG (`.hero-logo`) — zero alterações
- `hero-content` layout — mantém `text-align: center` e `align-items: center`
- Input de nome, cards, footer, controles, CSS global — intocados
- Linha `.hero-tagline strong` pode ser removida pois não há mais `<strong>`

