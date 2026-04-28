import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * SUPABASE CLIENT — singleton.
 *
 * Tenta ler env vars expostas pelo Vite primeiro:
 *   VITE_SUPABASE_URL       — ex: https://abc123.supabase.co
 *   VITE_SUPABASE_ANON_KEY  — publishable key (sb_publishable_*)
 *
 * Se não achar (ex: Lovable não setou env vars no build), cai no
 * fallback hard-coded abaixo. A chave é PUBLISHABLE — o próprio Supabase
 * confirma "Publishable keys can be safely shared publicly". A segurança
 * dos dados é garantida pelas RLS policies (anon só faz INSERT em
 * dragon_leads / dragon-photos, nunca SELECT/UPDATE/DELETE).
 *
 * Em dev local, .env.local sobrescreve o fallback (permite apontar pra
 * outro projeto Supabase de staging sem mexer no código).
 */

const FALLBACK_URL = "https://pnqfpxvfjfyfdycrqlqb.supabase.co";
const FALLBACK_ANON_KEY = "sb_publishable_vkKJsKNAxZOFa4UBLEZXfw_pPeDLjqE";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL;
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || FALLBACK_ANON_KEY;

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
