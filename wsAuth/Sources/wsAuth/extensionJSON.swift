import HeliumLogger
import Foundation
import Kitura
import LoggerAPI
import SwiftyJSON
import SQLite

extension JSON{
    mutating func appendIfArray(json:JSON){
        if var arr = self.array{
            arr.append(json)
            self = JSON(arr);
        }
    }

    mutating func appendIfDictionary(key:String,json:JSON){
        if var dict = self.dictionary{
            dict[key] = json;
            self = JSON(dict);
        }
    }
}