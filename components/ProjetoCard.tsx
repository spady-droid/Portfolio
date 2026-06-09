import Image from "next/image";
import Link from "next/link";
import type { Projeto } from "@/data/projetos";

// Componente reutilizavel: recebe um 'projeto' (prop) e desenha o card.
// O card inteiro e um Link para a pagina de case do projeto.
export function ProjetoCard({ projeto }: { projeto: Projeto }) {
  return (
    <Link
      href={`/projetos/${projeto.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-zinc-300 p-5 text-left transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
    >
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

      <span className="mt-1 text-sm font-medium">Ver detalhes →</span>
    </Link>
  );
}
