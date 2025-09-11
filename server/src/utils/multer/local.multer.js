import multer from "multer";
import path from "node:path"
import fs from "node:fs";



export const attachmentsTypes = {

    images: {
        types: ["image/jpeg", "image/png", "image/tiff"],
        error: "Only Accepts [jpeg - jpg - jpe - png - tiff]",
        maxSize: 10 * 1024 * 1024
    },

    videos: {
        types: ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv"],
        error: "Only Accepts [mp4 - mpeg - mov - avi - wmv]",
        maxSize: 100 * 1024 * 1024 
    },

    pdf: {
        types: ["application/pdf"],
        error: "Only Accepts [pdf]",
        maxSize: 10 * 1024 * 1024
    }
};


export const localFileUpload = ({ customPath = "general", attachments = [] } = {}) => {

    let basePath = `uploads/${customPath}`;


    const storage = multer.diskStorage({
        destination: function (req, file, callback) {

            if (req.user?._id) {
                basePath += `/${req.user._id}`
            }
            const fullPath = path.resolve(`./src/${basePath}`)

            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true })
            }

            callback(null, path.resolve(fullPath))
        },

        filename: function (req, file, callback) {

            const uniqeFileName = Date.now() + "__" + Math.random() + "__" + file.originalname;
            file.finallPath = basePath + "/" + uniqeFileName;
            callback(null, uniqeFileName)
        },
    })

    const fileFilter = function (req, file, callback) {

        if (attachments.types.includes(file.mimetype)) {
            return callback(null, true)
        }

        callback(new Error(attachments.error), false)
    }

    return multer({
        fileFilter,
        limits: { fileSize: attachments.maxSize },
        storage
    })
}