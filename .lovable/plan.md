

## Problema

A imagem `manual-criador-cover.png` é quadrada (1:1) e contém o lockup completo "ENTRE NA NOSSA MATILHA". No card atual:
1. O `.card-pdf-top` está com `background-size: cover`, que corta as bordas para preencher a área.
2. A área disponível para a imagem é menor que quadrada porque o card tem ratio 3:4 e uma barra inferior (`card-pdf-bottom`) com 📖 + "Manual do Criador" + subtítulo ocupa parte vertical.
3. O resultado: as letras "E" do "ENTRE" e o "a" final de "MATILHa" são cortados nas laterais.

## Solução

Ajustar o card para que a imagem caiba inteira, sem cortes, mantendo o lockup legível.

### 1. `src/pages/Portal.css` — variante dark (linhas 1387–1422)

**a) Mostrar a imagem inteira (sem corte)** — trocar `background-size: cover` por `contain` na variante dark:

```css
.portal-page .card-pdf-dark .card-pdf-top {
  background-color: #0a0a0a;
  background-image: none; /* setado inline no TSX */
  background-size: contain;        /* ← mudou de cover */
  background-position: center;
  background-repeat: no-repeat;
}
```

`contain` garante que a imagem inteira apareça dentro da área, sem corte. Como a imagem é quadrada e tem fundo preto, vai casar perfeitamente com o fundo `#0a0a0a` do card — não vai aparecer "barra preta" estranha, vai parecer contínuo.

**b) Ajustar proporção do card** — trocar `ratio-3-4` por uma proporção mais quadrada, para a imagem aparecer maior e a barra inferior ficar compacta. Adicionar override específico:

```css
/* Card Manual dark: proporção mais alta para acomodar imagem quadrada + barra inferior */
.portal-page .card-pdf.card-pdf-dark.ratio-3-4 .card-inner::before {
  padding-top: 115%; /* ~quadrado + espaço pra barra inferior */
}
```

(Observação: cards `.card-pdf` usam flex em vez de `.card-inner::before`. Vou verificar e, se necessário, usar `aspect-ratio` direto no `.card-pdf-dark`.)

### 2. `src/pages/Portal.tsx` (linha 271)

Sem mudanças estruturais na marcação. Apenas garantir que o `style` inline no `.card-pdf-top` continua com a imagem.

### 3. Resultado esperado

- A imagem "ENTRE NA NOSSA MATILHA" aparece **inteira**, centralizada, com todo o texto visível.
- O fundo preto da imagem se funde com o fundo preto do card → parece um único bloco.
- A barra inferior ("📖 Manual do Criador / Clique e acesse...") permanece com texto branco.
- Hover continua trocando para o GIF do manual.

## Mudanças por arquivo

| Arquivo | Mudança |
|---|---|
| `src/pages/Portal.css` | `background-size: cover` → `contain` na regra `.card-pdf-dark .card-pdf-top`. Ajuste de proporção do card dark se necessário. |
| `src/pages/Portal.tsx` | Sem mudanças (a menos que o ajuste de proporção exija uma classe extra). |

