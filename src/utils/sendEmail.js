const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendEmail=async(to,subject,text,html)=>{
try {
  const info = await transporter.sendMail({
    from: `"devTinder" ${process.env.EMAIL_USER}`, 
    to,
    subject, 
    text,
    html:html|| `<p>${text}</p>`
  })
 
}
  
 catch (err) {
  console.error("Error while sending mail:", err);
}
}
module.exports={sendEmail}