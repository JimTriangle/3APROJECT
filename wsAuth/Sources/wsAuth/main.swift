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



router.post("token", handler: token)

router.get("tokens", handler: tokens)
 
// Start server
Log.info("Starting server")
Kitura.addHTTPServer(onPort: 3030, with: router)
Kitura.run()