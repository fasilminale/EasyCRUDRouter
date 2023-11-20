// Import the CRUDRoutes class from where it's defined
const CRUDRoutes = require("./src/CRUDRoutes");
const getJoiSchemaFromMongooseSchema = require("./src/utils/getJoiSchemaFromMongooseSchema");

// Export the CRUDRoutes class
module.exports = {
  CRUDRoutes,
  getJoiSchemaFromMongooseSchema,
  // You can also export other classes or utilities here if needed
};
