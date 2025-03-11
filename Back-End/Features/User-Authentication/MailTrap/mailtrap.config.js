import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

export const client = new MailtrapClient({
  token: TOKEN,
  endpoint: ENDPOINT,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "skill forge",
};

// const recipients = [
//   {
//     email: "lakshanchanaka34@gmail.com",
//   }
// ];




const TOKEN1 = "73e44381fbe97ea98b89013289941fe9";
