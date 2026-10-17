const express = require('express');
const router = express.Router();
const seatsController = require('./seats.controller');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');

// Public route: Get all seats for a venue
router.get('/venue/:venue_id', seatsController.getSeatsByVenue);

// Admin route: Generate seats automatically
router.post('/generate', authenticateToken, requireAdmin, seatsController.generateSeats);

module.exports = router;