const databaseQuerier = require('./query');
const CHARTSTABLE = '"charts"';

module.exports=function(pool){
  const query = databaseQuerier(pool);

  return {

    createChart({userId, title, desc, data}){
      return query(`
        INSERT INTO "charts" 
        ("userId", "title", "description", "data") 
        VALUES 
        ('${userId}', '${title}', '${desc}', '${data}');
      `)
    }


  }
}
