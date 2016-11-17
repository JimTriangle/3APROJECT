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

router.post("addUser", handler: addUser)

<<<<<<< HEAD


router.post("token", handler: token)

router.get("tokens", handler: tokens)
=======
router.post("login", handler: login)

router.post("token", handler: token)

router.post("tokens", handler: tokens)
>>>>>>> 065f8aec128915fe941fef15a01f9da55bbd508d
 
// Start server
Log.info("Starting server")
Kitura.addHTTPServer(onPort: 3030, with: router)
Kitura.run()