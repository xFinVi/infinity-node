const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/new-password', authController.getNewPassword);
router.get('/reset', authController.getReset);

router.post('/login', authController.postLogin);
router.post('/register', authController.postRegister);
router.post('/logout', authController.postLogout);


module.exports = router;