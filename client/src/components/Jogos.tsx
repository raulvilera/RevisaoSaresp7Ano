import { GameKind, Item, TEMAS, Tema } from "@/data/temas";
import { calcularNota, formatarNota, mensagem } from "@/lib/nota";
import { Quem, registrarResultado } from "@/lib/resultados";
import { shuffle } from "@/lib/store";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const TODAS_IMG = TEMAS.flatMap(t => t.itens.filter(i => i.img));

function Resultado({ nota, detalhe, onRestart, cor, salvar }: { nota: number; detalhe: string; onRestart: () => void; cor: string; salvar?: () => Promise<boolean> }) {
  const [estado, setEstado] = useState<"salvando" | "ok" | "erro" | null>(salvar ? "salvando" : null);
  const enviado = useRef(false);
  const enviar = async () => {
    if (!salvar) return;
    setEstado("salvando");
    setEstado((await salvar()) ? "ok" : "erro");
  };
  useEffect(() => {
    if (enviado.current) return;
    enviado.current = true;
    enviar();
  }, []);
  return (
    <div className="text-center py-10">
      <div className="text-sm uppercase tracking-widest opacity-60">Sua nota</div>
      <div className="font-display text-7xl" style={{ color: cor }}>{formatarNota(nota)}</div>
      <p className="opacity-70 mt-1">{detalhe}</p>
      <p className="text-xl mt-3">{mensagem(nota)}</p>
      {estado === "salvando" && <p className="mt-3 text-sm opacity-70">Registrando sua nota…</p>}
      {estado === "ok" && <p className="mt-3 text-sm text-emerald-700">Nota registrada para o professor ✓</p>}
      {estado === "erro" && (
        <p role="alert" className="mt-3 text-sm text-rose-700">
          Não foi possível registrar a nota. <button onClick={enviar} className="underline font-semibold">Tentar de novo</button>
        </p>
      )}
      <button onClick={onRestart} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white" style={{ background: cor }}><RotateCcw size={18} /> Jogar novamente</button>
    </div>
  );
}

/** Imagem → Termo  e  Termo → Imagem */
export function QuizImagem({ tema, itens, inverso, quem }: { tema: Tema; itens: Item[]; inverso: boolean; quem?: Quem }) {
  const [seed, setSeed] = useState(0);
  const perguntas = useMemo(() => shuffle(itens.filter(i => i.img)).map(alvo => {
    const pool = itens.filter(i => i.img && i.id !== alvo.id);
    const extra = TODAS_IMG.filter(i => i.id !== alvo.id && !pool.includes(i));
    const distr = shuffle(pool).concat(shuffle(extra)).slice(0, 3);
    return { alvo, opcoes: shuffle([alvo, ...distr]) };
  }), [seed, itens]);
  const [idx, setIdx] = useState(0);
  const [esc, setEsc] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);

  const reiniciar = () => { setSeed(s => s + 1); setIdx(0); setEsc(null); setAcertos(0); };
  if (idx >= perguntas.length) {
    const jogo: GameKind = inverso ? "inverso" : "imagem";
    const total = perguntas.length;
    return (
      <Resultado
        key={seed}
        nota={calcularNota({ jogo, acertos, total })}
        detalhe={`${acertos} de ${total} questões corretas`}
        onRestart={reiniciar}
        cor={tema.cor}
        salvar={quem ? () => registrarResultado(quem, { tema_id: tema.id, jogo, acertos, total }) : undefined}
      />
    );
  }
  const { alvo, opcoes } = perguntas[idx];
  const escolher = (id: string) => { if (esc) return; setEsc(id); if (id === alvo.id) setAcertos(a => a + 1); };

  return (
    <div>
      <div className="text-sm opacity-70 mb-2">Questão {idx + 1} de {perguntas.length} · Acertos: {acertos}</div>
      {!inverso ? (
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <img src={alvo.img} alt="Qual é o termo?" className="rounded-2xl w-full shadow" />
          <div className="space-y-3">
            <p className="font-display text-2xl">Qual termo corresponde à imagem?</p>
            {opcoes.map(o => {
              const st = esc ? (o.id === alvo.id ? "bg-emerald-500 text-white border-emerald-500" : o.id === esc ? "bg-rose-500 text-white border-rose-500" : "opacity-50") : "hover:bg-ink/5";
              return <button key={o.id} onClick={() => escolher(o.id)} className={`w-full text-left px-4 py-3 rounded-xl border-2 text-lg font-semibold transition ${st}`}>{o.termo}</button>;
            })}
          </div>
        </div>
      ) : (
        <div>
          <p className="font-display text-2xl mb-1">Clique na imagem de: <span style={{ color: tema.cor }}>{alvo.termo}</span></p>
          <p className="opacity-70 mb-4">{alvo.def}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {opcoes.map(o => {
              const st = esc ? (o.id === alvo.id ? "ring-4 ring-emerald-500" : o.id === esc ? "ring-4 ring-rose-500 opacity-70" : "opacity-40") : "hover:scale-[1.03]";
              return <button key={o.id} onClick={() => escolher(o.id)} className={`rounded-xl overflow-hidden transition ${st}`}><img src={o.img} alt="opção" className="aspect-[4/3] w-full object-cover" />{esc && <div className="text-sm py-1 bg-white">{o.termo}</div>}</button>;
            })}
          </div>
        </div>
      )}
      {esc && (
        <div className={`mt-5 rounded-xl p-4 flex gap-3 ${esc === alvo.id ? "bg-emerald-50" : "bg-rose-50"}`}>
          {esc === alvo.id ? <CheckCircle2 className="text-emerald-600 shrink-0" /> : <XCircle className="text-rose-600 shrink-0" />}
          <div className="flex-1"><b>{esc === alvo.id ? "Correto!" : `Resposta: ${alvo.termo}.`}</b> {alvo.explica}</div>
          <button onClick={() => { setIdx(i => i + 1); setEsc(null); }} className="self-center px-4 py-2 rounded-full text-white shrink-0" style={{ background: tema.cor }}>Próxima</button>
        </div>
      )}
    </div>
  );
}

