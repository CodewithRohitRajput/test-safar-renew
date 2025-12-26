
const Hotel = require('../models/library/Hotel');
class HotelService {
  async create(data) { return await Hotel.create(data); }
  async findAll() { return await Hotel.find({ delete: false }); }
  async findById(id) { return await Hotel.findOne({ _id: id, delete: false }); }
  async update(id,data) { return await Hotel.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) { return await Hotel.findByIdAndUpdate(id, { delete: true }, { new: true }); }
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Hotel.find({ delete: false }).skip(skip).limit(limit);
    const total = await Hotel.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new HotelService();
