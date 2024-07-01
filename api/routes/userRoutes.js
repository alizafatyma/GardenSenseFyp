const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require('../middlewares/verifyToken')
const route = express.Router();

route.get("/:id", userController.getUser);
route.post('/:userId/update-password', verifyToken, userController.updatePass);
route.put('/:userId/update-profile', verifyToken, userController.updateProfile);
route.post('/find-email', userController.findEmail);
route.post('/:userId/save-plant', userController.savePlant);
route.get('/:userId/saved-plants', userController.getUserSavedPlants);
route.get('/:userId/saved-plants/:plantId', userController.getSavedPlantDetails);

module.exports = route;