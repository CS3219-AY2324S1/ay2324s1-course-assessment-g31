import { History } from "../../interfaces/historyService/history/object";
import GenericController from "../generic.controller";

const devServerUri = "http://localhost:5007";
const prodServerUri = "placeholder IDK what it is";

class HistoryController extends GenericController {
  constructor() {
    super(
      window.location.hostname !== "localhost" ? prodServerUri : devServerUri,
      "api",
    );
  }

  public async getUserHistory(userId: string) {
    try {
      return await this.get<History[]>(`history?user1Id=${userId}`);
    } catch (error) {
      return null;
    }
  }

  public async getUserQuestionHistory(userId: string, questionId: number) {
    try {
      return await this.get<History[]>(
        `history?user1Id=${userId}&questionId=${questionId}`,
      );
    } catch (error) {
      return null;
    }
  }

  public async deleteHistory(id: string) {
    try {
      return await this.delete(`history/${id}`);
    } catch (error) {
      return null;
    }
  }
}

export default HistoryController;
