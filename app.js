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
    tracker.track(req.query.x, req.query.y, req.query.t, req.query.url);
    res.send(req.query.x + ' ' + req.query.y + ' ' + req.query.t + ' ' + req.headers.host);
});

// provider
io.on('connection', function(socket) {

    var redisClient;

    socket.on('url', function(data) {
        redisClient = redis.createClient(6379, 'localhost');
        console.log(data);
        redisClient.subscribe(data.value);
        redisClient.on("message", function(channel, message) {
            //console.log(message);
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

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});