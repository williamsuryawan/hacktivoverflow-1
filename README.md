# hacktivoverflow

## Base URL
### Server: http://localhost:3000
### Admin: http://localhost:8080

### Installation and Getting Started (execute this function to run this app in your terminal)
```sh
$ npm init -y (inside root server folder)
$ npm run dev or nodemon app.js (on terminal inside root server folder)
$ nom run serve (on terminal inside root client folder)
```

### Deploy (BETA Version, some bugs still exist)
```sh
Server: xxx
Client: xxx
```

### **User Routing**
HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
POST | users/register | body Object <br> example {name: String, email: String, password: String} | Code: 201 <br> Body: {message: newUser} | Code: 409 <br> Body: {message: internal server error} | register new user to hacktivoverflow
POST | users/login | body Object <br> example {email: String, password: String, loginVia: 'website'} | Code: 200 <br> Body: {token: token} | Code 400 Body: {msg: wrong email/password} | login via website to hacktivoverflow
POST | users/watch | body Object <br> example {watchtype: String, watchedTag: String} | Code: 200 <br> Body: {message: user with updated watchedTagList} | Code 500 Body: {msg: internal server error} | list/unlist tag to authenticated user, for body watchtype, type 'watch' or 'unwatch'


### **Question Routing**

HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
GET | questions |  | Code: 200 <br> Body: [{message: question list}] | Code: 500 <br> Body: {message: internal server error} |show all  questions for all viewers
GET | questions/find/:id |  | params questionId <br> Code: 200 <br> Body: {message: question} | Code: 500 <br> Body: {message: internal server error} |show one question for all viewers (based on qeustion Id)
GET | questions/tags/ |  | query tags (seperate one tag with other tags with space) <br> Code: 200 <br> Body: [{message: question list}] headers token:**Required** | Code: 500 <br> Body: {message: internal server error} |show all  questions for all viewers based on tags (for multiple tags input, use space without comma among tags)
POST | questions/ | body Object <br> example {title: String, description: String, tags: String} <br> headers token:**Required** | Code: 201 <br> Body: {message: newQuestion} | Code: 500 <br> Body: {message: internal server error} | post new question to hacktivoverflow (for multiple tags input, use comma without space among tags)
PUT | questions/upvote/:id | params questionId <br> headers token:**Required** | Code: 200 <br> Body: {message: question with one additional upvote} | Code: 500 <br> Body: {message: can't upvote question} | upvote one question based on question id (Upvote Rule: one author can't upvote more than one time for the same question, one author can undo his upvote by use this router again, one author can't both upvote and downvote for the same question)
PUT | questions/downvote/:id | params questionId <br> headers token:**Required** | Code: 200 <br> Body: {message: question with one additional downvote} | Code: 500 <br> Body: {message: can't downvote question} | downvote one question based on question id (Downvote Rule: one author can't downvote more than one time for the same question, one author can undo his downvote by use this router again, one author can't both upvote and downvote for the same question)
PUT | questions/:id | params questionId <br> headers token:**Required** <br> body Object <br> example {title: String, description: String, tags: String} | Code: 200 <br> Body: {message: updatedQuestion} | Code: 500 <br> Body: {message: can't edit question} | edit one question based on information provided on body (Authorization: only author can edit his own question)
DELETE | questions/:id | params questionId <br> headers admin token:**Required** | Code: 200 <br> Body: {message: deletedQuestion} | Code: 500 <br> Body: {message: can't delete question} | delete one question (Authorization: only author can delete his own question)


### **Answer Routing**

HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
GET | answers/question/:id |  | params questionId Code: 200 <br> Body: [{message: answer list}] | Code: 500 <br> Body: {message: internal server error} | show all answers of one question based on questionId
GET | answers/one/:id |  | params answer Id <br> Code: 200 <br> Body: {message: question} | Code: 500 <br> Body: {message: internal server error} |show one question for all viewers (based on qeustion Id)
POST | answers/ | body Object <br> example {content: String, questionId: String} <br> headers token:**Required** | Code: 201 <br> Body: {message: new Answer} | Code: 500 <br> Body: {message: internal server error} | post new answer to one question based on question Id
PUT | answers/upvote/:id | params answerId <br> headers token:**Required** | Code: 200 <br> Body: {message: answer with one additional upvote} | Code: 500 <br> Body: {message: can't upvote answer} | upvote one answer based on answer id (Upvote Rule: one author can't upvote more than one time for the same answer, one author can undo his upvote by use this router again, one author can't both upvote and downvote for the same answer)
PUT | answers/downvote/:id | params answerId <br> headers token:**Required** | Code: 200 <br> Body: {message: answer with one additional downvote} | Code: 500 <br> Body: {message: can't downvote answer} | downvote one answer based on answer id (Downvote Rule: one author can't downvote more than one time for the same answer, one author can undo his downvote by use this router again, one author can't both upvote and downvote for the same answer)
PUT | answers/:id | params answerId <br> headers token:**Required** <br> body Object <br> example {content: String} | Code: 200 <br> Body: {message: updatedAnswer} | Code: 500 <br> Body: {message: can't edit answer} | edit one answer based on information provided on body (Authorization: only author can edit his own answer)
DELETE | answers/:id | params answerId <br> headers admin token:**Required** | Code: 200 <br> Body: {message: deletedAnswer} | Code: 500 <br> Body: {message: can't delete answer} | delete one answer (Authorization: only author can delete his own answer)