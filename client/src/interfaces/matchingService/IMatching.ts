interface IMatching {
  user1Id: string;
  user2Id: string;
  dateTimeMatched: Date;
}

export interface ICreatedMatching extends IMatching {
  id: number;
}

export interface IMatchingRequestCreateInput {
  userId: string;
  questionId?: number;
  difficulty: string;
  dateRequested?: Date | string;
}

export interface IMatchingCreateInput {
  user1Id: string;
  user2Id: string;
  dateTimeMatched: Date | string;
}
