// // backend_new/src/controllers/paymentController.js
// import Razorpay from 'razorpay';
// import shortid from 'shortid';
// import dotenv from 'dotenv';

// dotenv.config();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Create a new payment order
// export const createPayment = async (req, res) => {
//   try {
//     const payment_capture = 1;
//     const amount = req.body.params.price;
//     const currency = 'INR';
    
//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt: shortid.generate(),
//       payment_capture,
//     };

//     const response = await razorpay.orders.create(options);
    
//     res.json({
//       id: response.id,
//       currency: response.currency,
//       amount: response.amount,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message });
//   }
// };
