const pg = require('pg');
const config = require('../config');


module.exports = function databaseSetup(){
  const dbPoolSettings = {
    user: config.database.user,
    database: config.database.database,
    password: config.database.password,
    host: config.database.host,
    port: config.database.port,
    max: config.database.connectionNumber,
    idleTimeoutMillis: config.database.idleTimeoutMillis,
  };

  const pool = new pg.Pool(dbPoolSettings);

  pool.connect( function(err, client, done){
    if(err){
      return console.error('Error fetching client pool for postgres db', err);
    }

    client.query('SELECT $1::int AS NUMBER', [1], function(err, result){
      done();
      if(err){
        return console.error('error running query', err);
      }
      console.log(result.rows[0].number);
    })
  });
}