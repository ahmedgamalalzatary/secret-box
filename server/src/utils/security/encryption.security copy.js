import CryptoJS from "crypto-js"

export const encrypt = async ({ plainTxt = "", key = process.env.ENCRYPTKEY }) => {
    return CryptoJS.AES.encrypt(plainTxt, key).toString();
}

export const decrypt = async ({ cipherTxt = "", key = process.env.ENCRYPTKEY }) => {
    return CryptoJS.AES.decrypt(cipherTxt, key).toString(CryptoJS.enc.Utf8);
}