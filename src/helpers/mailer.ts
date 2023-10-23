import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';


export const sendEmail =async ({email, emailType, userId}: any) => {
    try {
        const hashedToken = bcryptjs.hash(userId.toString(), 10);
        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {verifyToken: hashedToken, verfyTokenExpiry: Date.now() + 3600000});
        } else if(emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {forgotPasswordToken  : hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000});
        }
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "${process.env.NODEMAILER_USER}",
              pass: "${process.env.NODEMAILER_PASS}"
            }

        const mailOptions = {
            from: 'aksty236@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset Your Password",
            html: <p>Click <a href=</p>
        }
          });
    } catch (error:any) {
        throw new Error(error.message);
    }
}