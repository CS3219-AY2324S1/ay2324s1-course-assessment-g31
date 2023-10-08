import { PrismaClient } from "@prisma/client";

import { MatchingCreateDTO } from "../../interfaces/matching/createDTO";
import { Matching, OptionalMatching } from "../../interfaces/matching/object";
import { MatchingUpdateDTO } from "../../interfaces/matching/updateDTO";
import { MatchingRequest } from "../../interfaces/matchingRequest/object";
import Service from "../service.interface";

class MatchingService
  implements Service<MatchingCreateDTO, MatchingUpdateDTO, Matching>
{
  constructor(private readonly prismaClient: PrismaClient) {}

  public async create(body: MatchingCreateDTO): Promise<Matching> {
    try {
      const matching = await this.prismaClient.matching.create({
        data: body,
      });
      return matching;
    } catch (error) {
      throw new Error("Failed to create matching.");
    }
  }

  public async findById(id: number): Promise<Matching | null> {
    try {
      const matching = await this.prismaClient.matching.findUnique({
        where: {
          id,
        },
      });
      return matching;
    } catch (error) {
      throw new Error("Failed to find matching.");
    }
  }

  public async findOne(body: OptionalMatching): Promise<Matching | null> {
    try {
      const matching = await this.prismaClient.matching.findFirst({
        where: body,
      });
      return matching;
    } catch (error) {
      throw new Error("Failed to find matching.");
    }
  }

  public async findAll(): Promise<Matching[]> {
    try {
      const matchings = await this.prismaClient.matching.findMany();
      return matchings;
    } catch (error) {
      throw new Error("Failed to find matchings.");
    }
  }

  public async update(id: number, body: MatchingUpdateDTO): Promise<Matching> {
    try {
      return await this.prismaClient.matching.update({
        where: {
          id,
        },
        data: body,
      });
    } catch (error) {
      throw new Error("Failed to update matching.");
    }
  }

  public async delete(id: number): Promise<Matching> {
    try {
      return await this.prismaClient.matching.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete matching.");
    }
  }

  public async findMatch(
    body: MatchingRequest,
  ): Promise<MatchingRequest | null> {
    try {
      let foundMatchRequest;
      if (body.questionId) {
        foundMatchRequest = await this.prismaClient.matchingRequest.findFirst({
          where: {
            questionId: body.questionId,
            userId: {
              not: body.userId,
            },
            success: false,
          },
        });
      }
      foundMatchRequest = await this.prismaClient.matchingRequest.findFirst({
        where: {
          difficulty: body.difficulty,
          userId: {
            not: body.userId,
          },
          success: false,
        },
      });
      return foundMatchRequest;
    } catch (error) {
      throw new Error("Failed to find matching request.");
    }
  }
}

export default MatchingService;
