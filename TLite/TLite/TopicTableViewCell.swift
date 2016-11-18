//
//  TopicTableViewCell.swift
//  TLite
//
//  Created by Student on 10/11/2016.
//  Copyright © 2016 MDR. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class TopicTableViewCell: UITableViewCell {


    @IBOutlet weak var TopicNameLabel: UILabel!
    @IBOutlet weak var TopicPopularityLabel: UILabel!
    var TableViewController: UITableViewController? = nil
    var token :String = ""
    var Activity: JSON = []
    
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    @IBAction func SharePressed(_ sender: Any) {
        
        let alert = UIAlertController(title: "Share", message: "Do you want to share this post?", preferredStyle: UIAlertControllerStyle.alert)
        alert.addAction(UIAlertAction(title: "Yes", style: UIAlertActionStyle.default, handler: { (action) -> Void in
            self.share()
        }))
        alert.addAction(UIAlertAction(title: "No", style: UIAlertActionStyle.default, handler: nil ))
        self.TableViewController?.present(alert, animated: true, completion: nil)
    }
    
    func share(){
        let TableView = TableViewController?.tableView
        TableView?.selectRow(at: TableView?.indexPath(for: self), animated: true, scrollPosition: UITableViewScrollPosition.none)
        
        let url = URL(string: "http://172.30.1.56:3010/topic?token="+self.token)
        var request = URLRequest(url: url!)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
 
        let perimeterS: String = String(describing: Activity["perimeter"])
        let perimeter :Int = Int(perimeterS)!
        let date : String = String(describing: Activity["date"])
        let popularityS : String = String(describing: Activity["popularity"])
        let popularity :Int = Int(popularityS)!
        let topic : String = String(describing: Activity["topic"])
        let latS : String = String(describing: Activity["geoposition"]["latitude"])
        let lat :Double = Double(latS)!
        let lonS : String = String(describing: Activity["geoposition"]["longitude"])
        let lon :Double = Double(lonS)!
        
        let parameters: [String: Any] = [
            "topic": topic,
            "date": date,
            "geoposition": [
                "latitude": lat,
                "longitude": lon
            ],
            "popularity":popularity,
            "perimeter": perimeter
        ]
        
        print(parameters)

        request.httpBody = try! JSONSerialization.data(withJSONObject: parameters)
        
        Alamofire.request(request)
            .responseJSON { response in
                switch response.result {
                case .failure(let error):
                    print(error)
                    
                    if let data = response.data, let responseString = String(data: data, encoding: .utf8) {
                        print(responseString)
                    }
                case .success(let responseObject):
                    print(response.result.value)
                }
                
                if let qJSON = response.result.value {
                    print("JSON: \(qJSON)")
                    print(JSON(qJSON))
                }
                if let str = response.request?.url {
                    print("~~~URL~~~\n", str)
                }
        }
    }

    @IBAction func MapPressed(_ sender: Any) {
        let TableView = TableViewController?.tableView
        TableView?.selectRow(at: TableView?.indexPath(for: self), animated: true, scrollPosition: UITableViewScrollPosition.none)
    }
}
