export type QuestionTestCase = {
  testCaseNumber: number;
  input: string;
  expectedOutput: string[];
  questionId: number;
};

export type QuestionTestCases = {
  testCases: QuestionTestCase[];
};
