var redis = require("redis");
var request = require("request");

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/* TEST LOCAL - TEST GLOBAL */
var client = redis.createClient(6379, 'localhost');

var Activity = require("./Activity.js");

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

// Initialisation de valeurs de bases
/*
client.hset("activity:token:3FE263:1", "topic", "rekt", redis.print);
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
client.hset("activity:topic:saucisses:1", "date", "2016-01-12T12:51:32", redis.print);
*/


app.get('/', function (req, res)
{
    res.send('Hello World!');
});

// Route pour Rasp
// Marche 100%
app.get('/alert/geo', function (req, res)
{
    var latitude = req.query.latitude != undefined ? req.query.latitude : null;
    var longitude = req.query.longitude != undefined ? req.query.longitude : null;
    var perimeter = req.query.perimeter != undefined ? req.query.perimeter : null;

    if(longitude == null || latitude == null)
    {
        res.json({"error" : "required parameters missing"});
    }

    var subscribeRoute = "http://localhost:3020/subChannel/geoloc";
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


// Route pour Rasp
// Marche 100%
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

    var subscribeRoute = "http://localhost:3020/subChannel/topic";
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


// Route pour Mobile
// Manque validité token + liste des tokens
app.get("/user", function(req, res)
{
    var tokens = [];
    tokens.push(req.params.token);

    /************** CODE ANTOINE ******************************************/       
	/************** PROMMESSE 1 : CHECK SI TOKEN VALIDE********************/	
	
	var getPromise1 = new Promise(function(resolve, reject) {

		var body = {"token" : req.query.token};
		var options = {url: 'http://localhost:3030/token', header: 'Content-Type:application/json', method: 'POST', json:true, body : body};
	
		request(options, function(error, response, body){			
			if(error ||body.resultat == 'ko') reject();			
			else resolve();	
		});
	});	
	
	getPromise1.then(function(){
		
		/*************** Token OK !!! **************************/
		/************** PROMMESSE 2 : GET LISTE TOKENS UTILISATEUR ********/			
		
		var getPromise2 = new Promise(function(resolve, reject) {

			var body = {"token" : req.query.token};
			var options = {url: 'http://localhost:3030/tokens', header: 'Content-Type:application/json', method: 'POST', json:true, body : body};
		
			request(options, function(error, response, body){			
				if(error) reject();			
				else {	
					
					for (var i in body.token){						
						tokens.push(body.token[i]);
					}
					resolve();
				}
			});
		});
		 	
		getPromise2.then(function() {			
			
			/*************** LISTE TOKENS UTILISATEUR BIEN RECUE !!! **************************/						
			/*************** CODE LAURA ****************************/

			// Envoyer un get au serveur authentification pour obtenir la liste des tokens d'un utilisateur en fonction du token actuel
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
			
		/*************** LISTE TOKENS KO !!! *******************/ 
		/*************** CODE ANTOINE **************************/ 		
	
		}, function()
		{
			res.json({"error" : "token list error with authentification server"});
		});
		
		Promise.all([getPromise2]);

		/*************** TOKENS KO !!! ************************/ 

		
	}, function()
	{
		res.json({"error" : "token error >> wrong token"});
	});
	
	Promise.all([getPromise1]);
		

});


// Route pour Mobile
// Manque validité token
app.get("/geo", function(req, res)
{
    var rejection = false;
    var userToken = req.query.token != undefined ? req.query.token : null;
	var latitude = req.query.latitude != undefined ? req.query.latitude : null;
	var longitude = req.query.longitude != undefined ? req.query.longitude : null;
	var perimeter = req.query.perimeter != undefined ? req.query.perimeter : null;
	var time = req.query.time != undefined ? req.query.time : null;

    /************** CODE ANTOINE ******************************************/
	
	var getPromise1 = new Promise(function(resolve, reject) {		
		
		/************ GET /checkToken *************************************/
		
		var body = {"token" : req.query.token};
		var options = {url: 'http://localhost:3030/token', method: 'POST', json:true, body : body};
	
		request(options, function(error, response, body){			
			if(error ||body.resultat == 'ko') reject();			
			else resolve();	
		});	
		
	});
		
	getPromise1.then(function() {

		/*************** Token OK !!! **************************/
		/*************** CODE LAURA ****************************/

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
			console.log("get /geo >>> Working well ! Activities sent : ");
			console.log(activities);

			res.json(activities);
		}, function()
		{
			console.log("get /geo >>> error : required parameters missing");
			res.json({"error" : "required parameters missing"});
		});  	
  
       
     /*************** Token KO !!! **************************/ 
     /*************** CODE ANTOINE **************************/ 
    }, function()
    {
		console.log("get /geo >>> error : token error");
        res.json({"error" : "token error"});
    });	
    		
    Promise.all([getPromise1]); 

});


