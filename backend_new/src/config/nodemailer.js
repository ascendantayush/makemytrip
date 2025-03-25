import nodemailer from "nodemailer";

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Use "gmail" or any other service (e.g., Outlook, Yahoo, etc.)
  auth: {
    // user: "ac181dd98a8aad" , // Your email address
    user : "streetguadian@gmail.com",
    pass:"smdyvyytnokagveg" , // Your email password or app-specific password
  },
});

// Function to send OTP email
export const sendOtpEmail = async (email, otp, name) => {
  try {
    const mailOptions = {
      from: "streetguadian@gmail.com", // Sender address
      to: email, // Recipient email
      subject: "Your OTP for Account Verification", // Subject line
      html: `
        <h3>Dear ${name},</h3>
        <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
        <h2 style="color: #4CAF50;">${otp}</h2>
        <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>Sky Quest</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};
