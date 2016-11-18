//
//  TopicListViewController.swift
//  TLite
//
//  Created by Student on 10/11/2016.
//  Copyright © 2016 MDR. All rights reserved.
//

import UIKit

let Topics = ["Apple", "Samsung", "Explosion", "Essences"]
let textCellIdentifier = "TextCell"

class TopicListViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var UsernameLabel: UILabel!
    @IBOutlet weak var TopicTableView: TopicTableView!

    var username: String!
    
    func signout(_ sender: Any?) {
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        TopicTableView.delegate = self
        TopicTableView.dataSource = self
        UsernameLabel.text = username
        // Do any additional setup after loading the view.
        
        title = username
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    
    func numberOfSectionsInTableView(TopicTableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ TopicTableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return Topics.count
    }
    
    func tableView(_ TopicTableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = TopicTableView.dequeueReusableCell(withIdentifier: textCellIdentifier, for: indexPath as IndexPath)
        
        let row = indexPath.row
        cell.textLabel?.text = Topics[row]
        
        return cell
    }
    
    // MARK:  UITableViewDelegate Methods
    private func tableView(TopicTableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        TopicTableView.deselectRow(at: indexPath as IndexPath, animated: true)
        
        let row = indexPath.row
        print(Topics[row])
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
