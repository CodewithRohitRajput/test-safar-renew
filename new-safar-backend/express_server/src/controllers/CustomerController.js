const CustomerService = require('../services/CustomerService');

class CustomerController {
  async create(req, res) {
    try {
      const customer = await CustomerService.create(req.body);
      res.status(201).json({ success: true, data: customer });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const customers = await CustomerService.findAll();
      res.status(200).json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const customer = await CustomerService.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      res.status(200).json({ success: true, data: customer });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const customer = await CustomerService.update(req.params.id, req.body);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      res.status(200).json({ success: true, data: customer });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const customer = await CustomerService.delete(req.params.id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByPagination(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await CustomerService.findByPagination(page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByBookingId(req, res) {
    try {
      const customers = await CustomerService.findByBookingId(req.params.bookingId);
      res.status(200).json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByEmail(req, res) {
    try {
      const customer = await CustomerService.findByEmail(req.params.email);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      res.status(200).json({ success: true, data: customer });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CustomerController();
