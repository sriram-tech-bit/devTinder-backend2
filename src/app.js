let express=require("express");
let app=express();
let validator=require("validator")
let bcrypt=require("bcrypt")
const {connectDb}=require("./config/database")
app.use(express.json());
let User=require("./model/User")

app.get("/user",async(req,res)=>{
  let email=req.body.emailId
  
  let user=await User.findOne({emailId:email})    
  res.send(user);
})

app.get("/feed",async(req,res)=>{
  let user=await User.find({})     
  res.send(user);
})

app.post("/login",async(req,res)=>{
  try{
  const {emailId,passWord}=req.body;
 let user=await User.findOne({emailId:emailId})
  if(!user){
   return  res.status(401).send("invalid credentials")
  }
  let isvalidpassword=await bcrypt.compare(passWord, user.passWord)
  if(!isvalidpassword){
   return  res.status(401).send("invalid credentials")
  }

   res.send("login sucess")

  }
  catch(err){
    res.send(err.message)
  }

 
})

app.post("/signUp",async(req,res)=>{
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
app.delete("/delete",async(req,res)=>{
 let userid=req.body.userId;
 console.log(userid)
let user= await User.findByIdAndDelete(userid)
 res.send("suceessfully deleted")

})
app.patch("/update/:userId",async(req,res)=>{
  let userid=req.params.userId
  let data=req.body
  
   try{
    let AllowedUpdates=["firstName","lastName","age","gender","photoUrl","about","passWord"]
  let isallowUpdates=Object.keys(data).every((k)=>{
     return  AllowedUpdates.includes(k)
  })
 
  if(!isallowUpdates){
     throw new Error("You can only update allowed fields")
  }

  

  let user=await User.findByIdAndUpdate({_id:userid},data,
    {runValidators:true}
  );
  res.send("updated suceesfully");
 }
 catch(err){
   res.status(400).send(err.message)
 }

  

})



connectDb().then(()=>{
 console.log("sucessfully connected to database")
 app.listen(3000,()=>{
console.log("successfully connected to server")

})


}).catch((err)=>{
  console.error(err.message)

})





