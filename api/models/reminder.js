const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plantId: { type: String, ref: 'Plant', required: true },
  dateTime: { type: Date, required: true },
  category: { type: String, required: true, enum: ['watering', 'fertilizing', 'pruning', 'repotting', 'pestControl', 'sunlight'] },
  frequency: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
  notificationSent: { type: Boolean, default: false }
});

const reminder = mongoose.model('reminder', reminderSchema);
module.exports = reminder;
