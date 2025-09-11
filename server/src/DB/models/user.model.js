import mongoose, { Types } from "mongoose";


export const genderEnum = { male: "male", female: "female" };
export const roleEnum = { user: "user", admin: "admin" };
export const providerEnum = { system: "system", google: "google" };


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [2, "First Name Min Length Is 2 Chars"],
        maxLenght: [20, "First Name Max Length Is 20 Chars"],
    },
    lastName: {
        type: String,
        required: true,
        minLength: [2, "Last Name Min Length Is 2 Chars"],
        maxLenght: [20, "Last Name Max Length Is 20 Chars"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === providerEnum.system ? true : false;
        },
    },
    oldPasswords: [String],
    phone: {
        type: String,
        required: function () {
            return this.provider === providerEnum.system ? true : false;
        },
    },
    gender: {
        type: String,
        enum: { values: Object.values(genderEnum), message: `Gender Only Allow ${Object.values(genderEnum)}` },
        default: genderEnum.male
    },
    role: {
        type: String,
        enum: { values: Object.values(roleEnum), message: `Role Only Allow ${Object.values(roleEnum)}` },
        default: roleEnum.user
    },
    picture: {
        secure_url: String
        , public_id: String
    },
    cover: [Object],
    confirmEmail: Date,
    confirmEmailOTP: {
        type: String,
        required: function () {
            return this.provider === providerEnum.system ? true : false;
        },
    },
    confirmEmailOTPExpiresTime: Date,
    confirmEmailOTPCount: Number,
    confirmEmailOTPBlock: Date,
    provider: {
        type: String,
        enum: { values: Object.values(providerEnum) },
        default: providerEnum.system
    },
    deletedAt: Date,
    deletedBy: { type: Types.ObjectId, ref: "User" },
    restoredAt: Date,
    restoredBy: { type: Types.ObjectId, ref: "User" },
    forgotPasswordOTP: String,
    changeCredentialsTime: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

userSchema.virtual("userName").set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
}).get(function () {
    return this.firstName + " " + this.lastName;
})

userSchema.virtual("messages",{
    localField:"_id",
    foreignField:"reciverId",
    ref:"Message"
})


userSchema.virtual("messagesSent",{
    localField:"_id",
    foreignField:"senderId",
    ref:"Message"
})


export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

UserModel.syncIndexes();