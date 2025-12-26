const mongoose = require("mongoose")

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },

    people_count: {
      type: Number,
      required: false,
    },

    itinerary_id: {
      type: Schema.Types.ObjectId,
      ref: "Itinerary",
      required: true,
    },
    batch_id: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },

    total_price: {
      type: Number,
      required: true,
    },

    paid_amount: {
      type: Number,
      required: true,
    },

    invoice_link: {
      type: String,
      default: "",
    },

    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: false,
    },

    txn_id: {
      type: String,
      required: false,
    },

    transaction_status: {
      type: String,
      enum: ["INITIATED", "SUCCESS", "FAILED"], 
      required: false,
    },

    delete : {
      type : Boolean,
      default : false
    }
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Booking" , BookingSchema)