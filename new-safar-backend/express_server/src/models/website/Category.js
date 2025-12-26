const mongoose = require('mongoose');

const SEOFieldsSchema = new mongoose.Schema({
  index_status: { 
    type: String, 
    enum: ['index', 'notindex'], 
    default: 'index' 
  },
  seo_title: String,
  seo_description: String,
  seo_keywords: String,
  author: { type: String, default: 'Safarwanderlust' },
}, { _id: false });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { 
    data: Buffer,
    contentType: String
  },
  feature_images: [{
    data: Buffer,
    contentType: String
  }], 
  short_description: String, 
  long_description: String, 
  tripCount: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  seo_fields: SEOFieldsSchema, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (this.feature_images && this.feature_images.length > 0 && !this.image.data) {
    this.image = this.feature_images[0];
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema);