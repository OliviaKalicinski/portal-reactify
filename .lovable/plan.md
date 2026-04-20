

## Problema

Hoje o card "Manual do Criador" tem duas zonas visualmente separadas:
- `.card-pdf-top` → imagem "ENTRE NA NOSSA MATILHA"
- `.card-pdf-bottom` → barra preta com 📖, "Manual do Criador" e subtítulo

Mesmo as duas sendo pretas, a barra inferior empurra a imagem pra cima e a imagem aparece com `contain` (com espaço sobrando), criando a sensação de "card dividido em dois".

A intenção é: **a imagem ocupa o card inteiro e o texto fica sobreposto a ela**, como uma legenda em overlay.

## Solução

Reestruturar o card dark para ter **uma única camada visual** (a imagem cobrindo o card todo) e o texto posicionado por cima, na parte inferior, com um leve gradiente de legibilidade.

### 1. `src/pages/Portal.tsx` (linhas 271–284)

Trocar a estrutura `top + bottom` por **uma única div de fundo + overlay de texto absoluto**:

```tsx
<a
  href="/assets/pdfs/Manual%20do%20Criador.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="card card-pdf card-pdf-dark ratio-3-4"
  style={{ backgroundImage: "url('/assets/images/manual-criador-cover.png')" }}
>
  <HoverBg imgKey="manual" />
  <div className="card-tag card-tag-overlay">Manual</div>
  <div className="card-pdf-overlay">
    <div className="pdf-icon">📖</div>
    <div className="card-label">Manual do<br />Criador</div>
    <div className="card-sub">Clique e acesse o guia completo para criadores de conteúdo</div>
  </div>
</a>
```

Pontos:
- Imagem vai direto no `<a>` como `background-image` (cobrindo o card inteiro).
- `.card-pdf-top` e `.card-pdf-bottom` deixam de existir nesse card.
- O texto fica em `.card-pdf-overlay`, posicionado absoluto no rodapé do card, por cima da imagem.

### 2. `src/pages/Portal.css` — refazer regras `.card-pdf-dark` (linhas 1387–1426)

Substituir o bloco atual por:

```css
.portal-page .card-pdf.card-pdf-dark {
  background: #0a0a0a;
  background-size: cover;       /* imagem cobre o card inteiro */
  background-position: center top;
  background-repeat: no-repeat;
  border-color: #1a1a1a;
  position: relative;
  overflow: hidden;
}
.portal-page .card-pdf.card-pdf-dark:hover {
  border-color: var(--dragon-orange);
}

/* Volta o card para proporção quadrada (igual à imagem) */
.portal-page .card-pdf.card-pdf-dark.ratio-3-4 {
  aspect-ratio: 1 / 1;
}

/* Tag "Manual" no canto superior, sobre a imagem */
.portal-page .card-pdf-dark .card-tag-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  color: rgba(255,255,255,0.9);
  background: rgba(0,0,0,0.45);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Overlay de texto no rodapé, sobre a imagem */
.portal-page .card-pdf-dark .card-pdf-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px 18px 18px;
  z-index: 2;
  color: #fff;
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.85) 0%,
    rgba(0,0,0,0.55) 55%,
    rgba(0,0,0,0) 100%
  );
}
.portal-page .card-pdf-dark .card-pdf-overlay .pdf-icon { color: var(--dragon-orange); }
.portal-page .card-pdf-dark .card-pdf-overlay .card-label { color: #fff; }
.portal-page .card-pdf-dark .card-pdf-overlay .card-sub { color: rgba(255,255,255,0.75); }
```

Remover (ou deixar inertes) as regras antigas que criavam a barra inferior:
- `.card-pdf-dark .card-pdf-top` → não usado mais
- `.card-pdf-dark .card-pdf-bottom` → não usado mais
- `.card-pdf-dark .card-body` overrides → não usado mais

### 3. Hover

`HoverBg` continua funcionando — ele renderiza um `<div className="card-img-hover">` absoluto que cobre o card. Como agora não temos mais `.card-pdf-top/bottom` para fazer fade-out, o GIF simplesmente aparece **por cima** da capa estática + overlay de texto no hover (já é o comportamento padrão do `card-img-hover`).

Se quisermos esconder o texto no hover (recomendado, pra não sobrepor o GIF), adicionar:

```css
.portal-page .card-pdf-dark:hover .card-pdf-overlay,
.portal-page .card-pdf-dark:hover .card-tag-overlay {
  opacity: 0;
  transition: opacity .25s ease;
}
.portal-page .card-pdf-dark .card-pdf-overlay,
.portal-page .card-pdf-dark .card-tag-overlay {
  transition: opacity .25s ease;
}
```

## Resultado

- Card 1:1, com a arte "ENTRE NA NOSSA MATILHA" ocupando 100% da área (sem barra inferior separando).
- "MANUAL" como tag pequena no topo-esquerdo, sobre a imagem.
- 📖 + "Manual do Criador" + subtítulo no rodapé, em branco, sobre um gradiente preto sutil para legibilidade.
- No hover, texto some e o GIF do manual aparece, igual antes.

## Mudanças por arquivo

| Arquivo | Mudança |
|---|---|
| `src/pages/Portal.tsx` | Trocar estrutura `card-pdf-top/bottom` por imagem no `<a>` + `.card-pdf-overlay` com o texto sobreposto. |
| `src/pages/Portal.css` | Reescrever bloco `.card-pdf-dark` (1387–1426): imagem cobre o card todo, aspect-ratio 1:1, overlay com gradiente, fade do texto no hover. |

