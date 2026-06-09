import Link from "next/link";
import { notFound } from "next/navigation";
import { projetos } from "@/data/projetos";
import { Mockup } from "@/components/Mockup";
import { Tilt } from "@/components/Tilt";

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
    <main className="animate-fade-up mx-auto flex min-h-screen max-w-3xl flex-col gap-10 p-8">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
      >
        ← Voltar
      </Link>

      <header className="flex flex-col gap-4">
        <span className="font-mono text-xs text-accent">{projeto.ano}</span>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          {projeto.titulo}
        </h1>
        <p className="text-lg text-muted">{projeto.resumo}</p>
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
        {projeto.links.repo && (
          <a
            href={projeto.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent underline"
          >
            Ver repositório
          </a>
        )}
      </header>

      {caso && (
        <>
          {caso.problema && (
            <section className="flex flex-col gap-2">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                O problema
              </h2>
              <p className="text-muted">{caso.problema}</p>
            </section>
          )}

          {caso.solucao && (
            <section className="flex flex-col gap-2">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                A solução
              </h2>
              <p className="text-muted">{caso.solucao}</p>
            </section>
          )}

          <section className="flex flex-col gap-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
              Telas
            </h2>
            {/* flex + justify-center: linha incompleta (impar) fica centralizada */}
            <div className="flex flex-wrap justify-center gap-8">
              {caso.galeria.map((img) => (
                <figure
                  key={img.src}
                  className={
                    caso.formato === "mobile"
                      ? "flex w-full flex-col gap-3 sm:w-[calc(33.333%-1.34rem)]"
                      : "flex w-full flex-col gap-3"
                  }
                >
                  <Tilt>
                    <Mockup src={img.src} alt={img.legenda} formato={caso.formato} />
                  </Tilt>
                  <figcaption className="text-center text-sm text-muted">
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
