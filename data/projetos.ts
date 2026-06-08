// Tipo que descreve um projeto (o mesmo da Licao 2).
export interface Projeto {
  slug: string; // identificador unico p/ URL
  titulo: string;
  resumo: string; // 1-2 frases
  tecnologias: string[]; // lista de techs
  destaque: boolean; // aparece em destaque?
  ano: number;
  links: {
    demo?: string;
    repo?: string;
  };
}

// Seus projetos. Edite a vontade.
export const projetos: Projeto[] = [
  {
    slug: "meu-portfolio",
    titulo: "Meu Portfolio",
    resumo:
      "Este proprio site, feito em Next.js + TypeScript para reunir meus trabalhos.",
    tecnologias: ["Next.js", "React", "TypeScript", "Tailwind"],
    destaque: true,
    ano: 2026,
    links: { repo: "https://github.com/spady-droid/Portfolio" },
  },
  // EXEMPLO — troque por um projeto seu de verdade (ex: um script de automacao):
  {
    slug: "projeto-automacao",
    titulo: "Projeto de Automacao (exemplo)",
    resumo:
      "Descreva aqui o que o projeto faz e qual problema ele resolve. Apague este quando tiver os seus.",
    tecnologias: ["Python"],
    destaque: false,
    ano: 2025,
    links: {},
  },
];
