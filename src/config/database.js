const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let mongoose=require("mongoose");

let connectDb= async()=>{
 await mongoose.connect("mongodb+srv://sriramulusriram33_db_user:siri143@namstenode.6esc6rh.mongodb.net/devTinder2")
 


}

module.exports={connectDb}




