import Link from "next/link";
import type { Projeto } from "@/data/projetos";

// Card de projeto: uniforme, sem imagem (a imagem fica na pagina de case).
// 'h-full' + 'mt-auto' deixam todos os cards do mesmo tamanho e alinham
// o "Ver detalhes" no rodape de cada um.
export function ProjetoCard({ projeto }: { projeto: Projeto }) {
  return (
    <Link
      href={`/projetos/${projeto.slug}`}
      className="flex h-full flex-col gap-3 rounded-xl border border-zinc-300 p-5 text-left transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold">{projeto.titulo}</h3>
        <span className="shrink-0 text-xs text-zinc-500">{projeto.ano}</span>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {projeto.resumo}
      </p>

      <ul className="flex flex-wrap gap-2">
        {projeto.tecnologias.map((tec) => (
          <li
            key={tec}
            className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs dark:bg-zinc-800"
          >
            {tec}
          </li>
        ))}
      </ul>

      <span className="mt-auto pt-2 text-sm font-medium">Ver detalhes →</span>
    </Link>
  );
}
