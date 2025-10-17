import express from 'express';
import {placeOrder,getMyOrders,getAllOrders,updateOrderStatus} from '../controllers/orderController.js';
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

//router for orders
router.post('/',protect, placeOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/myorders/:id', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.put('/:id', protect,admin, updateOrderStatus);
export default router;
