import { MatchingRequestCreateDTO } from "../../interfaces/matchingService/matchingRequest/createDTO";
import GenericController from "../generic.controller";

interface ICancelMatchingRequest {
  userId: string;
}

const devServerUri = "http://localhost:5002";
const prodServerUri = "https://matching-service-qzxsy455sq-as.a.run.app";

class MatchingController extends GenericController {
  constructor() {
    super(
      window.location.hostname !== "localhost" ? prodServerUri : devServerUri,
      "api",
    );
  }

  public async cancelMatchingRequest(data: ICancelMatchingRequest) {
    try {
      return await this.post("matchingRequest/cancel", data);
    } catch (error) {
      return null;
    }
  }

  public async createMatchingRequest(data: MatchingRequestCreateDTO) {
    try {
      return await this.post("matchingRequest", data);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default MatchingController;
