const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema ({
      title: {
        type: String,
        required: [true, "title can't be empty"]
      }, 
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      description: {
        type: String,
      }, 
      upvoters: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
      downvoters: [{
        type: Schema.Types.ObjectId,
        ref: "User" 
      }],
      answers: [{
        type: Schema.Types.ObjectId,
        ref: "Answer"
      }],
      tags: [{
        type: String
      }],
      createdAt: {
        type: Date,
        default: new Date
      }
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question;