const express = require("express")
const router = express.Router();
const googleapi = require('../controllers/GoogleController')

router.get('/' , googleapi.getGoogleReviews);


module.exports = router;