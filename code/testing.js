var OBLIGATIONS = require('obligations');
//OBLIGATIONS.precondition(typeof a === 'number');
//OBLIGATIONS.precondition(typeof b === 'number');
//OBLIGATIONS.precondition(b !== 0, 'May not divide by zero');
// OBLIGATIONS.postcondition(__result < a);
var log = require('./log')
var pass = 0;
var fail = 0;
var tests_runned = 0;


/** test1
 * Database Testing Connection
 * 
*/

function test1() {
    tests_runned++;
    var mysql = require('mysql'),
        db = { host: 'sql32.main-hosting.eu', user: 'u894154994_cubik', password: 'password', port: 3306, database: 'u894154994_cubik', charset: 'utf8mb4', multipleStatements: true },
        connection = mysql.createConnection(db);
        connection.connect(function(error) {
            if (error) {
                log('Database Connection Failed', 31)
                fail++;
            } else {
                log('Database Connected Successfully', 32)
                pass++;
                test2(connection)
            }
            
        })
}


/** test2
 * Query User List with last message, timestamp for each user
 */
function test2(connection) {
    tests_runned++;
    var userID = '0871716236';
    connection.query("SELECT service, userID, name, avatar, (SELECT timestamp FROM messages WHERE threadID=relations.theirID AND message_owner=yourID ORDER BY timestamp DESC LIMIT 1) as timestamp, "+
            "(SELECT content FROM messages WHERE threadID=relations.theirID AND message_owner=yourID ORDER BY timestamp DESC LIMIT 1) as text "+
            "FROM relations INNER JOIN profiles ON relations.theirID=profiles.userID WHERE yourID=" + connection.escape(userID) + " ORDER BY timestamp DESC", function(error, data, fields) {
            if(error) {
                fail++;
                log('Query Failed to Process', 31)
                test3(connection)
            } else {
                pass++;
                log('Query was successful in selecting a contact, with last message of that contact', 32)
                test3(connection, data)
            }
            
    })
}
 
function test3(connection, data) {
    tests_runned++;
    if(data && data.length > 0) {
        pass++;
        log('test2 query resulted with answers', 32)                    
    } else {
        fail++;
        log('test2 query returned nothing', 31)
    }
    test4(connection)
}

function test4(connection) {
    tests_runned++;
    connection.query("SELECT userID, service, authFilePath, user, pass, active, name, email, avatar, registration_timestamp FROM services INNER JOIN users ON services.userID = users.id GROUP BY service, user",
    function(error, data, fields) {
        if(error) {
            fail++;
            log('Query on test4 failed', 31)
            test5(connection)
        } else {
            pass++;
            log('Query was successful on test4', 32)
            test5(connection, data)
        }
    })
}


function test5(connection, data) {
    tests_runned++;
    if(data && data.length > 0) {
        pass++;
        log('Query in test 4 returned results', 32)
    } else {
        fail++;
        log('Query in test 4 failed', 31)
    }
    test6(connection)
}

function test6(connection){
    tests_runned++;
    var token = '12a0cbcefefd6bd2fc6527b28a7a608c7cc70fc9a79a5d58efffee8aa55a1ddf';
    var service = 'facebook'
    connection.query("SELECT user FROM services JOIN devices ON services.userID = devices.userID WHERE service=" + connection.escape(service) + " AND token=" +
                    connection.escape(token), function(error, data, fields){

                        if(error) {
                            fail++;
                            log('Query on test6 failed', 31)
                            test7(connection)
                        } else {
                            pass++;
                            log('Query was successful on test6', 32)
                            test7(connection, data)
                        }
    })
}

function test7(connection,data){

    tests_runned++
    if(data && data.length >0){
        pass++;
        log('Query in test 6 returned results',32)
    } else {

        fail++
        log('Query in test 6 failed',31)
    }
    test8(connection)
}

function test8(connection){
    tests_runned++;
    var token = '12a0cbcefefd6bd2fc6527b28a7a608c7cc70fc9a79a5d58efffee8aa55a1ddf';
    var service = 'facebook'
    var get_message = '8:petrica.duhlicher'
    connection.query("SELECT message_owner, avatar, name, messages.service, threadID, id, messages.type, senderID, timestamp, content FROM messages "+
    "JOIN services ON messages.message_owner=services.user AND messages.service=services.service "+
    "JOIN devices ON services.userID = devices.userID "+
    "JOIN profiles ON profiles.userID = messages.threadID "+
    "WHERE messages.service="+connection.escape(service)+
    " AND threadID="+connection.escape(get_message)+" AND token="+connection.escape(token) +
    " ORDER BY timestamp DESC LIMIT 50", function(error, data, fields){

                        if(error) {
                            fail++;
                            log('Query on test8 failed', 31)
                            test9(connection)
                        } else {
                            pass++;
                            log('Query was successful on test8', 32)
                            test9(connection, data)
                        }
    })
}

