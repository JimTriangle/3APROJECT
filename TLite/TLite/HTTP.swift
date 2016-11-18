//
//  HTTP.swift
//  
//
//  Created by Student on 17/11/2016.
//
//

import Foundation
import Alamofire
import SwiftyJSON

func post(){
    
}

func put(){
    
}

func get(ip: String, road: String, query: String, params: [String : Any], dest: inout JSON) -> JSON {
    
    Alamofire.request(ip + road + query, parameters: params).responseJSON { response in
        print(response.request)  // original URL request
        print(response.response) // HTTP URL response
        print(response.data)     // server data
        print(response.result)   // result of response serialization
        
        if let qJSON = response.result.value {
            return(JSON(qJSON))
        }
        
    }
    
}
