# Voting App Backend
## Getting started
### config.js
In the root directory you will need a config file and It should look something like this. Secret should be your own pass phrase as well as all the other info in the config file.

```
module.exports = {
  secret: 'f217eb1cf08662f264f05aeb4',
  database: {
    user: 'dev',
    password: '662f264f05aeb',
    database: 'voting_app',
    host: 'localhost',
    port: '5432',
    connectionNumber: 3,
    idleTimeoutMillis: 30000
  }
}
```
