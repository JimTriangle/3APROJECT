import SwiftyJSON
import SQLite

class Users{
	let id_user: Int
	let nom_user: String
	let prenom_user: String
	let pseudo_user: String
	let date_naiss_user: String

	public init(id_user: Int, nom_user: String, prenom_user: String, pseudo_user: String, date_naiss_user: String){
		self.id_user = id_user
		self.nom_user = nom_user
		self.prenom_user = prenom_user
		self.pseudo_user = pseudo_user
		self.date_naiss_user = date_naiss_user
	}
}