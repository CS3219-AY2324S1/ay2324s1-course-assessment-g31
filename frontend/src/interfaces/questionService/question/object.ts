export type Question = {
  id: number;
  title: string;
  content: string;
  difficulty: string;
  examples: string[];
  constraints: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  popularity: number;
};
