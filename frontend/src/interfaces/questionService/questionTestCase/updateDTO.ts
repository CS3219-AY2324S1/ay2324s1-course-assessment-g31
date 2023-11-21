export type QuestionTestCaseUpdateDTO = {
  testCaseNumber: number;
  input: string;
  expectedOutput: string[];
};

export type QuestionTestCaseUpdateDTOs = {
  testCases: QuestionTestCaseUpdateDTO[];
};
