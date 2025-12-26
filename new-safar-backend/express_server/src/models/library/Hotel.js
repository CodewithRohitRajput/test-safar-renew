const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, default: 'India' },
  rating: { type: Number, min: 1, max: 5 },
  phone: String,
  contactEmail: String,
  contactPhone: String,
  websiteUrl: String,
  amenities: [String],
  imageUrls: [String],
  checkInTime: String,
  checkOutTime: String,
  priceRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' },
  },
  roomTypes: [{
    type: String,
    price: Number,
    capacity: Number,
  }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

HotelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Hotel', HotelSchema);