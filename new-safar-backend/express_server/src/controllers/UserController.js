const ContentService = require('../services/ContentService');
const ItineraryService = require('../services/ItineraryService');
const CategoryService = require('../services/CategoryService');

// Helper function to transform itinerary data to match frontend format
const transformItinerary = (itinerary) => {
  if (!itinerary) return null;
  
  const itiObj = itinerary.toObject ? itinerary.toObject() : itinerary;
  
  return {
    id: itiObj._id?.toString() || itiObj.id,
    title: itiObj.name || itiObj.title,
    name: itiObj.name || itiObj.title,
    description: itiObj.description || '',
    shortDescription: itiObj.shortDescription || itiObj.description || '',
    city: itiObj.city || '',
    startingPrice: itiObj.price || itiObj.startingPrice || 0,
    price: itiObj.price || 0,
    view_images: itiObj.images || itiObj.view_images || [],
    images: itiObj.images || [],
    duration: itiObj.duration || '',
    route_map: itiObj.route_map || itiObj._id?.toString() || itiObj.id,
    is_trending: itiObj.trending === 'Yes',
    is_active: itiObj.status === 'Active',
    is_customize: itiObj.isCustomize === 'true',
    categories: itiObj.categories || [],
    travelLocation: itiObj.travelLocation || null
  };
};

module.exports = {
  // Get home banners (from Content model where status is active)
  getHomeBanners: async (req, res) => {
    try {
      const contents = await ContentService.findAll();
      // Filter active banners and map to old format
      const banners = contents
        .filter(content => content.status === 'active' && !content.delete)
        .map(content => ({
          id: content._id.toString(),
          image: content.imageUrl || (content.images && content.images[0]) || '',
          title: content.offerName || '',
          category_id: content.applicableCategories && content.applicableCategories[0] ? content.applicableCategories[0].toString() : null,
          category_name: content.categoryName || '',
          route_map: null, // Add if you have this field
          itinerary_id: null, // Add if you have this field
          click_count: content.clicks || 0
        }));
      
      res.status(200).json({
        success: true,
        data: banners,
        message: "BANNERS_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Update banner click count
  updateBannerClickCount: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, message: "Banner ID is required" });
      }
      
      const content = await ContentService.findById(id);
      if (!content) {
        return res.status(404).json({ success: false, message: "Banner not found" });
      }
      
      const updated = await ContentService.update(id, { 
        clicks: (content.clicks || 0) + 1 
      });
      
      res.status(200).json({
        success: true,
        data: updated,
        message: "CLICK_COUNT_UPDATED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get offer headline (from Content model)
  getOfferHeadline: async (req, res) => {
    try {
      const contents = await ContentService.findAll();
      // Get the first active content as offer headline
      const offer = contents.find(content => 
        content.status === 'active' && 
        !content.delete && 
        content.headlines
      );
      
      if (!offer) {
        return res.status(200).json({
          success: false,
          data: null,
          message: "NO_OFFER_FOUND"
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          headlines: offer.headlines,
          offerName: offer.offerName,
          imageUrl: offer.imageUrl
        },
        message: "OFFER_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get trending itineraries
  getTrendingItineraries: async (req, res) => {
    try {
      const itineraries = await ItineraryService.findAll();
      // Filter trending itineraries and transform
      const trending = itineraries
        .filter(iti => 
          iti.trending === 'Yes' && 
          iti.status === 'Active' && 
          !iti.delete
        )
        .slice(0, 10)
        .map(transformItinerary); // Transform the data
      
      res.status(200).json({
        success: true,
        data: trending,
        message: "ITINERARIES_FETCHED"
      });
    } catch (err) {
      console.error('Error in getTrendingItineraries:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get home categories
  getHomeCategories: async (req, res) => {
    try {
      const categories = await CategoryService.findAll();
      // Filter active categories and sort by order
      const homeCategories = categories
        .filter(cat => cat.status === 'active' && !cat.delete)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .slice(0, 6); // Limit to 6 for home page
      
      res.status(200).json({
        success: true,
        data: { categories: homeCategories },
        message: "CATEGORIES_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get gallery images (placeholder - implement based on your gallery model)
  getGalleryImages: async (req, res) => {
    try {
      // TODO: Implement gallery model/service
      // For now, return empty array
      res.status(200).json({
        success: true,
        data: [],
        message: "GALLERY_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get terms and conditions
  getTermsAndConditions: async (req, res) => {
    try {
      const contents = await ContentService.findAll();
      // Get terms from first active content
      const content = contents.find(c => c.status === 'active' && !c.delete);
      
      res.status(200).json({
        success: true,
        data: content ? content.termsCondition : '',
        message: "TERMS_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  // Get category by route/name
  getCategoryByRoute: async (req, res) => {
    try {
      const { route } = req.params;
      
      console.log('getCategoryByRoute called with route:', route);
      
      if (!route) {
        return res.status(400).json({
          success: false,
          message: "Route parameter is required"
        });
      }
      
      let category = null;
      
      // Try to find by _id first (if route is a valid ObjectId)
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(route)) {
        try {
          category = await CategoryService.findById(route);
          console.log('Category found by ID:', category ? 'Yes' : 'No');
        } catch (err) {
          // If findById fails, continue to search by name
          console.log('Category not found by ID, trying name search:', err.message);
        }
      }
      
      // If not found by ID, try to find by name
      if (!category) {
        const categories = await CategoryService.findAll();
        category = categories.find(cat => {
          const catName = cat.name?.toLowerCase() || '';
          const catId = cat._id?.toString() || '';
          const routeLower = route?.toLowerCase() || '';
          return catName === routeLower || catId === route;
        });
        console.log('Category found by name:', category ? 'Yes' : 'No');
      }
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "CATEGORY_NOT_FOUND"
        });
      }
      
      res.status(200).json({
        success: true,
        data: category,
        message: "CATEGORY_FOUND"
      });
    } catch (err) {
      console.error('Error in getCategoryByRoute:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },
};