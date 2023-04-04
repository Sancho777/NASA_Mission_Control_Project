const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect(200)
      .expect("Content-Type", /json/);
    // expect(response.statusCode).toBe(200);
  });
});
describe("Test POST /launch", () => {
  const completeLaunchData = {
    mission: "ZTM 155",
    rocket: "Interestealer",
    destination: "Kepler-186 f",
    launchDate: "January 17, 2030",
  };

  const launchDataWithoutTheDate = {
    mission: "ZTM 155",
    rocket: "Interestealer",
    destination: "Kepler-186 f",
  };

  const launchDataWithInvalidDate = {
    mission: "ZTM 155",
    rocket: "Interestealer",
    destination: "Kepler-186 f",
    launchDate: "never",
  };

  test("It should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect(201)
      .expect("Content-Type", /json/);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(requestDate).toBe(responseDate);
    expect(response.body).toMatchObject(launchDataWithoutTheDate);
    // expect(response.statusCode).toBe(200);
  });
  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutTheDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property.",
    });
  });
  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid launch Date.",
    });
  });
});
