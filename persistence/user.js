const databaseQuerier = require('./query');
const USERTABLE = '"users"';

module.exports=function(pool){
  const query = databaseQuerier(pool);

  return {
      
    isUser(user){
      return new Promise(function(resolve, reject){
        const queryPromise = query(`select * from ${USERTABLE} where "user" = '${user}';`);
        queryPromise.then(function(x){
          resolve(!!x.rows.length)
        }).catch(function(err){
          reject(err);
        })
      });
    },

    getUser(user){
      return new Promise( function(resolve, reject) {
        const queryPromise = query(`select * from ${USERTABLE} where "user" = '${user}';`);
        queryPromise.then(function (x) {
          resolve(x.rows[0]);
        }).catch(function (err) {
          reject(err);
        });
      })
    },

    createNewUser(userName, password){
      return new Promise( function(resolve, reject){
        const queryPromise = query(`INSERT INTO ${USERTABLE} ("user", "password") VALUES ('${userName}', '${password}');`);
        queryPromise.then(function(x){
          resolve(!!x.rows);
        }).catch(function (err){
          reject(err);
        })
      });
    }
  }
}
