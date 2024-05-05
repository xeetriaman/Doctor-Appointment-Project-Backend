import Review from "../models/ReviewSchema.js"
import Doctor from "../models/DoctorSchema.js"

export const getALlReviews=async(req,res)=>{
    try{
        const review=await Review.find({})
        res.status(200).json({sucess:true,message:"Sucessful",data:review})

    }catch(err){
        res.status(404).json({sucess:false,message:"Not Found"})

    }
}


export const createReview=async(req,res)=>{
    if(!req.body.doctor) req.body.doctor=req.params.doctorId
    if(!req.body.user) req.body.user=req.params.userId

    const newReview =new Review(req.body)
    try{
        const savedReview=await newReview.save()
        await Doctor.findByIdAndUpdate(req.body.doctor,{
            $push:{reviews: savedReview._id},
        });
        res.status(200).json({sucess:true,message:"Review submitted",data:savedReview});
    }catch(err){
        res.status(500).json({sucess:false,message:err.message})
    }
}