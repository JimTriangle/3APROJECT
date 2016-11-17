import HeliumLogger
import Foundation
import Kitura
import LoggerAPI
import SwiftyJSON
import SQLite

func createToken() -> String {
    let base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    var randomString: String = ""

    for _ in 0..<6 {
        let randomValue = random() % 36
        randomString += "\(base[base.index(base.startIndex, offsetBy: Int(randomValue))])"
    }

	if(checkExistToken(token: randomString) == true){
		randomString = createToken()
	}

    return randomString
}

func checkExistToken(token: String) -> Bool{
	var test:Bool = true
	do{
		let db = try SQLite(path:"/home/wasoh/PROJET/3APROJECT/wsAuth/dbUser.db")

		do{
			let query:String = "SELECT * FROM Tokens WHERE token = '" + token + "';"

			let tokens = try db.execute(query)

			var i:Int = 0
			for token in tokens{
				i = i + 1
			}

			if(i == 0){
				test = false
			}

			return test
		}
		catch{
			print("Requete échouée")
			return false
		}
	}
	catch{
		print("Echec de connexion à la base de donnée")
		return false
	}
}