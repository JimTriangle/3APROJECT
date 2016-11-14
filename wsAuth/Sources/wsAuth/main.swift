import HeliumLogger
import Foundation
import Kitura
import LoggerAPI
import SwiftyJSON
 
// Disable buffering
setbuf(stdout, nil)
 
// Attach a logger
Log.logger = HeliumLogger()
 
// setup routes
let router = Router()
router.get("/") { _, response, next in
    response.status(.OK).send(json: JSON(["huitre"]))
    
    next()
}

router.get("users"){ _, response, next in
	
	let users = getUsers()

	for user in users{
		print(user)
	}

	response.status(.OK)

	next()
}
 
// Start server
Log.info("Starting server")
Kitura.addHTTPServer(onPort: 8090, with: router)
Kitura.run()