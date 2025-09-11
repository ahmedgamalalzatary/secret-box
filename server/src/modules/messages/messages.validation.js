import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
import { attachmentsTypes } from "../../utils/multer/cloud.multer.js";

export const sendMessage = {
    params: joi.object().keys({
        reciverId: generalFields.id.required()
    }).required().options({ allowUnknown: false }),

    body: joi.object().keys({
        content: joi.string().min(5).max(20000)
    }).options({ allowUnknown: false }),


    file: joi.object().keys({
        fieldname: joi.string().valid("image").required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().valid(...Object.values(attachmentsTypes.images.types)).required(),
        // finallPath: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().positive().required()
    }).options({ allowUnknown: false }),
}

export const replyMessage = {
    params: joi.object().keys({
        messageId: generalFields.id.required()
    }).required().options({ allowUnknown: false }),
    body: sendMessage.body,
    file: sendMessage.file
}