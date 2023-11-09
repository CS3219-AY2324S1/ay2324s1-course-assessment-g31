import { QuestionCreateDTO } from "../question/createDTO";
import { QuestionInitialCodeCreateDTO } from "../questionInitialCode/createDTO";
import { QuestionRunnerCodeCreateDTO } from "../questionRunnerCode/createDTO";

export type FullQuestionCreateDTO = QuestionCreateDTO & {
  initialCodes: QuestionInitialCodeCreateDTO[];
} & {
  runnerCodes: QuestionRunnerCodeCreateDTO[];
};
