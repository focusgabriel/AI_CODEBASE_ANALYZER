import apiInstance from "../../config/brevo.js";
import resetPasswordTemplate from "./templates/passwordResetTemplate.js";

// export const sendResetPasswordEmail = async (
//   email: string,
//   resetLink: string
// ) => {
//   await transporter.sendMail({
//     from: `"Trackio" <${process.env.MAIL_USER}>`,
//     to: email,
//     subject: "Reset your Trackio password",
//     html: passwordResetTemplate(resetLink),
//   });
// };



export const sendResetPasswordEmail = async (
  email: string,
  resetLink: string,
  newUser:string
) => {
  await apiInstance.sendTransacEmail({
    sender: {
      name: "PlainSight",
      email: "charlesuchendu750@gmail.com",
      
    },
    to: [{ email }],
    subject: "Reset your PlainSight Password",
    htmlContent: resetPasswordTemplate(resetLink, newUser),
  });
};