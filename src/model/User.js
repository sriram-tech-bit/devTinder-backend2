let mongoose=require("mongoose")
let validator=require("validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let userSchema=mongoose.Schema({
firstName:{
    type:String,
    required:true,
    minLength:4,
    maxLength:50,
    validate(value){
      let isvalidFirstName=validator.isAlpha(value)
      if(!isvalidFirstName){
        throw new Error("FirstName should be only letters")
      }
    }

},
lastName:{
    type:String,
    validate(value){
      let isvalidlastName=validator.isAlpha(value)
      if(!isvalidlastName){
        throw new Error("lastName should be only letters")
      }
    }

},
emailId:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    validate(value){
      let isValidEmail=validator.isEmail(value)
      if(!isValidEmail){
         throw new Error("invalid email address"+value)
      } 
    }

},
age:{
    type:Number,
    min:18,
    max:100
},
passWord:{
  type:String,
  required:true,
  validate(value){
   let isvalidpassword=validator.isStrongPassword(value);
   if(!isvalidpassword){
    throw new Error("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol")
   }

  }

  

},
about:{
    type:String,
    trim:true,
    default:"This is the about the user"
},
photoUrl:{
    type:String,
    default:"https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
},


gender:{
    type:String,
    required:true,
    lowercase:true,
    validate(value){
    if(!["male","female","others"].includes(value)){
         throw new Error("gender data is not valid")
          
    }

    }
}









},{ timestamps: true })

userSchema.methods.getJwt=function(){
let user=this
let token=jwt.sign({_id:user._id},"devTinder2@1234",{ expiresIn: '1h' }) 
return token 

}
userSchema.methods.validatePassWord=async function(passWord){
    let user=this;
return await bcrypt.compare(passWord, user.passWord)
}
 

module.exports=mongoose.model("User",userSchema);
