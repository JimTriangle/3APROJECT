var redis = require("redis");
var client = redis.createClient();
var Activity = require("./Activity.js");

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

// Initialisation de valeurs de bases
/*client.hset("activity:token:3FE263:1", "topic", "rekt", redis.print);
client.hset("activity:token:3FE263:1", "geoposition", "3.11549,1.213156", redis.print);
client.hset("activity:token:3FE263:1", "date", "2016-01-09T12:51:32", redis.print);

client.hset("activity:token:3FE263:2", "topic", "rugby", redis.print);
client.hset("activity:token:3FE263:2", "geoposition", "3.11549,1.213156", redis.print);
client.hset("activity:token:3FE263:2", "date", "2016-01-09T12:31:32", redis.print);

client.hset("activity:token:3FE263:3", "topic", "saucisses", redis.print);
client.hset("activity:token:3FE263:3", "geoposition", "3.11549,1.213156", redis.print);
client.hset("activity:token:3FE263:3", "date", "2016-01-12T12:51:32", redis.print);

client.hset("activity:geoposition:3.11549:1.213156:1", "topic", "rekt", redis.print);
client.hset("activity:geoposition:3.11549:1.213156:1", "token", "3FE263", redis.print);
client.hset("activity:geoposition:3.11549:1.213156:1", "date", "2016-01-09T12:51:32", redis.print);

client.hset("activity:geoposition:3.11549:1.213156:2", "topic", "rugby", redis.print);
client.hset("activity:geoposition:3.11549:1.213156:2", "token", "3FE263", redis.print);
client.hset("activity:geoposition:3.11549:1.213156:2", "date", "2016-01-09T12:31:32", redis.print);

client.hset("activity:geoposition:3.11549:1.213156:3", "topic", "saucisses", redis.print);
client.hset("activity:geoposition:3.11549:1.213156:3", "token", "3FE263", redis.print);
client.hset("activity:geoposition:3.11549:1.213156:3", "date", "2016-01-12T12:51:32", redis.print);

client.hset("activity:topic:rekt:1", "token", "3FE263", redis.print);
client.hset("activity:topic:rekt:1", "geoposition", "3.11549,1.213156", redis.print);
client.hset("activity:topic:rekt:1", "date", "2016-01-09T12:51:32", redis.print);

client.hset("activity:topic:rugby:1", "token", "3FE263", redis.print);
client.hset("activity:topic:rugby:1", "geoposition", "3.11549,1.213156", redis.print);
client.hset("activity:topic:rugby:1", "date", "2016-01-09T12:31:32", redis.print);

client.hset("activity:topic:saucisses:1", "token", "3FE263", redis.print);
client.hset("activity:topic:saucisses:1", "geoposition", "3.11549,1.213156", redis.print);
client.hset("activity:topic:saucisses:1", "date", "2016-01-12T12:51:32", redis.print);*/




var express = require('express');
var app = express();

app.get('/', function (req, res)
{
    res.send('Hello World!');
});

app.get('/alert/geo', function (req, res)
{
    var latitude = req.query.latitude != undefined ? req.query.latitude : null;
    var longitude = req.query.longitude != undefined ? req.query.longitude : null;
    var perimeter = req.query.perimeter != undefined ? req.query.perimeter : null;

    if(longitude == null || latitude == null)
    {
        res.json({"error" : "required parameters missing"});
    }

    var subscribeRoute = "localhost:3000/subChannel/geopos";
    var unsubscribeRoute = "";
    var newActivity = new Activity();
    newActivity.setLatitude(latitude);
    newActivity.setLongitude(longitude);
    newActivity.setPerimeter(perimeter != null ? perimeter : 0);
    var answer = {};
    answer.subscribeRoute = subscribeRoute;
    answer.unsubscribeRoute = unsubscribeRoute;
    answer.data = newActivity;
    res.json(answer);
});

app.get('/alert/topic', function (req, res)
{
    var topic = req.query.topic != undefined ? req.query.topic : null;
    var latitude = req.query.latitude != undefined ? req.query.latitude : null;
    var longitude = req.query.longitude != undefined ? req.query.longitude : null;
    var perimeter = req.query.perimeter != undefined ? req.query.perimeter : null;

    if(topic == null)
    {
        res.json({"error" : "required parameters missing"});
    }

    var subscribeRoute = "localhost:3000/subChannel/topic";
    var unsubscribeRoute = "";
    var newActivity = new Activity();
    newActivity.setTopic(topic);
    newActivity.setLatitude(latitude != null ? latitude : 0);
    newActivity.setLongitude(longitude != null ? longitude : 0);
    newActivity.setPerimeter(perimeter != null ? perimeter : 0);
    var answer = {};
    answer.subscribeRoute = subscribeRoute;
    answer.unsubscribeRoute = unsubscribeRoute;
    answer.data = newActivity;
    res.json(answer);
});

