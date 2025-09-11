import { providerEnum, UserModel } from "../../DB/models/user.model.js";
import { asyncHandler, succsesResponse } from "../../utils/response.js";
import * as DB_Service from "../../DB/DB.service.js"
import { compareHash, generateHash } from "../../utils/security/hash.security.js";
import { encrypt } from "../../utils/security/encryption.security copy.js";
import { createRevokeToken, generateLoginCredentials, logoutEnum } from "../../utils/security/token.security.js";
import { OAuth2Client } from 'google-auth-library';
import { customAlphabet } from "nanoid";
import { emailEvent } from "../../utils/email/email.event.js";
import { confirmEmailTemplate, forgetPasswordTemplate } from "../../utils/email/email.template.js";
import { TokenModel } from "../../DB/models/Token.Model.js";
import schedule from "node-schedule"

export const signUp = asyncHandler(
    async (req, res, next) => {
        const { userName, email, password, phone, gender } = req.body;
        if (await DB_Service.findOne({ model: UserModel, fillter: { email } })) {
            return res.status(409).json({ message: "User Exsist" });
        }
        const hashPassword = await generateHash({ plainTxt: password });
        const encPhone = await encrypt({ plainTxt: phone });
        const OTPCode = customAlphabet("0123456789", 6)();
        const hashedOTP = await generateHash({ plainTxt: OTPCode })
        const [user] = await DB_Service.create({
            model: UserModel,
            data: {
                userName,
                email,
                password: hashPassword,
                phone: encPhone,
                gender,
                confirmEmailOTP: hashedOTP,
                confirmEmailOTPExpiresTime: new Date(Date.now() + 2 * 60 * 1000),
                confirmEmailOTPCount: 1
            }
        });

        const html = await confirmEmailTemplate({ OTPCode });
        emailEvent.emit("sentConfirmEmail", { email, html });

        return succsesResponse({
            res, message: "SignUp Succses",
            info: "We Sent A Confirm OTP To Your Email , Please Confirm It To Login",
            data: { id: user._id }
        });
    }
)

// ===================================================

export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        const { email, OTP } = req.body;

        if (!email || !OTP) {
            return next(new Error("Email And OTP Are required", { cause: 404 }));
        }

        const user = await DB_Service.findOne({
            model: UserModel,
            fillter: {
                email,
                provider: providerEnum.system,
                confirmEmail: { $exists: false },
                confirmEmailOTP: { $exists: true },
            }
        });

        if (!user) {
            return next(new Error("Invalid Account", { cause: 404 }));
        }

        if (user.confirmEmailOTPExpiresTime < Date.now()) {
            return next(new Error("Your OTP Is Expired , Get New OTP", { cause: 400 }));
        }

        if (!await compareHash({ plainTxt: OTP, hashValue: user.confirmEmailOTP })) {
            return next(new Error("Invalid OTP Code", { cause: 409 }));
        }

        const data = await DB_Service.updateOne({
            model: UserModel,
            fillter: {
                email,
            },
            data: {
                $set: { confirmEmail: Date.now() },
                $unset: {
                    confirmEmailOTP: 1,
                    confirmEmailOTPExpiresTime: 1,
                    confirmEmailOTPCount: 1,
                    confirmEmailOTPBlock: 1,
                }
            }
        })

        return succsesResponse({
            res,
            info: "Email Confirmed Succses",
        });

    }
);

// ===================================================


