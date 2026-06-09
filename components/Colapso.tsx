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

// Envolve TODO o conteudo do site; quando colapsando, ESPAGUETIFICA:
// as "forcas de mare" esticam o site na direcao da queda (scaleY cresce)
// e comprimem nas laterais (scaleX encolhe) — vira um fio e e engolido.
// Na volta, o fio e cuspido e o site se reforma.
//
// Conceito: KEYFRAMES — arrays de valores percorridos em etapas;
// 'times' diz em que fracao da duracao cada etapa acontece.
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
          ? {
              // estica devagar -> vira fio -> e engolido
              scaleY: [1, 1.7, 7, 0.001],
              scaleX: [1, 0.55, 0.03, 0.001],
              rotate: [0, 1, 8, 20],
              opacity: [1, 1, 0.85, 0],
              filter: ["blur(0px)", "blur(0px)", "blur(2px)", "blur(8px)"],
            }
          : {
              // cuspido como fio -> se reforma
              scaleY: [0.001, 6, 1.3, 1],
              scaleX: [0.001, 0.04, 0.7, 1],
              rotate: [20, 6, -1, 0],
              opacity: [0, 0.85, 1, 1],
              filter: ["blur(8px)", "blur(3px)", "blur(0px)", "blur(0px)"],
            }
      }
      transition={
        colapsando
          ? { duration: 1.8, times: [0, 0.45, 0.82, 1], ease: "easeIn" }
          : { duration: 1.6, times: [0, 0.3, 0.75, 1], ease: "easeOut" }
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
