import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Code de vérification",
    text: `Votre code de vérification est: ${code}`,
  };
  await transporter.sendMail(mailOptions);
};

export const sendResetPassword = async (to, lien) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Réinitialisation du mot de passe",
    html: `<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien :</p>
           <a href="${lien}">${lien}</a>`,
  };
  await transporter.sendMail(mailOptions);
};
