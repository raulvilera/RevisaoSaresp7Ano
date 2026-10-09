import { Cartas, QuizImagem } from "@/components/Jogos";
import { Identificacao } from "@/components/Identificacao";
import { Aluno as AlunoT } from "@/data/turmas";
import { GameKind, JOGO_NOME, TEMAS } from "@/data/temas";
import { useLiberados } from "@/lib/store";
import { ArrowLeft, Lock, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Aluno() {
  const { lib, erro } = useLiberados();
  const [temaId, setTemaId] = useState<string | null>(null);
  const [jogo, setJogo] = useState<GameKind | null>(null);
  const [quem, setQuem] = useState<{ turma: string; a: AlunoT } | null>(null);
  const tema = TEMAS.find(t => t.id === temaId);

  return (
    <div className="min-h-screen paper">
      <header className="flex items-center gap-3 px-5 py-3 border-b border-ink/10 bg-white/70">
        <Link href="/" className="flex items-center gap-1 text-sm hover:underline"><ArrowLeft size={16} /> Início</Link>
        <h1 className="font-display text-2xl">Arena do Aluno</h1>
        {quem && <span className="ml-auto text-sm text-right leading-tight"><b>{quem.a.nome}</b><br />{quem.turma} · Nº {quem.a.n}</span>}
        {quem && <button onClick={() => { setQuem(null); setTemaId(null); setJogo(null); }} className="text-sm px-3 py-1.5 rounded-full border bg-white">Sair</button>}
        {tema && <button onClick={() => { setTemaId(null); setJogo(null); }} className="text-sm px-3 py-1.5 rounded-full border bg-white">Trocar tema</button>}
      </header>
      <main className="max-w-5xl mx-auto p-5">
        {!quem && <Identificacao onIniciar={(turma, a) => setQuem({ turma, a })} />}
        {quem && !tema && (
          <>
            <p className="mb-4 opacity-80">Escolha um tema liberado pelo professor.</p>
            {erro && <p role="alert" className="mb-4 text-sm text-red-700">{erro}</p>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMAS.map(t => {
                const ok = lib.includes(t.id);
                return (
                  <button key={t.id} disabled={!ok} onClick={() => setTemaId(t.id)} className={`text-left rounded-2xl bg-white p-5 border-l-8 shadow transition ${ok ? "hover:-translate-y-1" : "opacity-50 cursor-not-allowed"}`} style={{ borderColor: t.cor }}>
                    <div className="text-xs uppercase tracking-widest" style={{ color: t.cor }}>{t.unidade}</div>
                    <div className="font-display text-xl mt-1">{t.titulo}</div>
                    <div className="mt-3 text-sm flex items-center gap-1">{ok ? "Liberado — jogar" : <><Lock size={14} /> Aguardando o professor</>}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}
        {tema && !jogo && (
          <div>
            <h2 className="font-display text-3xl" style={{ color: tema.cor }}>{tema.titulo}</h2>
            <p className="opacity-70 mb-5">Escolha o jogo:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {tema.jogos.map((g, i) => (
                <button key={g} onClick={() => setJogo(g)} className="rounded-2xl bg-white p-6 shadow text-left hover:-translate-y-1 transition border-2" style={{ borderColor: i === 0 ? tema.cor : "transparent" }}>
                  {i === 0 && <div className="text-xs font-bold flex items-center gap-1 mb-1" style={{ color: tema.cor }}><Star size={14} /> Recomendado para este tema</div>}
                  <div className="font-display text-xl">{JOGO_NOME[g]}</div>
                  <div className="text-sm opacity-70 mt-1">{g === "imagem" ? "Veja a imagem e escolha o termo certo." : g === "inverso" ? "Leia o termo e encontre a imagem certa." : "Vire as cartas e una cada termo ao seu significado."}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {tema && jogo && (
          <div className="bg-white rounded-3xl p-6 shadow">
            <div className="flex items-center mb-4">
              <h2 className="font-display text-2xl flex-1">{tema.titulo} · <span style={{ color: tema.cor }}>{JOGO_NOME[jogo]}</span></h2>
              <button onClick={() => setJogo(null)} className="text-sm underline">Outro jogo</button>
            </div>
            {jogo === "cartas" ? <Cartas key={tema.id} tema={tema} itens={tema.itens} /> : <QuizImagem key={tema.id + jogo} tema={tema} itens={tema.itens} inverso={jogo === "inverso"} />}
          </div>
        )}
      </main>
    </div>
  );
}
