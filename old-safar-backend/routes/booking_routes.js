const express = require("express");
const router = express.Router();
const BookingController = require("../src/controllers/booking_controller");

router.post("/new-booking", BookingController.AddBooking);
router.post("/success", BookingController.bookingSuccess);
router.get("/success", BookingController.bookingSuccess);  
router.post("/failure", BookingController.bookingFailed);
router.get("/failure", BookingController.bookingFailed);  
module.exports = router;