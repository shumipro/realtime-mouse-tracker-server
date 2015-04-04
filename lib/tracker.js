var redis = require('redis');
var redisClient = redis.createClient(6379, 'localhost');

module.exports.track = function(x, y, time, url) {
    var message = time + "&" + x + "&" + y;
    redisClient.publish(url, message, function(err, num_clients) {
        if (err) {
            console.error(err);
        }
    });
};