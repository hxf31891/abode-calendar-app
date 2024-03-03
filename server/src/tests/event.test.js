/* eslint-disable quotes */
// external imports
const request = require("supertest");

// internal imports
const app = require("../app.ts").default;
const Event = require("../modules/event/model.ts").default;
const { eventMocks } = require("../../models/mocks/event.mock.ts");

const eventOne = eventMocks[0];
const eventOneId = eventOne?.id;

test("GET /users - access denied, no token", async () => {
  jest.spyOn(Event, "findAll");
  const response = await request(app).get("/api/v0/events");
  expect(response.statusCode).toBe(403);
});

test("GET /users - success", async () => {
  jest.spyOn(Event, "findAll").mockResolvedValueOnce(eventMocks);

  const response = await request(app).get("/api/v0/events").set("authorization", `Bearer ${eventOneId}`);
  expect(response.statusCode).toBe(200);
});

test("GET /users/:id - success", async () => {
  jest.spyOn(Event, "findOne").mockResolvedValueOnce(eventOne);

  const response = await request(app).get(`/api/v0/events/${eventOneId}`).set("authorization", `Bearer ${eventOneId}`);
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(eventOne);
});

test("GET /users/:id - user not found", async () => {
  jest.spyOn(Event, "findOne").mockResolvedValueOnce(null);

  const response = await request(app).get("/users/999");
  expect(response.statusCode).toBe(404);
});
