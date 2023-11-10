//

export type QuestionTestCase = {
  testCaseNumber: number;
  input: string;
  expectedOutput: string[];
  questionId: number;
};

export type OptionalQuestionTestCase = Partial<QuestionTestCase>;

export type FullTestCase = QuestionTestCase & {
  resultsAvailable: boolean;
  passed: boolean;
  actualOutput: string;
  executionToken: string;
  running: boolean;
};
