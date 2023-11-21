export type Matching = {
  id: number;
  user1Id: string;
  user2Id: string;
  requestId: number;
  difficulty: string;
  questionIdRequested: number | null;
  dateTimeMatched: Date;
};
