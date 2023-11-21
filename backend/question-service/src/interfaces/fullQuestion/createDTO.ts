import { QuestionCreateDTO } from "../question/createDTO";
import { QuestionCategoryCreateDTO } from "../questionCategory/createDTO";
import { QuestionInitialCodeCreateDTO } from "../questionInitialCode/createDTO";
import { QuestionRunnerCodeCreateDTO } from "../questionRunnerCode/createDTO";
import { QuestionSolutionCreateDTO } from "../questionSolution/createDTO";
import { QuestionTestCaseCreateDTO } from "../questionTestCase/createDTO";

export type FullQuestionCreateDTO = QuestionCreateDTO & {
  initialCodes: QuestionInitialCodeCreateDTO[];
} & {
  runnerCodes: QuestionRunnerCodeCreateDTO[];
} & {
  testCases: QuestionTestCaseCreateDTO[];
} & {
  categories: QuestionCategoryCreateDTO[];
} & {
  solutions: QuestionSolutionCreateDTO[];
};
