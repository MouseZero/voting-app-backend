const pg = require('pg');
const dbPoolSettings = require('../dbpoolconfig');
const pool = new pg.Pool(dbPoolSettings);

pool.connect( function(err, client, done){
  if(err){
    return console.error('Error fetching client pool for postgres db', err);
  }

  client.query(
    //Insert Test User
    `
    INSERT INTO "user" ("user", "password") values (\'testuser\', \'password\');
    ` +
    //Insert A Demo Chart
    `
    INSERT INTO "charts"
    ("title", "description", "userId", "data")
    VALUES
    ('demo', 'test data', 1, '{}');
    `, 
    [], 
    function(err, result){
    done();
    if(err){
      return console.error('error running query', err);
    }
  })
});