import User from "../models/UserSchema.js"
import Doctor from "../models/DoctorSchema.js"
import Booking from "../models/BookingSchema.js"
import Stripe from "stripe"

export const getCheckoutSession = async(req,res)=>{
    try {
        // get current booked doc

        const doctor = await Doctor.findById(req.params.doctorId)
        const user = await User.findById(req.userId)

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

        //stripe session

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            success_url:`${process.env.CLIENT_SITE_URL}/checkout-success`,
            cancel_url:`${req.protocol}://${req.get('host')}/doctors/${doctor.id}`,
            customer_email:user.email,
            client_reference_id:req.params.doctorId,
            line_items:[{
                price_data:{
                    currency:'usd',
                    unit_amount:doctor.ticketPrice*100,
                    product_data:{
                        name:doctor.name,
                        description:doctor.bio,
                        images:[doctor.photo]
                    }
                },
                quantity:1
            }]

        })

        //create new booking

        const booking = new Booking({
            doctor:doctor._id,
            user:user._id,
            ticketPrice:doctor.ticketPrice,
            session:session.id
        })

        await booking.save()

        doctor.appointments.push(booking._id);
        await doctor.save();
        
        res.status(200).json({success:true,message:'Suceessfully paid',session})
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false,message:"Error creating check out session"})
    }
}

// export const handleSuccessfulPayment = async (req, res) => {
//     try {
//         const { session_id } = req.body;

//         // Find the booking
//         const booking = await Booking.findOne({ session: session_id });
//         if (!booking) {
//             return res.status(404).json({ success: false, message: "Booking not found" });
//         }

//         // Update booking status
//         booking.isPaid = true;
//         booking.status = "approved";
//         await booking.save();
//         console.log('Booking updated:', booking._id);

//         // Update doctor's appointments
//         const doctor = await Doctor.findById(booking.doctor);
//         if (!doctor) {
//             console.log('Doctor not found for booking:', booking._id);
//             return res.status(404).json({ success: false, message: "Doctor not found" });
//         }

//         if (!doctor.appointments.includes(booking._id)) {
//             doctor.appointments.push(booking._id);
//             await doctor.save();
//             console.log('Doctor appointments updated:', doctor._id);
//         } else {
//             console.log('Booking already in doctor appointments:', booking._id);
//         }

//         res.status(200).json({ success: true, message: "Payment successful and booking updated" });
//     } catch (err) {
//         console.error('Error in handleSuccessfulPayment:', err);
//         res.status(500).json({ success: false, message: "Error handling successful payment" });
//     }
// }