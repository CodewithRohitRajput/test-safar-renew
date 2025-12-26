const Customer = require('../models/website/Customer');

class CustomerService {
  async create(data) { 
    return await Customer.create(data); 
  }
  
  async findAll() { 
    return await Customer.find({ delete: false }); 
  }
  
  async findById(id) { 
    return await Customer.findOne({ _id: id, delete: false }); 
  }
  
  async update(id, data) { 
    return await Customer.findByIdAndUpdate(id, data, { new: true }); 
  }
  
  async delete(id) {
    return await Customer.findByIdAndUpdate(id, { delete: true }, { new: true });
  }
  
  async findByPagination(page, limit) { 
    const skip = (page - 1) * limit;
    const data = await Customer.find({ delete: false }).skip(skip).limit(limit);
    const total = await Customer.countDocuments({ delete: false });

    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }

  async findByEmail(email) {
    return await Customer.findOne({ email, delete: false });
  }
}

module.exports = new CustomerService();
