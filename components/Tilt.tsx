"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Tilt 3D: o card inclina seguindo o mouse, como se fosse uma placa
// flutuando. Conceitos: motion values (animam SEM re-renderizar o
// componente a cada pixel) + spring (mola: movimento com peso natural).
export function Tilt({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // motion values: "caixinhas" de valor que o Framer anima direto no DOM
  const rx = useMotionValue(0); // rotacao em X (inclinar pra cima/baixo)
  const ry = useMotionValue(0); // rotacao em Y (inclinar pra esquerda/direita)

  // spring = mola: em vez de pular pro valor, ele chega com inercia
  const srx = useSpring(rx, { stiffness: 250, damping: 20 });
  const sry = useSpring(ry, { stiffness: 250, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    // posicao do mouse dentro do card, de -0.5 (borda) a +0.5 (outra borda)
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 14); // mouse a direita -> gira pra direita
    rx.set(-py * 10); // mouse em cima -> inclina pra tras
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      // transformPerspective da a profundidade (sem ela nao parece 3D)
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 700 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
