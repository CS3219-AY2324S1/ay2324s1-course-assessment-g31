const createQuestionSchema = {
  title: {
    exists: {
      errorMessage: "Title is required.",
    },
    isString: {
      errorMessage: "Title should be a string.",
    },
  },
  description: {
    exists: {
      errorMessage: "description is required.",
    },
    isString: {
      errorMessage: "description should be a string.",
    },
  },
  authorId: {
    exists: {
      errorMessage: "Author Id is required.",
    },
    isString: {
      errorMessage: "Author Id should be a string.",
    },
  },
};

export default createQuestionSchema;
