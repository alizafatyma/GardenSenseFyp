const express = require("express");
const userController = require("../controllers/userController");
const route = express.Router();

route.get("/:id", userController.getUser);
route.post('/:userId/save-plant', userController.savePlant);
route.get('/:userId/saved-plants', userController.getUserSavedPlants);

module.exports = route;