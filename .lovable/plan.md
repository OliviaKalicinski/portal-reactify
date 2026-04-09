

## Problema

A logo está como `<img>`, que **não suporta `currentColor`**. O CSS `color: var(--skin-accent)` não tem efeito em tags `<img>`. Para o SVG responder à cor do tema, ele precisa ser **inline** (direto no JSX).

## Solução

Converter de `<img>` para SVG inline no `Portal.tsx`.

### Alterações

**`src/pages/Portal.tsx`**
- Remover: `<img src="/assets/images/logo-dragao.svg" alt="Comida de Dragão" className="hero-logo" />`
- No lugar, colar o conteúdo SVG diretamente como JSX, com `className="hero-logo"` e atributos React (`viewBox`, sem `id`, `xmlns` ok):

```tsx
<svg className="hero-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500" aria-label="Comida de Dragão">
  <g>
    {/* todos os <path> do logo-dragao.svg, com fill="currentColor" */}
  </g>
</svg>
```

Os `<path>` já usam `fill: currentColor` via a classe `.cls-1`, mas como inline SVG, vamos trocar `class="cls-1"` por `fill="currentColor"` diretamente em cada `<path>`.

**`src/pages/Portal.css`**
- Nenhuma alteração necessária. O CSS `.hero-logo` já define `color: var(--skin-accent)`, que agora vai funcionar porque o SVG inline herda `currentColor` do `color`.

### Resultado
A logo muda de cor automaticamente com cada skin (Fogo = laranja, Floresta = verde, Neon = pink).

