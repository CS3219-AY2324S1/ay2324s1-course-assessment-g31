export type QuestionCreateDTO = {
  title: string;
  content: string;
  difficulty: string;
  examples: string[];
  constraints: string[];
  authorId: string;
};
