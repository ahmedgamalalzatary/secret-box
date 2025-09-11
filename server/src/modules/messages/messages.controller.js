import { authentication } from "../../middleware/authentication.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { attachmentsTypes, cloudFileUpload } from "../../utils/multer/cloud.multer.js";
import * as messagesService from "./messages.service.js"
import * as messagesValidation from "./messages.validation.js"

import { Router } from "express";

const messagesRouter = Router({
    caseSensitive: true,
    strict: true
});



messagesRouter.post("/:reciverId",
    cloudFileUpload({ attachments: attachmentsTypes.images }).single("image"),
    validationMiddleware(messagesValidation.sendMessage)
    , messagesService.sendMessage)


messagesRouter.post("/:reciverId/user",
    authentication(),
    cloudFileUpload({ attachments: attachmentsTypes.images }).single("image"),
    validationMiddleware(messagesValidation.sendMessage)
    , messagesService.sendMessage)


messagesRouter.get("/",
    authentication(),
    messagesService.inpox)


messagesRouter.delete("/:messageId",
    authentication(),
    messagesService.deleteMessage)


messagesRouter.post("/reply/:messageId",
    authentication(),
    cloudFileUpload({ attachments: attachmentsTypes.images }).single("image"),
    validationMiddleware(messagesValidation.replyMessage),
    messagesService.replyMessage)

messagesRouter.get("/sent",
    authentication(),
    messagesService.getSentMessages)


export default messagesRouter; 