# Voting App Backend
## Getting started
### config.js
In the root directory you will need a config.json file and It should look something like this. Secret should be your own pass phrase as well as all the other info in the config.json file.

```
{
  "secret": "30cfc767b352033635fa20a0d1e16",
  "database": {
    "user": "dev",
    "password": "yourPasswordHere",
    "database": "fcc_voting_app",
    "host": "localhost",
    "port": "5432",
    "connectionNumber": 3,
    "idleTimeoutMillis": 30000
  }
}
```
