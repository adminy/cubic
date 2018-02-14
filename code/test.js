var mysql = require("mysql");
 
// First you need to create a connection to the db
var con = mysql.createConnection({
      host: "sql32.main-hosting.eu",
      user: "u894154994_cubik",
      password: "password",
      database: "u894154994_cubik"
});
 
con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});
 
con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});
