import { skills } from "@/data/skills";
import { projetos } from "@/data/projetos";
import { ProjetoCard } from "@/components/ProjetoCard";

export default function Home() {
  const nome = "Eduardo Coelho da Silva";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center gap-12 p-8 text-center">
      <div className="flex flex-col gap-4 pt-16">
        <p className="text-sm uppercase tracking-widest text-zinc-500">
          Portfolio
        </p>
        <h1 className="text-4xl font-bold sm:text-6xl">{nome}</h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Desenvolvedor de Sistemas de Automacao e Entusiasta de Tecnologia e
          Jogos.
        </p>
      </div>

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
    </main>
  );
}
