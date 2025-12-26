const jwt = require("jsonwebtoken");
const constant = require("../configs/constant.js");

/**
 * Utility class for handling JWT tokens.
 */
class JWTHelper {
  /**
   * Generates an access token and an optional refresh token.
   * @param {Object} payload - The payload to include in the token.
   * @param {Number} expireTime - The expiration time in seconds.
   * @param {Boolean} [isRefreshToken=false] - Whether to include a refresh token.
   * @returns {Object} - The access token and refresh token (if any).
   * @throws {Error} If payload is not defined.
   */
  generateToken = (payload, isRefreshToken = false) => {
    if (!payload) {
      throw "PAYLOAD_NOT_DEFINED";
    }
    try {
      //  const options = { expiresIn: Number(expireTime) };
      const accessToken = jwt.sign(payload, constant.JWT.SECRET, {
        expiresIn: Number(constant.JWT.TOKEN_LIFE),
      });

      const refreshToken = isRefreshToken
        ? jwt.sign(payload, constant.JWT.REFRESH_TOKEN_SECRET, {
            expiresIn: Number(constant.JWT.REFRESH_TOKEN_LIFE),
          })
        : null;

      return { accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  };

  /**
   * Verifies the given access token.
   * @param {String} accessToken - The access token to verify.
   * @returns {Promise<Object>} - The decoded token payload.
   * @throws {Error} If accessToken is not defined.
   * @rejects "NO_TOKEN_FOUND" if accessToken is not defined.
   */
  verify = async (accessToken) => {
    console.log("accessToken", accessToken);
    if (!accessToken) {
      throw "ACCESS_TOKEN_NOT_DEFINED";
    }
    try {
      const decoded = jwt.verify(accessToken, constant.JWT.SECRET, {
        algorithms: ["HS256"],
      });
      console.log(decoded, "<-----------");
      return decoded;
    } catch (err) {
      console.error(err);
      //return err; // Print the error for debugging
      throw err; // Re-throw the error to propagate it
    }
  };

  /**
   * Method: verifyRefreshToken
   * Purpose: verify refresh token
   * @param {string} refreshToken - The refresh token to verify
   * @returns {Promise<string>} - A promise that resolves to "VALID" if the token is valid, or rejects with an error message otherwise.
   */
  verifyRefreshToken = async (refreshToken) => {
    if (!refreshToken) {
      throw "NO_TOKEN_FOUND";
    }
    try {
      const decoded = await jwt.verify(
        refreshToken,
        constant.JWT.REFRESH_TOKEN_SECRET
      );
      return decoded;
    } catch (err) {
      throw err;
    }
  };

  generateOtpToken = async (payload, expireTime) => {
    try {
      if (!payload) {
        throw "PAYLOAD_NOT_DEFINED";
      }
      const options = { expiresIn: Number(expireTime) };
      const otpToken = jwt.sign(payload, constant.JWT.SECRET, options);
      return otpToken;
    } catch (err) {
      throw err;
    }
  };

  /**
   * Method: verifyVerificationToken
   * Purpose: verify verification token
   * @param {string} VerificationToken - verify verification token
   * @returns {Promise<string>} - A promise that resolves to "VALID" if the token is valid, or rejects with an error message otherwise.
   */

  verifyVerificationToken = async (VerificationToken) => {
    try {
      return jwt.verify(VerificationToken, constant.JWT.SECRET);
    } catch (err) {
      switch (err.name) {
        case "TokenExpiredError":
          err = "VERIFICATION_TOKEN_EXPIRED";
          break;

        case "JsonWebTokenError":
          err = "INVALID_VERIFICATION_TOKEN";
          break;
        default:
          err = "INVALID_VERIFICATION_TOKEN";
          break;
      }
      throw err;
    }
  };

  generateVerificationToken = async (payload, expireTime) => {
    try {
      if (!payload) {
        throw "PAYLOAD_NOT_DEFINED";
      }
      const options = { expiresIn: Number(expireTime) };
      const verificationToken = jwt.sign(payload, constant.JWT.SECRET, options);
      return verificationToken;
    } catch (err) {
      throw err;
    }
  };
}
module.exports.JWTHelper = new JWTHelper();
