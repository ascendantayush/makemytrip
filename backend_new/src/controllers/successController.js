// // backend_new/src/controllers/successController.js
// import Success from '../models/Success.js';
// import User from '../models/User.js';
// import transporter from '../config/mailer.js';

// // Create a new success record and send email
// export const createSuccess = async (req, res) => {
//   try {
//     const { user: userId, razorpay_order_id } = req.body;
    
//     const success = await Success.create(req.body);
//     const user = await User.find({ _id: userId });
    
//     if (!user.length) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     // Send confirmation email
//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM || 'noreply@example.com',
//       to: user[0].email,
//       subject: `Hello ${user[0].name}, we confirm your booking`,
//       text: `Welcome to our flight booking service. This is your order ID: ${razorpay_order_id}`,
//       html: `
//         <h1>Booking Confirmation</h1>
//         <p>Welcome to our flight booking service, ${user[0].name}!</p>
//         <p>Your booking has been confirmed with order ID: <strong>${razorpay_order_id}</strong></p>
//         <p>Thank you for choosing our service.</p>
//       `
//     });
    
//     return res.status(201).json({ success });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };