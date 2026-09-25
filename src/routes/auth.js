let express= require("express")
let authRouter=express.Router()
let bcrypt=require("bcrypt")
let jwt=require("jsonwebtoken")
let User=require("../model/User")
let userAuth=require("../middlewares/adminauth")
authRouter.post("/login",async(req,res)=>{
  try{
  const {emailId,passWord}=req.body;
 let user=await User.findOne({emailId:emailId})
  if(!user){
   return  res.status(401).send("invalid credentials")
  }
  let isvalidpassword=user.validatePassWord(passWord)
  if(!isvalidpassword){
   return  res.status(401).send("invalid credentials")
  }
  else{
    let token=user.getJwt() 
    
    res.cookie("token",token,{expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
    res.send("login sucess")

  }

   

  }
  catch(err){
    res.send(err.message)
  }

 
})

authRouter.post("/signUp",async(req,res)=>{
 const {firstName,lastName,emailId,passWord,gender}=req.body;
 let passWordHash= await bcrypt.hash(passWord, 10);
  let userInstance=new User({
         firstName,
         lastName,
         emailId,
         passWord:passWordHash,
         gender
})  
   try{
    await userInstance.save();
    res.send("sucessfully signUp");
    }
    catch(err){
      res.send(err.message)
    }

})

authRouter.post("/logOut",async(req,res)=>{
try{

  res.clearCookie("token",{expires: new Date(Date.now() )})
 res.send("successfully logOut!!!!!!!!!")

}
catch(err){
  res.send(err.message)
}

})


module.exports=authRouter
