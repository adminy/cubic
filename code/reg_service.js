
function register_service(data, ws, con, query, log, load_services, tools) {
    //make a check for ' || " || `
    query("SELECT userID FROM devices WHERE token=" + con.escape(data.token) +
        ";SELECT COUNT(services.userID) AS found FROM devices JOIN services ON devices.userID = services.userID WHERE token=" + con.escape(data.token) +
        " AND service=" + con.escape(data.service_name) + " AND user=" + con.escape(data.user), function (res) {
            if (res[1][0].found > 0) {
                ws.send(JSON.stringify({ 'service_already_registered': '' }))
                log(data.service_name + ' Service already registered with user: ' + data.user + ' for userID: ' + res[0][0].userID, 31)
            } else {
                if (res[0].length > 0) //we have a userID to use
                    query("INSERT INTO services(userID, service, authFilePath, user, pass, active) VALUES (" +
                        res[0][0].userID + "," + con.escape(data.service_name) + ",''," + con.escape(data.user) + "," + con.escape(data.pass) + ",1)", function () {
                            ws.send(JSON.stringify({ 'service_successfully_registered': { service_name: data.service_name, user: data.user } }))
                            log("New " + data.service_name + " service with User:" + data.user + ' and UserID:' + res[0][0].userID)
                            load_services(tools)
                        })
            }
        })
}
module.exports = register_service;