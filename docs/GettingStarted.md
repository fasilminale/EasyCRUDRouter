# Getting Started with EasyCRUDRouter

Welcome to `EasyCRUDRouter`! This guide will walk you through the basics of using this package to set up CRUD routes in Node.js applications, with a focus on Mongoose models and pagination.

## Installation

Install the package using npm:

```bash
npm install easy-crud-router
```

## Setting Up Your First Routes

### Step 1: Import Dependencies

Start by importing necessary libraries:

```javascript
const express = require("express");
const { CRUDRoutes } = require("easy-crud-router");
const mongoose = require("mongoose");
```

### Step 2: Define Your Mongoose Model

Set up your Mongoose model. For example:

```javascript
const mongoosePaginate = require("mongoose-paginate-v2");

const MyModelSchema = new mongoose.Schema({
  // Your schema fields
});
MyModelSchema.plugin(mongoosePaginate);

const MyModel = mongoose.model("MyModel", MyModelSchema);
```

### Step 3: Define Your Joi Schema

Define a Joi schema for validation:

```javascript
const Joi = require("joi");

const myModelJoiSchema = Joi.object({
  // Joi validation rules
});
```

### Step 4: Initialize Mongoose

Connect to your MongoDB database:

```javascript
mongoose.connect("your-mongodb-uri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### Step 5: Create CRUD Routes

Create an instance of `CRUDRoutes` with your model and Joi schema:

```javascript
const myCRUDRoutes = new CRUDRoutes({
  model: MyModel,
  joiSchema: myModelJoiSchema,
});
```

### Step 6: Use Routes with Express

Integrate the CRUD routes into your Express application:

```javascript
const app = express();
app.use(express.json());
app.use("/api/myModel", myCRUDRoutes.router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Next Steps

- Explore the [API Reference](APIReference.md) for detailed information on EasyCRUDRouter's capabilities.
- Check out the [examples](examples/) directory for various usage scenarios.
- Ensure you handle database connections and disconnections appropriately in your application.

## Contributing

Interested in contributing to EasyCRUDRouter? Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## License

`EasyCRUDRouter` is [MIT licensed](LICENSE).
