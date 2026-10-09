-- Área do professor · Revisão SARESP 7º ano
-- Aplicar em um projeto Supabase DEDICADO a este app (o gatilho abaixo bloqueia
-- cadastros de qualquer e-mail que não esteja em professor_autorizado).

-- 1) Quem pode ser professor -------------------------------------------------
create table if not exists public.professor_autorizado (
  email text primary key
);
alter table public.professor_autorizado enable row level security;
-- Sem políticas: nenhum cliente (anon/authenticated) lê ou escreve esta tabela.

insert into public.professor_autorizado (email)
values ('vilera@prof.educacao.sp.gov.br')
on conflict do nothing;

-- 2) Temas liberados para os alunos -------------------------------------------
create table if not exists public.temas_liberados (
  tema_id text primary key,
  liberado_em timestamptz not null default now()
);
alter table public.temas_liberados enable row level security;

-- 3) Função que confirma se quem está logado é o professor ---------------------
-- O e-mail do JWT só existe depois de confirmado (link enviado ao e-mail).
create or replace function public.sou_professor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.professor_autorizado p
    where lower(p.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.sou_professor() from public, anon;
grant execute on function public.sou_professor() to authenticated;

-- 4) Políticas: todos leem; só o professor escreve ----------------------------
drop policy if exists "todos leem temas liberados" on public.temas_liberados;
create policy "todos leem temas liberados"
  on public.temas_liberados for select
  to anon, authenticated
  using (true);

drop policy if exists "professor libera temas" on public.temas_liberados;
create policy "professor libera temas"
  on public.temas_liberados for insert
  to authenticated
  with check (public.sou_professor());

drop policy if exists "professor atualiza temas" on public.temas_liberados;
create policy "professor atualiza temas"
  on public.temas_liberados for update
  to authenticated
  using (public.sou_professor())
  with check (public.sou_professor());

drop policy if exists "professor bloqueia temas" on public.temas_liberados;
create policy "professor bloqueia temas"
  on public.temas_liberados for delete
  to authenticated
  using (public.sou_professor());

-- 5) Impede cadastro de qualquer e-mail que não seja o do professor -----------
create or replace function public.bloquear_cadastro_nao_autorizado()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.professor_autorizado p
    where lower(p.email) = lower(coalesce(new.email, ''))
  ) then
    raise exception 'Cadastro não autorizado';
  end if;
  return new;
end;
$$;

-- A função do gatilho não deve ser chamável pela API pública.
revoke all on function public.bloquear_cadastro_nao_autorizado() from public, anon, authenticated;

drop trigger if exists bloquear_cadastro on auth.users;
create trigger bloquear_cadastro
  before insert on auth.users
  for each row execute function public.bloquear_cadastro_nao_autorizado();

-- 6) Atualização em tempo real para a Arena do Aluno ---------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'temas_liberados'
  ) then
    alter publication supabase_realtime add table public.temas_liberados;
  end if;
end $$;
