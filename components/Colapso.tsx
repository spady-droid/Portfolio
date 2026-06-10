"use client";

// ============================================================
// O "colapso": botao dispara -> o site e DISTORCIDO num redemoinho
// (pixels entortam, rotacao diferencial), cai em 3D pra dentro do
// buraco negro espaguetificando -> so buraco + estrelas -> tudo volta.
//
// Conceitos:
// - React Context: estado compartilhado (botao + conteudo + shader).
// - transform (rigido): Z + espiral + espaguete do bloco inteiro.
// - feDisplacementMap (SVG): distorcao POR PIXEL — o mapa em espiral
//   diz de onde cada pixel deve ser amostrado; intensidade animada.
// ============================================================

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Fase = "parado" | "caindo" | "voltando";

interface ColapsoCtx {
  fase: Fase;
  colapsando: boolean; // conveniencia: fase === "caindo"
  origem: { x: number; y: number };
  disparar: () => void;
}

const Ctx = createContext<ColapsoCtx | null>(null);

export function useColapso() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useColapso precisa estar dentro de <ColapsoProvider>");
  return ctx;
}

export function ColapsoProvider({ children }: { children: React.ReactNode }) {
  const [fase, setFase] = useState<Fase>("parado");
  const [origem, setOrigem] = useState({ x: 0, y: 0 });

  const disparar = () => {
    if (fase !== "parado") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setOrigem({
      x: window.innerWidth / 2,
      y: window.scrollY + window.innerHeight / 2,
    });
    setFase("caindo");
    setTimeout(() => setFase("voltando"), 3200);
    setTimeout(() => setFase("parado"), 4800);
  };

  return (
    <Ctx.Provider
      value={{ fase, colapsando: fase === "caindo", origem, disparar }}
    >
      {children}
    </Ctx.Provider>
  );
}

// ------------------------------------------------------------
// Mapa de redemoinho: imagem onde os canais R/G codificam, por
// pixel, o deslocamento (dx, dy) de onde amostrar a imagem.
// Espiral: rotacao DIFERENCIAL — angulo maximo no centro, zero na borda.
// ------------------------------------------------------------
const FORCA = 600; // 'scale' maximo do feDisplacementMap (px)

function gerarMapaRedemoinho(
  bandaW: number,
  bandaY: number,
  bandaH: number,
  cx: number,
  cy: number,
  raio: number,
): string {
  const W = 256;
  const H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);

  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      // posicao deste texel em coordenadas da pagina (dentro da banda)
      const x = ((px + 0.5) / W) * bandaW;
      const y = bandaY + ((py + 0.5) / H) * bandaH;
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);

      let ox = 0;
      let oy = 0;
      if (r < raio && r > 0.001) {
        const t = 1 - r / raio; // 1 no centro -> 0 na borda
        const ang = t * t * 3.0; // rotacao diferencial (ate ~172 graus)
        const ca = Math.cos(ang);
        const sa = Math.sin(ang);
        // amostrar da posicao girada => offset de deslocamento
        ox = cx + dx * ca - dy * sa - x;
        oy = cy + dx * sa + dy * ca - y;
        const m = FORCA / 2; // clamp pro alcance representavel
        ox = Math.max(-m, Math.min(m, ox));
        oy = Math.max(-m, Math.min(m, oy));
      }

      const i = (py * W + px) * 4;
      img.data[i] = Math.round((ox / FORCA) * 255 + 127.5); // R = dx
      img.data[i + 1] = Math.round((oy / FORCA) * 255 + 127.5); // G = dy
      img.data[i + 2] = 127;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL("image/png");
}

// Envolve TODO o conteudo do site.
export function ColapsoConteudo({ children }: { children: React.ReactNode }) {
  const { fase, colapsando, origem } = useColapso();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const feImgRef = useRef<SVGFEImageElement>(null);
  // regiao do filtro: SO uma banda de ~2 viewports em volta do buraco
  // (filtrar o documento inteiro re-rasteriza milhoes de pixels por
  // frame e derruba o FPS — limitar a regiao e o que torna viavel)
  const [banda, setBanda] = useState({ x: 0, y: 0, w: 1, h: 1 });

  // Quando comeca a cair: gera o mapa centrado no buraco e anima a
  // intensidade (scale) do feDisplacementMap com um loop rAF.
  useEffect(() => {
    if (fase === "parado") return;
    const el = wrapperRef.current;
    if (!el) return;

    const docW = el.scrollWidth;
    const vh = window.innerHeight;
    const bandaY = Math.max(0, origem.y - vh);
    const bandaH = vh * 2;
    setBanda({ x: 0, y: bandaY, w: docW, h: bandaH });

    if (fase === "caindo" && feImgRef.current) {
      const raio = Math.max(window.innerWidth, vh) * 0.9;
      const url = gerarMapaRedemoinho(docW, bandaY, bandaH, origem.x, origem.y, raio);
      feImgRef.current.setAttribute("href", url);
    }

    // rampa da forca do redemoinho: caindo 0->FORCA, voltando FORCA->0
    const dur = 1500;
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / dur);
      const eased = fase === "caindo" ? p * p * p : (1 - p) * (1 - p);
      dispRef.current?.setAttribute("scale", String(FORCA * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fase, origem]);

  return (
    <>
      {/* filtro SVG invisivel; o CSS 'filter: url(#redemoinho)' usa ele */}
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <filter
          id="redemoinho"
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          x={banda.x}
          y={banda.y}
          width={banda.w}
          height={banda.h}
        >
          <feImage
            ref={feImgRef}
            x={banda.x}
            y={banda.y}
            width={banda.w}
            height={banda.h}
            preserveAspectRatio="none"
            result="mapa"
          />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="mapa"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <motion.div
        ref={wrapperRef}
        initial={false}
        style={{
          transformOrigin: `${origem.x}px ${origem.y}px`,
          transformPerspective: 900,
          pointerEvents: colapsando ? "none" : "auto",
          // o filtro so fica ativo durante o efeito (senao pesa o scroll)
          filter: fase === "parado" ? "none" : "url(#redemoinho)",
        }}
        animate={
          colapsando
            ? {
                // mergulha no Z + espirala + espaguetifica
                z: [0, -180, -1400, -3800],
                rotate: [0, 30, 170, 430],
                scaleY: [1, 1.8, 6.5, 0.001],
                scaleX: [1, 0.6, 0.05, 0.001],
                opacity: [1, 1, 0.8, 0],
              }
            : {
                // emerge do fundo desenrolando
                z: [-3800, -1200, -120, 0],
                rotate: [430, 170, 18, 0],
                scaleY: [0.001, 5.5, 1.25, 1],
                scaleX: [0.001, 0.06, 0.75, 1],
                opacity: [0, 0.8, 1, 1],
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
    </>
  );
}

// O botao do easter egg.
export function BotaoColapso() {
  const { disparar, fase } = useColapso();

  return (
    <button
      onClick={disparar}
      disabled={fase !== "parado"}
      className="mt-2 rounded-full border border-border px-5 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
    >
      Clique e veja o que acontece
    </button>
  );
}
