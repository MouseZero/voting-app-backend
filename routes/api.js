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
    .catch(function(err){
      res.json({success: false, message: err});
    })
  });


  apiRoutes.post('/create/user', function(req, res){
    users.createNewUser(req.body.name, req.body.password)
    .then(function(){
      res.json({success: true, message: `Created the ${req.body.name} user.`})
    }).catch(function(err){
      res.json({success: false, message: err});
    });
  });


  apiRoutes.get('/chart', function(req, res){
    charts.getChart(req.query.chartId)
    .then( function(x){
      res.json({
        success: true,
        info: x
      });
    })
    .catch( function(err){
      res.json({success: false, message: err});
    });
  });

  apiRoutes.get('/latestcharts', function(req, res){
    charts.getLatestCharts()
    .then( charts => {
      res.json({
        success: true,
        info: charts
      })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
  });

  apiRoutes.get('/vote', function(req, res){
    charts.vote(req.query.chartid, req.query.votefor)
    .then( chart => {
      res.json({
        success: true,
        info: chart
      })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
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
      res.json({success: false, message: err});
    });
  });


  apiRoutes.get('/', function(req, res){
    res.json({
      test: 'you accessed the api URIs'
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
      res.json({success: false, message: err});
    });
  });


  apiRoutes.get('/charts', function(req, res){
    charts.getChartList(req.decoded.id)
    .then( function(x){
        res.json({
            success: true,
            charts: x
        });
    })
    .catch( function(err){
      res.json({success: false, message: err});
    });
  });


  apiRoutes.delete('/delete/chart', function(req, res){
    console.log('delete api is called');
    charts.deleteChart(req.decoded.id, req.body.chartId)
    .then( function(x){
      res.json({success: true, info: x})
    })
    .catch( function(err){res.json({success: false, message: err});});
  });


  app.use('/api', apiRoutes);

}
