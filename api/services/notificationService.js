const admin = require('../configs/firebase'); // Adjust the path as needed

const sendNotification = async ({ token, title, message }) => {
  const payload = {
    notification: {
      title,
      body: message
    },
    token
  };
  console.log('Sending notification with payload:', payload);

  try {
    const response = await admin.messaging().send(payload);
    console.log('Notification sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error };
  }
};

module.exports = {
  sendNotification,
};
