import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProfessorGate } from "@/components/ProfessorGate";
import { TEMAS } from "@/data/temas";
import { TURMAS } from "@/data/turmas";
import { CORTE_ALTA, CORTE_MEDIA, FAIXA_ESTILO, faixa, formatarNota } from "@/lib/nota";
import { gerarCsv, montarRelatorio } from "@/lib/relatorio";
import { apagarTodosResultados, listarResultados, Resultado } from "@/lib/resultados";
import { ArrowLeft, Download, LogOut, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

const ATUALIZAR_MS = 30000;
const TEMAS_BASICOS = TEMAS.map(t => ({ id: t.id, titulo: t.titulo }));

function Badge({ nota, titulo }: { nota: number | null; titulo?: string }) {
  if (nota === null) return <span className="opacity-30">–</span>;
  return (
    <span title={titulo} className={`inline-block min-w-[3rem] rounded-full px-2 py-0.5 text-sm font-bold ${FAIXA_ESTILO[faixa(nota)]}`}>
      {formatarNota(nota)}
    </span>
  );
}

export default function RelatorioPage() {
  return <ProfessorGate>{sair => <Relatorio sair={sair} />}</ProfessorGate>;
}

function Relatorio({ sair }: { sair: () => void }) {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [turma, setTurma] = useState("todas");
  const [ordem, setOrdem] = useState<"numero" | "media">("numero");
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);

  const carregar = useCallback(async () => {
    try {
      setResultados(await listarResultados());
      setErro(null);
      setAtualizadoEm(new Date());
    } catch {
      setErro("Não foi possível carregar os resultados.");
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
    const t = setInterval(carregar, ATUALIZAR_MS);
    return () => clearInterval(t);
  }, [carregar]);

  const rel = useMemo(() => montarRelatorio(resultados, TURMAS, TEMAS_BASICOS, turma), [resultados, turma]);

  const linhas = useMemo(() => {
    if (ordem === "numero") return rel.linhas;
    return [...rel.linhas].sort((a, b) => (b.media ?? -1) - (a.media ?? -1));
  }, [rel.linhas, ordem]);

  const exportar = () => {
    const blob = new Blob([gerarCsv({ ...rel, linhas }, TEMAS_BASICOS)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-saresp7-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const apagar = async () => {
    if (await apagarTodosResultados()) await carregar();
    else setErro("Não foi possível apagar os resultados.");
  };

  return (
    <div className="min-h-screen paper">
      <header className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-ink/10 bg-white/70 backdrop-blur">
        <Link href="/professor" className="flex items-center gap-1 text-sm hover:underline"><ArrowLeft size={16} /> Modo Aula</Link>
        <h1 className="font-display text-2xl">Relatório de desempenho</h1>
        <div className="flex items-center gap-2 ml-auto text-sm">
          <select value={turma} onChange={e => setTurma(e.target.value)} className="border rounded-full px-3 py-1.5 bg-white" aria-label="Turma">
            <option value="todas">Todas as turmas</option>
            {Object.keys(TURMAS).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={carregar} className="flex items-center gap-1 px-3 py-1.5 rounded-full border bg-white"><RefreshCw size={14} /> Atualizar</button>
          <button onClick={exportar} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand text-white"><Download size={14} /> Exportar CSV</button>
          <button onClick={sair} className="flex items-center gap-1 px-3 py-1.5 rounded-full border bg-white"><LogOut size={14} /> Sair</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-5 space-y-6">
        {erro && <div role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-2 text-sm">{erro}</div>}

        <section className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white shadow p-5">
            <div className="label">Alunos que jogaram</div>
            <div className="font-display text-4xl">{rel.alunosQueJogaram}<span className="text-xl opacity-50"> de {rel.totalAlunos}</span></div>
          </div>
          <div className="rounded-2xl bg-white shadow p-5">
            <div className="label">Média geral</div>
            <div className="font-display text-4xl">{formatarNota(rel.mediaGeral)}</div>
          </div>
          <div className="rounded-2xl bg-white shadow p-5">
            <div className="label">Tema com menor média</div>
            <div className="font-display text-2xl leading-tight">{rel.temaMaisDificil ? rel.temaMaisDificil.titulo : "–"}</div>
            {rel.temaMaisDificil && <div className="text-sm opacity-70">Média {formatarNota(rel.temaMaisDificil.media)}</div>}
          </div>
        </section>

        <section className="rounded-2xl bg-white shadow overflow-x-auto">
          <h2 className="font-display text-2xl px-5 pt-5">Desempenho por tema</h2>
          <table className="w-full text-sm mt-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider opacity-60 border-b">
                <th className="px-5 py-2">Tema</th>
                <th className="px-3 py-2">Participação</th>
                <th className="px-3 py-2 text-center">Média</th>
                <th className="px-3 py-2 text-center">Abaixo de {CORTE_MEDIA}</th>
                <th className="px-3 py-2 text-center">{CORTE_MEDIA} a {CORTE_ALTA}</th>
                <th className="px-3 py-2 text-center">{CORTE_ALTA} ou mais</th>
                <th className="px-5 py-2 text-center">Partidas</th>
              </tr>
            </thead>
            <tbody>
              {rel.temas.map(t => {
                const cor = TEMAS.find(x => x.id === t.id)?.cor;
                const pct = t.totalAlunos ? Math.round((t.participantes / t.totalAlunos) * 100) : 0;
                return (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="px-5 py-3 font-semibold"><span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: cor }} />{t.titulo}</td>
                    <td className="px-3 py-3 min-w-[9rem]">
                      <div className="h-2 rounded-full bg-ink/10 overflow-hidden"><div className="h-full" style={{ width: `${pct}%`, background: cor }} /></div>
                      <div className="text-xs opacity-70 mt-1">{t.participantes} de {t.totalAlunos} ({pct}%)</div>
                    </td>
                    <td className="px-3 py-3 text-center"><Badge nota={t.media} /></td>
                    <td className="px-3 py-3 text-center">{t.faixas.baixa}</td>
                    <td className="px-3 py-3 text-center">{t.faixas.media}</td>
                    <td className="px-3 py-3 text-center">{t.faixas.alta}</td>
                    <td className="px-5 py-3 text-center opacity-70">{t.partidas}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl bg-white shadow">
          <div className="flex flex-wrap items-center gap-3 px-5 pt-5">
            <h2 className="font-display text-2xl">Notas por aluno</h2>
            <div className="ml-auto flex items-center gap-1 text-sm">
              Ordenar por:
              <button onClick={() => setOrdem("numero")} className={`px-3 py-1 rounded-full border ${ordem === "numero" ? "bg-brand text-white border-brand" : "bg-white"}`}>Nº de chamada</button>
              <button onClick={() => setOrdem("media")} className={`px-3 py-1 rounded-full border ${ordem === "media" ? "bg-brand text-white border-brand" : "bg-white"}`}>Maior média</button>
            </div>
          </div>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider opacity-60 border-y">
                  <th className="px-5 py-2 sticky left-0 bg-white">Aluno</th>
                  {TEMAS.map(t => <th key={t.id} className="px-2 py-2 text-center min-w-[5.5rem] font-semibold normal-case tracking-normal">{t.titulo}</th>)}
                  <th className="px-5 py-2 text-center">Média</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map(l => (
                  <tr key={`${l.turma}${l.n}`} className="border-b last:border-0">
                    <td className="px-5 py-2 sticky left-0 bg-white whitespace-nowrap">
                      <span className="opacity-50 mr-2">{turma === "todas" ? `${l.turma.replace("ºAno ", "")}·` : ""}{l.n}</span>{l.nome}
                    </td>
                    {TEMAS.map(t => {
                      const c = l.temas[t.id];
                      return (
                        <td key={t.id} className="px-2 py-2 text-center">
                          <Badge nota={c ? c.melhor : null} titulo={c ? `${c.tentativas} partida(s) — vale a melhor` : undefined} />
                        </td>
                      );
                    })}
                    <td className="px-5 py-2 text-center"><Badge nota={l.media} /></td>
                  </tr>
                ))}
                {!carregando && linhas.length === 0 && <tr><td className="px-5 py-6 text-center opacity-60" colSpan={TEMAS.length + 2}>Nenhum aluno nesta turma.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="text-xs opacity-70 space-y-1 pb-4">
          <p><b>Como a nota é calculada (0 a 10).</b> A nota do tema é a <b>melhor partida</b> do aluno nele. Quiz de imagens: acertos ÷ questões × 10. Jogo de cartas: 10, menos cerca de 0,8 por tentativa errada (12 erros zeram).</p>
          <p>Cores: vermelho abaixo de {CORTE_MEDIA}, amarelo de {CORTE_MEDIA} a {CORTE_ALTA}, verde a partir de {CORTE_ALTA}. “–” indica que o aluno ainda não jogou o tema.</p>
          <p>{atualizadoEm ? `Atualizado às ${atualizadoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}. ` : ""}A página se atualiza sozinha a cada 30 segundos.</p>
          <div className="pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border bg-white text-rose-700"><Trash2 size={14} /> Apagar todos os resultados</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apagar todos os resultados?</AlertDialogTitle>
                  <AlertDialogDescription>Todas as notas de todos os alunos serão removidas e não poderão ser recuperadas. Use para limpar os testes antes de começar com a turma.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={apagar}>Apagar tudo</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </main>
    </div>
  );
}
