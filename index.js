const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');

app.set('superSecret', config.secret);

app.get('/', function(req, res){
  res.send('Hello World');
})

app.listen(3333, function(){
  console.log('started server');
})
