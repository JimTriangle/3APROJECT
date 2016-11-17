import HeliumLogger
import Foundation
import Kitura
import LoggerAPI
import SwiftyJSON
import SQLite

func login(request: RouterRequest, response: RouterResponse, next: ()->Void)-> Void{
	Log.info("Identification d'un utilisateur -> /login")

	let contentType = request.headers["Content-Type"] ?? "";
	guard let rawData = try! request.readString(),
		contentType.hasPrefix("application/json") else {
        Log.info("No data")
        response.status(.badRequest).send(json: JSON(["error": "No data received"]))
        next()
        return
   	}

    let json = rawData.data(using: String.Encoding.utf8)
   	let dataUser = JSON(data: json!)
    
    do {
		let db = try SQLite(path:"/home/wasoh/PROJET/3APROJECT/wsAuth/dbUser.db")
		var query:String = "SELECT * FROM Users WHERE pseudo_user = "
		query +=  "'" + dataUser["pseudo_user"].string! + "', AND password_user"
		query +=  "'" + dataUser["password_user"].string! + "';"

		print(query)


		do{
			try db.execute(query)
			response.status(.OK).send(json: JSON(["resultat":"ok"]))
		}catch{
			response.status(.OK).send(json: JSON(["resultat":"ko"]))
		}
	}catch{
		print("Erreur de connexion à la base de donnée")
		response.status(.internalServerError)
		return
	}

	next()
}

/*
curl -i -X POST http://localhost:3030/addUser -H "Content-Type: application/json" -d '{"nom_user":"LAMOULE", "prenom_user":"LHUITRE", "pseudo_user":"patate", "email_user":"patate@FDP.com", "password_user":"987", "date_naiss_user":"2007-10-15"}'
*/