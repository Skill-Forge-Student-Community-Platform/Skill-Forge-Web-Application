import mongoose from "mongoose";

// Create the Schema
const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        receiverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        text:{
            type:String,
        },
        image:{
            type:String,  
        },    
    },
    {timestamps:true}
);

// Create the model
const Message = mongoose.model("Message", messageSchema);

export default Message;