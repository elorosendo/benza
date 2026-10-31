import type { LineSlug, Product } from "./catalog";

export type Tags = {
  cat?: "prazer" | "cuidado-intimo" | "no-clima";
  body?: string;
  beginner?: boolean;
  quiet?: boolean;
};

export type QuizOption = {
  id: string;
  label: string;
  hint?: string;
  line?: Partial<Record<LineSlug, number>>;
  tags?: Tags;
};

export type QuizQuestion = {
  id: string;
  title: string;
  emphasis: string; // trecho final do título, em itálico
  options: QuizOption[];
};

// Perguntas em rascunho: ajustar o texto com a equipe de conteúdo.
export const questions: QuizQuestion[] = [
  {
    id: "momento",
    title: "Para quem é este",
    emphasis: "momento?",
    options: [
      { id: "so", label: "Só para mim", hint: "Sozinha primeiro, no meu tempo.", line: { mata: 2, rio: 1 } },
      { id: "dois", label: "A dois", hint: "Ou a mais, com calma.", line: { penumbra: 2, brasa: 1 } },
      { id: "nao-sei", label: "Ainda não sei", hint: "Tudo bem. A gente descobre junto.", line: { brasa: 2, rio: 1 } },
    ],
  },
  {
    id: "clima",
    title: "Que clima você",
    emphasis: "quer criar?",
    options: [
      { id: "noite", label: "Luz baixa, a noite inteira", line: { penumbra: 3 } },
      { id: "mata", label: "Folhas, ar livre, o próprio corpo", line: { mata: 3 } },
      { id: "agua", label: "Água, pele, o depois que importa", line: { rio: 3 } },
      { id: "faisca", label: "Uma faísca e a bolsa pronta", line: { brasa: 3 } },
    ],
  },
  {
    id: "experiencia",
    title: "Como é a sua",
    emphasis: "experiência?",
    options: [
      { id: "comeco", label: "Estou começando", tags: { beginner: true }, line: { rio: 1 } },
      { id: "alguma", label: "Já conheço alguma coisa" },
      { id: "muita", label: "Já sei bem o que gosto", line: { brasa: 1 } },
    ],
  },
  {
    id: "procura",
    title: "O que você",
    emphasis: "procura?",
    options: [
      { id: "prazer", label: "Prazer", hint: "Vibradores, vidro, a dois.", tags: { cat: "prazer" } },
      { id: "cuidado", label: "Cuidado íntimo", hint: "Lubrificantes, higiene, pele.", tags: { cat: "cuidado-intimo" }, line: { rio: 1 } },
      { id: "ritual", label: "Ritual e clima", hint: "Velas, óleos, banho.", tags: { cat: "no-clima" }, line: { penumbra: 1 } },
    ],
  },
  {
    id: "discricao",
    title: "O quanto a discrição",
    emphasis: "importa?",
    options: [
      { id: "muito", label: "Muito", hint: "Silencioso e fácil de guardar.", tags: { quiet: true } },
      { id: "pouco", label: "Um pouco" },
      { id: "tanto-faz", label: "Tanto faz" },
    ],
  },
  {
    id: "corpo",
    title: "Por onde você quer",
    emphasis: "começar?",
    options: [
      { id: "clitoris", label: "Clitóris e vulva", tags: { body: "clitoris" } },
      { id: "vagina", label: "Vagina e ponto G", tags: { body: "vagina" } },
      { id: "penis", label: "Pênis e próstata", tags: { body: "penis" } },
      { id: "anus", label: "Ânus e períneo", tags: { body: "anus" } },
      { id: "pele", label: "Pele e cabelo", tags: { body: "pele-cabelo" }, line: { penumbra: 1 } },
    ],
  },
];

export type QuizProduct = Product & { parent: string };

export type QuizResult = {
  line: LineSlug;
  scores: Record<LineSlug, number>;
  products: Product[];
  profile: string[];
};

const LINES: LineSlug[] = ["penumbra", "mata", "rio", "brasa"];

export function computeResult(answers: Record<string, string>, products: QuizProduct[]): QuizResult {
  const scores: Record<LineSlug, number> = { penumbra: 0, mata: 0, rio: 0, brasa: 0 };
  const cat: Record<string, number> = {};
  const bodies: string[] = [];
  let beginner = false;
  let quiet = false;
  const profile: string[] = [];

  for (const q of questions) {
    const o = q.options.find((x) => x.id === answers[q.id]);
    if (!o) continue;
    profile.push(o.label);
    for (const l of LINES) scores[l] += o.line?.[l] ?? 0;
    if (o.tags?.cat) cat[o.tags.cat] = (cat[o.tags.cat] ?? 0) + 1;
    if (o.tags?.body) bodies.push(o.tags.body);
    if (o.tags?.beginner) beginner = true;
    if (o.tags?.quiet) quiet = true;
  }

  // Desempate pela ordem das perguntas: o clima (2ª) pesa mais.
  const climate = questions[1].options.find((x) => x.id === answers.clima)?.line ?? {};
  const line = [...LINES].sort(
    (a, b) => scores[b] - scores[a] || (climate[b] ?? 0) - (climate[a] ?? 0),
  )[0];

  const ranked = products
    .map((p) => {
      let s = 0;
      if (p.line === line) s += 5;
      s += (cat[p.parent] ?? 0) * 3;
      if (bodies.some((b) => p.body.includes(b))) s += 3;
      if (p.approved) s += 1;
      if (beginner && ["para-comecar", "silenciosos", "lubrificantes-liquidos"].includes(p.category)) s += 2;
      if (quiet && p.category === "silenciosos") s += 3;
      return { p, s };
    })
    .sort((a, b) => b.s - a.s || a.p.slug.localeCompare(b.p.slug));

  return { line, scores, products: ranked.slice(0, 3).map((x) => x.p), profile };
}
