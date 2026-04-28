-- ────────────────────────────────────────────────────────────────────────
-- 0002_dragon_photos — Storage bucket + coluna photo_url
-- ────────────────────────────────────────────────────────────────────────
-- Adiciona suporte pra UMA foto do tutor com o pet:
--   1. Cria bucket público `dragon-photos` (max 5MB, image/*)
--   2. Policies de Storage: anon INSERT, public SELECT, sem UPDATE/DELETE
--   3. Adiciona coluna `photo_url` em dragon_leads (URL pública do bucket)
--
-- Como rodar:
--   1. Supabase Dashboard → SQL Editor → New query
--   2. Cola este arquivo inteiro e clica RUN
--   3. Confere em Storage → buckets que `dragon-photos` apareceu (público)
-- ────────────────────────────────────────────────────────────────────────

-- ─── 1. CRIAR BUCKET ───────────────────────────────────────────────────
insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'dragon-photos',
    'dragon-photos',
    true,                               -- bucket público (URLs diretas)
    5242880,                            -- 5MB max por arquivo (~5 * 1024 * 1024)
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
  set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- ─── 2. STORAGE POLICIES ───────────────────────────────────────────────
-- Anon role pode UPLOAD (insert) só no bucket dragon-photos
drop policy if exists "anon upload to dragon-photos" on storage.objects;
create policy "anon upload to dragon-photos"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'dragon-photos');

-- Público (incluindo anônimos) pode LER os arquivos
-- (necessário pra getPublicUrl funcionar e pra <img> renderizar a foto)
drop policy if exists "public read dragon-photos" on storage.objects;
create policy "public read dragon-photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'dragon-photos');

-- Anon NÃO pode UPDATE/DELETE — quem subiu não consegue mais mexer.
-- (Não criar policy de update/delete = sem acesso por default.)
-- Se um dia precisar deletar, usa Service Role pelo dashboard.

-- ─── 3. COLUNA photo_url EM dragon_leads ───────────────────────────────
alter table public.dragon_leads
  add column if not exists photo_url text;

-- ─── FIM ───────────────────────────────────────────────────────────────
