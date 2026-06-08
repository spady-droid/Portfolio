export default function Home() {
  const nome = "Eduardo Coelho da Silva";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm uppercase tracking-widest text-zinc-500">
        Portfolio
      </p>
      <h1 className="text-4xl font-bold sm:text-6xl">{nome}</h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        Desenvolvedor em formacao — bem-vindo ao meu portfolio.
      </p>
    </main>
  );
}
