const Itinerary = require('../models/website/Itinerary');

class ItineraryService {
  async create(data) { return await Itinerary.create(data); }
  
  async findAll() { 
    return await Itinerary.find({ delete: false })
      .populate('categories', 'name image')
      .populate('travelLocation', 'name image');
  }
  
  async findById(id) { 
    return await Itinerary.findOne({ _id: id, delete: false })
      .populate('categories', 'name image')
      .populate('travelLocation', 'name image');
  }
  
  async update(id, data) { 
    return await Itinerary.findByIdAndUpdate(id, data, { new: true })
      .populate('categories', 'name image')
      .populate('travelLocation', 'name image');
  }
  
  async delete(id) { 
    return await Itinerary.findByIdAndUpdate(id, { delete: true }, { new: true }); 
  }
  
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Itinerary.find({ delete: false })
      .populate('categories', 'name image')
      .populate('travelLocation', 'name image')
      .skip(skip)
      .limit(limit);
    const total = await Itinerary.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }

  // Add search method
  async search({ query, city, category }) {
    const searchQuery = { delete: false, status: 'Active' };
    
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (city) {
      searchQuery.city = { $regex: city, $options: 'i' };
    }
    
    if (category) {
      searchQuery.categories = category;
    }
    
    return await Itinerary.find(searchQuery)
      .populate('categories', 'name image')
      .populate('travelLocation', 'name image');
  }
}

module.exports = new ItineraryService();