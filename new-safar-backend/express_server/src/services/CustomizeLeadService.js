
const CustomizeLead = require('../models/leads/CustomizeLead');
class CustomizeLeadService {
  async create(data) { return await CustomizeLead.create(data); }
  async findAll() { return await CustomizeLead.find({ delete: false }); }
  async findById(id) { return await CustomizeLead.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await CustomizeLead.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await CustomizeLead.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await CustomizeLead.find({ delete: false }).skip(skip).limit(limit);
    const total = await CustomizeLead.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new CustomizeLeadService();
