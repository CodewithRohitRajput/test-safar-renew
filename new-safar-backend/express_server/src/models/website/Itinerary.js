const mongoose = require('mongoose');

const DaywiseActivitySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  activities: [String],
  meals: [String],
  accommodation: String,
});

const HotelDetailSchema = new mongoose.Schema({
  // hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  hotelName: String,
  checkIn: String,
  checkOut: String,
  nights: Number,
});

const PackageSchema = new mongoose.Schema({
  packageType: { type: String, enum: ['base', 'pickup', 'drop'], required: true },
  name: String,
  price: Number,
  inclusions: [String],
  exclusions: [String],
});

const BatchSchema = new mongoose.Schema({
  batchName: String,
  startDate: Date,
  endDate: Date,
  price: Number,
  availableSeats: Number,
  bookedSeats: { type: Number, default: 0 },
});

const SEOFieldsSchema = new mongoose.Schema({
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  ogTitle: String,
  ogDescription: String,
  ogImage: String,
});

const ItinerarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  priceDisplay: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  trending: { type: String, enum: ['Yes', 'No'], default: 'No' },
  travelLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  images: [String],
  description: String, 
  shortDescription: String, 
  altitude: String, 
  scenary: String, 
  culturalSite: String, 
  brochureBanner: String, 
  isCustomize: { 
    type: String, 
    enum: ['not_specified', 'true', 'false'], 
    default: 'not_specified' 
  }, // Is customizable?
  notes: String,
  daywiseActivities: [DaywiseActivitySchema],
  hotelDetails: [HotelDetailSchema],
  packages: {
    basePackages: [PackageSchema],
    pickupPoint: [PackageSchema],
    dropPoint: [PackageSchema],
  },
  batches: [BatchSchema],
  seoFields: SEOFieldsSchema,
  duration: String, // e.g., "3D 2N"
  inclusions: [String],
  exclusions: [String],
  termsAndConditions: String,
  cancellationPolicy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

ItinerarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);