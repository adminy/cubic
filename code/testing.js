var pass = 0;
var fail = 0;
var showErrors = false;


var OBLIGATIONS = require('obligations');
function divide(a, b) {
    OBLIGATIONS.precondition(typeof a === 'number');
    OBLIGATIONS.precondition(typeof b === 'number');
    OBLIGATIONS.precondition(b !== 0, 'May not divide by zero');
    var __result;
    __result = a / b;
    OBLIGATIONS.postcondition(__result < a);
    return __result;
}
alert(divide(10, 0));


/** 
 * Database Testing
 * 
*/

var mysql = require('mysql'),
    db = { host: 'sql32.main-hosting.eu', user: 'u894154994_cubik', password: 'password', port: 3306, database: 'u894154994_cubik', charset: 'utf8mb4', multipleStatements: true },
    connection = mysql.createConnection(db);
    connection.connect(function(err) {
        if (err) {
            if(showErrors) console.error('error: ' + err.message);
            fail++;
        } else {
            pass++;
        }
      });


/**
 * Token Crypto Testing
 * 
 */
var crypto = require("crypto");
let token = crypto.randomBytes(32).toString('hex'); //64 bytes random hex string


