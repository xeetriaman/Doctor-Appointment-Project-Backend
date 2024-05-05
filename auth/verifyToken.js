import jwt from "jsonwebtoken"
import Doctor from "../models/DoctorSchema.js"
import User from "../models/UserSchema.js"

export const authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization;
    console.log("authToken:", authToken);
  
    if (!authToken || !authToken.startsWith('Bearer')) {
      return res.status(401).json({ success: false, message: 'No token authorization denied' });
      //return next();
    }
  
    try {
      const token = authToken.split(" ")[1];
      console.log("token:", token);
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("decoded:", decoded);
  
      // Assign the userId and role from the decoded token to the request object
      req.userId = decoded.id; // Use decoded.id instead of decoded.userId
      req.role = decoded.role;
  
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token is expired' });
      }
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }
  };

  export const restrict = roles => async (req, res, next) => {
    const userId = req.userId;
    console.log("User ID from request:", userId); // Log the userId from the request
  
    let user;
    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);
  
    console.log("Patient:", patient); // Log the retrieved patient
    console.log("Doctor:", doctor); // Log the retrieved doctor
  
    if (patient) {
      user = patient;
    } else if (doctor) {
      user = doctor;
    }
  
    console.log("User:", user); // Log the user object
  
    if (!user || !user.role) {
      console.error("User or role is undefined."); // Log error message
      return res.status(401).json({ success: false, message: "You are not not authorized" });
    }
  
    if (!roles.includes(user.role)) {
      console.error("User role is not authorized."); // Log error message
      return res.status(401).json({ success: false, message: "You are not authorized" });
    }
  
    next();
  };
