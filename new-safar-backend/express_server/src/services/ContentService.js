
const Content = require('../models/website/Content');
class ContentService {
  async create(data) { return await Content.create(data); }
  async findAll() { return await Content.find({ delete: false }); }
  async findById(id) { return await Content.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await Content.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await Content.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Content.find({ delete: false }).skip(skip).limit(limit);
    const total = await Content.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new ContentService();
