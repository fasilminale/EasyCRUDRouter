const { BaseService } = require("../src/BaseService");
const { MyModel } = require("../models/MyModel");

describe("BaseService", () => {
  let baseService;

  beforeAll(() => {
    baseService = new BaseService({ model: MyModel });
  });

  it("should create a new record", async () => {
    const data = {};
    const result = await baseService.createOne(data);
    expect(result).toHaveProperty("_id");
  });

  //TODO Add tests for getOne, getAll, updateOne, deleteOne, patchOne, createMany, updateMany, deleteMany

  it("should fetch a single record by id", async () => {
    const id = "someId";
    const result = await baseService.getOne(id);
    expect(result).toHaveProperty("_id", id);
  });
});
