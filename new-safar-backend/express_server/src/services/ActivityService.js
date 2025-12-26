
const Activity = require('../models/library/Activity');
class ActivityService {
  async create(data) { return await Activity.create(data); }
  async findAll() { return await Activity.find({delete : false}); }
  async findById(id) { return await Activity.findOne({_id : id , delete : false}); }
  async update(id,data) { return await Activity.findByIdAndUpdate(id,data,{new:true}); }
  async delete(id) {

    return await Activity.findByIdAndUpdate(id , {delete : true} , {new : true})

     
  }
  async findByPagination(page , limit) { 
    const skip = (page - 1)* limit;
   const data = await Activity.find({delete : false}).skip(skip).limit(limit)
   const total = await Activity.countDocuments();

   return {
    data,
    page,
    limit,
    totalPages : Math.ceil(total/limit),
    totalRecords : total
   }

  }
}
module.exports = new ActivityService();
