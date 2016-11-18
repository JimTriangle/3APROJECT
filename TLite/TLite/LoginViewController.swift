//
//  LoginViewController.swift
//  TLite
//
//  Created by Student on 09/11/2016.
//  Copyright © 2016 MDR. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class LoginViewController: UIViewController {

    
    @IBOutlet weak var loginTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    
    @IBOutlet weak var loginButton: UIButton!
    var link:JSON = []
    var IP = "http://172.30.1.167:3030"
    var token : String? = nil
    var loginFini = 0
    var data: JSON = []

    
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    // MARK: - Navigation
    
    @IBAction
    func unwindToLoginPage(segue: UIStoryboardSegue) {
        passwordTextField.text = ""
        loginFini = 0
        token = "null"
    }

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let dest = segue.destination as? TopicTableViewController {
            let username : String!
            username = loginTextField.text
            dest.username = username
            dest.token = self.token//link
     }
    }
 
    override func shouldPerformSegue(withIdentifier identifier: String, sender: Any?) -> Bool {
        if identifier == "loginSegue" {
            if (self.loginFini == 0 && self.token != "null") {
                return false
            }
            else {
                passwordTextField.text = ""
                loginFini = 0
                token = "null"
                return true
            }
        }
        
        // by default, transition
        return true
    }
    
    @IBAction func loginButtonPressed(_ sender: Any) {
        let loginField : String!
        let passwordField : String!
        loginField = loginTextField.text
        passwordField = passwordTextField.text
        
        //Login
        let params : [String:Any] = [
            "pseudo_user" : loginTextField.text!,
            "password_user" : passwordTextField.text!
        ]
        print(params)
        
        Alamofire.request(IP + "/login", method: .post, parameters: params, encoding: JSONEncoding.default)
            .responseJSON { response in
                
                if let qJSON = response.result.value {
                    self.data = JSON(qJSON)
                    self.token = String(describing:self.data["token"])
                    if let qJSON = response.result.value {
                        print("JSON: \(qJSON)")
                        self.loginFini = 1
                        //Analyse du message reçu
                        
                        sleep(1)
                        if (self.token! == "null" ){
                            //Si popup
                            let alert = UIAlertController(title: "Alert", message: "Incorrect identifiers", preferredStyle: UIAlertControllerStyle.alert)
                            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
                            self.present(alert, animated: true, completion: nil)
                        } else {
                            //Sinon on se log
                            let backItem = UIBarButtonItem()
                            backItem.title = "Back"
                            self.navigationItem.backBarButtonItem = backItem
                            
                            sleep(2)
                            self.performSegue(withIdentifier: "loginSegue", sender: nil)
                        }
                    }
                } else {
                    self.token = "null"
                }
                if let str = response.request?.url {
                    print("~~~URL~~~\n", str)
                }
                
        }
    }

}
