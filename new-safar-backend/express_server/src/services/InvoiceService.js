
const Invoice = require('../models/sales/Invoice');
class InvoiceService {
  async create(data) { return await Invoice.create(data); }
  async findAll() { return await Invoice.find({ delete: false }); }
  async findById(id) { return await Invoice.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await Invoice.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await Invoice.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Invoice.find({ delete: false }).skip(skip).limit(limit);
    const total = await Invoice.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new InvoiceService();
