import { Helmet } from "react-helmet-async";

/**
 * PageMeta — SEO tags por página
 *
 * Como usar:
 *   <PageMeta
 *     title="Produtos — Comida de Dragão"
 *     description="7 SKUs de proteína BSF pra pets..."
 *     image="/assets/images/kit-completo.png"  // opcional, usa default
 *   />
 *
 * Gera title + description + OG (Facebook/WhatsApp) + Twitter Card.
 * URL canonical é deduzida do window.location.
 */

interface Props {
  title: string;
  description: string;
  image?: string;      // caminho relativo ou absoluto
  type?: string;       // default: "website"
  noindex?: boolean;   // true pra 404 e páginas internas
}

const SITE_URL = "https://comidadedragao.com.br";
const DEFAULT_IMAGE = "/assets/images/canal-dragao-cover.webp";

const abs = (path: string) => {
  if (path.startsWith("http")) return path;
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : SITE_URL;
  return `${origin}${path.startsWith("/") ? path : "/" + path}`;
};

const PageMeta = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
}: Props) => {
  const canonical =
    typeof window !== "undefined" ? window.location.href : SITE_URL;
  const absImage = abs(image);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Comida de Dragão" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absImage} />
      <meta property="og:url" content={canonical} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@comidadedragao" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absImage} />
    </Helmet>
  );
};

export default PageMeta;
