const sendMail = require("../configs/nodeMailer");
const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupController = {
  addUser: async (req, res) => {
    try {
      //console.log('AddUser function called');
      let { fullName, username, email, pass, fcmToken } = req.body;

      const userExists = await userModel.findOne({ email });
      if (userExists) {
        console.log('User already exists');
        return res.status(409).json({ error: 'User already exists' });
      }

      const existingUsername = await userModel.findOne({ username });
      if (existingUsername) {
        console.log('Username already exists');
        return res.status(409).json({ error: 'Username already exists' });
      }

      if (!fcmToken) {
        return res.status(400).json({ error: 'FCM token is required' });
      }

      const existingTokenUser = await userModel.findOne({ fcmToken });
    if (existingTokenUser) {
      console.log('FCM token is already associated with another user');
      return res.status(409).json({ error: 'FCM token is already in use' });
    }


      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pass, salt);
      pass = hash;
      const result = new userModel({
        fullName: fullName,
        username: username,
        email: email,
        password: pass,
        fcmToken: fcmToken
      });
      await result.save();

      // Send verification email
      const subject = 'Welcome to GardenSense';
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to GardenSense!</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                  <td style="padding: 20px 0;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                          <tr>
                              <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0;">
                                  <h1>Welcome to GardenSense!</h1>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#ffffff" style="padding: 20px;">
                                  <p>Dear ${fullName},</p>
                                  <p>Thank you for signing up for GardenSense! We're excited to have you join our community.</p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#ffffff" style="padding: 20px;">
                                  <p>Best regards,<br>The GardenSense Team</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
      `;
      
      const mailResponse = await sendMail(email, subject, htmlContent);
    //  console.log("mail: " + mailResponse);
      //console.log("success: " + mailResponse.success);

      // Check if email was sent successfully
      if (mailResponse && mailResponse.success) {
        console.log('New user registered and email sent');
        res.status(200).json({ message: 'User registered successfully. Verification email sent.' });
      } else {
        console.log('New user registered but email sending failed');
        res.status(500).json({ error: 'User registered successfully. Failed to send verification email' });
      }

    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log(`AddUser Validation ERROR: ${error.message}`);
        res.status(400).json({ error: error.message });
      } else {
        console.log(`AddUser ERROR: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },

  findEmail: async (req, res) => {
    try {
      let { email } = req.body;
      const isValid = await userModel.findOne({ email });
      // console.log(email);
      if (isValid) {
        res.send("valid");
      } else {
        res.send("inValid");
      }
    } catch (error) {
      console.log(`findEmail ERROR: ${error.message}`);
    }
  },
  updatePass: async (req, res) => {
    try {
      let { email, currentPassword, newPassowrd } = req.body;
      // console.log(email, pass);

      const userExists = await userModel.findOne(email);
      if(!userExists)
        {
          res.send
        }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pass, salt);
      pass = hash;
      const result = await userModel.findOneAndUpdate({
        eamil: email,
        password: pass,
      });
      if (result) {
        // console.log(result);

        res.send("done");
      } else {
        // console.log("fail");
      }
    } catch (error) {
      console.log(`UpdatePass ERROR: ${error}`);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      //console.log(email+password);
      const result = await userModel.findOne({ email });

      if (result) {
        const isValid = await bcrypt.compare(password, result.password);
        if (isValid) {
          jwt.sign(
            { userId: result._id },  // Include user ID in the payload
            "mySecret",
            { expiresIn: "1h" },
            (err, token) => {
              if (err) {
                console.log(err.message);
                res.send(err.message);
              } else {
                return res.send({ result: result, userId: result._id, token: token });  // Send user ID along with token
              }
            }
          );
        } else {
          res.send(false);  // Invalid password
        }
      } else {
        res.send(false);  // Email not found
      }
    } catch (error) {
      console.log(`Login Error: ${error.message}`);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = signupController;
