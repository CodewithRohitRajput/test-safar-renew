
const LedgerService = require('../services/LedgerService');
module.exports = {
    findByPage: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const data = await LedgerService.findByPagination(page, limit);
        return res.status(200).json(data);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    },
  create: async (req,res)=>{ 
    try{
      const newLedger = await LedgerService.create(req.body)
    res.status(200).json(newLedger);
    }catch(err){
      res.status(500).json({message : err.message});
    }

  
  },

  getAll: async (req,res)=>{
      try{
        const getAllLedger = await LedgerService.findAll();
          res.status(200).json(getAllLedger);
      }catch(err){
        res.status(500).json({message : err.message})      }
  
  },
  getOne : async ( req , res) => {
    try{

    const getLedgerbyId = await LedgerService.findById(req.params.id);
    res.status(200).json(getLedgerbyId); 
    }catch(err){
      res.status(500).json({message : err.message})
    }

  },
  update: async (req,res)=>{
    try{
      const updatedLedger = await LedgerService.update(req.params.id , req.body);
      res.status(200).json(updatedLedger);
    }catch(err){
      res.status(500).json({message : err.message});
    }
  
  },
  delete: async (req,res)=>{
    
    try{
      await LedgerService.delete(req.params.id);
      res.status(200).json({message : "Successfully deleted"});
    }catch(err){
      res.status(500).json({message : err.message});
    }  
  },
};
