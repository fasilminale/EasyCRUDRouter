const CustomError = require("./CustomError");
const mongoose = require("mongoose");

// Create a helper function that takes an array of objects with fieldName and modelName properties and returns a middleware function
// Create a helper function that takes an array of objects with fieldName, modelName and nestedPath properties and returns a middleware function
function checkId(fields) {
  // Return a middleware function that checks the ids of the given models
  return async function (req, res, next) {
    // Loop through the fields array
    for (const field of fields) {
      // Get the field name, model name and nested field path from the field object
      const { fieldName, modelName, nestedPath } = field;
      // Get the value from the request body using the field name
      const value = req.body[fieldName];
      // If there is a value, check if it is an array or not
      if (value) {
        // If it is an array, loop through the array and check each element
        if (Array.isArray(value)) {
          for (const element of value) {
            // Check if the element is an object or not
            if (typeof element === "object" && element !== null) {
              // If it is an object, get the id from the object using the nested field path
              const id = element[nestedPath];
              // Try to find a document with the given id and model name
              const doc = await mongoose.model(modelName).findById(id);
              // If there is no document, throw a custom error with status 404 and message `${modelName} not found`
              if (!doc) {
                throw new CustomError(404, `${modelName} not found`);
              }
            } else {
              // If it is not an object, check the id as before
              // Try to find a document with the given id and model name
              const doc = await mongoose.model(modelName).findById(element);
              // If there is no document, throw a custom error with status 404 and message `${modelName} not found`
              if (!doc) {
                throw new CustomError(404, `${modelName} not found`);
              }
            }
          }
        } else {
          // If it is not an array, check the id as before
          // Try to find a document with the given id and model name
          const doc = await mongoose.model(modelName).findById(value);
          // If there is no document, throw a custom error with status 404 and message `${modelName} not found`
          if (!doc) {
            throw new CustomError(404, `${modelName} not found`);
          }
        }
        // If there are documents, attach them to the request object using the field name and proceed to the next middleware
        req[fieldName] = value;
      }
    }
    next();
  };
}

module.exports = checkId;
