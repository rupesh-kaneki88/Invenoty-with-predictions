const express = require("express");
const app = express();
const email = require('../controller/email')

app.post('/',email.send_mail)

module.exports = app
