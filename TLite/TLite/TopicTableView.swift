//
//  TopicTableView.swift
//  TLite
//
//  Created by Student on 10/11/2016.
//  Copyright © 2016 MDR. All rights reserved.
//

import UIKit

class TopicTableView: UITableView {

    let data = ["topic1","topic2"]
    
    // MARK: - Table view data source
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        
        cell.textLabel?.text = data[indexPath.row]
        
        return cell
    }

}
