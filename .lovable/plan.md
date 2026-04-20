

## Resposta à dúvida

**Não, o card não está dividido em dois.** Ele é um único bloco. O que você vê como "barra" na metade inferior é apenas um gradiente escuro (`rgba(0,0,0,0.72)` → transparente) aplicado por cima do fundo roxo, para dar legibilidade ao texto branco "INSTAGRAM / @comidadedragao / Posts, stories...". A parte de cima fica mais clara (roxo puro com a câmera 📸 estilizada) e a de baixo escurece — daí a aparência de duas faixas. É tudo a mesma camada.

Como a imagem `4.png` já contém **todo** o lockup tipográfico (INSTAGRAM + @COMIDADEDRAGAO + subtítulo) embutido na arte, a estratégia certa é fazer a imagem ocupar o card inteiro, sem corte, e remover/ocultar o texto HTML existente — senão ficaria duplicado.

## Mudanças

### 1. Asset
- Copiar `user-uploads://4.png` → `public/assets/images/instagram-cover.png`.

### 2. `src/pages/Portal.tsx` (linha 388–395)
Adicionar uma classe `card-social-ig-img` ao card e esconder os filhos textuais (mais simples: deixar o JSX como está e ocultar via CSS pela nova classe — preserva acessibilidade mínima caso a imagem falhe; alternativa é remover o markup interno). Vou pela via CSS:

```tsx
<a ... className="card card-social card-social-ig card-social-ig-img ratio-5-4" ...>
  <HoverBg imgKey="instagram" />
  <div className="card-inner"><div className="card-body">
    <span className="social-icon">📸</span>
    <div className="card-tag">Instagram</div>
    <div className="card-label">@comida<br />dedragao</div>
    <div className="card-sub">Posts, stories, reels e o Dragão provocando todo dia</div>
  </div></div>
</a>
```

### 3. `src/pages/Portal.css`
Adicionar nova regra para a variante com imagem:

```css
/* Instagram com cover-art (a arte já contém todo o lockup) */
.portal-page .card-social-ig.card-social-ig-img {
  background-image: url('/assets/images/instagram-cover.png');
  background-size: cover;        /* preenche sem deformar */
  background-position: center;
  background-repeat: no-repeat;
  background-color: #000;        /* fundo preto da arte casa com bordas */
}
/* a arte tem proporção retrato (~4:5). Ajustar o ratio do card pra não cortar. */
.portal-page .card-social-ig.card-social-ig-img.ratio-5-4 .card-inner::before {
  padding-top: 125%;             /* 4:5 retrato — combina com a imagem */
}
/* Esconder texto/ícone HTML — a tipografia já está dentro da imagem */
.portal-page .card-social-ig.card-social-ig-img .card-body > * {
  display: none;
}
/* Remover o gradiente escuro do .card-body que criava o efeito de "barra" */
.portal-page .card-social-ig.card-social-ig-img .card-body {
  background: none;
}
```

> Nota sobre `background-size`: a arte 4.png tem fundo preto sólido nas bordas, então `cover` não vai gerar corte visual problemático — mas se preferir garantir que **nada** de tipografia seja cortada, troco para `contain`. Vou usar `cover` por padrão (mantém o card cheio) e o `padding-top: 125%` já casa com a proporção da imagem para não sobrar barra preta.

### 4. Hover preview
**Mantido sem mudanças.** O `<HoverBg imgKey="instagram" />` continua funcionando — no hover, fade-out do `.card-body` (regra global existente já cobre) e aparece `matilha.png`.

## Resultado

- Card Instagram exibe a arte 4.png inteira como fundo único (sem divisão visual).
- Tipografia HTML antiga oculta (a arte já tem tudo).
- Hover continua trocando para `matilha.png`.
- Imagem salva como `public/assets/images/instagram-cover.png`.

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `public/assets/images/instagram-cover.png` | Novo (cópia de 4.png) |
| `src/pages/Portal.tsx` | Adiciona classe `card-social-ig-img` ao `<a>` do Instagram |
| `src/pages/Portal.css` | Nova regra `.card-social-ig-img` (background, ratio, oculta filhos, remove gradiente) |

