const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:  process.env.REACT_APP_URL,
});

module.exports = admin;
