//this is last function that runs before the server is closed

function on_exit(log) {
    process.on('SIGINT', function () {
        log("Closing Server ...", 33)
        process.exit(1)
    });
//This could be used in the future to restart a process when it gets killed because of an API error, which btw happens sometimes and it's not under our control.
    // process.on('uncaughtException', function (err) {
    //     console.error(err);
    //     console.log("Kill Current App, start a new session!")
    //     process.exit(1)

    // });
    

}


module.exports = on_exit;