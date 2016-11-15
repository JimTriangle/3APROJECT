#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time, sys, json, requests, redis
from threading import Thread

from Tkinter import * 
reload(sys) # ugly hack to access sys.setdefaultencoding
sys.setdefaultencoding('utf-8')

webServiceAddress = 'http://127.0.0.1:3000'
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
		response = requests.get(webServiceAddress + topicRoute + '?topic=' + self.topicNameAsk + '&latitude=' + self.latitude + '&longitude=' + self.longitude)	
		WSResp = response.json()
				
		
		############# requete ajax to pubsub web service #############			
		channelNameResp = requests.get(WSResp['subscribeRoute'] + '?topicName=' + WSResp['data']['topic'])	# ajouter plus lat et lon tard lat et lon et corriger aussi cote server	
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
		
		param = { 'latitude' : latitude , 'longitude' : longitude, 'perimeter' : perimeter }
		channelNameResp = requests.get(WSResp['subscribeRoute'], param)	# ajouter plus tard lat et lon et corriger aussi cote server		
		#print "### GEOLOC ASK : lat = " +  latitude + ", lon = " + longitude + ", perimeter : " + perimeter + " - CHANNEL NAME : " + channelNameResp.text + " ### "
		
		############# redis client ############# 
		redisClient = redis.StrictRedis(host='localhost', port=6379, db=0)
		sub = redisClient.pubsub()
		sub.subscribe(channelNameResp.text)
		
		while True:
			message = sub.get_message()
			if message:
				print "### MESSAGE ON GEOLOC : " +  latitude + ", lon = " + longitude + " >>> %s ###" % message['data']
				time.sleep(1)
				
				
				
class test_web_service_thread(Thread):
   
    def __init__(self):
        Thread.__init__(self)

    def run(self):	
		print 'Le thread commence ...'
		data = {'topic': 'myTopic',	'date':	'date',	'geoposition': { 'latitude': '56', 'longitude': '45'}, 'popularity': 'popular',	'perimeter': '20'}
		route = '/topic'
		token = '/?token=123456789'
		channelNameResp = requests.post(webServiceAddress + route + token, params = data)
				

			
testWebServiceThread = test_web_service_thread();
testWebServiceThread.start()				
				
				
#subThread = topic_subcriber_thread("antoine", "", "")
#subThread.start()

#subThread2 = geoloc_subcriber_thread('0', '0', '2');
#subThread2.start()

"""
AlertChannelRoutes = {
					'subscribeRoute': 'a subscribeRoute',					 
					'unsubscribeRoute':	'a unsubscribeRoute',					 
					'data': {
							'topic': 'topic',								 
							'date':	'date',						 
							'geoposition': { 
											'latitude': '56',
											'longitude': '45'
										
											},	
							'popularity': 'popular'	
									
					}
					
}

print AlertChannelRoutes['data']['topic']
"""




















