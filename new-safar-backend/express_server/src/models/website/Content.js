const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  offerName: { type: String, required: true },
  categoryName: { type: String, required: true },
  expiredDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  imageUrl: String,
  images: [String],
  headlines: String,
  termsCondition: String,
  cancellationPolicy: String,
  description: String,
  discountPercentage: Number,
  discountAmount: Number,
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  applicableLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

ContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Content', ContentSchema);