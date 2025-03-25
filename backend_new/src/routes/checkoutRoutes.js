// backend_new/src/routes/checkoutRoutes.js
import express from 'express';
import { createCheckout, getCheckoutByUser } from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/', createCheckout);
router.get('/:name', getCheckoutByUser);

export default router;