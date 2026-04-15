

## Hover reveal com GIF no card do Quiz

### O que muda

1. **`src/pages/Portal.tsx` linha 9**: trocar a URL da imagem de hover do quiz:
   ```ts
   quiz: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWpnam4wZDRibDB2b2xsY3g1ZXg3aGFtNmhzMms0dWt0M2UyMG1uYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/10FHR5A4cXqVrO/giphy.gif",
   ```

### Detalhes técnicos
- O componente `HoverBg` já usa `background-image` via CSS, que suporta GIFs animados nativamente — nenhuma alteração de componente é necessária.
- O GIF será carregado direto do Giphy (URL externa). Se preferir hospedar localmente, podemos baixar o arquivo para `public/assets/images/`.

### O que NÃO muda
- Nenhum componente, CSS, layout ou outro card.

