

## Objetivo

Transformar o card "Manual do Criador" para ter a imagem `3.png` ("ENTRE NA NOSSA MATILHA") como visual inicial (no lugar da textura de caderno creme), com os textos em branco. No hover, manter a troca para o GIF atual do manual.

## Mudanças

### 1. Renomear e mover a imagem
- Copiar `user-uploads://3.png` para `public/assets/images/manual-criador-cover.png` (nome descritivo da função: capa do card Manual do Criador).

### 2. `src/pages/Portal.tsx` (linha 271–281)
Adicionar a imagem de fundo inline no `card-pdf-top` e ajustar classes para indicar tema escuro:

```tsx
<a href="/assets/pdfs/Manual%20do%20Criador.pdf" ... className="card card-pdf card-pdf-dark ratio-3-4">
  <HoverBg imgKey="manual" />
  <div
    className="card-pdf-top"
    style={{ backgroundImage: "url('/assets/images/manual-criador-cover.png')" }}
  >
    <div className="card-tag">Manual</div>
  </div>
  <div className="card-pdf-bottom">
    <div className="pdf-icon">📖</div>
    <div className="card-label">Manual do<br />Criador</div>
    <div className="card-sub">Clique e acesse o guia completo para criadores de conteúdo</div>
  </div>
</a>
```

### 3. `src/pages/Portal.css`
Adicionar regras para a variante `.card-pdf-dark`:

- `.card-pdf.card-pdf-dark` → fundo preto (`#0a0a0a`), borda escura.
- `.card-pdf-dark .card-pdf-top` → remover textura/listras creme, usar a imagem `3.png` em `cover/center`, sem o gradiente de linhas.
- `.card-pdf-dark .card-pdf-top .card-tag` → cor branca (`#fff` ou `rgba(255,255,255,0.85)`).
- `.card-pdf-dark .card-pdf-bottom` → fundo preto, borda-topo branca translúcida.
- `.card-pdf-dark .card-pdf-bottom .card-label` → cor branca.
- `.card-pdf-dark .card-pdf-bottom .card-sub` → cinza claro (`rgba(255,255,255,0.7)`).
- `.card-pdf-dark .card-pdf-bottom .pdf-icon` → manter laranja (já contrasta) ou trocar pra branco — manter laranja para consistência da marca.
- Sobrescrever a regra existente `.portal-page .card-pdf .card-body` (textura caderno) **apenas** quando NÃO for `.card-pdf-dark`, para não vazar a textura creme.

### 4. Comportamento do hover (sem mudanças)
O sistema atual já faz fade-out de `.card-pdf-top` e `.card-pdf-bottom` no hover e mostra `.card-img-hover` (o GIF do `manual`). Isso continua funcionando — só o "estado base" é que muda de creme→preto.

## Resultado

- **Estado base**: card preto com a arte "ENTRE NA NOSSA MATILHA" no topo, tag "MANUAL", ícone 📖 laranja, "Manual do Criador" e subtítulo em branco.
- **Hover**: fade para o GIF atual do manual, igual antes.
- Imagem fica em `public/assets/images/manual-criador-cover.png`.

