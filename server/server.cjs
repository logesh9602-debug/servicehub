const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Booking = require('./models/Booking.cjs')

mongoose.connect('mongodb://127.0.0.1:27017/servicehub')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((error) => console.error('❌ MongoDB connection failed:', error))

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())


// Test API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ServiceHub backend is running!'
  })
})

// Get all bookings from MongoDB
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })

    res.json({
      success: true,
      bookings: bookings
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    })
  }
})

// Create booking in MongoDB
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await Booking.create({
      service: req.body.service,
      provider: req.body.provider,
      customerName: req.body.customerName,
      phone: req.body.phone,
      date: req.body.date,
      address: req.body.address
    })

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: booking
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    })
  }
})

// Update booking status
app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    )

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: booking
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 ServiceHub backend running on http://localhost:${PORT}`)
})