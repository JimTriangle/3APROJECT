import SwiftyJSON

class Tokens{
	let id_token: Int
	let id_user: Int
	let token: String
	let date_last_use: String

	public init(id_token:Int, id_user:Int, token:String, date_last_use:String){
		self.id_token = id_token
		self.id_user = id_user
		self.token = token
		self.date_last_use = date_last_use
	}

	public func toJSON()->JSON{
		return JSON([
			"token": self.token
		])
	}
}