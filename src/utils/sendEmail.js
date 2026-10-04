const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({ region: "ap-southeast-2" });

async function sendEmail(to, subject, body) {
  const command = new SendEmailCommand({
    Source: "sriramulu.sriram33@gmail.com",
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } },
    },
  });
  return ses.send(command);
}

module.exports = sendEmail;