
const index = require('../models/index');
class indexService {
  async create(data) { return await index.create(data); }
  async findAll() { return await index.find({ delete: false }); }
  async findById(id) { return await index.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await index.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await index.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await index.find({ delete: false }).skip(skip).limit(limit);
    const total = await index.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new indexService();
