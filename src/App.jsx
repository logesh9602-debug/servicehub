import { useEffect, useState } from 'react'
import './App.css'

const services = [
  {
    id: 1,
    icon: '🔧',
    name: 'Home Repair',
    description: 'Professional repair and maintenance services',
    providers: ['Arun Kumar', 'Ravi Services', 'QuickFix Team']
  },
  {
    id: 2,
    icon: '🧹',
    name: 'Cleaning',
    description: 'Reliable home and office cleaning',
    providers: ['CleanPro', 'Sparkle Services', 'FreshHome Team']
  },
  {
    id: 3,
    icon: '💻',
    name: 'Computer Service',
    description: 'Laptop, desktop and software support',
    providers: ['TechCare', 'PC Experts', 'DigitalFix']
  },
  {
    id: 4,
    icon: '🚗',
    name: 'Vehicle Service',
    description: 'Car and bike servicing at your location',
    providers: ['AutoCare', 'Speed Motors', 'VehiclePro']
  },
  {
    id: 5,
    icon: '📦',
    name: 'Moving Service',
    description: 'Safe and affordable moving assistance',
    providers: ['MoveEasy', 'SafeMove', 'City Packers']
  },
  {
    id: 6,
    icon: '❄️',
    name: 'AC Service',
    description: 'AC repair, installation and maintenance',
    providers: ['CoolTech', 'AC Experts', 'Comfort Air']
  }
]

