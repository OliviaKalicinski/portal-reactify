import ReelsSection, { type Reel } from "@/components/ReelsSection";

/* ──────────────────────────────────────────────────────────────
   VÍDEOS VENCEDORES — faixa verde neon com os anúncios de creator
   que deram lucro (planilha "Originais de creator", 25/09/26).
   Padrão aprovado pela Olivia na /curiosidade em 25/09: sem textos,
   só os vídeos + setas; o vídeo só carrega no toque e abre com som.
   Fica logo abaixo dos reviews escritos, no lugar do carrossel de fotos.
   Arquivos: public/assets/videos/reels/vencedor-<creator>.mp4/.jpg (720×1280).
────────────────────────────────────────────────────────────── */

const v = (id: string, handle: string): Reel => ({
  id,
  src: `/assets/videos/reels/vencedor-${id}.mp4`,
  poster: `/assets/videos/reels/vencedor-${id}.jpg`,
  title: `@${handle}`,
});

export const VIDEOS = {
  mytribesete: v("mytribesete", "mytribesete"),
  pipo: v("pipo", "pipo.odachshund"),
  carla: v("carlavaccaroadestramento", "carlavaccaroadestramento"),
  gabi: v("gabibraunaguiar", "gabibraunaguiar"),
  sushijullie: v("sushijullie", "sushijullie"),
  vitydalmata: v("vitydalmata", "vitydalmata"),
  omeninomerlin: v("omeninomerlin", "omeninomerlin"),
  pitanga: v("pitanga", "pitanga_tanguinha"),
};

const VideosVencedores = ({ reels }: { reels: Reel[] }) => (
  <section
    style={{
      background: "#7BFF00",
      borderTop: "3px solid #0A0A0A",
      borderBottom: "3px solid #0A0A0A",
      padding: "28px 0 20px",
    }}
  >
    {/* o estilo do ReelsSection é escopado em .portal-page */}
    <div className="portal-page" style={{ background: "transparent", maxWidth: 1080, margin: "0 auto" }}>
      {/* sem "ver tudo no Instagram": numa LP de venda, é uma saída da página */}
      <ReelsSection reels={reels} title="" seeAllUrl="" />
    </div>
  </section>
);

export default VideosVencedores;
