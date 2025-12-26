const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
const Constant = require("../configs/constant");

class CommonHelper {
  /**
   * Method: aesEncrypt
   * Purpose: encrypt a string value using AES-256-CBC
   * @param {*} plaintext
   * @response {*} encrypted string
   */
  aesEncrypt = (plainText) => {
    try {
      const key = CryptoJS.enc.Utf8.parse(process.env.AES_SECRET_KEY);
      const iv = CryptoJS.enc.Utf8.parse(process.env.AES_IV_SECRET_KEY);
      const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Return the ciphertext in hexadecimal format.
      return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    } catch (e) {
      console.error("Error during encryption:", e);
      return "";
    }
  };

  /**
   * Method: aesDecrypt
   * Purpose: Decrypt an encrypted string using AES-256-CBC
   * @param {*} encryptedText
   * @response {*} decrypted string
   */
  aesDecrypt = (encryptedText) => {
    try {
      console.log("encryptedText->>>", encryptedText);

      if (typeof encryptedText !== "string") {
        console.log(typeof encryptedText, 88, "erroe");
        return "";
      }

      const key = CryptoJS.enc.Utf8.parse(process.env.AES_SECRET_KEY);
      const iv = CryptoJS.enc.Utf8.parse(process.env.AES_IV_SECRET_KEY);

      // Convert the hexadecimal input to binary using 'CryptoJS.enc.Hex'.
      const encryptedBytes = CryptoJS.enc.Hex.parse(encryptedText);

      // Perform the decryption with the correct key, IV, and mode.
      let bytes = CryptoJS.AES.decrypt({ ciphertext: encryptedBytes }, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Convert the decrypted binary data to a UTF-8 string.
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error("Error during decryption:", e);
      return "";
    }
  };

  /**
   * Method: sendValidationError
   * Purpose: error response formate
   * @param {*} res
   * @param {*} status
   * @param {*} response
   * @response {*} http response
   */
  sendValidationError = (res, status, statusCode, message, data = {}) => {
    res.status(statusCode).json({
      statusCode: statusCode,
      success: status,
      message: typeof message === "string" ? message : "",
      data: data,
    });
  };

  /**
   * Method: sendSuccess
   * Purpose: response format creation
   * @param {*} res
   * @param {*} successStatus
   * @param {*} statusCode
   * @param {*} message
   * @param {*} data
   * @param {*} total
   * @response {*} http response
   */
  sendSuccess = (
    res,
    successStatus,
    statusCode,
    message = null,
    data,
    page = null,
    limit = null,
    total = null
  ) => {
    const resData = {
      success: successStatus,
      data,

      ...(total && { total }),
      ...(message && {
        message:
          typeof message === "string"
            ? res.__(message)
            : res.__(message.key, message.value),
      }),
    };

    if (limit) {
      resData.page = page + 1;
      resData.limit = limit;
    }
    res.status(statusCode).json(resData);
  };

  /**
   * Method: sendError
   * Purpose: error response formate
   * @param {*} res
   * @param {*} status
   * @param {*} response
   * @response {*} http response
   */
  sendError = (res, status, statusCode, message, data = {}) => {
    res.status(statusCode).json({
      success: status,
      message: message,
      data: data,
    });
  };

  /**
   * Method: asyncForEach
   * Purpose : async ForEach loop
   */
  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  };

  /**
   * Method: hashingPassword
   * Purpose : hash password
   */
  async hashingPassword(password) {
    if (password) {
      const hash = bcrypt.hashSync(password, Constant.SALT_ROUNDS);

      return hash;
    } else {
      return null;
    }
  }

  /**
   * Method: hashingComparePassword
   * Purpose : hash compare password
   */
  async hashingComparePassword(password, hashPassword) {
    console.log("-->", password, hashPassword);
    if (password) {
      const hash = bcrypt.compareSync(password, hashPassword);
      console.log(hash);
      return hash;
    } else {
      return null;
    }
  }

  /**
   * Method: randomString
   * Purpose : Generate random string
   */
  async randomString() {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 9; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Method: randomOtp
   * Purpose : Generate random otp
   */
  async randomOtp() {
    const randomOtp = "123456";
    return { otp: randomOtp };
  }

  async getCloudFrontUrl(key) {
    return (config.AWS_CLOUDFRONT_URL ?? "") + key;
  }
}

module.exports.CommonHelper = new CommonHelper();
