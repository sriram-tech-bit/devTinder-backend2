let mongoose=require("mongoose")
let userSchema=mongoose.Schema({
firstName:{
    type:String
},
lastName:{
    type:String
},
emailId:{
    type:String
},
age:{
    type:Number
},









})

module.exports=mongoose.model("User",userSchema);
