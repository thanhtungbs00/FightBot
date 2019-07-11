'use strict';

const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');

const {Webhook} = require('./api/webhookproccessing');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// DB Config
const db = require("./config/key").mongoURI;
//console.log(db);

// Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Webhook
app.post('/', async(req, res) => {
  Webhook(req, res);
});

const port = process.env.PORT || 8080;

app.listen(port, function () {
    console.info(`Webhook listening on port ${port}!`)
});