app.get("/user/:token", function(req, res)
{
    // TODO check validity of token
    // TODO retrieve all user token
    var tokens = ["3EAB547"];
    tokens.push(req.params.token);
    var activities = [];
    var keyPromises = [];
    for (var iToken = 0; iToken < tokens.length; ++iToken)
    {
        var key_db = "activity:token:" + tokens[iToken] + ":*";
        var keyPromise = new Promise(function(keyResolve, keyReject)
        {
            client.keys(key_db, function(keyErr, keyReply)
            {
                var getPromises = [];
                for (var key_activities in keyReply)
                {
                    var getPromise = new Promise(function(getResolve, getReject)
                    {
                        client.hgetall(keyReply[key_activities], function(getErr, getReply)
                        {
                            var newActivity = new Activity();
                            newActivity.hydrateFromDB(getReply);
                            activities.push(newActivity);
                            getResolve(true);
                        });
                    });
                    getPromises.push(getPromise);
                }
                Promise.all(getPromises).then(function() {keyResolve(true);}, function() {keyReject(true);});
            });
        });
        keyPromises.push(keyPromise);
    }
    Promise.all(keyPromises).then(function()
    {
        res.send(activities);
    }, function()
    {
        res.json({"error" : "required parameters missing"});
    });
});

app.get("/geo", function(req, res)
{
    // TODO check validity of token
    // TODO retrieve all user token
    var rejection = false;
    var userToken = req.query.token != undefined ? req.query.token : null;
    var latitude = req.query.latitude != undefined ? req.query.latitude : null;
    var longitude = req.query.longitude != undefined ? req.query.longitude : null;
    var perimeter = req.query.perimeter != undefined ? req.query.perimeter : null;
    var time = req.query.time != undefined ? req.query.time : null;
    if(userToken == null || latitude == null || longitude == null)
    {
        rejection = true;
    }
    var activities = [];
    var keyPromise = new Promise(function(keyResolve, keyReject)
    {
        if(rejection)
        {
            keyReject(true);
        }
        var key_db = "activity:geoposition:" + latitude + ":" + longitude + ":*";
        client.keys(key_db, function(keyErr, keyReply)
        {
            var getPromises = [];
            for (var key_activities in keyReply)
            {
                var getPromise = new Promise(function(getResolve, getReject)
                {
                    client.hgetall(keyReply[key_activities], function(getErr, getReply)
                    {
                        var newActivity = new Activity();
                        newActivity.hydrateFromDB(getReply);
                        newActivity.setLatitude(latitude);
                        newActivity.setLongitude(longitude);
                        activities.push(newActivity);
                        getResolve(true);
                    });
                });
                getPromises.push(getPromise);
            }
            Promise.all(getPromises).then(function() {keyResolve(true);}, function(){ keyReject(true);});
        });
    });
    keyPromise.then(function()
    {
        console.log(activities);
        res.json(activities);
    }, function()
    {
        res.json({"error" : "required parameters missing"});
    });
});


app.get("/topic", function(req, res)
{
    // TODO check validity of token
    // TODO retrieve all user token
    var rejection = false;
    var userToken = req.query.token != undefined ? req.query.token : null;
    var topic = req.query.topic != undefined ? req.query.topic : null;
    var latitude = req.query.latitude != undefined ? req.query.latitude : null;
    var longitude = req.query.longitude != undefined ? req.query.longitude : null;
    if(userToken == null || topic == null)
    {
        rejection = true;
    }
    var activities = [];
    var keyPromise = new Promise(function(keyResolve, keyReject)
    {
        if(rejection)
        {
            keyReject(true);
        }
        var key_db = "activity:topic:" + topic + ":*";
        client.keys(key_db, function(keyErr, keyReply)
        {
            var getPromises = [];
            for (var key_activities in keyReply)
            {
                var getPromise = new Promise(function(getResolve, getReject)
                {
                    client.hgetall(keyReply[key_activities], function(getErr, getReply)
                    {
                        var activity = {};
                        fillActivityTable(reply2, activity);
                        activity["topic"] = topic;
                        // Trier par localisation si précisé
                        if((latitude == null && longitude == null) || (latitude == activity["geoposition"]["latitude"] && longitude == activity["geoposition"]["longitude"]))
                        {
                            activities.push(activity);
                        }
                        getResolve(true);
                    });
                });
                getPromises.push(getPromise);
        }
        Promise.all(getPromises).then(function() {keyResolve(true);}, function() {keyReject(true);});
        });
    });
    keyPromise.then(function()
    {
        console.log(activities);
        res.json(activities);
    }, function()
    {
        res.json({"error" : "required parameters missing"});
    });
});

app.post("/topic", function(req, res)
{
});

app.put("/topic", function(req, res)
{
});



app.listen(8090, function () {
  console.log('Example app listening on port 8090!');
});
