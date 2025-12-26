
const Transport = require('../models/library/Transport');
class TransportService {
  async create(data) { return await Transport.create(data); }
  async findAll() { return await Transport.find({ delete: false }); }
  async findById(id) { return await Transport.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await Transport.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await Transport.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Transport.find({ delete: false }).skip(skip).limit(limit);
    const total = await Transport.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new TransportService();
