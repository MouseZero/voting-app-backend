const express = require('express');
const apiRoutes = express.Router();
const jwt = require('jsonwebtoken');
const jwtPromise = require('../util/jwtPromise');

const pg = require('pg');
const config = require('../dbpoolconfig');
const pool = new pg.Pool(config);
const users = require('../persistence/user.js')(pool);
const charts = require('../persistence/chart.js')(pool);

module.exports = function(app, express){


  apiRoutes.post('/authenticate', function(req, res){

    users.isUser(req.body.name)
    .then(function(){
      return users.getUser(req.body.name, req.body.password);
    })
    .then(function (userData){
      return users.isRightPassword(req.body.password, userData);
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


  apiRoutes.post('/create/user', function(req, res){

    users.createNewUser(req.body.name, req.body.password)
    .then(function(created){
      res.json({success: true, message: `Created the ${req.body.name} user.`})
    }).catch(function(err){
      res.json({success: false, message: err});
    });
  });


  // Middleware that requires a token for the rest of the API end points
  apiRoutes.use(function(req, res, next){
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    jwtPromise.verify(token, app.get('superSecret'))
    .then( function (decoded){
      req.decoded = decoded;
      next();
    })
    .catch( function(err){
      res.json({
        success: false,
        message: err
      });
    });
  });


  apiRoutes.get('/', function(req, res){
    res.json({
      test: 'you accessed the api uris'
    });
  });


  apiRoutes.post('/create/chart', function(req, res){
      const {title, desc, data} = req.body;
      const chartObject = {
        userId: req.decoded.id,
        title,
        desc,
        data
      }
    charts.createChart(chartObject)
    .then( function(x, err){
      res.json({
        success: true,
        message: 'Added chart'
      })
    })
    .catch( function(err){
      res.json({
        success: false,
        message: err
      })
    });
  });


  app.use('/api', apiRoutes);

}
