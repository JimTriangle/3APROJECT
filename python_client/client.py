#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time, sys, json, requests, redis
from threading import Thread

from Tkinter import * 
reload(sys) # ugly hack to access sys.setdefaultencoding
sys.setdefaultencoding('utf-8')

# TEST LOCAL - TEST GLOBAL
#webServiceAddress = 'http://127.0.0.1:3020' #to pubsub server
webServiceAddress = 'http://localhost:3010'  # to web service server

topicRoute = '/alert/topic/'
geolocRoute = '/alert/geo/'

class topic_subcriber_thread(Thread):
   
    def __init__(self, topicNameAsk, latitude, longitude):
        Thread.__init__(self)
        self.topicNameAsk = topicNameAsk
        self.latitude = latitude
        self.longitude = longitude        

    def run(self):
		############# requete ajax to web service ############# 		
		WSResp = requests.get(webServiceAddress + topicRoute + '?topic=' + self.topicNameAsk + '&latitude=' + self.latitude + '&longitude=' + self.longitude).json()		
		
		############# requete ajax to pubsub web service #############			
		channelNameResp = requests.get(WSResp['subscribeRoute'] + '?topicName=' + WSResp['data']['topic'])	# ajouter plus tard lat et lon et corriger aussi cote server	
		print "### TOPIC ASK : " +  self.topicNameAsk + " - CHANNEL NAME : " + channelNameResp.text + " ### "		
		
		############# redis client ############# 
		redisClient = redis.StrictRedis(host='localhost', port=6379, db=0)
		sub = redisClient.pubsub()
		sub.subscribe(channelNameResp.text)
		
		while True:
			message = sub.get_message()
			if message:
				print "### MESSAGE ON TOPIC : " + self.topicNameAsk + " >>> %s ###" % message['data']
				time.sleep(1)


class geoloc_subcriber_thread(Thread):
   
    def __init__(self, latitude, longitude, perimeter):
        Thread.__init__(self)
        self.latitude = latitude
        self.longitude = longitude
        self.perimeter = perimeter

    def run(self):		
			
		############# requete ajax to web service ############# 		
		response = requests.get(webServiceAddress + geolocRoute + '?latitude=' + self.latitude + '&longitude=' + self.longitude + '&perimeter=' + self.perimeter)	
		WSResp = response.json()				
		
		############# requete ajax to pubsub web service #############	
		latitude = WSResp['data']['geoposition']['latitude']
		longitude = WSResp['data']['geoposition']['longitude']
		perimeter = WSResp['data']['perimeter']
		
		param = '{latitude : ' + latitude + ', longitude :' + longitude + ', perimeter:' + perimeter + '}'

		channelNameResp = requests.get(WSResp['subscribeRoute'], param)	# ajouter plus tard lat et lon et corriger aussi cote server		
		print "###GEOLOC ASK : lat = " +  latitude + ", lon = " + longitude + ", perimeter : " + perimeter + " - CHANNEL NAME : " + channelNameResp.text + " ### "
		
		############# redis client ############# 
		redisClient = redis.StrictRedis(host='localhost', port=6379, db=0)
		sub = redisClient.pubsub()
		sub.subscribe(channelNameResp.text)
		
		while True:
			message = sub.get_message()
			if message:
				print "### MESSAGE ON GEOLOC : " +  latitude + ", lon = " + longitude + " >>> %s ###" % message['data']
                time.sleep(1)
				
				
				
			
				



#subThread = geoloc_subcriber_thread()
#subThread.start()

while True :	
	channelTypeCHoice = raw_input("Sub to CHANNEL - by topic name : 1 - by geoloc : 2 >>> ")
	
	if channelTypeCHoice == '1':
		topicName = raw_input("Enter the topic name >>> ")
		subThreadT = topic_subcriber_thread(topicName, "", "")
		subThreadT.start()

	
	elif channelTypeCHoice == '2':
		geolocLatitude = raw_input("Enter the latitude >>> ")
		geolocLongitude = raw_input("Enter the longitude >>> ")
		geolocPerimeter = raw_input("Enter the perimeter >>> ")
		
	
		subThreadG = geoloc_subcriber_thread(geolocLatitude, geolocLongitude, geolocPerimeter)
		subThreadG.start()

	
					




















