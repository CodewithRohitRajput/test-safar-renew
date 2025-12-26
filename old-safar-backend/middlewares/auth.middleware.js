const { CommonHelper } = require("../utils/common.helper");
const Constant = require("../configs/constant");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({});

const registerMiddleware = async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          {
            email: email,
          },
          {
            phone: phone,
          },
        ],
      },
    });
    if (admin) {
      return CommonHelper.sendError(
        res,
        false,
        Constant.STATUS_CODE.HTTP_400_BAD_REQUEST,
        "ADMIN_ALREADY_EXIST",
        []
      );
    }
    return next();
  } catch (err) {
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const loginMiddleware = async (req, res, next) => {
  console.log(req.body.password);
  const { email } = req.body;
  try {
    const admin = await prisma.admin.findFirst({
      where: {
        email: email,
      },
    });
    if (!admin) {
      return CommonHelper.sendError(
        res,
        false,
        Constant.STATUS_CODE.HTTP_400_BAD_REQUEST,
        "ADMIN_NOT_FOUND",
        []
      );
    }
    console.log(admin);
    res.admin = admin;
    return next();
  } catch (err) {
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};

module.exports = {
  registerMiddleware,
  loginMiddleware,
};
