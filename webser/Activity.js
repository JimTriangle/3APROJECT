//Private
//var topic;

//Public
module.exports = Activity;
function Activity()
{
    this.topic = "";
    this.geoposition = {};
    this.date = "";
    this.popularity = 1;
    this.geoposition.latitude = "";
    this.geoposition.longitude = "";
    this.perimeter = 0;
}

Activity.prototype.hydrateFromDB = function hydrateFromDB(data)
{
    if(data['topic'] != undefined)
    {
        this.topic = data['topic'];
    }

    if(data['date'] != undefined)
    {
        this.date = data['date'];
    }

    if(data['geoposition'] != undefined)
    {
        this.geoposition.latitude = data['geoposition'].split(",")[0];
        this.geoposition.longitude = data['geoposition'].split(",")[1];
    }

    if(data['popularity'] != undefined)
    {
        this.popularity = data['popularity'];
    }

    if(data['perimeter'] != undefined)
    {
        this.perimeter = data['perimeter'];
    }
}

Activity.prototype.hydrateFromJSON = hydrateFromJSON(JSONData)
{
    var object = JSON.parse(JSONData);
    this.topic = object.topic;
    this.date = object.date;
    this.popularity = object.popularity;
    this.perimeter = object.perimeter;
    this.geoposition.latitude = object.geoposition.latitude;
    this.geoposition.longitude = object.geoposition.longitude;
}

Activity.prototype.setTopic = function setTopic(_topic)
{
    this.topic = _topic;
}

Activity.prototype.getTopic = function getTopic()
{
    return this.topic;
}

Activity.prototype.setDate = function setDate(_date)
{
    this.date = _date;
}

Activity.prototype.getDate = function getDate()
{
    return this.date;
}

Activity.prototype.setLatitude = function setLatitude(_latitude)
{
    this.geoposition.latitude = _latitude;
}

Activity.prototype.getLatitude = function getLatitude()
{
    return this.geoposition.latitude;
}

Activity.prototype.setLongitude = function setLongitude(_longitude)
{
    this.geoposition.longitude = _longitude;
}

Activity.prototype.getLongitude = function getLongitude()
{
    return this.geoposition.longitude;
}

Activity.prototype.setPopularity = function setPopularity(_popularity)
{
    this.popularity = _popularity;
}

Activity.prototype.getPopularity = function getPopularity()
{
    return this.popularity;
}

Activity.prototype.setPerimeter = function setPerimeter(_perimeter)
{
    this.perimeter = perimeter;
}

Activity.prototype.getPerimeter = function getPerimeter()
{
    return this.perimeter;
}

Activity.prototype.print = function print()
{
    console.log("Topic : " + this.topic);
    console.log("Latitude : " + this.geoposition.latitude);
    console.log("Longitude : " + this.geoposition.longitude);
    console.log("Date : " + this.date);
    console.log("Popularité : " + this.popularity);
    console.log("Périmètre : " + this.perimeter);
}
