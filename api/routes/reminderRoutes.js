const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');

// Create a new reminder
router.post('/:userId', reminderController.createReminder);

// Get all reminders for a user
router.get('/user/:userId', reminderController.getReminders);

// Delete a reminder
router.delete('/:reminderId', reminderController.deleteReminder);

module.exports = router;