const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gstin: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  outstandingBalance: { type: Number, default: 0 }, // in paise
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

VendorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Vendor', VendorSchema);