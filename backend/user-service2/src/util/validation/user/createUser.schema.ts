const createUserSchema = {
  id: {
    exists: {
      errorMessage: "User id is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "User Id should be string" },
  },
  username: {
    exists: {
      errorMessage: "Username is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "User Id should be string" },
  },
};

export default createUserSchema;
