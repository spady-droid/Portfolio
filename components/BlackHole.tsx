"use client";

import { useEffect, useRef } from "react";
import { useColapso } from "@/components/Colapso";

// Vertex shader: so posiciona um retangulo que cobre a tela inteira.
const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Fragment shader: calcula a COR de cada pixel. Aqui mora o buraco negro.
// uCollapse (0 a 1) e a "forca extra" durante o colapso do site.
const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uCollapse;

// "ruido" pseudo-aleatorio para distribuir estrelas
float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// uma camada de estrelas
float starLayer(vec2 uv, float density, float thresh){
  vec2 g = floor(uv * density);
  vec2 f = fract(uv * density);
  float h = hash(g);
  float s = step(thresh, h);
  float d = length(f - 0.5);
  float star = s * smoothstep(0.3, 0.0, d);
  star *= 0.6 + 0.4 * sin(uTime * 2.0 + h * 60.0); // pisca
  return star;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution.xy;     // 0..1
  float aspect = uResolution.x / uResolution.y;

  vec2 p = uv - 0.5;  p.x *= aspect;              // centrado
  vec2 m = uMouse - 0.5;  m.x *= aspect;
  // durante o colapso o buraco vai pro CENTRO da tela (suga tudo pra la)
  vec2 center = m * 0.35 * (1.0 - uCollapse);

  vec2 d = p - center;
  float r = length(d);

  // LENTE GRAVITACIONAL: forca cresce com o colapso
  float forca = 0.05 + 0.22 * uCollapse;
  float lens = min(forca / (r * r + 0.02), 3.0 + 3.0 * uCollapse);
  vec2 dir = d / (r + 1e-4);
  float ang = lens * (1.0 + 1.2 * uCollapse);     // redemoinho mais violento
  float ca = cos(ang), sa = sin(ang);
  vec2 warped = center + mat2(ca, -sa, sa, ca) * d - dir * lens * 0.12;

  // estrelas (amostradas nas coordenadas JA encurvadas) + leve deriva
  vec2 suv = warped + vec2(uTime * 0.01, uTime * 0.004);
  float field = starLayer(suv, 8.0, 0.93) + 0.5 * starLayer(suv * 2.0 + 5.0, 14.0, 0.96);

  vec3 col = vec3(0.03, 0.05, 0.10);              // navy profundo
  col += field * vec3(0.7, 0.85, 1.0);

  // disco de acrescao (anel de menta girando) — cresce e brilha no colapso
  float ringR = 0.17 + 0.07 * uCollapse;
  float ring = smoothstep(0.045, 0.0, abs(r - ringR));
  float a = atan(d.y, d.x);
  ring *= 0.5 + 0.5 * sin(a * 2.0 - uTime * (1.2 + 3.0 * uCollapse));
  col += ring * vec3(0.37, 0.92, 0.83) * (1.4 + 1.6 * uCollapse);

  // brilho externo suave
  col += vec3(0.37, 0.92, 0.83) * (0.025 + 0.05 * uCollapse) / (r + 0.04);

  // horizonte de eventos: nucleo preto (engorda durante o colapso)
  float nucleo = 0.14 + 0.05 * uCollapse;
  float core = smoothstep(nucleo + 0.01, nucleo - 0.01, r);
  col *= (1.0 - core);

  gl_FragColor = vec4(col, 1.0);
}
`;

export function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colapsando } = useColapso();
  // ref espelha o estado pro loop de render (que roda fora do React)
  const alvoColapso = useRef(0);

  useEffect(() => {
    alvoColapso.current = colapsando ? 1 : 0;
  }, [colapsando]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(sh));
      }
      return sh;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // retangulo de tela cheia (2 triangulos)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uCollapse = gl.getUniformLocation(prog, "uCollapse");

    const mouse = { x: 0.5, y: 0.5 };
    const cur = { x: 0.5, y: 0.5 };
    let collapse = 0; // valor suavizado de 0..1
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1 - e.clientY / window.innerHeight; // y invertido (WebGL)
    };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const start = performance.now();
    let raf = 0;
    const render = () => {
      const t = reduced ? 0 : (performance.now() - start) / 1000;
      cur.x += (mouse.x - cur.x) * 0.05; // arrasto suave
      cur.y += (mouse.y - cur.y) * 0.05;
      collapse += (alvoColapso.current - collapse) * 0.045; // rampa lenta
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, cur.x, cur.y);
      gl.uniform1f(uCollapse, collapse);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 h-full w-full"
    />
  );
}
