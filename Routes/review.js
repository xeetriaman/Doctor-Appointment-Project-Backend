import express from "express"
import { getALlReviews,createReview } from "../Controllers/reviewController.js"
import { authenticate ,restrict} from "../auth/verifyToken.js"
const router=express.Router({mergeParams:true})
router.route('/').get(getALlReviews).post(authenticate,restrict(['patient']),createReview)

export default router;
