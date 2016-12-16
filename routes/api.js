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
    userProm = users.isUser(req.body.name)
    userProm.then(function(x){
      res.json({success: true, user: x})
    }).catch(function(x){
      res.json({success: false, message: x});
    })
    // if(users.isUser(req.body.name)){
    //   if(req.body.password !== '' && req.body.password === userInfo.password){
    //     const token = jwt.sign({id: userInfo.id}, app.get('superSecret'), {
    //       expiresIn: 86400
    //     });
    //     res.json({
    //       success: true,
    //       token: token
    //     });
    //   }else{
    //     res.json({
    //       success: false,
    //       error: 'Wrong password'
    //     });
    //   }
    // }else{
    //   res.json({
    //     success: false,
    //     error: 'No user by that name'
    //   });
    // }
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
