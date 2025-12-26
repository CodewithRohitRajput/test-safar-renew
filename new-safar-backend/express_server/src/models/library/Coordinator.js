const mongoose = require('mongoose');

const CoordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialties: [String],
  bio: String,
  languages: [String],
  experience: Number, // in years
  rating: { type: Number, min: 1, max: 5 },
  location: String,
  availability: { 
    type: String, 
    enum: ['available', 'busy', 'unavailable'], 
    default: 'available' 
  },
  imageUrl: String,
  certifications: [String],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

CoordinatorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Coordinator', CoordinatorSchema);