//Token setup happens when you are logging into our app.
//This is the name we decided to give to account authentification/registration function

function auth(data, ws, crypto, query, con, log) {

    function token_setup(userID) { //userID fresh from DB
        let token = crypto.randomBytes(32).toString('hex'); //64 bytes random hex string
        query("INSERT INTO devices (userID, token) VALUES ("+userID+",'"+token+"')", function (res) { //collisions happen very infrequently, almost never BUT you can base it of time to remove the chance or use `ON DUPLICATE KEY UPDATE token`
            log(res.affectedRows + " row(s) updated [token]")
            ws.userID = userID; //what userID each connection should care about
            ws.send(JSON.stringify({ token: token })) //only at this point autenticate user
            log('Found User Token, Give the Client back it\'s token', 32)
        })
    }

    query("SELECT * FROM users WHERE facebook_id="+con.escape(data.facebook_id)+" OR google_id="+con.escape(data.google_id)+" OR email=" + con.escape(data.email), function (db_users) {
        if (db_users.length > 0) {
            var user = db_users[0]
            log('Updating database...', 33)
            if (user.name.length != data.name)
                query("UPDATE users SET name=" + con.escape(data.name) + " WHERE id='" + user.id + "'", function (res) {
                    log(res.affectedRows + ' row(s) updated [name]', 33)
                })
            if (data.email && data.google_id.length > 0 && user.email != data.email)
                query("UPDATE users SET email=" + con.escape(data.email) + " WHERE id='" + user.id + "'", function (res) {
                    log(res.affectedRows + " row(s) updated [email]")
                })
            if (user.avatar != data.avatar && data.facebook_id.length > 0) //prioritise facebook avatar
                query("UPDATE users SET avatar=" + con.escape(data.avatar) + " WHERE id='" + user.id + "'", function (res) {
                    log(res.affectedRows + " row(s) updated [avatar]")
                })
            if (user.facebook_id != data.facebook_id && data.facebook_id != '')
                query("UPDATE users SET facebook_id=" + con.escape(data.facebook_id) + " WHERE id='" + user.id + "'", function (res) {
                    log(res.affectedRows + " row(s) updated [facebook_id]")
                })
            if (user.google_id != data.google_id && data.google_id != '')
                query("UPDATE users SET google_id=" + con.escape(data.google_id) + " WHERE id='" + user.id + "'", function (res) {
                    log(res.affectedRows + " row(s) updated [google_id]")
                })
            token_setup(user.id)

        } else {
            query("INSERT INTO users(name, email, avatar, facebook_id, google_id) VALUES ("+con.escape(data.name)+","+con.escape(data.email)+","+
                con.escape(data.avatar)+","+con.escape(data.facebook_id)+","+con.escape(data.google_id)+")", function (res) {
                    log("[Registered New User to Cubik]", 92) //log(res) //OkPacket {fieldCount:0,affectedRows:1,insertId:1,serverStatus:2,warningCount:0,message:'',protocol41:true,changedRows:0}
                    token_setup(res.insertId)
            })
        }
    })
}

module.exports = auth;