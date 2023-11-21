const pluralize = require("pluralize");
const j2s = require("joi-to-swagger");

class SwaggerPathGenerator {
  constructor({ model, schema }) {
    this.model = model;
    this.schema = schema;

    this.getPaths = this.getPaths.bind(this);
    this.generateSwagger = this.generateSwagger.bind(this);
  }

  toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  generateSwagger({
    method,
    summary,
    description,
    parameters = [],
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

  // getPaths() {
  //   let modelName = this.toCamelCase(String(this.model.modelName));
  //   const { swagger: schema } = j2s(this.schema);

  //   const paginationSchema = {
  //     type: "object",
  //     properties: {
  //       data: {
  //         type: "array",
  //         items: {
  //           $ref: `#/components/schemas/${modelName}`,
  //         },
  //       },
  //       totalDocs: { type: "number" },
  //       totalPages: { type: "number" },
  //       page: { type: "number" },
  //       limit: { type: "number" },
  //     },
  //   };

  //   const filterSchema = {
  //     type: "object",
  //     properties: Object.entries(schema.properties).reduce(
  //       (acc, [key, value]) => {
  //         acc[key] = value;
  //         return acc;
  //       },
  //       {}
  //     ),
  //   };

  //   let pluralModelName = pluralize.plural(modelName);
  //   pluralModelName = pluralModelName.replace(/[A-Z]/g, (match, index) =>
  //     index ? `-${match.toLowerCase()}` : match.toLowerCase()
  //   );

  //   const paths = {
  //     [`/${pluralModelName}`]: {
  //       get: this.generateSwagger({
  //         method: "get",
  //         summary: `Get all ${modelName}`,
  //         description: `Retrieves a list of all ${modelName}`,
  //         security: [
  //           {
  //             BearerAuth: [], // Reference the security scheme defined in "components"
  //           },
  //         ],
  //         tags: [`${modelName}`],
  //         parameters: [
  //           {
  //             name: "page",
  //             in: "query",
  //             schema: {
  //               type: "number",
  //             },
  //             description: "The page number to get",
  //           },
  //           {
  //             name: "limit",
  //             in: "query",
  //             schema: {
  //               type: "number",
  //             },
  //             description: "The number of docs per page",
  //           },
  //           {
  //             name: "filter",
  //             in: "query",
  //             schema: filterSchema,
  //             description: "The filter criteria to apply",
  //           },
  //           {
  //             name: "sort",
  //             in: "query",
  //             schema: {
  //               type: "string",
  //             },
  //             description:
  //               "it must be a space delimited list of path names. The sort order of each path is ascending unless the path name is prefixed with - which will be treated as descending",
  //           },
  //         ],
  //         responses: {
  //           200: {
  //             description: "OK",
  //             content: {
  //               "application/json": {
  //                 schema: paginationSchema,
  //               },
  //             },
  //           },
  //         },
  //       }),
  //       post: this.generateSwagger({
  //         method: "post",
  //         summary: `Create a new ${modelName}`,
  //         description: `Creates a new ${modelName} with the given data`,
  //         tags: [`${modelName}`],
  //         security: [
  //           {
  //             BearerAuth: [], // Reference the security scheme defined in "components"
  //           },
  //         ],
  //         requestBody: {
  //           required: true,
  //           content: {
  //             "application/json": {
  //               schema: schema,
  //             },
  //           },
  //         },
  //         responses: {
  //           201: {
  //             description: "Created",
  //             content: {
  //               "application/json": {
  //                 schema: {
  //                   $ref: `#/components/schemas/${modelName}`,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       }),
  //     },
  //     [`/${pluralModelName}/:id`]: {
  //       get: this.generateSwagger({
  //         method: "get",
  //         summary: `Get a single ${modelName}`,
  //         description: `Retrieves a single ${modelName} by its id`,
  //         tags: [`${modelName}`],
  //         security: [
  //           {
  //             BearerAuth: [], // Reference the security scheme defined in "components"
  //           },
  //         ],
  //         parameters: [
  //           {
  //             name: "id",
  //             in: "path",
  //             required: true,
  //             schema: {
  //               type: "string",
  //             },
  //           },
  //         ],
  //         responses: {
  //           200: {
  //             description: "OK",
  //             content: {
  //               "application/json": {
  //                 schema: {
  //                   $ref: `#/components/schemas/${modelName}`,
  //                 },
  //               },
  //             },
  //           },
  //           404: {
  //             description: `${modelName} not found`,
  //           },
  //         },
  //       }),
  //       put: this.generateSwagger({
  //         method: "put",
  //         summary: `Update a ${modelName}`,
  //         description: `Updates the specified ${modelName} by its id`,
  //         security: [
  //           {
  //             BearerAuth: [], // Reference the security scheme defined in "components"
  //           },
  //         ],
  //         tags: [`${modelName}`],
  //         parameters: [{ name: "id", type: "string", in: "path" }],
  //         requestBody: {
  //           required: true,
  //           content: {
  //             "application/json": {
  //               schema: schema,
  //             },
  //           },
  //         },
  //         responses: {
  //           200: {
  //             description: "OK",
  //             content: {
  //               "application/json": {
  //                 schema: {
  //                   $ref: `#/components/schemas/${modelName}`,
  //                 },
  //               },
  //             },
  //           },
  //           404: {
  //             description: `${modelName} not found`,
  //           },
  //         },
  //       }),
  //       patch: this.generateSwagger({
  //         method: "patch",
  //         summary: `Partially update a ${modelName}`,
  //         description: `Partially updates the specified ${modelName} by its id`,
  //         tags: [`${modelName}`],
  //         security: [
  //           {
  //             BearerAuth: [], // Reference the security scheme defined in "components"
  //           },
  //         ],
  //         parameters: [
  //           {
  //             name: "id",
  //             in: "path",
  //             required: true,
  //             schema: {
  //               type: "string",
  //             },
  //           },
  //         ],
  //         requestBody: {
  //           required: true,
  //           content: {
  //             "application/json": {
  //               schema: schema, // Use the same schema as for POST and PUT requests
  //             },
  //           },
  //         },
  //         responses: {
  //           200: {
  //             description: "OK",
  //             content: {
  //               "application/json": {
  //                 schema: {
  //                   $ref: `#/components/schemas/${modelName}`,
  //                 },
  //               },
  //             },
  //           },
  //           404: {
  //             description: `${modelName} not found`,
  //           },
  //         },
  //       }),
  //       delete: this.generateSwagger({
  //         method: "delete",
  //         summary: `Delete a ${modelName}`,
  //         description: `Deletes the specified ${modelName} by its id`,
  //         security: [
  //           {
  //             BearerAuth: [], // Reference the security scheme defined in "components"
  //           },
  //         ],
  //         tags: [`${modelName}`],
  //         parameters: [
  //           {
  //             name: "id",
  //             in: "path",
  //             required: true,
  //             schema: {
  //               type: "string",
  //             },
  //           },
  //         ],
  //         responses: {
  //           200: {
  //             description: "OK",
  //             content: {
  //               "application/json": {
  //                 schema: {
  //                   $ref: `#/components/schemas/${modelName}`,
  //                 },
  //               },
  //             },
  //           },
  //           404: {
  //             description: `${modelName} not found`,
  //           },
  //         },
  //       }),
  //     },
  //   };

  //   return paths;
  // }

  getPaths() {
    // Use the model name and schema to create the paths object
    let modelName = String(this.model.modelName);

    modelName = this.toCamelCase(modelName);

    const { swagger: schema } = j2s(this.schema);
    // const schema = joiToJSONSchema(this.schema);

    const paginationSchema = {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            $ref: `#/components/schemas/${modelName}`,
          },
        },
        totalDocs: {
          type: "number",
        },
        totalPages: {
          type: "number",
        },
        page: {
          type: "number",
        },
        limit: {
          type: "number",
        },
      },
    };
    // Create a filter schema object by looping over the schema properties
    const filterSchema = {
      type: "object",
      properties: {
        sort: "",
        select: "",
        filter: {
          type: "object",
          properties: {},
        },
      },
    };
    for (const [key, value] of Object.entries(schema.properties)) {
      // Use Object.entries to get the key and value pairs of the schema properties
      filterSchema.properties.filter.properties[key] = value; // Assign the same key and value to the filter schema properties
    }

