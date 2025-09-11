import jwt from 'jsonwebtoken';
import { roleEnum, UserModel } from '../../DB/models/user.model.js';
import * as DBService from "../../DB/DB.service.js"
import { nanoid } from 'nanoid';
import { TokenModel } from '../../DB/models/Token.Model.js';
import * as DB_Service from "../../DB/DB.service.js"



export const signatureLevelEnum = { System: "System", Bearer: "Bearer" }
export const tokenTypeEnum = { access: "access", refresh: "refresh" }
export const logoutEnum = { fromAll: "fromAll", logout: "logout", stayLoggedIn: "stayLoggedIn" }


export const generateToken = async (
    {
        payload = {},
        key = process.env.ACCESS_USER_TOKEN_SIGNATURE,
        options = { expiresIn: 60 * 60 }
    } = {}) => {
    return jwt.sign(payload, key, options);
}

export const verifyToken = async (
    {
        token = {},
        key = process.env.ACCESS_USER_TOKEN_SIGNATURE,
        options = {}
    } = {}) => {
    return jwt.verify(token, key, options);
}

export const getSignatures = async ({ signatureLevel = signatureLevelEnum.Bearer } = {}) => {

    let signatures = { accsesSignature: undefined, refreshSignature: undefined }

    switch (signatureLevel) {
        case signatureLevelEnum.System:
            signatures.accsesSignature = process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE;
            signatures.refreshSignature = process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE;
            break;
        default:
            signatures.accsesSignature = process.env.ACCESS_USER_TOKEN_SIGNATURE;
            signatures.refreshSignature = process.env.REFRESH_USER_TOKEN_SIGNATURE;
            break;
    }

    return signatures;

}

export const decodedToken = async ({ next, authorization = "", tokenType = tokenTypeEnum.access }) => {


    const [bearer, token] = authorization?.split(" ") || [];

    if (!bearer || !token) {
        return next(new Error("Missing Token Parts", { cause: 401 }))
    }

    const signatures = await getSignatures({ signatureLevel: bearer });

    const decoded = await verifyToken({
        token,
        key: tokenType === tokenTypeEnum.access ? signatures.accsesSignature : signatures.refreshSignature
    });


    if (decoded.jti && await DBService.findOne({ model: TokenModel, fillter: { jti: decoded.jti } })) {
        return next(new Error("In-Valid Login Credentials", { cause: 401 }));
    }

    if (!decoded?.id) {
        return next(new Error("In-Valid token", { cause: 400 }));
    }
    const user = await DBService.findById({ model: UserModel, id: decoded.id });

    if (!user) {
        return next(new Error("Not Registerd Account", { cause: 404 }));
    }


    if (user.changeCredentialsTime && user.changeCredentialsTime.getTime() > decoded.iat * 1000) {
        return next(new Error("In-Valid Login Credentials", { cause: 401 }));
    }

    return { user, decoded }

}

export const generateLoginCredentials = async ({ user } = {}) => {
    const signatures = await getSignatures({ signatureLevel: user.role !== roleEnum.user ? signatureLevelEnum.System : signatureLevelEnum.Bearer })

    const jwtid = nanoid();


    const access_token = await generateToken({
        payload: { id: user.id },
        options: {
            jwtid,
            expiresIn: 60 * 60
        },

        key: signatures.accsesSignature
    });
    const refresh_token = await generateToken({
        payload: { id: user.id },
        options: {
            jwtid, expiresIn: "1y"
        },
        key: signatures.refreshSignature
    });

    return { access_token, refresh_token }
}

export const createRevokeToken = async ({ req } = {}) => {

    return await DB_Service.create({
        model: TokenModel,
        data: {
            jti: req.decoded.jti,
            expiresIn: req.decoded.iat + Number(31536000),
            userId: req.user._id
        }
    })

}