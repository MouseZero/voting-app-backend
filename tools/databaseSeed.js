const pg = require('pg');
const config = require('../dbpoolconfig');
const pool = new pg.Pool(config);

pool.connect( function(err, client, done){
  if(err){
    return console.error('Error fetching client pool for postgres db', err);
  }

  //Insert Test User
  client.query(
    `
    INSERT INTO "${config.names.userTable}" ("user", "password") values (\'testuser\', \'password\');
    `, 
    [], 
    function(err, result){
    done();
    if(err){
      return console.error('error running query', err);
    }
  });

});

pool.connect( function(err, client, done){
  if(err){
    return console.error('Error fetching client pool for postgres db', err);
  }

  //Inser A Demo Chart
  client.query(
    `
    INSERT INTO "${config.names.chartTable}"
    ("title", "description", "userId", "data")
    VALUES
    ('demo', 'test data', 1,'{}');
    `,
    [],
    function(err, result){
    done();
    if(err){
      return console.error('error running query', err);
    }
  });
});