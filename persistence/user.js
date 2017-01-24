const databaseQuerier = require('./query');
const USERTABLE = '"users"';
const bcrypt = require('bcrypt');

module.exports=function(pool){
  const query = databaseQuerier(pool);

  return {

    isUser(user){
      return new Promise(function(resolve, reject){
        query(`select * from $1 where "user" = '$2';`
          ,[USERTABLE, user])
        .then(function(x){
          if(!!x.length){
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
      return bcrypt.compare(password, userData.password)
      .then( function(isMatch){
        if(isMatch){
          return new Promise(resolve => {resolve(userData)});
        } else {
          return new Promise( (_, reject)=>{reject('Password did not match')});
        }
      });
    },

    getUser(user, password){
      return new Promise( function(resolve, reject) {
        query(`select * from $1 where "user" = '$2';`
          , [USERTABLE, user])
        .then(function (x) {
          const result = x[0];
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
            $1 ("user", "password") 
            VALUES ('$2', '$3');
          `, [USERTABLE, userName, hash]);
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
