const databaseQuerier = require('./query');
const USERTABLE = '"users"';
const bcrypt = require('bcrypt');

module.exports=function(pool){
  const query = databaseQuerier(pool);

  return {

    isUser(user){
      return new Promise(function(resolve, reject){
        query(`select * from ${USERTABLE} where "user" = $1;`, [user])
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
        query(`select * from ${USERTABLE} where "user" = $1;`, [user])
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
        hasUserInDB(userName, query)
        .then(function(){
          return bcrypt.hash(password, 9)
        })
        .then(function(hash){
          return query(`
            INSERT INTO
            ${USERTABLE} ("user", "password")
            VALUES ($1, $2);
          `, [userName, hash]);
        })
        .then(function(data){
          resolve();
        })
        .catch(function(err){
          reject(err);
        })
      });
    },

  }
}

function hasUserInDB(userName, query){
  return new Promise( function(resolve, reject){
    const answer = query(`
      select COUNT(*) from "users"
      where "user" = $1
      ;
    `, [userName]);
    answer.then((data) => {
      const isNoOtherUserWithName = !parseInt(data[0].count);
      isNoOtherUserWithName && resolve();
      reject('There is already a user with that name');
    })
    .catch((err) => {
      reject(err)
    });
  });
}
