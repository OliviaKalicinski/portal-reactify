import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./Portal.css";
import "./NotFound.css";

const MENSAGENS = [
  "Você caiu num lugar que nem o Dragão viu. Talvez nunca existiu. Talvez foi devorado.",
  "O Dragão procurou. O Dragão não achou. Acontece.",
  "Essa rota sumiu. Ou você digitou errado. Ou o universo mudou de ideia.",
  "404. O Dragão também não sabe o que aconteceu aqui.",
  "Lugar nenhum. Mas a matilha tá esperando você lá no hub.",
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Mensagem aleatória a cada render (não guardar em state — sai ok mesmo com rerender raro)
  const mensagem = useMemo(
    () => MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)],
    []
  );

  return (
    <div className="portal-page notfound-page skin-1">
      <PageMeta
        title="Não encontrado · Comida de Dragão"
        description="O Dragão não achou essa página. Volta pro hub."
        noindex
      />

      <section className="notfound-hero">
        <div className="notfound-hero-bg" />
        <div className="notfound-silhouette">🐉</div>

        <div className="notfound-content">
          <div className="notfound-code">404</div>
          <DragonLogo className="notfound-logo" />
          <h1 className="notfound-title">
            O Dragão <span>não encontrou isso.</span>
          </h1>
          <p className="notfound-message">{mensagem}</p>

          <div className="notfound-path">
            <span className="notfound-path-label">rota tentada:</span>
            <code className="notfound-path-value">{location.pathname}</code>
          </div>

          <div className="notfound-actions">
            <Link to="/portal" className="notfound-btn-primary">
              Voltar pro hub →
            </Link>
            <Link to="/produtos" className="notfound-btn-secondary">
              Ver produtos
            </Link>
          </div>

          <p className="notfound-quote">"Nojento é o desperdício."</p>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
