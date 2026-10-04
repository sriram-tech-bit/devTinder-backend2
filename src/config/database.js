const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let mongoose=require("mongoose");

let connectDb= async()=>{
 await mongoose.connect(process.env.DB_CONNECTION)
 


}

module.exports={connectDb}




