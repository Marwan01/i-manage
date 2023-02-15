import emailjs from "@emailjs/browser";
import swal from "sweetalert";
import { TWILIO_API, EMAILJS_API } from "../config";

export function handleSms(message) {
  const auth =
    "Basic " + new Buffer(TWILIO_API.accountSid + ":" + TWILIO_API.authToken).toString("base64");

  const details = {
    To: message.phone,
    From: "+18337991342",
    MessagingServiceSid: TWILIO_API.MessagingServiceSid,
    Body: `Dear ${message.name}. You have been signed up for ${message.opp_name} in ${message.opp_location}, at ${message.opp_date}.`,
  };

  const formBody = [];
  for (var property in details) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  const body = formBody.join("&");

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Authorization: auth,
    },
    body,
  };

  return new Promise((resolve, reject) => {
    fetch(TWILIO_API.url, options)
      .then((response) => {
        resolve(response);
      })
      .then((responseJson) => {
        resolve(responseJson);
        swal("Sent!", "SMS sent to volunteer.", "success", {
          button: "ok",
        });
      })
      .catch((error) => reject(error));
  });
}
export function handEmail(values) {
  emailjs
    .send(
      EMAILJS_API.serviceId,
      EMAILJS_API.templateId,
      {
        to_name: values.name,
        to_email: values.email,
        opp_location: values.opp_location,
        opp_name: values.opp_name,
        opp_date: values.opp_date,
      },
      EMAILJS_API.publicKey
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
