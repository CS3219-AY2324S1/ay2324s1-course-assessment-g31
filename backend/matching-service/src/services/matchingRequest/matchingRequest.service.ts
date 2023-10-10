import { MatchingRequest, PrismaClient } from "@prisma/client";

import EventProducer from "../../events/producers/main.interface";
import { MatchingRequestCreateDTO } from "../../interfaces/matchingRequest/createDTO";
import { OptionalMatchingRequest } from "../../interfaces/matchingRequest/object";
import { MatchingRequestUpdateDTO } from "../../interfaces/matchingRequest/updateDTO";
import Service from "../service.interface";

class MatchingRequestService
  implements
    Service<
      MatchingRequestCreateDTO,
      MatchingRequestUpdateDTO,
      MatchingRequest
    >
{
  constructor(
    private readonly eventProducer: EventProducer<MatchingRequest>,
    private readonly prismaClient: PrismaClient,
  ) {}

  public async create(
    body: MatchingRequestCreateDTO,
  ): Promise<MatchingRequest> {
    try {
      const matchingRequest = await this.prismaClient.matchingRequest.create({
        data: body,
      });
      if (matchingRequest) {
        this.eventProducer.create(matchingRequest);
      }
      return matchingRequest;
    } catch (error) {
      throw new Error("Failed to create matching request.");
    }
  }

  public async findById(
    id: number | undefined,
  ): Promise<MatchingRequest | null> {
    if (!id) throw new Error("No id provided");

    try {
      const matchingRequest =
        await this.prismaClient.matchingRequest.findUnique({
          where: {
            id,
          },
        });
      return matchingRequest;
    } catch (e: any) {
      throw new Error("Failed to find matching request.");
    }
  }

  public async findOne(
    body: OptionalMatchingRequest,
  ): Promise<MatchingRequest | null> {
    try {
      const matchingRequest = this.prismaClient.matchingRequest.findFirst({
        where: body,
      });
      return await matchingRequest;
    } catch (error) {
      throw new Error("Failed to find matching request.");
    }
  }

  public async findAll(): Promise<MatchingRequest[]> {
    return this.prismaClient.matchingRequest.findMany();
  }

  public async update(
    id: number | undefined,
    body: MatchingRequestUpdateDTO,
  ): Promise<MatchingRequest> {
    if (!id) throw new Error("No id provided");

    try {
      return await this.prismaClient.matchingRequest.update({
        where: {
          id,
        },
        data: body,
      });
    } catch (error) {
      throw new Error("Failed to update matching request.");
    }
  }

  public async delete(id: number | undefined): Promise<MatchingRequest> {
    if (!id) throw new Error("No id provided");

    try {
      return await this.prismaClient.matchingRequest.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete matching request.");
    }
  }
}

export default MatchingRequestService;
