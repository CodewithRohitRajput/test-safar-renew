const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Approved', 'Pending', 'Rejected'], 
    default: 'Pending' 
  },
  packageName: String,
  packageCode: String,
  reviewerImageUrl: String,
  itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

ReviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);