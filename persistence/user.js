const databaseQuerier = require('./query');
const USERTABLE = '"users"';
const bcrypt = require('bcrypt');

module.exports=function(pool){
  const query = databaseQuerier(pool);

  return {
      
    isUser(user){
      return new Promise(function(resolve, reject){
        const queryPromise = query(`select * from ${USERTABLE} where "user" = '${user}';`);
        queryPromise.then(function(x){
          if(!!x.rows.length){
            resolve();
          } else {
            reject('No such user');
          }
        }).catch(function(err){
          reject(err);
        })
      });
    },

    isRightPassword(password, userData){
      return new Promise(function(resolve, reject){
        if(password === userData.password){
          resolve(userData);
        } else {
          reject('Password was not a match');
        }
      });
    },

    getUser(user, password){
      return new Promise( function(resolve, reject) {
        const queryPromise = query(`select * from ${USERTABLE} where "user" = '${user}';`);
        queryPromise.then(function (x) {
          const result = x.rows[0];
          result.password = result.password.trim();
          result.user = result.user.trim();
          resolve(result);
        }).catch(function (err) {
          reject(err);
        });
      })
    },

    createNewUser(userName, password){
      return new Promise( function(resolve, reject){
        bcrypt.hash(password, 9).then(function(hash) {
          const queryPromise = query(`
            INSERT INTO 
            ${USERTABLE} ("user", "password") 
            VALUES ('${userName}', '${hash}');
          `);
          queryPromise.then(function(x){
            resolve();
          }).catch(function (err){
            reject(`Could not create the user ${userName}. This user name may already be taken`);
          })
        });
      });
    }
  }
}
