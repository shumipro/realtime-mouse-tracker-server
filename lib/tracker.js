var redis = require('redis');
var redisClient = redis.createClient(6379, 'localhost');

module.exports.track = function(x, y, time, host) {
    redisClient.publish(host, time + "&" + x + "&" + y, function(err, num_clients) {
        if (err) {
            console.error(err);
        }
        //console.log(num_clients);
    });
};