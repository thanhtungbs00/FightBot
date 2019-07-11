var express = require('express');
var router = express.Router();
const fs = require('fs');

const {Webhook} = require('../chatbotWebhook');
/* GET users listing. */
router.post('/', function(req, res, next) {
  fs.appendFile('log.txt', req.toString(), err=>{

  });
  fs.appendFile('log.txt', res.toString(), err=> {
    
  })
  
  Webhook(req, res);
  // res.send('respond with a resource');
});

module.exports = router;
