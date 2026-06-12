// Uma imagem do estudo de caso, com legenda.
export interface CasoImagem {
  src: string; // caminho em /public
  legenda: string;
}

// Estudo de caso de um projeto (opcional).
export interface Caso {
  formato: "mobile" | "desktop"; // tipo de moldura na galeria
  problema?: string;
  solucao?: string;
  galeria: CasoImagem[];
}

// Tipo que descreve um projeto.
export interface Projeto {
  slug: string; // identificador unico p/ URL
  titulo: string;
  resumo: string; // 1-2 frases
  tecnologias: string[]; // lista de techs
  destaque: boolean; // aparece em destaque?
  ano: number;
  imagem?: string; // imagem do card em /public (opcional)
  links: {
    demo?: string;
    repo?: string;
  };
  caso?: Caso; // conteudo da pagina /projetos/[slug]
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
    caso: {
      formato: "desktop",
      problema:
        "Escritórios de trânsito afogados em processo manual: centenas de multas do DETRAN conferidas uma a uma, prazos de recurso controlados em planilha (fáceis de perder) e cada cliente avisado individualmente. Um prazo perdido vira dinheiro perdido.",
      solucao:
        "O CONTEST centraliza multas, clientes, prazos e comunicação num só sistema, com visão geral em tempo real — e automatiza o trabalho pesado: importa o PDF do DETRAN, consulta o SENATRAN e gera as mensagens de WhatsApp prontas.",
      galeria: [
        {
          src: "/projetos/contest-dashboard.png",
          legenda: "Painel principal com visão geral em tempo real",
        },
        {
          src: "/projetos/contest-login.png",
          legenda: "Acesso seguro ao sistema",
        },
        {
          src: "/projetos/contest-novo-cliente.png",
          legenda: "Cadastro de cliente (pessoa física e jurídica)",
        },
        {
          src: "/projetos/contest-infosimples.png",
          legenda: "Integração com o portal gov.br via Infosimples",
        },
      ],
    },
  },
  {
    slug: "md-team",
    titulo: "MD Team — App de Treino e Dieta",
    resumo:
      "Aplicativo mobile para uma consultoria esportiva, com treino e dieta do aluno. App em Flutter, back-end em FastAPI hospedado na Railway, banco Postgres no Neon e vídeos dos exercícios no Cloudflare.",
    tecnologias: ["Flutter", "Dart", "FastAPI", "Python", "Cloudflare", "Railway", "Neon"],
    destaque: true,
    ano: 2026,
    links: {},
    caso: {
      formato: "mobile",
      problema:
        "Uma consultoria esportiva precisava entregar treino e dieta aos alunos de forma organizada, com acompanhamento e lembretes — sem depender de PDFs soltos e mensagens manuais.",
      solucao:
        "Um app onde o aluno vê o treino do dia com vídeo de cada exercício, registra a carga, acompanha a dieta e recebe lembretes; e um painel para o treinador gerenciar alunos, enviar treinos e acompanhar a aderência.",
      galeria: [
        {
          src: "/projetos/mdteam/mdteam-login.jpg",
          legenda: "Login com a identidade visual da consultoria",
        },
        {
          src: "/projetos/mdteam/mdteam-onboarding-treino.jpg",
          legenda: "Onboarding: treino do dia",
        },
        {
          src: "/projetos/mdteam/mdteam-onboarding-lembretes.jpg",
          legenda: "Onboarding: lembretes inteligentes",
        },
        {
          src: "/projetos/mdteam/mdteam-home.jpg",
          legenda: "Home do aluno: treino, dieta e evolução",
        },
        {
          src: "/projetos/mdteam/mdteam-treino-lista.jpg",
          legenda: "Lista de exercícios do treino",
        },
        {
          src: "/projetos/mdteam/mdteam-treino-execucao.jpg",
          legenda: "Modo execução: cronômetro e registro de carga",
        },
        {
          src: "/projetos/mdteam/mdteam-admin-dashboard.jpg",
          legenda: "Painel do treinador: alunos e aderência",
        },
      ],
    },
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
