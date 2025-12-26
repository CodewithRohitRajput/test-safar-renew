const mongoose = require('mongoose');

const LineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  tax: { type: Number, default: 0 },
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  totalTax: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  customer: { type: String, required: true },
  billTo: String, 
  shipTo: String, 
  customerEmail: String,
  customerPhone: String,
  project: String,
  tags: [String],
  dueDate: { type: Date, required: true },
  preventOverdueReminders: { type: Boolean, default: false }, 
  status: { 
    type: String, 
    enum: ['paid', 'partially_paid', 'unpaid', 'overdue', 'draft', 'cancelled'], 
    default: 'unpaid' 
  },
  tripStartingDate: Date,
  location: String,
  itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  b2bDeal: String,
  gst: String,
  gstAmount: Number,
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number },
  paymentTerms: String,
  allowedPaymentModes: [String], 
  currency: { type: String, default: 'INR' }, 
  saleAgent: String, 
  isRecurring: { type: Boolean, default: false }, 
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    default: 'fixed' 
  }, 
  discountValue: { type: Number, default: 0 }, 
  lineItems: [LineItemSchema], 
  quantityAs: { 
    type: String, 
    enum: ['Qty', 'Hours', 'Qty/Hours'], 
    default: 'Qty' 
  },
  adjustment: { type: Number, default: 0 },
  adminNote: String, 
  clientNote: String,
  termsAndConditions: String, 
  notes: String, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}

});

InvoiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.amount && this.paidAmount !== undefined) {
    this.remainingAmount = this.amount - this.paidAmount;
  }
 
  if (this.lineItems && this.lineItems.length > 0) {
    const calculatedAmount = this.lineItems.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0);
    if (!this.amount || this.amount === 0) {
      this.amount = calculatedAmount;
    }
  }
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);