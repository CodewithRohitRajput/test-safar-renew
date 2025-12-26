const { CommonHelper } = require("../utils/common.helper");
const Constant = require("../configs/constant");
const { JWTHelper } = require("../utils/jwt.token.helper");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({});

const authorizeAdmin = async (req, res, next) => {
  // Get the access token from the request headers

  try {
    const accessToken = req.headers["authorization"].split(" ")[1] || "";
    req.headers.authorization = accessToken;
    // Verify the access token using the JWT token helper
    const decoded = await JWTHelper.verify(accessToken);
    // decoded.userId = CommonHelper.aesDecrypt(decoded.adminId);
    console.log(decoded);
    if (!decoded.adminId) {
      throw "JsonWebTokenError";
    }
    // // check if user exist with userId and roleId

    const admin = await prisma.admin.findUniqueOrThrow({
      where: {
        id: decoded.adminId,
      },
    });

    res.admin = admin;
    res.role = admin.role;

    return next();
  } catch (err) {
    // Send appropriate error response based on the type of error
    switch (err) {
      case "ACCESS_TOKEN_NOT_DEFINED":
        return CommonHelper.sendError(
          res,
          false,
          Constant.STATUS_CODE.HTTP_401_UNAUTHORIZED,
          "AUTH_TOKEN_REQUIRED",
          []
        );
      case "TokenExpiredError":
        return CommonHelper.sendError(
          res,
          false,
          Constant.STATUS_CODE.HTTP_498_TOKEN_EXPIRED,
          "VALIDATION_TOKEN_EXPIRED",
          []
        );
      case "JsonWebTokenError":
        return CommonHelper.sendError(
          res,
          false,
          Constant.STATUS_CODE.HTTP_401_UNAUTHORIZED,
          "VALIDATION_INVALID_TOKEN",
          []
        );
      default:
        console.log(err);
        return CommonHelper.sendError(
          res,
          false,
          Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
          "SERVER_SOMETHING_WENT_WRONG",
          []
        );
    }
  }
};

const SuperAdminMiddleware = async (req, res, next) => {
  const role = res.role;
  if (role !== "SUPERADMIN") {
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_401_UNAUTHORIZED,
      "UNAUTHORIZED_ACCESS",
      []
    );
  }
  return next();
};

module.exports = {
  authorizeAdmin,
  SuperAdminMiddleware,
};
