import emailjs from "emailjs";
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export function handleSms({ values }) {
  client.messages
    .create({
      to: values[0],
      body: values[1],
    })
    .then((message) => console.log(message.sid))
    .done();
}

export function handEmail({ values }) {
  emailjs
    .send(
      process.env.EMAIL_JS_SERVICE_ID,
      process.env.EMAIL_JS_TEMPLATE_ID,
      { name: values[0], email: values[1], subject: values[2], message: values[3] },
      process.env.EMAIL_JS_PUBLIC_KEY
    )
    .then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
      },
      (error) => {
        console.log("FAILED...", error);
      }
    );
}
