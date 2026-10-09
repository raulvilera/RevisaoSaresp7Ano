-- Resultados dos jogos dos alunos (base do relatório por tema).
-- Guarda só os dados brutos; a nota de 0 a 10 é calculada no app (client/src/lib/nota.ts).
-- Alunos só gravam (sem login); apenas o professor lê e apaga.

create table if not exists public.resultados (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  turma text not null,
  aluno_n integer not null,
  aluno_nome text not null,
  tema_id text not null,
  jogo text not null,
  acertos integer not null,
  total integer not null,
  tentativas integer,
  constraint resultados_turma_len check (char_length(turma) between 1 and 30),
  constraint resultados_nome_len check (char_length(aluno_nome) between 1 and 120),
  constraint resultados_tema_len check (char_length(tema_id) between 1 and 40),
  constraint resultados_aluno_n check (aluno_n between 1 and 200),
  constraint resultados_jogo check (jogo in ('imagem', 'inverso', 'cartas')),
  constraint resultados_total check (total between 1 and 50),
  constraint resultados_acertos check (acertos between 0 and total),
  constraint resultados_tentativas check (tentativas is null or tentativas between 0 and 500)
);

create index if not exists resultados_tema_idx on public.resultados (tema_id);
create index if not exists resultados_aluno_idx on public.resultados (turma, aluno_n);

alter table public.resultados enable row level security;

drop policy if exists "alunos registram resultado" on public.resultados;
create policy "alunos registram resultado"
  on public.resultados for insert
  to anon, authenticated
  with check (
    char_length(turma) between 1 and 30
    and char_length(aluno_nome) between 1 and 120
    and jogo in ('imagem', 'inverso', 'cartas')
  );

drop policy if exists "professor le resultados" on public.resultados;
create policy "professor le resultados"
  on public.resultados for select
  to authenticated
  using (public.sou_professor());

drop policy if exists "professor apaga resultados" on public.resultados;
create policy "professor apaga resultados"
  on public.resultados for delete
  to authenticated
  using (public.sou_professor());
