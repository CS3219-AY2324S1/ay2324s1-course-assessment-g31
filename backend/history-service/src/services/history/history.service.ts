import { PrismaClient } from "@prisma/client";
import { HistoryCreateDTO } from "../../interfaces/history/createDTO";
import { History } from "../../interfaces/history/object";
import { HistoryUpdateDTO } from "../../interfaces/history/updateDTO";
import Service from "../service.interface";
import assert from "assert";

class HistoryService
  implements Service<HistoryCreateDTO, HistoryUpdateDTO, History>
{
  constructor(private readonly prismaClient: PrismaClient) {}

  public async create(body: HistoryCreateDTO): Promise<History> {
    try {
      const history = await this.prismaClient.history.create({
        data: {
          ...body,
        },
      });
      return history;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create history.");
    }
  }

  public async findById(id: string): Promise<History | null> {
    assert(id, "id should be defined in the history service find by id method");
    try {
      const history = await this.prismaClient.history.findUnique({
        where: {
          id,
        },
      });
      return history;
    } catch (error) {
      throw new Error("Failed to find history.");
    }
  }

  public async findOne(body: Partial<History>): Promise<History | null> {
    try {
      const history = await this.prismaClient.history.findFirst({
        where: body,
      });
      return history;
    } catch (error) {
      throw new Error("Failed to find history.");
    }
  }

  public async findAll(query: Partial<History>): Promise<History[]> {
    try {
      const histories = await this.prismaClient.history.findMany({
        where: {
          AND: [
            query.questionId ? { questionId: query.questionId } : {},
            query.user1Id ? { user1Id: query.user1Id } : {},
            query.user2Id ? { user2Id: query.user2Id } : {},
            query.language ? { language: query.language } : {},
            query.code ? { code: query.code } : {},
          ],
        },
      });
      return histories;
    } catch (error) {
      throw new Error("Failed to find histories.");
    }
  }

  public async update(
    id: string,
    body: Partial<HistoryUpdateDTO>
  ): Promise<History> {
    assert(id, "id should be defined in the history service update method");

    try {
      const updatedHistory = await this.prismaClient.history.update({
        where: {
          id,
        },
        data: body,
      });

      return updatedHistory;
    } catch (error) {
      throw new Error("Failed to update history.");
    }
  }

  public async delete(id: string): Promise<History> {
    assert(id, "id should be defined in the history service update method");
    try {
      const deletedHistory = this.prismaClient.history.delete({
        where: {
          id,
        },
      });
      return deletedHistory;
    } catch (error) {
      throw new Error("Failed to delete history.");
    }
  }
}

export default HistoryService;
