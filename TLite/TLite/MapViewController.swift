//
//  MapViewController.swift
//  TLite
//
//  Created by Student on 14/11/2016.
//  Copyright © 2016 MDR. All rights reserved.
//

import UIKit
import SwiftyJSON
import MapKit


class MapViewController: UIViewController {

    @IBOutlet weak var MapView: MKMapView!
    
    var Activity: JSON = []
    
    override func viewDidLoad() {
        super.viewDidLoad()

        title = String(describing: Activity["topic"])
        print(Activity)
        
        let geo = Activity["geoposition"]
        let lat = Double(String(describing: geo["latitude"]))
        let lon = Double(String(describing: geo["longitude"]))
        let initialLocation = CLLocation(latitude: lat!, longitude: lon!)
        let regionRadius: CLLocationDistance = 100000
        func centerMapOnLocation(location: CLLocation) {
            let coordinateRegion = MKCoordinateRegionMakeWithDistance(location.coordinate,
                                                                      regionRadius * 2.0, regionRadius * 2.0)
            MapView.setRegion(coordinateRegion, animated: true)
        }
        
        MapView.showsUserLocation = true
        
        centerMapOnLocation(location: initialLocation)
        MapView.mapType = MKMapType.standard
        
        
        var MarkerLoc: CLLocationCoordinate2D = CLLocationCoordinate2D.init()
        
        MarkerLoc.latitude = lat!
        MarkerLoc.longitude = lon!
        
        let MarkerPoint: MKPointAnnotation = MKPointAnnotation.init()
        MarkerPoint.coordinate = MarkerLoc
        MarkerPoint.title = String(describing: Activity["topic"])
        MarkerPoint.subtitle = "Popularity : " + String(describing: Activity["popularity"]) + " Date : " + String(describing: Activity["date"]).replacingOccurrences(of: "T", with: " ", options: .literal, range: nil)
        
        MapView.addAnnotation(MarkerPoint)
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    @IBAction func ZoomInPressed(_ sender: Any) {
    }

    @IBAction func ZoomOutPressed(_ sender: Any) {
    }

    @IBAction func TypePressed(_ sender: Any) {
        if MapView.mapType == MKMapType.standard {
            MapView.mapType = MKMapType.satellite
        } else {
            MapView.mapType = MKMapType.standard
        }
    }
    
    
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
