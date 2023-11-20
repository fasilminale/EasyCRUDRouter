const CustomError = require("../utils/CustomError");

// A middleware function that validates the input and handles the error
function validateInput(schema) {
  return (req, res, next) => {
    const result = schema.validate(req.body);
    // console.log(value, "fasil error");

    if (result.error) {
      // Throw a custom error with status 400 and message from Joi
      throw new CustomError(400, result.error.details[0].message);
    }
    next();
  };
}

module.exports = validateInput;
