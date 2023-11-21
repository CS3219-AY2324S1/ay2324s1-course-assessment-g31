const createHistorySchema = {
  questionId: {
    exists: {
      errorMessage: "questionId is required.",
    },
    isInt: {
      errorMessage: "questionId should be an integer.",
    },
  },
  user1Id: {
    exists: {
      errorMessage: "user1Id is required.",
    },
    isString: {
      errorMessage: "user1Id should be a string.",
    },
  },
  user2Id: {
    exists: {
      errorMessage: "user2Id is required.",
    },
    isString: {
      errorMessage: "user2Id should be a string.",
    },
  },
  language: {
    exists: {
      errorMessage: "language is required.",
    },
    isString: {
      errorMessage: "language should be a string.",
    },
  },
  code: {
    exists: {
      errorMessage: "code is required.",
    },
    isString: {
      errorMessage: "code should be a string.",
    },
  },
};

export default createHistorySchema;
