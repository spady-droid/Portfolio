import type { Projeto } from "@/data/projetos";

// Um COMPONENTE reutilizavel. Ele recebe um 'projeto' (a "prop")
// e devolve o card visual desse projeto.
// O tipo { projeto: Projeto } diz: "este componente espera receber
// uma prop chamada 'projeto', do tipo Projeto".
export function ProjetoCard({ projeto }: { projeto: Projeto }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-zinc-300 p-5 text-left dark:border-zinc-700">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold">{projeto.titulo}</h3>
        <span className="text-xs text-zinc-500">{projeto.ano}</span>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {projeto.resumo}
      </p>

      {/* lista de tecnologias: um .map() dentro do componente */}
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

      {/* so mostra o link SE existir um repo (renderizacao condicional) */}
      {projeto.links.repo && (
        <a
          href={projeto.links.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline"
        >
          Ver repositorio
        </a>
      )}
    </article>
  );
}
