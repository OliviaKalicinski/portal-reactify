import { createClient } from "@supabase/supabase-js";

/**
 * CAPTURA DO POPUP — pré-lançamento da Mordida V2 (nome + telefone).
 *
 * Grava no projeto Supabase "Landing Page", tabela dedicada
 * `prelancamento_mordida` (name + phone). RLS permite INSERT anônimo e
 * bloqueia SELECT — a chave anon é publishable (segura de expor).
 *
 * Não-bloqueante: erro só loga, a pessoa vê sucesso mesmo assim (UX antes
 * da captura, mesmo padrão do resto das LPs).
 */
const LP_URL = "https://vswgmjhcfchompqdrjht.supabase.co";
const LP_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzd2dtamhjZmNob21wcWRyamh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2OTY5OTUsImV4cCI6MjA2ODI3Mjk5NX0.R90UOEylx35cd6DpLYxI9nX9-B3B-1PutFSrM3R4W-c";

const lpClient = createClient(LP_URL, LP_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function submitMordidaSignup(payload: {
  name: string;
  phone: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await lpClient.from("prelancamento_mordida").insert({
      name: payload.name.trim(),
      phone: payload.phone.replace(/\D/g, ""), // só dígitos
      source: "popup_mordida_v2",
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.warn("[mordida-signup] insert failed:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[mordida-signup] unexpected error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
