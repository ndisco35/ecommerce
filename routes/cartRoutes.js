import express from 'express';
import {getCart,addToCart,updateCartItem,removeFromCart} from '../controllers/cartController.js';
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();


//add item to cart
router.post('/add', protect,addToCart);
//upadte
router.post('/update',protect, updateCartItem);
//delete item
router.post('/remove',protect, removeFromCart);
//gets cart
router.get('/', protect,getCart);

export default router;
