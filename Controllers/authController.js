import User from "../models/UserSchema.js"
import Doctor from "../models/DoctorSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const generateToken= user =>{
    return jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{
        expiresIn:'30d',
    })
}
export const register=async(req,res)=>{
    const{email,password,name,role,photo,gender}=req.body
    try{
        let user=null
        if(role==='patient'){
            user=await User.findOne({email})
        }
        else if (role==='doctor'){
            user=await Doctor.findOne({email})
        }

        if(user){
            return res.status(400).json({message:'user already exist'})
        }

        const salt= await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,salt)

        if(role==='patient'){
            user= new User ({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role,
            })
        }

        if(role==='doctor'){
            user= new Doctor ({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role,
            })
        }
        await user.save()
        res.status(200).json({sucess:true, message:'User sucessfully created'})
    }catch(err){
        res.status(500).json({sucess:false,message:'Internal Server error,Try again'})
    }
};

export const login = async (req, res) => {
    const { email } = req.body;

    try {
        console.log("Email:", email); // Log the email extracted from the request body

        let user = null;
        const patient = await User.findOne({ email });
        console.log("Patient:", patient); // Log the retrieved patient object

        const doctor = await Doctor.findOne({ email });
        console.log("Doctor:", doctor); // Log the retrieved doctor object

        if (patient) {
            user = patient;
        } else if (doctor) {
            user = doctor;
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        console.log("isPasswordMatch:", isPasswordMatch); // Log the result of password comparison

        if (!isPasswordMatch) {
            return res.status(400).json({ status: false, message: "Invalid Credentials" });
        }

        const token = generateToken(user);

        // Destructuring to remove sensitive data
        const { password, role, appointments, ...rest } = user._doc;

        res.status(200).json({
            status: true,
            message: "Successfully Logged In",
            token,
            data: { ...rest },
            role,
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ status: false, message: "Failed to login" });
    }
};