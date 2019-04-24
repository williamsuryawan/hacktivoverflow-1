require('dotenv').config()
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: process.env.SMSAPIKEY,
  apiSecret: process.env.SMSAPISECRET
})

function send(inputmessage) {
    const from = 'Nexmo'
    const to = '628176488440'
    const text = inputmessage
    nexmo.message.sendSms(from, to, text)
}

module.exports = { send }
