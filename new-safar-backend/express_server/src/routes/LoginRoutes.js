
const express = require("express");
const LoginController = require("../controllers/LoginController");
const router = express.Router();

router.post("/" , LoginController.userLogin);

module.exports = router

