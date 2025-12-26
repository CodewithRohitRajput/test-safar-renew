const CategoryService = require('../services/CategoryService');
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
        const data = await CategoryService.findByPagination(page, limit);
        return res.status(200).json(data);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    },
    
  create: async (req, res) => {
    try {
      const categoryData = req.body;
      
      // Handle main image
      if (req.files && req.files.image && req.files.image[0]) {
        categoryData.image = {
          data: req.files.image[0].buffer,
          contentType: req.files.image[0].mimetype
        };
      }
      
      // Handle feature images
      if (req.files && req.files.feature_images) {
        categoryData.feature_images = req.files.feature_images.map(file => ({
          data: file.buffer,
          contentType: file.mimetype
        }));
      }
      
      const newCategory = await CategoryService.create(categoryData);
      res.status(201).json(newCategory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const allCategory = await CategoryService.findAll();
      res.status(200).json(allCategory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const getCategoryById = await CategoryService.findById(req.params.id);
      res.status(200).json(getCategoryById);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const categoryData = req.body;
      
      // Handle main image if uploaded
      if (req.files && req.files.image && req.files.image[0]) {
        categoryData.image = {
          data: req.files.image[0].buffer,
          contentType: req.files.image[0].mimetype
        };
      }
      
      // Handle feature images if uploaded
      if (req.files && req.files.feature_images) {
        categoryData.feature_images = req.files.feature_images.map(file => ({
          data: file.buffer,
          contentType: file.mimetype
        }));
      }
      
      const updatedCategory = await CategoryService.update(req.params.id, categoryData);
      res.status(200).json(updatedCategory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await CategoryService.delete(req.params.id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get main image
  getImage: async (req, res) => {
    try {
      const category = await CategoryService.findByIdRaw(req.params.id);
      if (!category || !category.image || !category.image.data) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.set({
        'Content-Type': category.image.contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Credentials': 'true'
      });
      res.send(category.image.data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get feature image by index
  getFeatureImage: async (req, res) => {
    try {
      const category = await CategoryService.findByIdRaw(req.params.id);
      const index = parseInt(req.params.index);
      
      if (!category || !category.feature_images || !category.feature_images[index]) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.set({
        'Content-Type': category.feature_images[index].contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Credentials': 'true'
      });
      res.send(category.feature_images[index].data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};