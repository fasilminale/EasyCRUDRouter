# EasyCRUDRouter

EasyCRUDRouter is a Node.js library designed to simplify and automate the creation of CRUD (Create, Read, Update, Delete) routes for Express applications, specifically tailored for Mongoose models. It integrates mongoose-paginate-v2 for efficient pagination and provides built-in support for error handling and Joi validation.

## Table of Contents

- [EasyCRUDRouter](#easycrudrouter)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Documentation](#documentation)
    - [Getting Started with EasyCRUDRouter](#getting-started-with-easycrudrouter)
    - [Installation](#installation-1)
    - [Setting Up Your First Routes](#setting-up-your-first-routes)
      - [Step 1: Import Dependencies](#step-1-import-dependencies)
      - [Step 2: Define Your Mongoose Model](#step-2-define-your-mongoose-model)
      - [Step 3: Define Your Joi Schema](#step-3-define-your-joi-schema)
      - [Step 4: Initialize Mongoose](#step-4-initialize-mongoose)
      - [Step 5: Create CRUD Routes](#step-5-create-crud-routes)
      - [Step 6: Use Routes with Express](#step-6-use-routes-with-express)
    - [Next Steps](#next-steps)
    - [EasyCRUDRouter API Reference](#easycrudrouter-api-reference)
      - [Constructor](#constructor)
        - [`new CRUDRoutes({ model, joiSchema, referenceFields, middleware })`](#new-crudroutes-model-joischema-referencefields-middleware-)
          - [Parameters](#parameters)
      - [Methods](#methods)
        - [`createOne(req, res)`](#createonereq-res)
        - [`getOne(req, res)`](#getonereq-res)
        - [`getAll(req, res)`](#getallreq-res)
        - [`updateOne(req, res)`](#updateonereq-res)
        - [`deleteOne(req, res)`](#deleteonereq-res)
        - [`patchOne(req, res)`](#patchonereq-res)
      - [Middleware](#middleware)
      - [Pagination and Filters](#pagination-and-filters)
      - [Swagger Integration](#swagger-integration)
  - [Examples](#examples)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Seamless Mongoose Integration**: Designed to work effortlessly with Mongoose models.
- **Built-in Pagination**: Integrates mongoose-paginate-v2 for easy and efficient data pagination.
- **Automatic Joi Validation**: Leverages Joi to validate request data with ease.
- **Flexible Middleware Support**: Easily incorporate custom middleware into your CRUD operations.
- **Swagger Documentation Support**: Simplifies Swagger documentation generation for your API routes.
- **Extensible Service Layer**: Customize or extend the provided BaseService to suit your unique requirements.

## Installation

```bash
npm install easy-crud-router
```

## Quick Start

Here's a quick example to get you started using `EasyCRUDRouter` with a Mongoose model:

```javascript
const express = require("express");
const { CRUDRoutes } = require("easy-crud-router");
const mongoose = require("mongoose");
const { MyModel } = require("./models/MyModel");
const myModelJoiSchema = require("./schemas/myModelJoiSchema");

mongoose.connect("your-mongodb-uri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(express.json());

const myCRUDRoutes = new CRUDRoutes({
  model: MyModel,
  joiSchema: myModelJoiSchema,
});

app.use("/api/myModel", myCRUDRoutes.router);
app.listen(3000, () => console.log("Server running on port 3000"));
```

## Documentation

### Getting Started with EasyCRUDRouter

Welcome to `EasyCRUDRouter`! This guide will walk you through the basics of using this package to set up CRUD routes in Node.js applications, with a focus on Mongoose models and pagination.

### Installation

Install the package using npm:

```bash
npm install easy-crud-router
```

### Setting Up Your First Routes

#### Step 1: Import Dependencies

Start by importing necessary libraries:

```javascript
const express = require("express");
const { CRUDRoutes } = require("easy-crud-router");
const mongoose = require("mongoose");
```

#### Step 2: Define Your Mongoose Model

Set up your Mongoose model. For example:

```javascript
const mongoosePaginate = require("mongoose-paginate-v2");

const MyModelSchema = new mongoose.Schema({
  // Your schema fields
});
MyModelSchema.plugin(mongoosePaginate);

const MyModel = mongoose.model("MyModel", MyModelSchema);
```

#### Step 3: Define Your Joi Schema

Define a Joi schema for validation:

```javascript
const Joi = require("joi");

const myModelJoiSchema = Joi.object({
  // Joi validation rules
});
```

#### Step 4: Initialize Mongoose

Connect to your MongoDB database:

```javascript
mongoose.connect("your-mongodb-uri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

#### Step 5: Create CRUD Routes

Create an instance of `CRUDRoutes` with your model and Joi schema:

```javascript
const myCRUDRoutes = new CRUDRoutes({
  model: MyModel,
  joiSchema: myModelJoiSchema,
});
```

#### Step 6: Use Routes with Express

Integrate the CRUD routes into your Express application:

```javascript
const app = express();
app.use(express.json());
app.use("/api/myModel", myCRUDRoutes.router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Next Steps

- Explore the [API Reference](APIReference.md) for detailed information on EasyCRUDRouter's capabilities.
- Check out the [examples](examples/) directory for various usage scenarios.
- Ensure you handle database connections and disconnections appropriately in your application.

### EasyCRUDRouter API Reference

This document provides detailed information about the API of `EasyCRUDRouter`, a Node.js package for creating CRUD (Create, Read, Update, Delete) routes quickly and efficiently with Mongoose models and `mongoose-paginate-v2`.

#### Constructor

##### `new CRUDRoutes({ model, joiSchema, referenceFields, middleware })`

Creates a new instance of CRUDRoutes.

###### Parameters

- `model`: Your Mongoose data model.
- `joiSchema`: Joi schema for input validation.
- `referenceFields`: Optional. Array of objects specifying reference fields for relational data handling.
- `middleware`: Optional. An object specifying middleware for different CRUD operations.

#### Methods

##### `createOne(req, res)`

Handles creating a new record.

##### `getOne(req, res)`

Fetches a single record by its ID.

##### `getAll(req, res)`

Retrieves multiple records, with support for pagination and filters.

##### `updateOne(req, res)`

Updates a record by its ID.

##### `deleteOne(req, res)`

Deletes a record by its ID.

##### `patchOne(req, res)`

Partially updates a record by its ID.

#### Middleware

Middleware functions can be added to CRUD operations. Here's how you can specify them:

```javascript
const myCRUDRoutes = new CRUDRoutes({
  // ...
  middleware: {
    getAll: [myCustomMiddleware],
    createOne: [validationMiddleware, anotherMiddleware],
  },
});
```

#### Pagination and Filters

`EasyCRUDRouter` integrates `mongoose-paginate-v2` for efficient pagination and filtering of data. Pagination and filter options can be passed through the query parameters.

#### Swagger Integration

`EasyCRUDRouter` supports automatic Swagger documentation generation. Use `getPaths` to integrate with Swagger:

```javascript
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup({
    ...swaggerOptions,
    paths: {
      ...swaggerOptions.paths,
      ...myCRUDRoutes.getPaths(),
    },
  })
);
```

For more details, refer to the `basicUsage.js` example in the package.

---

For any further questions or contributions, please visit our [GitHub repository](#).

## Examples

Explore the [examples directory](https://github.com/fasilminale/EasyCRUDRouter/tree/main/examples) for sample implementations and various usage scenarios.

## Contributing

We appreciate contributions! If you'd like to contribute, please read our [contributing guidelines](https://github.com/fasilminale/EasyCRUDRouter/blob/main/CONTRIBUTING.md).

## License

EasyCRUDRouter is [MIT licensed](https://github.com/fasilminale/EasyCRUDRouter/blob/main/LICENSE).
