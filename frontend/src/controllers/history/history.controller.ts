import { History } from "../../interfaces/historyService/history/object";
import GenericController, { ControllerResponse } from "../generic.controller";

const devServerUri = "http://localhost:5007";
const prodServerUri = "placeholder IDK what it is";

class HistoryController extends GenericController {
  constructor() {
    super(
      window.location.hostname !== "localhost" ? prodServerUri : devServerUri,
      "api",
    );
  }

  public async getUserHistory(
    userId: string,
  ): Promise<ControllerResponse<History[]>> {
    const res = await this.get<ControllerResponse<History[]>>(
      `history?user1Id=${userId}`,
    );
    if (res.data.success && res.data.data) {
      const result: ControllerResponse<History[]> = {
        success: true,
        errors: [],
        data: res.data.data,
      };
      return result;
    }
    const result: ControllerResponse<History[]> = {
      success: false,
      errors: res.data.errors,
    };
    return result;
  }

  public async getUserQuestionHistory(
    userId: string,
    questionId: number,
  ): Promise<ControllerResponse<History[]>> {
    const res = await this.get<ControllerResponse<History[]>>(
      `history?user1Id=${userId}&questionId=${questionId}`,
    );
    if (res.data.success && res.data.data) {
      const result: ControllerResponse<History[]> = {
        success: true,
        errors: [],
        data: res.data.data,
      };
      return result;
    }
    const result: ControllerResponse<History[]> = {
      success: false,
      errors: res.data.errors,
    };
    return result;
  }

  public async getHistory(id: string): Promise<ControllerResponse<History>> {
    const res = await this.get<ControllerResponse<History>>(`history/${id}`);
    if (res.data.success && res.data.data) {
      const result: ControllerResponse<History> = {
        success: true,
        errors: [],
        data: res.data.data,
      };
      return result;
    }
    const result: ControllerResponse<History> = {
      success: false,
      errors: res.data.errors,
    };
    return result;
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
