"use strict";
// Import necessary modules
const constant = require("../configs/constant");
const { CommonHelper } = require("../utils/common.helper");

// Define a function to handle errors
const errorHandler = (err, res, req) => {
  console.log("----", err);
  // Check if the error has a sqlMessage or message property, otherwise treat it as a string error message
  const error =
    (err?.message == err?.message?.toUpperCase() ? err?.message : err?.name) ||
    err;
  // Get the corresponding error message and status code from the constant.ERROR_MESSAGE object, or use the error message as the default message and HTTP 500 as the default status code
  let { message, status } = constant.ERROR_MESSAGE[error] || {
    message: error,
    status: constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
  };
  // Use the CommonHelper module to send the error response to the client
  if (
    error == error.toUpperCase() &&
    status === constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR
  ) {
    status = constant.STATUS_CODE.HTTP_400_BAD_REQUEST;
  }
  return CommonHelper.sendError(res, false, status, message, {});
};

// Export the errorHandler function for use in other modules
module.exports = { errorHandler };
