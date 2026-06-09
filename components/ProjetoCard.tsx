import Link from "next/link";
import type { Projeto } from "@/data/projetos";

// Card de projeto: uniforme, com hover de "levantar" + brilho de menta.
export function ProjetoCard({ projeto }: { projeto: Projeto }) {
  return (
    <Link
      href={`/projetos/${projeto.slug}`}
      className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-surface p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_30px_-12px_var(--accent)]"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
          {projeto.titulo}
        </h3>
        <span className="shrink-0 font-mono text-xs text-muted">
          {projeto.ano}
        </span>
      </div>

      <p className="text-sm text-muted">{projeto.resumo}</p>

      <ul className="flex flex-wrap gap-2">
        {projeto.tecnologias.map((tec) => (
          <li
            key={tec}
            className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
          >
            {tec}
          </li>
        ))}
      </ul>

      <span className="mt-auto pt-2 text-sm font-medium text-accent">
        Ver detalhes →
      </span>
    </Link>
  );
}
