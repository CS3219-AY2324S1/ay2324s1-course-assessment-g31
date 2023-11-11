import { Question } from '../question/object';
import { QuestionCategory } from '../questionCategory/object';
import { QuestionInitialCode } from '../questionInitialCode/object';
import { QuestionRunnerCode } from '../questionRunnerCode/object';
import { QuestionSolution } from '../questionSolution/object';
import { QuestionTestCase } from '../questionTestCase/object';

export type FullQuestion = Question & {
  initialCodes: QuestionInitialCode[];
} & {
  runnerCodes: QuestionRunnerCode[];
} & {
  testCases: QuestionTestCase[];
} & {
  categories: QuestionCategory[];
} & {
  solutions: QuestionSolution[];
};

export type OptionalFullQuestion = Partial<FullQuestion>;
