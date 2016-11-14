import SQLite

func getUsers() -> [String]{
	do{
		let db = try SQLite(path:"/home/wasoh/wsAuth/dbUser.db")
		let query = "SELECT * FROM Users;"
		var retour: [String] = []

		let res = try db.execute(query)

		db.close()

		for user in res{
			print(String(user.data["email_user"]!) + "\n")
			retour += [String(user.data["email_user"]!)]
		}

		// print(getClassName(obj:res))

		return retour
	}catch{
		print("Erreur de connexion au serveur (vérifier le chemin)")
		return ["Echec"]
	}
}