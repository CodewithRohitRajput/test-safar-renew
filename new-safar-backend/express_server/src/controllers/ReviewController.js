const ReviewService = require('../services/ReviewService');

// Helper function to transform review data to match frontend format
const transformReview = (review) => {
  if (!review) return null;
  
  const reviewObj = review.toObject ? review.toObject() : review;
  
  return {
    id: reviewObj._id?.toString() || reviewObj.id,
    reviewer_name: reviewObj.customerName || reviewObj.reviewer_name || '',
    text: reviewObj.reviewText || reviewObj.text || '',
    rating: reviewObj.rating || 0,
    reviewer_image: reviewObj.reviewerImageUrl || reviewObj.reviewer_image || null,
    itineraryId: reviewObj.itineraryId || reviewObj.itinerary_id || null,
    itinerary: reviewObj.itineraryId ? {
      title: reviewObj.itineraryId.name || reviewObj.itineraryId.title,
      view_images: reviewObj.itineraryId.images || [],
      route_map: reviewObj.itineraryId.route_map || null
    } : null,
    date: reviewObj.date || reviewObj.createdAt,
    status: reviewObj.status || 'Pending'
  };
};

module.exports = {
  findByPage: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const data = await ReviewService.findByPagination(page, limit);
      return res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const newReview = await ReviewService.create(req.body);
      res.status(201).json(newReview);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const { isLandingPage, itineraryId, limit = 6, page = 1 } = req.query;
      
      let reviews;
      if (itineraryId) {
        reviews = await ReviewService.findByItineraryId(itineraryId, { limit, page });
      } else if (isLandingPage === 'true') {
        reviews = await ReviewService.findLandingPageReviews({ limit, page });
      } else {
        reviews = await ReviewService.findAll({ limit, page });
      }
      
      // Transform reviews to match frontend format
      const transformedReviews = Array.isArray(reviews) 
        ? reviews.map(transformReview)
        : [];
      
      res.status(200).json({
        success: true,
        data: { reviews: transformedReviews },
        message: "REVIEWS_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const getReviewById = await ReviewService.findById(req.params.id);
      res.status(200).json(transformReview(getReviewById));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const updatedReview = await ReviewService.update(req.params.id, req.body);
      res.status(200).json(transformReview(updatedReview));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await ReviewService.delete(req.params.id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};