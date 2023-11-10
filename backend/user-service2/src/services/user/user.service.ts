import { PrismaClient } from "@prisma/client";
import assert from "assert";

import EventProducer from "../../events/producers/main.interface";
import { UserCreateDTO } from "../../interfaces/user/createDTO";
import { OptionalUser, User } from "../../interfaces/user/object";
import { UserUpdateDTO } from "../../interfaces/user/updateDTO";
import Service from "../service.interface";

class UserService implements Service<UserCreateDTO, UserUpdateDTO, User> {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async create(body: UserCreateDTO): Promise<User> {
    try {
      const user = await this.prismaClient.user.create({
        data: body,
      });
      return user;
    } catch (error) {
      throw new Error("Failed to create user.");
    }
  }

  public async findById(id: string): Promise<User | null> {
    assert(id, "id should be defined in the user service find by id method");
    try {
      const user = await this.prismaClient.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      throw new Error("Failed to find user.");
    }
  }

  public async findOne(body: OptionalUser): Promise<User | null> {
    const { roles, ...filter } = body;
    try {
      const user = await this.prismaClient.user.findFirst({
        where: filter,
      });
      return user;
    } catch (error) {
      throw new Error("Failed to find user.");
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      const users = await this.prismaClient.user.findMany();
      return users;
    } catch (error) {
      throw new Error("Failed to find users.");
    }
  }

  public async update(id: string, body: Partial<UserUpdateDTO>): Promise<User> {
    assert(id, "id should be defined in the user service update method");
    try {
      return await this.prismaClient.user.update({
        where: {
          id,
        },
        data: body,
      });
    } catch (error) {
      throw new Error("Failed to update user.");
    }
  }

  public async delete(id: string): Promise<User> {
    assert(id, "id should be defined in the user service delete method");
    try {
      return await this.prismaClient.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete user.");
    }
  }
}

export default UserService;
