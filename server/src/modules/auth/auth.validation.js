import joi from "joi"
import { generalFields } from "../../middleware/validation.middleware.js"
import { logoutEnum } from "../../utils/security/token.security.js"


export const login = {

    body: joi.object().keys({
        email: generalFields.email.required(),
        password: generalFields.password.required(),
    }).required().options({ allowUnknown: false })

}

export const signUp = {
    body: login.body.append({
        userName: generalFields.userName.required(),
        phone: generalFields.phone.required(),
        gender: generalFields.gender,
        confirmPassword: joi.string().valid(joi.ref("password")).required(),
    }).required().options({ allowUnknown: false }),
}

export const confirmEmail = {

    body: joi.object().keys({

        email: generalFields.email.required(),
        OTP: generalFields.OTP.required()

    }).required().options({ allowUnknown: false }),
}





export const forgetPassword = {
    body: joi.object().keys({

        email: generalFields.email.required()

    }).required().options({ allowUnknown: false })
}


export const verifyForgetPassword = {
    body: forgetPassword.body.append({
        OTP : generalFields.OTP.required(),
    }).required().options({ allowUnknown: false })
}

export const reSetPassword = {
    body: verifyForgetPassword.body.append({
        newPassword : generalFields.password.required()
    }).required().options({ allowUnknown: false })
}


export const logOut = {
    body:joi.object().keys({
        flag : joi.string().valid(...Object.values(logoutEnum)).default(logoutEnum.stayLoggedIn)
    })
}


export const changePassword = {
    body: logOut.body.append({
        oldPassword: generalFields.password.required(),
        newPassword: generalFields.password.not(joi.ref("oldPassword")).required(),
        confirmNewPassword: joi.string().valid(joi.ref("newPassword"))
    }).required().options({ allowUnknown: false })
}