let mongoose=require("mongoose");
const User = require("./User");

let ConnectionRequestSchema=mongoose.Schema({
fromUserId:{
type:mongoose.Schema.Types.ObjectId,
ref:User
},
toUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:User
},
status:{
    type:String,
    enum:{
     values:["intrested","ignored","accepted","rejected"],
     message:"{VALUE} is not valid status"
    }
}

})

module.exports=mongoose.model("ConnectionRequestModel",ConnectionRequestSchema);