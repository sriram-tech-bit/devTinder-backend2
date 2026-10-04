let express = require("express")
let authRouter = express.Router()
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")
let User = require("../model/User")
let userAuth = require("../middlewares/adminauth")
const sendEmail = require("../utils/sendEmail")

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, passWord } = req.body;
    let user = await User.findOne({ emailId: emailId })

    if (!user) {
      return res.status(401).send("invalid credentials")
    }
    let isvalidpassword = await user.validatePassWord(passWord)

    if (!isvalidpassword) {
      return res.status(401).send("invalid credentials")
    }
    else {
      let token = user.getJwt()

      res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })

      sendEmail(
        user.emailId,
        "New login to DevTinder",
        `Hi ${user.firstName}, you just logged in to DevTinder.`
      ).catch((err) => console.error("Login email failed:", err.message))

      res.send(user)
    }
  }
  catch (err) {
    res.send(err.message)
  }
})

authRouter.post("/signUp", async (req, res) => {
  const { firstName, lastName, emailId, passWord, gender } = req.body;
  let passWordHash = await bcrypt.hash(passWord, 10);
  let userInstance = new User({
    firstName,
    lastName,
    emailId,
    passWord: passWordHash,
    gender
  })
  try {
    let savedUser = await userInstance.save();
    let token = savedUser.getJwt()

    res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })

    sendEmail(
      savedUser.emailId,
      "Welcome to DevTinder",
      `Hi ${savedUser.firstName}, welcome to DevTinder! Start connecting with developers today.`
    ).catch((err) => console.error("Welcome email failed:", err.message))

    res.send(userInstance);
  }
  catch (err) {
    res.status(400).send(err.message)
  }
})

authRouter.post("/logOut", async (req, res) => {
  try {
    res.clearCookie("token", { expires: new Date(Date.now()) })
    res.send("successfully logOut!!!!!!!!!")
  }
  catch (err) {
    res.send(err.message)
  }
})

module.exports = authRouter