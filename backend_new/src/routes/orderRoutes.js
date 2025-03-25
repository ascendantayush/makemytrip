// backend_new/src/routes/orderRoutes.js
import express from 'express';
import { createOrder, getOrdersByUser } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/:name', getOrdersByUser);

export default router;