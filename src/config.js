export const FIREBASE_API = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
export const TWILIO_API = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  MessagingServiceSid: process.env.TWILIO_MESSAGING_ACCOUNT_SID,
  url: process.env.TWILIO_MESSAGING_URL,
};
export const EMAILJS_API = {
  serviceId: process.env.EMAIL_JS_SERVICE_ID,
  templateId: process.env.EMAIL_JS_TEMPLATE_ID,
  publicKey: process.env.EMAIL_JS_PUBLIC_KEY,
};
