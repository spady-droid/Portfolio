"use client";

import { useEffect, useRef } from "react";
import { useColapso } from "@/components/Colapso";

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uCollapse;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float starLayer(vec2 uv, float density, float thresh){
  vec2 g = floor(uv * density);
  vec2 f = fract(uv * density);
  float h = hash(g);
  float s = step(thresh, h);
  float d = length(f - 0.5);
  float star = s * smoothstep(0.32, 0.0, d);
  star *= 0.56 + 0.44 * sin(uTime * 2.0 + h * 60.0);
  return star;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;

  vec2 p = uv - 0.5;
  p.x *= aspect;
  vec2 m = uMouse - 0.5;
  m.x *= aspect;

  vec2 center = m * 0.32 * (1.0 - uCollapse);
  vec2 d = p - center;
  float r = length(d);
  vec2 dir = d / (r + 1e-4);

  float gravity = 0.014 + 0.39 * uCollapse;
  float lens = min(gravity / (r * r + 0.012), 5.2 + 5.5 * uCollapse);
  float angle = lens * (1.15 + 2.2 * uCollapse);
  float ca = cos(angle);
  float sa = sin(angle);
  vec2 warped = center + mat2(ca, -sa, sa, ca) * d - dir * lens * (0.09 + 0.05 * uCollapse);

  vec2 starUv = warped + vec2(uTime * 0.01, uTime * 0.004);
  float stars =
    starLayer(starUv, 8.0, 0.93) +
    0.55 * starLayer(starUv * 2.0 + 5.0, 14.0, 0.96) +
    0.25 * starLayer(starUv * 4.0 - 2.0, 25.0, 0.985);

  vec3 color = vec3(0.008, 0.012, 0.025);
  color += stars * vec3(0.72, 0.84, 1.0) * (0.72 + 0.45 * uCollapse);

  float a = atan(d.y, d.x);
  vec2 diskP = vec2(d.x, d.y * (2.8 - 0.7 * uCollapse));
  float diskR = length(diskP);
  float diskBand = smoothstep(0.105, 0.0, abs(diskR - (0.075 + 0.195 * uCollapse)));
  float diskGap = smoothstep(0.08, 0.13, diskR);
  float turbulence =
    0.64 +
    0.36 * sin(a * 9.0 - uTime * (3.2 + 4.8 * uCollapse) + sin(diskR * 46.0));
  float doppler = 0.5 + 0.5 * cos(a - 0.55);
  vec3 hot = mix(vec3(1.0, 0.32, 0.12), vec3(0.55, 0.94, 1.0), doppler);
  color += hot * diskBand * diskGap * turbulence * (0.035 + 3.4 * uCollapse);

  float photon = smoothstep(0.012, 0.0, abs(r - (0.052 + 0.125 * uCollapse)));
  color += vec3(1.0, 0.86, 0.62) * photon * (0.06 + 3.65 * uCollapse);

  color += vec3(0.42, 0.86, 1.0) * (0.0015 + 0.066 * uCollapse) / (r + 0.055);
  color *= 1.0 - smoothstep(0.55, 1.15, length(p));

  float horizon = 0.018 + 0.139 * uCollapse;
  float core = smoothstep(horizon + 0.012, horizon - 0.004, r);
  color *= (1.0 - core);
  color += vec3(0.015, 0.02, 0.04) *
    smoothstep(horizon, horizon + 0.08, r) *
    (1.0 - smoothstep(0.42, 0.8, r));

  gl_FragColor = vec4(color, 1.0);
}
`;

export function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colapsando } = useColapso();
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
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const vert = compile(gl.VERTEX_SHADER, VERT);
    const frag = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!program || !vert || !frag) return;

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uCollapse = gl.getUniformLocation(program, "uCollapse");

    const mouse = { x: 0.5, y: 0.5 };
    const current = { x: 0.5, y: 0.5 };
    let collapse = 0;

    const onMove = (event: PointerEvent) => {
      mouse.x = event.clientX / window.innerWidth;
      mouse.y = 1 - event.clientY / window.innerHeight;
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let frame = 0;

    const render = () => {
      const time = reduced ? 0 : (performance.now() - start) / 1000;
      current.x += (mouse.x - current.x) * 0.05;
      current.y += (mouse.y - current.y) * 0.05;
      collapse += (alvoColapso.current - collapse) * 0.06;

      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, current.x, current.y);
      gl.uniform1f(uCollapse, collapse);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
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
