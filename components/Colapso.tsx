"use client";

// ============================================================
// O "colapso": botao dispara -> o site inteiro e sugado pelo
// buraco negro -> só ficam buraco + estrelas -> tudo volta.
//
// Conceito-chave: ESTADO COMPARTILHADO via React Context.
// Tres componentes diferentes (botao, conteudo, buraco negro)
// leem/alteram o MESMO estado `colapsando`.
// ============================================================

import { createContext, useContext, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ColapsoCtx {
  colapsando: boolean;
  origem: { x: number; y: number }; // ponto pra onde o site e sugado
  disparar: () => void;
}

const Ctx = createContext<ColapsoCtx | null>(null);

// Hook de conveniencia: qualquer componente chama useColapso()
// e enxerga o estado global do efeito.
export function useColapso() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useColapso precisa estar dentro de <ColapsoProvider>");
  return ctx;
}

export function ColapsoProvider({ children }: { children: React.ReactNode }) {
  const [colapsando, setColapsando] = useState(false);
  const [origem, setOrigem] = useState({ x: 0, y: 0 });
  const ocupado = useRef(false); // trava anti clique-duplo

  const disparar = () => {
    if (ocupado.current) return;
    // respeito a quem pediu menos movimento no sistema
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ocupado.current = true;

    // o centro do redemoinho = centro da tela VISIVEL agora
    // (scrollY compensa o quanto a pagina ja foi rolada)
    setOrigem({
      x: window.innerWidth / 2,
      y: window.scrollY + window.innerHeight / 2,
    });
    setColapsando(true);

    // linha do tempo: 1.5s sugando -> ~1.7s so buraco -> volta
    setTimeout(() => setColapsando(false), 3200);
    setTimeout(() => (ocupado.current = false), 4800);
  };

  return (
    <Ctx.Provider value={{ colapsando, origem, disparar }}>
      {children}
    </Ctx.Provider>
  );
}

// Envolve TODO o conteudo do site; quando colapsando, espirala ate sumir.
export function ColapsoConteudo({ children }: { children: React.ReactNode }) {
  const { colapsando, origem } = useColapso();

  return (
    <motion.div
      initial={false}
      style={{
        transformOrigin: `${origem.x}px ${origem.y}px`,
        pointerEvents: colapsando ? "none" : "auto",
      }}
      animate={
        colapsando
          ? { scale: 0.001, rotate: 200, opacity: 0 } // encolhe girando
          : { scale: 1, rotate: 0, opacity: 1 }
      }
      transition={
        colapsando
          ? { duration: 1.5, ease: [0.6, -0.05, 0.9, 0.4] } // acelera pra dentro
          : { duration: 1.3, ease: [0.16, 1, 0.3, 1] } // volta desacelerando
      }
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}

// O botao do easter egg.
export function BotaoColapso() {
  const { disparar, colapsando } = useColapso();

  return (
    <button
      onClick={disparar}
      disabled={colapsando}
      className="mt-2 rounded-full border border-border px-5 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
    >
      Clique e veja o que acontece
    </button>
  );
}
