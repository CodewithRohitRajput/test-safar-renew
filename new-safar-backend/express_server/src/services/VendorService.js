
const Vendor = require('../models/sales/Vendor');
class VendorService {
  async create(data) { return await Vendor.create(data); }
  async findAll() { return await Vendor.find({ delete: false }); }
  async findById(id) { return await Vendor.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await Vendor.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await Vendor.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Vendor.find({ delete: false }).skip(skip).limit(limit);
    const total = await Vendor.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new VendorService();
