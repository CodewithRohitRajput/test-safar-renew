
const Coordinator = require('../models/library/Coordinator');
class CoordinatorService {
  async create(data) { return await Coordinator.create(data); }
  async findAll() { return await Coordinator.find({ delete: false }); }
  async findById(id) { return await Coordinator.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await Coordinator.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await Coordinator.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Coordinator.find({ delete: false }).skip(skip).limit(limit);
    const total = await Coordinator.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new CoordinatorService();
