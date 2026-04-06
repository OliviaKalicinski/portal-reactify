

## Problema

O sistema atual de hover usa `background-size: cover` em um div que cobre o card inteiro (`inset: 0`). Isso distorce/corta a imagem porque ela precisa preencher toda a área do card (proporção 3:4). O texto fica por cima com `z-index: 1`, mas o fundo sólido do `.card-body` também bloqueia a imagem.

A ideia do usuário é mais clara: o card deve ter **duas zonas verticais**:

```text
┌─────────────────────┐
│                     │  ← Zona superior: textura/cor padrão
│                     │     No HOVER: imagem (matilha.png)
│                     │     sem distorção, sem corte
│                     │
├─────────────────────┤
│ 📖 Manual do        │  ← Zona inferior: barra fixa com texto
│ Criador             │     Sempre visível, nunca muda
│ Clique e acesse...  │
└─────────────────────┘
```

## Plano

### 1. Reestruturar o HTML do card PDF (`Portal.tsx`)

Dividir o card em duas áreas:

- **Zona superior (~65% da altura)**: contém a textura de fundo (grid de linhas atual do `#f0ede6`) e o `HoverBg` posicionado apenas nessa zona. A imagem aparece com `object-fit: contain` ou `background-size: contain` para não distorcer.
- **Zona inferior (~35%)**: barra com fundo sólido (mesma cor `#f0ede6`) contendo o ícone 📖, título "Manual do Criador" e subtítulo. Esta barra é **sempre visível**, não muda no hover.

Substituir a estrutura atual do card-pdf por algo como:
```html
<div className="card card-pdf">
  <div className="card-pdf-top">
    <div className="card-tag">Manual</div>
    <HoverBg imgKey="manual" />  <!-- agora só cobre a zona superior -->
  </div>
  <div className="card-pdf-bottom">
    <div className="pdf-icon">📖</div>
    <div className="card-label">Manual do Criador</div>
    <div className="card-sub">Clique e acesse o guia...</div>
  </div>
</div>
```

### 2. CSS para o novo layout (`Portal.css`)

- `.card-pdf-top`: `position: relative; flex: 1; overflow: hidden;` — ocupa o espaço restante acima da barra.
- `.card-pdf-bottom`: `padding: 16px 22px; background: #f0ede6;` — barra fixa embaixo.
- `.card-pdf .card-img-hover`: agora posicionado dentro de `.card-pdf-top` apenas (não `inset: 0` do card inteiro), com `background-size: contain; background-repeat: no-repeat; background-position: center;`.
- Remover as regras que forçam `background-color: transparent` no hover do `.card-pdf`.

### 3. Imagem usada

Usar `matilha.png` (já existe em `public/assets/images/`) como hover do manual. Alterar em `CARD_HOVER_IMAGES`:
```
manual: "/assets/images/matilha.png"
```

### Arquivos alterados
- **`src/pages/Portal.tsx`** — reestruturar o card-pdf e trocar imagem de hover
- **`src/pages/Portal.css`** — adicionar `.card-pdf-top`, `.card-pdf-bottom`, ajustar `.card-img-hover` dentro do pdf

