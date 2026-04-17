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

    export const sendEmail = async ({ from ,to, subject, html,replyTo }) => {
    try {
    

        const info = await transporter.sendMail({
        from:`Admin ${process.env.EMAIL_USER}`,
        to,
        subject,
        html,
        replyTo,
        });

    } catch (error) {
        console.error("❌ Email error:", error.message);
    }
    };

    export default transporter;