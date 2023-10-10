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
    try {
      return await this.delete(`matchingRequest/${data.userId}`, data);
    } catch (error) {
      return null;
    }
  }

  public async createMatchingRequest(data: ICreateMatchingRequest) {
    try {
      return await this.post("matchingRequest", data);
    } catch (error) {
      return null;
    }
  }

  public async getMatchingRequests() {
    try {
      return await this.get("matchingRequest");
    } catch (error) {
      return null;
    }
  }
}

export default MatchingController;
