const userModel = require("../models/users");

const userController = {
    getUser: async (req, res) => {
        try {
          const user = await userModel.findById(req.params.id);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          res.status(200).json(user);
        } catch (error) {
          console.log(`GetUser Error: ${error.message}`);  // Log the error for debugging
          if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: "User not found" });
          }
          res.status(500).json({ message: "Server error" });
        }
      },
}

module.exports = userController;
