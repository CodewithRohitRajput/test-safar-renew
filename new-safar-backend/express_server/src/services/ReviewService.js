const Review = require('../models/website/Review');

class ReviewService {
  async create(data) { 
    return await Review.create(data); 
  }
  
  async findAll(options = {}) { 
    const { limit = 10, page = 1 } = options;
    const skip = (page - 1) * limit;
    return await Review.find({ delete: false })
      .populate('itineraryId', 'name images route_map')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
  }
  
  async findById(id) { 
    return await Review.findOne({ _id: id, delete: false })
      .populate('itineraryId', 'name images route_map');
  }
  
  async findByItineraryId(itineraryId, options = {}) {
    const { limit = 10, page = 1 } = options;
    const skip = (page - 1) * limit;
    return await Review.find({ 
      itineraryId, 
      delete: false,
      status: 'Approved' 
    })
      .populate('itineraryId', 'name images route_map')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
  }
  
  async findLandingPageReviews(options = {}) {
    const { limit = 10, page = 1 } = options;
    const skip = (page - 1) * limit;
    return await Review.find({ 
      delete: false,
      status: 'Approved' 
    })
      .populate('itineraryId', 'name images route_map')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
  }
  
  async update(id, data) { 
    return await Review.findByIdAndUpdate(id, data, { new: true })
      .populate('itineraryId', 'name images route_map');
  }
  
  async delete(id) { 
    return await Review.findByIdAndUpdate(id, { delete: true }, { new: true }); 
  }
  
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Review.find({ delete: false })
      .populate('itineraryId', 'name images route_map')
      .skip(skip)
      .limit(limit);
    const total = await Review.countDocuments({ delete: false });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}

module.exports = new ReviewService();