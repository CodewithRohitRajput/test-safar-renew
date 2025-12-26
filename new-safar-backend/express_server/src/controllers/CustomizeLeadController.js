const CustomizeLeadService = require('../services/CustomizeLeadService');
module.exports = {
    findByPage: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const data = await CustomizeLeadService.findByPagination(page, limit);
        return res.status(200).json(data);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    },
  create: async (req, res) => {
    try {
      const newCustomizeLead = await CustomizeLeadService.create(req.body);
      res.status(201).json(newCustomizeLead);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const allCustomizeLead = await CustomizeLeadService.findAll();
      res.status(200).json(allCustomizeLead);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const getCustomizeLeadById = await CustomizeLeadService.findById(req.params.id);
      res.status(200).json(getCustomizeLeadById);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const updatedCustomizeLead = await CustomizeLeadService.update(req.params.id, req.body);
      res.status(200).json(updatedCustomizeLead);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await CustomizeLeadService.delete(req.params.id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};