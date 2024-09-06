import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js"
import userRoute from "./routes/user.js"
import doctorRoute from "./routes/Doctor.js"
import reviewRoute from "./routes/review.js"
import bookingRoute from "./routes/booking.js"

dotenv.config();

const app = express();

const port  = process.env.PORT || 8000;

const corsOptions = {
    origin:true

}

app.get('/',(req,res)=>{
    res.send("api is working");
})

//database

mongoose.set('strictQuery',false)
const connectDB = async()=>{
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected");
    } catch (error) {
        console.log("Connection errorin database")
    }
}

//middle ware

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions));
app.use('/api/auth',authRoute);  
app.use('/api/users',userRoute);  
app.use('/api/doctors',doctorRoute);  
app.use('/api/reviews',reviewRoute);
app.use('/api/bookings',bookingRoute);

app.listen(port , () =>{
    connectDB();
    console.log("Server is running on port " +port)
})