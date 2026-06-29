// src/pages/Impacto.tsx
// Rota React que exibe a página IMPACTO (estática, em public/impacto/) em tela cheia.
// O React passa a TER a rota /impacto (some o 404) e o iframe carrega o arquivo estático.

const Impacto = () => {
  return (
    <iframe
      src="/impacto/index.html"
      title="IMPACTO — Comida de Dragão"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
};

export default Impacto;
