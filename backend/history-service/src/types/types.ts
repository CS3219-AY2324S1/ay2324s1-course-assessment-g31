export type SessionDetails = {
  questionId: number;
  user1Id: string;
  user2Id: string;
  code: string;
  language: string;
};

// History table row without auto-generated id
export type HistoryEntry = {
  questionId: number;
  user1Id: string;
  user2Id: string;
  attemptDateTime: Date;
  code: string;
  language: string;
};

export type Attempt = {
  id: string;
  attemptDateTime: Date;
  code: string;
  language: string;
};

export type QuestionAllAttempts = {
  questionId: number;
  attempts: Attempt[];
};
