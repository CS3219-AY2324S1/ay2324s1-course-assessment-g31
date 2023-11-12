import { Question } from "../question/object";
import { QuestionCategories } from "../questionCategory/object";
import { QuestionInitialCodes } from "../questionInitialCode/object";
import { QuestionRunnerCodes } from "../questionRunnerCode/object";
import { QuestionSolutions } from "../questionSolution/object";
import { QuestionTestCases } from "../questionTestCase/object";

export type FullQuestion = Question &
  QuestionInitialCodes &
  QuestionRunnerCodes &
  QuestionTestCases &
  QuestionCategories &
  QuestionSolutions;
