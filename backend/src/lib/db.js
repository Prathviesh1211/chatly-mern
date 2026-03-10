import mongoose from "mongoose"

export const connectDb=async()=>{
    const {MONGODB_URI}=process.env;
    if(!MONGODB_URI)throw new Error("MONGO_URI is not set");
    try{
        const conn=await mongoose.connect(MONGODB_URI)
        console.log('MONGODB Connected',conn.connection.host);
    }catch(error){
        console.error("Error connecting to MONGODB : ",error);
        process.exit(1);
        // 1->fail and 0->success
    }
}