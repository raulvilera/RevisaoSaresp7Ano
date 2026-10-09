import type { GameKind } from "@/data/temas";
import { supabase } from "./supabase";

export interface Quem {
  turma: string;
  n: number;
  nome: string;
}

export interface Resultado {
  id: string;
  criado_em: string;
  turma: string;
  aluno_n: number;
  aluno_nome: string;
  tema_id: string;
  jogo: GameKind;
  acertos: number;
  total: number;
  tentativas: number | null;
}

/** Aluno grava o resultado de uma partida. Retorna false se não foi possível salvar. */
export async function registrarResultado(
  quem: Quem,
  r: { tema_id: string; jogo: GameKind; acertos: number; total: number; tentativas?: number }
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("resultados").insert({
    turma: quem.turma,
    aluno_n: quem.n,
    aluno_nome: quem.nome,
    tema_id: r.tema_id,
    jogo: r.jogo,
    acertos: r.acertos,
    total: r.total,
    tentativas: r.tentativas ?? null,
  });
  return !error;
}

/** Só o professor logado consegue ler (as regras do banco garantem isso). */
export async function listarResultados(): Promise<Resultado[]> {
  if (!supabase) return [];
  const todos: Resultado[] = [];
  const PAGINA = 1000;
  for (let ini = 0; ; ini += PAGINA) {
    const { data, error } = await supabase
      .from("resultados")
      .select("*")
      .order("criado_em", { ascending: true })
      .range(ini, ini + PAGINA - 1);
    if (error) throw error;
    todos.push(...(data as Resultado[]));
    if (data.length < PAGINA) break;
  }
  return todos;
}

export async function apagarTodosResultados(): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("resultados").delete().not("id", "is", null);
  return !error;
}
