const databaseQuerier = require('./query');
const CHARTSTABLE = '"charts"';

module.exports=function(pool){
  const query = databaseQuerier(pool);

  return {

    createChart({userId, title, desc, data}){
      const validateInput = new Promise( function(resolve, reject){
        if(!userId || !title || !desc || !data){
          reject('Could not create the chart. There is at least one ' +
          'missing input field');
        } else {
          resolve();
        }

      })
      return validateInput.then(function (){
        return query(`
          INSERT INTO ${CHARTSTABLE} 
          ("userId", "title", "description", "data") 
          VALUES 
          ('${userId}', '${title}', '${desc}', '${data}');
        `)
      })
    },


    getChartList(userId){
      return query(`
        SELECT * FROM ${CHARTSTABLE}
        WHERE "userId" = ${userId};
      `)
    },

    getChart(userId, chartId){
      return query(`
        SELECT * FROM ${CHARTSTABLE}
        WHERE "userId" = ${userId}
        AND "id" = ${chartId};
      `);
    }


  }
}
