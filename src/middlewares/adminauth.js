let jwt=require("jsonwebtoken");
const User = require("../model/User");

let userAuth=async(req,res,next)=>{
try{
     let cookieObj=req.cookies;
const{token}=cookieObj
if(!token){
   return res.status(401).send("please login")
}
let decode=jwt.verify(token, process.env.SECRET_KEY)
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
