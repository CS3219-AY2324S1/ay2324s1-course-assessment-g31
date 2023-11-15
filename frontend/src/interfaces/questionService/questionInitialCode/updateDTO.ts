export type QuestionInitialCodeUpdateDTO = {
  language: string;
  code: string;
};

export type QuestionInitialCodeUpdateDTOs = {
  initialCodes: QuestionInitialCodeUpdateDTO[];
};
