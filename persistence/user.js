const databaseQuerier = require('./query');

module.exports=function(pool){
  const query = databaseQuerier(pool);

  return {
      
    isUser(user){
      return new Promise(function(resolve, reject){
        const queryPromise = query(`select * from users where "user" = '${user}';`);
        queryPromise.then(function(x){
          resolve(!!x.rows.length)
        }).catch(function(err){
          reject(err);
        })
      });
    },

    getUser(user){
      return new Promise( function(resolve, reject) {
        const queryPromise = query(`select * from users where "user" = '${user}';`);
        queryPromise.then(function (x) {
          resolve(x.rows[0]);
        }).catch(function (err) {
          reject(err);
        });
      })

    }
  }
}
