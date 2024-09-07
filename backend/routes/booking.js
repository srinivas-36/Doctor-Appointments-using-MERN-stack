import express from 'express'
import { authenticate } from "../auth/verifyToken.js";
// import { getCheckoutSession , handleSuccessfulPayment} from '../controllers/bookingController.js';
import { getCheckoutSession } from '../controllers/bookingController.js';


const router = express.Router()

router.post('/checkout-success/:doctorId',authenticate,getCheckoutSession)
// router.post('/payment-success', handleSuccessfulPayment)

export default router