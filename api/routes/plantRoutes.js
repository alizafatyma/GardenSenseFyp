const express = require('express');
const plantController = require('../controllers/plantController');

const router = express.Router();

router.get('/search', plantController.searchPlants);
router.get('/details/:accessToken', plantController.getPlantDetails);

module.exports = router;
