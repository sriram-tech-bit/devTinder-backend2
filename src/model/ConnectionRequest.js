let mongoose=require("mongoose")

let ConnectionRequestSchema=mongoose.Schema({
fromUserId:{
type:mongoose.Schema.Types.ObjectId

},
toUserId:{
    type:mongoose.Schema.Types.ObjectId
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