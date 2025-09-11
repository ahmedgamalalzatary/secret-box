import mongoose, { Types } from "mongoose";



const tokenSchema = new mongoose.Schema({
    jti: { type: String, required: true, unique: true },
    expiresIn: { type: Number, required: true },
    userId: { type: Types.ObjectId, required: true, ref:"User"},

}, {
    timestamps: true,

});


export const TokenModel = mongoose.model.Token || mongoose.model("Token", tokenSchema);

TokenModel.syncIndexes()