const mongoose = require('mongoose');

const LocalSupportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  location: { type: String, required: true },
  supportType: { 
    type: String, 
    enum: ['Guide', 'Driver', 'Translator', 'Helper', 'Other'], 
    required: true 
  },
  rating: { type: Number, min: 1, max: 10 },
  email: String,
  languages: [String],
  experience: Number, // in years
  availability: { 
    type: String, 
    enum: ['available', 'busy', 'unavailable'], 
    default: 'available' 
  },
  hourlyRate: Number,
  dailyRate: Number,
  specialties: [String],
  imageUrl: String,
  address: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

LocalSupportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('LocalSupport', LocalSupportSchema);