require('dotenv').config();
const express = require('express');
const app = express();
const cors = require ('cors')
const mongoose = require('mongoose');

const cron = require('node-cron');
const { send } = require('./helpers/nexmosms')
const kue = require('kue')
const queue = kue.createQueue()

app.use(cors())
// mongoose.connect(`mongodb://localhost/ecommerce-r-${process.env.NODE_ENV}`, { useNewUrlParser: true });
mongoose.connect(`mongodb+srv://${process.env.name}:${process.env.password}@cluster0-dlbfv.mongodb.net/hacktivoverflow?retryWrites=true`, {useNewUrlParser: true})

// const index = require('./routes/index');
const userRouter = require('./routes/users')
const questionRouter = require('./routes/questions')
const answerRouter = require('./routes/answers')
const port = process.env.port || 3000


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use('/', index);
app.use('/users', userRouter)
app.use('/questions', questionRouter)
app.use('/answers', answerRouter)

let cronEveryMonth = '0 7 1 * *'
cron.schedule(cronEveryMonth, () => {
    send(`Happy new month! Dont forget to work hard and refresh your day during weekend!`)
});

queue.process('welcome-newuser', (job, done) => {
    send(`Hello ${job.data} has just registered!`);
    done();
})

kue.app.listen(4000);

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

module.exports = app;