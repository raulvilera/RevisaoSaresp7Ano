import { motion } from "framer-motion";
import { Maximize2, Minimize2, X } from "lucide-react";
import { useState } from "react";

export interface Janela {
  key: string;
  titulo: string;
  texto: string;
  img?: string;
  cor: string;
  z: number;
  x: number;
  y: number;
}

export function FloatWindow({ j, onClose, onFocus }: { j: Janela; onClose: () => void; onFocus: () => void }) {
  const [grande, setGrande] = useState(false);
  const w = grande ? Math.min(900, window.innerWidth - 40) : 420;
  return (
    <motion.div
      drag
      dragMomentum={false}
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed rounded-2xl shadow-2xl bg-white border-2 overflow-hidden"
      style={{ left: j.x, top: j.y, zIndex: j.z, width: w, borderColor: j.cor, resize: "both" }}
    >
      <div className="flex items-center gap-2 px-4 py-2 cursor-move text-white select-none" style={{ background: j.cor }}>
        <span className="font-display text-lg flex-1 truncate">{j.titulo}</span>
        <button onClick={() => setGrande(g => !g)} title="Ampliar/Reduzir" className="p-1 hover:bg-white/20 rounded">
          {grande ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        <button onClick={onClose} title="Fechar" className="p-1 hover:bg-white/20 rounded">
          <X size={18} />
        </button>
      </div>
      <div className="p-4 max-h-[75vh] overflow-auto">
        {j.img && <img src={j.img} alt={j.titulo} draggable={false} className="w-full rounded-lg mb-3 pointer-events-none" />}
        <p className={`whitespace-pre-line ${grande ? "text-2xl leading-relaxed" : "text-base leading-relaxed"}`}>{j.texto}</p>
      </div>
    </motion.div>
  );
}
