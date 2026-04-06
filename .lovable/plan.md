

## Diagnóstico

Dois problemas encontrados no `Portal.tsx`:

1. **Manual do Criador**: O estado `manualOpen` existe (linha 70) e a função `openManual` é chamada ao clicar no card (linha 262), mas **não existe nenhum modal renderizado** que responda a esse estado. O catálogo tem um modal completo (linhas 608-662), mas o manual não tem equivalente.

2. **Audiocast**: O estado `audioOpen` existe (linha 71) e `openAudio` é chamado ao clicar no card (linha 305), mas **não existe nenhum player de áudio renderizado** no componente. Não há `<audio>` element nem UI de player.

---

## Plano de Correção

### 1. Adicionar modal do Manual do Criador

Criar um modal idêntico ao do catálogo (mesmo estilo com overlay, botão fechar, imagem centralizada) logo após o modal do catálogo. Usará as imagens `poster-punk-converte.png` e/ou `poster-punk-gato.png` como páginas do manual (ou a imagem que melhor represente o manual). O modal responderá ao estado `manualOpen`.

### 2. Adicionar player de áudio flutuante

Criar um mini-player flutuante que aparece quando `audioOpen` é `true`. Incluirá:
- Um elemento `<audio>` com ref (`audioRef` já existe)
- Controles de play/pause
- Botão de minimizar (usa `audioMinimized` que já existe)
- Botão de fechar
- Visual estilizado no tema do Portal (waveform, tag "Audiocast")
- Posicionamento fixo no canto inferior direito
- Placeholder de áudio (URL de exemplo ou arquivo local) — o usuário poderá substituir depois

### Arquivos alterados
- `src/pages/Portal.tsx` — adicionar os dois blocos de UI (modal manual + player áudio)
- `src/pages/Portal.css` — adicionar estilos para o player de áudio flutuante

