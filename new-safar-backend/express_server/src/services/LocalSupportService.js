
const LocalSupport = require('../models/library/LocalSupport');
class LocalSupportService {
  async create(data) { return await LocalSupport.create(data); }
  async findAll() { return await LocalSupport.find({ delete: false }); }
  async findById(id) { return await LocalSupport.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await LocalSupport.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await LocalSupport.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await LocalSupport.find({ delete: false }).skip(skip).limit(limit);
    const total = await LocalSupport.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new LocalSupportService();
