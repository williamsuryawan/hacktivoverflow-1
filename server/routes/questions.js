var express = require('express');
var router = express.Router();
var QuestionController = require('../controllers/questionController')
const { authentication, questionAuthorization } = require('../middlewares/authentication')

router.get('/', QuestionController.findAll)
router.get('/tags', QuestionController.findByTag)
router.get('/find/:id', QuestionController.findById)

router.use(authentication)
router.post('/', QuestionController.createQuestion)
router.put('/upvote/:id', QuestionController.upvoteQuestion)
router.put('/downvote/:id', QuestionController.downvoteQuestion)
router.put('/:id', questionAuthorization, QuestionController.editQuestion)
router.delete('/:id', questionAuthorization, QuestionController.deleteQuestion)

module.exports = router;