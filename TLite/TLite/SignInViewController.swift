//
//  SignInViewController.swift
//  TLite
//
//  Created by Student on 09/11/2016.
//  Copyright © 2016 MDR. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

extension Date {
    func toString() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MMMM dd yyyy"
        return dateFormatter.string(from: self)
    }
}

class SignInViewController: UIViewController {
    
    @IBOutlet weak var UsernameTextField: UITextField!
    @IBOutlet weak var EmailTextField: UITextField!
    @IBOutlet weak var PasswordTextField: UITextField!
    @IBOutlet weak var FirstNameTextField: UITextField!
    @IBOutlet weak var LastNameTextField: UITextField!
    @IBOutlet weak var BirthDateTextField: UITextField!
    
    @IBOutlet weak var DatePicker: UIDatePicker!
    @IBOutlet weak var DatePickerHeight: NSLayoutConstraint!

    @IBOutlet weak var EditBirthDateButton: UIButton!
    
    override func viewDidLoad() {
        DatePickerHeight.constant = 0
        DatePicker.isHidden = true
        BirthDateTextField.isEnabled = false
        BirthDateTextField.text = DatePicker.date.toString()
        super.viewDidLoad()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let dest = segue.destination as? TopicTableViewController {
            let username : String!
            username = UsernameTextField.text
            dest.username = username
        }
    }
    

    // MARK: - Action
    
    func customPerformSegue(alert: UIAlertAction!){
        //unwind(for: Segue("unwindToLoginPageWithSegue"), towardsViewController: "Sign in")
        //unwindToContainerVC(segue: "unwindToLoginPageWithSegue")
        //unwind(for: "unwindToLoginPageWithSegue", towardsViewController: self.self)
        performSegue(withIdentifier: "unwindRegisterSegue", sender: self.self)
    }

    @IBAction func RegisterPressed(_ sender: UIButton){
        //Test des champs
        if(LastNameTextField.text! == "" || FirstNameTextField.text! == "" || UsernameTextField.text! == "" || EmailTextField.text! == "" || PasswordTextField.text! == ""){
            let alert = UIAlertController(title: "Alert", message: "EmptyField", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        } else {
            let parameters: [String : Any] = [
                "nom_user" : LastNameTextField.text!,
                "prenom_user" : FirstNameTextField.text!,
                "pseudo_user" : UsernameTextField.text!,
                "email_user" : EmailTextField.text!,
                "password_user" : PasswordTextField.text!,
                "date_naiss_user" : String(describing: DatePicker.date)
            ]
            
            Alamofire.request("http://172.30.1.167:3030" + "/addUser", method: .post, parameters: parameters, encoding: JSONEncoding.default)
                .responseJSON { response in
                    print(response)
                    if let qJSON = response.result.value {
                        print("JSON: \(qJSON)")
                        let dataJSON = JSON(qJSON)
                        
                        if dataJSON["resultat"] == "ok" {
                            let alert = UIAlertController(title: "Alert", message: "Account created\nYou can now log yourself", preferredStyle: UIAlertControllerStyle.alert)
                            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: self.customPerformSegue))
                            self.present(alert, animated: true, completion: nil)
                            
                        } else {
                            let alert = UIAlertController(title: "Alert", message: "Incorrect identifiers", preferredStyle: UIAlertControllerStyle.alert)
                            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
                            self.present(alert, animated: true, completion: nil)
                        }
                    }
                    
            }

        }
    }
    
    @IBAction func EditPressed(_ sender: UIButton) {
        if DatePicker.isHidden {
            DatePicker.isHidden = false
            DatePickerHeight.constant = 135
            EditBirthDateButton.setTitle("Done", for: .normal)
        } else {
            DatePicker.isHidden = true
            DatePickerHeight.constant = 0
            EditBirthDateButton.setTitle("Edit", for: .normal)
        }
    }
    
    @IBAction func DateChanging(_ sender: UIDatePicker) {
        BirthDateTextField.text = DatePicker.date.toString()
    }
    
    
}
