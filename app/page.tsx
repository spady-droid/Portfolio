import { skills } from "@/data/skills";
import { projetos } from "@/data/projetos";
import { ProjetoCard } from "@/components/ProjetoCard";
import { Tilt } from "@/components/Tilt";
import { BotaoColapso } from "@/components/Colapso";

export default function Home() {
  const nome = "Eduardo Coelho da Silva";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center gap-16 p-8 text-center">
      {/* HERO */}
      <div className="animate-fade-up flex flex-col items-center gap-4 pt-20">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Portfolio
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          {nome}
        </h1>
        <p className="max-w-md text-lg text-muted">
          Desenvolvedor Full Stack — transformo problemas reais de negócio em
          software que roda em produção.
        </p>
        <BotaoColapso />
      </div>

      {/* SOBRE */}
      <section
        className="animate-fade-up flex max-w-xl flex-col items-center gap-4"
        style={{ animationDelay: "0.1s" }}
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Sobre
        </h2>
        <p className="text-muted">
          Desenvolvedor Full Stack, formando em Ciência da Computação. Construo
          sistemas completos, do back-end à interface — web e mobile. Já coloquei
          software em produção resolvendo problemas reais de negócio.
        </p>
      </section>

      {/* SKILLS */}
      <section
        className="animate-fade-up flex flex-col items-center gap-4"
        style={{ animationDelay: "0.2s" }}
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Skills
        </h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <li
              key={skill.nome}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              {skill.nome}
            </li>
          ))}
        </ul>
      </section>

      {/* PROJETOS */}
      <section
        className="animate-fade-up flex w-full flex-col items-center gap-6"
        style={{ animationDelay: "0.3s" }}
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Projetos
        </h2>
        {/* flex + justify-center: card sobrando (impar) fica centralizado */}
        <div className="flex w-full flex-wrap justify-center gap-4">
          {projetos.map((projeto) => (
            <Tilt
              key={projeto.slug}
              className="w-full sm:w-[calc(50%-0.5rem)]"
            >
              <ProjetoCard projeto={projeto} />
            </Tilt>
          ))}
        </div>
      </section>

      {/* CONTATO */}
      <section
        className="animate-fade-up flex flex-col items-center gap-4 pb-20"
        style={{ animationDelay: "0.4s" }}
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Contato
        </h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          <a
            href="https://github.com/spady-droid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href="mailto:educoelho2002@outlook.com"
            className="text-foreground transition-colors hover:text-accent"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/eduardo-coelho-desenvolvedor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </main>
  );
}
