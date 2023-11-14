import { QuestionUpdateDTO } from "../question/updateDTO";
import { QuestionCategoryUpdateDTOs } from "../questionCategory/updateDTO";
import { QuestionInitialCodeUpdateDTOs } from "../questionInitialCode/updateDTO";
import { QuestionRunnerCodeUpdateDTOs } from "../questionRunnerCode/updateDTO";
import { QuestionSolutionUpdateDTOs } from "../questionSolution/updateDTO";
import { QuestionTestCaseUpdateDTOs } from "../questionTestCase/updateDTO";

export type FullQuestionUpdateDTO = QuestionUpdateDTO &
  QuestionInitialCodeUpdateDTOs &
  QuestionRunnerCodeUpdateDTOs &
  QuestionTestCaseUpdateDTOs &
  QuestionCategoryUpdateDTOs &
  QuestionSolutionUpdateDTOs;
