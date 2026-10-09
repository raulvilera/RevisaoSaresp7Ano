import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";

const KEY = "saresp7-liberados";
const POLL_MS = 15000;

function readLocal(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Temas liberados. Com o Supabase configurado, o estado é compartilhado entre
 * professor e alunos (tempo real + atualização periódica). Sem configuração,
 * cai para o localStorage (apenas este navegador), útil em desenvolvimento.
 */
export function useLiberados() {
  const [lib, setLib] = useState<string[]>(() => (supabase ? [] : readLocal()));
  const [carregando, setCarregando] = useState(!!supabase);
  const [erro, setErro] = useState<string | null>(null);
  const libRef = useRef(lib);
  libRef.current = lib;

  const recarregar = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from("temas_liberados").select("tema_id");
    if (error) {
      setErro("Não foi possível carregar os temas liberados.");
    } else {
      setErro(null);
      setLib(data.map(r => r.tema_id as string));
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      const on = () => setLib(readLocal());
      window.addEventListener("storage", on);
      window.addEventListener("saresp7-lib", on);
      return () => {
        window.removeEventListener("storage", on);
        window.removeEventListener("saresp7-lib", on);
      };
    }
    recarregar();
    const canal = supabase
      .channel("temas_liberados_mudancas")
      .on("postgres_changes", { event: "*", schema: "public", table: "temas_liberados" }, () => recarregar())
      .subscribe();
    const timer = setInterval(recarregar, POLL_MS);
    return () => {
      clearInterval(timer);
      supabase!.removeChannel(canal);
    };
  }, [recarregar]);

  const salvar = useCallback(
    async (novo: string[]) => {
      const atual = libRef.current;
      if (!supabase) {
        localStorage.setItem(KEY, JSON.stringify(novo));
        window.dispatchEvent(new Event("saresp7-lib"));
        setLib(novo);
        return;
      }
      const adicionar = novo.filter(id => !atual.includes(id));
      const remover = atual.filter(id => !novo.includes(id));
      setLib(novo); // atualização otimista
      let falhou = false;
      if (adicionar.length) {
        const { error } = await supabase.from("temas_liberados").upsert(adicionar.map(tema_id => ({ tema_id })));
        if (error) falhou = true;
      }
      if (remover.length) {
        const { error } = await supabase.from("temas_liberados").delete().in("tema_id", remover);
        if (error) falhou = true;
      }
      if (falhou) setErro("Não foi possível salvar. Verifique se você está logado como professor.");
      else setErro(null);
      await recarregar();
    },
    [recarregar]
  );

  const toggle = (id: string) => salvar(lib.includes(id) ? lib.filter(x => x !== id) : [...lib, id]);
  return { lib, toggle, setAll: salvar, carregando, erro };
}

export function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
