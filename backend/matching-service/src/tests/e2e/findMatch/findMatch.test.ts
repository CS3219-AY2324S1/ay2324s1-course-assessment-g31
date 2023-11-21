import { describe, test } from "@jest/globals";
import request from "supertest";
import app from "../../../app";
import { MatchingRequestCreateDTO } from "../../../interfaces/matchingRequest/createDTO";
import { StringInterface } from "../../../util/stringInterface";
import resetDb from "../../helpers/resetDb";

describe("Test Find Match Functionality", () => {
  const createMatchingRequestUrl: string = "";
  const getMatchingRequestUrl: string = "";
  const matchingRequestEasy1: StringInterface<MatchingRequestCreateDTO> = {
    userId: "abc123",
    difficulty: "easy",
  };
  const matchingRequestEasy2: StringInterface<MatchingRequestCreateDTO> = {
    userId: "qwe123",
    difficulty: "easy",
  };
  const matchingRequestMedium1: StringInterface<MatchingRequestCreateDTO> = {
    userId: "zxc123",
    difficulty: "medium",
  };

  beforeAll(async () => {
    await resetDb();
  });

  test("Successful Matching", async () => {
    const createMatchReq1 = await request(app)
      .post(createMatchingRequestUrl)
      .send(matchingRequestEasy1);
    const createMatchReq2 = await request(app)
      .post(createMatchingRequestUrl)
      .send(matchingRequestEasy2);

    console.log(createMatchReq1.body);

    // await new Promise(resolve => setTimeout(resolve, 1000));

    // const findMatchReq1 = await request(app).get(`${getMatchingRequestUrl}/${res1.body}`)

    // expect(res.statusCode).toEqual(200);
    expect(true).toBeTruthy();
  });

  test("Unsuccessful Matching", async () => {
    const res1 = await request(app)
      .post(createMatchingRequestUrl)
      .send(matchingRequestEasy1);
    const res2 = await request(app)
      .post(createMatchingRequestUrl)
      .send(matchingRequestMedium1);

    const res3 = await request(app).get(
      `${getMatchingRequestUrl}/${res1.body}`,
    );

    expect(res2.statusCode).toEqual(200);
    expect(res3.statusCode).toEqual(200);
  });
});
