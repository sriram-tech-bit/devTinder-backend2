let express=require("express")
let profileRouter=express.Router();
let userAuth=require("../middlewares/adminauth")
let updateProfileValidation=require("../utils/profilevalidations")
let User=require("../model/User")
let bcrypt=require("bcrypt")
let validator=require("validator")
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
  try{
 let user= req.user
  res.send(user)
}
  catch(err){
    res.send(err.message)

  }
})
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
 try{
  if(!updateProfileValidation(req)){
     throw new Error("some fields you can not update")
  }
  let loggedInUser=req.user; 
  
  Object.keys(req.body).forEach((k)=>{
    loggedInUser[k]=req.body[k]
  })
  
   await loggedInUser.save();
   res.send("your profile updated sucessfully")
 }
  catch(err){
    res.send(err.message)

  }
   
})
profileRouter.patch("/profile/forgotPassWord",async(req,res)=>{
let {emailId,passWord}=req.body
let user=  await User.findOne({emailId:emailId})
if(!user){
    return res.status(400).send("user not found")
}
let isvalidpassword=validator.isStrongPassword(passWord);
if(!isvalidpassword){
    return res.send("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol")
}
let passWordHash= await bcrypt.hash(passWord, 10);

user.passWord=passWordHash
  await user.save()
  res.status(200).send("passWord update Successfully")
 
})



module.exports=profileRouter