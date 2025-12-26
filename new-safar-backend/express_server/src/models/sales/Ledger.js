const mongoose = require('mongoose');

const LedgerSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  vendorName: String,
  date: { type: Date, required: true, default: Date.now },
  type: { 
    type: String, 
    enum: ['receipt', 'payment'], 
    required: true 
  },
  amount: { type: Number, required: true }, // in paise
  referenceNumber: String,
  description: String,
  balance: { type: Number, default: 0 }, // running balance in paise
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

LedgerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
LedgerSchema.index({ vendorId: 1, date: -1 });
LedgerSchema.index({ date: -1 });

module.exports = mongoose.model('Ledger', LedgerSchema);