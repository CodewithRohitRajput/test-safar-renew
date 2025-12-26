
const Lead = require('../models/leads/Lead');
class LeadService {
  async create(data) { return await Lead.create(data); }
  async findAll() { return await Lead.find({ delete: false }); }
  async findById(id) { return await Lead.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await Lead.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await Lead.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Lead.find({ delete: false }).skip(skip).limit(limit);
    const total = await Lead.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new LeadService();
