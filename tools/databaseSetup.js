const pg = require('pg');
const dbPoolSettings = require('../dbpoolconfig');
const pool = new pg.Pool(dbPoolSettings);

pool.connect( function(err, client, done){
  if(err){
    return console.error('Error fetching client pool for postgres db', err);
  }

  client.query(
    //Create User Table
    'CREATE TABLE "user" ' + 
      '( id serial NOT NULL, ' +
      '"user" character(30) NOT NULL, ' +
      'password character(100) NOT NULL, ' +
      'CONSTRAINT unique_id UNIQUE (id), ' +
      'CONSTRAINT unique_user UNIQUE ("user") ) WITH ( OIDS=FALSE ); ' +
    //Create Chart Table
      'CREATE TABLE charts(' +
      'id serial NOT NULL,' +
      'title character(150),' +
      'description character(400),' +
      'data json)WITH (  OIDS=FALSE);', 
    [], 
    function(err, result){
      done();
      if(err){
        return console.error('error running query', err);
      }
  });
});