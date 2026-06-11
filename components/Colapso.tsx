"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toCanvas } from "html-to-image";

type Fase = "parado" | "caindo" | "voltando";

interface ColapsoCtx {
  fase: Fase;
  colapsando: boolean;
  origem: { x: number; y: number };
  disparar: () => void;
}

const Ctx = createContext<ColapsoCtx | null>(null);
const QUEDA_MS = 3600;
const VOLTA_MS = 1500;

export function useColapso() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useColapso precisa estar dentro de <ColapsoProvider>");
  return ctx;
}

export function ColapsoProvider({ children }: { children: ReactNode }) {
  const [fase, setFase] = useState<Fase>("parado");
  const [origem, setOrigem] = useState({ x: 0, y: 0 });
  const timersRef = useRef<number[]>([]);

  const limpar = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const disparar = useCallback(() => {
    if (fase !== "parado") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    limpar();
    setOrigem({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setFase("caindo");
    timersRef.current = [
      window.setTimeout(() => setFase("voltando"), QUEDA_MS),
      window.setTimeout(() => setFase("parado"), QUEDA_MS + VOLTA_MS),
    ];
  }, [fase, limpar]);

  useEffect(() => limpar, [limpar]);

  return (
    <Ctx.Provider value={{ fase, colapsando: fase === "caindo", origem, disparar }}>
      {children}
    </Ctx.Provider>
  );
}

// ---- shaders do warp ----
const VERT = `attribute vec2 position; void main(){ gl_Position = vec4(position,0.0,1.0); }`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;       // tamanho do buffer (px reais)
uniform vec4 uRect;      // retangulo do conteudo em CSS px: x,y,w,h
uniform vec2 uCenter;    // centro do buraco em CSS px
uniform float uProgress; // 0..1
uniform float uDpr;

void main(){
  // pixel atual em CSS px, origem no topo-esquerda
  vec2 sp = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 d = sp - uCenter;
  float r = length(d);
  float ang = atan(d.y, d.x);
  float p = uProgress;

  // ESPIRAL: rotacao diferencial (mais forte perto do centro), cresce com p
  float swirl = p * (900.0 + 1700.0 * p) / (r + 55.0);
  // PINCH: amostra de um raio MAIOR -> conteudo escorre pra dentro
  float pull = p * 360.0 * (1.0 - smoothstep(0.0, 760.0, r));
  float a2 = ang + swirl;
  float rs = r + pull;
  vec2 w = uCenter + vec2(cos(a2), sin(a2)) * rs;

  // amostra a textura do conteudo (topo do conteudo casa com topo da textura)
  vec2 uv = (w - uRect.xy) / uRect.zw;
  vec4 c = vec4(0.0);
  if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) c = texture2D(uTex, uv);

  // redshift perto do centro
  float red = smoothstep(240.0, 40.0, r) * p;
  c.rgb = mix(c.rgb, c.rgb * vec3(1.55, 0.45, 0.32), red);

  // comido pelo horizonte de eventos (some no nucleo)
  c.a *= smoothstep(38.0, 115.0, r);

  // saida premultiplicada (compositing correto sobre o buraco negro)
  gl_FragColor = vec4(c.rgb * c.a, c.a);
}
`;

interface WarpApi {
  upload: (src: HTMLCanvasElement, rect: DOMRect) => void;
}

// Envolve TODO o conteudo. No colapso: captura o conteudo numa textura e
// um shader WebGL TORCE essa textura em espiral pra dentro do buraco negro
// (deformacao real por pixel). O conteudo vivo fica escondido durante o efeito.
export function ColapsoConteudo({ children }: { children: ReactNode }) {
  const { fase, origem } = useColapso();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<WarpApi | null>(null);

  // estado de animacao (fora do React, lido pelo loop)
  const progress = useRef(0);
  const anim = useRef({ from: 0, to: 0, start: 0, dur: 1, active: false });
  const ready = useRef(false); // textura capturada?
  const [overlay, setOverlay] = useState(false); // canvas visivel / conteudo escondido

  // ---- setup WebGL (uma vez) ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error("warp shader:", gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {
      tex: gl.getUniformLocation(prog, "uTex"),
      res: gl.getUniformLocation(prog, "uRes"),
      rect: gl.getUniformLocation(prog, "uRect"),
      center: gl.getUniformLocation(prog, "uCenter"),
      progress: gl.getUniformLocation(prog, "uProgress"),
      dpr: gl.getUniformLocation(prog, "uDpr"),
    };
    gl.uniform1i(U.tex, 0);

    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let rect = { x: 0, y: 0, w: 1, h: 1 };

    apiRef.current = {
      upload: (src, r) => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        rect = { x: r.left, y: r.top, w: r.width, h: r.height };
        ready.current = true;
      },
    };

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    gl.clearColor(0, 0, 0, 0);
    let raf = 0;
    const loop = () => {
      const a = anim.current;
      if (a.active) {
        const e = Math.min(1, (performance.now() - a.start) / a.dur);
        const s = e * e * (3 - 2 * e); // smoothstep
        progress.current = a.from + (a.to - a.from) * s;
        if (e >= 1) a.active = false;
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (ready.current) {
        gl.useProgram(prog);
        gl.uniform2f(U.res, canvas.width, canvas.height);
        gl.uniform4f(U.rect, rect.x, rect.y, rect.w, rect.h);
        gl.uniform2f(U.center, window.innerWidth / 2, window.innerHeight / 2);
        gl.uniform1f(U.progress, progress.current);
        gl.uniform1f(U.dpr, dpr);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      apiRef.current = null;
    };
  }, []);

  // ---- dispara captura/animacao conforme a fase ----
  useEffect(() => {
    let cancel = false;
    if (fase === "caindo") {
      const node = wrapperRef.current;
      if (!node) return;
      toCanvas(node, {
        pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        cacheBust: false,
      })
        .then((shot) => {
          if (cancel) return;
          apiRef.current?.upload(shot, node.getBoundingClientRect());
          setOverlay(true); // esconde conteudo vivo, mostra o warp
          // torce de 0 -> 1 ao longo de ~2.6s (da pra VER colapsando)
          anim.current = { from: 0, to: 1, start: performance.now(), dur: 2600, active: true };
        })
        .catch((e) => console.error("captura falhou", e));
    } else if (fase === "voltando") {
      // destorce de volta
      anim.current = { from: progress.current, to: 0, start: performance.now(), dur: 1300, active: true };
    } else {
      // parado
      setOverlay(false);
      ready.current = false;
      progress.current = 0;
      anim.current.active = false;
    }
    return () => {
      cancel = true;
    };
  }, [fase]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 h-full w-full"
        style={{ opacity: overlay ? 1 : 0, transition: "opacity 150ms linear" }}
      />
      <div
        ref={wrapperRef}
        className="flex flex-1 flex-col"
        style={{
          opacity: overlay ? 0 : 1,
          pointerEvents: fase === "parado" ? "auto" : "none",
        }}
      >
        {children}
      </div>
    </>
  );
}

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
