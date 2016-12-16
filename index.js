const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/api');
const config = require('./config');

app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS
app.use(function (req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
  res.send('Welcome to a great api');
})

routes(app, express);

app.listen(3333, function(){
  console.log('started server');
})
