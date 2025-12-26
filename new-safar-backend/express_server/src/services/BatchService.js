const Batch = require('../models/library/Batch');
class BatchService {
  async create(data) { return await Batch.create(data); }
  async findAll() { return await Batch.find({ delete: false }).populate('itineraryId'); }
  async findById(id) { return await Batch.findOne({ _id: id, delete: false }).populate('itineraryId'); }
  async update(id,data) { return await Batch.findByIdAndUpdate(id,data,{new:true}).populate('itineraryId'); }
  async delete(id) {
    return await Batch.findByIdAndUpdate(id, { delete: true }, { new: true });
  }
  async findByPagination(page , limit) { 
    const skip = (page - 1)* limit;
   const data = await Batch.find({ delete: false }).populate('itineraryId').skip(skip).limit(limit)
   const total = await Batch.countDocuments({ delete: false });

   return {
    data,
    page,
    limit,
    totalPages : Math.ceil(total/limit),
    totalRecords : total
   }

  }
}
module.exports = new BatchService();
