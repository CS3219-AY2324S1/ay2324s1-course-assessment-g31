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
      return await this.delete(`matchingRequest/${id}`);
    } catch (error) {
      return null;
    }
  }

  public async createMatchingRequest(data: MatchingRequestCreateDTO) {
    try {
      return await this.post<MatchingRequest,MatchingRequestCreateDTO>("matchingRequest", data);
    } catch (error) {
      return null;
    }
  }

  public async getMatchingRequests() {
    try {
      return await this.get<MatchingRequest[]>("matchingRequest");
    } catch (error) {
      return null;
    }
  }

  public async getMatchings() {
    try {
      return await this.get<Matching[]>("matching");
    } catch (error) {
      return null;
    }
  }
}

export default MatchingController;
