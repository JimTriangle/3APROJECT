#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time, sys, json, requests, redis
from threading import Thread

from Tkinter import * 
reload(sys) # ugly hack to access sys.setdefaultencoding
sys.setdefaultencoding('utf-8')




class topic_subcriber_thread(Thread):
   
    def __init__(self, topicNameAsk):
        Thread.__init__(self)
        self.topicNameAsk = topicNameAsk

    def run(self):
		
			
		############# requete ajax ############# 
		param = {'topicName': self.topicNameAsk}
		channelNameResp = requests.get('http://127.0.0.1:3000/subChannel/topic', param)
		
		print "### TOPIC ASK : " +  self.topicNameAsk + " - CHANNEL NAME : " + channelNameResp.text + "### "
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
   
    def __init__(self, latitude, longitude, radius):
        Thread.__init__(self)
        self.latitude = latitude
        self.longitude = longitude
        self.radius = radius

    def run(self):
		
			
		############# requete ajax ############# 
		param = {
					'lat' : self.latitude,
					'lon' : self.longitude,
					'radius' : self.radius
				}
				
		channelNameResp = requests.get('http://127.0.0.1:3000/subChannel/geoloc', param)
		
		print "###GEOLOC ASK : lat = " +  repr(self.latitude) + ", lon = " + repr(self.longitude) + " - CHANNEL NAME : " + channelNameResp.text + "### "
		############# redis client ############# 
		redisClient = redis.StrictRedis(host='localhost', port=6379, db=0)
		sub = redisClient.pubsub()
		sub.subscribe(channelNameResp.text)
		
		while True:
			message = sub.get_message()
			if message:
				print "### MESSAGE ON GEOLOC : " +  repr(self.latitude) + ", lon = " + repr(self.longitude) + " >>> %s ###" % message['data']
				time.sleep(1)
				
#subThread = topic_subcriber_thread("antoine")
#subThread.start()

subThread2 = geoloc_subcriber_thread('0', '0', '2');
subThread2.start()
