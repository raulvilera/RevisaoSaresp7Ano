import { calcularNota, faixa, Faixa } from "./nota";
import type { Resultado } from "./resultados";

export interface CelulaTema {
  melhor: number; // nota do tema = melhor tentativa
  tentativas: number;
}

export interface LinhaAluno {
  turma: string;
  n: number;
  nome: string;
  temas: Record<string, CelulaTema>;
  media: number | null; // média das notas dos temas já jogados
}

export interface ResumoTema {
  id: string;
  titulo: string;
  participantes: number;
  totalAlunos: number;
  media: number | null;
  faixas: Record<Faixa, number>;
  partidas: number;
}

export interface Relatorio {
  linhas: LinhaAluno[];
  temas: ResumoTema[];
  alunosQueJogaram: number;
  totalAlunos: number;
  mediaGeral: number | null;
  temaMaisDificil: ResumoTema | null;
}

type Turmas = Record<string, { n: number; nome: string }[]>;

const media = (v: number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : null);

export function montarRelatorio(
  resultados: Resultado[],
  turmas: Turmas,
  temas: { id: string; titulo: string }[],
  filtroTurma: string
): Relatorio {
  // notas de cada tentativa, agrupadas por aluno e tema
  const porAlunoTema = new Map<string, number[]>();
  for (const r of resultados) {
    const k = `${r.turma}|${r.aluno_n}|${r.tema_id}`;
    const nota = calcularNota({ jogo: r.jogo, acertos: r.acertos, total: r.total, tentativas: r.tentativas });
    const lista = porAlunoTema.get(k);
    if (lista) lista.push(nota);
    else porAlunoTema.set(k, [nota]);
  }

  const linhas: LinhaAluno[] = [];
  for (const [turma, alunos] of Object.entries(turmas)) {
    if (filtroTurma !== "todas" && filtroTurma !== turma) continue;
    for (const a of alunos) {
      const cel: Record<string, CelulaTema> = {};
      for (const t of temas) {
        const notas = porAlunoTema.get(`${turma}|${a.n}|${t.id}`);
        if (notas) cel[t.id] = { melhor: Math.max(...notas), tentativas: notas.length };
      }
      linhas.push({ turma, n: a.n, nome: a.nome, temas: cel, media: media(Object.values(cel).map(c => c.melhor)) });
    }
  }

  const resumos: ResumoTema[] = temas.map(t => {
    const celulas = linhas.map(l => l.temas[t.id]).filter((c): c is CelulaTema => !!c);
    const faixas: Record<Faixa, number> = { baixa: 0, media: 0, alta: 0 };
    for (const c of celulas) faixas[faixa(c.melhor)]++;
    return {
      id: t.id,
      titulo: t.titulo,
      participantes: celulas.length,
      totalAlunos: linhas.length,
      media: media(celulas.map(c => c.melhor)),
      faixas,
      partidas: celulas.reduce((s, c) => s + c.tentativas, 0),
    };
  });

  const jogaram = linhas.filter(l => l.media !== null);
  const comMedia = resumos.filter(r => r.media !== null);
  const temaMaisDificil = comMedia.length ? comMedia.reduce((a, b) => ((b.media as number) < (a.media as number) ? b : a)) : null;

  return {
    linhas,
    temas: resumos,
    alunosQueJogaram: jogaram.length,
    totalAlunos: linhas.length,
    mediaGeral: media(jogaram.map(l => l.media as number)),
    temaMaisDificil,
  };
}

/** CSV para Excel brasileiro: separador ";", decimal com vírgula e BOM UTF-8. */
export function gerarCsv(rel: Relatorio, temas: { id: string; titulo: string }[]): string {
  const celula = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const nota = (n: number | null) => (n === null ? "" : n.toFixed(1).replace(".", ","));
  const cab = ["Turma", "Nº", "Aluno", ...temas.map(t => t.titulo), "Média"];
  const linhas = rel.linhas.map(l =>
    [l.turma, l.n, l.nome, ...temas.map(t => nota(l.temas[t.id]?.melhor ?? null)), nota(l.media)].map(celula).join(";")
  );
  return "﻿" + [cab.map(celula).join(";"), ...linhas].join("\r\n");
}
