let express=require("express");
let app=express();
let cookieparser=require("cookie-parser")
const {connectDb}=require("./config/database")

app.use(express.json());
app.use(cookieparser())
let authRouter=require("./routes/auth")
let profileRouter=require("./routes/profile")
let ConnectionRouter=require("./routes/request")
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",ConnectionRouter);


connectDb().then(()=>{
 console.log("sucessfully connected to database")
 app.listen(3000,()=>{
console.log("successfully connected to server")

})


}).catch((err)=>{
  console.error(err.message)

})