export const reSendConfirmOTP = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body;

        if (!email) {
            return next(new Error("Email Is required", { cause: 404 }));
        }

        const user = await DB_Service.findOne({
            model: UserModel,
            fillter: {
                email,
                provider: providerEnum.system,
                confirmEmail: { $exists: false },
                confirmEmailOTP: { $exists: true },
            }
        });

        if (!user) {
            return next(new Error("Invalid Account", { cause: 404 }));
        }

        if (user.confirmEmailOTPBlock && user.confirmEmailOTPBlock > Date.now()) {
            return next(new Error("Plase Wait Untell 2 Minutes End", { cause: 409 }));
        }

        if (user.confirmEmailOTPBlock && user.confirmEmailOTPBlock < Date.now()) {
            await DB_Service.updateOne({
                model: UserModel,
                fillter: { email },
                data: {
                    $set: {
                        confirmEmailOTPCount: 0
                    },
                    $unset: {
                        confirmEmailOTPBlock: 1,
                    }
                }
            });

            user.confirmEmailOTPCount = 0;
            delete user.confirmEmailOTPBlock;
        }

        if (user.confirmEmailOTPCount >= 5) {
            await DB_Service.updateOne({
                model: UserModel,
                fillter: { email },
                data: {
                    confirmEmailOTPBlock: new Date(Date.now() + 5 * 60 * 1000),
                }
            });
            return next(new Error("Please Wait For 5 Minutes And Try Again", { cause: 409 }));
        }

        if (!user.confirmEmailOTPBlock || user.confirmEmailOTPBlock < Date.now()) {

            const OTPCode = customAlphabet("0123456789", 6)();
            const hashedOTP = await generateHash({ plainTxt: OTPCode })

            await DB_Service.updateOne({
                model: UserModel,
                fillter: { email },
                data: {
                    confirmEmailOTP: hashedOTP,
                    confirmEmailOTPExpiresTime: new Date(Date.now() + 2 * 60 * 1000),
                    confirmEmailOTPCount: user.confirmEmailOTPCount + 1
                }
            });

            const html = await confirmEmailTemplate({ OTPCode });
            emailEvent.emit("sentConfirmEmail", { email, html });

            return succsesResponse({
                res,
                info: "OTP Sent Succses",
            });

        }

    }
);

// ===================================================

async function verifyGoogleAccount({ idToken } = {}) {

    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.WEB_CLIENT_IDS.split(","),
    });
    const payload = ticket.getPayload();

    return payload


}

export const signUpWithGmail = asyncHandler(
    async (req, res, next) => {

        const { idToken } = req.body;
        const {
            email,
            email_verified,
            name,
            picture } = await verifyGoogleAccount({ idToken });

        if (!email_verified) {
            return next(new Error("Not Verified Account", { cause: 400 }))
        }

        const user = await DB_Service.findOne({ model: UserModel, fillter: { email } });

        if (user) {

            if (user.provider === providerEnum.google) {
                const data = await generateLoginCredentials({ user });
                return succsesResponse({ res, info: "Login Succses", data });
            }

            return next(new Error("Invalid Provider", { cause: 409 }))
        }

        const [newUser] = await DB_Service.create({
            model: UserModel, data: {
                email,
                userName: name,
                picture,
                confirmEmail: Date.now(),
                provider: providerEnum.google
            }
        })

        const data = await generateLoginCredentials({ user: newUser });
        return succsesResponse({ res, status: 201, info: "SignUp Succses", data });

    }
)

// ===================================================

export const login = asyncHandler(
    async (req, res, next) => {


        const { email, password } = req.body;

        const user = await DB_Service.findOne({ model: UserModel, fillter: { email, provider: providerEnum.system } });

        if (!user) {
            return next(new Error("Invalid Login Data", { cause: 404 }));
        }

        if (!user.confirmEmail) {
            return next(new Error("Please Confirm Your Email First", { cause: 400 }));
        }

        if (user.deletedAt) {
            return next(new Error("Your Account Is Freezed", { cause: 400 }));
        }

        if (!await compareHash({ plainTxt: password, hashValue: user.password })) {
            return next(new Error("Invalid email or password", { cause: 409 }));
        }

        const { access_token, refresh_token } = await generateLoginCredentials({ user });

        return succsesResponse({
            res,
            info: "Login Succses",
            data: {
                _id: user._id,
                credentials: {
                    access_token,
                    refresh_token,
                }

            }
        });



    }
);

// ===================================================

export const refreshToken = asyncHandler(async (req, res, next) => {
    const user = req.user;
    await createRevokeToken({ req })
    const { access_token, refresh_token } = await generateLoginCredentials({ user });
    return succsesResponse({ res, data: { access_token, refresh_token } });
});


// ===================================================


export const changePassword = asyncHandler(
    async (req, res, next) => {


        const { password } = req.user;
        const { oldPassword, newPassword, flag } = req.body || {};


        if (!await compareHash({ hashValue: password, plainTxt: oldPassword })) {
            return next(new Error("In-Valid Old Password"))
        }

        if (req.user.oldPasswords.length) {

            for (const hashPassword of req.user.oldPasswords) {

                if (await compareHash({ hashValue: hashPassword, plainTxt: newPassword })) {
                    return next(new Error("You Already Used This Password Before"))
                }

            }

        }


        let updatedData = {};

        switch (flag) {
            case logoutEnum.fromAll:
                updatedData.changeCredentialsTime = new Date()
                break;
            case logoutEnum.logout:

                await createRevokeToken({ req })

                break;

            default:
                break;
        }

        const newHashedPassword = await generateHash({ plainTxt: newPassword })

        const user = await DB_Service.findOneAndUpdate({
            model: UserModel,
            fillter: {
                _id: req.user._id,
                confirmEmail: { $exists: true }
            },
            data: {
                password: newHashedPassword,
                ...updatedData,
                $push: { oldPasswords: req.user.password }
            }
        })

        return user ? succsesResponse({ res, message: "Password Changed Succses" }) : next(new Error("Something Went Worng"))
    }
);

