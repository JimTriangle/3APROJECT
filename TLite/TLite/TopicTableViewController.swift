//
//  TopicTableViewController.swift
//  TLite
//
//  Created by Student on 11/11/2016.
//  Copyright © 2016 MDR. All rights reserved.
//

import UIKit
import SwiftyJSON
import Alamofire
import MapKit
import CoreLocation



class TopicTableViewController: UITableViewController, CLLocationManagerDelegate {

    var username: String! = ""
    let locationManager = CLLocationManager()
    var location: CLLocation = CLLocation.init()
    var token: String? = ""
    
    @IBOutlet weak var SearchTextField: UITextField!
    
    
    var dataJSON:JSON = []
    
    
    
    override func viewDidLoad() {
        title = username
        editButtonItem.title = "Log out"
        
        topicRequest()
        
        // Ask for Authorisation from the User.
        self.locationManager.requestAlwaysAuthorization()
        
        // For use in foreground
        self.locationManager.requestWhenInUseAuthorization()
        
        if (CLLocationManager.locationServicesEnabled())
        {
            let locationManager = CLLocationManager()
            locationManager.delegate = self
            locationManager.desiredAccuracy = kCLLocationAccuracyBest
            locationManager.requestAlwaysAuthorization()
            locationManager.startUpdatingLocation()
        }
        
        super.viewDidLoad()
        
        //refresh
        self.refreshControl?.addTarget(self, action: #selector(handleRefresh), for: UIControlEvents.valueChanged)
    }
    
    func handleRefresh() {
        // Do some reloading of data and update the table view's data source
        // Fetch more objects from a web service, for example...
        
        topicRequest()
        refreshControl?.endRefreshing()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation])
    {
        self.location = locations.last!
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func topicRequest(){
        let params : [String:Any] = [
            "latitude" : 3.11549,
            "longitude" : 1.213156,
            "perimeter" : 100000,
            "time" : 100000,
            "token" : self.token!
        ]
        //http://172.30.1.56:3010/geo?latitude=3.11549&longitude=1.213156&perimeter=10000&time=100000&token\%223FE263\%22
        Alamofire.request("http://172.30.1.56:3010/geo", parameters: params).responseJSON { response in
            //print(response.request)  // original URL request
            //print(response.response) // HTTP URL response
            //print(response.data)     // server data
            //print(response.result)   // result of response serialization
            
            if let qJSON = response.result.value {
                print(qJSON)
                self.dataJSON = JSON(qJSON)
                print("&&&&&&&&&&&&&&&&&&&&\n",self.dataJSON)
                self.tableView.reloadData()
                //let toto = self.dataJSON["error"].string
                //print(toto!)
            }
            
            if let str = response.request?.url {
                print("~~~URL~~~\n", str)
            }
        }
    }
    
    // MARK: - Table view data source
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        let n = dataJSON.count
        return n
    }
    
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "TopicCell", for: indexPath) as! TopicTableViewCell
        let localActivity = dataJSON[indexPath.row]
        
        cell.TableViewController = self
        cell.TopicNameLabel.text = String(describing: localActivity["topic"])
        cell.TopicPopularityLabel.text = String(describing: localActivity["popularity"])
        cell.Activity = dataJSON[indexPath.row]
        cell.Activity["geoposition"]["latitude"] = 3.11549
        cell.Activity["geoposition"]["longitude"] = 1.213156
        cell.token = self.token!
        
        return cell
    }


    
    // MARK: - Navigation

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if let dest = segue.destination as? MapViewController {
            //print(dataJSON["history"][tableView.indexPathForSelectedRow!.row])
            let Activity = dataJSON[tableView.indexPathForSelectedRow!.row]
            dest.Activity = Activity
        }
    }
    
    @IBAction
    func unwindToTopicTablePage(segue: UIStoryboardSegue) {
    }

    // MARK: - Action

    @IBAction func NewPostPressed(_ sender: Any) {

        var inputTextField: UITextField?
        let topicPrompt = UIAlertController(title: "Post a new topic", message: "Enter your new topic below", preferredStyle: UIAlertControllerStyle.alert)
        
        topicPrompt.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: { (action) -> Void in
            self.post(tf: inputTextField!)
        }))
        topicPrompt.addAction(UIAlertAction(title: "Cancel", style: UIAlertActionStyle.default, handler: nil))
        topicPrompt.addTextField(configurationHandler: {(textField: UITextField!) in
            textField.placeholder = "Topic name"
            inputTextField = textField
        })
        
        present(topicPrompt, animated: true, completion: nil)
    }
    
    func post(tf: UITextField){
        if (tf.text!.characters.count > 24 || tf.text!.characters.count == 0){
            let alert = UIAlertController(title: "Alert", message: "Your post is incorrect", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        
        }else{
            
            let date = NSDate()
            let topicName = tf.text!
            //YYYY-MM-DDTHH:MM:SS
            let formatterDate1 = String(describing: date).replacingOccurrences(of: " ", with: "T", options: .literal, range: nil)
            let formatterDate2 = formatterDate1.replacingOccurrences(of: "T+0000", with: "", options: .literal, range: nil)
            //GMT+0
            let topicDate = formatterDate2
            let topicLat: Double = 3.11549 //location.coordinate.latitude
            let topicLon: Double = 1.213156 //location.coordinate.longitude
            let topicPopularity = 1
            let topicPerimeter = 0
            
            let parameters: [String: Any] = [
                "topic": topicName,
                "date": topicDate,
                "geoposition": [
                    "lat": topicLat,
                    "lon": 3.11549],
                "popularity":1.213156,
                "perimeter": topicPerimeter
            ]
            
            //let url = URL(string: "http://172.30.1.56:3010"+"http://172.30.1.56:3010")
            let url = URL(string: "http://172.30.1.56:3010"+"/topic?token="+self.token!)
            var request = URLRequest(url: url!)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            
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
                    
                    self.topicRequest()
            }
        }
    }

    @IBAction func MePressed(_ sender: Any) {
        let params : [String:Any] = [
            "token" : token!
            ]
        
        Alamofire.request("http://172.30.1.56:3010/user", parameters: params).responseJSON { response in
            
            if let qJSON = response.result.value {
                print("JSON: \(qJSON)")
                self.dataJSON = JSON(qJSON)
                print(self.dataJSON)
            }
            
            if let str = response.request?.url {
                print("~~~URL~~~\n", str)
            }
            
            self.tableView.reloadData()
        }
    }
    
    @IBAction func RefreshPressed(_ sender: Any) {
        topicRequest()
        
    }
    
    @IBAction func SearchPressed(_ sender: Any) {
        let params : [String:Any] = [
            "latitude" : 3.11549, //location.coordinate.latitude,
            "longitude" : 1.213156, //location.coordinate.longitude,
            "topic" : self.SearchTextField.text!,
            "token" : self.token!
        ]
        print(params)
        Alamofire.request("http://172.30.1.56:3010/topic", parameters: params).responseJSON { response in
            
            if let qJSON = response.result.value {
                print("JSON: \(qJSON)")
                self.dataJSON = JSON(qJSON)
                print(self.dataJSON)
            }
            
            if let str = response.request?.url {
                print("~~~URL~~~\n", str)
            }
            
            self.tableView.reloadData()
            
        }
    }
    }
    


