var express = require('express')
var router = express.Router()
var AnswerController = require('../controllers/answerController')
const { authentication, answerAuthorization } = require('../middlewares/authentication')

router.get('/question/:questionId', AnswerController.findAnswerByQuestionId)

router.use(authentication)
router.post('/', AnswerController.createAnswer)
router.put('/upvote/:id', AnswerController.upvoteAnswer)
router.put('/downvote/:id', AnswerController.downvoteAnswer)
router.get('/one/:id', AnswerController.findAnswerById)
router.put('/:id', answerAuthorization, AnswerController.editAnswer)
router.delete('/:id', answerAuthorization, AnswerController.deleteAnswer)

module.exports = router