const express = require('express');
const router = express.Router();
const bookingsController = require('./bookings.controller');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');

// User booking route (Protected)
router.post('/', authenticateToken, bookingsController.createBooking);

// Admin ticket scanner/verification route (Protected + Admin)
router.post('/verify', authenticateToken, requireAdmin, bookingsController.verifyTicket);

module.exports = router;
