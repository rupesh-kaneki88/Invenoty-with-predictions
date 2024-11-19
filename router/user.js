const express = require("express");
const app = express();

const user = require('../controller/user')

app.post('/login',user.login)
app.get('/login',user.loginGet)
app.post('/register',user.signup)

module.exports = app