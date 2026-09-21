let express=require("express");
let app=express();
const {connectDb}=require("./config/database")
let User=require("./model/User")
app.post("/signUp",async(req,res)=>{

   let userInstance=new User({
      firstName:"siri",
      lastName:"chintalapalli",
      age:23,
      Gender:"FeMale"

})
   try{
    await userInstance.save();
   res.send("sucessfully signUp");
   }
   catch(err){
     res.send(err.message)
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





