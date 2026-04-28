import { supabase } from "./supabase";

const BUCKET = "dragon-photos";

/**
 * COMPRESS IMAGE — redimensiona pra max 1200×1200 e salva como JPEG 85%.
 *
 * - Lê o File como Image
 * - Calcula ratio mantendo aspect ratio
 * - Desenha em <canvas> e exporta toBlob('image/jpeg', 0.85)
 *
 * Resultado típico:
 *   - iPhone 12MP (4032×3024, ~3MB) → 1200×900 JPEG ~200KB
 *   - Foto antiga 2000×1500 → 1200×900 JPEG ~180KB
 *   - Foto pequena 800×600 → mantém 800×600 JPEG ~80KB
 */
export async function compressImage(
  file: File,
  maxSize = 1200,
  quality = 0.85
): Promise<Blob> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
    const w = Math.round(img.width * ratio);
    const h = Math.round(img.height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas-2d-context-unavailable");
    ctx.drawImage(img, 0, 0, w, h);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("canvas-toblob-failed"));
        },
        "image/jpeg",
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image-load-failed"));
    img.src = src;
  });
}

/** Gera UUID compatível com browsers modernos. Fallback usa Math.random (suficiente pra paths únicos). */
function genUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: uuid v4-ish baseado em Math.random
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * UPLOAD PROFILE PHOTO — comprime + sobe pro bucket dragon-photos.
 *
 * Path: profiles/{uuid}.jpg
 * Retorna: { url } com a URL pública (CDN do Supabase) ou null + error.
 *
 * Uso típico:
 *   const { url, error } = await uploadProfilePhoto(file);
 *   if (url) profile.photoUrl = url;
 */
export async function uploadProfilePhoto(
  file: File
): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) {
    return { url: null, error: "supabase-client-missing" };
  }

  try {
    const blob = await compressImage(file);
    const filename = `${genUuid()}.jpg`;
    const path = `profiles/${filename}`;

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, {
        contentType: "image/jpeg",
        upsert: false,
        cacheControl: "31536000", // cache 1 ano (URLs com UUID são imutáveis)
      });

    if (uploadErr) {
      // eslint-disable-next-line no-console
      console.warn("[uploads] upload failed:", uploadErr.message);
      return { url: null, error: uploadErr.message };
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, error: null };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[uploads] unexpected error:", err);
    return {
      url: null,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}
