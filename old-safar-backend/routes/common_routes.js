const express = require("express");
const router = express.Router();
const CommonController = require("../src/controllers/common_controller");

router.get("/categories", CommonController.GetAllCategories);
router.get("/categories/:id", CommonController.GetCategoryById);
router.get("/itineraries/suggestions", CommonController.GetItinerarySuggestions);
router.get("/itineraries", CommonController.GetAllItineraries);
router.get("/itineraries/search", CommonController.SearchItinerariesByNameAndCity);
router.get("/itineraries/:id", CommonController.GetItineraryById);
router.get("/search", CommonController.SearchItineraries);
router.get("/home_catgories", CommonController.GetHomeCategories);
router.get("/hero_itinerary", CommonController.GetHomeItin);
router.get("/nav_categories", CommonController.GetNavCatgeories);
router.get("/cancellation_policies", CommonController.GetCanellationPolicies);
router.post("/custom-callback", CommonController.handleCustomCallbackRequest);
router.get("/hero_slides", CommonController.GetHeroSlides);



module.exports = router;
