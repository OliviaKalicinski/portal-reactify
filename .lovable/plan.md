# Trocar capas dos cards de "Onde Comprar"

Substituir as capas atuais (fundo colorido + texto "AMAZON / MERCADO LIVRE / PETLOVE") pelas três artes de adesivo enviadas, seguindo o mesmo padrão já usado nos cards de "Lojas" e "Escreve pro Dragão" (imagem como capa, sem texto).

## O que muda

Cards afetados na seção **Onde Comprar** do `/portal`:

1. **Amazon** → arte laranja com adesivo "amazon" (imagem 1)
2. **Mercado Livre** → arte cinza com adesivo "mercado livre" (imagem 3)
3. **Petlove** → arte roxa com adesivo "petlove" (imagem 2)

O quarto card (**Loja Oficial**) permanece como está.

O hover (GIF/imagem ao passar o mouse) continua funcionando normalmente — só a capa estática muda.

## Passos técnicos

1. **Salvar as 3 imagens** em `src/assets/`:
   - `src/assets/shop-amazon-cover.png` (de `user-uploads://11.png`)
   - `src/assets/shop-petlove-cover.png` (de `user-uploads://12.png`)
   - `src/assets/shop-ml-cover.png` (de `user-uploads://10.png`)

2. **`src/pages/Portal.tsx`** — na seção `{/* ONDE COMPRAR */}` (linha ~1084):
   - Importar as 3 novas imagens.
   - Adicionar `cover` ao objeto de cada shop (Amazon/ML/Petlove); deixar `cover: null` no Loja Oficial.
   - Renderizar `<img src={shop.cover} className="card-shop-cover" />` quando existir.
   - Remover (ou esconder via CSS) o `<div className="card-inner">` com `shop-name`/`shop-tag`/`shop-arrow` para esses 3 cards. Loja Oficial mantém o texto.

3. **`src/pages/Portal.css`** — adicionar:
   - `.card-shop-cover { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }` para a imagem cobrir o card inteiro.
   - Garantir que o hover overlay/GIF (`.card-img-hover`) fique acima da capa estática (já é o caso pelo z-index existente).
