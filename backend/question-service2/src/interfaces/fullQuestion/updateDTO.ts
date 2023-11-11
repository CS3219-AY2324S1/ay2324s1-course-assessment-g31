import { QuestionUpdateDTO } from "../question/updateDTO";
import { QuestionInitialCodeUpdateDTO } from "../questionInitialCode/updateDTO";
import { QuestionRunnerCodeUpdateDTO } from "../questionRunnerCode/updateDTO";
import { QuestionTestCaseUpdateDTO } from "../questionTestCase/updateDTO";

export type FullQuestionUpdateDTO = QuestionUpdateDTO & {
  initialCodes: QuestionInitialCodeUpdateDTO[];
} & {
  runnerCodes: QuestionRunnerCodeUpdateDTO[];
} & {
  testCases: QuestionTestCaseUpdateDTO[];
};
