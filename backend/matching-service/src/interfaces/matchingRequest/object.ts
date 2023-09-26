import { OptionalInterface } from '../../util/optionalInterface';

export type MatchingRequest = {
  id: number;
  userId: string;
  questionId: number | null;
  difficulty: string;
  dateRequested: Date;
  success: boolean;
}

export type OptionalMatchingRequest = OptionalInterface<MatchingRequest>;
