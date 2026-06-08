// Tipo que descreve uma competencia (o mesmo da Licao 1).
// O 'export' deixa este tipo/lista visivel para OUTROS arquivos importarem.
export interface Skill {
  nome: string;
  categoria: string;
  // opcional: pode preencher depois se quiser mostrar nivel
  nivel?: "basico" | "intermediario" | "avancado";
}

// Suas skills. Edite a vontade: adicione, remova, mude categoria.
export const skills: Skill[] = [
  { nome: "Python", categoria: "Linguagem" },
  { nome: "Git", categoria: "Ferramenta" },
  { nome: "Automacao", categoria: "Especialidade" },
  { nome: "Desenvolvimento Fullstack", categoria: "Especialidade" },
  { nome: "Desenvolvimento de apps personalizados", categoria: "Especialidade" },
  { nome: "TypeScript", categoria: "Linguagem" },
];
