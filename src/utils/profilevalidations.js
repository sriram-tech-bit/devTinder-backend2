let updateProfileValidation=(req,res)=>{
try{
let allowedUpdates=["firstName","lastName","age","about","photoUrl","gender"]
let isallowedupdates=Object.keys(req.body).every((k)=>{
return allowedUpdates.includes(k);
})
return isallowedupdates;
}
catch(err){
    res.send(err.message)
}
}

module.exports=updateProfileValidation