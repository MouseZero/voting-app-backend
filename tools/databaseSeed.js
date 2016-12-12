const pg = require('pg');
const dbPoolSettings = require('../dbpoolconfig');
const pool = new pg.Pool(dbPoolSettings);

pool.connect( function(err, client, done){
  if(err){
    return console.error('Error fetching client pool for postgres db', err);
  }

  client.query('INSERT INTO "user" ("user", "password") values (\'testuser\', \'password\');', [], function(err, result){
    done();
    if(err){
      return console.error('error running query', err);
    }
  })
});