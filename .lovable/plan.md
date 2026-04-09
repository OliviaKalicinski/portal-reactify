

## Plano: Popup com vídeo SharkTank no botão "O Dragão Fala"

### O que muda

O botão "🐉 O Dragão Fala" vai continuar abrindo o mesmo popup draggable (modal-window), mas o conteúdo interno passa a ser o vídeo `SharkTank Insta .mp4` em vez do texto do manifesto.

### Alterações em `src/pages/Portal.tsx`

1. **Conteúdo do modal** (linhas 587-601): substituir todo o `.modal-body` (textos do manifesto + botões) por um `<video>` apontando para `/assets/videos/SharkTank Insta .mp4`:

```tsx
<div className="modal-body" style={{ padding: 0 }}>
  <video
    src={`/assets/videos/${encodeURIComponent("SharkTank Insta .mp4")}`}
    controls
    autoPlay
    style={{ width: "100%", display: "block", borderRadius: "0 0 12px 12px" }}
  />
</div>
```

2. **Título da titlebar** (linha 584): trocar "A Carta do Dragão" por "🐉 O Dragão Fala".

3. **Parar vídeo ao fechar**: no `closeModal`, pausar o vídeo (via ref ou simplesmente desmontando com condicional `{modalOpen && ...}`).

### Alterações em `src/pages/Portal.css`

Nenhuma alteração necessária — o modal já tem o estilo de janela arrastável.

### Arquivos alterados
- `src/pages/Portal.tsx`

