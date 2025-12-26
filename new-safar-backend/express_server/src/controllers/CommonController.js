const CategoryService = require('../services/CategoryService');
const ItineraryService = require('../services/ItineraryService');
const LocationService = require('../services/LocationService');

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
    travelLocation: itiObj.travelLocation || null,
    altitude: itiObj.altitude || '',
    scenery: itiObj.scenary || itiObj.scenery || '',
    cultural_sites: itiObj.culturalSite || itiObj.cultural_sites || '',
    day_details: itiObj.daywiseActivities || [],
    hotels: itiObj.hotelDetails || [],
    base_packages: itiObj.packages?.basePackages || [],
    pickup_point: itiObj.packages?.pickupPoint || [],
    drop_point: itiObj.packages?.dropPoint || [],
    batches: itiObj.batches || [],
    inclusions: itiObj.inclusions || [],
    exclusions: itiObj.exclusions || []
  };
};

module.exports = {
  // Get all categories (public)
  getAllCategories: async (req, res) => {
    try {
      const categories = await CategoryService.findAll();
      res.status(200).json({
        success: true,
        data: { categories },
        message: "CATEGORIES_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get category by ID
  getCategoryById: async (req, res) => {
    try {
      const category = await CategoryService.findById(req.params.id);
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
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get all itineraries (public)
  getAllItineraries: async (req, res) => {
    try {
      const itineraries = await ItineraryService.findAll();
      const transformed = itineraries.map(transformItinerary);
      res.status(200).json({
        success: true,
        data: transformed,
        message: "ITINERARIES_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get itinerary by ID
  getItineraryById: async (req, res) => {
    try {
      const itinerary = await ItineraryService.findById(req.params.id);
      if (!itinerary) {
        return res.status(404).json({
          success: false,
          message: "ITINERARY_NOT_FOUND"
        });
      }
      res.status(200).json({
        success: true,
        data: transformItinerary(itinerary),
        message: "ITINERARY_FOUND"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get all locations (public)
  getAllLocations: async (req, res) => {
    try {
      const locations = await LocationService.findAll();
      res.status(200).json({
        success: true,
        data: locations,
        message: "LOCATIONS_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get location by ID
  getLocationById: async (req, res) => {
    try {
      const location = await LocationService.findById(req.params.id);
      if (!location) {
        return res.status(404).json({
          success: false,
          message: "LOCATION_NOT_FOUND"
        });
      }
      res.status(200).json({
        success: true,
        data: location,
        message: "LOCATION_FOUND"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Search itineraries
  searchItineraries: async (req, res) => {
    try {
      const { query, city, category } = req.query;
      const results = await ItineraryService.search({ query, city, category });
      const transformed = results.map(transformItinerary);
      res.status(200).json({
        success: true,
        data: transformed,
        message: "SEARCH_RESULTS_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getHomeCategories: async (req, res) => {
    try {
      const categories = await CategoryService.findAll();
      const homeCategories = categories
        .filter(cat => cat.status === 'active' && !cat.delete)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .slice(0, 6);
      
      res.status(200).json({
        success: true,
        data: homeCategories,
        message: "CATEGORIES_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getHeroSlides: async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        data: [],
        message: "HERO_SLIDES_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getHeroItinerary: async (req, res) => {
    try {
      const itineraries = await ItineraryService.findAll();
      const heroItinerary = itineraries.find(iti => 
        iti.status === 'Active' && !iti.delete
      );
      
      res.status(200).json({
        success: true,
        data: heroItinerary ? transformItinerary(heroItinerary) : null,
        message: heroItinerary ? "HERO_ITINERARY_FETCHED" : "NO_HERO_ITINERARY"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getNavCategories: async (req, res) => {
    try {
      const categories = await CategoryService.findAll();
      const navCategories = categories
        .filter(cat => cat.status === 'active' && !cat.delete)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      res.status(200).json({
        success: true,
        data: { categories: navCategories },
        message: "CATEGORIES_FETCHED"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};