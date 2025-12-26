
const Ledger = require('../models/sales/Ledger');
class LedgerService {
  async create(data) { return await Ledger.create(data); }
  async findAll() { return await Ledger.find({ delete: false }); }
  async findById(id) { return await Ledger.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await Ledger.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await Ledger.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Ledger.find({ delete: false }).skip(skip).limit(limit);
    const total = await Ledger.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new LedgerService();
