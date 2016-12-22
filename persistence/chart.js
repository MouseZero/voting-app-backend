const databaseQuerier = require('./query');
const CHARTSTABLE = '"charts"';


function validateHasAllInput(numbeOfArguments){
  const args = Array.prototype.slice.call(arguments, 1);
  return new Promise( function(resolve, reject){
    const isFalsyArg = args.reduce( (prev, elem) => prev || !elem, false);
    if((args.length < numbeOfArguments) || isFalsyArg)
      return reject('Missing at least one input field');
    return resolve();
  });
}

module.exports=function(pool){
  const query = databaseQuerier(pool);

  return {

    createChart({userId, title, desc, data}){
      return validateHasAllInput(4, userId, title, desc, data)
      .then(function (){
        return query(`
          INSERT INTO ${CHARTSTABLE} 
          ("userId", "title", "description", "data") 
          VALUES 
          ('${userId}', '${title}', '${desc}', '${data}');
        `)
      })
    },


    getChartList(userId){
      return validateHasAllInput(1, userId)
      .then( function(){
        return query(`
          SELECT * FROM ${CHARTSTABLE}
          WHERE "userId" = ${userId};
        `)
      });
    },


    getChart(userId, chartId){
      return validateHasAllInput(2, userId, chartId)
      .then(function (){
        return query(`
        SELECT * FROM ${CHARTSTABLE}
        WHERE "userId" = ${userId}
        AND "id" = ${chartId};
        `);
      });
    },

    deleteChart(userId, chartId){
      return validateHasAllInput(2, userId, chartId)
      .then( function(){
        return query(`
          DELETE FROM ${CHARTSTABLE}
          WHERE "userId" = ${userId}
          AND "id" = ${chartId};
        `);
      })
    }


  }
}
