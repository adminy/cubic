const login = require("facebook-chat-api");
var args = process.argv.slice(2);
// Create simple echo bot
login({email: args[0], password: args[1]}, (err, api) => {
    if(err) return console.error(err);

    api.listen((err, message) => {
        api.sendMessage(message.body, message.threadID);
    });
});
