const express = require('express');
const apiRoutes = express.Router();
const jwt = require('jsonwebtoken');

const pg = require('pg');
const config = require('../dbpoolconfig');
const pool = new pg.Pool(config);
const users = require('../persistence/user.js')(pool);

module.exports = function(app, express){

  apiRoutes.post('/authenticate', function(req, res){
    const userInfo = users.getUser(req.body.name);
    isUser = users.isUser(req.body.name)
    isUser.then(function(isUser){
      if(isUser){
        userData = users.getUser(req.body.name);
        userData.then(function(userData){
          res.json(userData);
        }).catch(function (err){
          console.log(err);
        });
      } else {
        res.json({success: false, message: 'That is not a valid user'})
      }
    }).catch(function(x){
      res.json({success: false, message: x});
    })
  });

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

  apiRoutes.get('/users', function(req, res){
    res.json(users.getUser('testuser'))
  });

  app.use('/api', apiRoutes);

}
