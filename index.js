const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');
const users = require('./user.js');

app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('Welcome to a great api');
})

const apiRoutes = express.Router();

apiRoutes.post('/authenticate', function(req, res){
  const userInfo = users.getUser(req.body.name);
  if(users.isUser(req.body.name)){
    if(req.body.password !== '' && req.body.password === userInfo.password){
      res.json({
        token: 'some token'
      });
    }else{
      res.json({
        error: 'Wrong password'
      });
    }
  }else{
    res.json({
      error: 'No user by that name'
    });
  }
});

apiRoutes.get('/', function(req, res){
  res.json({
    test: 'you accessed the api uris'
  });
});

apiRoutes.get('/users', function(req, res){
  res.json(users.getUser('testuser'))
});

app.use('/api', apiRoutes);

app.listen(3333, function(){
  console.log('started server');
})
