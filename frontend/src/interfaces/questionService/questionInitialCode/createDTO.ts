export type QuestionInitialCodeCreateDTO = {
  language: string;
  code: string;
};

export type QuestionInitialCodeCreateDTOs = {
  initialCodes: QuestionInitialCodeCreateDTO[];
};
