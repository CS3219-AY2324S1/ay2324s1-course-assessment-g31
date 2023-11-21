export type History = {
  id: string;
  questionId: number;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  code: string;
  language: string;
};

export type QuestionHistories = {
  histories: History[];
};
