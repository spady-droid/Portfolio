import Link from "next/link";
import { notFound } from "next/navigation";
import { projetos } from "@/data/projetos";
import { Mockup } from "@/components/Mockup";

// Diz ao Next QUAIS paginas gerar (uma por projeto). Roda no build.
export function generateStaticParams() {
  return projetos.map((projeto) => ({ slug: projeto.slug }));
}

// No Next 16 o 'params' chega como Promise — por isso 'async' + 'await params'.
export default async function ProjetoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projeto = projetos.find((p) => p.slug === slug);

  // slug que nao existe -> pagina 404
  if (!projeto) notFound();

  const caso = projeto.caso;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 p-8">
      <Link href="/" className="text-sm text-zinc-500 underline">
        ← Voltar
      </Link>

      <header className="flex flex-col gap-4">
        <span className="text-xs text-zinc-500">{projeto.ano}</span>
        <h1 className="text-3xl font-bold sm:text-4xl">{projeto.titulo}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
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
      </header>

      {caso && (
        <>
          {caso.problema && (
            <section className="flex flex-col gap-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                O problema
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">{caso.problema}</p>
            </section>
          )}

          {caso.solucao && (
            <section className="flex flex-col gap-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                A solução
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">{caso.solucao}</p>
            </section>
          )}

          <section className="flex flex-col gap-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
              Telas
            </h2>
            <div
              className={
                caso.formato === "mobile"
                  ? "grid gap-8 sm:grid-cols-3"
                  : "flex flex-col gap-8"
              }
            >
              {caso.galeria.map((img) => (
                <figure key={img.src} className="flex flex-col gap-3">
                  <Mockup src={img.src} alt={img.legenda} formato={caso.formato} />
                  <figcaption className="text-center text-sm text-zinc-500">
                    {img.legenda}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
