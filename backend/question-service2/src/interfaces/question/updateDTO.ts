export type QuestionUpdateDTO = {
  title: string;
  description: string;
  difficulty: string;
  examples: string[];
  constraints: string[];
  popularity: number;
};
