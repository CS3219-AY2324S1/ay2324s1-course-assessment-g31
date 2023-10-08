import { Partial } from "../../util/partial";

export type MatchingRequest = {
  id: number;
  userId: string;
  questionId: number | null;
  difficulty: string;
  dateRequested: Date;
  success: boolean;
};

export type OptionalMatchingRequest = Partial<MatchingRequest>;
