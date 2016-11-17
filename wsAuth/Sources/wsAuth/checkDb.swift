import SQLite

func getUsers() -> [String]{
	do{
		let db = try SQLite(path:"/home/wasoh/3APROJECT/wsAuth/dbUser.db")
		let query = "INSERT INTO Users('nom_user', 'prenom_user', 'pseudo_user', 'email_user', 'password_user', 'date_naiss_user') VALUES ('pomme','terre','huitre','huitre@gmail.com','tartiflette','10-08-1994');"
		var retour: [String] = []

		do{
			let res = try db.execute(query)

			db.close()

			// for user in res{
			// 	print(String(user.data["email_user"]!) + "\n")
			// 	retour += [String(user.data["email_user"]!)]
			// }
		}catch{
			print(query)
			return["Echec de la requête"]
		}
		

		// print(getClassName(obj:res))

		return retour
	}catch{
		return ["Echec de la connexion"]
	}
}