import { QuestionUpdateDTO } from "../question/updateDTO";
import { QuestionInitialCodeUpdateDTO } from "../questionInitialCode/updateDTO";
import { QuestionRunnerCodeUpdateDTO } from "../questionRunnerCode/updateDTO";

export type FullQuestionUpdateDTO = QuestionUpdateDTO & {
  initialCodes: QuestionInitialCodeUpdateDTO[];
} & {
  runnerCodes: QuestionRunnerCodeUpdateDTO[];
};
