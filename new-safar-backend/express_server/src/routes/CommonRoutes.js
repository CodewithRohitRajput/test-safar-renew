const express = require('express');
const router = express.Router();
const CommonController = require('../controllers/CommonController');

// Public routes - no authentication required
router.get('/categories', CommonController.getAllCategories);
router.get('/categories/:id', CommonController.getCategoryById);
router.get('/itineraries', CommonController.getAllItineraries);
router.get('/itineraries/:id', CommonController.getItineraryById);
router.get('/locations', CommonController.getAllLocations);
router.get('/locations/:id', CommonController.getLocationById);
router.get('/search', CommonController.searchItineraries);
router.get('/home_catgories', CommonController.getHomeCategories); // ADD THIS
router.get('/hero_slides', CommonController.getHeroSlides); // ADD THIS
router.get('/hero_itinerary', CommonController.getHeroItinerary); // ADD THIS
router.get('/nav_categories', CommonController.getNavCategories); // ADD THIS

module.exports = router;