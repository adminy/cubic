//Routes
function load_routes(express) {
    //html files
    express.get('/', function (req, res) { res.sendFile(__dirname + '/public/index.html') })
    express.get('/login.html', function (req, res) { res.sendFile(__dirname + '/public/login.html') })
    express.get('/main.html', function (req, res) { res.sendFile(__dirname + '/public/main.html') })
    express.get('/settings', function (req, res) { res.sendFile(__dirname + '/public/settings.html') })
    express.get('/blog', function (req, res) { res.sendFile(__dirname + '/public/blog.html') })
    //css style sheets
    express.get('/css/materialize.min.css', function (req, res) { res.sendFile(__dirname + '/public/css/materialize.min.css') })
    express.get('/css/materialize.css', function (req, res) { res.sendFile(__dirname + '/public/css/materialize.css') })
    express.get('/css/style.css', function (req, res) { res.sendFile(__dirname + '/public/css/style.css') })
    //js scripts
    express.get('/js/client.js', function (req, res) { res.sendFile(__dirname + '/public/js/client.js') })
    express.get('/js/functions.js', function (req, res) { res.sendFile(__dirname + '/public/js/functions.js') })
    express.get('/js/social.js', function (req, res) { res.sendFile(__dirname + '/public/js/social.js') })

    express.get('/js/groups.js', function (req, res) { res.sendFile(__dirname + '/public/js/groups.js') })
    express.get('/js/contacts.js', function (req, res) { res.sendFile(__dirname + '/public/js/contacts.js') })
    express.get('/js/services.js', function (req, res) { res.sendFile(__dirname + '/public/js/services.js') })
    express.get('/js/messages.js', function (req, res) { res.sendFile(__dirname + '/public/js/messages.js') })
    express.get('/js/search.js', function (req, res) { res.sendFile(__dirname + '/public/js/search.js') })
    express.get('/js/page.js', function (req, res) { res.sendFile(__dirname + '/public/js/page.js') })

    
    //images
    express.get('/images/Cubik.png', function (req, res) { res.sendFile(__dirname + '/public/images/Cubik.png') })
    //fonts
    express.get('/fonts/roboto/Roboto-Regular.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Regular.woff2') })
    express.get('/fonts/roboto/Roboto-Medium.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Medium.woff2') })
    express.get('/fonts/roboto/Roboto-Bold.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Bold.woff2') })
    //facebook_required_urls
    express.get('/privacy', function (req, res) { res.sendFile(__dirname + '/public/privacy.html') })
    express.get('/tos', function (req, res) { res.sendFile(__dirname + '/public/privacy.html') })
    //404 file requested not found page
    express.use(function (req, res, next) { res.status(404).send("404 Route does not exist, what you doing here?<br> Have a nice day ^_^") })
}

module.exports = load_routes