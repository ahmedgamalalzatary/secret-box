import { asyncHandler } from "../utils/response.js"
import { decodedToken, tokenTypeEnum } from "../utils/security/token.security.js";

export const authentication = ({ tokenType = tokenTypeEnum.access } = {}) => {

    return asyncHandler(async (req, res, next) => {

        const { authorization } = req.headers;
        const { user, decoded } = await decodedToken({ next, authorization, tokenType }) || {};
        req.user = user ;
        req.decoded = decoded ;
        return next();

    })

} 