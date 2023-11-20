const request = require("supertest");
const express = require("express");
const { CRUDRoutes } = require("../src/CRUDRoutes");
const { MyModel } = require("../models/MyModel"); // a mock model

describe("CRUDRoutes", () => {
  let app, myCRUDRoutes;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    myCRUDRoutes = new CRUDRoutes({ model: MyModel, joiSchema: {} });
  });

  it("should create a new record", async () => {
    const res = await request(app).post("/test").send({});
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
  });

  //TODO Add tests for getOne, getAll, updateOne, deleteOne, patchOne

  it("should fetch all records", async () => {
    const res = await request(app).get("/test");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
  });
});
