let express=require("express");
let app=express();
let cookieparser=require("cookie-parser")
const {connectDb}=require("./config/database")
let cors=require("cors")
app.use(express.json());
app.use(cookieparser())
require('dotenv').config()
app.use(cors({
origin:"http://localhost:5173",
credentials:true

}))
let authRouter=require("./routes/auth")
let profileRouter=require("./routes/profile")
let ConnectionRouter=require("./routes/request")
let userRouter=require("./routes/user")
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",ConnectionRouter);
app.use("/",userRouter)


connectDb().then(()=>{
 console.log("sucessfully connected to database")
 app.listen(3000,()=>{
console.log("successfully connected to server")

})


}).catch((err)=>{
  console.error(err.message)

})





