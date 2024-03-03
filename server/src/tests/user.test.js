/* eslint-disable quotes */
// external imports
const request = require("supertest");

// internal imports
const app = require("../app.ts").default;
const User = require("../modules/user/model.ts").default;
const { userMocks } = require("../../models/mocks/user.mock.ts");

const userOne = userMocks[0];
const userOneId = userOne?.id;

test("GET /users - access denied, no token", async () => {
  jest.spyOn(User, "findAll");
  const response = await request(app).get("/api/v0/users");
  expect(response.statusCode).toBe(403);
});

test("GET /users - access denied, not permitted", async () => {
  jest.spyOn(User, "findAll");
  const response = await request(app).get("/api/v0/users").set("authorization", `Bearer ${userOneId}`);
  expect(response.statusCode).toBe(403);
});

test("GET /users - success", async () => {
  jest.spyOn(User, "findAll").mockResolvedValueOnce(userMocks);

  const response = await request(app).get("/api/v0/users").set("authorization", `Bearer ${userMocks[1]?.id}`);
  expect(response.statusCode).toBe(200);
});

test("GET /users/:id - success", async () => {
  jest.spyOn(User, "findOne").mockResolvedValueOnce(userOne);

  const response = await request(app).get(`/api/v0/users/${userOneId}`).set("authorization", `Bearer ${userOneId}`);
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(userOne);
});

test("GET /users/:id - user not found", async () => {
  jest.spyOn(User, "findOne").mockResolvedValueOnce(null);

  const response = await request(app).get("/users/999");
  expect(response.statusCode).toBe(404);
});
