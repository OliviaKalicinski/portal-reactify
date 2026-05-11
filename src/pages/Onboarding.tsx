/**
 * Onboarding · Manual do Criador (Casa de Lives)
 *
 * Renderiza o deck HTML standalone (public/onboarding-amplify/index.html)
 * dentro de um iframe full-viewport. Mantém a rota /onboarding limpa
 * sem expor o caminho real dos assets.
 */
import { Helmet } from "react-helmet-async";

const Onboarding = () => {
  return (
    <>
      <Helmet>
        <title>Manual do Criador · Comida de Dragão</title>
        <meta
          name="description"
          content="Manual do Criador da Casa de Lives — entre na nossa matilha."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <iframe
        src="/onboarding-amplify/index.html"
        title="Manual do Criador"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          border: 0,
          margin: 0,
          padding: 0,
          background: "#050505",
          display: "block",
        }}
      />
    </>
  );
};

export default Onboarding;