function test9(connection,data){

    tests_runned++
    if(data &&data.length > 0){
        pass++;
        log('Query in test 8 returned results',32)
    }else {

        fail++;
        log('Query in test 8 failed',31)
    }
    test10(connection)
}

function test10(connection){
    tests_runned++;
    var token = '12a0cbcefefd6bd2fc6527b28a7a608c7cc70fc9a79a5d58efffee8aa55a1ddf';
    connection.query("SELECT userID FROM devices WHERE token=" + connection.escape(token), function(error, data, fields){

                        if(error) {
                            fail++;
                            log('Query on test10 failed', 31)
                            tes11(connection)
                        } else {
                            pass++;
                            log('Query was successful on test10', 32)
                            test11(connection, data)
                        }
    })
}

function test11(connection,data){

    tests_runned++
    if(data &&data.length > 0){
        pass++;
        log('Query in test 10 returned results',32)
    }else {

        fail++;
        log('Query in test 10 failed',31)
    }
    test12(connection)
}

function test12(connection){
    tests_runned++;
    var name = 'testing'
    var service = 'skype'
    var userID ='8:life4anime8'
    connection.query("INSERT INTO groups_info(name, services, owner, avatar) VALUES ("+connection.escape(name) + ","+ connection.escape(service) +","+ connection.escape(userID) +",'https://i.imgur.com/gKCrzGD.png') ON DUPLICATE KEY UPDATE avatar=avatar", function(error, data, fields){

                        if(error) {
                            fail++;
                            log('Query on test12 failed', 31)
                            tes13(connection)
                        } else {
                            pass++;
                            log('Query was successful on test12', 32)
                            test13(connection, data)
                        }
    })
}

function test13(connection,data){

    tests_runned++
    if(data &&data.length > 0){
        pass++;
        log('Query in test 12 returned results',32)
    }else {

        fail++;
        log('Query in test 12 failed',31)
    }
    test14(connection)
}

function test14(connection){
    tests_runned++;
    var group_msg= '26'
    connection.query("SELECT groupID, service, groups.userID, name, avatar FROM groups JOIN profiles ON groups.userID=profiles.userID WHERE groupID="+connection.escape(group_msg), function(error, data, fields){

                        if(error) {
                            fail++;
                            log('Query on test14 failed', 31)
                            tes15(connection)
                        } else {
                            pass++;
                            log('Query was successful on test14', 32)
                            test15(connection, data)
                        }
    })
}

function test15(connection,data){

    tests_runned++
    if(data &&data.length > 0){
        pass++;
        log('Query in test 14 returned results',32)
    }else {

        fail++;
        log('Query in test 14 failed',31)
    }
    test16(connection)
}

/////////////////////////////Server Queries done///////////////////////////

//service auth test

function test16(connection){
            tests_runned++;
            var token='12a0cbcefefd6bd2fc6527b28a7a608c7cc70fc9a79a5d58efffee8aa55a1ddf'
            var service='facebook'
            var user ='donnasaurrrr4@gmail.com'
            connection.query("SELECT userID FROM devices WHERE token=" + connection.escape(token) +
            ";SELECT COUNT(services.userID) AS found FROM devices JOIN services ON devices.userID = services.userID WHERE token=" + connection.escape(token) +
            " AND service=" + connection.escape(service) + " AND user=" + connection.escape(user), function(error, data, fields){
        
                                if(error) {
                                    fail++;
                                    log('Query on test16 failed', 31)
                                    tes17(connection)
                                } else {
                                    pass++;
                                    log('Query was successful on test16', 32)
                                    test17(connection, data)
                                }
            })
        }

