export type MatchingRequest = {
  id: number;
  userId: string;
  questionId: number | null;
  difficulty: string;
  dateRequested: Date;
  success: boolean;
};
