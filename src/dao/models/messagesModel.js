import mongoose from "mongoose";

const messageCollection = "mesaage"; 
const messageEsquema = new mongoose.Schema( 
    { 
        user: String,
        message: String,
    },
    { 
        timestamps: true, 
        
    }
);

const messageModel = mongoose.model(
    messageCollection,
    messageEsquema
);
export default messageModel;


