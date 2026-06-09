"use client";
// ^ ESTA linha e a chave da interatividade.
// Sem ela, este componente rodaria so no servidor e nao teria acesso
// ao mouse. Com ela, vira "Client Component" e roda no navegador.

import { useEffect, useState } from "react";

// Efeito: um brilho de menta que segue o cursor pela tela.
export function Spotlight() {
  // useState guarda a posicao do mouse. Comeca como null (antes de montar).
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // useEffect roda DEPOIS que o componente aparece no navegador.
  useEffect(() => {
    // posicao inicial: meio da tela
    setPos({ x: window.innerWidth / 2, y: window.innerHeight / 3 });

    // toda vez que o mouse se move, atualizamos a posicao
    const handle = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", handle);

    // limpeza: remove o listener quando o componente sai (boa pratica)
    return () => window.removeEventListener("pointermove", handle);
  }, []);

  return (
    <div
      aria-hidden
      // fixed inset-0 = cobre a tela toda; -z-10 = fica ATRAS do conteudo;
      // pointer-events-none = nao atrapalha cliques.
      className="pointer-events-none fixed inset-0 -z-10"
      // o brilho e um gradiente radial centrado na posicao do mouse
      style={{
        background: pos
          ? `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(94, 234, 212, 0.12), transparent 70%)`
          : undefined,
      }}
    />
  );
}
