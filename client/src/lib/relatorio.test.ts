import { describe, expect, it } from "vitest";
import { calcularNota, faixa, formatarNota } from "./nota";
import { gerarCsv, montarRelatorio } from "./relatorio";
import type { Resultado } from "./resultados";

const res = (p: Partial<Resultado>): Resultado => ({
  id: "x",
  criado_em: "2026-10-09T12:00:00Z",
  turma: "A",
  aluno_n: 1,
  aluno_nome: "ANA",
  tema_id: "calor",
  jogo: "imagem",
  acertos: 4,
  total: 5,
  tentativas: null,
  ...p,
});

describe("calcularNota", () => {
  it("quiz: acertos sobre questões, de 0 a 10", () => {
    expect(calcularNota({ jogo: "imagem", acertos: 5, total: 5 })).toBe(10);
    expect(calcularNota({ jogo: "inverso", acertos: 4, total: 5 })).toBe(8);
    expect(calcularNota({ jogo: "imagem", acertos: 0, total: 5 })).toBe(0);
    expect(calcularNota({ jogo: "imagem", acertos: 1, total: 3 })).toBe(3.3);
  });

  it("cartas: sem erros vale 10 e cada tentativa extra desconta", () => {
    expect(calcularNota({ jogo: "cartas", acertos: 6, total: 6, tentativas: 6 })).toBe(10);
    expect(calcularNota({ jogo: "cartas", acertos: 6, total: 6, tentativas: 9 })).toBe(7.5);
    expect(calcularNota({ jogo: "cartas", acertos: 6, total: 6, tentativas: 12 })).toBe(5);
    expect(calcularNota({ jogo: "cartas", acertos: 6, total: 6, tentativas: 18 })).toBe(0);
  });

  it("nunca sai do intervalo de 0 a 10", () => {
    expect(calcularNota({ jogo: "cartas", acertos: 6, total: 6, tentativas: 99 })).toBe(0);
    expect(calcularNota({ jogo: "cartas", acertos: 6, total: 6, tentativas: 2 })).toBe(10);
    expect(calcularNota({ jogo: "imagem", acertos: 9, total: 5 })).toBe(10);
    expect(calcularNota({ jogo: "imagem", acertos: 0, total: 0 })).toBe(0);
  });

  it("formata com vírgula e define as faixas", () => {
    expect(formatarNota(7.5)).toBe("7,5");
    expect(formatarNota(10)).toBe("10,0");
    expect(formatarNota(null)).toBe("–");
    expect(faixa(4.9)).toBe("baixa");
    expect(faixa(5)).toBe("media");
    expect(faixa(7)).toBe("alta");
  });
});

describe("montarRelatorio", () => {
  const turmas = { A: [{ n: 1, nome: "ANA" }, { n: 2, nome: "BIA" }], B: [{ n: 1, nome: "CAIO" }] };
  const temas = [{ id: "calor", titulo: "Calor" }, { id: "maquinas", titulo: "Máquinas" }];

  it("usa a melhor tentativa como nota do tema", () => {
    const rel = montarRelatorio([res({ acertos: 2 }), res({ acertos: 5 }), res({ acertos: 1 })], turmas, temas, "todas");
    const ana = rel.linhas.find(l => l.turma === "A" && l.n === 1)!;
    expect(ana.temas.calor).toEqual({ melhor: 10, tentativas: 3 });
    expect(ana.media).toBe(10);
  });

  it("calcula participação e média por tema, e a turma não se mistura", () => {
    const rel = montarRelatorio(
      [res({ acertos: 5 }), res({ aluno_n: 2, aluno_nome: "BIA", acertos: 3 }), res({ turma: "B", acertos: 0 })],
      turmas,
      temas,
      "todas"
    );
    const calor = rel.temas.find(t => t.id === "calor")!;
    expect(calor.participantes).toBe(3);
    expect(calor.totalAlunos).toBe(3);
    expect(calor.media).toBeCloseTo((10 + 6 + 0) / 3);
    expect(calor.faixas).toEqual({ baixa: 1, media: 1, alta: 1 });
    expect(rel.alunosQueJogaram).toBe(3);
    expect(rel.temaMaisDificil?.id).toBe("calor");
  });

  it("filtra por turma e deixa quem não jogou sem nota", () => {
    const rel = montarRelatorio([res({ acertos: 5 })], turmas, temas, "A");
    expect(rel.totalAlunos).toBe(2);
    expect(rel.alunosQueJogaram).toBe(1);
    expect(rel.linhas.find(l => l.n === 2)!.media).toBeNull();
    expect(montarRelatorio([], turmas, temas, "todas").mediaGeral).toBeNull();
  });
});

describe("gerarCsv", () => {
  it("usa ; , vírgula decimal e BOM", () => {
    const temas = [{ id: "calor", titulo: "Calor" }];
    const rel = montarRelatorio([res({ acertos: 4 })], { A: [{ n: 1, nome: 'ANA "X"' }] }, temas, "todas");
    const csv = gerarCsv(rel, temas);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toContain('"Turma";"Nº";"Aluno";"Calor";"Média"');
    expect(csv).toContain('"A";"1";"ANA ""X""";"8,0";"8,0"');
  });
});
