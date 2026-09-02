import { useEffect } from "react";

/**
 * PageMeta — SEO tags por página
 *
 * Como usar (não mudou nada pra quem chama):
 *   <PageMeta
 *     title="Produtos — Comida de Dragão"
 *     description="7 SKUs de proteína BSF pra pets..."
 *     image="/assets/images/kit-completo.png"  // opcional, usa default
 *     preload="/assets/images/hero.jpg"        // opcional, a imagem de LCP
 *   />
 *
 * Gera title + description + canonical + OG (Facebook/WhatsApp) + Twitter Card.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * 🔴 POR QUE ISTO NÃO USA MAIS O react-helmet-async (02/09/2026)
 *
 * A versão 3.0.0 instalada NÃO APLICA NADA. Não é configuração nossa: montei um
 * <HelmetProvider><Helmet><title>… isolado, fora do app, direto no console — e o
 * document.title não mudou. O provider está no lugar certo no App.tsx e o React
 * detectado é 18.3.1 (o caminho antigo da lib, não o do React 19).
 *
 * O sintoma: TODA página do portal servia o title, a description e a og:image do
 * index.html — "Comida de Dragão — Hub do Dragão" e a og-default. A prova de que
 * a lib estava inerte foi a canonical: o PageMeta é quem a cria, e não existia
 * nenhuma no <head> de nenhuma rota.
 *
 * Aqui a aplicação é DOM direto: acha a tag pelo seletor e atualiza; se não existir,
 * cria. As tags do index.html trazem data-rh="true" e são reaproveitadas — por isso
 * não nascem duplicatas, que era o defeito consertado em 19/08.
 *
 * ⚠️ O robô de preview do WhatsApp e do Facebook NÃO executa JavaScript. Isto conserta
 * o navegador e o Google (que executa), mas o card de um link compartilhado continua
 * saindo do HTML estático do index.html. Aquilo é outro trabalho: HTML por rota no
 * build, ou meta tags na página que recebe o link.
 * ───────────────────────────────────────────────────────────────────────────
 */

interface Props {
  title: string;
  description: string;
  image?: string;      // caminho relativo ou absoluto
  type?: string;       // default: "website"
  noindex?: boolean;   // true pra 404 e páginas internas
  preload?: string;    // imagem de LCP: vira <link rel="preload" as="image">
}

const SITE_URL = "https://www.comidadedragao.com.br";
const DEFAULT_IMAGE = "/assets/images/og-default.jpg";   // 19/08: JPG 1200x675 — WhatsApp/Facebook nao renderizam WebP no card de link

const abs = (path: string) => {
  if (path.startsWith("http")) return path;
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : SITE_URL;
  return `${origin}${path.startsWith("/") ? path : "/" + path}`;
};

/** acha a meta pelo atributo certo e atualiza; cria só se não existir */
const setMeta = (attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const setLink = (rel: string, href: string, extra?: Record<string, string>) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  if (extra) for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
};

const PageMeta = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  preload,
}: Props) => {
  useEffect(() => {
    const canonical = window.location.href;
    const absImage = abs(image);

    document.title = title;

    setMeta("name", "description", description);
    setLink("canonical", canonical);

    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", "Comida de Dragão");
    setMeta("property", "og:locale", "pt_BR");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", absImage);
    setMeta("property", "og:url", canonical);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:site", "@comidadedragao");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", absImage);

    /* robots só existe quando a página pede noindex — e SOME quando não pede,
       senão uma página interna contaminaria a seguinte na navegação SPA */
    if (noindex) setMeta("name", "robots", "noindex,nofollow");
    else document.head.querySelector('meta[name="robots"]')?.remove();

    /* o preload TEM que sumir quando a página seguinte não pede um: numa SPA ele
       ficava grudado e o navegador baixava o hero da página anterior à toa */
    if (preload) setLink("preload", abs(preload), { as: "image", fetchpriority: "high" });
    else document.head.querySelector('link[rel="preload"][as="image"]')?.remove();
  }, [title, description, image, type, noindex, preload]);

  return null;
};

export default PageMeta;
