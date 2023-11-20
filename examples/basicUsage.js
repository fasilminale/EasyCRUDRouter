// Import Express and your EasyCRUDRouter
const express = require("express");
const { CRUDRoutes } = require("easy-crud-router");
const mongoose = require("mongoose");

// Import your model and Joi schema (assuming these are set up in your project)
const { MyModel } = require("./models/MyModel");
const myModelJoiSchema = require("./schemas/myModelJoiSchema");

// Connect to MongoDB
mongoose.connect("your-mongodb-uri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create an Express app
const app = express();
app.use(express.json());

// Define middleware (if any)
const myMiddleware = (req, res, next) => {
  // Middleware logic here
  next();
};

// Create an instance of CRUDRoutes
const myCRUDRoutes = new CRUDRoutes({
  model: MyModel,
  joiSchema: myModelJoiSchema,
  middleware: { getAll: [myMiddleware] }, // Example of applying middleware to the 'getAll' route
});

// Use the CRUDRoutes with your Express app
app.use("/my-model", myCRUDRoutes.router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
