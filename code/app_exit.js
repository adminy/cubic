//this is last function that runs before the server is closed

function on_exit(log) {
    process.on('SIGINT', function () {
        log("Closing Server ...", 33)
        process.exit(1)
    });
}

module.exports = on_exit;