// Route pour Mobile
// Manque validité token
app.get("/topic", function(req, res)
{
    var rejection = false;
    var userToken = req.query.token != undefined ? req.query.token : null;
	var topic = req.query.topic != undefined ? req.query.topic : null;
	var latitude = req.query.latitude != undefined ? req.query.latitude : null;
	var longitude = req.query.longitude != undefined ? req.query.longitude : null;
    
    /************** CODE ANTOINE ******************************************/
	
	var getPromise1 = new Promise(function(resolve, reject) {
		
		var body = {"token" : req.query.token};
		var options = {url: 'http://localhost:3030/token', method: 'POST', json:true, body : body};
	
		request(options, function(error, response, body){			
			if(error ||body.resultat == 'ko') reject();			
			else resolve();	
		});
	});	
		
	getPromise1.then(function()
    {
   
		/*************** Token OK !!! **************************/
		/*************** CODE LAURA ****************************/   

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
							var newActivity = new Activity();
							newActivity.hydrateFromDB(getReply);
							newActivity.setTopic(topic);
							if((latitude == null && longitude == null) || (latitude == newActivity.getLatitude() && longitude == newActivity.getLongitude()))
							{
								activities.push(newActivity);
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
			console.log('get /topic >>>');
			console.log(activities);
			res.json(activities);
		}, function()
		{
			console.log('get /topic >>> error: required parameters missing');
			res.json({"error" : "required parameters missing"});
		});
     
     /*************** Token KO !!! **************************/ 
     /*************** CODE ANTOINE **************************/ 
    }, function()
    {
		console.log('get /topic >>> error : token error');
        res.json({"error" : "token error >> wrong token"});
    });
    
    Promise.all([getPromise1]);    
});


// Route pour Mobile
// TODO MANQUE TOUT
app.post("/topic", function(req, res)
{
	/************** CODE ANTOINE ******************************************/
	
		// Verifier validité token
	var nbTopic;
	var nbGeo;
	var nbToken;
	
	var getPromise1 = new Promise(function(resolve, reject) {		
	
	/************ GET /checkToken *************************************/
	
		var body = {"token" : req.query.token};
		var options = {url: 'http://localhost:3030/token', method: 'POST', json:true, body : body};
	
		request(options, function(error, response, body){			
			if(error ||body.resultat == 'ko') reject();			
			else resolve();	
		});	
	
	});		
	getPromise1.then(function() {

		var getPromise2 = new Promise(function(resolve, reject) {
			
			var key_db = "activity:topic:" + req.body.topic + ":*";
			client.keys(key_db, function(keyErr, keyReply) {
				nbTopic = keyReply.length;
				
				var key_db = "activity:geoposition:" + req.body.geoposition.latitude + ":" + req.body.geoposition.longitude + ":*";
				client.keys(key_db, function(keyErr, keyReply) {
					nbGeo = keyReply.length;
					
					var key_db = "activity:token:" + req.query.token + ":*";
					client.keys(key_db, function(keyErr, keyReply) {
						nbToken = keyReply.length;
						resolve();
					});					
				});				
			});			
		});	
			
		getPromise2.then(function() {	
			
			nbTopic +=1 ;
			nbGeo +=1 ;
			nbToken +=1 ;			
			
			// Insérer dans la base de données		
			client.hset("activity:token:" + req.query.token + ":" + nbToken, "topic", req.body.topic, redis.print);
			client.hset("activity:token:" + req.query.token + ":" + nbToken, "geoposition", req.body.geoposition.latitude + "," + req.body.geoposition.longitude, redis.print);
			client.hset("activity:token:" + req.query.token + ":" + nbToken, "date", "2016-01-09T12:51:32", redis.print);
			
			client.hset("activity:geoposition:" + req.body.geoposition.latitude + ":" + req.body.geoposition.longitude + ":" + nbGeo, "topic", req.body.topic, redis.print);
			client.hset("activity:geoposition:" + req.body.geoposition.latitude + ":" + req.body.geoposition.longitude + ":" + nbGeo, "token", req.query.token, redis.print);
			client.hset("activity:geoposition:" + req.body.geoposition.latitude + ":" + req.body.geoposition.longitude + ":" + nbGeo, "date", "2016-01-09T12:51:32", redis.print);
			
			client.hset("activity:topic:" + req.body.topic + ":" + nbTopic, "token", req.query.token, redis.print);
			client.hset("activity:topic:" + req.body.topic + ":" + nbTopic, "geoposition", req.body.geoposition.latitude + "," + req.body.geoposition.longitude, redis.print);
			client.hset("activity:topic:" + req.body.topic + ":" + nbTopic, "date", "2016-01-12T12:51:32", redis.print);
			
			// Envoyer au serveur pub sub l'activité		
			var getPromise3 = new Promise(function(resolve, reject) {
				
				var body = req.body;
				var options = {url: 'http://localhost:3020/newPost', method: 'POST', json:true, body : body};
			
				request(options, function(error, response, body){	
					if(error || body.resultat == 'ko') reject();			
					else resolve();
				});		
			});	
				
			getPromise3.then(function() {
				// Retour vide si tout va bien (200)
				console.log("New post sent to pubsub server");			
			}, function()
			{
				res.json({"error" : "pubsub server connexion failed"});
			});
			
			Promise.all([getPromise3]);
			
		}, function()
		{
			res.json({"error" : "authentification server connexion failed OR token error"});
		});
		
		Promise.all([getPromise2]);

	
	}, function()
	{
		res.json({"error" : "authentification server connexion failed OR token error"});
	});
	
	Promise.all([getPromise1]);
});



