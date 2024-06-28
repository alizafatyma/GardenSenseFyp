const express = require('express');
const plantController = require('../controllers/plantController');
const { uploadPlantImage } = require('../middlewares/multer');

const router = express.Router();

router.get('/search', plantController.searchPlants);
router.get('/details/:accessToken', plantController.getPlantDetails);
router.post('/identify', uploadPlantImage, plantController.identifyPlant);
router.get('/facts', plantController.getPlantFacts);

module.exports = router;
