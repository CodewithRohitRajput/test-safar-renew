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

const LocationSchema = new mongoose.Schema({
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
 itineraries: [{ type: mongoose.Schema.Types.ObjectId, ref: "itinerary" }], // Changed to array
  description: String, 
  state: String,
  country: { type: String, default: 'India' },
  seo_fields: SEOFieldsSchema, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

LocationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  // If feature_images array has items, use first one as main image for backward compatibility
  if (this.feature_images && this.feature_images.length > 0 && !this.image.data) {
    this.image = this.feature_images[0];
  }
  // Merge description into long_description if long_description is empty
  if (this.description && !this.long_description) {
    this.long_description = this.description;
  }
  next();
});

module.exports = mongoose.model('Location', LocationSchema);