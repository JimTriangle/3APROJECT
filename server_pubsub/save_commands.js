

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
