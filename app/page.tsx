import { skills } from "@/data/skills";
import { projetos } from "@/data/projetos";
import { ProjetoCard } from "@/components/ProjetoCard";

export default function Home() {
  const nome = "Eduardo Coelho da Silva";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center gap-12 p-8 text-center">
      {/* HERO */}
      <div className="flex flex-col gap-4 pt-16">
        <p className="text-sm uppercase tracking-widest text-zinc-500">
          Portfolio
        </p>
        <h1 className="text-4xl font-bold sm:text-6xl">{nome}</h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Desenvolvedor Full Stack — transformo problemas reais de negócio em
          software que roda em produção.
        </p>
      </div>

      {/* SOBRE */}
      <section className="flex max-w-xl flex-col items-center gap-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
          Sobre
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Desenvolvedor Full Stack, formando em Ciência da Computação. Construo
          sistemas completos, do back-end à interface — web e mobile. Já coloquei
          software em produção resolvendo problemas reais de negócio.
        </p>
      </section>

      {/* SKILLS */}
      <section className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
          Skills
        </h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <li
              key={skill.nome}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
            >
              {skill.nome}
            </li>
          ))}
        </ul>
      </section>

      {/* PROJETOS */}
      <section className="flex w-full flex-col items-center gap-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
          Projetos
        </h2>
        <div className="grid w-full gap-4 sm:grid-cols-2">
          {projetos.map((projeto) => (
            <ProjetoCard key={projeto.slug} projeto={projeto} />
          ))}
        </div>
      </section>

      {/* CONTATO  — troque email/linkedin pelos seus */}
      <section className="flex flex-col items-center gap-4 pb-16">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
          Contato
        </h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          <a
            href="https://github.com/spady-droid"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub
          </a>
          <a href="mailto:seu-email@exemplo.com" className="underline">
            Email
          </a>
          <a
            href="https://linkedin.com/in/seu-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </main>
  );
}
