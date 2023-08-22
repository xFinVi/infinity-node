const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/auth');

const router = express.Router();


router.get('/admin/add-post',isAuth, adminController.getAddPost);

router.get('/admin/edit-post/:postId',isAuth, adminController.getEditPost);


router.post('/admin/add-post',  isAuth, adminController.postNewPost);
router.post('/admin/edit-post', isAuth, adminController.postEditPost);

router.post('/delete',isAuth, adminController.deletePost)

module.exports = router;