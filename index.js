// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');
var socketio = require("socketio");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// SOCKET LISTENER FOR OUR API
var socket = socketio("http://fika-api-dev.eu-central-1.elasticbeanstalk.com/");
socket.on('message', function(data) {
    //$('#messages').append($('<li>').text(JSON.stringify(data.message)));
    console.log(data);
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/on/:state', function(extreq, res) {
    res.json({ message: 'hooray! welcome to our api!' });

    console.log("EXT REQUEST BODY STATE PARAM: " + extreq.params.state);

    let stateParam = (extreq.params.state == "true");

    const postData = JSON.stringify({ "on": stateParam });
    console.log(postData);
    var options = {
        host: '192.168.5.132',
        port: 80,
        path: '/api/tyObM0Dd4TlMYGoqua7rFBcPNPQBVkJ5eZt8lfrM/lights/1/state',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('LAMP REQUEST BODY: ' + chunk);
        });
    });

    req.write(postData);
    req.end();

});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);