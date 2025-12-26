const InvoiceService = require('../services/InvoiceService');
module.exports = {
    findByPage: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const data = await InvoiceService.findByPagination(page, limit);
        return res.status(200).json(data);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    },
  create: async (req, res) => {
    try {
      const newInvoice = await InvoiceService.create(req.body);
      res.status(201).json(newInvoice);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const allInvoice = await InvoiceService.findAll();
      res.status(200).json(allInvoice);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const getInvoiceById = await InvoiceService.findById(req.params.id);
      res.status(200).json(getInvoiceById);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const updatedInvoice = await InvoiceService.update(req.params.id, req.body);
      res.status(200).json(updatedInvoice);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await InvoiceService.delete(req.params.id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};