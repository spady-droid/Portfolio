import Image from "next/image";
import type { Projeto } from "@/data/projetos";

// Componente reutilizavel: recebe um 'projeto' (prop) e desenha o card.
export function ProjetoCard({ projeto }: { projeto: Projeto }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-zinc-300 p-5 text-left dark:border-zinc-700">
      {/* so mostra a imagem SE o projeto tiver uma (renderizacao condicional) */}
      {projeto.imagem && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <Image
            src={projeto.imagem}
            alt={`Captura de tela do projeto ${projeto.titulo}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      )}

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

      {/* so mostra o link SE existir um repo */}
      {projeto.links.repo && (
        <a
          href={projeto.links.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline"
        >
          Ver repositório
        </a>
      )}
    </article>
  );
}
