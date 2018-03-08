function deactivate_service(f, service_name, user) {
    f.query("UPDATE services SET active=0 WHERE service=" + f.con.escape(service_name) + " AND user=" + f.con.escape(user), function (res) {
        f.log(res.affectedRows + ' row(s) updated -> Service Deactivated => [service, user]', 33)
    })
}

function service_from_credentials(f, db_service, fromCookie, cookie_path) {
    if (fromCookie && fromCookie == 'from_cookie') {
        if (cookie_path) f.fs.unlinkSync(cookie_path)
        f.query("UPDATE services SET authFilePath='' WHERE service=" + f.con.escape(db_service.service) + " AND user=" + f.con.escape(db_service.user))
    }

    let service_name = db_service.service,
        user = db_service.user,
        pass = new Buffer(db_service.pass, 'base64').toString()

    if (service_name == 'facebook')
        f.connectFB(f, db_service.user, { email: user, password: pass }, function (fb_user, error) {
            if (error) deactivate_service(f, service_name, user)
            else f.services.push(fb_user)
            f.log('Added Facebook Service from Credentials [' + user + ']', 32)
        })

    if (service_name == 'skype')
        f.connectS(f, user, pass, function (skype_user, error) {
            if (error) deactivate_service(f, service_name, user)
            else f.services.push(skype_user)
            f.log('Added Skype Service from Credentials [' + user + ']', 32)
        })
}

function service_from_cookie(f, db_service) {
    let path = __dirname + '/user_data/' + db_service.authFilePath;
    if (f.fs.existsSync(path)) {
        if (db_service.service == 'facebook')
            f.connectFB(f, db_service.user, { appState: JSON.parse(f.fs.readFileSync(path, 'utf8')) }, function (fb_user, error) {
                if (error) service_from_credentials(f, db_service, 'from_cookie', path)
                else f.services.push(fb_user)
                f.log('Added Facebook Service from Cookie File [' + db_service.authFilePath + ']', 32)
            })
        //skype cookies don't last at all
        if (db_service.service == 'skype')
            service_from_credentials(f, db_service, 'from_cookie')
    } else
        f.log('Cookie File 404 not Found', 31)
}


function load_services(f) { //f -> {services, connectFB, connectS, con, query, wss, fs, log}
    f.query("SELECT userID, service, authFilePath, user, pass, active, name, email, avatar, registration_timestamp FROM services INNER JOIN users ON services.userID = users.id GROUP BY service, user", function (res) {
        for (let i = 0; i < res.length; i++) {

            if (res[i].active == '1')
                if (res[i].authFilePath && res[i].authFilePath.indexOf('.json') !== -1)
                    service_from_cookie(f, res[i])
                else
                    service_from_credentials(f, res[i])
        }

    })
}


module.exports = load_services;
//services password is encrypted, use decodeBase64 to get the pass if needs be authed
//generate cookie file if possible
//set active/inactive, make this part of when requesting service! update live here
//go ahead and add listeners
//let them check `wss.clients` on every message to make sure all the ones that diserve to get stuff do get stuff 
//make it so that it finds the clients and sends them every new thing a service is capable of providing :)
//{"userID":1,"service":"facebook","authFilePath":"100013582237495.json","user":"353877102239","pass":"ZnVja2hlcmhhcmQ=","active":1,"id":1,"name":"Marin","email":"marin.bivol2@mail.dcu.ie","avatar":"https://scontent.xx.fbcdn.net/v/l/t1.0-1/c8.0.50.50/p50x50/27655308_386518601810878_8915518499602564658_n.jpg?oh=9309c15d60ab1b1b702dd1cef7e30ae9&oe=5B0FBD80","facebook_id":"385992951863443","google_id":"100386618708917672815","registration_timestamp":"2018-02-13T23:12:37.000Z"}
//{"userID":1,"service":"skype","authFilePath":"","user":"life4anime8","pass":"bWNuY2MuY29t","active":1,"id":1,"name":"Marin","email":"marin.bivol2@mail.dcu.ie","avatar":"https://scontent.xx.fbcdn.net/v/l/t1.0-1/c8.0.50.50/p50x50/27655308_386518601810878_8915518499602564658_n.jpg?oh=9309c15d60ab1b1b702dd1cef7e30ae9&oe=5B0FBD80","facebook_id":"385992951863443","google_id":"100386618708917672815","registration_timestamp":"2018-02-13T23:12:37.000Z"}
//{"userID":2,"service":"facebook","authFilePath":"","user":"theman_q8@hotmail.com","pass":"NGV5ZXMyMzQ1","active":1,"id":2,"name":"Hasan Fakhra","email":"hasan.fakhra2@mail.dcu.ie","avatar":"https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/10924822_10153055304575890_6949908202469529308_n.jpg?oh=26b2784272ecc2e81c679f7c11cf18ca&oe=5B04C3F4","facebook_id":"10156049544590890","google_id":"111562508196989087927","registration_timestamp":"2018-02-14T12:34:19.000Z"}