# EasyCRUDRouter

EasyCRUDRouter is a Node.js library designed to simplify and automate the creation of CRUD (Create, Read, Update, Delete) routes for Express applications, specifically tailored for Mongoose models. It integrates mongoose-paginate-v2 for efficient pagination and provides built-in support for error handling and Joi validation.

## Table of Contents

- [EasyCRUDRouter](#easycrudrouter)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Documentation](#documentation)
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

- [Getting Started Guide](https://github.com/fasilminale/EasyCRUDRouter/blob/main/docs/GettingStarted.md)
- [API Reference](https://github.com/fasilminale/EasyCRUDRouter/blob/main/docs/APIReference.md)
- [Examples](https://github.com/fasilminale/EasyCRUDRouter/tree/main/examples)

## Examples

Explore the [examples directory](https://github.com/fasilminale/EasyCRUDRouter/tree/main/examples) for sample implementations and various usage scenarios.

## Contributing

We appreciate contributions! If you'd like to contribute, please read our [contributing guidelines](https://github.com/fasilminale/EasyCRUDRouter/blob/main/CONTRIBUTING.md).

## License

EasyCRUDRouter is [MIT licensed](https://github.com/fasilminale/EasyCRUDRouter/blob/main/LICENSE).
