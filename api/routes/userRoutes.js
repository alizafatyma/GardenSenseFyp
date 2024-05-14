const express = require("express");
const userController = require("../controllers/userController");
const route = express.Router();

route.get("/:id", userController.getUser);

module.exports = route;