import GenericController from "../generic.controller";

interface ICreateMatchingRequest {
  userId: string;
  difficulty: string;
  questionId?: string;
}

interface ICancelMatchingRequest {
  userId: string;
}

class MatchingController extends GenericController {
  constructor() {
    super("http://localhost:5002", "api");
  }

  public async cancelMatchingRequest(data: ICancelMatchingRequest) {
    console.log("cancelMatchingRequest");
  }

  public async createMatchingRequest(data: ICreateMatchingRequest) {
    try {
      return await this.post("matchingRequest", data);
    } catch (error) {
      console.error(error);
    }
  }

  public async successfulMatching() {
    console.log("successfulMatching");
  }

  public async unsuccessfulMatching() {
    console.log("unsuccessfulMatching");
  }
}

export default MatchingController;
