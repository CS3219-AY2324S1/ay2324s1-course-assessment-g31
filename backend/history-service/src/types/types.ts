export type SessionDetails = {
  questionId: number;
  user1Id: string;
  user2Id: string;
  attemptCode: string;
  language: string;
};

export type QuestionAttemptEntry = {
  questionId: number;
  user1Id: string;
  user2Id: string;
  attemptDateTime: Date;
  attemptCode: string;
  language: string;
};

export type Attempt = {
  attemptDateTime: Date;
  attemptCode: string;
  language: string;
};

export type QuestionAttemptsAll = {
  questionId: number;
  attempts: Attempt[];
};
