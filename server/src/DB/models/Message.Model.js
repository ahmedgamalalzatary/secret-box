import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    content: {
        type: String,
        minLength: 5,
        maxLength: 20000,
        required: function () {
            return this.image ? false : true
        }
    },
    image: { secure_url: String, public_id: String },
    reciverId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
}, {
    timestamps: true
})

export const MessageModel = mongoose.models.Message || mongoose.model("Message", messageSchema)