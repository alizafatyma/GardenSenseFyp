const sendMail = require("../configs/nodeMailer");
const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupController = {
  addUser: async (req, res) => {
    try {
      console.log('AddUser function called');
      let { fullName, email, pass } = req.body;
      const isUnique = await userModel.findOne({ email });
      if (!isUnique) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);
        pass = hash;
        const result = new userModel({
          fullName: fullName,
          email: email,
          password: pass,
        });
        await result.save();
        //sendMail(email);
         console.log("new");
        res.send("new");
      } else {
        console.log("exist");
        res.send("exist");
      }
    } catch (error) {
      console.log(`AddUser ERROR: ${error.message}`);
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
      let { email, pass } = req.body;
      // console.log(email, pass);
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
            { result },
            "mySecret",
            { expiresIn: "1h" },
            (err, token) => {
              if (err) {
                console.log(err.message);
                res.send(err.message);
              } else {
                return res.send({ result: result, token: token });
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
