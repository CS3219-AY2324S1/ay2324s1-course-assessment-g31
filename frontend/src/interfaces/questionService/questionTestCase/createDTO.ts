export type QuestionTestCaseCreateDTO = {
  testCaseNumber: number;
  input: string;
  expectedOutput: string[];
};

export type QuestionTestCaseCreateDTOs = {
  testCases: QuestionTestCaseCreateDTO[];
};
