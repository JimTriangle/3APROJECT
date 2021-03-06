var url = require('url') ;
var fs = require('fs');
var querystring = require('querystring');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var random_name = require('node-random-name');

// connexion to redis server
var redis = require("redis");

/* TEST LOCAL - TEST GLOBAL */
var publisher = redis.createClient(6379, 'localhost');



// channel list
var jsonTopics = {
		saucisson : 'pianish' , // topic name : 'channel name'
		boudin : 'smools' ,
		chorizo : 'garvet'
};

// geoloc list
var jsonGeoloc = [
		{
			latitude : '1.1',
			longitude : '1.1',
			perimeter : '5',
			channel : 'bouda'
		},
		{
			latitude : '7',
			longitude : '7',
			perimeter : '6',
			channel : 'jquery'
		}
];


// subscribe to a channel by topic
app.get('/subChannel/topic', function (req, res) {
	var ChannelName;
	var params = querystring.parse(url.parse(req.url).query);	// parametres de l'URL
	var response = verifyIfChannelExistT(params['topicName']); 	// verifie qi la channel existe true or false
	
	if (response == false) {	  								// si n'existe pas
		ChannelName = createChannelT(params['topicName']);		// creation channel et retour channel name
		console.log("Topic named \"" + params['topicName'] + "\" is now associeted whith channel \"" + ChannelName + "\"");
								
	}
	else {
		ChannelName = jsonTopics[params['topicName']];;			// sinon on va chercher la channel name associée au topic demandé
		console.log("Topic named \"" + params['topicName'] + "\" already exists and is associated whith channel \"" + ChannelName + "\"");

	}
	res.send(ChannelName); 										// retourne le nom du channel
});


// subscribe to a channel by geoloc
app.get('/subChannel/geoloc', function (req, res) {
	console.log('req ' + req.query.latitude);
	var ChannelName;	
	var params = querystring.parse(url.parse(req.url).query);
	console.log('params : ' + params['latitude']);
	var response = verifyIfChannelExistG(params); 
	
	if (response == false) {	  								// si n'existe pas
		ChannelName = createChannelG(params);	// creation channel et retour channel name
		console.log("Geoloc named \"" + JSON.stringify(params) + "\" is now associeted whith channel \"" + ChannelName + "\"");
	}
	
	else {
		ChannelName = response;			// sinon on va chercher la channel name associée au topic demandé
		console.log("Geoloc named \"" + JSON.stringify(params) + "\" already exists ans is associated whith channel \"" + ChannelName + "\"");
	}

	res.send(ChannelName); 	// retourne le nom du channel
});

// verify if a channel exists for a defined topic 
function verifyIfChannelExistT(topicName) {
	if(jsonTopics[topicName]) {
		return true;
	}
	return false;
}

// verify if a channel exists for a defined geoloc 
function verifyIfChannelExistG(jsonGeolocAndRadius) {

	var lat, lon, perimeter, channelName;
	var latToVerify, lonToVerify, perimeterToVerify;
	var deltaX, deltaY;	
	
	/* *** extract json lon and lat data from jsonGeolocAndRadius *** */
	var geolocs = Object.keys(jsonGeolocAndRadius);	
	geolocs.forEach(function(currentData) {
		

		if (currentData == 'latitude'){			
			latToVerify = jsonGeolocAndRadius[currentData];
		}
		
		if (currentData == 'longitude'){
			lonToVerify = jsonGeolocAndRadius[currentData];
		}
		
		if (currentData == 'perimeter'){
			perimeterToVerify = jsonGeolocAndRadius[currentData];
		}
		
	});	
    
    /* *** verifier si une channel geo existe pour la geoloc demandée	*** */
	var geoData = Object.keys(jsonGeoloc);	
	var channelNameresp = false;
	geoData.forEach(function(data) {
		var items = Object.keys(jsonGeoloc[data]);
		
		/* *** extract json lon and lat data from jsonGeoloc *** */
		items.forEach(function(item) {		
			if (item == 'latitude'){			
				lat = jsonGeoloc[data][item];				
			}
			
			if (item == 'longitude'){
				lon = jsonGeoloc[data][item];
			}
			
			if  (item == 'perimeter'){
				perimeter = jsonGeoloc[data][item];
			}
					
			if  (item == 'channel'){
				channelName = jsonGeoloc[data][item];
			}			 
		});		

		/* *** Une channel existe deja pour cette localisation *** */
		if (lat == latToVerify && lon == lonToVerify && perimeter == perimeterToVerify) {			
			channelNameresp =  channelName;		
		}
	});

	return channelNameresp;
}

// create a new topic channel 
function createChannelT(topicName) {
	var randChannelName = random_name({ last: true });
	jsonTopics[topicName] = randChannelName;
	return randChannelName;
}

// create a new geoloc channel
function createChannelG(jsonGeolocObj) {
	var randChannelName = random_name({ last: true });
	jsonGeolocObj.channel = randChannelName;
	jsonGeoloc.push(jsonGeolocObj);
	return randChannelName;
}

// new topic post recieved
app.post('/newPost', function (req, res) {
		
	console.log('app.post(/newPost)');
	console.log(req.body);
	var response = verifyIfChannelExistT(req.body.topic); 	// verifie si le topic est lié à une channel existante : true or false

	if (response == true) { // si oui
		
		publisher.publish(jsonTopics[req.body.topic], "Like !");
		res.send({'resultat' : "ok"});
	}
	else res.send({'resultat' : "ko"});

});












app.listen(3020, function () {
  console.log('serveur PubSub en marche port 3020 ...');
});




