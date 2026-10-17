const express = require('express');
const router = express.Router();
const eventsController = require('./events.controller');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');

// Public routes (anyone can browse events)
router.get('/', eventsController.getEvents);
router.get('/:id', eventsController.getEventById);

// Protected routes (Admin only can create events)
router.post('/', authenticateToken, requireAdmin, eventsController.createEvent);

module.exports = router;