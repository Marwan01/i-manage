import emailjs from "@emailjs/browser";
import swal from "sweetalert";
// const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// export function handleSms(values) {
//   client.messages
//     .create({
//       to: values.phone,
//       body: values.name,
//     })
//     .then((message) => console.log(message.sid))
//     .done();
// }

export function handEmail(values) {
  emailjs
    .send(
      "service_iphkhk4",
      "template_2aom70r",
      { name: values.name, to_email: values.email, subject: values.name, message: values.name },
      "i8JdAcjo8E2UlXtz1"
    )
    .then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        swal("Sent!", "Email sent to volunteer.", "success", {
          button: "ok",
        });
      },
      (error) => {
        console.log("FAILED...", error);
      }
    );
}
