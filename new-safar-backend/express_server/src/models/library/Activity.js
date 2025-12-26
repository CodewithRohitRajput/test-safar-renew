const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: Number, required: true }, // in hours
  price: { type: Number, required: true }, // in rupees
  shortDescription: String,
  fullDescription: String,
  category: { 
    type: String, 
    enum: ['adventure', 'sightseeing', 'water_sports', 'cultural', 'wildlife', 'other'] 
  },
  images: [String],
  inclusions: [String],
  exclusions: [String],
  ageRestriction: {
    minAge: Number,
    maxAge: Number,
  },
  difficultyLevel: { 
    type: String, 
    enum: ['easy', 'medium', 'hard', 'extreme'] 
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

ActivitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Activity', ActivitySchema);