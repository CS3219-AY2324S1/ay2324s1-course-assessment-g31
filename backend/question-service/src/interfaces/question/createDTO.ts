export type QuestionCreateDTO = {
  title: string;
  description: string;
  difficulty: string;
  examples: string[];
  constraints: string[];
  authorId: string;
};
