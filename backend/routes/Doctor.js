import { deleteDoctor, updateDoctor, getAllDoctor, getSingleDoctor, getDoctorProfile } from "../controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from './review.js'
import express from "express"

const router = express.Router();

router.use("/:doctorId/reviews", reviewRouter);

router.get('/:id', authenticate, restrict(['patient','doctor']), getSingleDoctor)

router.delete('/:id', restrict(['doctor']), deleteDoctor)

router.put('/:id', authenticate, restrict(['doctor']), updateDoctor)

router.get('/', getAllDoctor)

router.get('/profile/me',authenticate,restrict(['doctor']),getDoctorProfile)

export default router;