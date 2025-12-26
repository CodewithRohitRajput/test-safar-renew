const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  base_city: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    required: true
  },
  instagram: {
    type: String
  },
  refer: {
    type: String
  },
  starting_point: {
    type: String,
    required: true
  },
  drop_point: {
    type: String,
    required: true
  },
  delete : {
    type : Boolean , default : false
  }

}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
