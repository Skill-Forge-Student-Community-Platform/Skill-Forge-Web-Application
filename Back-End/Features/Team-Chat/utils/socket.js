import {Server} from "socket.io"
import http from "http"
import express from "express"

const app =express();
// Creating server
const server =http.createServer(app);

// create socket.io server
const io = new Server(server, {
    cors:{
        origin:["http://localhost:3000"]
    },
});

// this is used to store online users
const userSocketMap = {};  //{userId : socketId}  userid comes from database, socketId comes from this page

// Listen to incoming connections
io.on("connection", (socket)=>{
    console.log("A user connected ", socket.id);

    // gets userId
    const userId = socket.handshake.query.userId
    // if a user a became online, notifices every one
    if(userId) userSocketMap[userId] = socket.id

    // io.emit() is used to send events to all connected users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
    // if a user disconnectes 
    socket.on("disconnect",()=>{
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
    });

});


export { io, app, server };