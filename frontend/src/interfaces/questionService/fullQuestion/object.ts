import { Question } from "../question/object";
import { QuestionInitialCode } from "../questionInitialCode/object";
import { QuestionRunnerCode } from "../questionRunnerCode/object";
import { QuestionTestCase } from "../questionTestCase/object";

export type FullQuestion = Question & {
  initialCodes: QuestionInitialCode[];
} & {
  runnerCodes: QuestionRunnerCode[];
} & {
  testCases: QuestionTestCase[];
};

export type OptionalFullQuestion = Partial<FullQuestion>;
