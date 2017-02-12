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

    function createChart({userId, title, desc, data}){
      return validateHasAllInput(4, userId, title, desc, data)
      .then(function (){
        data = JSON.parse(data)
        return query(`
          INSERT INTO ${CHARTSTABLE}
          ("userId", "title", "description", "data")
          VALUES
          ($1, $2, $3, $4);
        `, [userId, title, desc, data])
      })
    }

    function getChartList(userId){
      return validateHasAllInput(1, userId)
      .then( function(){
        return query(`
          SELECT * FROM ${CHARTSTABLE}
          WHERE "userId" = $1;
        `, [userId]);
      });
    }

    function getChart(chartId){
      return validateHasAllInput(1, chartId)
      .then(function (){
        return query(`
        SELECT * FROM ${CHARTSTABLE}
        WHERE "id" = $1;
        `, [chartId]);
      });
    }

    function vote(chartId, voteFor){
      return validateHasAllInput(2, chartId, voteFor)
      .then( () => {
        return query(`
          SELECT * FROM ${CHARTSTABLE}
          WHERE "id" = $1;
        `, [chartId]);
      })
      .then( (data) => {
        const votingData = data[0].data;
        if(votingData[voteFor] || votingData[voteFor] === 0){
          votingData[voteFor] = votingData[voteFor] + 1
        }
        return votingData
      })
      .then( votingData => {
        return query(`
          UPDATE ${CHARTSTABLE}
          SET data = $1
          WHERE id = ${chartId};
        `, [votingData])
      })
    }

    function deleteChart(userId, chartId){
      return validateHasAllInput(2, userId, chartId)
      .then( function(){
        return query(`
          DELETE FROM ${CHARTSTABLE}
          WHERE "userId" = $1
          AND "id" = $2;
        `, [userId, chartId]);
      })
    }

  return {
    createChart,
    getChartList,
    getChart,
    vote,
    deleteChart
  }
}
