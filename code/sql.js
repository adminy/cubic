/** 
 * This is an MYSQL interface which creates a query returns query result and closes connection
 * @type mysql - database api
 * @type db {json} - connection details
*/

var mysql = require('mysql'),
    db = { // "mysql://u894154994_cubik:password@sql32.main-hosting.eu:3306/u894154994_cubik"
        host: 'sql32.main-hosting.eu',
        user: 'u894154994_cubik',
        password: 'password',
        port: 3306,
        database: 'u894154994_cubik',
        charset : 'utf8mb4',
        multipleStatements: true
      }, con = mysql.createConnection(db);

con.on('error', function(err){ console.log(err.code); });
    
/**
 * @param {string} sql - any sql query [CREATE, DROP, SELECT, INSERT, UPDATE, DELETE] 
 * @param {*} callback - function which takes the result
 */
function query(sql, callback) {
    con.query(sql, function (err, data, fields) {
        if(err) throw console.error(err);
        callback(data, fields)
    })
    con.end();
    con = mysql.createConnection(db);
}

//this file is required by `server.js`
module.exports = query;