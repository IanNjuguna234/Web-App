const sql = require('mssql');

const config = {
    user: 's367018@students.cdu.edu.au', // SQL Server username
    password: 'restyR@2843', // SQL Server password
    server: 'scithitdb1.cducloud.cdu.edu.au', // Server name
    database: '', // Database name
    options: {
      encrypt: true, // Use true for Azure SQL Database
      trustServerCertificate: true, // Change to false for production
    },
    // Remove the authentication section since we're using SQL Server Authentication
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch((err) => console.log('Database Connection Failed', err));

module.exports = {
  sql,
  poolPromise,
};