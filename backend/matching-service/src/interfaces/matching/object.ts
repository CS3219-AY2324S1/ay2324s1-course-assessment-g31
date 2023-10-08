import { Partial } from "../../util/partial";

export type Matching = {
  id: number;
  user1Id: string;
  user2Id: string;
  requestId: number;
  dateTimeMatched: Date;
};

export type OptionalMatching = Partial<Matching>;
