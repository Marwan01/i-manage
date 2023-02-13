import emailjs from "@emailjs/browser";
import swal from "sweetalert";
import { TWILIO_API } from "../config";

export function handleSms(message) {
  const url =
    "https://api.twilio.com/2010-04-01/Accounts/ACfede599b58a3a6751098156dbc0a9632/Messages.json";

  const auth =
    "Basic " + new Buffer(TWILIO_API.accountSid + ":" + TWILIO_API.authToken).toString("base64");

  const details = {
    To: message.phone,
    From: "+18337991342",
    MessagingServiceSid: "MG89f9e9aa8f1ddff7b8b2eed8cef7e41f",
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
    fetch(url, options)
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
      "service_iphkhk4",
      "template_2aom70r",
      {
        to_name: values.name,
        to_email: values.email,
        opp_location: values.opp_location,
        opp_name: values.opp_name,
        opp_date: values.opp_date,
      },
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
