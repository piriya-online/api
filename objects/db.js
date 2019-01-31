const sql = require('mssql');
const config = require('./../config.js');

const poolPromise = new sql.ConnectionPool(config.mssql)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}