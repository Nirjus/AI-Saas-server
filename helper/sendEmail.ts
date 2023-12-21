import nodeMailer from "nodemailer";
import { smtpPassword, smtpUserName } from "../secret/secret";

interface EmailOptions{
    email: string;
    subject: string;
    html: string;
}

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: smtpUserName,
      pass: smtpPassword,
    },
  });
    // send mail with defined transport object

    export const senEmail = async (emailData:EmailOptions) => {
   try {
    const info = await transporter.sendMail({
      from: smtpUserName,
      to: emailData.email,
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    });
    console.log("Message sent: %s", info.response);
   } catch (error) {
        console.log(error);
        throw error;
   }
  }