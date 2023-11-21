const express = require("express");
const validateInput = require("./middleware/validateInput");
const handleError = require("./middleware/handleError");
const checkId = require("./utils/checkId");
const SwaggerPathGenerator = require("./SwaggerPathGenerator");
const BaseService = require("./BaseService");

class CRUDRoutes {
  constructor({ model, joiSchema, referenceFields = [], middleware = {} }) {
    this.router = express.Router();
    // Create a service instance
    this.service = new BaseService({
      model: model,
      referenceFields: referenceFields,
    });

    // Set up default middleware
    this.defaultMiddleware = [validateInput(joiSchema)];
    if (referenceFields && referenceFields.length > 0) {
      this.defaultMiddleware.push(checkId(referenceFields));
    }
    // Bind all methods
    this.bindMethods();

    // Initialize routes with middleware
    this.initializeRoutes(middleware);

    this.getPaths = new SwaggerPathGenerator({
      model: model,
      schema: joiSchema,
    }).getPaths;
  }

  bindMethods() {
    this.createOne = this.createOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.getAll = this.getAll.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.patchOne = this.patchOne.bind(this);
  }

  initializeRoutes(middleware) {
    this.router.post(
      "/",
      this.applyMiddleware(middleware.createOne, true),
      this.createOne
    );
    this.router.get(
      "/:id",
      this.applyMiddleware(middleware.getOne),
      this.getOne
    );
    this.router.get("/", this.applyMiddleware(middleware.getAll), this.getAll);
    this.router.put(
      "/:id",
      this.applyMiddleware(middleware.updateOne, true),
      this.updateOne
    );
    this.router.delete(
      "/:id",
      this.applyMiddleware(middleware.deleteOne),
      this.deleteOne
    );
    this.router.patch(
      "/:id",
      this.applyMiddleware(middleware.patchOne),
      this.patchOne
    );

    // Global error handler
    this.router.use(handleError);
  }

  applyMiddleware(customMiddleware = [], includeDefault = false) {
    return includeDefault
      ? [...this.defaultMiddleware, ...customMiddleware]
      : [...customMiddleware];
  }

  async createOne(req, res) {
    const result = await this.service.createOne(req.body);
    res.status(201).json(result);
  }
  async getOne(req, res) {
    const result = await this.service.getOne(req.params.id);
    res.status(200).json(result);
  }
  async getAll(req, res) {
    const user = req.body.user;

    const result = await this.service.getAll(req.query, user);
    res.status(200).json(result);
  }
  async updateOne(req, res) {
    const result = await this.service.updateOne(req.params.id, req.body);
    res.status(200).json(result);
  }
  async patchOne(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    const updatedDoc = await this.service.updateOne(id, updateData);

    res.status(200).json(updatedDoc);
  }

  async deleteOne(req, res) {
    const result = await this.service.deleteOne(req.params.id);
    res.status(200).json(result);
  }
}

module.exports = CRUDRoutes;
