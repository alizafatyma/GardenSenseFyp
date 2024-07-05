const express = require('express');
const crypto = require('crypto');
const userModel = require('../models/users'); // Adjust as per your user model import
const verifyToken = require('../middlewares/verifyToken');
require('dotenv').config();

const router = express.Router();
const DISCOURSE_SECRET = process.env.DISCOURSE_CONNECT_SECRET; // Ensure this matches Discourse settings

router.get('/sso', verifyToken, async (req, res) => {
  const { payload, signature } = req.query;

  // Verify signature
  const computedSignature = crypto.createHmac('sha256', DISCOURSE_SECRET)
                                  .update(payload)
                                  .digest('hex');
  
  if (computedSignature !== signature) {
    return res.status(403).send('Invalid SSO signature');
  }
  console.log(computedSignature+" "+signature);

  // Decode payload
  const decodedPayload = Buffer.from(payload, 'base64').toString();
  console.log(decodedPayload);
  const params = new URLSearchParams(decodedPayload);
  const nonce = params.get('nonce'); // Example: retrieve nonce from payload
  console.log(nonce);

  // Fetch user from your database (example with findById)
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create SSO payload for Discourse
    const ssoPayload = new URLSearchParams({
      nonce,
      email: user.email,
      external_id: user._id,
      username: user.username,
      name: user.fullName,
    }).toString();
    console.log(ssoPayload);

    // Create return payload and signature
    const returnPayload = Buffer.from(ssoPayload).toString('base64');
    const returnSignature = crypto.createHmac('sha256', DISCOURSE_SECRET)
                                  .update(returnPayload)
                                  .digest('hex');

    // Redirect to Discourse SSO login with payload and signature
    res.redirect(`https://gardensense.discourse.group/session/sso_login?sso=${returnPayload}&sig=${returnSignature}`);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

