var express = require('express');
var tracker = require('./lib/tracker');
var redis = require('redis');

var io = require('socket.io')(3001);

var app = express();

app.get('/', function(req, res) {
    res.send('Hello.');
});

// tracker
app.get('/track', function(req, res) {
    var hostname = (req.headers.host.match(/:/g)) ? req.headers.host.slice(0, req.headers.host.indexOf(":")) : req.headers.host;
    tracker.track(req.query.x, req.query.y, req.query.time, hostname);
    res.send(req.query.x + ' ' + req.query.y + ' ' + req.query.time + ' ' + req.headers.host);
});

//app.get('/debug', function(req, res) {
//    res.sendfile(__dirname + '/index.html');
//});

// provider
io.on('connection', function(socket) {

    var redisClient;

    socket.on('host', function(hostname) {
        redisClient = redis.createClient(6379, 'localhost');
        redisClient.subscribe(hostname);
        redisClient.on("message", function(channel, message) {
            socket.emit('data', message);
        });
    });

    socket.on('disconnect', function() {
        if (redisClient) {
            redisClient.unsubscribe(function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    })
});

app.get('/debug', function(req, res) {
    receiver.receive(req.query.host, function(id, x, y) {
        console.log(id + " " + x + " " + y);
    })
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});