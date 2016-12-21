const pg = require('pg');
const config = require('../dbpoolconfig');
const prompt = require('prompt');

const pool = new pg.Pool(config);
const tables = Object.keys(config.names).map(e => config.names[e]);
const sep = ' --> ';

console.log('Are you sure you want to delete tables in ' +
config.host + ':' + config.port + sep +
config.database + sep + 
'[' + tables + ']' +
'\ntype: "yes i do" to confirm\n')

prompt.start();

prompt.get(['answer'], function(err, result){
  if(err){return console.log(err);}
  if(result.answer === 'yes i do'){
    console.log('try to delete tables');
    deleteTables(pool, tables);
  }else{
    console.log('Will not delete database tables this time.')
  }

})

function deleteTables (pool, tables){
  const deleteQuery = tables.reduce((p, e) => p + `DROP TABLE "${e}";`, '')
  pool.connect(function(err, client, done){
    if(err){
      return console.error('Error fetching client pool for postgresql');
    }

    client.query(
      deleteQuery,
      [],
      function(err, result){
        if(err){
          return console.error('error running query', err);
        }
        process.exit();
      }
    )
  })
  console.log(deleteQuery)
}