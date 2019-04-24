const Question = require('../models/question.js')
const {NewQuestionTag, EditQuestionTag} = require('../helpers/tagManagement')

class questionController {
    static createQuestion (req,res,next) {
      console.log("masuk ke method create question", req.body,  req.loggedInUser)  
      
      let tagGroup = NewQuestionTag(req.body.tags)
      console.log("Tag array output helpers", tagGroup)
      
      Question
          .create({
            author: req.loggedInUser.id,
            title: req.body.title,
            description: req.body.description,
            tags: tagGroup,
            createdAt: new Date
          })
      .then(newQuestion => {
        console.log("berhasil create question", newQuestion)
        res.status(201).json(newQuestion)
      })
      .catch(err => {
        console.log("error create question", err)
        res.status(400).json({
            msg: "create question fail",
            err
          })
      })
    }

    static findAll(req, res, next) {
        let query = {}
        
        if (req.query.q) {
          query = {
            $or: [{tags:{
              $regex: '.*' + req.query.q + '.*',
              $options: "i"
             }},{title: {
              $regex: '.*' + req.query.q + '.*',
              $options: "i"
            }}]
          }
        }
    
        Question
          .find(query)
          .populate('author')
          .sort([['createdAt', 'descending']])
          .then(questions => {
            res.status(200).json({
                msg: "get data success",
                data: questions
              })
          })
          .catch(err => {
            res.status(404).json(err)
          })
      }

      static findByTag (req,res) {
        console.log("masuk ke find by tag", req.query)
        let tagArray =[];
        let tagArraywithRegex =[]
        let query ={}
        query = { tags: { $all: tagArraywithRegex } }
        tagArray = req.query.tags.split(" ")
        
        tagArray.forEach(tag=> {
            tagArraywithRegex.push(new RegExp('^'+ tag,'i'))
            // expected output { tags: { $in: [/^pRoGramMing/i] } }
        })
        console.log("looping selesai, query ada regex", query)

        Question
            .find(query)
            .populate('author')
            .sort([['createdAt', 'descending']])
            .then(questions => {
                console.log("question by tag ditemukan", questions)
                res.status(200).json({
                    msg: `jumlah question ditemukan: ${questions.length}`,
                    data: questions})
            })
            .catch(error => {
              console.log("terjadi error find Question by tag", error)  
              res.status(500).json(error)
            })
      }

      static findById(req, res, next) {
        console.log()
        Question
          .findById(req.params.id)
          .populate('author')
          .populate({
            path: 'answers',
            populate: { path: 'author' }
          })
          .then(question => {
            if (!question) {
              res.status(404).json({
                  msg: 'question not found'
                })
            } else {
              res.status(200).json({
                  msg: 'fetch data success',
                  data: question
                })
            }
          })
          .catch(err => {
            res.status(400).json({
                msg: 'fetch failed',
                err
              })
          })
      }
      
      static upvoteQuestion (req, res, next) {
        console.log("method upvoteQuestion", req.params, req.loggedInUser)
        Question
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
            console.log("hasil verifikasi up/down voter", result, upVoter, upIndex, downVoter, downIndex)
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
                      msg: "upvote success",
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
                      msg: "undo upvote success"
                    })
                })
            }
          })
          .catch(err => {
            res.status(500).json({
                msg: "upvote fail",
                err
              })
          })
      }  

      static downvoteQuestion (req,res,next) {
          Question.findOne({_id: req.params.id})
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
                      msg: "downvote success",
                      result
                    })
                  })
              } else {
                result.downvoters.splice(downIndex, 1)
                return result
                  .save()
                  .then(() => {
                    res.status(200).json({
                        msg: "undo downvote success"
                      })
                  })
              }
              
          })
          .catch(err => {
            res.status(500).json({
                msg: "downvote fail",
                err
              })
          })
      }

      static editQuestion (req, res, next) {
        console.log("Masuk ke edit question", req.body, req.loggedInUser, req.params.id)
        Question
          .findOne({"_id": req.params.id})
        .then (question => {
            console.log("Hasil pencarian question: ", question)
            
              // let inputTag = ''
              // req.body.tags.forEach(singletag => {
              //     inputTag += singletag+','
              // })
              // inputTag.slice(0,-1)
              // console.log("hasil looping dan splice tag array", inputTag)
              let tagGroup = NewQuestionTag(req.body.tags)
              
              return Question.findOneAndUpdate({
                _id: req.params.id
              }, {
                  title: req.body.title,
                  description: req.body.description,
                  tags: tagGroup
              }, {new: true})
              .then(questionupdate => {
                  console.log("Hasil Edit", questionupdate)
                  res.status(200).json(questionupdate)
              })
        })
        .catch(error=>{
          console.log("terjadi error edit question", error)
            res.status(500).json({
                msg: 'ERROR in finding your question to edit ',error           
            }) 
        })
      }

      static deleteQuestion (req,res,next) {
        Question
        .findOne({ _id: req.params.id })
        .then(question => {
            Question
              .findOneAndDelete({ _id: req.params.id })
              .then(questiondelete => {
                console.log("Hasil Delete", questiondelete)
                res.status(200).json({
                    msg: "delete success",
                    question
                  })
              })
        })
        .catch(err => {
          console.log("terjadi error edit delete", error)
          res.status(400).json(err)
        })
      }

}

module.exports = questionController;