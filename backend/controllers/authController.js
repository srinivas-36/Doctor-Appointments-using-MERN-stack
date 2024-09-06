import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (user)=>{
  return jwt.sign({id:user._id , role : user.role}, process.env.JWT_SECRET_KEY , {
    expiresIn:'15d',
  })
}

export const register = async (req, res) => {
  const { name, email, password, confirmPassword, role, photo, gender } = req.body;

  try {
    let user = null;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    if (role === 'patient') {
      user = await User.findOne({ email });
    } else if (role === 'doctor') {
      user = await Doctor.findOne({ email });
    }

    // Check if user exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if passwords match
   

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    if (role === 'patient') {
      user = new User({ name, email, password: hashPassword, role, gender, photo });
    } else if (role === 'doctor') {
      // Pass the fullName as the name field for the Doctor model
      user = new Doctor({ name, email, password: hashPassword, role, gender, photo });
    }

    await user.save();
    res.status(200).json({ success: true, message: "User successfully created" });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ success: false, message: "Internal server error, try again" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = null;
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    } else if (doctor) {
      user = doctor;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

   
    const token = generateToken(user);

    // Check if the user is a patient or a doctor
    if (user instanceof User) {
      const { password: _, role, appointments, ...rest } = user._doc;
      res.status(200).json({
        status: true,
        message: "Successfully Login",
        token,
        data: { ...rest },
        role,
      });
    } else if (user instanceof Doctor) {
      const { password: _, role, ...rest } = user._doc;
      res.status(200).json({
        status: true,
        message: "Successfully Login",
        token,
        data: { ...rest },
        role,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Failed to login" });
  }
};