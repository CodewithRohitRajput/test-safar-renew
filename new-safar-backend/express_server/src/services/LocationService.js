
const Location = require('../models/website/Location');

// Helper to transform location data with image URLs
const transformLocationData = (location) => {
  if (!location) return null;
  
  const locationObj = location.toObject ? location.toObject() : location;
  
  // Replace image data with URL
  if (locationObj.image && locationObj.image.data) {
    locationObj.image = `/api/location/${locationObj._id}/image`;
  }
  
  // Replace feature images data with URLs
  if (locationObj.feature_images && Array.isArray(locationObj.feature_images)) {
    locationObj.feature_images = locationObj.feature_images.map((img, index) => 
      img.data ? `/api/location/${locationObj._id}/feature-image/${index}` : img
    );
  }
  
  return locationObj;
};

class LocationService {
  async create(data) { 
    const location = await Location.create(data);
    return transformLocationData(location);
  }
  
  async findAll() { 
    const locations = await Location.find({ delete: false });
    return locations.map(transformLocationData);
  }
  
  async findById(id) { 
    const location = await Location.findOne({ _id: id, delete: false });
    return transformLocationData(location);
  }
  
  // Get raw data without transformation (for image retrieval)
  async findByIdRaw(id) {
    return await Location.findOne({ _id: id, delete: false });
  }
  
  async update(id, data) { 
    const location = await Location.findByIdAndUpdate(id, data, {new: true});
    return transformLocationData(location);
  }
  
  async delete(id) { 
    const location = await Location.findByIdAndUpdate(id, { delete: true }, { new: true });
    return transformLocationData(location);
  }
  
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Location.find({ delete: false }).skip(skip).limit(limit);
    const total = await Location.countDocuments({ delete: false });
    return {
      data: data.map(transformLocationData),
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new LocationService();
