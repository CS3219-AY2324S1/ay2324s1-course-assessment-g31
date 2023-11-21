import { PrismaClient } from "@prisma/client";
import assert from "assert";

import { FullQuestionCreateDTO } from "../../interfaces/fullQuestion/createDTO";
import { FullQuestion } from "../../interfaces/fullQuestion/object";
import { FullQuestionUpdateDTO } from "../../interfaces/fullQuestion/updateDTO";
import { Query } from "../../interfaces/query";
import Service from "../service.interface";
import { DataRecord } from "../../interfaces/dataRecord";
import logger from "../../util/logger";

class QuestionService
  implements
    Service<FullQuestionCreateDTO, FullQuestionUpdateDTO, FullQuestion>
{
  constructor(private readonly prismaClient: PrismaClient) {}

  public async create(
    body: FullQuestionCreateDTO,
  ): Promise<DataRecord<FullQuestion>> {
    const {
      initialCodes,
      runnerCodes,
      testCases,
      categories,
      solutions,
      ...rest
    } = body;
    try {
      const question = await this.prismaClient.question.create({
        data: {
          ...rest,
          initialCodes: {
            create: initialCodes,
          },
          runnerCodes: {
            create: runnerCodes,
          },
          testCases: {
            create: testCases,
          },
          categories: {
            create: categories,
          },
          solutions: {
            create: solutions,
          },
        },
        include: {
          initialCodes: true,
          runnerCodes: true,
          testCases: true,
          categories: true,
          solutions: true,
        },
      });
      const result: DataRecord<FullQuestion> = {
        data: question,
        count: 1,
      };
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create question.");
    }
  }

  public async findById(id: number): Promise<DataRecord<FullQuestion | null>> {
    assert(
      id,
      "id should be defined in the question service find by id method",
    );
    try {
      const question = await this.prismaClient.question.findUnique({
        where: {
          id,
        },
        include: {
          initialCodes: true,
          runnerCodes: true,
          testCases: true,
          categories: true,
          solutions: true,
        },
      });
      const result: DataRecord<FullQuestion | null> = {
        data: question,
        count: Number(question === null),
      };
      return result;
    } catch (error) {
      throw new Error("Failed to find question.");
    }
  }

  public async findOne(
    body: Partial<FullQuestion>,
  ): Promise<DataRecord<FullQuestion | null>> {
    const {
      examples,
      constraints,
      initialCodes,
      runnerCodes,
      testCases,
      categories,
      solutions,
      difficulty,
      ...rest
    } = body;
    try {
      const question = await this.prismaClient.question.findFirst({
        where: {
          ...rest,
          difficulty: {
            equals: difficulty,
            mode: "insensitive",
          },
        },
        include: {
          initialCodes: true,
          runnerCodes: true,
          testCases: true,
          categories: true,
          solutions: true,
        },
      });
      const result: DataRecord<FullQuestion | null> = {
        data: question,
        count: Number(question === null),
      };
      return result;
    } catch (error) {
      throw new Error("Failed to find question.");
    }
  }

  public async findAll(
    query: Partial<Query<FullQuestion>>,
  ): Promise<DataRecord<FullQuestion[]>> {
    try {
      const questions = await this.prismaClient.question.findMany({
        where: {
          AND: [
            query.difficulty ? { difficulty: query.difficulty.value } : {},
            query.title
              ? { title: { contains: query.title.value, mode: "insensitive" } }
              : {},
            query.categories
              ? {
                  categories: {
                    every: {
                      name: {
                        in: query.categories
                          .filter((x) => x.value !== undefined)
                          .map((y) => y.value!.name),
                      },
                    },
                    some: {
                      name: {
                        in: query.categories
                          .filter((x) => x.value !== undefined)
                          .map((y) => y.value!.name),
                      },
                    },
                  },
                }
              : {},
          ],
        },
        orderBy: [
          query.title
            ? {
                title: query.title.order,
              }
            : {},
          query.difficulty
            ? {
                difficulty: query.difficulty.order,
              }
            : {},
          query.popularity
            ? {
                popularity: query.popularity.order,
              }
            : {},
        ],
        skip: query.offset ? parseInt(query.offset, 10) : 0,
        take: query.limit ? parseInt(query.limit, 10) : 50,

        include: {
          runnerCodes: true,
          initialCodes: true,
          testCases: true,
          categories: true,
          solutions: true,
        },
      });
      const questionCount = await this.prismaClient.question.count();
      const result: DataRecord<FullQuestion[]> = {
        data: questions,
        count: questionCount,
      };
      return result;
    } catch (error) {
      throw new Error("Failed to find questions.");
    }
  }

  public async update(
    id: number,
    body: Partial<FullQuestionUpdateDTO>,
  ): Promise<DataRecord<FullQuestion>> {
    assert(id, "id should be defined in the question service update method");
    const {
      initialCodes,
      runnerCodes,
      testCases,
      categories,
      solutions,
      ...rest
    } = body;

    try {
      if (initialCodes) {
        await this.prismaClient.questionInitialCode.deleteMany({
          where: {
            questionId: id,
          },
        });
        for (let idx = 0; idx < initialCodes.length; idx++) {
          const element = initialCodes[idx];
          await this.prismaClient.questionInitialCode.upsert({
            where: {
              language_questionId: {
                language: element.language,
                questionId: id,
              },
            },
            update: {
              ...element,
            },
            create: {
              ...element,
              questionId: id,
            },
          });
        }
      }
    } catch (error: any) {
      console.log(error);
    }

    try {
      if (runnerCodes) {
        await this.prismaClient.questionRunnerCode.deleteMany({
          where: {
            questionId: id,
          },
        });
        for (let idx = 0; idx < runnerCodes.length; idx++) {
          const element = runnerCodes[idx];
          await this.prismaClient.questionRunnerCode.upsert({
            where: {
              language_questionId: {
                language: element.language,
                questionId: id,
              },
            },
            update: {
              ...element,
            },
            create: {
              ...element,
              questionId: id,
            },
          });
        }
      }
    } catch (error: any) {
      console.log(error);
    }

    try {
      if (testCases) {
        await this.prismaClient.questionTestCase.deleteMany({
          where: {
            questionId: id,
          },
        });
        for (let idx = 0; idx < testCases.length; idx++) {
          const element = testCases[idx];
          await this.prismaClient.questionTestCase.upsert({
            where: {
              testCaseNumber_questionId: {
                testCaseNumber: element.testCaseNumber,
                questionId: id,
              },
            },
            update: {
              ...element,
            },
            create: {
              ...element,
              questionId: id,
            },
          });
        }
      }
    } catch (error: any) {
      console.log(error);
    }

    try {
      if (categories) {
        await this.prismaClient.questionCategory.deleteMany({
          where: {
            questionId: id,
          },
        });
        for (let idx = 0; idx < categories.length; idx++) {
          const element = categories[idx];
          await this.prismaClient.questionCategory.upsert({
            where: {
              name_questionId: {
                name: element.name,
                questionId: id,
              },
            },
            update: {
              ...element,
            },
            create: {
              ...element,
              questionId: id,
            },
          });
        }
      }
    } catch (error: any) {
      console.log(error);
    }

    try {
      if (solutions) {
        for (let idx = 0; idx < solutions.length; idx++) {
          const element = solutions[idx];
          await this.prismaClient.questionSolution.upsert({
            where: {
              id: element.id,
            },
            update: {
              ...element,
            },
            create: {
              ...element,
              questionId: id,
            },
          });
        }
      }
    } catch (error: any) {
      console.log(error);
    }

    const updatedQuestion = await this.prismaClient.question.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
      include: {
        initialCodes: true,
        runnerCodes: true,
        testCases: true,
        categories: true,
        solutions: true,
      },
    });

    const result: DataRecord<FullQuestion> = {
      data: updatedQuestion,
      count: 1,
    };

    return result;
  }

  public async delete(id: number): Promise<DataRecord<FullQuestion>> {
    assert(id, "id should be defined in the question service delete method");
    try {
      const deletedQuestion = await this.prismaClient.question.delete({
        where: {
          id,
        },
        include: {
          initialCodes: true,
          runnerCodes: true,
          testCases: true,
          categories: true,
          solutions: true,
        },
      });
      const result: DataRecord<FullQuestion> = {
        data: deletedQuestion,
        count: 1,
      };

      return result;
    } catch (error) {
      throw new Error("Failed to delete question.");
    }
  }

  public async incrementPopularity(id: number) {
    return await this.prismaClient.question.update({
      where: {
        id,
      },
      data: {
        popularity: {
          increment: 1,
        },
      },
    });
  }
}

export default QuestionService;
