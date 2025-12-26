const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  badgeType: { 
    type: String, 
    enum: ['instalink', 'website', 'phone', 'walkin', 'referral'], 
    default: 'instalink' 
  },
  leadId: { type: String, unique: true, required: true },
  time: { type: Date, default: Date.now },
  phone: { type: String, required: true },
  email: String,
  destination: String,
  packageCode: String,
  itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
  remarks: String,
  savedRemarks: [String],
  status: { 
    type: String, 
    enum: ['Hot', 'Warm', 'Cold', 'Lost'], 
    default: 'Warm' 
  },
  contacted: { 
    type: String, 
    enum: [
      'New Enquiry',
      'Call Not Picked',
      'Contacted',
      'Qualified',
      'Plan & Quote Sent',
      'In Pipeline',
      'Negotiating',
      'Awaiting Payment',
      'Booked',
      'Lost & Closed',
      'Future Prospect'
    ], 
    default: 'New Enquiry' 
  },
  assignedTo: { type: String, required: true },
  reminder: Date,
  estimatedBudget: Number,
  preferredTravelDate: Date,
  numberOfTravelers: Number,
  source: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

LeadSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.leadId) {
    this.leadId = String(Date.now());
  }
  next();
});

module.exports = mongoose.model('Lead', LeadSchema);