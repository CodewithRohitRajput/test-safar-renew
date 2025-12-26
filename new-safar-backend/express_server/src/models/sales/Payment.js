const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  invoiceNumber: { type: String, required: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  paymentMode: { type: String, required: true }, // Flexible: can be "Bank ICICI 1 - Office", "PayU Money", etc.
  transactionId: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },

  paymentMethod: { 
    type: String, 
    required: true 
  },
  bankName: String,
  accountNumber: String,
  chequeNumber: String,
  upiId: String,
  cardLast4: String,
  status: { 
    type: String, 
    enum: ['success', 'pending', 'failed', 'refunded'], 
    default: 'success' 
  },
  remarks: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

PaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.paymentId) {
    this.paymentId = String(Date.now());
  }
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);