

/*****************************************/
var redis = require("redis")
  , subscriber = redis.createClient()
  

subscriber.on("message", function(channel, message) {
  console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
});

subscriber.subscribe("test");
/*****************************************/

var topics = Object.keys(jsonTopics);

topics.forEach(function(thisTopics) {
	
  var items = Object.keys(jsonTopics[thisTopics]);
  
  items.forEach(function(item) {
	  
    var value = jsonTopics[thisTopics][item];
    console.log(thisTopics+': '+item+' = '+value);
  });
});

/*****************************************/
if(jsonTopics.topic1) {
	var items = Object.keys(jsonTopics["topic1"]);
	var value = jsonTopics["topic1"]["channel"];
	
	console.log(value);
 }
/*****************************************/
var jsonTopics = {
		"topic1" : {channel: "blablaChannel" },
		"topic2" : {channel: "blibliChannel" },
		"topic3" : {channel: "blubluChannel" }};
/****************************************/

var group = { 'Alice': { a: 'b', b: 'c' }, 'Bob': { a: 'd' }};
var people = Object.keys(group);
people.forEach(function(person) {
  var items = Object.keys(group[person]);
  items.forEach(function(item) {
    var value = group[person][item];
    console.log(person+': '+item+' = '+value);
  });
});

/***************************************************/

var topics = Object.keys(jsonTopics);
topics.forEach(function(thisTopics) {

	console.log(thisTopics + ': ' + jsonTopics[thisTopics]);


});


/***************************************************/

// verify if a channel exists for a defined geoloc 
function verifyIfChannelExistG(jsonGeolocAndRadius) {
	
	var lat, latToVerify, lon, lonToVerify, radius, channelName, deltaX, deltaY, jsonGeolocObject;	
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
			jsonGeolocObject.push(jsonGeoloc[data]); // 
			
		} 
	});
	
	return 3;
}



/*********************************************************/

			//console.log("push : " + JSON.stringify(jsonGeolocAndRadius));
			//jsonGeolocResponse.push(jsonGeolocAndRadius);
			//console.log("size : " + JSON.stringify(Object.keys(jsonGeoloc).length));














