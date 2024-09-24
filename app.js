const express = require('express');
const app = express();
require("dotenv").config();
require('./config/config');

app.use(express.static('public'));
app.use(express.json());

app.get("/", (req, res) => {
    res.send(`<h1>Hello!</h1>`)
});


module.exports = app;