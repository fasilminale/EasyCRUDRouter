// An error handling middleware function that catches any errors and sends the appropriate response
function handleError(err, req, res, next) {
  // Log the error to the console
  console.error(err);
  // If the error has a status property, use it as the response status
  // Otherwise, use 500 as the default status
  const status = err.status || 500;
  // If the error has a message property, use it as the response message
  // Otherwise, use "Something went wrong" as the default message
  const message = err.message || "Something went wrong";
  // Send the response with the status and message
  res.status(status).json({ message });
}

module.exports = handleError;
