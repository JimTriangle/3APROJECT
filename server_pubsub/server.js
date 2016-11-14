var url = require('url') ;
var fs = require('fs');
var querystring = require('querystring');

var express = require('express');
var app = express();

var random_name = require('node-random-name');

// connxion to redis server
var redis = require("redis")
var publisher = redis.createClient()


// channel list
var jsonTopics = {
		saucisson : 'pianish' , // topic name : 'channel name'
		boudin : 'smools' ,
		chorizo : 'garvet'
};

// geoloc list
var jsonGeoloc = [
		{
			lat : '1.1',
			lon : '1.1',
			channel : 'bouda'
		},
		{
			lat : '7',
			lon : '7',
			channel : 'jquery'
		}
];


// subscribe to a channel by topic
app.get('/subChannel/topic', function (req, res) {
	var ChannelName;
	var params = querystring.parse(url.parse(req.url).query);	// parametres de l'URL
	var response = verifyIfChannelExistT(params['topicName']); 	// verifie qi la channel existe true or false

	if (response == false) {	  								// si n'existe pas
		ChannelName = createChannel(params['topicName']);		// creation channel et retour channel name
										
	}
	else {
		ChannelName = jsonTopics[params['topicName']];			// sinon on va chercher la channel name associée au topic demandé
	}
	console.log("Topic named \"" + params['topicName'] + "\" is now associeted whith channel \"" + ChannelName + "\"");
	res.send(ChannelName); 										// retourne le nom du channel
});


// subscribe to a channel by geoloc
app.get('/subChannel/geoloc', function (req, res) {
	var ChannelName;	
	var params = querystring.parse(url.parse(req.url).query);
	var response = verifyIfChannelExistG(params); 	// verifie qi la channel existe true or false

	//condole.log(response);
	res.send(ChannelName); 										// retourne le nom du channel
});

// verify if a channel exists for a defined topic 
function verifyIfChannelExistT(topicName) {
	if(jsonTopics[topicName]) {
		return true;
	}
	return false;
}

// create a new channel
function createChannel(topicName) {
	var randChannelName = random_name({ last: true });
	jsonTopics[topicName] = randChannelName;
	return randChannelName;
}

// new topic post recieved
app.get('/alert/topic', function (req, res) {
	
	var params = querystring.parse(url.parse(req.url).query); 	// parametres de l'URL
	var response = verifyIfTopicExist(params['topicName']); 	// verifie si le topic est lié à une channel existante : true or false

	if (response == true) {		// si oui
																
		publisher.publish(jsonTopics[params['topicName']], "New post for this topic ...");
	}	
	res.send(200);

});

// verify if a channel exists for a defined geoloc 
function verifyIfChannelExistG(jsonGeolocAndRadius) {
	
	var lat, latToVerify, lon, lonToVerify, radius, channelName, deltaX, deltaY;	
	var jsonGeolocResponse = {};
	
	// extract json lon and lat data from jsonGeolocAndRadius
	var geolocs = Object.keys(jsonGeolocAndRadius);
	geolocs.forEach(function(currentData) {				
						
		if (currentData == 'lat'){			
			latToVerify = jsonGeolocAndRadius[currentData];
		}
		
		if (currentData == 'lon'){
			lonToVerify = jsonGeolocAndRadius[currentData];
		}
		
		else {
			radius = jsonGeolocAndRadius[currentData];
		}
	});
	
    
    // verifier que channel geo existe pour la geoloc demandée	
	var geoData = Object.keys(jsonGeoloc);	
	geoData.forEach(function(data) {
		var items = Object.keys(jsonGeoloc[data]);
		items.forEach(function(item) {
			
			
			if (item == 'lat'){			
				lat = jsonGeoloc[data][item];
			}
			
			if (item == 'lon'){
				lon = jsonGeoloc[data][item];
			}
					
			if  (item == 'channel'){
				channelName = jsonGeoloc[data][item];
			}			
			
			deltaX = Math.abs(lat - latToVerify);
			deltaY = Math.abs(lonToVerify - lon);						
			 
		});		
		
		var radiusFind = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));		
			
		if (radiusFind <= radius){
			console.log('radiusFind : ' + radiusFind + ', radius : ' + radius );
			
		} 
	});
	
	return 3;
}




app.listen(3000, function () {
  console.log('serveur en marche ...');
});




