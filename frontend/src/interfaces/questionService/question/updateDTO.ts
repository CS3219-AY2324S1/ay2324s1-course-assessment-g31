export type QuestionUpdateDTO = {
  title: string;
  content: string;
  difficulty: string;
  examples: string[];
  constraints: string[];
  popularity: number;
};
