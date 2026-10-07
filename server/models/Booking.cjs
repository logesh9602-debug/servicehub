const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Booking', bookingSchema)