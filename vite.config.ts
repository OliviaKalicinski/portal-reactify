import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

/* ── HTML POR ROTA, SÓ PRAS META TAGS (28/09/2026) ─────────────────────────
   O robô de preview do WhatsApp/Facebook NÃO roda JavaScript: ele lê o
   index.html estático, e toda rota saía como "Hub do Dragão" (ver PageMeta.tsx).
   No build, copia o index.html pra dist/<rota>/index.html trocando title,
   description e og:/twitter:. O app é o mesmo — só o <head> muda.
   ⚠️ Depende de a hospedagem servir dist/<rota>/index.html antes do fallback
   da SPA. Conferir depois do Publish: curl na rota e ler o og:title. */
const SITE = "https://caverna.comidadedragao.com.br";
const METAS_POR_ROTA: Record<string, { title: string; description: string; image: string }> = {
  rango: {
    title: "Rango do Dragão — o alimento completo da Comida de Dragão, feito com inseto",
    description: "Comida natural úmida e completa para cães adultos, com proteína de inseto. Drop em 7 de outubro, lote limitado. Entre na lista e receba o aviso primeiro.",
    image: `${SITE}/assets/images/og-default.jpg`,
  },
  "qual-dragao": {
    title: "Que dragão mora na sua casa? — Comida de Dragão",
    description: "Seis perguntas sobre o seu pet. No fim, o veredito do Dragão, com a foto dele dentro.",
    image: `${SITE}/assets/images/og-qual-dragao.jpg`,
  },
};
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function htmlPorRota() {
  return {
    name: "html-por-rota",
    apply: "build" as const,
    closeBundle() {
      const base = path.resolve(__dirname, "dist/index.html");
      if (!fs.existsSync(base)) return;
      const html = fs.readFileSync(base, "utf8");
      for (const [rota, m] of Object.entries(METAS_POR_ROTA)) {
        const out = html
          .replace(/(<title[^>]*>)[^<]*<\/title>/, `$1${esc(m.title)}</title>`)
          .replace(/(name="description" content=")[^"]*/, `$1${esc(m.description)}`)
          .replace(/(property="og:title" content=")[^"]*/, `$1${esc(m.title)}`)
          .replace(/(property="og:description" content=")[^"]*/, `$1${esc(m.description)}`)
          .replace(/(property="og:image" content=")[^"]*/, `$1${m.image}`)
          .replace(/(name="twitter:title" content=")[^"]*/, `$1${esc(m.title)}`)
          .replace(/(name="twitter:description" content=")[^"]*/, `$1${esc(m.description)}`)
          .replace(/(name="twitter:image" content=")[^"]*/, `$1${m.image}`);
        fs.mkdirSync(path.resolve(__dirname, `dist/${rota}`), { recursive: true });
        fs.writeFileSync(path.resolve(__dirname, `dist/${rota}/index.html`), out);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), htmlPorRota()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
