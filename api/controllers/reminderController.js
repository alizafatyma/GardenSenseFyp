const Reminder = require('../models/reminder');
const User = require('../models/users');
const Plant = require("../models/plant")
const { savePlant } = require('./userController');
const cron = require('node-cron');
const {sendNotification} = require("../services/notificationService");

exports.createReminder = async (req, res) => {
  const userId = req.params.userId;
  const { plantId, dateTime, category, frequency, plantDetails, isPlantSaved } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let plant;

    if (!isPlantSaved) {
      // If the plant is not saved, save the plant first
      req.userId = userId; // Set userId in req object for savePlant function
      req.body = plantDetails; // Set plant details in req body for savePlant function
      const savedPlant = await savePlant(req); // Call savePlant function
      console.log(savedPlant);
      if (savedPlant.error) {
        return res.status(500).json({ message: 'Failed to save plant', error: savedPlant.error });
      }
      plant = plantDetails;
      console.log(plant);
    } else {
      // If the plant is saved, fetch it from the database
      plant = await Plant.findOne({ id: plantId });
      if (!plant) {
        return res.status(404).json({ message: 'Plant not found' });
      }
    }

    // Check for duplicate reminders
    const existingReminder = await Reminder.findOne({
      userId,
      plantId: plant.id,
      dateTime,
      category,
    });

    if (existingReminder) {
      return res.status(400).json({ message: 'Reminder already exists for this plant, date, and category' });
    }

    const reminder = new Reminder({
      userId,
      plantId: plant.id,
      dateTime,
      category,
      frequency
    });

    await reminder.save();
    res.status(201).json({ message: 'Reminder created successfully', reminder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getReminders = async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate if userId exists or is valid (assuming it's a valid ObjectId)
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch reminders for the user
    const reminders = await Reminder.find({ userId });
    res.status(200).json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
};

exports.deleteReminder = async (req, res = null) => {
  const reminderId = req.params.reminderId || req.reminderId;

  try {
      const reminder = await Reminder.findById(reminderId);
      if (!reminder) {
          if (res) {
              return res.status(404).json({ error: 'Reminder not found' });
          } else {
              return { error: 'Reminder not found' };
          }
      }

      await Reminder.deleteOne({ _id: reminderId });

      if (res) {
          return res.status(200).json({ message: 'Reminder deleted successfully' });
      } else {
          return { message: 'Reminder deleted successfully' };
      }
  } catch (error) {
      console.error(`Failed to delete reminder with ID ${reminderId}:`, error);
      if (res) {
          return res.status(500).json({ message: 'Failed to delete reminder', error: error.message });
      } else {
          return { error: 'Failed to delete reminder', details: error.message };
      }
  }
};

const updateRecurringReminders = async () => {
  const now = new Date();
  console.log(now);

  const reminders = await Reminder.find({
    dateTime: { $lte: now },
    notificationSent: false
  });

  for (const reminder of reminders) {
    console.log(reminder);
    const user = await User.findById(reminder.userId);
    const message = `Time to ${reminder.category} your plant!`;
    
    const notificationResponse = await sendNotification({
      token: user.fcmToken,
      title: 'Plant Care Reminder',
      message
    });
    console.log("Notification response:", notificationResponse);

    if (!notificationResponse.success) {
      console.error('Failed to send notification:', notificationResponse.error);
      continue;
    }

    if (reminder.frequency === 'Daily') {
      reminder.dateTime.setDate(reminder.dateTime.getDate() + 1);
      reminder.notificationSent = false; // Reset notification sent status
    } else if (reminder.frequency === 'Weekly') {
      reminder.dateTime.setDate(reminder.dateTime.getDate() + 7);
      reminder.notificationSent = false; // Reset notification sent status
    } else if (reminder.frequency === 'Monthly') {
      reminder.dateTime.setMonth(reminder.dateTime.getMonth() + 1);
      reminder.notificationSent = false; // Reset notification sent status
    } else {
      // If no frequency, mark as notification sent and delete the reminder
      reminder.notificationSent = true;
      await deleteReminder({ params: { reminderId: reminder._id } });
    }

    await reminder.save();
  }
};

// Run the job every minute
cron.schedule('* * * * *', updateRecurringReminders);
