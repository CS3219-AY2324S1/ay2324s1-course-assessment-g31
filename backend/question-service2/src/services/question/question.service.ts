import { PrismaClient } from "@prisma/client";
import assert from "assert";

import { FullQuestionCreateDTO } from "../../interfaces/fullQuestion/createDTO";
import { FullQuestion } from "../../interfaces/fullQuestion/object";
import { FullQuestionUpdateDTO } from "../../interfaces/fullQuestion/updateDTO";
import Service from "../service.interface";

class QuestionService
  implements
    Service<FullQuestionCreateDTO, FullQuestionUpdateDTO, FullQuestion>
{
  constructor(private readonly prismaClient: PrismaClient) {}

  public async create(body: FullQuestionCreateDTO): Promise<FullQuestion> {
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
      return question;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create question.");
    }
  }

  public async findById(id: number): Promise<FullQuestion | null> {
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
      return question;
    } catch (error) {
      throw new Error("Failed to find question.");
    }
  }

  public async findOne(
    body: Partial<FullQuestion>,
  ): Promise<FullQuestion | null> {
    const {
      examples,
      constraints,
      initialCodes,
      runnerCodes,
      testCases,
      categories,
      solutions,
      ...rest
    } = body;
    try {
      const question = await this.prismaClient.question.findFirst({
        where: rest,
        include: {
          initialCodes: true,
          runnerCodes: true,
          testCases: true,
          categories: true,
          solutions: true,
        },
      });
      return question;
    } catch (error) {
      throw new Error("Failed to find question.");
    }
  }

  public async findAll(): Promise<FullQuestion[]> {
    try {
      const questions = await this.prismaClient.question.findMany({
        include: {
          runnerCodes: true,
          initialCodes: true,
          testCases: true,
          categories: true,
          solutions: true,
        },
      });
      return questions;
    } catch (error) {
      throw new Error("Failed to find questions.");
    }
  }

  public async update(
    id: number,
    body: Partial<FullQuestionUpdateDTO>,
  ): Promise<FullQuestion> {
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
          await this.prismaClient.questionSolution.update({
            where: {
              id: element.id,
            },
            data: {
              ...element,
            },
          });
        }
      }
    } catch (error: any) {
      console.log(error);
    }

    return await this.prismaClient.question.update({
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
  }

  public async delete(id: number): Promise<FullQuestion> {
    assert(id, "id should be defined in the question service delete method");
    try {
      return await this.prismaClient.question.delete({
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
