const express = require('express');
const apiRoutes = express.Router();
const jwt = require('jsonwebtoken');

const pg = require('pg');
const config = require('../dbpoolconfig');
const pool = new pg.Pool(config);
const users = require('../persistence/user.js')(pool);

module.exports = function(app, express){

  apiRoutes.post('/authenticate', function(req, res){
    isUser = users.isUser(req.body.name)

    isUser
    .then(function(){
      return users.getUser(req.body.name, req.body.password);
    })
    .then(function (userData){
      const token = jwt.sign({id: userData.id}, app.get('superSecret'), {
        expiresIn: 86400
      });
      res.json({
        success: true,
        token: token
      });
    })
    .catch(function(x){
      res.json({success: false, message: x});
    })
  });

  apiRoutes.post('/test', function(req, res){
    const addUser = users.createNewUser(req.body.name, req.body.password);
    addUser.then(function(created){
      res.json({success: true, message: `Created the ${req.body.name} user.`})
    }).catch(function(err){
      res.json({success: false, message: err});
    });
  });

  // Middleware that requires a token for the rest of the API end points
  apiRoutes.use(function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
      console.log('jwt.verify not called yet ' + token);
      jwt.verify(token, app.get('superSecret'), function(err, decoded){
        if(err){
          return res.json({success: false, message: 'Failed to authenticate token'});
        }else{
          req.decoded = decoded;
          next();
        }
      });
    }else{
      return res.status(403).send({
        success: false,
        message: 'No token provided'
      })
    }
  });


  apiRoutes.get('/', function(req, res){
    res.json({
      test: 'you accessed the api uris'
    });
  });

  app.use('/api', apiRoutes);

}
