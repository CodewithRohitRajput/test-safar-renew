const express = require("express");
const router = express.Router();
const admin_routes = require("./admin_routes");
const common_routes = require("./common_routes");
const user_routes = require("./user_routes");
const booking_routes = require("./booking_routes");
const review_routes = require("./review_routes")
router.use("/admin", admin_routes);
router.use("/common", common_routes);
router.use("/user", user_routes);
router.use("/booking", booking_routes);
router.use("/review", review_routes)
module.exports = router;
