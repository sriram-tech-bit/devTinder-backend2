let express=require("express");
let app=express();

const {adminauth}=require('./middlewares/adminauth')
app.use("/admin",adminauth)
  


app.get("/admingetdata",(req,res)=>{
     res.send("sgotdata")
})
app.get("/admindeletedata",(req,res)=>{
 res.send("sdeletedata")


})

app.listen(3000,()=>{
    console.log("successfully connected to server")

})




