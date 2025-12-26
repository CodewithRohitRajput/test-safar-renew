"use strict";
require("dotenv").config();
module.exports = {
  STATUS_CODE: {
    HTTP_200_OK: 200,
    HTTP_201_CREATED: 201,
    HTTP_204_NO_CONTENT: 204,
    HTTP_400_BAD_REQUEST: 400,
    HTTP_401_UNAUTHORIZED: 401,
    HTTP_403_FORBIDDEN: 403,
    HTTP_404_NOT_FOUND: 404,
    HTTP_405_METHOD_NOT_ALLOWED: 405,
    HTTP_409_CONFLICT: 409,
    HTTP_500_INTERNAL_SERVER_ERROR: 500,
    HTTP_498_TOKEN_EXPIRED: 498,
  },
  DEFAULT_VERIFICATION_CODE: "ABC12345",
  SALT_ROUNDS: 10,
  JWT: {
    TOKEN_LIFE: process.env.JWT_TOKEN_LIFE, // Note: in seconds!,(min*sec)
    REFRESH_TOKEN_LIFE: process.env.JWT_REFRESH_TOKEN_LIFE, // Note: in seconds!, (day*hr*min*sec)
    SECRET: process.env.JWT_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    OTP_TOKEN_LIFE: process.env.OTP_TOKEN_LIFE,
    VERIFICATION_TOKEN_LIFE: process.env.VERIFICATION_TOKEN_LIFE,
  },
  MONTH: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};
