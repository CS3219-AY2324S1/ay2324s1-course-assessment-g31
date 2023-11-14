import { QuestionCreateDTO } from "../question/createDTO";
import { QuestionCategoryCreateDTOs } from "../questionCategory/createDTO";
import { QuestionInitialCodeCreateDTOs } from "../questionInitialCode/createDTO";
import { QuestionRunnerCodeCreateDTOs } from "../questionRunnerCode/createDTO";
import { QuestionSolutionCreateDTOs } from "../questionSolution/createDTO";
import { QuestionTestCaseCreateDTOs } from "../questionTestCase/createDTO";

export type FullQuestionCreateDTO = QuestionCreateDTO &
  QuestionInitialCodeCreateDTOs &
  QuestionRunnerCodeCreateDTOs &
  QuestionTestCaseCreateDTOs &
  QuestionCategoryCreateDTOs &
  QuestionSolutionCreateDTOs;
