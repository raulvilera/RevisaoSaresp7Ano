import { useEffect, useState } from "react";

const KEY = "saresp7-liberados";

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function useLiberados() {
  const [lib, setLib] = useState<string[]>(read);
  useEffect(() => {
    const on = () => setLib(read());
    window.addEventListener("storage", on);
    window.addEventListener("saresp7-lib", on);
    return () => {
      window.removeEventListener("storage", on);
      window.removeEventListener("saresp7-lib", on);
    };
  }, []);
  const save = (v: string[]) => {
    localStorage.setItem(KEY, JSON.stringify(v));
    window.dispatchEvent(new Event("saresp7-lib"));
  };
  const toggle = (id: string) => save(lib.includes(id) ? lib.filter(x => x !== id) : [...lib, id]);
  return { lib, toggle, setAll: save };
}

export function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
