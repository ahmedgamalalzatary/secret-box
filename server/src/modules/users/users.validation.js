import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
import { attachmentsTypes } from "../../utils/multer/local.multer.js";

export const shareProfile = {
    params: joi.object().keys({
        userId: generalFields.id.required()
    }).required().options({ allowUnknown: false })
}

export const updateBasicInfo = {
    body: joi.object().keys({
        firstName: generalFields.firstName,
        lastName: generalFields.lastName,
        phone: generalFields.phone,
        gender: generalFields.gender,
    }).required().options({ allowUnknown: false })
}

export const freezAccount = {
    params: joi.object().keys({
        userId: generalFields.id
    }).required().options({ allowUnknown: false })
}

export const restoreAccount = {
    params: joi.object().keys({
        userId: generalFields.id.required()
    }).required().options({ allowUnknown: false })
}


export const uploadImage = {
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

    }).required().options({ allowUnknown: false })
}


export const uploadProfileCover = {
    files: joi.array().items(
        joi.object().keys({
            fieldname: joi.string().valid("images").required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().valid(...Object.values(attachmentsTypes.images.types)).required(),
            // finallPath: joi.string().required(),
            destination: joi.string().required(),
            filename: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().positive().required()
        }).required()
    ).required().options({ allowUnknown: false }).min(1).max(2)
}




export const searchForUser = {
    query: joi.object().keys({
        query: joi.string()
            .trim()
            .pattern(/^[\w\s@.]+$/) // حروف وأرقام ومسافات وبعض الرموز المسموحة
            .min(1)
            .max(50)
            .required(),
        page: joi.number().integer().min(1).default(1),
        limit: joi.number().integer().min(1).max(50).default(20),
    }).required().options({ allowUnknown: false })
};
