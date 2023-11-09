import { Question } from "../question/object";
import { QuestionInitialCode } from "../questionInitialCode/object";
import { QuestionRunnerCode } from "../questionRunnerCode/object";

export type FullQuestion = Question & {
  initialCodes: QuestionInitialCode[];
} & {
  runnerCodes: QuestionRunnerCode[];
};

export type OptionalFullQuestion = Partial<FullQuestion>;
