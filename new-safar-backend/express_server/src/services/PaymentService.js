
const Payment = require('../models/sales/Payment');
class PaymentService {
  async create(data) { return await Payment.create(data); }
  async findAll() { return await Payment.find({ delete: false }); }
  async findById(id) { return await Payment.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await Payment.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await Payment.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Payment.find({ delete: false }).skip(skip).limit(limit);
    const total = await Payment.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new PaymentService();
