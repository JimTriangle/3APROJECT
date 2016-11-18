import HeliumLogger
import Foundation
import Kitura
import LoggerAPI
import SwiftyJSON
import SQLite

func token(request: RouterRequest, response: RouterResponse, next: ()->Void)-> Void{
	print("Vérification d'un token -> /token")
	
	let contentType = request.headers["Content-Type"] ?? "";
	guard let rawData = try! request.readString(),
		contentType.hasPrefix("application/json") else {
        Log.info("No data")
        response.status(.badRequest).send(json: JSON(["error": "No data received"]))
        next()
        return
   	}

   	let json = rawData.data(using: String.Encoding.utf8)
   	let swiftyResult = JSON(data: json!)

    do {
		let db = try SQLite(path:"/home/wasoh/PROJET/3APROJECT/wsAuth/dbUser.db")
		var dureeTokenMax:Double = 99999999999

		var query:String = "SELECT date_last_use FROM Tokens WHERE token = "
		query += "'" + swiftyResult["token"].string! + "';"
			
		do{
			let strDate = try db.execute(query)

			print(query)
			print(strDate)
			let oldDateString:String = String(strDate[0].data["date_last_use"]!)
			let dateFormatter = DateFormatter()
			dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
			let oldDate = dateFormatter.date(from:oldDateString)
			let currentDate = Date()

			let dureeToken = currentDate.timeIntervalSince(oldDate!)

			if(dureeToken > dureeTokenMax){
				response.status(.OK).send(json: JSON(["resultat":"ko"]))
			}else{
				dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
				let currentDateString = dateFormatter.string(from:currentDate)
				query = "UPDATE Token SET date_last_use = "
				query += "'" + currentDateString + "' WHERE token = "
				query += "'" + swiftyResult["token"].string! + "';"
				response.status(.OK).send(json: JSON(["resultat":"ok"]))
			}
		}catch{
			print("Request error")
			response.status(.internalServerError)
			return
		}
		db.close()
	}catch{
		print("Erreur de connexion à la base de donnée")
		response.status(.internalServerError)
		return
	}
	
	next()
}