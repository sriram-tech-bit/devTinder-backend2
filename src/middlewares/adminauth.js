let adminauth=(req,res,next)=>{
let token="srirram";
if(token!=="sriram"){
 res.status(401).send("unauthorized")
}
else{
    next();
  
}




}

module.exports={
    adminauth
}