"use client";
// ^ ESTA linha e a chave da interatividade: vira "Client Component",
// roda no navegador e tem acesso ao mouse.

import { useEffect, useRef } from "react";

// Brilho de menta + lente que deforma levemente o fundo, seguindo o mouse
// com um leve atraso (efeito "gravitacional").
export function Spotlight() {
  // useRef = referencia direta a um elemento do DOM (sem re-render a cada frame).
  const glowRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 'alvo' = onde o mouse esta; 'atual' = onde o efeito esta agora.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    const atual = { ...target };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    const tick = () => {
      // LERP: a cada quadro, anda 12% da distancia ate o alvo.
      // Isso cria o "arrasto" suave (o efeito persegue o mouse com atraso).
      atual.x += (target.x - atual.x) * 0.12;
      atual.y += (target.y - atual.y) * 0.12;

      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(260px circle at ${atual.x}px ${atual.y}px, rgba(94, 234, 212, 0.10), transparent 70%)`;
      }
      if (lensRef.current) {
        // centraliza a lente (160px) no ponto atual
        lensRef.current.style.transform = `translate(${atual.x - 80}px, ${atual.y - 80}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      {/* Brilho (atras do conteudo) */}
      <div ref={glowRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />

      {/* Lente: deforma levemente o que esta atras dela (efeito de distorcao) */}
      <div
        ref={lensRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 h-40 w-40 rounded-full"
        style={{
          backdropFilter: "blur(1.5px) brightness(1.08)",
          WebkitBackdropFilter: "blur(1.5px) brightness(1.08)",
          // mascara: a deformacao some suavemente nas bordas do circulo
          maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 70%)",
        }}
      />
    </>
  );
}
