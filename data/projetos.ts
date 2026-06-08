// Tipo que descreve um projeto.
export interface Projeto {
  slug: string; // identificador unico p/ URL
  titulo: string;
  resumo: string; // 1-2 frases
  tecnologias: string[]; // lista de techs
  destaque: boolean; // aparece em destaque?
  ano: number;
  imagem?: string; // caminho de uma imagem em /public (opcional)
  links: {
    demo?: string;
    repo?: string;
  };
}

// Projetos reais do Eduardo.
export const projetos: Projeto[] = [
  {
    slug: "contest",
    titulo: "CONTEST — Gestão de Multas",
    resumo:
      "Sistema desktop completo para escritórios de trânsito: importa os PDFs do DETRAN e extrai centenas de multas sozinho, consulta a API do SENATRAN, avisa clientes no WhatsApp e protege dados sensíveis com criptografia. Já em produção.",
    tecnologias: [
      "Python",
      "Django",
      "PySide6",
      "SQL",
      "Criptografia",
      "Integração de APIs",
    ],
    destaque: true,
    ano: 2026,
    imagem: "/projetos/contest-dashboard.png",
    links: {},
  },
  {
    slug: "md-team",
    titulo: "MD Team — App de Treino e Dieta",
    resumo:
      "Aplicativo mobile para uma consultoria esportiva, com treino e dieta do aluno. App em Flutter, back-end em FastAPI, banco no Supabase e notificações push via Firebase.",
    tecnologias: ["Flutter", "Dart", "FastAPI", "Python", "Supabase", "Firebase"],
    destaque: true,
    ano: 2026,
    links: {},
  },
  {
    slug: "meu-portfolio",
    titulo: "Meu Portfólio",
    resumo:
      "Este próprio site, feito em Next.js + TypeScript para reunir meus projetos.",
    tecnologias: ["Next.js", "React", "TypeScript", "Tailwind"],
    destaque: false,
    ano: 2026,
    links: { repo: "https://github.com/spady-droid/Portfolio" },
  },
];
