// // backend_new/src/routes/paymentRoutes.js
// import express from 'express';
// import { createPayment } from '../controllers/paymentController.js';

// const router = express.Router();

// router.post('/', createPayment);

// export default router;

import express from 'express';
const router = express.Router();
// Dummy payment endpoint
router.post('/', (req, res) => {
    res.send('Dummy payment endpoint');
});
export default router;