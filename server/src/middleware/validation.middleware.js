import { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/response.js"

import joi from "joi"
import { genderEnum } from "../DB/models/user.model.js"



export const generalFields = {
    userName: joi.string()
        .pattern(/^[a-zA-Z]{2,20}\s[a-zA-Z]{2,20}$/)
        .messages({
            'string.pattern.base': 'userName must be in the format: "Firstname Lastname".',
            'string.empty': 'userName cannot be empty.',
            'any.required': 'userName is required.',
        }),

    firstName: joi.string()
        .pattern(/^[A-Z][a-z]{2,19}$/)
        .messages({
            'string.pattern.base': 'firstName must start with a capital letter and contain 3 to 19 letters.',
            'string.empty': 'firstName cannot be empty.',
            'any.required': 'firstName is required.',
        }),

    lastName: joi.string()
        .pattern(/^[A-Z][a-z]{2,19}$/)
        .messages({
            'string.pattern.base': 'lastName must start with a capital letter and contain 3 to 19 letters.',
            'string.empty': 'lastName cannot be empty.',
            'any.required': 'lastName is required.',
        }),


    email: joi.string().email(),
    password: joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/)).message(
        {
            'string.pattern.base': 'Password must be 8–16 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).',
            'string.empty': 'Password is not allowed to be empty.',
            'any.required': 'Password is required.',
        }
    ),
    phone: joi.string().pattern(new RegExp(/^(002|\+20)?01[0125][0-9]{8}$/)),
    age: joi.number().positive().min(16).max(65),
    gender: joi.string().valid(...Object.values(genderEnum)),
    OTP: joi.string().pattern(new RegExp(/^\d{6}$/)),
    id: joi.string().custom((value, helper) => {
        return isValidObjectId(value) || helper.message("In-Valid ObjectId")
    }),
    token: joi.string()
}

export const validationMiddleware = (schima) => {
    return asyncHandler(

        async (req, res, next) => {


            let validationError = []


            for (const key of Object.keys(schima)) {
                const validationResult = schima[key].validate(req[key], { abortEarly: false })
                if (validationResult.error) {
                    validationError.push({
                        key,
                        details: validationResult.error.details.map(ele => {
                            return {
                                path: ele.path,
                                message: ele.message
                            }
                        })
                    })
                }
            }

            if (validationError.length) {
                return res.status(400).json({
                    error_name: "validationerror",
                    error: validationError
                })
            }

            return next()



        }

    )
}

