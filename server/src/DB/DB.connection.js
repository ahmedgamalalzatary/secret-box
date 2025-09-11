import mongoose from "mongoose";
 const connectDB = async () => {
    try {
        const uri = process.env.DB_URI
        await mongoose.connect(uri,{
        })
        console.log("DataBase Connected Succses");
    } catch (error) {
        console.log("Faild To Connect DataBase");
        console.log(error)
    }
}
export default connectDB;