// PUT TOPIC
app.put("/topic", function(req, res)
{
	
	var nbTopic;
	var nbGeo;
	var nbToken;


	var getPromise1 = new Promise(function(resolve, reject) {		
	
	/************ GET /checkToken *************************************/
	
		var body = {"token" : req.query.token};
		var options = {url: 'http://localhost:3030/token', method: 'POST', json:true, body : body};
	
		request(options, function(error, response, body){			
			if(error ||body.resultat == 'ko') reject();			
			else resolve();	
		});	
	
	});		
	getPromise1.then(function() {
		
		var getPromise2 = new Promise(function(resolve, reject) {
			
			var key_db = "activity:topic:" + req.body.topic + ":1:*";
				client.keys(key_db, function(keyErr, keyReply) {
				nbTopic = keyReply.length;
				resolve();		
			});			
		});	
			
		getPromise2.then(function() {	
			
			nbTopic += 1;	
			console.log('nbTopic : ' + nbTopic);
			client.hset("activity:topic:" + req.body.topic + ":1:" + nbTopic, "token", req.query.token, redis.print);
			client.hset("activity:topic:" + req.body.topic + ":1:" + nbTopic, "geoposition", req.body.geoposition.latitude + "," + req.body.geoposition.longitude, redis.print);
			client.hset("activity:topic:" + req.body.topic + ":1:" + nbTopic, "date", "2016-01-12T12:51:32", redis.print);
		
			
			// Envoyer au serveur pub sub l'activité
			var getPromise3 = new Promise(function(resolve, reject) {
				
				var body = req.body;
				var options = {url: 'http://localhost:3020/newPost', method: 'POST', json:true, body : body};
			
				request(options, function(error, response, body){			
					if(error) reject();			
					else resolve();	
				});		
			});	
				
			getPromise3.then(function() {
				// Retour vide si tout va bien (200)
				console.log("New post sent to pubsub server");			
			}, function()
			{
				res.json({"error" : "pubsub server connexion failed"});
			});
		
			Promise.all([getPromise3]);		
		
		console.log("New post sent to pubsub server");			

		}, function()
		{
			res.json({"error" : "pubsub server connexion failed"});
		});
		
		Promise.all([getPromise2]);

	}, function()
	{
		console.log("New post sent to pubsub server");
		res.json({"error" : "authentification server connexion failed OR token error"});
	});
	
	Promise.all([getPromise1]);
});



app.listen(3010, function () {
  console.log('Example app listening on port 3010!');
});
