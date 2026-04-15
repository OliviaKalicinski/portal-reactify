

## Problema

No mobile (≤680px), todos os cards são forçados a `padding-top: 62%` (formato retangular deitado). Isso distorce os GIFs que foram pensados para formatos mais quadrados ou verticais.

## Solução

Substituir o `padding-top: 62% !important` genérico por aspect ratios específicos para cada tipo de card no mobile, mantendo proporções mais quadradas/verticais que funcionam melhor com os GIFs.

## Mudanças em `src/pages/Portal.css`

Na media query `@media (max-width: 680px)` (linha 1118):

- **Remover** a regra genérica `.card-inner::before { padding-top: 62% !important; }`
- **Adicionar** ratios individuais por tipo de card:
  - `.ratio-16-9 .card-inner::before` → `padding-top: 75%` (mais quadrado, para o card de vídeo)
  - `.ratio-3-4 .card-inner::before` → `padding-top: 120%` (manter vertical, para Manual)
  - `.ratio-1-1 .card-inner::before` → `padding-top: 100%` (manter quadrado, para Produtos)
  - `.ratio-3-5 .card-inner::before` → `padding-top: 140%` (manter vertical, para Audio)
  - `.ratio-5-4 .card-inner::before` → `padding-top: 100%` (mais quadrado, para Biblioteca/Instagram)
  - `.ratio-shop .card-inner::before` → `padding-top: 80%` (levemente quadrado)
- Cards sem `.card-inner` (como `.card-pdf`) usam flex layout, então adicionar `min-height` adequado para manter proporção vertical
- Cards de quiz/companion: ajustar `min-height` para manter formato mais quadrado

Isso garante que os GIFs fiquem bem tanto no desktop quanto no mobile, sem distorção.

