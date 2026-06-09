"use client";
// 'template.tsx' e um arquivo especial do Next: diferente de 'layout.tsx'
// (que NAO re-renderiza ao navegar), o template e RECRIADO a cada
// navegacao. Por isso a animacao de entrada roda toda vez que voce
// troca de pagina — dando a sensacao de transicao.

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} // comeca invisivel
      animate={{ opacity: 1 }} // anima ate visivel
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
