import { Aluno, TURMAS } from "@/data/turmas";
import { Play } from "lucide-react";
import { useState } from "react";

export function Identificacao({ onIniciar }: { onIniciar: (turma: string, a: Aluno) => void }) {
  const [turma, setTurma] = useState("");
  const [n, setN] = useState("");
  const aluno = turma ? TURMAS[turma].find(a => String(a.n) === n) : undefined;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow p-6 md:p-8 space-y-5">
      <h2 className="font-display text-3xl">Identifique-se</h2>
      <div>
        <div className="label">Turma</div>
        <div className="flex gap-3">
          {Object.keys(TURMAS).map(t => (
            <button key={t} onClick={() => { setTurma(t); setN(""); }}
              className={`flex-1 py-3 rounded-xl border-2 font-display text-xl transition ${turma === t ? "bg-brand text-white border-brand" : "border-brand/30 hover:border-brand"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {turma && (
        <>
          <div className="grid grid-cols-[1fr_7rem] gap-3">
            <label>
              <div className="label">Nome do aluno</div>
              <select value={n} onChange={e => setN(e.target.value)} className="w-full border-2 rounded-xl px-3 py-3 bg-white">
                <option value="">Selecione o seu nome…</option>
                {TURMAS[turma].map(a => <option key={a.n} value={a.n}>{a.nome}</option>)}
              </select>
            </label>
            <label>
              <div className="label">Nº chamada</div>
              <input readOnly value={aluno?.n ?? ""} className="w-full border-2 rounded-xl px-3 py-3 bg-ink/5 text-center font-bold" />
            </label>
          </div>
          <div className="grid md:grid-cols-[12rem_1fr] gap-3">
            <label>
              <div className="label">RA</div>
              <input readOnly value={aluno?.ra ?? ""} className="w-full border-2 rounded-xl px-3 py-3 bg-ink/5" />
            </label>
            <label>
              <div className="label">E-mail institucional</div>
              <input readOnly value={aluno?.email ?? ""} className="w-full border-2 rounded-xl px-3 py-3 bg-ink/5 text-sm" />
            </label>
          </div>
          <button disabled={!aluno} onClick={() => aluno && onIniciar(turma, aluno)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-brand text-white text-xl font-semibold disabled:opacity-40 shadow-lg">
            <Play /> Iniciar o jogo
          </button>
        </>
      )}
    </div>
  );
}
