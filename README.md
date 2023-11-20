# EasyCRUDRouter

EasyCRUDRouter is a Node.js library designed to simplify and automate the creation of CRUD (Create, Read, Update, Delete) routes for Express applications, specifically tailored for Mongoose models. It integrates mongoose-paginate-v2 for efficient pagination and provides built-in support for error handling and Joi validation.

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

For a comprehensive guide on all functionalities and usage, refer to the [API Reference](APIReference.md).

## Examples

Explore the [examples](examples/) directory for sample implementations and various usage scenarios.

## Contributing

We appreciate contributions! If you'd like to contribute, please read our [contributing guidelines](CONTRIBUTING.md).

## License

EasyCRUDRouter is [MIT licensed](LICENSE).
