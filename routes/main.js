const express = require('express');

const mainController = require('../controllers/main');

const router = express.Router();



router.get('/', mainController.getMainPage);
router.get('/team', mainController.getTeam);
router.get('/staff', mainController.getStaff);

router.get('/latest-news/:newsId', mainController.getLatestNews);

router.get('/news', mainController.getNews);
router.get('/news/:postId',mainController.getNewsDetails);

router.get('/contact', mainController.getContact);


module.exports = router;