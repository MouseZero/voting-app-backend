const databaseQuerier = require('./query');
const CHARTSTABLE = '"charts"';

module.exports=function(pool){
  const query = databaseQuerier(pool);

  return {

    createChart({userId, title, desc, data}){
      const validateInput = new Promise( function(resolve, reject){
        if(!userId || !title || !desc || !data){
          console.log('fails here');
          reject('Could not create the chart. There is at least one ' +
          'missing input field');
        } else {
          console.log('gets here');
          resolve();
        }

      })
      return validateInput.then(function (){
        return query(`
          INSERT INTO "charts" 
          ("userId", "title", "description", "data") 
          VALUES 
          ('${userId}', '${title}', '${desc}', '${data}');
        `)
      })
      .then( function(x){
        console.log(x);
        return new Promise();
      });
    }


  }
}
