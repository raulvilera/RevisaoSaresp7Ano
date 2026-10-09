import type { GameKind } from "@/data/temas";

/**
 * Regra única de nota (0 a 10), usada na tela do aluno e no relatório.
 * O banco guarda só os dados brutos; mudar a regra aqui recalcula todo o histórico.
 *
 * - Quiz (imagem → termo e termo → imagem): nota = acertos ÷ questões × 10.
 * - Cartas (memória): cada tentativa além do mínimo (1 por par) é um erro.
 *   Cada erro desconta 10 ÷ (2 × pares); 2 × pares erros zeram a nota.
 */
export interface Tentativa {
  jogo: GameKind;
  acertos: number;
  total: number; // quiz: nº de questões · cartas: nº de pares
  tentativas?: number | null; // só nas cartas: nº de pares virados
}

const arredondar = (n: number) => Math.round(n * 10) / 10;

export function calcularNota(t: Tentativa): number {
  if (t.total <= 0) return 0;
  if (t.jogo === "cartas") {
    const tentativas = Math.max(t.tentativas ?? t.total, t.total);
    const erros = tentativas - t.total;
    return arredondar(Math.max(0, 10 - (erros * 10) / (2 * t.total)));
  }
  return arredondar(Math.min(10, Math.max(0, (t.acertos / t.total) * 10)));
}

/** 7,5 → "7,5" (padrão brasileiro). */
export function formatarNota(n: number | null | undefined): string {
  return n === null || n === undefined ? "–" : n.toFixed(1).replace(".", ",");
}

export type Faixa = "baixa" | "media" | "alta";

/** Faixas usadas nas cores do relatório: abaixo de 5, de 5 a 7 e a partir de 7. */
export const CORTE_MEDIA = 5;
export const CORTE_ALTA = 7;

export function faixa(n: number): Faixa {
  return n < CORTE_MEDIA ? "baixa" : n < CORTE_ALTA ? "media" : "alta";
}

export const FAIXA_ESTILO: Record<Faixa, string> = {
  baixa: "bg-rose-100 text-rose-800",
  media: "bg-amber-100 text-amber-800",
  alta: "bg-emerald-100 text-emerald-800",
};

export function mensagem(n: number): string {
  return n >= 8 ? "Excelente! Pronto para o SARESP." : n >= 5 ? "Bom caminho! Revise os erros." : "Vamos revisar o tema e tentar de novo.";
}
