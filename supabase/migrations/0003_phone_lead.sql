-- ────────────────────────────────────────────────────────────────────────
-- 0003_phone_lead — Trocar email por telefone como lead principal
-- ────────────────────────────────────────────────────────────────────────
-- Decisão: WhatsApp >> email pro Brasil. Telefone vira o campo principal.
--
-- Mudanças:
--   1. Adiciona coluna `phone` em dragon_leads (TEXT)
--   2. Tornar email NULLABLE (mantém histórico, novos leads não preenchem)
--   3. Índice em phone pra queries de "esse lead já existe?"
--
-- Como rodar:
--   1. Supabase Dashboard → SQL Editor → New query
--   2. Cola este arquivo inteiro e clica RUN
--   3. Confere em Table Editor que `dragon_leads` tem a coluna `phone`
-- ────────────────────────────────────────────────────────────────────────

-- ─── 1. ADICIONAR COLUNA phone ─────────────────────────────────────────
-- Salvamos só dígitos (sem máscara) pra facilitar busca e dedup.
-- Ex: 11912345678 (DDD + 9 + 8 dígitos = celular)
alter table public.dragon_leads
  add column if not exists phone text;

-- ─── 2. TORNAR email NULLABLE ──────────────────────────────────────────
-- Leads antigos têm email preenchido. Novos leads vão preencher só phone.
-- Mantemos a coluna pra não perder histórico, mas relaxamos NOT NULL.
alter table public.dragon_leads
  alter column email drop not null;

-- ─── 3. ÍNDICE em phone ────────────────────────────────────────────────
-- Olivia vai querer queryar por telefone (export pra CRM, lookup manual).
create index if not exists dragon_leads_phone_idx
  on public.dragon_leads (phone);

-- ─── FIM ───────────────────────────────────────────────────────────────
