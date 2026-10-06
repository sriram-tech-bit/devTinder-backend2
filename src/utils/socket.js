
let socket = require("socket.io");
let initialSocket=(server)=>{
let io=socket(server,{
  cors:{
    origin:"http://localhost:5173",
  }
  

  })

 io.on("connection",(socket)=>{
     socket.on("joinChat",({touserId,userId})=>{
     let roomID=[touserId,userId].sort().join("_");
     socket.join(roomID)
     })

  socket.on("sendMessages",({firstName,
     userId,
     touserId,
     text})=>{
   
    let roomID = [touserId, userId].sort().join("_");
    io.to(roomID).emit("messageReceived", { firstName, text });
  })   

})

}



module.exports={initialSocket}