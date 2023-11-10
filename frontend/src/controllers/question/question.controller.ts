import { FullQuestionCreateDTO } from "../../interfaces/questionService/fullQuestion/createDTO";
import { FullQuestion } from "../../interfaces/questionService/fullQuestion/object";
import { FullQuestionUpdateDTO } from "../../interfaces/questionService/fullQuestion/updateDTO";
import GenericController from "../generic.controller";

const devServerUri = "http://localhost:5003";
const prodServerUri = "https://question-service-qzxsy455sq-as.a.run.app";

class QuestionController extends GenericController {
  constructor() {
    super(
      window.location.hostname !== "localhost" ? prodServerUri : devServerUri,
      "api",
    );
  }

  public async createQuestion(data: FullQuestionCreateDTO) {
    try {
      return await this.post<FullQuestion, FullQuestionCreateDTO>(
        "question",
        data,
      );
    } catch (error) {
      return null;
    }
  }

  public async readQuestions() {
    try {
      return await this.get<FullQuestion[]>("question");
    } catch (error) {
      return null;
    }
  }

  public async getQuestion(id: number) {
    try {
      return await this.get<FullQuestion>(`question/${id}`);
    } catch (error) {
      return null;
    }
  }

  public async updateQuestion(
    id: number,
    data: Partial<FullQuestionUpdateDTO>,
  ) {
    console.log(data);
    try {
      return await this.put<FullQuestion, Partial<FullQuestionUpdateDTO>>(
        `question/${id}`,
        data,
      );
    } catch (error) {
      console.log("Client Question Controller Error", error);
      return null;
    }
  }

  public async deleteQuestion(id: number) {
    try {
      return await this.delete(`question/${id}`);
    } catch (error) {
      return null;
    }
  }
}

export default QuestionController;
