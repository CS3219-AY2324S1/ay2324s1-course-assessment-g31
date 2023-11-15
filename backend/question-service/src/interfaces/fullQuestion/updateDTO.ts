import { QuestionUpdateDTO } from "../question/updateDTO";
import { QuestionCategoryUpdateDTO } from "../questionCategory/updateDTO";
import { QuestionInitialCodeUpdateDTO } from "../questionInitialCode/updateDTO";
import { QuestionRunnerCodeUpdateDTO } from "../questionRunnerCode/updateDTO";
import { QuestionSolutionUpdateDTO } from "../questionSolution/updateDTO";
import { QuestionTestCaseUpdateDTO } from "../questionTestCase/updateDTO";

export type FullQuestionUpdateDTO = QuestionUpdateDTO & {
  initialCodes: QuestionInitialCodeUpdateDTO[];
} & {
  runnerCodes: QuestionRunnerCodeUpdateDTO[];
} & {
  testCases: QuestionTestCaseUpdateDTO[];
} & {
  categories: QuestionCategoryUpdateDTO[];
} & {
  solutions: QuestionSolutionUpdateDTO[];
};
