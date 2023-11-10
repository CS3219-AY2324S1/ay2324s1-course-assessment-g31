const createUserSchema = {
  user1Id: {
    exists: {
      errorMessage: "User id is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "User Id should be string" },
  },
  user2Id: {
    exists: {
      errorMessage: "User id is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "User Id should be string" },
  },
  dateTimeMatched: {
    optional: true,
    isDate: { errorMessage: "Date matched should be string" },
  },
};

export default createUserSchema;
