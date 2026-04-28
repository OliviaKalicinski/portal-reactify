-- ────────────────────────────────────────────────────────────────────────
-- 0001_dragon_leads — Tabela de leads do Quiz do Dragão
-- ────────────────────────────────────────────────────────────────────────
-- Append-only log de cada submissão do gate de email (após o 1º quiz).
-- Sem auth nessa iteração: o `anon` role pode INSERT mas não SELECT.
-- Olivia consulta os leads via dashboard Supabase ou SQL Editor.
--
-- Como rodar:
--   1. Supabase Dashboard → seu projeto → SQL Editor → New query
--   2. Cola este arquivo inteiro e clica RUN
--   3. Confere em Table Editor que `dragon_leads` apareceu
-- ────────────────────────────────────────────────────────────────────────

create table if not exists public.dragon_leads (
  id                       uuid        primary key default gen_random_uuid(),
  email                    text        not null,
  name                     text        not null,

  -- Snapshot do 1º quiz que disparou o gate
  first_quiz_id            text,
  first_quiz_result_key    text,
  first_quiz_result_label  text,

  -- Snapshot completo do perfil no momento da submissão
  -- (mesmo formato de DragonProfile.results no front)
  all_results              jsonb,

  -- Metadados de origem (ajuda a entender canal/dispositivo)
  source                   text        not null default 'quiz_gate',
  user_agent               text,
  referrer                 text,

  created_at               timestamptz not null default now()
);

-- Índices úteis pra Olivia queryar os leads
create index if not exists dragon_leads_email_idx
  on public.dragon_leads (lower(email));

create index if not exists dragon_leads_created_at_idx
  on public.dragon_leads (created_at desc);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────
alter table public.dragon_leads enable row level security;

-- Anon (browser público) pode INSERT — caminho do gate de email
drop policy if exists "anon insert leads" on public.dragon_leads;
create policy "anon insert leads"
  on public.dragon_leads
  for insert
  to anon
  with check (true);

-- Anon NÃO pode SELECT/UPDATE/DELETE.
-- (Não criar policy = sem acesso por default.)
-- Pra ler os leads: usar Service Role no Supabase Dashboard (Table Editor),
-- ou criar uma policy específica pra usuários autenticados depois.

-- ─── FIM ───────────────────────────────────────────────────────────────
