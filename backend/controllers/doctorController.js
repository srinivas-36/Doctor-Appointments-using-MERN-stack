import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";



export const updateDoctor = async(req,res)=>{
    const id = req.params.id;
    try {
        
        const updatedDoctor = await Doctor.findByIdAndUpdate(id,{$set:req.body} , {new:true}).select("-password")

        res.status(200).json({success:true , message:"Successfully Updated", data:updatedDoctor})
        } catch (error) {
        res.status(500).json({success:false , message:"Failed to Update Doctor"})
        
    }
}

export const getSingleDoctor = async (req, res) => {
    const id = req.params.id;
    try {
      const doctor = await Doctor.findById(id).populate("reviews").select("-password");
      if (doctor) {
        res.status(200).json({ success: true, message: "Doctor Found Successfully", data: doctor });
      } else {
        res.status(404).json({ success: false, message: "No Doctor Found" });
      }
    } catch (error) {
        console.log(error.message)
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

export const getAllDoctor = async(req,res)=>{


    // const id = req.params.id;
    try {
        const {query } = req.query;
        let doctors ;
        if(query){
            doctors = await Doctor.find({isApproved : 'approved',
                $or:[{ name: { $regex : query , $options : "i"}} , {specialization : { $regex : query , $options : "i"}}]
            }).select("-password")
        }
        else{
            doctors = await Doctor.find({ isApproved:"approved" }).select("-password")

        }


        res.status(200).json({success:true , message:"Doctors Found Successfully", data:doctors})
        } catch (error) {
        res.status(500).json({success:false , message:"No Doctor Found"})
        
    }
}


export const deleteDoctor = async(req,res)=>{
    const id = req.params.id;
    try {
        
       await Doctor.findByIdAndDelete(id)

        res.status(200).json({success:true , message:"Successfully Deleted Doctor"})
        } catch (error) {
        res.status(500).json({success:false , message:"Failed to Delete Doctor"})
        
    }
}

export const getDoctorProfile = async(req , res) =>{
  const doctorId = req.userId
  try {
    const doctor = await Doctor.findById(doctorId)
    if(!doctor){
      return res.status(404).json({success:false, message:"Doctor not found"})
    }
    const {password, ...rest} = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId })
    .populate({
      path: 'user',
      select: 'name email gender photo'
    })
    .select('ticketPrice isPaid createdAt');

    res.status(200).json({ success: true , message:'Getting profile info', data:{ ...rest,appointments},})
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ success: false, message: "Something went Wrong, cannot get"})
  }
}