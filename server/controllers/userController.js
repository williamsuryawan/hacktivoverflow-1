const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwtConvert = require('../helpers/jwtConvert');
const kue = require('kue')
const queue = kue.createQueue()
const { send } = require('../helpers/nexmosms')

class UserController {
    static findUser (req,res) {
        let findMe = {}
        User
            .find(findMe)
            .then(users => {
                res.status(200).json(users)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }

    static register (req,res) {
        console.log("masuk ke register", req.body)
        User
            .create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: 'user'
            })
            .then(newUser => {
                console.log("Hasil user baru", newUser)
                res.status(201).json(newUser)
                // send(`Congrats, a new user has registered! Email ${newUser.email}, Name ${newUser.name}`)
                queue.create('welcome-newuser', {
                    data: newUser.email }).save()
            })
            .catch(err => {
              console.log("terjadi error add users", err)  
              if (err.errors.email) {
                    res.status(409).json(err);
                } else if(err.errors.phone) {
                    res.status(409).json(err);
                } else {
                    res.status(500).json(err);
                }
            }) 
    }

    static login (req,res) {
        if (req.body.loginVia == 'website') {
          console.log("masuk ke login", req.body)  
          User
                .findOne({
                    email: req.body.email
                })
                .then(user => {
                    if(!user) {
                        res.status(403).json({
                            message: `Wrong Email/Password`
                        })
                    } else {
                        let isValid = bcrypt.compareSync(req.body.password, user.password)
                        console.log("Cek validity==>", isValid)
                        if(isValid) {
                            let token = jwtConvert.sign({id: user._id, email: user.email})
                            console.log("Token dihasilkan token", token)
                            res.status(200).json({
                                token: token,
                                id: user._id
                            })
                        } else {
                            res.status(403).json({
                                message: 'Wrong Email/Password'
                            })
                        }
                    }
                })
        } else if (req.body.loginVia == 'googleSignIn') {
          console.log("masuk googlesign in", req.body)
          
        }
    }

    static getUserDetail (req,res) {
        User
          .findOne({
              email: req.loggedInUser.email
            })
          .then(user =>{
            console.log("hasil getuserdetail: ", user)
            res.status(200).json({
                msg: `Detail of user ${user.name}`,
                data: user
            })
          })
          .catch(error =>{
            res.status(500).json({
                msg: 'ERROR: ',error
            })
          })
    }
    static verifyToken (req,res) {
      console.log("masuk ke token verification", req.headers)
      try {
        let result = jwtConvert.jwtVerification(req.headers)
        console.log("hasil token verification", result)
        res.status(200).json({
          msg: `JWT Verification Result`,
          data: result
        })
      } catch (err) {
          res.status(409).json({
            msg: 'ERROR: ',error
        })
      }

    } 

    static editUser (req,res) {
      console.log("Masuk ke edit user", req.body, req.loggedInUser)
      User.findOne({
          "_id": req.loggedInUser.id
      })
      .then (user => {
          console.log("Hasil pencarian user: ", user)
          return User.findOneAndUpdate({
              _id: req.loggedInUser.id
          }, {
              name: req.body.name,
              email: req.body.email,
              password: user.password,
              listWatchedTag: user.listWatchedTag,
          }, {new: true})
          .then(userupdate => {
              console.log("Hasil Edit", userupdate)
              res.status(200).json(userupdate)
          })
      })
      .catch(error => {
          res.status(500).json({
              msg: 'ERROR in finding user to edit ',error           
          }) 
          console.log("error edit user", error)
      })
    }

    static watchingTags (req, res) {
        console.log("masuk ke method watching tags", req.loggedInUser, req.body)
        User.findOne({
            "_id": req.loggedInUser.id
            })
          .then(user => {
                console.log(user.listWatchedTag, req.body)
                if(req.body.watchtype == "unwatch") {
                    console.log("masuk ke unwatch a tag")
                    if(user.listWatchedTag.includes(req.body.watchedTag.toLowerCase())) {
                        user.listWatchedTag.splice(user.listWatchedTag.indexOf(req.body.watchedTag.toLowerCase()), 1)
                        return User.findOneAndUpdate({
                            _id: req.loggedInUser.id
                        }, {
                            name: user.name,
                            email: user.email,
                            password: user.password,
                            listWatchedTag: user.listWatchedTag,
                        }, {new: true})
                        .then(userupdate => {
                            console.log("Hasil unwatch the tag", userupdate)
                            res.status(200).json(userupdate)
                        })
                    } else {
                        res.status(400).json({message: `You haven't watched this watched tag`})
                    }
                } else {
                    console.log("masuk ke watch a tag")
                    if (!user.listWatchedTag.includes(req.body.watchedTag.toLowerCase())) {
                        console.log("masuk sini 2 ===")
                        user.listWatchedTag.push(req.body.watchedTag.toLowerCase())
                        return User.findOneAndUpdate({
                            _id: req.loggedInUser.id
                        }, {
                            name: user.name,
                            email: user.email,
                            password: user.password,
                            listWatchedTag: user.listWatchedTag,
                        }, {new: true})
                        .then(userupdate => {
                            console.log("Hasil watch new tag", userupdate)
                            res.status(200).json(userupdate)
                        })
                    } else {
                        res.status(400).json({message: `You have watched this tag`})
                    }
                }
          })
          .catch(error => {
            console.log("terjadi error watch tag", error)
            res.status(500).json({message: `fail to watch`})
          })
      }
}

module.exports = UserController;