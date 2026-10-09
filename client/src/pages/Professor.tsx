import { FloatWindow, Janela } from "@/components/FloatWindow";
import { TEMAS, Tema } from "@/data/temas";
import { useLiberados } from "@/lib/store";
import { ArrowLeft, ArrowLeftRight, ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function Professor() {
  const [ordem, setOrdem] = useState<Tema[]>(TEMAS);
  const [ini, setIni] = useState(0);
  const [vis, setVis] = useState(2);
  const [janelas, setJanelas] = useState<Janela[]>([]);
  const [zTop, setZTop] = useState(100);
  const { lib, toggle, setAll } = useLiberados();

  const max = Math.max(0, ordem.length - vis);
  const go = (d: number) => setIni(i => Math.min(max, Math.max(0, i + d)));
  useEffect(() => setIni(i => Math.min(i, max)), [max]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const mover = (idx: number, d: number) => {
    const n = idx + d;
    if (n < 0 || n >= ordem.length) return;
    const o = [...ordem];
    [o[idx], o[n]] = [o[n], o[idx]];
    setOrdem(o);
  };

  const abrir = (t: Tema, titulo: string, texto: string, img?: string) => {
    const key = t.id + titulo;
    const z = zTop + 1;
    setZTop(z);
    setJanelas(js => {
      if (js.find(j => j.key === key)) return js.map(j => (j.key === key ? { ...j, z } : j));
      const off = (js.length % 6) * 30;
      return [...js, { key, titulo, texto, img, cor: t.cor, z, x: 80 + off, y: 90 + off }];
    });
  };

  return (
    <div className="h-screen flex flex-col paper overflow-hidden">
      <header className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-ink/10 bg-white/70 backdrop-blur">
        <Link href="/" className="flex items-center gap-1 text-sm hover:underline"><ArrowLeft size={16} /> Início</Link>
        <h1 className="font-display text-2xl">Modo Aula · Professor</h1>
        <div className="flex items-center gap-1 ml-auto text-sm">
          Telas lado a lado:
          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => setVis(n)} className={`w-8 h-8 rounded-full border ${vis === n ? "bg-brand text-white border-brand" : "bg-white"}`}>{n}</button>
          ))}
        </div>
        <button onClick={() => setAll(TEMAS.map(t => t.id))} className="px-3 py-1.5 rounded-full bg-brand text-white text-sm">Liberar todos</button>
        <button onClick={() => setAll([])} className="px-3 py-1.5 rounded-full border text-sm bg-white">Bloquear todos</button>
        {janelas.length > 0 && <button onClick={() => setJanelas([])} className="px-3 py-1.5 rounded-full border text-sm bg-white">Fechar janelas ({janelas.length})</button>}
      </header>

      <div className="relative flex-1 min-h-0">
        <button onClick={() => go(-1)} disabled={ini === 0} className="nav-btn left-2"><ChevronLeft size={32} /></button>
        <button onClick={() => go(1)} disabled={ini >= max} className="nav-btn right-2"><ChevronRight size={32} /></button>
        <div className="h-full overflow-hidden px-16 py-4">
          <div className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${(ini * 100) / vis}%)` }}>
            {ordem.map((t, idx) => (
              <div key={t.id} className="shrink-0 h-full px-2" style={{ width: `${100 / vis}%` }}>
                <section className="h-full flex flex-col rounded-3xl bg-white shadow-lg border-t-8 overflow-hidden" style={{ borderColor: t.cor }}>
                  <div className="flex items-start gap-2 p-4 pb-2">
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-widest" style={{ color: t.cor }}>{t.unidade} · {t.habilidades}</div>
                      <h2 className="font-display text-2xl leading-tight">{idx + 1}. {t.titulo}</h2>
                    </div>
                    <div className="flex items-center gap-1" title="Mover esta tela">
                      <button onClick={() => mover(idx, -1)} disabled={idx === 0} className="mini"><ChevronLeft size={16} /></button>
                      <ArrowLeftRight size={14} className="opacity-40" />
                      <button onClick={() => mover(idx, 1)} disabled={idx === ordem.length - 1} className="mini"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto px-4 pb-4 space-y-4">
                    <ul className="space-y-1.5">
                      {t.resumo.map(r => (
                        <li key={r} className="flex gap-2 text-[15px]"><span className="mt-2 w-2 h-2 rounded-full shrink-0" style={{ background: t.cor }} />{r}</li>
                      ))}
                    </ul>
                    <div>
                      <div className="label">Imagens — clique para ampliar</div>
                      <div className="grid grid-cols-3 gap-2">
                        {t.itens.filter(i => i.img).map(i => (
                          <button key={i.id} onClick={() => abrir(t, i.termo, i.explica, i.img)} className="group rounded-xl overflow-hidden border hover:shadow-md transition">
                            <img src={i.img} alt={i.termo} className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="label">Termos — clique para explicar</div>
                      <div className="flex flex-wrap gap-2">
                        {t.itens.map(i => (
                          <button key={i.id} onClick={() => abrir(t, i.termo, `${i.def}\n\n${i.explica}`)} className="px-3 py-1.5 rounded-full text-sm font-semibold border-2 hover:text-white transition" style={{ borderColor: t.cor, color: t.cor }}
                            onMouseEnter={e => (e.currentTarget.style.background = t.cor, e.currentTarget.style.color = "#fff")}
                            onMouseLeave={e => (e.currentTarget.style.background = "", e.currentTarget.style.color = t.cor)}>
                            {i.termo}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl p-3 text-sm bg-amber-50 border border-amber-200"><b>Foco SARESP:</b> {t.saresp}</div>
                  </div>
                  <button onClick={() => toggle(t.id)} className={`flex items-center justify-center gap-2 py-3 font-semibold ${lib.includes(t.id) ? "bg-emerald-600 text-white" : "bg-ink/5"}`}>
                    {lib.includes(t.id) ? <><Unlock size={18} /> Jogo liberado — clique para bloquear</> : <><Lock size={18} /> Liberar jogo deste tema</>}
                  </button>
                </section>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1.5">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIni(i)} className={`h-2 rounded-full transition-all ${i === ini ? "w-6 bg-brand" : "w-2 bg-ink/20"}`} />
          ))}
        </div>
      </div>

      {janelas.map(j => (
        <FloatWindow key={j.key} j={{ ...j, texto: j.texto }}
          onClose={() => setJanelas(js => js.filter(x => x.key !== j.key))}
          onFocus={() => { const z = zTop + 1; setZTop(z); setJanelas(js => js.map(x => (x.key === j.key ? { ...x, z } : x))); }} />
      ))}
    </div>
  );
}
