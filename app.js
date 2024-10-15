const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');


const apiUserroutes = require('./routes/api/authApi');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cors = require('cors');


require("dotenv").config();
require('./config/config');



app.use(cors());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static('public'));
app.use(express.json());


app.use("/api", apiUserroutes);



module.exports = app;