const Answer = require('../models/answer')
const Question = require('../models/question')

class AnswerController {
  static createAnswer(req, res, next) {
    var newAnswer
    var updatedQuestion
    console.log("Masuk ke create answer", req.body, req.loggedInUser)
    Answer
      .create({
        content: req.body.content,
        questionId: req.body.questionId,
        author: req.loggedInUser.id
      })
      .then(answer => {
        console.log("answer berhasil create")
        newAnswer = answer
        return Question.findById(req.body.questionId)
        .then(question => {
          updatedQuestion = question
          question.answers.unshift(newAnswer._id)
          return question.save()
          .then(() => {
            console.log("create answer berhasil", question)
            res.status(201).json({
                msg: "create answer success",
                newAnswer,
                updatedQuestion
              })
        })
      })
      })
      .catch(err => {
        res.status(400).json({
            msg: "create answer fail",
            err
          })
      })
  }

  static findAnswerByQuestionId(req, res, next) {
    console.log("Masuk ke find answer by Question Id", req.params)
    Answer
      .find({ questionId: req.params.questionId })
      .populate('author')
      .then(answers => {
        res.status(200).json({
            msg: "get answers success",
            answers
          })
      })
      .catch(err => {
        res.status(404).json({
            msg: "answer not found",
            err
          })
      })
  }
  static findAnswerById(req, res, next) {
    console.log("Masuk ke find answer by Question Id", req.params)
    Answer
      .findById(req.params.id)
      .populate('author')
      .then(foundAnswer => {
        if (!foundAnswer) {
          res.status(404).json({
              msg: 'answer not found'
            })
        } else {
          res.status(200).json({
              msg: 'find one answer success',
              data: foundAnswer
            })
        }
      })
      .catch(err => {
        res.status(400).json({
            msg: 'fetch answer failed',
            err
          })
      })
  }

  static editAnswer(req, res, next) {
    console.log("Masuk ke edit answer", req.params, req.body, req.loggedInUser)
    Answer
      .findOne({ _id: req.params.id })
      .then(answerToEdit => {
        console.log("hasil find one", answerToEdit)
          console.log("masuk sini ====")
          answerToEdit.content = req.body.content
          Answer
            .findOneAndUpdate({ _id: req.params.id },
              answerToEdit,
              { new: true })
            .then(updatedanswer => {
              res.status(200).json({
                  msg: "update answer success",
                  updatedanswer
                })
            })
      })
      .catch(err => {
        res.status(400).json({
            msg: "update answer fail",
            err
          })
      })
  }

  static upvoteAnswer(req, res, next) {
    console.log("method upvote Answer", req.params, req.loggedInUser)
        Answer
          .findOne({ '_id': req.params.id })
          .then(result => {
            console.log("hasil find question to upvote", result)
            let upVoter = false;
            let downVoter = false;
            let upIndex = 0
            let downIndex = 0
    
            result.upvoters.forEach((up, index) => {
              if (up.toString() == req.loggedInUser.id.toString()) {
                upVoter = true
                upIndex = index
              }
            })
    
            result.downvoters.forEach((down, index) => {
              if (down.toString() == req.loggedInUser.id.toString()) {
                downVoter = true
                downIndex = index
              }
            })
            console.log("hasil verifikasi up/down voter answer", result, upVoter, upIndex, downVoter, downIndex)
            if (!upVoter) {
              if (downVoter) {
                result.downvoters.splice(downIndex, 1)
              }
              console.log('masuk ini 1')
              result.upvoters.push(req.loggedInUser.id)
              return result
                .save()
                .then(() => {
                  res.status(200).json({
                      msg: "upvote answer success",
                      result
                    })
                })
            } else {
              console.log('masuk ini 2')
              result.upvoters.splice(upIndex, 1)
              return result
                .save()
                .then(() => {
                  res.status(200).json({
                      msg: "undo upvote answer success"
                    })
                })
            }
          })
          .catch(err => {
            res.status(500).json({
                msg: "upvote answer fail",
                err
              })
          })
  }

  static downvoteAnswer(req, res, next) {
    console.log("Masuk ke downvote answer", req.params)
    Answer.findOne({_id: req.params.id})
      .then(result => {
          let upVoter = false;
          let downVoter = false;
          let upIndex = 0
          let downIndex = 0

          result.upvoters.forEach((up, index) => {
              if(up.toString() == req.loggedInUser.id.toString()) {
                  upVoter = true;
                  upIndex = index;
              }
          })
          result.downvoters.forEach((down, index) => {
              if(down.toString() == req.loggedInUser.id.toString()) {
                  downVoter = true;
                  downIndex = index;
              }
          })

          if(!downVoter) {
            if(upVoter) {
              result.upvoters.splice(upIndex,1)
            }
            result.downvoters.push(req.loggedInUser.id)
            return result.save()
              .then(() => {
                res.status(200).json({
                  msg: "downvote answer success",
                  result
                })
              })
          } else {
            result.downvoters.splice(downIndex, 1)
            return result
              .save()
              .then(() => {
                res.status(200).json({
                    msg: "undo downvote answer success"
                  })
              })
          }
          
      })
      .catch(err => {
        res.status(500).json({
            msg: "downvote answer fail",
            err
          })
      })
  }

  static deleteAnswer (req, res, next) {
    console.log("Masuk ke delete answer", req.params, req.loggedInUser)
    Answer
      .findOne({ _id: req.params.id })
      .then(answer => {
          Answer
            .findOneAndDelete({ _id: req.params.id })
            .then(answerdelete => {
              res.status(200).json({
                  msg: "delete answer success",
                  answerdelete
                })
            })
      })
      .catch(err => {
        res.status(500).json({
            msg: "internal server error",
            err
          })
      })
  }
}

module.exports = AnswerController