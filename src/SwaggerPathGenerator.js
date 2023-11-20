const pluralize = require("pluralize");
const j2s = require("joi-to-swagger");

class SwaggerPathGenerator {
  constructor({ model, schema }) {
    this.model = model;
    this.schema = schema;
  }

  toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  generateSwagger({
    method,
    summary,
    description,
    parameters,
    tags,
    responses,
    requestBody,
    ...rest
  }) {
    // Define the helper function to generate a parameter object
    function generateParameter(name, type, inn) {
      // Create an object with the given arguments
      const parameter = {
        name: name,
        type: type,
        in: inn,
      };
      // If the in location is path, set the required property to true
      if (inn === "path") {
        parameter.required = true;
      }
      // Return the parameter object
      return parameter;
    }

    // Define the helper function to generate a response object
    function generateResponse(statusCode, description, schema) {
      // Create an object with the given arguments
      const response = {
        description: description,
        content: {
          "application/json": {
            schema: schema,
          },
        },
      };
      // Return the response object
      return response;
    }

    // Create an empty object
    const swagger = {};
    // Assign the method property with the given arguments
    swagger[method] = {
      summary: summary,
      tags,
      description: description,
      parameters: parameters.map((p) =>
        generateParameter(p.name, p.type, p.in)
      ), // Use the helper function to map the parameters array to parameter objects
      requestBody: requestBody
        ? {
            required: true,
            content: {
              "application/json": {
                schema: requestBody.schema,
              },
            },
          }
        : {},
      responses: Object.fromEntries(
        Object.entries(responses).map(([k, v]) => [
          k,
          generateResponse(k, v.description, v.schema),
        ])
      ), // Use the helper function to map the responses object to response objects
      ...rest,
    };
    // Return the swagger object
    return swagger;
  }

  getPaths() {
    let modelName = this.toCamelCase(String(this.model.modelName));
    const { swagger: schema } = j2s(this.schema);

    const paginationSchema = {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            $ref: `#/components/schemas/${modelName}`,
          },
        },
        totalDocs: { type: "number" },
        totalPages: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
    };

    const filterSchema = {
      type: "object",
      properties: Object.entries(schema.properties).reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {}
      ),
    };

    let pluralModelName = pluralize.plural(modelName);
    pluralModelName = pluralModelName.replace(/[A-Z]/g, (match, index) =>
      index ? `-${match.toLowerCase()}` : match.toLowerCase()
    );

    const paths = {
      [`/${pluralModelName}`]: {
        get: this.generateSwagger({
          method: "get",
          summary: `Get all ${modelName}`,
          description: `Retrieves a list of all ${modelName}`,
          tags: [modelName],
          parameters: [
            { name: "page", type: "number", in: "query" },
            { name: "limit", type: "number", in: "query" },
            {
              name: "filter",
              type: "object",
              in: "query",
              schema: filterSchema,
            },
            { name: "sort", type: "string", in: "query" },
          ],
          responses: {
            200: {
              description: "OK",
              schema: paginationSchema,
            },
          },
        }),
        post: this.generateSwagger({
          method: "post",
          summary: `Create a new ${modelName}`,
          description: `Creates a new ${modelName} with the given data`,
          tags: [modelName],
          requestBody: {
            schema,
          },
          responses: {
            201: {
              description: "Created",
              schema: { $ref: `#/components/schemas/${modelName}` },
            },
          },
        }),
      },
      [`/${pluralModelName}/:id`]: {
        get: this.generateSwagger({
          method: "get",
          summary: `Get a single ${modelName}`,
          description: `Retrieves a single ${modelName} by its id`,
          tags: [modelName],
          parameters: [{ name: "id", type: "string", in: "path" }],
          responses: {
            200: {
              description: "OK",
              schema: { $ref: `#/components/schemas/${modelName}` },
            },
            404: {
              description: `${modelName} not found`,
            },
          },
        }),
        put: this.generateSwagger({
          method: "put",
          summary: `Update a ${modelName}`,
          description: `Updates the specified ${modelName} by its id`,
          tags: [modelName],
          parameters: [{ name: "id", type: "string", in: "path" }],
          requestBody: {
            schema,
          },
          responses: {
            200: {
              description: "OK",
              schema: { $ref: `#/components/schemas/${modelName}` },
            },
            404: {
              description: `${modelName} not found`,
            },
          },
        }),
        patch: this.generateSwagger({
          method: "patch",
          summary: `Partially update a ${modelName}`,
          description: `Partially updates the specified ${modelName} by its id`,
          tags: [modelName],
          parameters: [{ name: "id", type: "string", in: "path" }],
          requestBody: {
            schema, // You might want a different schema for partial updates
          },
          responses: {
            200: {
              description: "OK",
              schema: { $ref: `#/components/schemas/${modelName}` },
            },
            404: {
              description: `${modelName} not found`,
            },
          },
        }),
        delete: this.generateSwagger({
          method: "delete",
          summary: `Delete a ${modelName}`,
          description: `Deletes the specified ${modelName} by its id`,
          tags: [modelName],
          parameters: [{ name: "id", type: "string", in: "path" }],
          responses: {
            200: {
              description: "OK",
            },
            404: {
              description: `${modelName} not found`,
            },
          },
        }),
      },
    };

    return paths;
  }
}

module.exports = SwaggerPathGenerator;
