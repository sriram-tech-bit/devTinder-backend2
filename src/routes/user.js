let express=require("express");
const userAuth = require("../middlewares/adminauth");
let userRouter=express.Router();
let ConnectionRequestModel=require("../model/ConnectionRequest")
let User=require("../model/User")
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
try{
let loggedInUser=req.user._id;
 let ConnectionsReceived= await ConnectionRequestModel.find({
    toUserId:loggedInUser,
    status:"intrested"
 }).populate("fromUserId","firstName lastName age gender about photoUrl");
 
  res.json({data:ConnectionsReceived});


}
catch(err){
res.status(400).send(err.message)

}
 })

userRouter.get("/user/connections",userAuth,async(req,res)=>{
try{
let loggedInUser=req.user._id;
 let Connections=await ConnectionRequestModel.find({
 $or:[
   {toUserId:loggedInUser,status:"accepted"},
   {fromUserId:loggedInUser,status:"accepted"}
 ]
 }
).
populate("fromUserId","firstName lastName gender photoUrl").populate("toUserId","firstName lastName,age gender photoUrl")

let connections=Connections.map((row)=>{
    if(row.fromUserId._id.equals(loggedInUser._id)){
        return row.toUserId
    }
    return row.fromUserId;
})
res.json({data:connections})

}
 catch(err){
    res.status(400).send(err.message)
 }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
try{
let page=parseInt(req.query.page)||1
let limit=parseInt(req.query.limit)||10
limit=limit>50?50:limit;
let skip=(page-1)*limit;

let loggedInUser=req.user._id;
let users=await ConnectionRequestModel.find({
 $or:[
    {fromUserId:loggedInUser},{toUserId:loggedInUser}
 ]     
})
let hideusers=new Set()
users.forEach((k)=>{
  hideusers.add(k.fromUserId.toString()) ,
  hideusers.add(k.toUserId.toString())
})
let feedUsers= await User.find({
$and:[
 {_id:{$nin:Array.from(hideusers)}},
 {_id:{$ne:loggedInUser}}
]
}).select("firstName lastName age photoUrl about gender").skip(skip).limit(limit)
res.json({data:feedUsers})

}
catch(err){
    res.status(400).send(err.message)
}
})

module.exports=userRouter   




