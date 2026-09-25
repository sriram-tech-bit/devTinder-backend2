let jwt=require("jsonwebtoken");
const User = require("../model/User");

let userAuth=async(req,res,next)=>{
try{
     let cookieObj=req.cookies;
const{token}=cookieObj
if(!token){
    throw new Error("invalid token")
}
let decode=jwt.verify(token,"devTinder2@1234")
let user=await User.findOne({_id:decode._id})
if(!user){
    throw new Error("user not found")
}
req.user=user;
next()

}
catch(err){
    res.send(err.message)
}





}
module.exports=userAuth