// ===================================================


export const forgetPassword = asyncHandler(
    async (req, res, next) => {

        const { email } = req.body;
        const OTP = customAlphabet("0123456789", 6)()

        const user = await DB_Service.findOneAndUpdate({
            model: UserModel,
            fillter: {
                email,
                confirmEmail: { $exists: true },
                deletedAt: { $exists: false },
                provider: providerEnum.system
            },
            data: {
                forgotPasswordOTP: await generateHash({ plainTxt: OTP })
            }
        })

        if (!user) {
            return next(new Error("In-Valid Account"));
        }

        const html = await forgetPasswordTemplate({ OTPCode: OTP })

        emailEvent.emit("sendForgotPasswordOTP", { email, subject: "Reset Password Code", html })

        return succsesResponse({ res, message: "OTP Sent To Your Email", data: { email } })
    }
);


// ===================================================


export const verifyforgetPassword = asyncHandler(
    async (req, res, next) => {

        const { email, OTP } = req.body;

        const user = await DB_Service.findOne({
            model: UserModel,
            fillter: {
                email,
                confirmEmail: { $exists: true },
                deletedAt: { $exists: false },
                provider: providerEnum.system,
                forgotPasswordOTP: { $exists: true },
            }
        })

        if (!user) {
            return next(new Error("In-Valid Account"));
        }

        if (!await compareHash({ hashValue: user.forgotPasswordOTP, plainTxt: OTP })) {
            return next(new Error("Wrong OTP Number"));
        }


        return succsesResponse({ res, message: "Verifyed Succses" })
    }
);



export const reSetPassword = asyncHandler(
    async (req, res, next) => {

        const { email, OTP, newPassword } = req.body;

        const user = await DB_Service.findOne({
            model: UserModel,
            fillter: {
                email,
                confirmEmail: { $exists: true },
                deletedAt: { $exists: false },
                provider: providerEnum.system,
                forgotPasswordOTP: { $exists: true },
            }
        })

        if (!user) {
            return next(new Error("In-Valid Account"));
        }

        if (!await compareHash({ hashValue: user.forgotPasswordOTP, plainTxt: OTP })) {
            return next(new Error("Wrong OTP Number"));
        }

        await DB_Service.updateOne({
            model: UserModel,
            fillter: {
                _id: user._id,
                email
            },
            data: {
                $unset: {
                    forgotPasswordOTP: 1,
                },
                changeCredentialsTime: new Date(),
                password: await generateHash({ plainTxt: newPassword })
            }
        })


        return succsesResponse({ res, message: "Password Reset Succses" })
    }
);



export const logOut = asyncHandler(
    async (req, res, next) => {


        const { flag } = req.body || {};

        let status = 200;
        let message = "Logout Succses";

        switch (flag) {
            case logoutEnum.fromAll:

                await DB_Service.updateOne({
                    model: UserModel,
                    fillter: { _id: req.user._id },
                    data: {
                        changeCredentialsTime: new Date()
                    }
                })

                message = "Logout From All Devices Succses"
                break;

            default:

                await createRevokeToken({ req })

                status = 201;
                break;
        }

        return succsesResponse({ res, message, status })
    }
);



function scheduleDailyTask(time, callback) {
    const [hour, minute] = time.split(":").map(Number);
    const cronExpression = `0 ${minute} ${hour} * * *`;

    schedule.scheduleJob(cronExpression, callback);
}


scheduleDailyTask("01:00", async () => {

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const tokensDeleted = await TokenModel.deleteMany({ expiresIn: { $lt: nowInSeconds } })

    console.log("=================================");

    if (tokensDeleted.deletedCount) {
        console.log(
            `Schedule Daily Task: Deleted ${tokensDeleted.deletedCount} expired token(s).`
        );
    } else {
        console.log(
            `Schedule Daily Task: No expired tokens found.`
        );
    }

    console.log("=================================");

});
