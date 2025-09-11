import multer from "multer";


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


export const cloudFileUpload = ({ attachments = [] } = {}) => {

   const storage = multer.diskStorage({})

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