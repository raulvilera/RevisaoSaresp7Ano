import { TEMAS } from "@/data/temas";
import { GraduationCap, Presentation } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen paper flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
            <span className="w-3 h-3 rounded-full bg-brand" /> Ciências · 7º Ano · Currículo Priorizado SEDUC-SP
          </div>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mt-3">
            Explique, libere,<br /><span className="text-brand italic">jogue</span> — rumo ao SARESP.
          </h1>
          <p className="mt-5 text-lg opacity-80 max-w-xl">
            O professor apresenta cada tema em telas lado a lado, com imagens e termos que abrem explicações ampliadas e arrastáveis. Depois, libera os jogos de associação para a turma.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/aluno" className="flex items-center gap-2 px-8 py-4 rounded-full bg-brand text-white text-xl shadow-lg hover:-translate-y-0.5 transition"><GraduationCap /> Arena do Aluno</Link>
            <Link href="/professor" className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-brand text-brand bg-white text-xl hover:-translate-y-0.5 transition"><Presentation /> Área do Professor</Link>
          </div>
        </div>
        <ol className="space-y-2">
          {TEMAS.map((t, i) => (
            <li key={t.id} className="flex items-center gap-3 bg-white/80 rounded-xl px-4 py-3 shadow-sm border-l-4" style={{ borderColor: t.cor }}>
              <span className="font-display text-2xl w-6" style={{ color: t.cor }}>{i + 1}</span>
              <div className="flex-1">
                <div className="font-semibold">{t.titulo}</div>
                <div className="text-xs opacity-60">{t.unidade} · {t.habilidades}</div>
              </div>
            </li>
          ))}
        </ol>
      </main>
      <footer className="text-center text-xs opacity-60 pb-4">Habilidades de referência: Currículo Paulista / Guia do Currículo Priorizado – Ciências 7º ano (EF07CI01–EF07CI17).</footer>
    </div>
  );
}
