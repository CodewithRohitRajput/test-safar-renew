const ReviewController = require("../src/controllers/review_controller");
const { authorizeAdmin, SuperAdminMiddleware } = require("../middlewares/token.middleware");
const express = require("express");
const router = express.Router();

// Create new review
router.post(
  "/",
  ReviewController.AddReview
);

// Get all reviews
router.get(
  "/",
  ReviewController.GetReviews
);

// Get review by ID
router.get(
  "/:id",
  ReviewController.GetReviews
);

// Update review
router.put(
  "/:id",
  ReviewController.UpdateReview
);

// Delete review
router.delete(
  "/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  ReviewController.DeleteReview
);

// Get reviews by itinerary
router.get(
  "/itinerary/:itineraryId",
  ReviewController.GetReviews
);

// Add this new route for assigning review to itinerary
router.post(
  "/assign/:itineraryId",
  ReviewController.AssignReviewToItinerary
);

//Add route for removing review from itinerary
router.delete(
  "/remove/:reviewId",
  ReviewController.RemoveReviewFromItinerary
);

// Toggle review approval status
// router.patch(
//   "/toggle-approval/:id",
//   authorizeAdmin,
//   ReviewController.ToggleReviewApproval
// );

module.exports = router;