/** Cartas: memória termo ↔ significado */
export function Cartas({ tema, itens, quem }: { tema: Tema; itens: Item[]; quem?: Quem }) {
  const [seed, setSeed] = useState(0);
  const cartas = useMemo(() => {
    const sel = shuffle(itens).slice(0, 6);
    return shuffle(sel.flatMap(i => [{ k: i.id + "t", id: i.id, txt: i.termo, tipo: "termo" }, { k: i.id + "d", id: i.id, txt: i.def, tipo: "def" }]));
  }, [seed, itens]);
  const [abertas, setAbertas] = useState<string[]>([]);
  const [feitas, setFeitas] = useState<string[]>([]);
  const [tent, setTent] = useState(0);
  const [erro, setErro] = useState(false);
  const pares = cartas.length / 2;

  const clicar = (k: string, id: string) => {
    if (abertas.length === 2 || abertas.includes(k) || feitas.includes(id)) return;
    const n = [...abertas, k];
    setAbertas(n);
    if (n.length === 2) {
      setTent(t => t + 1);
      const [a, b] = n.map(x => cartas.find(c => c.k === x)!);
      if (a.id === b.id) { setFeitas(f => [...f, a.id]); setAbertas([]); }
      else { setErro(true); setTimeout(() => { setAbertas([]); setErro(false); }, 1300); }
    }
  };
  const reiniciar = () => { setSeed(s => s + 1); setAbertas([]); setFeitas([]); setTent(0); };
  if (feitas.length === pares) {
    return (
      <Resultado
        key={seed}
        nota={calcularNota({ jogo: "cartas", acertos: pares, total: pares, tentativas: tent })}
        detalhe={`${pares} pares encontrados em ${tent} tentativas`}
        onRestart={reiniciar}
        cor={tema.cor}
        salvar={quem ? () => registrarResultado(quem, { tema_id: tema.id, jogo: "cartas", acertos: pares, total: pares, tentativas: tent }) : undefined}
      />
    );
  }

  return (
    <div>
      <div className="text-sm opacity-70 mb-3">Encontre o par <b>termo + significado</b>. Pares: {feitas.length}/{pares} · Tentativas: {tent}</div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {cartas.map(c => {
          const vis = abertas.includes(c.k) || feitas.includes(c.id);
          const ok = feitas.includes(c.id);
          return (
            <button key={c.k} onClick={() => clicar(c.k, c.id)} className="card3d h-36" data-open={vis}>
              <div className="card3d-inner">
                <div className="card3d-face text-white font-display text-4xl" style={{ background: tema.cor }}>?</div>
                <div className={`card3d-face card3d-back border-2 p-2 ${c.tipo === "termo" ? "font-display text-lg" : "text-[13px] leading-snug"} ${ok ? "bg-emerald-50 border-emerald-500" : erro && abertas.includes(c.k) ? "bg-rose-50 border-rose-400" : "bg-white"}`} style={!ok ? { borderColor: tema.cor } : undefined}>
                  {c.txt}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
