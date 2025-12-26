const ItineraryService = require("../services/ItineraryService");
module.exports = {
    findByPage: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const data = await ItineraryService.findByPagination(page, limit);
        return res.status(200).json(data);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    },
  create: async (req, res) => {
    try {
      const newItinerary = await ItineraryService.create(req.body);
      res.status(201).json(newItinerary);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const allItinerary = await ItineraryService.findAll();

      res.status(200).json(allItinerary);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getOne: async (req, res) => {
    try{
    const getItineraryById = await ItineraryService.findById(req.params.id);
  
    res.status(200).json(getItineraryById);
    }catch(err){
        res.status(500).json({message : err.message});
    }
  },

  update: async (req, res) => {
    try{
      const updatedItinerary = await ItineraryService.update(req.params.id , req.body);
    
      res.status(200).json(updatedItinerary);
    }catch(err){
      res.status(500).json({message : err.message});
    }

  },
  delete: async (req, res) => {
    try{
      await ItineraryService.delete(req.params.id);

     res.status(200).json({message : "Deleted successfully"});

    }catch(err){
      res.status(500).json({message : err.message});
    }
  },
};
