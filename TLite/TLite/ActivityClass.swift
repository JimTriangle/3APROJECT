//
//  ActivityClass.swift
//  TLite
//
//  Created by Student on 14/11/2016.
//  Copyright © 2016 MDR. All rights reserved.
//

import Foundation

class Activity {
    var name: String
    var date: String
    var geoposition: [Double]
    var popularity: Int32

    init(){
        self.name = ""
        self.date = ""
        self.geoposition = [0.0,0.0]
        self.popularity = 0
    }
    
    init(nom:String, date:String, lat: Double, lon: Double, popularity: Int32){
        self.name = ""
        self.date = ""
        self.geoposition = [lat,lon]
        self.popularity = popularity
    }
}