function test17(connection,data){

            tests_runned++
            if(data &&data.length > 0){
                pass++;
                log('Query in test 16 returned results',32)
            }else {
        
                fail++;
                log('Query in test 16 failed',31)
            }
            test18(connection)
        }

    function test18(connection){
            tests_runned++;
            var facebookID= '10156049544590890'
            var googleID ='111562508196989087927'
            var email ='hasan.fakhra2@mail.dcu.ie'

            connection.query("SELECT * FROM users WHERE facebook_id="+connection.escape(facebookID)+" OR google_id="+connection.escape(googleID)+" OR email=" + connection.escape(email), function(error, data, fields){
        
                                if(error) {
                                    fail++;
                                    log('Query on test18 failed', 31)
                                    tes19(connection)
                                } else {
                                    pass++;
                                    log('Query was successful on test18', 32)
                                    test19(connection, data)
                                }
            })
        }

        function test19(connection,data){

            tests_runned++
            if(data &&data.length > 0){
                pass++;
                log('Query in test 18 returned results',32)
            }else {
        
                fail++;
                log('Query in test 18 failed',31)
            }
            test20(connection)
        }

        function test20(connection){
            tests_runned++;
            var facebookid= '385992951863443'
            var googleid ='100386618708917672815'
            var email ='marin.bivol2@mail.dcu.ie'
            var name ='Marin'
            var avatar = 'https://scontent.xx.fbcdn.net/v/l/t1.0-1/c8.0.50.50/p50x50/27655308_386518601810878_8915518499602564658_n.jpg?oh=33025ee9f66c15e9cba7c86463d8b78b&oe=5B374A80'

            connection.query("INSERT INTO users(name, email, avatar, facebook_id, google_id) VALUES ("+connection.escape(name)+","+connection.escape(email)+","+
            connection.escape(avatar)+","+connection.escape(facebookid)+","+connection.escape(googleid)+")", function(error, data, fields){
        
                                if(error) {
                                    fail++;
                                    log('Query on test20 failed', 31)
                                    test21(connection)
                                } else {
                                    pass++;
                                    log('Query was successful on test20', 32)
                                    test21(connection, data)
                                }
            })
        }

        function test21(connection,data){
            tests_runned++
            if(data &&data.length > 0){
                pass++;
                log('Query in test 20 returned results',32)
            }else {
        
                fail++;
                log('Query in test 20 failed',31)
            }
            test22(connection)
        } 



        function test22(connection){
            tests_runned++;
            var user = '0871716236'

            connection.query("SELECT userID FROM services WHERE user=" + connection.escape(user), function(error, data, fields){
        
                                if(error) {
                                    fail++;
                                    log('Query on test22 failed', 31)
                                    tes23(connection)
                                } else {
                                    pass++;
                                    log('Query was successful on test22', 32)
                                    test23(connection, data)
                                }
            })
        }
        function test23(connection,data){

            tests_runned++
            if(data &&data.length > 0){
                pass++;
                log('Query in test 22 returned results',32)
            }else {
        
                fail++;
                log('Query in test 22 failed',31)
            }
            test24(connection)
        }


        function test24(connection){
            tests_runned++;
            var user = 'theman_q8@hotmail.com'
            var cookie_file = '778695889.json'

            connection.query("UPDATE services SET authFilePath=" + connection.escape(cookie_file) + " WHERE user=" + connection.escape(user) + " AND service='facebook'", function(error, data, fields){
        
                                if(error) {
                                    fail++;
                                    log('Query on test24 failed', 31)
                                    tes25(connection)
                                } else {
                                    pass++;
                                    log('Query was successful on test24', 32)
                                    test25(connection, data)
                                }
            })
        }

function test25(connection,data){

            tests_runned++
            if(data &&data.length > 0){
                pass++;
                log('Query in test 24 returned results',32)
            }else {
        
                fail++;
                log('Query in test 24 failed',31)
            }
            test26(connection)
        }

        function test26(connection){
                        tests_runned++;
                        var user ='0871716236'
                        var conversationID='8:life4anime8'
                        var id ='1520450048223'
                        var type ='text'
                        var fromID ='8:life4anime8'
                        var resID='1520450048223'
                        var content ='Hallo'


            
                        connection.query( "INSERT INTO messages(message_owner, service, threadID, id, type, senderID, timestamp, content) VALUES ("+
                        connection.escape(user)+",'skype',"+
                        connection.escape(conversationID)+","+
                        connection.escape(id)+","+
                        connection.escape((type == 'RichText') ? 'text' : 'other')+","+
                        connection.escape(fromID)+","+
                        connection.escape(resID)+","+
                        connection.escape(content) + ")  ON DUPLICATE KEY UPDATE timestamp=timestamp", function(error, data, fields){
                    
                                            if(error) {
                                                fail++;
                                                log('Query on test26 failed', 31)
                                                tes27(connection)
                                            } else {
                                                pass++;
                                                log('Query was successful on test26', 32)
                                                test27(connection, data)
                                            }
                        })
                    }

                function test27(connection,data){

                        tests_runned++
                        if(data &&data.length > 0){
                            pass++;
                            log('Query in test 26 returned results',32)
                        }else {
                    
                            fail++;
                            log('Query in test 26 failed',31)
                        }
                        test30(connection)
                    }


function test30(connection) {
    connection.end()
    security_tests()
}

/** DATABASE TESTING
 * 
 */
function database_tests() {
    test1() //-> test2 -> test3 -> test4 -> test5 -> test6 -> test7 -> test8
}


/** SECURITY TESTING
 * Token Crypto Testing
 * 
 */

function test_1() {
    tests_runned++
    var crypto = require("crypto");
    let token = crypto.randomBytes(32).toString('hex'); //64 bytes random hex string
    if(token.length == 64) {
        pass++;
    } else {
        fail++;
    }
    test_2(crypto)
}

function test_2(crypto) {
    tests_runned++
    let token = crypto.randomBytes(32).toString('hex'); //64 bytes random hex string
    if(token.length == 64) {
        pass++;
    } else {
        fail++;
    }
    finish()
}

function security_tests() {
    test_1() //-> test_2 -> test_3
}

database_tests() //-> security_tests() -> ....
function finish() {
    log("The end of tests, stats:", 33)
    log("Pass:" + pass, 32)
    log("Fail:" + fail, 31)
    log("Tests Runned:" + tests_runned + "/29")   
}
