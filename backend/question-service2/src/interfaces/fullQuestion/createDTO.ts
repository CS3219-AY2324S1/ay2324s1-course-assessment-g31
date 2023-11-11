import { QuestionCreateDTO } from "../question/createDTO";
import { QuestionInitialCodeCreateDTO } from "../questionInitialCode/createDTO";
import { QuestionRunnerCodeCreateDTO } from "../questionRunnerCode/createDTO";
import { QuestionTestCaseCreateDTO } from "../questionTestCase/createDTO";

export type FullQuestionCreateDTO = QuestionCreateDTO & {
  initialCodes: QuestionInitialCodeCreateDTO[];
} & {
  runnerCodes: QuestionRunnerCodeCreateDTO[];
} & {
  testCases: QuestionTestCaseCreateDTO[];
};
