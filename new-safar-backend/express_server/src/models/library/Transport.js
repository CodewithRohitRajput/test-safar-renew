const mongoose = require('mongoose');

const TransportSchema = new mongoose.Schema({
  vehicleType: { type: String, required: true },
  vehicleNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  priceType: { 
    type: String, 
    enum: ['Per Tour', 'Per Km', 'Per Day'], 
    required: true 
  },
  routes: String, 
  vendorName: { type: String, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorLocation: String, 
  contact: { type: String, required: true },
  rating: { type: Number, min: 1, max: 10 },
  lastUpdated: { type: Date, default: Date.now },
  availability: { 
    type: String, 
    enum: ['available', 'booked', 'maintenance', 'unavailable'], 
    default: 'available' 
  },
  features: [String],
  insuranceDetails: String,
  licenseNumber: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

TransportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Transport', TransportSchema);