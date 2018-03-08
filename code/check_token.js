//This is to save the hassle of logging in every single time 
//if you're using the same device twice instead check a cookie token

/**
 * @param {string} token - user provided token
 * @param {WebSocket} ws - socket connection
 * @param {DB} con  - database connection
 * @param {*} query - abstracted way of making a query using `con`
 * @param {*} log - log information like affected rows, user login 
 */

function check_token(token, ws, con, query, log) {
    function give_token(userID) {
        ws.userID = userID; //what userID each connection should care about
        ws.send(JSON.stringify({ token: token }))
        log('Found User Token, Give the Client back it\'s token', 32)
    }

    function ask_2_login() {
        ws.send(JSON.stringify({ ask_login: 'token_not_found' }))
        log('User has to Log In!', 31)
    }

    query("SELECT id FROM users JOIN devices ON users.id = devices.userID WHERE token=" + con.escape(token), function (db_users) {
        if (db_users.length > 0) give_token(db_users[0].id)
        else ask_2_login()
    })
}

module.exports = check_token;