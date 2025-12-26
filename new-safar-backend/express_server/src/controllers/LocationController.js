const LocationService = require('../services/LocationService');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
    upload: upload,
    
    findByPage: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const data = await LocationService.findByPagination(page, limit);
        return res.status(200).json(data);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    },
    
  create: async (req, res) => {
    try {
      const locationData = req.body;
      
      // Handle main image
      if (req.files && req.files.image && req.files.image[0]) {
        locationData.image = {
          data: req.files.image[0].buffer,
          contentType: req.files.image[0].mimetype
        };
      }
      
      // Handle feature images
      if (req.files && req.files.feature_images) {
        locationData.feature_images = req.files.feature_images.map(file => ({
          data: file.buffer,
          contentType: file.mimetype
        }));
      }
      
      const newLocation = await LocationService.create(locationData);
      res.status(201).json(newLocation);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const allLocation = await LocationService.findAll();
      res.status(200).json(allLocation);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const getLocationById = await LocationService.findById(req.params.id);
      res.status(200).json(getLocationById);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const locationData = req.body;
      
      // Handle main image if uploaded
      if (req.files && req.files.image && req.files.image[0]) {
        locationData.image = {
          data: req.files.image[0].buffer,
          contentType: req.files.image[0].mimetype
        };
      }
      
      // Handle feature images if uploaded
      if (req.files && req.files.feature_images) {
        locationData.feature_images = req.files.feature_images.map(file => ({
          data: file.buffer,
          contentType: file.mimetype
        }));
      }
      
      const updatedLocation = await LocationService.update(req.params.id, locationData);
      res.status(200).json(updatedLocation);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await LocationService.delete(req.params.id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get main image
  getImage: async (req, res) => {
    try {
      const location = await LocationService.findByIdRaw(req.params.id);
      if (!location || !location.image || !location.image.data) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.set({
        'Content-Type': location.image.contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Credentials': 'true'
      });
      res.send(location.image.data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get feature image by index
  getFeatureImage: async (req, res) => {
    try {
      const location = await LocationService.findByIdRaw(req.params.id);
      const index = parseInt(req.params.index);
      
      if (!location || !location.feature_images || !location.feature_images[index]) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.set({
        'Content-Type': location.feature_images[index].contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Credentials': 'true'
      });
      res.send(location.feature_images[index].data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};