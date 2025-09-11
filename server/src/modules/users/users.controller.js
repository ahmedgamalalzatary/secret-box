import { Router } from "express";
import {
    deleteAccount,
    freezAccount,
    profile,
    restoreAccount,
    searchForUser,
    shareProfile,
    updateBasicInfo,
    uploadProfilecover,
    uploadProfileImage,
} from "./users.service.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import * as usersValidation from "./users.validation.js"
import { attachmentsTypes } from "../../utils/multer/local.multer.js";
import { cloudFileUpload } from "../../utils/multer/cloud.multer.js";

const usersRouter = Router({
    caseSensitive: true,
});


usersRouter.get("/profile",
    authentication(),
    profile);

usersRouter.get("/search",
    validationMiddleware(usersValidation.searchForUser),
    searchForUser);

usersRouter.get("/{:userId}",
    authentication(),
    validationMiddleware(usersValidation.shareProfile),
    shareProfile);


usersRouter.patch("/update-basic-info",
    authentication(),
    validationMiddleware(usersValidation.updateBasicInfo),
    updateBasicInfo);


usersRouter.delete("/{:userId/}freeze-account",
    authentication(),
    validationMiddleware(usersValidation.freezAccount),
    freezAccount);


usersRouter.patch("/{:userId/}restore-account",
    authentication(),
    validationMiddleware(usersValidation.restoreAccount),
    restoreAccount);

usersRouter.delete("/{:userId/}delete-account",
    authentication(),
    validationMiddleware(usersValidation.restoreAccount),
    deleteAccount);

usersRouter.post("/upload-profile-image",
    authentication(),
    cloudFileUpload({ attachments: attachmentsTypes.images }).single("image"),
    validationMiddleware(usersValidation.uploadImage),
    uploadProfileImage);


usersRouter.post("/upload-profile-cover",
    authentication(),
    cloudFileUpload({ attachments: attachmentsTypes.images }).array("images", 2),
    validationMiddleware(usersValidation.uploadProfileCover),
    uploadProfilecover);




export default usersRouter;