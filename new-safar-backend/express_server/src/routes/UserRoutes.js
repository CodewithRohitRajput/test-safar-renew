const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Public user routes - no authentication required
router.get('/banner', UserController.getHomeBanners);
router.put('/banner', UserController.updateBannerClickCount);
router.get('/offer', UserController.getOfferHeadline);
router.get('/trending', UserController.getTrendingItineraries);
router.get('/home_catgories', UserController.getHomeCategories);
router.get('/get_gallery', UserController.getGalleryImages);
router.get('/terms_and_conditions', UserController.getTermsAndConditions);
router.get('/categories/:route', UserController.getCategoryByRoute); // ADD THIS

module.exports = router;