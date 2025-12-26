const BookingService = require('../services/BookingService');
module.exports = {
  findByPage : async (req , res) => {
    try{
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const data = await BookingService.findByPagination(page , limit);
      return res.status(200).json(data)
    }catch(err){
      return res.status(500).json({message : err.message})
    }
  },
  create: async (req, res) => {
    try {
      const newBooking = await BookingService.create(req.body);
      res.status(201).json(newBooking);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const allBooking = await BookingService.findAll();
      res.status(200).json(allBooking);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const getBookingById = await BookingService.findById(req.params.id);
      res.status(200).json(getBookingById);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const updatedBooking = await BookingService.update(req.params.id, req.body);
      res.status(200).json(updatedBooking);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await BookingService.delete(req.params.id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};