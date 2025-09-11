import { asyncHandler, succsesResponse } from "../../utils/response.js";
import { decrypt, encrypt } from "../../utils/security/encryption.security copy.js";
import * as DBSevice from "../../DB/DB.service.js"
import { roleEnum, UserModel } from "../../DB/models/user.model.js";
import { deleteResources, deleteResourcesByPrefix, destroyinglefile, uploadMultifiles, uploadSinglefile } from "../../utils/multer/cloudinary.js";





export const profile = asyncHandler(
    async (req, res, next) => {

        const { firstName, lastName, email, phone, genderm, role, _id, userName } = req.user;
        const  user = { firstName, lastName, email, phone, genderm, role, _id, userName };
        user.phone = await decrypt({ cipherTxt: req.user.phone });
        res.json({ user });

    }
);

export const shareProfile = asyncHandler(
    async (req, res, next) => {

        const { userId } = req.params

        const user = await DBSevice.findOne({
            model: UserModel,
            fillter: { _id: userId },
            select: "_id firstName lastName email phone gender picture cover"
        })

        if (!user) {
            return next(new Error("User Not Exsist"))
        }

        user.phone = await decrypt({ cipherTxt: req.user.phone });
        user.userName = user.firstName + " " + user.lastName

        res.json({ user });

    }
);

export const updateBasicInfo = asyncHandler(
    async (req, res, next) => {

        if (req.body.phone) {
            req.body.phone = await encrypt({ plainTxt: req.body.phone })
        }

        const user = await DBSevice.findOneAndUpdate({
            model: UserModel,
            fillter: {
                _id: req.user.id,
            },
            data: req.body
        })

        if (!user) {
            return next(new Error("User Not Exsist"))
        }

        const newUser = await DBSevice.findOne({
            model: UserModel,
            fillter: { _id: req.user.id },
            select: "_id email phone gender firstName lastName"
        })

        newUser.phone = await decrypt({ cipherTxt: newUser.phone });
        newUser.userName = newUser.firstName + " " + newUser.lastName

        res.json({ newUser });




    }
);

export const freezAccount = asyncHandler(
    async (req, res, next) => {


        const { userId } = req.params;

        if (userId && req.user.role !== roleEnum.admin) {
            return next(new Error("You Are Not Allow To Delete This Account", { cause: 403 }))
        }

        const user = await DBSevice.findOneAndUpdate({
            model: UserModel,
            fillter: {
                _id: userId || req.user.id,
                deletedAt: { $exists: false }
            },
            data: {
                $set: {
                    deletedAt: Date.now(),
                    deletedBy: req.user.id
                },
                $unset: {
                    restoredAt: 1,
                    restoredBy: 1
                }
            }
        })

        return user ? succsesResponse({ res, message: "Account Freezed Succses" }) : next(new Error("Account Not Exsist"))
    }
);

export const restoreAccount = asyncHandler(
    async (req, res, next) => {

        const { userId } = req.params;

        const user = await DBSevice.findOneAndUpdate({
            model: UserModel,
            fillter: {
                _id: userId,
                deletedAt: { $exists: true },
                deletedBy: { $ne: userId }
            },
            data: {
                $unset: {
                    deletedAt: 1,
                    deletedBy: 1
                },
                $set: {
                    restoredAt: Date.now(),
                    restoredBy: req.user._id
                }
            }
        })

        return user ? succsesResponse({ res, message: "Account Restored Succses" }) : next(new Error("Account Not Exsist"))
    }
);

export const deleteAccount = asyncHandler(
    async (req, res, next) => {

        const { userId } = req.params;

        const user = await DBSevice.deleteOne({
            model: UserModel,
            fillter: {
                _id: userId,
                deletedAt: { $exists: true }
            }
        })
        if (user.deletedCount) {
            await deleteResourcesByPrefix({ prefix: `users/${userId}` })
        }

        return user.deletedCount ? succsesResponse({ res, message: "Account Deleted Succses", data: user }) : next(new Error("Account Not Exsist"))
    }
);

export const uploadProfileImage = asyncHandler(
    async (req, res, next) => {

        const { secure_url, public_id } = await uploadSinglefile({ file: req.file, path: `users/${req.user._id}` })
        const user = await DBSevice.findOneAndUpdate({
            model: UserModel,
            fillter: { _id: req.user._id },
            data: {
                picture: { secure_url, public_id }
            },
            options: { new: false }
        })

        if (user?.picture?.public_id) {
            await destroyinglefile({ public_id: user.picture.public_id })
        }

        return succsesResponse({ res, message: "Image Uploaded Succses", data: { image: { secure_url, public_id } } })
    }
);

export const uploadProfilecover = asyncHandler(
    async (req, res, next) => {

        const attachments = await uploadMultifiles({ files: req.files, path: `users/${req.user._id}/cover` })

        const user = await DBSevice.findOneAndUpdate({
            model: UserModel,
            fillter: { _id: req.user._id },
            data: {
                cover: attachments
            },
            options: { new: false }
        })

        if (user?.cover?.length) {
            await deleteResources({ public_ids: user.cover.map(ele => ele.public_id) })


        }


        return succsesResponse({ res, message: "Cover Uploaded Succses", data: { cover: attachments } })
    }
);

export const searchForUser = asyncHandler(async (req, res, next) => {
    const { query, page = 1, limit = 20 } = req.query;

    if (!query) {
        return next(new Error("Search query is required", { cause: 400 }));
    }

    const regex = new RegExp(query, "i");

    const users = await UserModel.find({
        $or: [
            { firstName: regex },
            { lastName: regex },
            { email: regex }
        ]
    })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)).select("email phone firstName lastName");

    const total = await UserModel.countDocuments({
        $or: [
            { firstName: regex },
            { lastName: regex },
            { email: regex }
        ]
    });

    users.map(async (user) => {
        user.userName = `${user.firstName} ${user.lastName}` // undefined undefined  بييجي على شكل  userName الـ  select لما بعمل 
    })


    return succsesResponse({
        res,
        status: 200,
        message: "Users fetched successfully",
        data: {
            users,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        }
    });
});