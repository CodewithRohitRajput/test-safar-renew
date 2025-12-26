const mongoose = require('mongoose');

const CustomizeLeadSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  customFields: [{
    fieldName: String,
    fieldValue: mongoose.Schema.Types.Mixed,
    fieldType: { type: String, enum: ['text', 'number', 'date', 'boolean', 'select'] },
  }],
  customStatus: String,
  customTags: [String],
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  followUpDate: Date,
  conversionProbability: { type: Number, min: 0, max: 100 },
  customNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  delete : {type : Boolean , default : false}
});

CustomizeLeadSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CustomizeLead', CustomizeLeadSchema);