
const Category = require('../models/website/Category');

// Helper to transform category data with image URLs
const transformCategoryData = (category) => {
  if (!category) return null;
  
  const categoryObj = category.toObject ? category.toObject() : category;
  
  // Replace image data with URL
  if (categoryObj.image && categoryObj.image.data) {
    categoryObj.image = `/api/category/${categoryObj._id}/image`;
  }
  
  // Replace feature images data with URLs
  if (categoryObj.feature_images && Array.isArray(categoryObj.feature_images)) {
    categoryObj.feature_images = categoryObj.feature_images.map((img, index) => 
      img.data ? `/api/category/${categoryObj._id}/feature-image/${index}` : img
    );
  }
  
  return categoryObj;
};

class CategoryService {
  async create(data) { 
    const category = await Category.create(data);
    return transformCategoryData(category);
  }
  
  async findAll() { 
    const categories = await Category.find({ delete: false });
    return categories.map(transformCategoryData);
  }
  
  async findById(id) { 
    const category = await Category.findOne({ _id: id, delete: false });
    return transformCategoryData(category);
  }
  
  // Get raw data without transformation (for image retrieval)
  async findByIdRaw(id) {
    return await Category.findOne({ _id: id, delete: false });
  }
  
  async update(id, data) { 
    const category = await Category.findByIdAndUpdate(id, data, {new: true});
    return transformCategoryData(category);
  }
  
  async delete(id) { 
    const category = await Category.findByIdAndUpdate(id, { delete: true }, { new: true });
    return transformCategoryData(category);
  }
  
  async findByPagination(page, limit) {
    const skip = (page - 1) * limit;
    const data = await Category.find({ delete: false }).skip(skip).limit(limit);
    const total = await Category.countDocuments({ delete: false });
    return {
      data: data.map(transformCategoryData),
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    };
  }
}
module.exports = new CategoryService();
