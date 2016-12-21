const pg = require('pg');
const config = require('../dbpoolconfig');
const pool = new pg.Pool(config);

pool.connect( function(err, client, done){
  if(err){
    return console.error('Error fetching client pool for postgres db', err);
  }

  client.query(
    //Create User Table
    `
    CREATE TABLE "${config.names.userTable}"
    (
      id serial NOT NULL,
      "user" character(30) NOT NULL,
      password character(100) NOT NULL,
      CONSTRAINT unique_id PRIMARY KEY (id),
      CONSTRAINT unique_user UNIQUE ("user")
    )
    WITH (
      OIDS=FALSE
    );
    ` +
    //Create Chart Table
    `
    CREATE TABLE "${config.names.chartTable}"
    (
      id serial NOT NULL,
      title character(150) NOT NULL,
      description character(400) NOT NULL,
      data json NOT NULL,
      "userId" integer NOT NULL,
      CONSTRAINT charts_pkey PRIMARY KEY (id),
      CONSTRAINT lnk_user_charts FOREIGN KEY ("userId")
          REFERENCES "${config.names.userTable}" (id) MATCH FULL
          ON UPDATE RESTRICT ON DELETE CASCADE
    )
    WITH (
      OIDS=FALSE
    );
    `, 
    [], 
    function(err, result){
      if(err){
        return console.error('error running query', err);
      }
      process.exit();
  });
});
