import GenericController from "../generic.controller";

type SubmissionCreateInput = {
  sourceCode: string;
  stdin: string;
  expectedOutput: string;
  userId: number;
};

class SubmissionController extends GenericController {
  constructor() {
    super(
      window.location.hostname !== "localhost"
        ? "http://submission-service:5007"
        : "http://localhost:5007",
      "api",
    );
  }

  public async createSubmission(data: SubmissionCreateInput) {
    return this.post("submission", data);
  }

  public async getSubmission(id: number | undefined) {
    if (!id) throw new Error("No id provided");
    return this.get(`submission/${id}`);
  }
}

export default SubmissionController;
