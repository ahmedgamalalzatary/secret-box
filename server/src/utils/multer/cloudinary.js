import { v2 as cloudinary } from "cloudinary"

export const cloud = () => {

    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
        secure: true
    })

    return cloudinary

}


export const uploadSinglefile = async ({ file = {}, path = "general" } = {}) => {

    return await cloud().uploader.upload(file.path, {
        folder: `${process.env.APP_Name}/${path}`
    })

}

export const uploadMultifiles = async ({ files = [{}], path = "general" } = {}) => {

    const attachments = [];

    for (const file of files) {

        const { secure_url, public_id } = await uploadSinglefile({ file, path });

        attachments.push({ secure_url, public_id });

    }

    return attachments;
}


export const destroyinglefile = async ({ public_id = "" } = {}) => {
    return await cloud().uploader.destroy(public_id)
}



export const deleteResources = async ({ public_ids = [],
    options = {
        type: "upload",
        resource_type: "image"
    }
} = {}) => {
    return await cloud().api.delete_resources(public_ids, options)
}


export const deleteResourcesByPrefix = async ({
    prefix = "",

} = {}) => {

    return await cloud().api.delete_resources_by_prefix(`${process.env.APP_Name}/${prefix}`)
}