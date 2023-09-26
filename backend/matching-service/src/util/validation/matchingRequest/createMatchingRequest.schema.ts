// Create Matching Request Middleware
const createMatchingRequestSchema = {
  userId: {
    exists: {
      errorMessage: "User id is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "User Id should be string" },
  },
  difficulty: {
    exists: { errorMessage: "Difficulty is required" },
    isString: { errorMessage: "Difficulty should be string" },
  },
  questionId: {
    optional: true,
    isInt: { errorMessage: "User Id should be integer" },
  },
  dateRequested: {
    optional: true,
    isDate: { errorMessage: "Date requested should be string" },
  },
};

export default createMatchingRequestSchema;
