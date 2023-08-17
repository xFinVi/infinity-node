const express = require('express');

const mainController = require('../controllers/main');

const router = express.Router();



router.get('/', mainController.getMainPage);
router.get('/team', mainController.getTeam);
router.get('/staff', mainController.getStaff);
router.get('/news', mainController.getNews);
router.get('/gallery', mainController.getGallery);
router.get('/contact', mainController.getContact);


module.exports = router;