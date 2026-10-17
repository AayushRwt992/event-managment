const express = require('express');
const router = express.Router();
const venuesController = require('./venues.controller');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');

// Public routes
router.get('/', venuesController.getVenues);
router.get('/:id', venuesController.getVenueById);

// Admin-only route
router.post('/', authenticateToken, requireAdmin, venuesController.createVenue);

module.exports = router;