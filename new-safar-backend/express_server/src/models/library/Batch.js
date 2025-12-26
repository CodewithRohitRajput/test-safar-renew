const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const batchSchema = new Schema({
  start_date: {
    type: Date,
    required: true,
    index: true
  },
  end_date: {
    type: Date,
    required: true,
    index: true
  },
  is_sold: {
    type: Boolean,
    required: true
  },
  extra_amount: {
    type: Number,
    default: 0
  },
  extra_reason: {
    type: String
  },
  itineraryId: {
    type: Schema.Types.ObjectId,
    ref: 'Itinerary',
    required: true,
    index: true
  },
  delete : {type : Boolean , default : false}
}, {
  timestamps: true
});

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;