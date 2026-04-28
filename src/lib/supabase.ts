import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * SUPABASE CLIENT — singleton.
 *
 * Lê env vars expostas pelo Vite:
 *   VITE_SUPABASE_URL       — ex: https://abc123.supabase.co
 *   VITE_SUPABASE_ANON_KEY  — publishable key (sb_publishable_*)
 *
 * Em dev, vem de .env.local. Em produção, configurar no host
 * (Vercel / Netlify / Lovable Project Settings).
 *
 * Se faltar env, `supabase` é null — código que usa precisa lidar
 * com isso (modo offline / sem persistência).
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          // Por enquanto não usamos auth — só insert público em dragon_leads.
          // Quando ligar magic link em iteration 2, manter persistSession: true.
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

/** Utilitário pra logar 1x se faltou env (ajuda no debug em dev). */
if (!supabase && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY ausentes — " +
      "lead capture e perfil cross-device desativados. Confere .env.local."
  );
}
