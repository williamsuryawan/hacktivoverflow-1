const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const {authentication} = require('../middlewares/authentication.js')
/* GET users listing. */

router.get('/', UserController.findUser)
router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.use(authentication)
router.post('/watch', UserController.watchingTags)
router.get('/verify', UserController.verifyToken);
router.get('/detail', UserController.getUserDetail)
router.put('/edit', UserController.editUser)


module.exports = router;