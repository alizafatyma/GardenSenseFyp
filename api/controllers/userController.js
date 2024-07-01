const userModel = require("../models/users");
const plantModel = require("../models/plant");
const savedPlantModel = require("../models/savedPlant");
const bcrypt = require("bcryptjs");

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

  updatePass: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await userModel.findById(req.params.userId);
      

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      await userModel.findOneAndUpdate(
        { _id: user._id },
        { $set: { password: hashedNewPassword } }
      );

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.log(error);
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { fullName, username, profileImage, bio, fcmToken } = req.body;
      const user = await userModel.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check for unique username and fcmToken if they are being updated
      if (username && username !== user.username) {
        const existingUsername = await userModel.findOne({ username });
        if (existingUsername) {
          return res.status(409).json({ error: 'Username already exists' });
        }
      }

      if (fcmToken && fcmToken !== user.fcmToken) {
        const existingTokenUser = await userModel.findOne({ fcmToken });
        if (existingTokenUser) {
          return res.status(409).json({ error: 'FCM token is already in use' });
        }
      }

      // Update user fields based on provided values in req.body
      const updatedFields = {
        fullName: fullName || user.fullName,
        username: username || user.username,
        profileImage: profileImage || user.profileImage,
        bio: bio || user.bio,
        fcmToken: fcmToken || user.fcmToken
      };

      // Perform the update using findOneAndUpdate
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: user._id },
        { $set: updatedFields },
        { new: true } // Return the updated document
      );
      res.status(200).json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(error);
    }
  },

  findEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email: email });

      if (user) {
        res.status(200).json({ message: 'Email is valid' });
      } else {
        res.status(404).json({ error: 'Email not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  savePlant: async (req, res) => {
    const userId = req.params.userId || req.userId;
    const { id, plant_name, common_names, taxonomy, description, image, edible_parts, propagation_methods, watering } = req.body;

    try {
        const userExists = await userModel.findById(userId);
        if (!userExists) {
            if (res) {
                return res.status(404).json({ message: 'User not found' });
            } else {
                return { error: 'User not found' }; // Return error if called as a function
            }
        }

        // Check if the plant is already saved by the user
        const existingSavedPlant = await savedPlantModel.findOne({ userId, plantId: id });

        if (existingSavedPlant) {
            if (res) {
                return res.status(400).json({ error: 'Plant already saved' });
            } else {
                return { message: 'Plant already saved'};
            }
        }

        // Create or update plant details in the Plant model
        let plant = await plantModel.findOne({ id });

        if (!plant) {
            // If plant details not found, create a new entry in Plant model
            plant = new plantModel({
                id,
                plant_name,
                common_names,
                taxonomy,
                description,
                image,
                edible_parts,
                propagation_methods,
                watering
            });

            await plant.save();
        }

        // Create a new SavedPlant document linking the user and the plant
        const savedPlant = new savedPlantModel({
            userId,
            plantId: id,
        });

        await savedPlant.save();

        if (res) {
            res.status(201).json(savedPlant);
        } else {
            return { message: 'Plant saved successfully', plant };
        }
    } catch (error) {
        console.error('Error saving plant:', error);
        if (res) {
            res.status(500).json({ error: 'Failed to save plant' });
        } else {
            return { error: 'Failed to save plant' };
        }
    }
  },

  getUserSavedPlants: async (req, res) => {
    const userId = req.params.userId;

    try {
      // Check if the user exists
      const userExists = await userModel.findById(userId);
      if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Fetch all saved plants for the user
      const userPlants = await savedPlantModel.find({ userId });

      // If no saved plants found, return empty array
      if (!userPlants || userPlants.length === 0) {
        return res.status(200).json({ message: 'No saved plants found for this user' });
      }

      // Array to hold detailed plant information
      let savedPlantsDetails = [];

      // Fetch detailed plant information from plantModel for each saved plant
      for (let i = 0; i < userPlants.length; i++) {
        const savedPlant = userPlants[i];
        const plantDetails = await plantModel.findOne({ id: savedPlant.plantId });

        if (plantDetails) {
          savedPlantsDetails.push({
            id: plantDetails.id,
            plant_name: plantDetails.plant_name,
            image: plantDetails.image,
            common_name: plantDetails.common_names[0]
          });
        } else {
          console.log(`Plant details not found for savedPlantId: ${savedPlant._id}`);
        }
      }

      res.status(200).json(savedPlantsDetails);
    } catch (error) {
      console.error('Error fetching saved plants:', error);
      res.status(500).json({ error: 'Failed to fetch saved plants' });
    }
  },

  getSavedPlantDetails: async (req, res) => {
    const { userId, plantId } = req.params;

    try {
      const userExists = await userModel.findById(userId);
      if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
      }

      const savedPlant = await savedPlantModel.findOne({ userId, plantId });
      if (!savedPlant) {
        return res.status(404).json({ error: 'Plant not saved by user' });
      }

      const plant = await plantModel.findOne({ id: plantId });
      if (!plant) {
        return res.status(404).json({ error: 'Plant not found' });
      }

      res.status(200).json(plant);
    } catch (error) {
      console.error('Error fetching plant details:', error);
      res.status(500).json({ error: 'Failed to fetch plant details' });
    }
  }
}

module.exports = userController;