function App() {
  const [search, setSearch] = useState('')
  const [selectedService, setSelectedService] = useState(null)
  const [selectedProvider, setSelectedProvider] = useState(null)

  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    date: '',
    address: ''
  })

  const [booked, setBooked] = useState(false)

  const [showAdmin, setShowAdmin] = useState(false)
  const [adminBookings, setAdminBookings] = useState([])

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  )

  // Load bookings from MongoDB
  const loadAdminBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings')
      const data = await response.json()

      if (data.success) {
        setAdminBookings(data.bookings)
      }
    } catch (error) {
      console.error('Failed to load bookings:', error)
    }
  }

  useEffect(() => {
    if (showAdmin) {
      loadAdminBookings()
    }
  }, [showAdmin])

  // Open provider list
  const openProviders = (service) => {
    setSelectedService(service)
    setSelectedProvider(null)
    setBooked(false)
  }

  // Open booking form
  const openBooking = (provider) => {
    setSelectedProvider(provider)
    setBooked(false)
  }

  // Create booking in MongoDB
  const handleBooking = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        'http://localhost:5000/api/bookings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            service: selectedService.name,
            provider: selectedProvider,
            customerName: booking.name,
            phone: booking.phone,
            date: booking.date,
            address: booking.address
          })
        }
      )

      const data = await response.json()

      if (data.success) {
        setBooked(true)

        setBooking({
          name: '',
          phone: '',
          date: '',
          address: ''
        })
      } else {
        alert('Booking failed')
      }
    } catch (error) {
      console.error(error)
      alert('Could not connect to the backend')
    }
  }

  // Confirm / Reject booking using MongoDB _id
  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: status
          })
        }
      )

      const data = await response.json()

      if (data.success) {
        setAdminBookings((currentBookings) =>
          currentBookings.map((item) =>
            item._id === bookingId
              ? {
                  ...item,
                  status: status
                }
              : item
          )
        )
      } else {
        alert('Failed to update booking')
      }
    } catch (error) {
      console.error(error)
      alert('Could not connect to the backend')
    }
  }

  const closeModal = () => {
    setSelectedService(null)
    setSelectedProvider(null)
    setBooked(false)
  }

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          🛠️ ServiceHub
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button className="login-btn">
            Login
          </button>

          <button
            className="admin-nav-btn"
            onClick={() => setShowAdmin(true)}
          >
            Admin
          </button>
        </div>
      </nav>

      {/* ADMIN DASHBOARD */}
      {showAdmin ? (
        <section className="admin-dashboard">

          <div className="admin-header">
            <div>
              <span className="small-title">
                ADMIN PANEL
              </span>

              <h1>
                Booking Management
              </h1>

              <p>
                Manage and monitor customer service bookings.
              </p>
            </div>

            <button
              className="admin-back-btn"
              onClick={() => setShowAdmin(false)}
            >
              ← Back to ServiceHub
            </button>
          </div>

          {/* STATS */}
          <div className="admin-stats">

            <div className="admin-stat-card">
              <span>📋</span>

              <div>
                <h3>
                  {adminBookings.length}
                </h3>

                <p>
                  Total Bookings
                </p>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>🟡</span>

              <div>
                <h3>
                  {
                    adminBookings.filter(
                      (booking) =>
                        booking.status === 'Pending'
                    ).length
                  }
                </h3>

                <p>
                  Pending
                </p>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>✅</span>

              <div>
                <h3>
                  {
                    adminBookings.filter(
                      (booking) =>
                        booking.status === 'Confirmed'
                    ).length
                  }
                </h3>

                <p>
                  Confirmed
                </p>
              </div>
            </div>

            <div className="admin-stat-card">
              <span>❌</span>

              <div>
                <h3>
                  {
                    adminBookings.filter(
                      (booking) =>
                        booking.status === 'Rejected'
                    ).length
                  }
                </h3>

                <p>
                  Rejected
                </p>
              </div>
            </div>

          </div>

          {/* BOOKINGS TABLE */}
          <div className="admin-table-container">

            <div className="admin-table-header">
              <h2>
                Customer Bookings
              </h2>

              <button
                className="refresh-btn"
                onClick={loadAdminBookings}
              >
                🔄 Refresh
              </button>
            </div>

            {adminBookings.length === 0 ? (
              <div className="empty-bookings">

                <div>
                  📭
                </div>

                <h3>
                  No bookings yet
                </h3>

                <p>
                  Customer bookings will appear here.
                </p>

              </div>
            ) : (
              <div className="table-wrapper">

                <table className="booking-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Provider</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {adminBookings.map((item) => (

                      <tr key={item._id}>

                        <td>
                          #{item._id.slice(-6)}
                        </td>

                        <td>
                          <strong>
                            {item.customerName}
                          </strong>

                          <br />

                          <small>
                            {item.phone}
                          </small>
                        </td>

                        <td>
                          {item.service}
                        </td>

                        <td>
                          {item.provider}
                        </td>

                        <td>
                          {item.date}
                        </td>

                        <td>

                          <span
                            className={`status-badge ${
                              item.status === 'Confirmed'
                                ? 'confirmed'
                                : item.status === 'Rejected'
                                ? 'rejected'
                                : 'pending'
                            }`}
                          >
                            {item.status}
                          </span>

                          {item.status === 'Pending' && (

                            <div className="status-actions">

                              <button
                                className="approve-btn"
                                onClick={() =>
                                  updateBookingStatus(
                                    item._id,
                                    'Confirmed'
                                  )
                                }
                              >
                                ✓ Confirm
                              </button>

                              <button
                                className="reject-btn"
                                onClick={() =>
                                  updateBookingStatus(
                                    item._id,
                                    'Rejected'
                                  )
                                }
                              >
                                ✕ Reject
                              </button>

                            </div>

                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>

      ) : (

        <>
          {/* HERO */}
          <section className="hero" id="home">

            <div className="hero-content">

              <span className="hero-badge">
                ⚡ Trusted Local Services
              </span>

              <h1>
                Find Reliable
                <span> Services </span>
                Near You
              </h1>

              <p>
                Book trusted professionals for your home,
                office and personal service needs.
              </p>

              <div className="search-box">

                <span>
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search for a service..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>

          </section>

          {/* SERVICES */}
          <section className="section" id="services">

            <div className="section-heading">

              <span className="small-title">
                OUR SERVICES
              </span>

              <h2>
                What do you need help with?
              </h2>

              <p>
                Choose from our wide range of professional services.
              </p>

            </div>

            <div className="service-grid">

              {filteredServices.map((service) => (

                <div
                  className="service-card"
                  key={service.id}
                >

                  <div className="service-icon">
                    {service.icon}
                  </div>

                  <h3>
                    {service.name}
                  </h3>

                  <p>
                    {service.description}
                  </p>

                  <button
                    className="view-btn"
                    onClick={() =>
                      openProviders(service)
                    }
                  >
                    View Providers →
                  </button>

                </div>

              ))}

            </div>

          </section>

          {/* HOW IT WORKS */}
          <section
            className="section how-section"
            id="how-it-works"
          >

            <div className="section-heading">

              <span className="small-title">
                SIMPLE PROCESS
              </span>

              <h2>
                How ServiceHub Works
              </h2>

            </div>

            <div className="steps">

              <div className="step">
                <div className="step-number">
                  01
                </div>

                <h3>
                  Choose a Service
                </h3>

                <p>
                  Browse and select the service you need.
                </p>
              </div>

              <div className="step">
                <div className="step-number">
                  02
                </div>

                <h3>
                  Select a Provider
                </h3>

                <p>
                  Compare available service providers.
                </p>
              </div>

              <div className="step">
                <div className="step-number">
                  03
                </div>

                <h3>
                  Book the Service
                </h3>

                <p>
                  Enter your details and confirm your booking.
                </p>
              </div>

            </div>

          </section>

          {/* CTA */}
          <section className="cta-section">

            <div>
              <h2>
                Need a service today?
              </h2>

              <p>
                Find trusted professionals through ServiceHub.
              </p>
            </div>

            <a
              href="#services"
              className="cta-btn"
            >
              Explore Services →
            </a>

          </section>

         <footer id="about">

  <div className="footer-content">

    <div className="footer-column">
      <div className="logo">
        🛠️ ServiceHub
      </div>

      <p>
        Your trusted platform for local professional services.
      </p>
    </div>

    <div className="footer-column">
      <h4>Quick Links</h4>

      <a href="#home">Home</a>
      <a href="#services">Services</a>
      <a href="#how-it-works">How It Works</a>
    </div>

    <div className="footer-column">
      <h4>Contact Us</h4>

      <p>📞 +91 87549 30312</p>
      <p>✉️ support@servicehub.com</p>
      <p>📍 Coimbatore, Tamil Nadu</p>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 ServiceHub. All rights reserved.
  </div>

</footer>

        </>

      )}

      {/* PROVIDER / BOOKING MODAL */}
      {selectedService && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={closeModal}
            >
              ×
            </button>

            <div className="modal-header">

              <div className="modal-icon">
                {selectedService.icon}
              </div>

              <div>
                <h2>
                  {selectedService.name}
                </h2>

                <p>
                  {selectedService.description}
                </p>
              </div>

            </div>

            {/* PROVIDERS */}
            {!selectedProvider && !booked && (

              <div className="provider-list">

                <h3>
                  Select a Provider
                </h3>

                {selectedService.providers.map(
                  (provider, index) => (

                    <div
                      className="provider-card"
                      key={provider}
                    >

                      <div className="provider-info">

                        <div className="provider-avatar">
                          {provider.charAt(0)}
                        </div>

                        <div>
                          <h4>
                            {provider}
                          </h4>

                          <p>
                            ⭐ 4.{7 + index} · Verified Provider
                          </p>
                        </div>

                      </div>

                      <button
                        className="book-btn"
                        onClick={() =>
                          openBooking(provider)
                        }
                      >
                        Book
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

            {/* BOOKING FORM */}
            {selectedProvider && !booked && (

              <form
                onSubmit={handleBooking}
                className="booking-form"
              >

                <h3>
                  Book with {selectedProvider}
                </h3>

                <label>
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={booking.name}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      name: e.target.value
                    })
                  }
                  required
                />

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={booking.phone}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      phone: e.target.value
                    })
                  }
                  required
                />

                <label>
                  Service Date
                </label>

                <input
                  type="date"
                  value={booking.date}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      date: e.target.value
                    })
                  }
                  required
                />

                <label>
                  Address
                </label>

                <textarea
                  placeholder="Enter service address"
                  value={booking.address}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      address: e.target.value
                    })
                  }
                  required
                />

                <button
                  type="submit"
                  className="confirm-booking-btn"
                >
                  Confirm Booking
                </button>

              </form>

            )}

            {/* SUCCESS */}
            {booked && (

              <div className="booking-success">

                <div className="success-icon">
                  ✓
                </div>

                <h2>
                  Booking Confirmed!
                </h2>

                <p>
                  Your booking has been submitted successfully.
                </p>

                <span className="status-badge pending">
                  Pending Approval
                </span>

                <button
                  className="confirm-booking-btn"
                  onClick={closeModal}
                >
                  Done
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  )
}

export default App
