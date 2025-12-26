const express = require("express");
const router = express.Router();
const UserController = require("../src/controllers/user_controller");

router.post("/request", UserController.AddCustomizeRequest);
router.put("/banner", UserController.UpdateClickCount);
router.get("/home_catgories", UserController.GetHomeCategories);
router.get("/banner", UserController.GetHomeBanners);
router.get("/trending", UserController.GetTrendingItineraries);
router.get("/offer", UserController.GetOfferHeadline);
router.get("/terms_and_conditions", UserController.GetTermsConditions);
router.get("/get_gallery", UserController.GetGalleryImages);
router.post("/callback_request", UserController.AddCallBackRequest);
router.get("/get_reviews", UserController.FetchGoogleReviews);
router.get("/itineraries/:route", UserController.GetItineraryByRoute);
router.get("/categories/:route", UserController.GetCategoryByRoute);
router.get("/instalink", UserController.GetInstaLinkData);
router.post("/instalink-enquiry", UserController.AddInstalinkEnquiry);
module.exports = router;
