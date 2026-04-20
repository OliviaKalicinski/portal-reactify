

## Mudanças

Vou transformar o card "Na Mídia & Cobertura" (Portal → link para `/imprensa`) em um card com **vídeo de fundo em loop** usando o `aaa.mp4`. O hover preview (GIF do `companion`) é mantido — o vídeo some e o GIF aparece, igual aos outros cards.

### 1. Asset
- Copiar `user-uploads://aaa.mp4` → `public/assets/videos/imprensa-cover.mp4` (renomeado conforme pedido).

### 2. `src/pages/Portal.tsx` (linhas 355–365)
Adicionar classe `card-quiz-companion-video` ao `<a>` do Imprensa e incluir um `<video>` de fundo. O texto/lockup HTML é ocultado por CSS (a ideia é que o vídeo conte a história, igual fizemos com Instagram/WhatsApp).

```tsx
<a href="/imprensa" className="card card-quiz-companion card-quiz-companion-video">
  <HoverBg imgKey="companion" />
  <video
    className="card-bg-video"
    src="/assets/videos/imprensa-cover.mp4"
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
  />
  <div className="card-inner">
    <div className="card-body">
      <span className="cqc-label">// imprensa</span>
      <div className="card-label">Na Mídia &<br />Cobertura</div>
      <div className="card-sub">23 links — matérias, vídeos e o que falam sobre o Dragão</div>
    </div>
  </div>
  <div className="card-hover-overlay" />
</a>
```

### 3. `src/pages/Portal.css` — novas regras

```css
/* Imprensa card com vídeo de fundo */
.portal-page .card-quiz-companion-video { background: #000; }
.portal-page .card-quiz-companion-video .card-bg-video {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;             /* preenche o card sem deformar */
  object-position: center;
  z-index: 0;
  pointer-events: none;
  transition: opacity .35s ease;
}
/* Esconde o lockup HTML (vídeo já comunica) */
.portal-page .card-quiz-companion-video .card-body > * { display: none; }
.portal-page .card-quiz-companion-video .card-body { background: none; }
/* No hover: vídeo desaparece, GIF do HoverBg (companion) toma conta */
.portal-page .card-quiz-companion-video:hover .card-bg-video { opacity: 0; }
/* Garantir que o card-img-hover (GIF) fique acima do vídeo */
.portal-page .card-quiz-companion-video .card-img-hover { z-index: 1; }
```

> Atributos `muted` + `playsInline` + `autoPlay` garantem reprodução sem fricção em todos os browsers (incluindo iOS Safari). `preload="metadata"` evita baixar o vídeo inteiro até precisar.

### 4. Hover preview
Mantido. O `<HoverBg imgKey="companion" />` continua usando o GIF do Giphy já configurado no `CARD_HOVER_IMAGES`.

## Resultado

- Card "Na Mídia & Cobertura" passa a exibir `aaa.mp4` em loop como fundo.
- Texto antigo oculto (vídeo é o protagonista).
- Hover continua mostrando o GIF companion.
- Vídeo salvo como `public/assets/videos/imprensa-cover.mp4`.

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `public/assets/videos/imprensa-cover.mp4` | Novo (cópia renomeada de `aaa.mp4`) |
| `src/pages/Portal.tsx` | Adiciona classe + `<video>` no card de Imprensa |
| `src/pages/Portal.css` | Regras `.card-quiz-companion-video` (vídeo cover, oculta filhos, fade no hover) |

