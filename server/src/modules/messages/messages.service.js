import { asyncHandler, succsesResponse } from "../../utils/response.js";
import * as DB_Sevice from "../../DB/DB.service.js"
import { UserModel } from "../../DB/models/user.model.js";
import { uploadSinglefile } from "../../utils/multer/cloudinary.js";
import { MessageModel } from "../../DB/models/Message.Model.js";


export const sendMessage = asyncHandler(
    async (req, res, next) => {

        const { reciverId } = req.params

        if (!req.file && !req.body?.content) {
            return next(new Error("Message Content Is Required"))
        }

        if (reciverId == req.user?._id) {
            return next(new Error("Cannot Send Message To Yourself , شوفلك حياة"))
        }


        if (
            !await DB_Sevice.findOne({
                model: UserModel,
                fillter: {
                    _id: reciverId,
                    confirmEmail: { $exists: true },
                    deletedAt: { $exists: false }
                }
            })
        ) {
            return next(new Error("In-Valid Recipient Account", { cause: 404 }))
        }


        const { content } = req.body

        let image = {};

        if (req.file) {
            image = await uploadSinglefile({ file: req.file, path: `messages/${reciverId}` })
        }

        const message = await DB_Sevice.create({
            model: MessageModel,
            data: {
                content,
                image: { secure_url: image.secure_url, public_id: image.public_id },
                reciverId,
                senderId: req.user?._id
            }
        })

        return succsesResponse({ res, status: 201, message: "Message Sent Succses", data: message })
    }
)

export const inpox = asyncHandler(
    async (req, res, next) => {

        const user = await DB_Sevice.findById({
            model: UserModel,
            id: req.user._id,
            populate: [{ path: "messages" }],
        })

        return succsesResponse({ res, status: 200, data: user.messages })
    }
)

export const deleteMessage = asyncHandler(
    async (req, res, next) => {

        const { messageId } = req.params;
        const autherId = req.user._id;

        const message = await DB_Sevice.findById({
            model: MessageModel,
            id: messageId,
            select: "reciverId"
        })


        if (!message) return next(new Error("Message Not Found", { cause: 404 }))

        if (message.reciverId?.toString() !== autherId.toString()) return next(new Error("You're not Allow To Delete This Message", { cause: 403 }))

        await DB_Sevice.deleteOne({
            model: MessageModel,
            fillter: {
                _id: messageId,
            }
        })

        return succsesResponse({ res, status: 200, message: "Message Deleted Successfully" })
    }
)

export const replyMessage = asyncHandler(
    async (req, res, next) => {

        const { messageId } = req.params;
        const autherId = req.user._id;

        if (!req.file && !req.body?.content) {
            return next(new Error("Message Content Is Required"))
        }

        const message = await DB_Sevice.findById({
            model: MessageModel,
            id: messageId,
        })


        if (!message?.senderId) return next(new Error("Cannot Reply This Message , Message Sender Id Is Not Exsists!", { cause: 404 }))

        if (message.reciverId?.toString() !== autherId.toString()) return next(new Error("Message Not Found", { cause: 404 })) // ماهو مش أي حد معدي يرد على الرسالة

        const { content } = req.body

        let image = {};

        if (req.file) {
            image = await uploadSinglefile({ file: req.file, path: `messages/${message.senderId}` })
        }

        const reply = await DB_Sevice.create({
            model: MessageModel,
            data: {
                content,
                image: { secure_url: image.secure_url, public_id: image.public_id },
                reciverId: message.senderId,
                senderId: req.user?._id
            }
        })

        return succsesResponse({ res, status: 201, message: "Reply Sent Succses", data: reply })

    }
)

export const getSentMessages = asyncHandler(
    async (req, res, next) => {

        const user = await DB_Sevice.findById({
            model: UserModel,
            id: req.user._id,
            populate: [{ path: "messagesSent" }],
        })

        return succsesResponse({ res, status: 200, data: user.messagesSent })
    }
)