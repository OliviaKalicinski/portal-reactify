

## Substituir imagem de fundo do Audiocast

### O que muda

1. **Copiar** `user-uploads://audiocats.png` para `public/assets/images/audiocast-hover.png`
2. **Atualizar** `src/pages/Portal.tsx` linha 10: trocar `"/assets/images/Audiocast.png"` por `"/assets/images/audiocast-hover.png"`
3. **Deletar** `public/assets/images/Audiocast.png`

### O que NÃO muda
- Nenhum CSS, layout, logo, card ou outro arquivo

