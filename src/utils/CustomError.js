// A custom error class that extends the built-in Error class
class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = CustomError;
