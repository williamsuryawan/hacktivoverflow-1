const User = require('../models/user')
const Question = require('../models/question')
const Answer = require('../models/answer')
const { verify } = require('../helpers/jwtConvert.js')

module.exports = {
    authentication: function (req,res, next) {
        if(req.headers.hasOwnProperty('token')) {
            // console.log("req.body", req.body)
            console.log("Input verifikasi JWT", req.headers.hasOwnProperty('token'))
            try {
                const decoded = verify(req.headers.token);
                console.log("Hasil verifikasi JWT", decoded)
                if( decoded != null) {
                    req.loggedInUser = decoded;
                    next()
                } else {
                    res.status(400).json({
                        message: 'Invalid Token'
                    })
                }
            } catch (err) {
                res.status(400).json({
                    message: 'Invalid Token'
                })
            }
        } else {
            res.status(400).json({
                message: 'Please provide token'
            })
        }
    },
    
    questionAuthorization: function(req,res,next) {
        console.log("masuk authorization process", req.loggedInUser, req.params.id)
        Question
          .findOne({"_id": req.params.id})
          .then(question => {
            if (question.author.toString() == req.loggedInUser.id.toString()) {
                next()
            } else {
                throw ("unauthorized access")
            }
          })
          .catch(err => {
              console.log("error in question authorization", err)
              res.status(404).json("question not found")
          })  
    },

    answerAuthorization: function(req,res,next) {
        console.log("masuk authorization process", req.loggedInUser, req.params.id)
        Answer
          .findOne({"_id": req.params.id})
          .then(answer => {
            console.log("answer ditemukan", answer)
            if (answer.author.toString() == req.loggedInUser.id.toString()) {
                next()
            } else {
                throw ("unauthorized access")
            }
          })
          .catch(err => {
              console.log("error in answer authorization", err)
              res.status(404).json("answer not found")
          })  
    },

    adminVerification: function (req,res, next) {
        if(req.headers.hasOwnProperty('token')) {
            console.log("Masuk verifikasi admin", req.headers.hasOwnProperty('token'))
            try {
                const decoded = verify(req.headers.token)
                console.log("Hasil verifikasi JWT admin verification", decoded)
                if (decoded != null) {
                    User
                        .findOne({
                            _id: decoded.id
                        })
                    .then(user => {
                        console.log("hasil find admin", user)
                        if(user.role == 'admin') {
                            req.loggedInUser = user;
                            next();
                        } else {
                            res.status(400).json({
                                message: 'Not Admin Token'
                            })
                        }
                    })
                }
            } catch (err) {
                console.log(err)
                res.status(400).json({
                    message: 'Invalid Token'
                })
            }
        } else {
            res.status(400).json({
                message: 'Please provide token'
            })
        }
    }
}