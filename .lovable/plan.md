

## Corrigir build errors + Substituir imagem da Biblioteca

### 1. Substituir imagem do card Biblioteca Científica
- Copiar `user-uploads://15.png` para `public/assets/images/biblioteca-hover.png`
- Em `Portal.tsx` linha 8, trocar `"/assets/images/nojento-desperdicio.png"` por `"/assets/images/biblioteca-hover.png"`
- Deletar `public/assets/images/nojento-desperdicio.png`

### 2. Fix build error: módulo `@/data/quizzes` não encontrado
- O arquivo existe em `src/pages/quizzes.ts` mas o import aponta para `@/data/quizzes`
- Criar pasta `src/data/` e mover `src/pages/quizzes.ts` para `src/data/quizzes.ts`

### 3. Fix build error: DragonLogo não aceita prop `style`
- Em `src/components/DragonLogo.tsx`, adicionar `style?: React.CSSProperties` à interface `DragonLogoProps` e passá-la ao `<svg>`

### O que NÃO muda
- Nenhum CSS, layout, card ou outro arquivo além dos listados

