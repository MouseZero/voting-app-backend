const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');

app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('Welcome to a great api');
})

const apiRoutes = express.Router();

apiRoutes.get('/', function(req, res){
  res.json({
    test: 'you accessed the api uris'
  });
});

app.use('/api', apiRoutes);

app.listen(3333, function(){
  console.log('started server');
})
