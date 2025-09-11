import { Router } from "express";
import {
    changePassword,
    confirmEmail,
    forgetPassword,
    login,
    logOut,
    refreshToken,
    reSendConfirmOTP,
    reSetPassword,
    signUp,
    signUpWithGmail,
    verifyforgetPassword
} from "./auth.service.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { tokenTypeEnum } from "../../utils/security/token.security.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import * as authValidation from "./auth.validation.js";

const authRouter = Router({
    caseSensitive: true,
    strict: true
});

authRouter.post("/signup", validationMiddleware(authValidation.signUp), signUp);

authRouter.post("/login", validationMiddleware(authValidation.login), login);

authRouter.post("/signup/gmail", signUpWithGmail);

authRouter.patch("/confirm/email", validationMiddleware(authValidation.confirmEmail), confirmEmail);

authRouter.post("/re-send-confirm/email", reSendConfirmOTP);

authRouter.post("/refresh-token", authentication({ tokenType: tokenTypeEnum.refresh }), refreshToken);


authRouter.patch("/change-password",
    authentication(),
    validationMiddleware(authValidation.changePassword),
    changePassword);


authRouter.post("/forget-password",
    validationMiddleware(authValidation.forgetPassword),
    forgetPassword);

authRouter.post("/verify-forget-password",
    validationMiddleware(authValidation.verifyForgetPassword),
    verifyforgetPassword);


authRouter.post("/reset-password",
    validationMiddleware(authValidation.reSetPassword),
    reSetPassword);


authRouter.post("/logout",
    authentication(),
    validationMiddleware(authValidation.logOut),
    logOut);

export default authRouter;