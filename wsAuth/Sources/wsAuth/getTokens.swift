import HeliumLogger
import Foundation
import Kitura
import LoggerAPI
import SwiftyJSON
import SQLite

func tokens(request: RouterRequest, response: RouterResponse, next: ()->Void)-> Void{
	print("Obtention des tokens -> /tokens")
	
	let contentType = request.headers["Content-Type"] ?? "";
	guard let rawData = try! request.readString(),
		contentType.hasPrefix("application/json") else {
        Log.info("No data")
        response.status(.badRequest).send(json: JSON(["error": "No data received"]))
        next()
        return
   	}

   	let json = rawData.data(using: String.Encoding.utf8)
   	let tokenInit = JSON(data: json!)

    do {
		let db = try SQLite(path:"/home/wasoh/3APROJECT/wsAuth/dbUser.db")

		var query:String = "SELECT token FROM Tokens WHERE id_user = (SELECT id_user FROM Tokens WHERE token = "
		query += "'" + tokenInit["token"].string! + "');"
			
		do{
			let tokens = try db.execute(query)

			print(tokens)

			var stringTokens = "{\"Tokens\": ["

			for token in tokens{
				stringTokens += "{\"" + token.data["token"]! + "\"},"
			}
			stringTokens += "$$$"
			var stringTokenReturn:String = stringTokens.replacingOccurrences(of: ",$$$", with:"", options: .literal, range:nil)
			stringTokenReturn += "]}"

			let jsonReturn = stringTokenReturn.data(using: String.Encoding.utf8)



			print(JSON(data: jsonReturn!))

			response.status(.OK).send(stringTokenReturn)
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