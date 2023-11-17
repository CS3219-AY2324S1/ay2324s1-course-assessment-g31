import { Matching } from "../../interfaces/matchingService/matching/object";
import { MatchingRequestCreateDTO } from "../../interfaces/matchingService/matchingRequest/createDTO";
import { MatchingRequest } from "../../interfaces/matchingService/matchingRequest/object";
import GenericController from "../generic.controller";

class MatchingController extends GenericController {
  constructor() {
    super("http://localhost:5002", "api");
  }

  public async cancelMatchingRequest(id: string) {
    try {
      const matchingRequest = await this.delete(`matchingRequests/${id}`);
      return matchingRequest;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async createMatchingRequest(data: MatchingRequestCreateDTO) {
    try {
      return await this.post<MatchingRequest, MatchingRequestCreateDTO>(
        "matchingRequests",
        data,
      );
    } catch (error) {
      return null;
    }
  }

  public async getMatchingRequests() {
    try {
      return await this.get<MatchingRequest[]>("matchingRequests");
    } catch (error) {
      return null;
    }
  }

  public async getMatchings() {
    try {
      return await this.get<Matching[]>("matchings");
    } catch (error) {
      return null;
    }
  }
}

export default MatchingController;
