let express=require("express");
let app=express();

app.use("/te",(req,res)=>{
  res.send("home sriram siri")

})

app.use("/home",(req,res)=>{
 res.send("hello hello")

})
app.use("/test",(req,res)=>{
  res.send("test page here")

})

app.listen(3000,()=>{
    console.log("successfully connected to server")

})




