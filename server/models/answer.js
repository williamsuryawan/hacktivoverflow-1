const mongoose = require('mongoose')
const Schema = mongoose.Schema

const answerSchema = new Schema ({
      content: {
        type: String,
        required: [true, "answer can't be empty"]
      },
      author: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question"
      },
      upvoters: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
      downvoters: [{
        type: Schema.Types.ObjectId,
        ref: "User" 
      }]
})

const Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer;