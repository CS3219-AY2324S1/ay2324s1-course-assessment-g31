import { DataRecord } from "../../interfaces/questionService/dataRecord";
import { FullQuestionCreateDTO } from "../../interfaces/questionService/fullQuestion/createDTO";
import { FullQuestion } from "../../interfaces/questionService/fullQuestion/object";
import { FullQuestionUpdateDTO } from "../../interfaces/questionService/fullQuestion/updateDTO";
import { Query } from "../../interfaces/questionService/query";
import GenericController, {
  ControllerParamsHeaders,
} from "../generic.controller";

const devServerUri = "http://localhost:5003";
const prodServerUri = "https://question-service-qzxsy455sq-as.a.run.app";

type ControllerResponse<Obj> = {
  success: boolean;
  errors: string[];
  data?: Obj;
};

class QuestionController extends GenericController {
  constructor() {
    super(
      window.location.hostname !== "localhost" ? prodServerUri : devServerUri,
      "api",
    );
  }

  public async createQuestion(
    data: FullQuestionCreateDTO,
  ): Promise<ControllerResponse<DataRecord<FullQuestion>>> {
    const res = await this.post<
      ControllerResponse<DataRecord<FullQuestion>>,
      FullQuestionCreateDTO
    >("questions", data);
    if (res.data.success && res.data.data) {
      const result: ControllerResponse<DataRecord<FullQuestion>> = {
        success: true,
        errors: [],
        data: res.data.data,
      };
      return result;
    }
    const result: ControllerResponse<DataRecord<FullQuestion>> = {
      success: false,
      errors: res.data.errors,
    };
    return result;
  }

  public async getQuestions(
    query: Partial<Query<FullQuestion>>,
  ): Promise<ControllerResponse<DataRecord<FullQuestion[]>>> {
    const paramsHeader: ControllerParamsHeaders = {
      params: {
        query,
      },
    };
    const res = await this.get<ControllerResponse<DataRecord<FullQuestion[]>>>(
      "questions",
      paramsHeader,
    );
    if (res.data.success && res.data.data) {
      const result: ControllerResponse<DataRecord<FullQuestion[]>> = {
        success: true,
        errors: [],
        data: res.data.data,
      };
      return result;
    }
    const result: ControllerResponse<DataRecord<FullQuestion[]>> = {
      success: false,
      errors: res.data.errors,
    };
    return result;
  }

  public async getQuestionById(
    id: number,
  ): Promise<ControllerResponse<DataRecord<FullQuestion>>> {
    const res = await this.get<ControllerResponse<DataRecord<FullQuestion>>>(
      `questions/${id}`,
    );
    if (res.data.success && res.data.data) {
      const result: ControllerResponse<DataRecord<FullQuestion>> = {
        success: true,
        errors: [],
        data: res.data.data,
      };
      return result;
    }
    const result: ControllerResponse<DataRecord<FullQuestion>> = {
      success: false,
      errors: res.data.errors,
    };
    return result;
  }

  public async updateQuestion(
    id: number,
    data: Partial<FullQuestionUpdateDTO>,
  ): Promise<ControllerResponse<DataRecord<FullQuestion>>> {
    const res = await this.put<
      ControllerResponse<DataRecord<FullQuestion>>,
      Partial<FullQuestionUpdateDTO>
    >(`questions/${id}`, data);
    if (res.data.success && res.data.data) {
      const result: ControllerResponse<DataRecord<FullQuestion>> = {
        success: true,
        errors: [],
        data: res.data.data,
      };
      return result;
    }
    const result: ControllerResponse<DataRecord<FullQuestion>> = {
      success: false,
      errors: res.data.errors,
    };
    return result;
  }

  public async deleteQuestion(id: number) {
    const res = await this.delete<ControllerResponse<DataRecord<FullQuestion>>>(
      `questions/${id}`,
    );
    if (res.data.success && res.data.data) {
      const result: ControllerResponse<DataRecord<FullQuestion>> = {
        success: true,
        errors: [],
        data: res.data.data,
      };
      return result;
    }
    const result: ControllerResponse<DataRecord<FullQuestion>> = {
      success: false,
      errors: res.data.errors,
    };
    return result;
  }
}

export default QuestionController;
