const Joi = require("joi");

// Create a helper function that converts a mongoose schema to a joi schema

function getJoiSchemaFromMongooseSchema(mongooseSchema) {
  const joiSchema = {};

  Object.keys(mongooseSchema.paths).forEach((path) => {
    const { options } = mongooseSchema.paths[path];
    let joiType;

    // Determine the Joi type based on the Mongoose schema type
    switch (options.type) {
      case String:
        joiType = Joi.string();
        break;
      case Number:
        joiType = Joi.number();
        break;
      case Boolean:
        joiType = Joi.boolean();
        break;
      case Date:
        joiType = Joi.date();
        break;
      // Add more cases for other Mongoose schema types as needed
      default:
        joiType = Joi.any();
    }

    // Apply additional validations based on Mongoose schema options
    if (options.required) {
      joiType = joiType.required();
    }
    if (options.min !== undefined) {
      joiType = joiType.min(options.min);
    }
    if (options.max !== undefined) {
      joiType = joiType.max(options.max);
    }
    // Add more validations as needed

    // Add the property to the Joi schema
    joiSchema[path] = joiType;
  });

  return Joi.object(joiSchema);
}

module.exports = getJoiSchemaFromMongooseSchema;
