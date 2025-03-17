
import { User } from "../../User-Authentication/models/User.js"
import Message from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";


// this route is being protected
export const getUsersForSidebar = async(req, res)=>{
     try {
      // grabs the user id from this request
        const loggedInUserId = req.user._id;

      //   find all the users except current user and -
      // -this fetches evering except tha password
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers)
     } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
     }
}

// Listens and gets the messages
export const getMessages = async(req, res)=>{
   try {
      const { id: userToChatId } = req.params
      const myId = req.user._id

      const message = await Message.find({
         $or:[
            {senderId:myId, receiverId:userToChatId},
            {senderId:userToChatId, receiverId:myId},
         ]
      })

      res.status(200).json(message);
   } catch (error) {
      console.log("Error in getMessage controller:",error.message);
      res.status(500).json({message:"Internal Server Error"});
   }
}

// Sends messages 
// able to send messages, images
export const sendMessages = async(req, res)=>{
   try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;

      let imageUrl;
      if(image){
         // images are send via cloudinary
         // upload base64 image to cloudinary
         const uploadResponse = await cloudinary.uploader.upload(image);
         imageUrl = uploadResponse.secure_url;
      }

      const newMessage = new Message({
         senderId,
         receiverId,
         text,
         image:imageUrl,
      });

      await newMessage.save();

      // todo: real time functionality goes here via socket.io

      res.status(201).json(newMessage)
   } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({message:"Internal Sever Error"});
   }

