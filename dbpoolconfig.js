const config = require('./config.json');

module.exports = {
  user: config.database.user,
  database: config.database.database,
  password: config.database.password,
  host: config.database.host,
  port: config.database.port,
  max: config.database.connectionNumber,
  idleTimeoutMillis: config.database.idleTimeoutMillis,
  names: {
    chartTable: 'charts',
    userTable: 'users'
  }
}