    let pluralModelName = pluralize.plural(String(this.model.modelName));
    pluralModelName = pluralModelName.replace(/[A-Z]/g, (match, index) =>
      index ? "-" + match.toLowerCase() : match.toLowerCase()
    );
    const paths = {
      [`/${pluralModelName}`]: {
        get: {
          summary: `Get all ${modelName}`,
          tags: [`${modelName}`],
          description: `Retrieves a list of all ${modelName}`,
          security: [
            {
              BearerAuth: [], // Reference the security scheme defined in "components"
            },
          ],
          parameters: [
            {
              name: "page",
              in: "query",
              schema: {
                type: "number",
              },
              description: "The page number to get",
            },
            {
              name: "limit",
              in: "query",
              schema: {
                type: "number",
              },
              description: "The number of docs per page",
            },
            {
              name: "filter",
              in: "query",
              schema: filterSchema,
              description: "The filter criteria to apply",
            },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
              },
              description:
                "it must be a space delimited list of path names. The sort order of each path is ascending unless the path name is prefixed with - which will be treated as descending",
            },
          ],
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: paginationSchema,
                },
              },
            },
          },
        },
        post: {
          summary: `Create a new ${modelName}`,
          tags: [`${modelName}`],
          description: `Creates a new ${modelName} with the given data`,
          security: [
            {
              BearerAuth: [], // Reference the security scheme defined in "components"
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schema,
              },
            },
          },
          responses: {
            201: {
              description: "Created",
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/${modelName}`,
                  },
                },
              },
            },
          },
        },
      },
      [`/${pluralModelName}/:id`]: {
        get: {
          summary: `Get a single ${modelName} by id`,
          tags: [`${modelName}`],
          description: `Retrieves a single ${modelName} by its id`,
          security: [
            {
              BearerAuth: [], // Reference the security scheme defined in "components"
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/${modelName}`,
                  },
                },
              },
            },
            404: {
              description: `${modelName} not found`,
            },
          },
        },
        put: {
          summary: `Update a single ${modelName} by id`,
          tags: [`${modelName}`],
          description: `Updates a single ${modelName} by its id with the given data`,
          security: [
            {
              BearerAuth: [], // Reference the security scheme defined in "components"
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schema,
              },
            },
          },
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/${modelName}`,
                  },
                },
              },
            },
            404: {
              description: `${modelName} not found`,
            },
          },
        },
        patch: {
          summary: `Partially update a single ${modelName} by id`,
          tags: [`${modelName}`],
          description: `Partially updates a single ${modelName} by its id with the specified fields`,
          security: [
            {
              BearerAuth: [], // Reference the security scheme defined in "components"
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: schema, // Use the same schema as for POST and PUT requests
              },
            },
          },
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/${modelName}`,
                  },
                },
              },
            },
            404: {
              description: `${modelName} not found`,
            },
          },
        },
        delete: {
          summary: `Delete a single ${modelName} by id`,
          tags: [`${modelName}`],
          description: `Deletes a single ${modelName} by its id`,
          security: [
            {
              BearerAuth: [], // Reference the security scheme defined in "components"
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/${modelName}`,
                  },
                },
              },
            },
            404: {
              description: `${modelName} not found`,
            },
          },
        },
      },
    };
    // Return the paths object
    return paths;
  }
}

module.exports = SwaggerPathGenerator;
